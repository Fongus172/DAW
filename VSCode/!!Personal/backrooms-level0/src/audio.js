export class Ambience {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.humGain = null;
    this.flickerGain = null;
    this.started = false;
  }

  start() {
    if (this.started) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.ctx = new AudioContext();

    this.master = this.ctx.createGain();
    this.master.gain.value = 0.055;
    this.master.connect(this.ctx.destination);

    const humA = this.ctx.createOscillator();
    humA.type = "sine";
    humA.frequency.value = 58;

    const humB = this.ctx.createOscillator();
    humB.type = "sawtooth";
    humB.frequency.value = 116;

    const humFilter = this.ctx.createBiquadFilter();
    humFilter.type = "lowpass";
    humFilter.frequency.value = 420;

    this.humGain = this.ctx.createGain();
    this.humGain.gain.value = 0.18;

    humA.connect(this.humGain);
    humB.connect(this.humGain);
    this.humGain.connect(humFilter);
    humFilter.connect(this.master);

    const flicker = this.ctx.createOscillator();
    flicker.type = "square";
    flicker.frequency.value = 7.2;

    const flickerFilter = this.ctx.createBiquadFilter();
    flickerFilter.type = "highpass";
    flickerFilter.frequency.value = 900;

    this.flickerGain = this.ctx.createGain();
    this.flickerGain.gain.value = 0.012;

    flicker.connect(this.flickerGain);
    this.flickerGain.connect(flickerFilter);
    flickerFilter.connect(this.master);

    humA.start();
    humB.start();
    flicker.start();

    this.started = true;
  }

  update(intensity, time) {
    if (!this.started || !this.ctx) return;

    const wobble = 0.5 + Math.sin(time * 0.0009) * 0.5;
    const pulse = 0.5 + Math.sin(time * 0.008) * 0.5;

    this.humGain.gain.setTargetAtTime(
      0.14 + intensity * 0.08 + wobble * 0.025,
      this.ctx.currentTime,
      0.08
    );

    this.flickerGain.gain.setTargetAtTime(
      0.006 + intensity * 0.02 + pulse * 0.006,
      this.ctx.currentTime,
      0.04
    );
  }
}