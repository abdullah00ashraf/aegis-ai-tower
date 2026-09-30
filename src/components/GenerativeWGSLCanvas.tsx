// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';

interface GenerativeWGSLCanvasProps {
  wgslCode: string;
  onError?: (errMessage: string) => void;
}

const DEFAULT_FRAGMENT_SHADER = `
struct Uniforms {
  time: f32,
  resolution: vec2f,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  // High-performance dynamic cyber-grid baseline
  let center = uv - vec2f(0.5);
  let dist = length(center);
  
  let grid = sin(uv.x * 60.0 + uniforms.time * 2.0) * sin(uv.y * 60.0 + uniforms.time * 2.0);
  let gridVal = smoothstep(0.8, 0.98, grid);
  
  let glow = 0.05 / (dist + 0.1) * (1.0 + sin(uniforms.time * 3.0) * 0.25);
  
  let r = abs(sin(uniforms.time + dist * 10.0));
  let g = abs(cos(uniforms.time + dist * 10.0)) * 0.5 + 0.2;
  let b = abs(sin(uniforms.time * 1.5)) * 0.8 + 0.2;
  
  let finalColor = vec3f(r, g, b) * (gridVal + glow);
  return vec4f(finalColor, 0.9);
}
`;

const VERTEX_SHADER = `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2f, 6>(
    vec2f(-1.0, -1.0),
    vec2f( 1.0, -1.0),
    vec2f(-1.0,  1.0),
    vec2f(-1.0,  1.0),
    vec2f( 1.0, -1.0),
    vec2f( 1.0,  1.0)
  );
  var out: VertexOutput;
  out.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  out.uv = pos[vertexIndex] * 0.5 + 0.5;
  return out;
}
`;

export default function GenerativeWGSLCanvas({ wgslCode, onError }: GenerativeWGSLCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gpuError, setGpuError] = useState<string | null>(null);
  const [webGpuSupported, setWebGpuSupported] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.gpu) {
      setWebGpuSupported(false);
      setGpuError("WebGPU is not supported by this browser. Engage a modern WebGPU-compatible browser.");
      if (onError) onError("WebGPU is not supported.");
      return;
    }

    let animationFrameId: number;
    let device: GPUDevice | null = null;
    let context: GPUCanvasContext | null = null;
    let renderPipeline: GPURenderPipeline | null = null;
    let uniformBuffer: GPUBuffer | null = null;
    let bindGroup: GPUBindGroup | null = null;

    const initWebGPU = async () => {
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
          throw new Error("No appropriate GPU adapter found.");
        }

        device = await adapter.requestDevice();
        const canvas = canvasRef.current;
        if (!canvas) return;

        context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
        if (!context) {
          throw new Error("Failed to obtain WebGPU canvas context.");
        }

        const format = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
          device,
          format,
          alphaMode: 'premultiplied'
        });

        // Create uniform buffer: 16 bytes alignment (time: f32 [4], resolution: vec2f [8], padding: [4])
        uniformBuffer = device.createBuffer({
          size: 16,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        recompilePipeline(wgslCode || DEFAULT_FRAGMENT_SHADER);
      } catch (err: any) {
        console.error("[WEBGPU_INIT_ERR]", err);
        setGpuError(err.message || "Failed to initialize WebGPU.");
        if (onError) onError(err.message || "WebGPU Initialization failed.");
      }
    };

    const recompilePipeline = (fragShaderCode: string) => {
      if (!device || !context) return;

      try {
        setGpuError(null);

        // Turn on strict error reporting before compilation
        device.pushErrorScope('validation');

        const vsModule = device.createShaderModule({
          label: 'Aegis VS Quad',
          code: VERTEX_SHADER
        });

        const fsModule = device.createShaderModule({
          label: 'Aegis Dynamic Generative FS',
          code: fragShaderCode
        });

        const format = navigator.gpu.getPreferredCanvasFormat();
        
        const pipeline = device.createRenderPipeline({
          label: 'Aegis Spatial Render Pipeline',
          layout: 'auto',
          vertex: {
            module: vsModule,
            entryPoint: 'vs_main',
          },
          fragment: {
            module: fsModule,
            entryPoint: 'fs_main',
            targets: [{
              format: format,
              blend: {
                color: {
                  srcFactor: 'src-alpha',
                  dstFactor: 'one-minus-src-alpha',
                  operation: 'add'
                },
                alpha: {
                  srcFactor: 'one',
                  dstFactor: 'one-minus-src-alpha',
                  operation: 'add'
                }
              }
            }],
          },
          primitive: {
            topology: 'triangle-list',
          },
        });

        // Retrieve validation logs immediately
        device.popErrorScope().then((error) => {
          if (error) {
            console.error("[WEBGPU_COMPILATION_ERROR]", error.message);
            setGpuError(`WebGPU Pipeline Compile Error:\n${error.message}`);
            if (onError) onError(error.message);
          } else {
            renderPipeline = pipeline;
            createBindGroupInstance();
          }
        });

      } catch (err: any) {
        console.error("[WEBGPU_PIPELINE_CRASH]", err);
        setGpuError(err.message || "Shader pipeline compilation crashed.");
        if (onError) onError(err.message || "Shader pipeline compilation crashed.");
      }
    };

    const createBindGroupInstance = () => {
      if (!device || !renderPipeline || !uniformBuffer) return;

      bindGroup = device.createBindGroup({
        layout: renderPipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: {
              buffer: uniformBuffer,
            },
          },
        ],
      });
    };

    // Watch for code updates and recompile
    if (wgslCode) {
      if (device) {
        recompilePipeline(wgslCode);
      } else {
        initWebGPU();
      }
    } else {
      initWebGPU();
    }

    // Animation Render Loop
    const startTime = performance.now();
    const render = () => {
      if (!device || !context || !renderPipeline || !uniformBuffer || !bindGroup) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Handle Resize dynamically
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const time = (performance.now() - startTime) / 1000.0;
      
      // Update Uniform Buffer: Float32Array of [time, width, height, 0.0]
      const uniformData = new Float32Array([time, width, height, 0.0]);
      device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer);

      const commandEncoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();

      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
          {
            view: textureView,
            clearValue: { r: 0.02, g: 0.03, b: 0.05, a: 1.0 },
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
      passEncoder.setPipeline(renderPipeline);
      passEncoder.setBindGroup(0, bindGroup);
      passEncoder.draw(6); // 6 vertices full-screen quad
      passEncoder.end();

      device.queue.submit([commandEncoder.finish()]);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (device) {
        device.destroy();
      }
    };
  }, [wgslCode]);

  if (!webGpuSupported) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-center p-6 bg-black/40 border border-red-500/10 rounded-2xl relative font-mono z-10">
        <span className="text-red-500 text-3xl mb-4">⚠</span>
        <h3 className="text-white text-sm uppercase tracking-[0.2em] mb-2">WebGPU Unsupported</h3>
        <p className="text-red-400/80 text-[10px] uppercase tracking-wider max-w-sm leading-relaxed">
          {gpuError}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center rounded-xl overflow-hidden bg-black/25">
      <canvas ref={canvasRef} className="w-full h-full block absolute inset-0 z-0" />
      
      {gpuError && (
        <div className="absolute inset-x-4 bottom-4 z-10 backdrop-blur-md bg-red-950/80 border border-red-500/30 rounded-lg p-4 font-mono text-[9px] text-red-300 overflow-y-auto max-h-[160px] whitespace-pre-wrap leading-relaxed shadow-lg">
          <div className="font-bold text-red-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            WebGPU compilation diagnostics:
          </div>
          {gpuError}
        </div>
      )}
    </div>
  );
}
