// Procedural audio engine using Web Audio API (Zero external assets, instant & offline)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Sound enabled preference
export function isAudioEnabled(): boolean {
  try {
    const saved = localStorage.getItem('beloteSoundEnabled');
    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
}

export function setAudioEnabled(enabled: boolean): void {
  try {
    localStorage.setItem('beloteSoundEnabled', enabled ? 'true' : 'false');
    if (!enabled) {
      stopVictoryCelebration();
    }
  } catch {}
}

/**
 * 1. Clic bouton très léger et subtil
 */
export function playButtonClick(): void {
  if (!isAudioEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startTime = ctx.currentTime;
    
    // Quick pitch sweep for a snappy, subtle tactile click
    osc.frequency.setValueAtTime(600, startTime);
    osc.frequency.exponentialRampToValueAtTime(240, startTime + 0.035);

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.04);
  } catch {
    // Audio autoplay restrictions or unsupported
  }
}

/**
 * 2. Validation d'un tour (carillon mélodieux et gratifiant)
 */
export function playRoundSuccess(): void {
  if (!isAudioEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Chime frequencies: F5 (698.46Hz), A5 (880Hz), C6 (1046.5Hz)
    const notes = [698.46, 880.0, 1046.5];

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.09);

      const noteStart = now + index * 0.09;
      const noteDuration = 0.35;

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.12, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + noteDuration + 0.05);
    });
  } catch {
    // Audio restrictions
  }
}

/**
 * 3. Fanfare de victoire
 */
export function playVictoryFanfare(): void {
  if (!isAudioEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Triumphant fanfare notes: C5, E5, G5, High C6 held
    const notes = [
      { freq: 523.25, time: 0, dur: 0.15 },
      { freq: 659.25, time: 0.14, dur: 0.15 },
      { freq: 783.99, time: 0.28, dur: 0.22 },
      { freq: 1046.5, time: 0.48, dur: 0.8 },
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      const noteStart = now + time;
      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.2, noteStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + dur + 0.05);
    });
  } catch {
    // Audio restrictions
  }
}

/**
 * 4. Applaudissements chaleureux synthétisés (Crowd applause)
 * Utilise des impulsions de bruit blanc filtré simulant des claquements de mains multiples.
 */
export function playApplause(durationSeconds: number = 3.5): void {
  if (!isAudioEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * durationSeconds;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate textured clap noise with randomized density
    for (let i = 0; i < bufferSize; i++) {
      // Base white noise
      const white = Math.random() * 2 - 1;
      // Irregular clapping pulse clusters
      const clapCluster = Math.sin(i / 150) * Math.sin(i / 370);
      output[i] = white * (0.6 + 0.4 * clapCluster);
    }

    const whiteNoiseSource = ctx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;

    // Filter to sound like natural acoustic hand claps (Bandpass 1200Hz - 2400Hz)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    // Master applause volume envelope: swells up, stays strong, gently fades out
    const masterGain = ctx.createGain();
    const now = ctx.currentTime;
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.18, now + 0.35); // swell in
    masterGain.gain.setValueAtTime(0.18, now + durationSeconds * 0.65);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds); // fade out

    whiteNoiseSource.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    whiteNoiseSource.start(now);
    whiteNoiseSource.stop(now + durationSeconds + 0.1);
  } catch {
    // Audio restrictions
  }
}

const APPLAUSE_AUDIO_PATH = '/assets/aistudio/pwlpl-applause-sound-effect-521104_bb08279f.mp3';
let victoryAudioInstance: HTMLAudioElement | null = null;

export function stopVictoryCelebration(): void {
  if (victoryAudioInstance) {
    try {
      victoryAudioInstance.pause();
      victoryAudioInstance.currentTime = 0;
    } catch {}
  }
}

/**
 * Célébration de victoire : utilise le fichier audio d'applaudissements dédié
 * uniquement quand la fenêtre de partie gagnée apparaît.
 */
export function playVictoryCelebration(): void {
  if (!isAudioEnabled()) return;
  try {
    if (!victoryAudioInstance) {
      victoryAudioInstance = new Audio(APPLAUSE_AUDIO_PATH);
    } else {
      victoryAudioInstance.currentTime = 0;
    }
    victoryAudioInstance.volume = 0.85;
    victoryAudioInstance.play().catch(() => {});
  } catch {
    // Fallback if audio cannot play
  }
}
