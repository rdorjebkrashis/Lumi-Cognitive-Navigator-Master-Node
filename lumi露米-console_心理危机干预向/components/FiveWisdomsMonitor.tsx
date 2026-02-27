import React, { useEffect, useRef } from 'react';

interface FiveWisdomsMonitorProps {
  intensity: number; // Entropy (0.0 - 1.0)
  colorMode: string; // WHITE, BLUE, YELLOW, RED, GREEN
}

const getColorHex = (mode: string) => {
    switch (mode) {
        case 'WHITE': return '#e2e8f0'; // Slate-200
        case 'BLUE': return '#3b82f6';  // Blue-500
        case 'YELLOW': return '#eab308'; // Yellow-500
        case 'RED': return '#ef4444';    // Red-500
        case 'GREEN': return '#22c55e';  // Green-500
        default: return '#22d3ee';       // Cyan (Default)
    }
};

const FiveWisdomsMonitor: React.FC<FiveWisdomsMonitorProps> = ({ intensity, colorMode }) => {
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
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);
      
      // Background: Subtle glow of the active wisdom color
      const hexColor = getColorHex(colorMode);
      ctx.fillStyle = '#0f172a'; // Base Slate-900
      ctx.fillRect(0, 0, width, height);
      
      // Draw Waveform
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = hexColor;

      // Logic:
      // High Intensity (Poison) -> Jagged, Fast, Erratic (Noise)
      // Low Intensity (Wisdom) -> Smooth, Harmonic, Flowing (Sine)
      
      for (let x = 0; x < width; x++) {
          let y = centerY;

          if (intensity < 0.2) {
              // WISDOM STATE (Harmonic Wave)
              // Smooth sine waves superposition
              y += Math.sin(x * 0.1 + phase) * 8;
              y += Math.sin(x * 0.05 - phase * 0.5) * 4;
          } else {
              // POISON/FLUX STATE (Chaotic Wave)
              // Sine wave distorted by random noise scaled by intensity
              const noise = (Math.random() - 0.5) * (intensity * 20);
              const chaoticSine = Math.sin(x * (0.1 + intensity * 0.2) + phase * 2) * (10 * intensity);
              y += chaoticSine + noise;
          }

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
      }
      
      // Glow Effect
      ctx.shadowBlur = intensity < 0.2 ? 15 : 5;
      ctx.shadowColor = hexColor;
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [intensity, colorMode]);

  return (
    <div className="relative">
        <canvas 
        ref={canvasRef} 
        width={140} 
        height={30} 
        className="rounded-sm border border-slate-800 bg-black/50"
        />
        {/* Tiny Label Overlay */}
        <div className="absolute top-0 right-1 text-[8px] font-mono opacity-50 pointer-events-none" style={{ color: getColorHex(colorMode) }}>
            {colorMode}
        </div>
    </div>
  );
};

export default FiveWisdomsMonitor;