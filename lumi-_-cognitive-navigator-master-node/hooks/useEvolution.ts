
import { useState, useCallback, useEffect } from 'react';
import { HeterogeneousMemory, MemorySnapshot } from '../types';

export const useEvolution = (onAudit: (msg: string) => void) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [memory, setMemory] = useState<HeterogeneousMemory>({
    immediate: [],
    resonance: [],
    anchors: []
  });
  const [activeSnapshot, setActiveSnapshot] = useState<MemorySnapshot | null>(null);

  const addSnapshot = useCallback((snapshot: MemorySnapshot) => {
    setActiveSnapshot(snapshot);
    setMemory(prev => ({ 
      ...prev, 
      immediate: [snapshot, ...prev.immediate].slice(0, 10) 
    }));
  }, []);

  // Growth Phase Jumping
  useEffect(() => {
    if (activeSnapshot) {
      const recDay = activeSnapshot.recommended_day;
      const cIndex = activeSnapshot.crystalline_index || 0;

      if (recDay && recDay !== currentDay && cIndex > 0.75) {
        onAudit(`QUANTUM_LEAP_DETECTED: Day ${recDay}`);
        setTimeout(() => {
          setCurrentDay(recDay);
          setCompletedDays(prev => prev.includes(recDay) ? prev : [...prev, recDay]);
        }, 2000);
      }
    }
  }, [activeSnapshot, currentDay]);

  return { 
    currentDay, 
    setCurrentDay, 
    completedDays, 
    setCompletedDays,
    memory, 
    addSnapshot, 
    activeSnapshot 
  };
};
