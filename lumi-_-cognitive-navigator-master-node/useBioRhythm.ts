
import { useState, useEffect, useMemo } from 'react';
import { KnobValues, MemorySnapshot } from '../types';
import { SKIN_REGISTRY, SkinConfig } from '../constants/skins';

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '245, 158, 11';
}

export const useBioRhythm = (activeSnapshot: MemorySnapshot | null, currentDay: number, onAudit: (msg: string) => void) => {
  const [knobValues, setKnobValues] = useState<KnobValues>({
    entropy: 0.0,
    blur: 0.2,
    speed: 0.5
  });
  const [isSovereign, setIsSovereign] = useState(false);

  const currentSkin = useMemo(() => SKIN_REGISTRY[currentDay], [currentDay]);

  // Heartbeat Sync: Snapshot -> Knobs mapping
  useEffect(() => {
    if (activeSnapshot && !isSovereign) {
      const cIndex = activeSnapshot.crystalline_index || 0;
      const intentEntropy = activeSnapshot.intent_entropy || 0.5;

      if (cIndex > 0.95) {
        onAudit('[DIVINE_INTERVENTION]: Reality locked.');
        setKnobValues({ entropy: 0.0, blur: 0.0, speed: 1.0 });
      } else {
        let targetEntropy = activeSnapshot.entropy_level ?? 0.4;
        let targetBlur = intentEntropy;
        let targetSpeed = 0.3 + (cIndex * 0.7);

        if (cIndex < 0.5) {
          targetBlur = Math.min(1.0, targetBlur + 0.3);
          targetEntropy = Math.max(0.6, targetEntropy); 
          onAudit('BIO_RHYTHM: Exhaling mist.');
        } else if (cIndex > 0.8) {
          targetBlur = Math.max(0.0, targetBlur - 0.2);
          targetEntropy = Math.min(0.2, targetEntropy); 
          targetSpeed = Math.max(0.8, targetSpeed);
          onAudit('BIO_RHYTHM: Exhaling light.');
        }
        setKnobValues({ entropy: targetEntropy, blur: targetBlur, speed: targetSpeed });
      }
    }
  }, [activeSnapshot, isSovereign]);

  // Skin & CSS Variable Update
  useEffect(() => {
    const { entropy, blur, speed } = knobValues;
    const skinColor = currentSkin.color;
    const baseRgb = hexToRgb(skinColor);
    
    document.documentElement.style.setProperty('--mind-color', skinColor);
    document.documentElement.style.setProperty('--mind-accent', currentSkin.accent);
    document.documentElement.style.setProperty('--mind-rgb', baseRgb);
    document.documentElement.style.setProperty('--mind-opacity', (0.95 - (0.4 * blur)).toString());
    document.documentElement.style.setProperty('--mind-blur', `${2 + (50 * blur)}px`);
    document.documentElement.style.setProperty('--mind-bg', `rgba(${baseRgb}, 0.05)`);
    document.documentElement.style.setProperty('--mind-speed', `${speed}`);
  }, [knobValues, currentSkin]);

  return { knobValues, setKnobValues, isSovereign, setIsSovereign, currentSkin };
};
