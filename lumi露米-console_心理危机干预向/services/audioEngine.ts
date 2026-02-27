// Sonic Vajra Engine // གསུང་རྡོ་རྗེ།
// Procedural Audio Synthesis based on Entropy

class SonicVajraEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  // Oscillators
  private baseOsc: OscillatorNode | null = null; // The "Om" (Sine)
  private fluxOsc: OscillatorNode | null = null; // The "Chaos" (Sawtooth/Triangle)
  private lfo: OscillatorNode | null = null; // Low Frequency Oscillator for pulsing

  private isMuted: boolean = true;
  private isInitialized: boolean = false;

  constructor() {
    // Lazy init
  }

  public init() {
    if (this.isInitialized) return;
    
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    if (!this.ctx) return;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0; // Start silent
    this.masterGain.connect(this.ctx.destination);

    // 1. Base Oscillator (The Ground / Emptiness)
    this.baseOsc = this.ctx.createOscillator();
    this.baseOsc.type = 'sine';
    this.baseOsc.frequency.value = 432; // Healing frequency
    this.baseOsc.connect(this.masterGain);
    this.baseOsc.start();

    // 2. Flux Oscillator (The Energy / Fire)
    this.fluxOsc = this.ctx.createOscillator();
    this.fluxOsc.type = 'triangle';
    this.fluxOsc.frequency.value = 216; // Lower octave
    const fluxGain = this.ctx.createGain();
    fluxGain.gain.value = 0.1;
    this.fluxOsc.connect(fluxGain);
    fluxGain.connect(this.masterGain);
    this.fluxOsc.start();

    // 3. LFO (The Breath)
    this.lfo = this.ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfo.frequency.value = 0.5; // Slow breath
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 50; // Modulate frequency by +/- 50Hz
    this.lfo.connect(lfoGain);
    // Connect LFO to Flux frequency for "alive" feel
    if (this.fluxOsc) lfoGain.connect(this.fluxOsc.frequency);
    this.lfo.start();

    this.isInitialized = true;
    console.log("[SonicVajra] Audio Context Initialized.");
  }

  // FORCE AWAKENING
  public resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().then(() => {
              console.log("[SonicVajra] Audio Context Resumed.");
          });
      }
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.updateGain();
  }

  // UI INTERACTION SOUND (Bell / Water Drop / Glitch)
  // Tuned for "Superfluidity" - no clicks, strictly typed
  public triggerTone(freq: number = 880, type: OscillatorType = 'sine') {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      // Envelope Shaping (ADSR-like)
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      
      // Attack: Fast but not instant to avoid "pop"
      gain.gain.linearRampToValueAtTime(0.1, now + 0.02); 
      
      // Decay/Release: Exponential for natural ring
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5); 
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.51); // Stop slightly after fade out
      
      // Garage collection logic is handled by browser for finished nodes
  }

  private updateGain() {
    if (!this.masterGain || !this.ctx) return;
    
    // Smooth transition
    const now = this.ctx.currentTime;
    const targetGain = this.isMuted ? 0 : 0.15; // Max volume 15% to avoid ear fatigue
    this.masterGain.gain.setTargetAtTime(targetGain, now, 0.5);
  }

  public updateEntropy(entropy: number) {
    if (!this.isInitialized || !this.ctx || !this.baseOsc || !this.fluxOsc || !this.lfo) return;

    const now = this.ctx.currentTime;
    const rampTime = 2; // Slow organic transition

    // Logic: 
    // Low Entropy -> Pure 432Hz Sine, Slow LFO
    // High Entropy -> Detuned, Sawtooth, Fast LFO

    if (entropy < 0.4) {
      // CALM STATE / NIRVANA PROXIMITY
      this.baseOsc.frequency.setTargetAtTime(432, now, rampTime);
      this.baseOsc.type = 'sine';
      
      this.fluxOsc.frequency.setTargetAtTime(216, now, rampTime);
      this.fluxOsc.type = 'sine';
      
      this.lfo.frequency.setTargetAtTime(0.1, now, rampTime); // Deep, yogic breathing
    
    } else if (entropy < 0.8) {
      // ACTIVE STATE / DISCOURSE
      this.baseOsc.frequency.setTargetAtTime(528, now, rampTime); // Transformation freq
      this.baseOsc.type = 'triangle'; // Add harmonics

      this.fluxOsc.frequency.setTargetAtTime(108 + (entropy * 50), now, rampTime);
      this.lfo.frequency.setTargetAtTime(2 + (entropy * 2), now, rampTime); // Faster pulse

    } else {
      // CHAOS / DISSOLUTION STATE (Earth into Water)
      // Instead of high pitch harshness, we go LOW and RUMBLY
      
      // Detune base slightly for "unease"
      this.baseOsc.frequency.setTargetAtTime(432 - 10, now, 5); 
      this.baseOsc.type = 'sawtooth'; // Harsh texture

      // Deep sub-bass for the "Ground Dissolving" effect
      this.fluxOsc.frequency.setTargetAtTime(40, now, rampTime); 
      this.fluxOsc.type = 'square'; // Heavy
      
      this.lfo.frequency.setTargetAtTime(8, now, rampTime); // Rapid flutter (shaking)
    }
  }
}

export const sonicVajra = new SonicVajraEngine();