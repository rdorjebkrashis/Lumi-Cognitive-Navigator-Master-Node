import React, { useEffect, useRef } from 'react';

interface QuantumMonitorProps {
  intensity: number;
}

const QuantumMonitor: React.FC<QuantumMonitorProps> = ({ intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      phase += 0.1;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#0f172a'; // Slate-900 bg
      ctx.fillRect(0, 0, width, height);

      const centerY = height / 2;
      
      // Mode 1: COHERENCE (Stabilized / Rainbow Body) - intensity < 0.1
      // Draws a perfect standing wave (Harmonic)
      if (intensity < 0.1) {
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ffffff';
          
          for (let x = 0; x < width; x++) {
              // Harmonic series sum (Standing wave)
              const y = centerY + 
                        Math.sin(x * 0.1 + phase) * 5 + 
                        Math.sin(x * 0.2 - phase) * 3;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
          }
          
          // Rainbow Gradient Stroke
          const gradient = ctx.createLinearGradient(0, 0, width, 0);
          gradient.addColorStop(0, "#ef4444");
          gradient.addColorStop(0.2, "#f97316");
          gradient.addColorStop(0.4, "#eab308");
          gradient.addColorStop(0.6, "#22c55e");
          gradient.addColorStop(0.8, "#06b6d4");
          gradient.addColorStop(1, "#8b5cf6");
          ctx.strokeStyle = gradient;
          
          ctx.stroke();
          
          // Glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(255,255,255,0.5)";
          ctx.stroke();
          ctx.shadowBlur = 0;

      } else {
          // Mode 2: ENTROPY (Chaos / Flux)
          // Draws the noise wave (Legacy Logic upgraded)
          ctx.beginPath();
          ctx.lineWidth = 1.5;
          
          let color = '#22d3ee';
          if (intensity > 0.4) color = '#f59e0b';
          if (intensity > 0.8) color = '#ef4444';
          ctx.strokeStyle = color;

          for (let x = 0; x < width; x += 2) {
            // Chaos Math
            const noise = Math.sin((x + phase * 2) * 0.05) * Math.cos((x - phase) * 0.03);
            const amp = (height / 2.5) * intensity;
            const jitter = (Math.random() - 0.5) * (intensity * 15);
            
            const y = centerY + (noise * amp) + jitter;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [intensity]);

  return (
    <canvas 
      ref={canvasRef} 
      width={120} 
      height={24} 
      className="rounded-sm border border-slate-800 bg-black/50"
    />
  );
};

export default QuantumMonitor;