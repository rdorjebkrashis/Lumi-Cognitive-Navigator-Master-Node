import React, { useRef, useEffect, useState } from 'react';
import { Message, Role } from '../types';

interface TerminalProps {
  messages: Message[];
  isProcessing: boolean;
  onSendMessage: (text: string) => void;
  onCrystallize: (msg: Message) => void; 
  intensity?: number;
  onOpenAnchor: (msg: Message) => void; 
}

const TypewriterContent: React.FC<{ content: string; entropy: number; onComplete: () => void }> = ({ content, entropy, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const indexRef = useRef(0);

    useEffect(() => {
        indexRef.current = 0;
        setDisplayedText('');
        const delay = Math.floor(Math.max(2, 50 * (1 - entropy))); 
        const interval = setInterval(() => {
            if (indexRef.current < content.length) {
                setDisplayedText(prev => prev + content[indexRef.current]);
                indexRef.current++;
            } else {
                clearInterval(interval);
                onComplete();
            }
        }, delay);
        return () => clearInterval(interval);
    }, [content, entropy, onComplete]);

    return <ContentRenderer content={displayedText} entropy={entropy} />;
};

const ContentRenderer: React.FC<{ content: string; entropy: number }> = ({ content }) => {
    const parts = content.split(/(\*\*.*?\*\*|`.*?`|\n)/g);
    return (
        <div className="leading-relaxed whitespace-pre-wrap">
            {parts.map((part, i) => {
                if (part.startsWith('**')) return <strong key={i} className="text-amber-100">{part.slice(2, -2)}</strong>;
                if (part.startsWith('`')) return <code key={i} className="bg-white/10 px-1 rounded text-cyan-300 font-mono text-xs">{part.slice(1, -1)}</code>;
                if (part === '\n') return <br key={i} />;
                return <span key={i}>{part}</span>;
            })}
        </div>
    );
};

const Terminal: React.FC<TerminalProps> = ({ messages, isProcessing, onSendMessage, onCrystallize, intensity = 0.5, onOpenAnchor }) => {
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]); 

  return (
    <div className="flex flex-col h-full w-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {messages.map((msg, index) => {
          const isUser = msg.role === Role.USER;
          const hasAnchor = !!msg.anchorData;
          
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group relative`}>
              <div 
                onClick={() => hasAnchor && onOpenAnchor(msg)}
                className={`relative max-w-[85%] transition-all duration-700 ${
                  hasAnchor 
                  ? 'bg-white/[0.05] border-2 border-white/40 text-white shadow-[0_0_50px_rgba(255,255,255,0.1)] rounded-2xl cursor-pointer hover:bg-white/[0.08]' 
                  : (isUser ? 'bg-zinc-900 text-slate-200 border border-white/5 rounded-2xl' : 'bg-black/20 text-slate-300 border border-white/5 rounded-2xl')
                }`}
              >
                 <div className="px-6 py-4 relative">
                    {!isUser && index === messages.length - 1 ? (
                        <TypewriterContent content={msg.content} entropy={msg.entropy || 0.5} onComplete={() => {}} />
                    ) : (
                        <ContentRenderer content={msg.content} entropy={msg.entropy || 0.5} />
                    )}

                    {!isUser && !hasAnchor && !isProcessing && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onCrystallize(msg); }}
                            className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-white/10 border border-white/10 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white"
                            title="手动提炼生命定锚"
                        >
                            ✦
                        </button>
                    )}
                 </div>

                 {hasAnchor && (
                     <div className="w-full mt-2 border-t border-white/20 bg-white/10 py-3 flex items-center justify-center gap-3 group/anchor overflow-hidden rounded-b-2xl">
                         <span className="text-white text-lg group-hover/anchor:scale-125 transition-transform animate-pulse">✦</span>
                         <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold text-white/80">
                            点击开启见地回溯 / View_Anchor_Source
                         </span>
                     </div>
                 )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) { onSendMessage(input); setInput(''); } }} className="p-4 border-t border-white/5">
        <input value={input} onChange={(e) => setInput(e.target.value)} disabled={isProcessing} placeholder="输入指令..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-mono text-sm focus:outline-none focus:border-white/30" />
      </form>
    </div>
  );
};

export default Terminal;