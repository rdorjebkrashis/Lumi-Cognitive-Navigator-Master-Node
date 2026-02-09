
import React, { useMemo, useEffect, useRef } from 'react';
import { TopologyPattern } from '../types';

interface TopologyBackgroundProps {
  pattern: TopologyPattern;
  color: string;
}

export const TopologyBackground: React.FC<TopologyBackgroundProps> = ({ pattern, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: { x: number; y: number; vx: number; vy: number; ox: number; oy: number }[] = [];
    const count = pattern === 'mandala' ? 80 : 50;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        ox: Math.random() * width,
        oy: Math.random() * height,
      });
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = color + '22'; // 15% opacity
      ctx.lineWidth = 0.5;

      if (pattern === 'chaotic') {
        particles.forEach((p, i) => {
          p.x += p.vx * 2;
          p.y += p.vy * 2;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          
          particles.forEach((p2, j) => {
            if (i === j) return;
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          });
        });
      } else if (pattern === 'grid') {
        const step = 60;
        for (let x = 0; x < width; x += step) {
          for (let y = 0; y < height; y += step) {
            ctx.beginPath();
            ctx.rect(x, y, 2, 2);
            ctx.fillStyle = color + '11';
            ctx.fill();
            if (Math.random() > 0.95) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + step, y);
              ctx.stroke();
            }
          }
        }
      } else if (pattern === 'fluid') {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const yOffset = (height / 6) * (i + 1);
          ctx.moveTo(0, yOffset);
          for (let x = 0; x < width; x += 10) {
            const y = yOffset + Math.sin(x * 0.005 + time * 0.001 + i) * 30;
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      } else if (pattern === 'mandala') {
        const cx = width / 2;
        const cy = height / 2;
        const rings = 6;
        for (let r = 1; r <= rings; r++) {
          const radius = r * 80;
          const pCount = r * 8;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();
          
          for (let i = 0; i < pCount; i++) {
            const angle = (i / pCount) * Math.PI * 2 + time * 0.0002 * r;
            const px = cx + Math.cos(angle) * radius;
            const py = cy + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fillStyle = color + '44';
            ctx.fill();
          }
        }
      }

      animationFrame = requestAnimationFrame(draw);
    };

    animationFrame = requestAnimationFrame(draw);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [pattern, color]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />;
};
