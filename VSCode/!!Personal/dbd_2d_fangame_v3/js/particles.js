import { rand, clamp } from "./utils.js";

export class ParticleSystem {
  constructor() {
    this.items = [];
  }

  burst(x, y, color = "#fff", n = 10, power = 90, life = 0.7) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2);
      const s = rand(power * 0.25, power);
      this.items.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        r: rand(2, 5),
        color,
        life: rand(life * 0.55, life),
        max: life
      });
    }
  }

  trail(x, y, color = "rgba(255,80,80,0.75)") {
    this.items.push({
      x, y,
      vx: rand(-12, 12),
      vy: rand(-12, 12),
      r: rand(3, 7),
      color,
      life: rand(2.5, 4.8),
      max: 4.8
    });
  }

  update(dt) {
    for (const p of this.items) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= dt;
    }
    this.items = this.items.filter(p => p.life > 0);
  }

  draw(ctx, cam) {
    for (const p of this.items) {
      const a = clamp(p.life / p.max, 0, 1);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x - cam.x, p.y - cam.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}
