import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Kalpa, Role } from '../types';
import { getKalpas, deleteKalpa } from '../services/shambhalaDatabase';
import { sonicVajra } from '../services/audioEngine';

interface DreamSpaceProps {
  isOpen: boolean;
  onClose: () => void;
}

// 3D Point Interface
interface Node3D {
    id: string;
    x: number;
    y: number;
    z: number;
    kalpa: Kalpa;
    color: string;
    size: number;
    isSealed?: boolean;
}

// Helper: Color based on Entropy
const getEntropyColor = (entropy: number) => {
    if (entropy < 0.3) return '#22d3ee'; // Cyan (Wisdom)
    if (entropy < 0.6) return '#22c55e'; // Green (Safe)
    if (entropy < 0.8) return '#f59e0b'; // Amber (Flux)
    return '#ef4444'; // Red (Chaos)
};

const DreamSpace: React.FC<DreamSpaceProps> = ({ isOpen, onClose }) => {
  const [kalpas, setKalpas] = useState<Kalpa[]>([]);
  const [selectedKalpa, setSelectedKalpa] = useState<Kalpa | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isSealed, setIsSealed] = useState(false); // SAMAYA SEAL STATE
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Load Data
  useEffect(() => {
    if (isOpen) {
        getKalpas().then(data => {
            // Sort by time: Newest first (Center of Mandala)
            setKalpas(data.sort((a, b) => b.timestamp - a.timestamp));
        });
        sonicVajra.triggerTone(100, 'triangle'); 
    }
  }, [isOpen]);

  // --- FRACTAL LAYOUT (PHYLLOTAXIS / SUNFLOWER) ---
  const nodes: Node3D[] = useMemo(() => {
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees
      
      return kalpas.map((k, i) => {
          // Radius grows with index (Newest at center i=0)
          const r = 40 * Math.sqrt(i + 1); 
          const theta = i * goldenAngle;
          
          // Z-depth: Older memories sink deeper
          const z = i * 20;

          return {
              id: k.id,
              x: r * Math.cos(theta),
              y: r * Math.sin(theta),
              z: z, 
              kalpa: k,
              color: getEntropyColor(k.entropy),
              size: 4 + (k.messages.length * 0.4) // Size based on conversation length
          };
      });
  }, [kalpas]);

  // --- INTERACTION ---
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (selectedKalpa) return; 
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const deltaX = clientX - lastMousePos.current.x;
    const deltaY = clientY - lastMousePos.current.y;
    
    setRotation(prev => ({
        x: prev.x + deltaY * 0.005,
        y: prev.y + deltaX * 0.005
    }));
    
    lastMousePos.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleNodeClick = (k: Kalpa) => {
      sonicVajra.triggerTone(440 + (k.entropy * 400), 'sine');
      setSelectedKalpa(k);
  };

  const handleDelete = async (id: string) => {
      if (window.confirm("Dissolve this timeline? / དུས་ཚོད་འདི་མེད་པ་བཟོ་རོགས།")) {
          await deleteKalpa(id);
          setKalpas(prev => prev.filter(k => k.id !== id));
          if (selectedKalpa?.id === id) setSelectedKalpa(null);
      }
  };

  const handleSeal = () => {
      setIsSealed(true);
      sonicVajra.triggerTone(880, 'sine');
      setTimeout(() => sonicVajra.triggerTone(440, 'triangle'), 200);
  };

  // --- RENDER LOOP ---
  // Project 3D to 2D
  const project = (p: Node3D, width: number, height: number) => {
      // Rotate Y
      let x = p.x * Math.cos(rotation.y) - p.z * Math.sin(rotation.y);
      let z = p.x * Math.sin(rotation.y) + p.z * Math.cos(rotation.y);
      
      // Rotate X
      let y = p.y * Math.cos(rotation.x) - z * Math.sin(rotation.x);
      let z2 = p.y * Math.sin(rotation.x) + z * Math.cos(rotation.x);

      // Perspective
      const fov = 1000;
      const scale = fov / (fov + z2 + 500); // Offset z to avoid clipping
      
      return {
          x: width / 2 + x * scale,
          y: height / 2 + y * scale,
          scale: scale,
          zIndex: z2,
          ...p
      };
  };

  // Entropy Tidal Chart Generator
  const renderEntropyChart = (k: Kalpa) => {
      const msgs = k.messages;
      if (msgs.length < 2) return null;
      
      const width = 100;
      const height = 40;
      
      const points = msgs.map((m, i) => {
          const x = (i / (msgs.length - 1)) * width;
          const y = height - ((m.entropy || 0.5) * height);
          return `${x},${y}`;
      }).join(' ');

      return (
          <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
              <polyline points={points} fill="none" stroke={getEntropyColor(k.entropy)} strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <linearGradient id={`grad-${k.id}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={getEntropyColor(k.entropy)} stopOpacity="0.3"/>
                  <stop offset="100%" stopColor={getEntropyColor(k.entropy)} stopOpacity="0"/>
              </linearGradient>
              <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#grad-${k.id})`} />
          </svg>
      );
  };

  if (!isOpen) return null;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const projectedNodes = nodes
      .map(n => project(n, width, height))
      .sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div 
        ref={containerRef}
        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md overflow-hidden animate-in fade-in duration-700"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
    >
       {/* Background: Deep Void Particles */}
       <div className="absolute inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
       <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-black/50 to-black"></div>

       {/* Header */}
       <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20 pointer-events-none">
           <div>
               <h2 className="text-2xl font-tibetan text-slate-200">རྨི་ལམ་གྱི་ཞིང་ཁམས།</h2>
               <div className="text-[10px] font-mono text-cyan-500 tracking-[0.3em] uppercase mt-1">
                   DREAM_SPACE_MANDALA
               </div>
           </div>
           
           <div className="flex gap-4 pointer-events-auto">
               <button 
                   onClick={handleSeal}
                   disabled={isSealed}
                   className={`px-4 py-2 rounded-full border border-slate-700 text-[10px] font-mono uppercase tracking-widest transition-all ${
                       isSealed 
                       ? 'bg-amber-500/20 text-amber-500 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                       : 'bg-black/50 text-slate-400 hover:text-white hover:border-white'
                   }`}
               >
                   {isSealed ? 'SAMAYA SEALED / དམ་ཚིག' : 'SEAL MANDALA'}
               </button>
               <button 
                   onClick={onClose}
                   className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:border-white transition-colors bg-black/50 backdrop-blur"
               >
                   ×
               </button>
           </div>
       </div>

       {/* 3D SCENE */}
       <svg width="100%" height="100%" className="absolute inset-0 z-10">
           
           {/* THE WEB (Samaya Seal) */}
           {isSealed && projectedNodes.map((node, i) => {
               // Connect to logical neighbors in Fibonacci sequence roughly
               // Simple proximity logic for visual effect: Connect to previous 2 indices
               if (i < 2) return null;
               const target1 = projectedNodes[i-1];
               const target2 = projectedNodes[i-2];
               
               return (
                   <g key={`seal-${node.id}`} opacity={0.15}>
                       <line x1={node.x} y1={node.y} x2={target1.x} y2={target1.y} stroke={node.color} strokeWidth={1} />
                       <line x1={node.x} y1={node.y} x2={target2.x} y2={target2.y} stroke={node.color} strokeWidth={1} />
                   </g>
               )
           })}

           {/* Standard Chronological Line (The Thread) */}
           {!isSealed && projectedNodes.map((node, i) => {
               if (i === 0) return null;
               // Connect to next logical node (chronological)
               // Note: projectedNodes is Z-sorted, we need logical link.
               // We find the node that was logically 'before' this one in the `nodes` array.
               // `nodes` is sorted Newest -> Oldest. So node[i] connects to node[i-1] ? No, i connects to i-1.
               
               // Let's rely on ID lookup for correctness since projectedNodes is shuffled
               const logicalIdx = nodes.findIndex(n => n.id === node.id);
               if (logicalIdx <= 0) return null;
               
               const prevNode = nodes[logicalIdx - 1]; // The one slightly newer
               const prevProj = project(prevNode, width, height);

               return (
                   <line 
                       key={`thread-${node.id}`}
                       x1={prevProj.x} y1={prevProj.y}
                       x2={node.x} y2={node.y}
                       stroke={node.color}
                       strokeWidth={1}
                       opacity={0.15 * node.scale}
                       strokeDasharray={isSealed ? "none" : "2,2"}
                   />
               );
           })}

           {/* Nodes (Planets) */}
           {projectedNodes.map((node) => (
               <g 
                 key={node.id} 
                 className="cursor-pointer transition-opacity duration-300"
                 opacity={node.scale * (selectedKalpa ? 0.1 : 1)} 
                 onClick={(e) => { e.stopPropagation(); handleNodeClick(node.kalpa); }}
               >
                   {/* Star Glow */}
                   <circle 
                       cx={node.x} cy={node.y} 
                       r={node.size * node.scale * (isSealed ? 4 : 2)} 
                       fill={node.color} 
                       opacity={isSealed ? 0.2 : 0.1} 
                       className={isSealed ? "animate-pulse" : ""}
                   />
                   {/* Core */}
                   <circle 
                       cx={node.x} cy={node.y} 
                       r={node.size * node.scale} 
                       fill={isSealed ? '#fff' : node.color}
                       stroke="white"
                       strokeWidth={1 * node.scale}
                       strokeOpacity={0.5}
                   />
                   {/* Label */}
                   {node.scale > 0.8 && (
                       <text 
                           x={node.x} y={node.y + 20 * node.scale} 
                           textAnchor="middle" 
                           fill="white" 
                           fontSize={9 * node.scale}
                           fontFamily="monospace"
                           opacity={0.6}
                           className="pointer-events-none select-none"
                       >
                           {node.kalpa.title.substring(0, 15)}...
                       </text>
                   )}
               </g>
           ))}
       </svg>
       
       {kalpas.length === 0 && (
           <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-serif italic z-0">
               The Mandala is empty. Begin the chant.
           </div>
       )}

       {/* --- MANDALA PLAYBACK MODAL (The Inner View) --- */}
       {selectedKalpa && (
           <div className="absolute inset-0 z-30 flex items-center justify-center p-4 md:p-10 animate-in zoom-in-95 duration-300">
               <div 
                   className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                   onClick={() => setSelectedKalpa(null)}
               ></div>

               <div className="relative w-full max-w-3xl max-h-full bg-[#050505] border border-slate-800 rounded-sm shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
                   
                   {/* Modal Header */}
                   <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-[#0a0a0a]">
                       <div className="flex-1">
                           <h3 className="text-lg font-serif text-slate-200">{selectedKalpa.title}</h3>
                           <div className="flex gap-6 mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-wider items-end">
                               <span>Ω: {selectedKalpa.entropy.toFixed(3)}</span>
                               <span>{new Date(selectedKalpa.timestamp).toLocaleString()}</span>
                               
                               {/* ENTROPY TIDAL CHART (Mini) */}
                               <div className="w-32 h-8 border-b border-l border-slate-800/50">
                                   {renderEntropyChart(selectedKalpa)}
                               </div>
                           </div>
                       </div>
                       <div className="flex gap-4 ml-4">
                           <button 
                               onClick={() => handleDelete(selectedKalpa.id)}
                               className="text-red-900 hover:text-red-500 text-[10px] font-mono uppercase tracking-widest transition-colors"
                           >
                               [ DISSOLVE ]
                           </button>
                           <button onClick={() => setSelectedKalpa(null)} className="text-slate-500 hover:text-white transition-colors">
                               ✕
                           </button>
                       </div>
                   </div>

                   {/* Modal Body */}
                   <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                       {selectedKalpa.messages.map((msg, idx) => (
                           <div key={idx} className={`flex flex-col ${msg.role === Role.USER ? 'items-end' : 'items-start'} group`}>
                               <div className="mb-1 text-[9px] font-mono text-slate-700 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                   {msg.role === Role.USER ? 'ARCHITECT' : 'SHOUSHO U'}
                                   {/* Message Entropy Dot */}
                                   <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getEntropyColor(msg.entropy || 0.5) }}></div>
                               </div>
                               <div className={`max-w-[90%] px-5 py-3 text-sm leading-relaxed border backdrop-blur-sm ${
                                   msg.role === Role.USER 
                                   ? 'bg-slate-900/30 text-slate-300 border-slate-800 rounded-2xl rounded-tr-sm' 
                                   : 'bg-black/40 text-slate-400 border-slate-900 rounded-2xl rounded-tl-sm'
                               }`}>
                                   {msg.content}
                               </div>
                           </div>
                       ))}
                       <div className="h-12 flex items-center justify-center text-[10px] font-mono text-slate-800 mt-8">
                           --- MEMORY ENDS ---
                       </div>
                   </div>

                   {/* Footer Color Strip */}
                   <div className="h-1 w-full" style={{ backgroundColor: getEntropyColor(selectedKalpa.entropy) }}></div>
               </div>
           </div>
       )}

    </div>
  );
};

export default DreamSpace;