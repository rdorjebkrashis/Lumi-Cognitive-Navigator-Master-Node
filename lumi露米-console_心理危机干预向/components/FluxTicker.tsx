import React, { useEffect, useRef } from 'react';

interface FluxTickerProps {
  intensity: number;
}

const FluxTicker: React.FC<FluxTickerProps> = ({ intensity }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      offset += 1 + intensity * 5;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#0f172a'; // Slate-900 bg
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      // Draw Noise Wave
      for (let x = 0; x < width; x += 2) {
        // Base noise (Idle thought) - always present even at low intensity
        const idleNoise = Math.sin((x + offset * 0.5) * 0.1) * 2;
        
        // Active noise
        const activeNoise = Math.sin((x + offset) * 0.05) * Math.cos((x - offset) * 0.02);
        const amp = (height / 2.5) * Math.min(1, intensity + 0.1); 
        
        // Jitter
        const jitter = (Math.random() - 0.5) * (intensity * 10);
        
        // Combine: Base idle heartbeat + Active Flux
        const y = height / 2 + (activeNoise * amp) + (intensity < 0.2 ? idleNoise * 0.5 : 0) + jitter;
        ctx.lineTo(x, y);
      }

      // Color mapping based on intensity
      let strokeColor = '#22d3ee'; // Cyan
      if (intensity > 0.4) strokeColor = '#f59e0b'; // Amber
      if (intensity > 0.8) strokeColor = '#ef4444'; // Red

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

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

export default FluxTicker;