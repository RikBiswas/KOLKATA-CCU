import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Headphones } from 'lucide-react';

interface LoFiTrack {
  id: string;
  title: string;
  subtitle: string;
  bengali: string;
  icon: string;
  style: 'coffee' | 'monsoon' | 'tram';
  bpm: number;
  progression: Array<{
    bassFreq: number;
    chordFreqs: number[];
    melodyFreqs: number[];
  }>;
}

// Fundamental Note Frequencies (Hz)
const N = {
  // Sub / Bass
  C2: 65.41, D2: 73.42, Eb2: 77.78, E2: 82.41, F2: 87.31, G2: 98.00, Ab2: 103.83, A2: 110.00, Bb2: 116.54, B2: 123.47,
  // Mid-Low
  C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
  // Mid-High (Piano / Chords)
  C4: 261.63, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, Ab4: 415.30, A4: 440.00, Bb4: 466.16, B4: 493.88,
  // High (Melody / Bells)
  C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
};

const TRACKS: LoFiTrack[] = [
  {
    id: 'coffee-house-lofi',
    title: 'Coffee House Lo-Fi',
    subtitle: 'Upbeat 82 BPM Jazz Bossa-Hop • Nylon chords, cross-stick rim & cafe murmur',
    bengali: 'কফি হাউস লো-ফাই (জ্যাজ হপ)',
    icon: '☕',
    style: 'coffee',
    bpm: 82,
    progression: [
      // Dm9
      {
        bassFreq: N.D2,
        chordFreqs: [N.F3, N.A3, N.C4, N.E4],
        melodyFreqs: [N.A4, N.C5, N.D5],
      },
      // G13
      {
        bassFreq: N.G2,
        chordFreqs: [N.F3, N.B3, N.E4, N.G4],
        melodyFreqs: [N.G4, N.B4, N.E5],
      },
      // Cmaj9
      {
        bassFreq: N.C2,
        chordFreqs: [N.E3, N.G3, N.B3, N.D4],
        melodyFreqs: [N.G4, N.B4, N.D5],
      },
      // A7b9
      {
        bassFreq: N.A2,
        chordFreqs: [N.G3, N.Bb3, N.C4, N.E4],
        melodyFreqs: [N.E4, N.G4, N.C5],
      },
    ],
  },
  {
    id: 'monsoon-victoria',
    title: 'Monsoon Over Victoria',
    subtitle: 'Slow 64 BPM Rainy Downtempo • Felt tape piano, continuous rain & ambient sub',
    bengali: 'ভিক্টোরিয়া মনসুন (অ্যাম্বিয়েন্ট লো-ফাই)',
    icon: '🌧️',
    style: 'monsoon',
    bpm: 64,
    progression: [
      // Fmaj7
      {
        bassFreq: N.F2,
        chordFreqs: [N.F3, N.A3, N.C4, N.E4],
        melodyFreqs: [N.C5, N.A4, N.G4],
      },
      // Em7
      {
        bassFreq: N.E2,
        chordFreqs: [N.E3, N.G3, N.B3, N.D4],
        melodyFreqs: [N.B4, N.G4, N.E4],
      },
      // Dm9
      {
        bassFreq: N.D2,
        chordFreqs: [N.D3, N.F3, N.A3, N.C4, N.E4],
        melodyFreqs: [N.A4, N.F4, N.E4],
      },
      // Cmaj7
      {
        bassFreq: N.C2,
        chordFreqs: [N.C3, N.E3, N.G3, N.B3],
        melodyFreqs: [N.G4, N.E4, N.D4],
      },
    ],
  },
  {
    id: 'midnight-tramway',
    title: 'Midnight Tramway Chillhop',
    subtitle: 'Punchy 76 BPM Urban Boom-Bap • Heavy 808 sub, nocturnal synths & tram bells',
    bengali: 'ট্রামওয়ে চিলহপ (বুম-বাপ বিটস)',
    icon: '🚋',
    style: 'tram',
    bpm: 76,
    progression: [
      // Bbmaj7
      {
        bassFreq: N.Bb2,
        chordFreqs: [N.D4, N.F4, N.A4, N.C5],
        melodyFreqs: [N.D5, N.C5, N.F4],
      },
      // Am7
      {
        bassFreq: N.A2,
        chordFreqs: [N.C4, N.E4, N.G4, N.C5],
        melodyFreqs: [N.C5, N.A4, N.E4],
      },
      // Gm9
      {
        bassFreq: N.G2,
        chordFreqs: [N.Bb3, N.D4, N.F4, N.A4],
        melodyFreqs: [N.Bb4, N.A4, N.D4],
      },
      // Fmaj9
      {
        bassFreq: N.F2,
        chordFreqs: [N.A3, N.C4, N.E4, N.G4],
        melodyFreqs: [N.A4, N.G4, N.C4],
      },
    ],
  },
];

export const CalcuttaSoundscape: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.45);

  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientNodeRef = useRef<{ stop: () => void } | null>(null);
  const isPlayingRef = useRef(false);
  const schedulerTimerRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const nextNoteTimeRef = useRef(0);

  const currentTrack = TRACKS[currentTrackIndex];

  // Helper to safely get or resume AudioContext
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const master = ctx.createGain();
      master.gain.setValueAtTime(volume, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  // Stop ambient background layer
  const stopAmbient = () => {
    if (ambientNodeRef.current) {
      try {
        ambientNodeRef.current.stop();
      } catch {
        // ignore
      }
      ambientNodeRef.current = null;
    }
  };

  // Start distinct ambient texture based on track style
  const startAmbient = (ctx: AudioContext, master: GainNode, style: 'coffee' | 'monsoon' | 'tram') => {
    stopAmbient();

    if (style === 'monsoon') {
      // 🌧️ Continuous soothing monsoon rain & distant deep thunder roll
      const bufferSize = ctx.sampleRate * 4;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Pink noise algorithm for rainfall texture
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.12;
      }

      const rainSource = ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(1100, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.08, ctx.currentTime);

      rainSource.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(master);
      rainSource.start();

      ambientNodeRef.current = {
        stop: () => {
          try {
            rainSource.stop();
          } catch {}
        },
      };

    } else if (style === 'coffee') {
      // ☕ Warm acoustic room murmur + vinyl dust
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        if (Math.random() < 0.0004) {
          output[i] += (Math.random() - 0.5) * 0.3; // soft vinyl crackle
        }
      }

      const cafeSource = ctx.createBufferSource();
      cafeSource.buffer = noiseBuffer;
      cafeSource.loop = true;

      const cafeFilter = ctx.createBiquadFilter();
      cafeFilter.type = 'bandpass';
      cafeFilter.frequency.setValueAtTime(550, ctx.currentTime);
      cafeFilter.Q.setValueAtTime(0.8, ctx.currentTime);

      const cafeGain = ctx.createGain();
      cafeGain.gain.setValueAtTime(0.05, ctx.currentTime);

      cafeSource.connect(cafeFilter);
      cafeFilter.connect(cafeGain);
      cafeGain.connect(master);
      cafeSource.start();

      ambientNodeRef.current = {
        stop: () => {
          try {
            cafeSource.stop();
          } catch {}
        },
      };

    } else {
      // 🚋 Midnight street vinyl crackle & nocturnal tape air
      const bufferSize = ctx.sampleRate * 2.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.015;
        if (Math.random() < 0.0008) {
          output[i] += (Math.random() - 0.5) * 0.5; // crisp vinyl needle pop
        }
      }

      const vinylSource = ctx.createBufferSource();
      vinylSource.buffer = noiseBuffer;
      vinylSource.loop = true;

      const vinylFilter = ctx.createBiquadFilter();
      vinylFilter.type = 'highpass';
      vinylFilter.frequency.setValueAtTime(800, ctx.currentTime);

      const vinylGain = ctx.createGain();
      vinylGain.gain.setValueAtTime(0.05, ctx.currentTime);

      vinylSource.connect(vinylFilter);
      vinylFilter.connect(vinylGain);
      vinylGain.connect(master);
      vinylSource.start();

      ambientNodeRef.current = {
        stop: () => {
          try {
            vinylSource.stop();
          } catch {}
        },
      };
    }
  };

  /* -------------------------------------------------------------
   * STYLE 1: COFFEE HOUSE JAZZ-HOP (Acoustic Pluck / Bossa Grooves)
   * ------------------------------------------------------------- */

  // Acoustic Jazz Guitar / Nylon Pluck Chord
  const playJazzGuitarChord = (ctx: AudioContext, master: GainNode, time: number, freqs: number[]) => {
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      // Triangle gives warm wooden nylon string body
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      // Acoustic string pluck lowpass filter with snappy decay
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, time);
      filter.frequency.exponentialRampToValueAtTime(600, time + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, time);
      // Stagger string pluck slightly (10ms) like fingers raking across nylon strings
      const pluckTime = time + idx * 0.012;
      gain.gain.setValueAtTime(0.0001, pluckTime);
      gain.gain.linearRampToValueAtTime(0.08 / Math.sqrt(freqs.length), pluckTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, pluckTime + 0.85);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(pluckTime);
      osc.stop(pluckTime + 0.9);
    });
  };

  // Upright Acoustic Bass Pluck
  const playUprightBass = (ctx: AudioContext, master: GainNode, time: number, freq: number) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.2, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.65);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    osc.start(time);
    osc.stop(time + 0.7);
  };

  // Bossa Cross-Stick Rim Click
  const playBossaRim = (ctx: AudioContext, master: GainNode, time: number) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, time);
    osc.frequency.exponentialRampToValueAtTime(240, time + 0.035);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);

    osc.connect(gain);
    gain.connect(master);

    osc.start(time);
    osc.stop(time + 0.05);
  };

  // Brushed Soft Hi-Hat
  const playBrushedHat = (ctx: AudioContext, master: GainNode, time: number) => {
    const bufferSize = Math.floor(ctx.sampleRate * 0.04);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(6500, time);
    filter.Q.setValueAtTime(1.5, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.038);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    noise.start(time);
    noise.stop(time + 0.04);
  };

  /* -------------------------------------------------------------
   * STYLE 2: MONSOON OVER VICTORIA (Slow Felt Piano & Rain Ambient)
   * ------------------------------------------------------------- */

  // Mellow Felt Grand Piano (Slow, warm, sustained, deeply emotional)
  const playFeltPianoChord = (ctx: AudioContext, master: GainNode, time: number, freqs: number[]) => {
    freqs.forEach((freq) => {
      // Sine wave with soft tape warmth
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      // Deep felt damper low-pass filter (cuts harsh highs)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, time);
      filter.frequency.exponentialRampToValueAtTime(320, time + 3.2);

      // Slow gentle attack, long 3.5s natural room resonance
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.09 / Math.sqrt(freqs.length), time + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 3.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(time);
      osc.stop(time + 3.5);
    });
  };

  // Delicate Raindrop Kalimba / Water Ping
  const playRaindropPing = (ctx: AudioContext, master: GainNode, time: number, freq: number) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.065, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.85);

    osc.connect(gain);
    gain.connect(master);

    osc.start(time);
    osc.stop(time + 0.9);
  };

  // Ambient Heartbeat Sub Pulse (no harsh kick, just deep warm breathing room)
  const playAmbientSubPulse = (ctx: AudioContext, master: GainNode, time: number) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.45);

    osc.connect(gain);
    gain.connect(master);

    osc.start(time);
    osc.stop(time + 0.5);
  };

  /* -------------------------------------------------------------
   * STYLE 3: MIDNIGHT TRAMWAY CHILLHOP (Urban Boom-Bap & 808 Beats)
   * ------------------------------------------------------------- */

  // Punchy Lo-Fi Boom-Bap Kick Drum
  const playBoomBapKick = (ctx: AudioContext, master: GainNode, time: number) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(45, time + 0.09);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);

    osc.connect(gain);
    gain.connect(master);

    osc.start(time);
    osc.stop(time + 0.3);
  };

  // Snappy Lo-Fi Snare (Crisp noise burst + wooden crack)
  const playBoomBapSnare = (ctx: AudioContext, master: GainNode, time: number) => {
    const bufferSize = Math.floor(ctx.sampleRate * 0.14);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1400, time);
    noiseFilter.Q.setValueAtTime(2.2, time);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.22, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);

    const body = ctx.createOscillator();
    body.type = 'triangle';
    body.frequency.setValueAtTime(210, time);
    body.frequency.exponentialRampToValueAtTime(100, time + 0.05);

    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(0.18, time);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);

    body.connect(bodyGain);
    bodyGain.connect(master);

    noise.start(time);
    noise.stop(time + 0.14);
    body.start(time);
    body.stop(time + 0.07);
  };

  // Heavy 808 Sub-Bass Note
  const play808Bass = (ctx: AudioContext, master: GainNode, time: number, freq: number) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.25, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.85);

    osc.connect(gain);
    gain.connect(master);

    osc.start(time);
    osc.stop(time + 0.9);
  };

  // Nocturnal Synth Pad Chords with Rich Chorus & Detune
  const playNocturnalSynthPad = (ctx: AudioContext, master: GainNode, time: number, freqs: number[]) => {
    freqs.forEach((freq) => {
      // Dual oscillator for lush analog chorus
      [-3, 3].forEach((detuneCents) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);
        osc.detune.setValueAtTime(detuneCents, time);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, time);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(0.045 / Math.sqrt(freqs.length), time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);

        osc.start(time);
        osc.stop(time + 2.0);
      });
    });
  };

  // Tramway Bell Double-Ding Harmonic Accent (1200Hz brass chime)
  const playTramBellChime = (ctx: AudioContext, master: GainNode, time: number) => {
    [0, 0.18].forEach((delay) => {
      const chimeTime = time + delay;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1240, chimeTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, chimeTime);
      gain.gain.linearRampToValueAtTime(0.12, chimeTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, chimeTime + 0.65);

      osc.connect(gain);
      gain.connect(master);

      osc.start(chimeTime);
      osc.stop(chimeTime + 0.7);
    });
  };

  // Hi-Hat Shaker for Boom-Bap
  const playBoomBapHat = (ctx: AudioContext, master: GainNode, time: number, open: boolean) => {
    const dur = open ? 0.08 : 0.035;
    const bufferSize = Math.floor(ctx.sampleRate * dur);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5000, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(open ? 0.08 : 0.045, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);

    noise.start(time);
    noise.stop(time + dur);
  };

  /* -------------------------------------------------------------
   * MASTER SEQUENCER & DISPATCHER
   * ------------------------------------------------------------- */
  const startLoFiSequencer = (track: LoFiTrack) => {
    const ctx = getAudioContext();
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    isPlayingRef.current = true;
    startAmbient(ctx, master, track.style);

    const secondsPerBeat = 60.0 / track.bpm;
    const stepDuration = secondsPerBeat / 4.0; // 16th note step

    stepRef.current = 0;
    nextNoteTimeRef.current = ctx.currentTime + 0.05;

    const schedule = () => {
      if (!isPlayingRef.current) return;

      while (nextNoteTimeRef.current < ctx.currentTime + 0.18) {
        const step = stepRef.current;
        const time = nextNoteTimeRef.current;

        const barIndex = Math.floor(step / 16) % track.progression.length;
        const currentChord = track.progression[barIndex];
        const stepInBar = step % 16;
        const subStep = stepInBar % 4; // 0: on-beat, 1: 16th, 2: 8th, 3: 16th

        // -------------------------------------------------------------
        // BRANCH BY STYLE FOR COMPLETELY DIFFERENT GENRE BEATS
        // -------------------------------------------------------------
        if (track.style === 'coffee') {
          // Track 1: Upbeat Jazz-Hop / Bossa-Hop (82 BPM)
          // Syncopated guitar comping on steps 0, 3, 6, 10
          if (stepInBar === 0 || stepInBar === 3 || stepInBar === 6 || stepInBar === 10) {
            playJazzGuitarChord(ctx, master, time, currentChord.chordFreqs);
          }

          // Walking Upright Bass on beat 1 and beat 3 (step 0 and 8)
          if (stepInBar === 0 || stepInBar === 8) {
            playUprightBass(ctx, master, time, currentChord.bassFreq);
          } else if (stepInBar === 14) {
            // chromatic leading note
            playUprightBass(ctx, master, time, currentChord.bassFreq * 1.06);
          }

          // Bossa cross-stick rim on step 4, 10, 12
          if (stepInBar === 4 || stepInBar === 10 || stepInBar === 12) {
            playBossaRim(ctx, master, time);
          }

          // Swung brushed hi-hats on 8th notes (0, 2, 4, 6, 8, 10, 12, 14)
          if (subStep === 0 || subStep === 2) {
            playBrushedHat(ctx, master, time);
          }

        } else if (track.style === 'monsoon') {
          // Track 2: Slow Rainy Felt Piano Downtempo (64 BPM)
          // Long sustained felt piano chord once per bar (step 0)
          if (stepInBar === 0) {
            playFeltPianoChord(ctx, master, time, currentChord.chordFreqs);
            playAmbientSubPulse(ctx, master, time);
          }

          // Raindrop water pings scattered gently
          if (stepInBar === 3) {
            playRaindropPing(ctx, master, time, currentChord.melodyFreqs[0]);
          } else if (stepInBar === 7) {
            playRaindropPing(ctx, master, time, currentChord.melodyFreqs[1]);
          } else if (stepInBar === 11) {
            playRaindropPing(ctx, master, time, currentChord.melodyFreqs[2]);
          }

        } else {
          // Track 3: Midnight Tramway Urban Boom-Bap (76 BPM)
          // Heavy nocturnal synth pad on step 0 and pushed on step 8
          if (stepInBar === 0 || stepInBar === 8) {
            playNocturnalSynthPad(ctx, master, time, currentChord.chordFreqs);
          }

          // Heavy 808 Sub-Bass on step 0 and syncopated step 10
          if (stepInBar === 0 || stepInBar === 10) {
            play808Bass(ctx, master, time, currentChord.bassFreq);
          }

          // Boom-Bap Kick on step 0 and step 10
          if (stepInBar === 0 || stepInBar === 10) {
            playBoomBapKick(ctx, master, time);
          }

          // Crisp Snare on beat 2 (step 4) and beat 4 (step 12)
          if (stepInBar === 4 || stepInBar === 12) {
            playBoomBapSnare(ctx, master, time);
          }

          // Crisp 16th-note shakers / hats
          if (subStep === 0 || subStep === 2) {
            playBoomBapHat(ctx, master, time, stepInBar === 14);
          }

          // Tram bell ding on bar 4 step 12
          if (barIndex === 3 && stepInBar === 12) {
            playTramBellChime(ctx, master, time);
          }
        }

        // Advance timing with laid-back swing
        const swing = subStep === 1 || subStep === 3 ? 0.02 : -0.02;
        nextNoteTimeRef.current += Math.max(0.01, stepDuration + swing);
        stepRef.current = (stepRef.current + 1) % (track.progression.length * 16);
      }
    };

    if (schedulerTimerRef.current) {
      clearInterval(schedulerTimerRef.current);
    }
    schedulerTimerRef.current = window.setInterval(schedule, 35);
  };

  const stopMusic = () => {
    isPlayingRef.current = false;
    if (schedulerTimerRef.current) {
      clearInterval(schedulerTimerRef.current);
      schedulerTimerRef.current = null;
    }
    stopAmbient();
  };

  useEffect(() => {
    if (isPlaying) {
      startLoFiSequencer(TRACKS[currentTrackIndex]);
    } else {
      stopMusic();
    }
    return () => {
      stopMusic();
    };
  }, [isPlaying, currentTrackIndex]);

  // Handle live volume change
  useEffect(() => {
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    }
  }, [volume]);

  const togglePlay = () => {
    getAudioContext();
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Lo-Fi Music Player Drawer */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-92 p-5 rounded-3xl bg-[#FFF8EF]/95 backdrop-blur-xl border border-[#E8D5C2] shadow-[0_20px_45px_rgba(53,30,26,0.18)] animate-slide-in-right">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D5C2]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C6532B] text-white flex items-center justify-center shadow-xs">
                <Headphones className="w-4 h-4 text-[#FFF8EF]" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[#351E1A] leading-tight flex items-center gap-1.5">
                  <span>Calcutta Lo-Fi Radio</span>
                  <span className="w-2 h-2 rounded-full bg-[#C6532B] animate-ping" />
                </h4>
                <span className="font-bengali text-[11px] text-[#C6532B]">
                  কলকাতা লো-ফাই রেডিও
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#351E1A]/50 hover:text-[#351E1A] p-1 cursor-pointer"
              aria-label="Close radio drawer"
            >
              &times;
            </button>
          </div>

          {/* Subtitle description */}
          <p className="text-[11px] font-sans text-[#351E1A]/70 pt-2 pb-1">
            Three distinct Lo-Fi moods: Jazzy Bossa-Hop, Rainy Felt Piano, & Midnight Boom-Bap.
          </p>

          {/* Track Selector List */}
          <div className="py-2.5 space-y-2">
            {TRACKS.map((t, idx) => {
              const active = idx === currentTrackIndex;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    getAudioContext();
                    setCurrentTrackIndex(idx);
                    if (!isPlaying) setIsPlaying(true);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                    active
                      ? 'bg-[#F7EBDD] border-[#C6532B] shadow-xs'
                      : 'bg-[#FFF8EF] border-[#E8D5C2]/60 hover:bg-[#F7EBDD]/60'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`font-serif text-xs font-bold truncate ${
                          active ? 'text-[#C6532B]' : 'text-[#351E1A]'
                        }`}
                      >
                        {t.title}
                      </p>
                      {active && isPlaying && (
                        <span className="flex items-end gap-0.5 h-3">
                          <span className="w-1 h-2.5 bg-[#C6532B] rounded-full animate-pulse" />
                          <span className="w-1 h-3.5 bg-[#C6532B] rounded-full animate-pulse delay-75" />
                          <span className="w-1 h-2 bg-[#C6532B] rounded-full animate-pulse delay-150" />
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-[10px] text-[#351E1A]/75 mt-0.5 leading-snug">{t.subtitle}</p>
                    <span className="font-bengali text-[10px] text-[#582822]/60 block mt-0.5">{t.bengali}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Controls: Play/Pause & Volume Slider */}
          <div className="pt-2.5 border-t border-[#E8D5C2] flex items-center justify-between gap-3">
            <button
              onClick={togglePlay}
              className="px-4 py-2 rounded-full bg-[#C6532B] hover:bg-[#B04520] text-[#FFF8EF] text-xs font-sans font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              aria-label={isPlaying ? 'Pause Lo-Fi music' : 'Play Lo-Fi music'}
            >
              {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause Music' : 'Play Lo-Fi'}</span>
            </button>

            <div className="flex items-center gap-1.5 flex-1 max-w-[125px]">
              <span className="text-[10px] text-[#351E1A]/60 font-mono">Vol</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full accent-[#C6532B] cursor-pointer h-1.5 bg-[#E8D5C2] rounded-lg"
                aria-label="Lo-Fi volume control"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Pill Button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className="group px-4 py-2.5 rounded-full bg-[#351E1A] hover:bg-[#582822] text-[#FFF8EF] border border-[#E8D5C2]/30 shadow-[0_8px_24px_rgba(53,30,26,0.22)] flex items-center gap-2.5 text-xs font-sans transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
        title="Calcutta Chill Lo-Fi Radio"
        aria-label="Toggle Calcutta Lo-Fi Radio drawer"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <Headphones className={`w-3.5 h-3.5 text-[#C5A25A] ${isPlaying ? 'animate-bounce' : ''}`} />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C6532B] animate-ping" />
          )}
        </div>
        <span className="font-serif font-bold tracking-wide">
          {isPlaying ? currentTrack.title.split(' ')[0] : 'Lo-Fi Radio'}
        </span>
        <span className="hidden sm:inline-block font-script text-[#C5A25A] text-sm">
          {isPlaying ? 'playing chill...' : '~ chill beats ~'}
        </span>
      </button>
    </div>
  );
};
