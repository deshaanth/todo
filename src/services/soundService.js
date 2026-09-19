// Web Audio API Synthesizer Sound Service for Alarms

let audioCtx = null;
let currentOscillators = [];
let alarmLoopInterval = null;

const getAudioContext = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Play a single synthesized tone sequence based on sound preset
const playToneSequence = (soundType, volume = 0.8) => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.4, now);
    gainNode.connect(ctx.destination);

    if (soundType === 'digital') {
      // Beep-beep alarm pulse
      [0, 0.15, 0.3].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880 + idx * 20, now + offset);
        osc.connect(gainNode);
        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
        currentOscillators.push(osc);
      });
    } else if (soundType === 'bell') {
      // Harmonic gentle bell
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);
        osc.connect(gainNode);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.6);
        currentOscillators.push(osc);
      });
    } else if (soundType === 'synth') {
      // Modern electronic sweep
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.4);
      currentOscillators.push(osc);
    } else {
      // Default: Chime Pulse (C5, G5, C6 melodic burst)
      const notes = [523.25, 783.99, 1046.50];
      notes.forEach((note, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, now + i * 0.12);
        osc.connect(gainNode);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.25);
        currentOscillators.push(osc);
      });
    }
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
};

export const soundService = {
  playAlarm: (soundType = 'chime', volume = 0.8) => {
    soundService.stopAlarm();
    playToneSequence(soundType, volume);
    alarmLoopInterval = setInterval(() => {
      playToneSequence(soundType, volume);
    }, 1200);
  },

  stopAlarm: () => {
    if (alarmLoopInterval) {
      clearInterval(alarmLoopInterval);
      alarmLoopInterval = null;
    }
    currentOscillators.forEach((osc) => {
      try { osc.stop(); } catch (e) {}
    });
    currentOscillators = [];
  },

  previewSound: (soundType = 'chime', volume = 0.8) => {
    soundService.stopAlarm();
    playToneSequence(soundType, volume);
    setTimeout(() => {
      soundService.stopAlarm();
    }, 1200);
  }
};
