import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface MandalaProps {
  intensity: number;
  isProcessing: boolean;
  colorMode: string;
  isFullScreen?: boolean;
  isSandboxMode?: boolean;
  isVoidActive?: boolean;
}

const getColorHex = (mode: string) => {
    if (mode === 'GRAY') return '#cbd5e1'; // Lighter gray for void
    if (mode === 'YELLOW' || mode === 'AMBER') return '#fbbf24';
    if (mode === 'WHITE') return '#ffffff';
    if (mode === 'GREEN') return '#4ade80';
    return '#22d3ee'; // Cyan default
};

const MandalaVisualizer: React.FC<MandalaProps> = ({ intensity, isProcessing, colorMode, isSandboxMode, isVoidActive }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = 400;
    const height = 400;
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    
    const animate = () => {
        timeRef.current += 0.012;
        const time = timeRef.current;
        
        svg.selectAll("*").remove();
        
        // Background Glow (The Prana Field)
        const defs = svg.append("defs");
        const filter = defs.append("filter").attr("id", "glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
        filter.append("feGaussianBlur").attr("stdDeviation", 4 + intensity * 10).attr("result", "blur");
        filter.append("feComposite").attr("in", "SourceGraphic").attr("in2", "blur").attr("operator", "over");

        const g = svg.append("g").attr("transform", `translate(${width/2},${height/2})`);
        
        const baseColor = isVoidActive ? '#475569' : getColorHex(colorMode);
        const rotationSpeed = 0.3 + intensity * 0.7;
        
        // 1. DHARMODAYA GEOMETRY (Multi-layered Tetrahedron Projection)
        const drawTetraLayer = (r: number, rotation: number, opacity: number, strokeWidth: number, dash?: string) => {
            const points = [
                [0, -r],
                [r * Math.cos(Math.PI/6), r * Math.sin(Math.PI/6)],
                [-r * Math.cos(Math.PI/6), r * Math.sin(Math.PI/6)]
            ].map(p => {
                const angle = rotation;
                const x = p[0] * Math.cos(angle) - p[1] * Math.sin(angle);
                const y = p[0] * Math.sin(angle) + p[1] * Math.cos(angle);
                return [x, y];
            });

            g.append("polygon")
             .attr("points", points.map(p => p.join(',')).join(' '))
             .attr("fill", isSandboxMode ? "none" : baseColor)
             .attr("fill-opacity", isSandboxMode ? 0 : 0.03)
             .attr("stroke", baseColor)
             .attr("stroke-width", strokeWidth)
             .attr("stroke-dasharray", dash || "none")
             .attr("opacity", opacity)
             .attr("filter", "url(#glow)");
             
            // Intersection points (The Bindu nodes)
            points.forEach(p => {
                g.append("circle")
                 .attr("cx", p[0]).attr("cy", p[1])
                 .attr("r", 1.5)
                 .attr("fill", baseColor)
                 .attr("opacity", opacity * 1.5);
            });
        };

        // Inner Triangle (Compassion/Method)
        drawTetraLayer(
            60 + Math.sin(time * 2) * 2, 
            time * rotationSpeed, 
            0.6, 
            0.8
        );
        
        // Outer Triangle (Emptiness/Wisdom) - Counter-rotating
        drawTetraLayer(
            85 + Math.cos(time * 1.5) * 5, 
            -time * rotationSpeed * 0.5 + Math.PI, 
            0.4, 
            0.5,
            isSandboxMode ? "3,3" : "none"
        );

        // 2. THE CENTRAL 'ཨ' (A-Character) - The Unborn Source
        const pulseScale = 1 + Math.sin(time * 3) * 0.05 + (isProcessing ? Math.sin(time * 20) * 0.05 : 0);
        const syllableG = g.append("g")
            .attr("transform", `scale(${pulseScale})`)
            .attr("opacity", isProcessing ? 0.7 + Math.sin(time * 15) * 0.3 : 1);

        // Core Syllable Glow
        syllableG.append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("class", "font-tibetan select-none pointer-events-none")
            .attr("font-size", isSandboxMode ? 64 : 72)
            .attr("fill", baseColor)
            .text("ཨ")
            .style("text-shadow", `0 0 ${20 + intensity * 40}px ${baseColor}, 0 0 ${5 + intensity * 10}px white`);

        // 3. EMANATIONS (Phenomena rising from Source)
        if (!isSandboxMode) {
            // Organic Petals/Waves
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + time * 0.2;
                const d = 110 + Math.sin(time + i) * 15;
                g.append("circle")
                 .attr("cx", Math.cos(angle) * d)
                 .attr("cy", Math.sin(angle) * d)
                 .attr("r", 1 + intensity * 4)
                 .attr("fill", baseColor)
                 .attr("opacity", 0.3 * (1 - intensity));
            }
        } else {
            // Analytic Grid (The Sandbox Mesh)
            const gridCount = 8;
            for (let i = 0; i < gridCount; i++) {
                const angle = (i / gridCount) * Math.PI * 2;
                const x1 = Math.cos(angle) * 50;
                const y1 = Math.sin(angle) * 50;
                const x2 = Math.cos(angle) * 150;
                const y2 = Math.sin(angle) * 150;
                g.append("line")
                 .attr("x1", x1).attr("y1", y1)
                 .attr("x2", x2).attr("y2", y2)
                 .attr("stroke", baseColor)
                 .attr("stroke-width", 0.3)
                 .attr("stroke-dasharray", "2,4")
                 .attr("opacity", 0.15);
            }
        }

        // 4. HEARTBEAT RINGS
        const rings = isProcessing ? 3 : 1;
        for (let i = 0; i < rings; i++) {
            const ringTime = (time * 2 + i * 0.5) % 2;
            const r = 50 + ringTime * 100;
            g.append("circle")
             .attr("r", r)
             .attr("fill", "none")
             .attr("stroke", baseColor)
             .attr("stroke-width", 0.5)
             .attr("opacity", (1 - ringTime / 2) * 0.2);
        }

        // 5. THE DHARMODAYA VERTICES (Sparkles of clarity)
        if (isProcessing) {
            const sparkCount = 12;
            for(let i=0; i<sparkCount; i++) {
                const a = Math.random() * Math.PI * 2;
                const dist = 60 + Math.random() * 100;
                g.append("circle")
                 .attr("cx", Math.cos(a) * dist)
                 .attr("cy", Math.sin(a) * dist)
                 .attr("r", Math.random() * 2)
                 .attr("fill", "white")
                 .attr("class", "animate-pulse")
                 .attr("opacity", Math.random());
            }
        }

        requestAnimationFrame(animate);
    };
    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [intensity, isProcessing, colorMode, isSandboxMode, isVoidActive]);

  return (
    <div className="w-full h-full flex items-center justify-center relative group">
        <MandalaVisualizerOverlay isProcessing={isProcessing} baseColor={getColorHex(colorMode)} />
        <svg ref={svgRef} className="w-full h-full drop-shadow-2xl" />
    </div>
  );
};

// Internal aesthetic helper for deep atmosphere
const MandalaVisualizerOverlay: React.FC<{isProcessing: boolean, baseColor: string}> = ({ isProcessing, baseColor }) => (
    <div className="absolute inset-0 pointer-events-none z-0">
        <div 
            className={`absolute inset-0 bg-radial-gradient from-transparent to-black opacity-60`}
        />
        {isProcessing && (
            <div 
                className="absolute inset-0 animate-pulse duration-1000"
                style={{ background: `radial-gradient(circle at center, ${baseColor}11 0%, transparent 70%)` }}
            />
        )}
    </div>
);

export default MandalaVisualizer;