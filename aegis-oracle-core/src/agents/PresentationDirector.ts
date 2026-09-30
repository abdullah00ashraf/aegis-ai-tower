import { WebSocket } from 'ws';

interface PresentationStep {
  id: string;
  name: string;
  prompt: string;
  visualLog: string;
}

export class PresentationDirector {
  private readonly steps: PresentationStep[] = [
    {
      id: 'SOVEREIGN_AWAKENING',
      name: 'Sovereign Awakening',
      prompt: 'Introduce yourself as the Aegis Sovereign AI Core, explaining your advanced structural analysis and zero-trust telemetry philosophy.',
      visualLog: '[KEYNOTE_DIRECTOR] Step 1: Sovereign Awakening -> Initializing Keynote Core Identity...'
    },
    {
      id: 'LIVE_TELEMETRY',
      name: 'Live Telemetry Ingestion',
      prompt: 'Ingest live telemetry from website https://example.com to evaluate live market variables. Summarize the findings concisely.',
      visualLog: '[KEYNOTE_DIRECTOR] Step 2: Live Telemetry -> Spawning Puppeteer Headless Web Scraper...'
    },
    {
      id: 'GEOSPATIAL_PROJECTION',
      name: 'Geospatial Radar Projection',
      prompt: 'Project structural maps, radar telemetry, and visual coordinate overlays onto Mumbai latitude 19.0760, longitude 72.8777, layer "RADAR" to map regional deeptech infrastructure. Explain your live tracking capabilities.',
      visualLog: '[KEYNOTE_DIRECTOR] Step 3: Geospatial Projection -> Plotting holographic GIS radar overlay...'
    },
    {
      id: 'NEXUS_CONCLUSION',
      name: 'Nexus Conclusion',
      prompt: 'Conclude your keynote. Announce that the secure terminal gateway is now fully unlocked and open for active human-AI collaborative review.',
      visualLog: '[KEYNOTE_DIRECTOR] Step 4: Conclusion -> Opening Secure Gateway for attendee interaction...'
    }
  ];

  private activeKeynote = false;
  private currentStepText = '';
  private inferenceResolve: (() => void) | null = null;

  isKeynoteRunning(): boolean {
    return this.activeKeynote;
  }

  accumulateText(text: string): void {
    this.currentStepText += ' ' + text;
  }

  notifyInferenceComplete(): void {
    if (this.inferenceResolve) {
      this.inferenceResolve();
      this.inferenceResolve = null;
    }
  }

  async startKeynote(clientSocket: WebSocket, pythonSocket: WebSocket): Promise<void> {
    if (this.activeKeynote) {
      console.warn('[KEYNOTE_DIRECTOR] Keynote presentation is already active.');
      return;
    }
    
    this.activeKeynote = true;
    console.log('[KEYNOTE_DIRECTOR] Spawning Autonomous Presentation Director Keynote Sequence...');
    this.sendLog(clientSocket, '==================================================');
    this.sendLog(clientSocket, '[KEYNOTE_DIRECTOR] LAUNCHING AUTONOMOUS PRESENTATION PROTOCOL');
    this.sendLog(clientSocket, '==================================================');

    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      console.log(`\n[KEYNOTE_DIRECTOR] Moving to Step ${i + 1}/${this.steps.length}: ${step.name}`);
      this.sendLog(clientSocket, `\n${step.visualLog}`);

      try {
        this.currentStepText = '';
        
        // Return a promise that resolves when INFERENCE_COMPLETE is captured by SovereignRouter
        const inferencePromise = new Promise<void>((resolve) => {
          this.inferenceResolve = resolve;
        });

        // Forward the step prompt directly to the local Python engine
        if (pythonSocket.readyState === WebSocket.OPEN) {
          pythonSocket.send(JSON.stringify({ type: 'INFERENCE_REQUEST', text: step.prompt }), { binary: false });
        } else {
          throw new Error('Python connection tunnel not open');
        }

        // Await the local GGUF inference complete signal
        await inferencePromise;

        // Estimate duration based on word count to synchronize speech
        const wordCount = this.currentStepText.split(/\s+/).length;
        const speechDurationMs = (wordCount / 2.2) * 1000; // ~130 WPM (2.2 words per second)
        
        // Safety delay padding (minimum 6s, or speech duration + 4s)
        const totalDelayMs = Math.max(6000, speechDurationMs) + 4000;
        
        console.log(`[KEYNOTE_DIRECTOR] Step "${step.id}" complete. Estimated speech duration: ${speechDurationMs.toFixed(0)}ms. Awaiting total handoff duration: ${totalDelayMs}ms...`);
        
        if (i < this.steps.length - 1) {
          this.sendLog(clientSocket, `[KEYNOTE_DIRECTOR] Synchronized timing active. Advancing in ${(totalDelayMs / 1000).toFixed(1)}s...`);
          await this.delay(totalDelayMs);
        }
      } catch (error: any) {
        console.error(`[KEYNOTE_DIRECTOR] ERR during step ${step.id}:`, error.message);
        this.sendLog(clientSocket, `[KEYNOTE_DIRECTOR] ERR: Step ${step.name} failed: ${error.message}`);
        await this.delay(4000); // Small pause on error
      }
    }

    this.activeKeynote = false;
    this.sendLog(clientSocket, '\n==================================================');
    this.sendLog(clientSocket, '[KEYNOTE_DIRECTOR] AUTONOMOUS PRESENTATION COMPLETE. GATEWAY ARMED.');
    this.sendLog(clientSocket, '==================================================');
    console.log('[KEYNOTE_DIRECTOR] Keynote presentation complete.');
  }

  private sendLog(socket: WebSocket, log: string): void {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'VISUAL_LOG', log }), { binary: false });
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
