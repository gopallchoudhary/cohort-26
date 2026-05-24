class AudioEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private activeAlarmOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private alarmInterval: any = null;

  constructor() {
    // Safely check for window / localStorage in case of SSR or pre-render environments
    if (typeof window !== 'undefined') {
      this.muted = localStorage.getItem('timer_app_muted') === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  isMuted() {
    return this.muted;
  }

  setMuted(mute: boolean) {
    this.muted = mute;
    if (typeof window !== 'undefined') {
      localStorage.setItem('timer_app_muted', String(mute));
    }
    if (mute) {
      this.stopAlarm();
    }
  }

  playClick() {
    if (this.muted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      // Crisp mechanical quick tick
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.warn("Audio click failed:", e);
    }
  }

  playTick() {
    if (this.muted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Minimalist organic watch pulse
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch (e) {
      console.warn("Audio tick failed:", e);
    }
  }

  playAlarm() {
    if (this.muted) return;
    try {
      const ctx = this.initCtx();
      this.stopAlarm(); // clear any running alarm first

      const playBeep = () => {
        if (this.muted) return;
        const now = ctx.currentTime;
        
        // Warm dual-synth ring
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now); // B5 note

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(493.88, now); // B4 note

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc1.start(now);
        osc1.stop(now + 0.45);
        
        osc2.start(now);
        osc2.stop(now + 0.45);

        this.activeAlarmOscillators.push({ osc: osc1, gain }, { osc: osc2, gain });
        
        setTimeout(() => {
          this.activeAlarmOscillators = this.activeAlarmOscillators.filter(
            item => item.osc !== osc1 && item.osc !== osc2
          );
        }, 500);
      };

      playBeep();
      this.alarmInterval = setInterval(playBeep, 650);
    } catch (e) {
      console.warn("Alarm start failed:", e);
    }
  }

  stopAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
    
    this.activeAlarmOscillators.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(0);
        gain.gain.setValueAtTime(gain.gain.value, 0);
        gain.gain.linearRampToValueAtTime(0, 0.05);
        setTimeout(() => osc.disconnect(), 100);
      } catch (e) {}
    });
    this.activeAlarmOscillators = [];
  }
}

export const audio = new AudioEngine();
