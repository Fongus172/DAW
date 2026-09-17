export class AudioManager {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.heartbeatTimer = 0;
  }

  unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) this.ctx = new Ctx();
    }
    if (this.ctx?.state === "suspended") this.ctx.resume();
  }

  tone(freq = 440, duration = 0.08, type = "sine", gain = 0.035) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gain, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  noise(duration = 0.12, gain = 0.035) {
    if (!this.enabled || !this.ctx) return;
    const sr = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, Math.floor(sr * duration), sr);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    const g = this.ctx.createGain();
    g.gain.value = gain;
    src.buffer = buffer;
    src.connect(g);
    g.connect(this.ctx.destination);
    src.start();
  }

  hit() {
    this.noise(0.18, 0.055);
    this.tone(110, 0.12, "sawtooth", 0.035);
  }

  genDone() {
    this.tone(660, 0.08, "square", 0.035);
    setTimeout(() => this.tone(880, 0.08, "square", 0.035), 90);
    setTimeout(() => this.tone(990, 0.12, "triangle", 0.03), 180);
  }

  skill(ok) {
    this.tone(ok ? 780 : 140, ok ? 0.06 : 0.2, ok ? "triangle" : "sawtooth", ok ? 0.028 : 0.05);
  }

  ui() {
    this.tone(360, 0.05, "triangle", 0.018);
  }

  updateHeartbeat(dt, intensity) {
    if (!this.enabled || !this.ctx || intensity <= 0) return;
    this.heartbeatTimer -= dt;
    const interval = 0.95 - Math.min(0.65, intensity * 0.65);
    if (this.heartbeatTimer <= 0) {
      this.heartbeatTimer = interval;
      this.tone(70, 0.06, "sine", 0.05 * intensity);
      setTimeout(() => this.tone(55, 0.07, "sine", 0.045 * intensity), 105);
    }
  }
}
