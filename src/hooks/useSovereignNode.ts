import { useState, useEffect, useRef } from 'react';

export function useSovereignNode(isActive: boolean = false, onMessageReceived?: (data: any) => void) {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [aiVoiceEnergy, setAiVoiceEnergy] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [offlineAlert, setOfflineAlert] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const nextPlayTimeRef = useRef<number>(0);

  // Initialize WebSocket connection dynamically ONLY when active (handshake success)
  useEffect(() => {
    if (!isActive) {
      console.log("[useSovereignNode] Sovereign link is dormant (awaiting signature verification).");
      setIsConnected(false);
      return;
    }

    console.log("[useSovereignNode] Handshake verified. Engaging high-speed traffic controller socket...");
    const socket = new WebSocket('ws://localhost:8080');
    socketRef.current = socket;

    socket.binaryType = 'arraybuffer';

    socket.onopen = () => {
      console.log("[useSovereignNode] Tunneled socket link engaged.");
      setIsConnected(true);
      setOfflineAlert(false);
    };

    socket.onmessage = (event) => {
      // Downstream routing handler
      if (event.data instanceof ArrayBuffer) {
        // Condition A: Inbound voice bytes (raw Int16 PCM)
        handleInboundAudio(event.data);
      } else {
        // Condition B: UI JSON Commands / Alerts
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.status === 'SOVEREIGN_NODE_OFFLINE') {
            console.warn("[useSovereignNode] Critical: Sovereign node is offline.");
            setOfflineAlert(true);
          }
          if (onMessageReceived) {
            onMessageReceived(parsed);
          }
        } catch {
          // Standard text message acknowledged
        }
      }
    };

    socket.onerror = (err) => {
      console.error("[useSovereignNode] Socket connection error:", err);
      setOfflineAlert(true);
    };

    socket.onclose = () => {
      console.log("[useSovereignNode] Socket link closed.");
      setIsConnected(false);
      setOfflineAlert(true);
    };

    return () => {
      socket.close();
    };
  }, [isActive]);

  // Web Audio API playback queue manager
  const handleInboundAudio = (arrayBuffer: ArrayBuffer) => {
    if (!isActive) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const int16Array = new Int16Array(arrayBuffer);
    if (int16Array.length === 0) return;

    const float32Array = new Float32Array(int16Array.length);
    let sumSquares = 0;
    
    for (let i = 0; i < int16Array.length; i++) {
      const sample = int16Array[i] / 32768.0;
      float32Array[i] = sample;
      sumSquares += sample * sample;
    }

    const rms = Math.sqrt(sumSquares / int16Array.length);
    setAiVoiceEnergy(Math.min(1.0, Math.max(0.0, rms * 3.5)));

    const buffer = audioContext.createBuffer(1, float32Array.length, 16000);
    buffer.getChannelData(0).set(float32Array);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    activeSourcesRef.current.push(source);
    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
    };

    const now = audioContext.currentTime;
    if (nextPlayTimeRef.current < now) {
      nextPlayTimeRef.current = now;
    }

    source.start(nextPlayTimeRef.current);
    nextPlayTimeRef.current += buffer.duration;
  };

  // Upstream microphone streaming downsampler
  const startRecording = async () => {
    if (!isActive || isTransmitting) return;

    // Interruption trigger: Flush playback queue immediately if user speaks
    interruptPlayback();

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    try {
      console.log("[useSovereignNode] Ingesting microphone stream...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const sourceNode = audioContext.createMediaStreamSource(stream);
      const processorNode = audioContext.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processorNode;

      const inputSampleRate = audioContext.sampleRate;

      processorNode.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);
        const downsampledBuffer = downsampleTo16kHzPCM(inputData, inputSampleRate);
        
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(downsampledBuffer);
        }
      };

      sourceNode.connect(processorNode);
      processorNode.connect(audioContext.destination);
      setIsTransmitting(true);
      console.log("[useSovereignNode] Outbound microphone downsampling pipe active.");
    } catch (err) {
      console.error("[useSovereignNode] Access denied or mic connection error:", err);
    }
  };

  const stopRecording = () => {
    if (!isTransmitting) return;

    console.log("[useSovereignNode] Terminating outbound mic downsampler...");
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    setIsTransmitting(false);
  };

  const interruptPlayback = () => {
    if (!isActive) return;

    console.log("[useSovereignNode] [KILL_SWITCH] Dispatching pipeline interrupt to backend...");
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action: 'INTERRUPT' }));
    }

    activeSourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch {
        // Segment already ended
      }
    });
    activeSourcesRef.current = [];
    nextPlayTimeRef.current = 0;
    setAiVoiceEnergy(0);
  };

  const downsampleTo16kHzPCM = (buffer: Float32Array, inputSampleRate: number): ArrayBuffer => {
    const outputSampleRate = 16000;
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Int16Array(newLength);

    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      
      const sample = count > 0 ? accum / count : 0;
      result[offsetResult] = Math.min(1.0, Math.max(-1.0, sample)) * 0x7FFF;
      
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }

    return result.buffer;
  };

  const sendCLICommand = (cmd: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'CLI_COMMAND', command: cmd }));
    } else {
      console.warn("[useSovereignNode] Cannot send command: socket is not open.");
    }
  };

  return {
    isTransmitting,
    aiVoiceEnergy,
    isConnected,
    offlineAlert,
    startRecording,
    stopRecording,
    interruptPlayback,
    sendCLICommand
  };
}
