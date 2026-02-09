
import { useCallback, useRef } from 'react';

/**
 * Hook for managing the auditory nervous system of the application.
 * Handles decoding of base64 PCM data and playback through the Web Audio API.
 */
export const useAudioSynapse = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playVoice = useCallback(async (base64Data: string, sampleRate: number = 24000) => {
    try {
      if (!base64Data) return;

      // Initialize or resume AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Base64 to Uint8Array
      const binaryString = window.atob(base64Data.replace(/-/g, '+').replace(/_/g, '/'));
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert raw PCM 16-bit data to AudioBuffer
      // Gemini TTS typically returns raw PCM without headers
      const dataInt16 = new Int16Array(bytes.buffer);
      const numChannels = 1;
      const frameCount = dataInt16.length / numChannels;
      const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

      for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
          channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
      }

      // Create and start source node
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (error) {
      console.error("[AudioSynapse]: Critical failure in voice transmission.", error);
    }
  }, []);

  return { playVoice };
};
