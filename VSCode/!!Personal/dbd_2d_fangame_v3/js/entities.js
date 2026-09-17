import { COLORS, ITEMS, SURVIVORS, GAME } from "./config.js";
import { clamp, dist, rand } from "./utils.js";

let NEXT = 1;

export class Entity {
  constructor(x, y, r = 14) {
    this.id = NEXT++;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.r = r;
    this.dead = false;
    this.stuck = false;
  }

  drawCircle(ctx, cam, color, stroke = "#111") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x - cam.x, this.y - cam.y, this.r, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export class Survivor extends Entity {
  constructor(x, y, charId, isPlayer = false) {
    super(x, y, 14);
    this.char = SURVIVORS[charId];
    this.isPlayer = isPlayer;
    this.role = "survivor";
    this.name = this.char.name;
    this.state = "healthy";
    this.onHook = false;
    this.hookCount = 0;
    this.hookTimer = 0;
    this.carried = false;
    this.inLocker = null;
    this.escaped = false;
    this.bleedout = 150 * this.char.courage;
    this.recover = 0;
    this.endurance = 0;
    this.invuln = 0;
    this.stamina = 100;
    this.item = { ...ITEMS.none };
    this.score = { repair: 0, altruism: 0, boldness: 0, survival: 0 };
    this.action = null;
    this.scream = 0;
    this.revealed = 0;
    this.markTrails = [];
    this.lastDir = { x: 1, y: 0 };
    this.ai = {
      goal: "repair",
      target: null,
      think: 0,
      panic: 0,
      stuckThink: 0,
      wander: { x, y },
      memory: null
    };
  }

  get alive() {
    return !this.dead && !this.escaped;
  }

  get interactable() {
    return this.alive && !this.carried && !this.onHook && !this.inLocker;
  }

  speed(sprinting = false) {
    if (this.onHook || this.carried || this.inLocker || this.dead || this.escaped) return 0;
    if (this.state === "downed") return 38;
    return sprinting ? this.char.sprint : this.char.speed;
  }

  hit() {
    if (!this.alive || this.invuln > 0 || this.onHook || this.carried || this.inLocker) return false;
    if (this.endurance > 0) {
      this.endurance = 0;
      this.invuln = 1.4;
      this.scream = 0.9;
      return "endurance";
    }
    if (this.state === "healthy") {
      this.state = "injured";
      this.invuln = 1.0;
      this.scream = 1.1;
      return "injured";
    }
    if (this.state === "injured") {
      this.state = "downed";
      this.recover = 0;
      this.invuln = 1.0;
      this.scream = 1.2;
      return "downed";
    }
    return false;
  }

  healOneState() {
    if (this.state === "downed") {
      this.state = "injured";
      this.recover = 0;
      this.bleedout = Math.max(this.bleedout, 80);
      return true;
    }
    if (this.state === "injured") {
      this.state = "healthy";
      return true;
    }
    return false;
  }

  update(dt) {
    this.invuln = Math.max(0, this.invuln - dt);
    this.endurance = Math.max(0, this.endurance - dt);
    this.scream = Math.max(0, this.scream - dt);
    this.revealed = Math.max(0, this.revealed - dt);

    if (this.state === "downed" && !this.carried && !this.onHook && this.alive) {
      this.bleedout -= dt / this.char.courage;
      if (this.bleedout <= 0) this.dead = true;
    }

    for (const t of this.markTrails) t.life -= dt;
    this.markTrails = this.markTrails.filter(t => t.life > 0);
  }

  draw(ctx, cam) {
    if (!this.alive || this.inLocker) return;

    let c = this.isPlayer ? this.char.color : "#8dff98";
    if (this.state === "injured") c = COLORS.injured;
    if (this.state === "downed") c = COLORS.downed;
    if (this.onHook) c = COLORS.blood;

    if (this.endurance > 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(this.x - cam.x, this.y - cam.y, this.r + 5, 0, Math.PI*2);
      ctx.stroke();
    }

    this.drawCircle(ctx, cam, c);
    ctx.fillStyle = "#111";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.char.icon, this.x - cam.x, this.y - cam.y);

    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#fff";
    ctx.font = "11px Arial";
    ctx.fillText(this.name, this.x - cam.x, this.y - cam.y - 23);

    if (this.scream > 0) {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 22px Arial";
      ctx.fillText("!", this.x - cam.x, this.y - cam.y - 38);
    }

    if (this.item.id !== "none") {
      ctx.fillStyle = "#f3e7ad";
      ctx.fillRect(this.x - cam.x - 5, this.y - cam.y + 15, 10, 6);
    }
  }
}

export class Killer extends Entity {
  constructor(x, y, isPlayer = false) {
    super(x, y, 17);
    this.role = "killer";
    this.isPlayer = isPlayer;
    this.name = "El Guardián";
    this.baseSpeed = 152;
    this.attackCd = 0;
    this.attackFx = 0;
    this.stun = 0;
    this.carrying = null;
    this.powerCd = 0;
    this.powerActive = 0;
    this.trapCd = 0;
    this.bloodlust = 0;
    this.lastDir = { x: -1, y: 0 };
    this.action = null;
    this.ai = {
      goal: "patrol",
      target: null,
      patrol: null,
      think: 0,
      investigate: null,
      lostTimer: 0
    };
  }

  get speed() {
    let s = this.baseSpeed + Math.min(34, this.bloodlust * 9);
    if (this.carrying) s *= 0.82;
    if (this.powerActive > 0) s = 430;
    if (this.stun > 0) s = 0;
    return s;
  }

  update(dt) {
    this.attackCd = Math.max(0, this.attackCd - dt);
    this.attackFx = Math.max(0, this.attackFx - dt);
    this.stun = Math.max(0, this.stun - dt);
    this.powerCd = Math.max(0, this.powerCd - dt);
    this.powerActive = Math.max(0, this.powerActive - dt);
    this.trapCd = Math.max(0, this.trapCd - dt);
  }

  draw(ctx, cam) {
    const c = this.stun > 0 ? "#777" : (this.powerActive > 0 ? "#ff6d6d" : COLORS.red);

    ctx.strokeStyle = "rgba(190,45,45,0.10)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x - cam.x, this.y - cam.y, 300, 0, Math.PI*2);
    ctx.stroke();

    this.drawCircle(ctx, cam, c);

    ctx.fillStyle = "#111";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("☠", this.x - cam.x, this.y - cam.y);

    if (this.attackFx > 0) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(this.x - cam.x, this.y - cam.y, 42, 0, Math.PI*2);
      ctx.stroke();
    }

    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#fff";
    ctx.font = "11px Arial";
    ctx.fillText("KILLER", this.x - cam.x, this.y - cam.y - 26);
  }
}

export class Generator extends Entity {
  constructor(x, y) {
    super(x, y, 22);
    this.progress = 0;
    this.done = false;
    this.regress = 0;
    this.users = new Set();
    this.flash = 0;
    this.noise = 0;
  }

  update(dt) {
    this.flash = Math.max(0, this.flash - dt);
    this.noise = Math.max(0, this.noise - dt);
    if (!this.done && this.regress > 0 && this.users.size === 0) {
      this.regress -= dt;
      this.progress = clamp(this.progress - dt * 0.020, 0, 0.99);
    }
    if (this.progress >= 1) {
      this.progress = 1;
      this.done = true;
      this.regress = 0;
    }
  }

  draw(ctx, cam) {
    const sx = this.x - cam.x, sy = this.y - cam.y;
    ctx.fillStyle = this.done ? COLORS.genDone : (this.flash > 0 ? "#ff5555" : COLORS.gen);
    ctx.fillRect(sx - 22, sy - 17, 44, 34);
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(sx - 16, sy - 10, 32, 10);
    ctx.fillStyle = this.done ? "#cfffff" : "#fff";
    ctx.fillRect(sx - 15, sy - 9, 30 * this.progress, 8);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(sx - 22, sy - 17, 44, 34);

    if (this.users.size > 0 && !this.done) {
      ctx.strokeStyle = "rgba(255,255,255,0.32)";
      ctx.beginPath();
      ctx.arc(sx, sy, 28 + Math.sin(performance.now()/80)*3, 0, Math.PI*2);
      ctx.stroke();
    }
  }
}

export class Hook extends Entity {
  constructor(x, y) {
    super(x, y, 18);
    this.occupied = null;
    this.sabotaged = 0;
  }

  draw(ctx, cam) {
    const sx = this.x - cam.x, sy = this.y - cam.y;
    ctx.strokeStyle = this.sabotaged > 0 ? "#555" : COLORS.hook;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(sx, sy + 23);
    ctx.lineTo(sx, sy - 22);
    ctx.lineTo(sx + 17, sy - 8);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#160f22";
    ctx.stroke();

    if (this.occupied) {
      ctx.fillStyle = COLORS.blood;
      ctx.beginPath();
      ctx.arc(sx, sy + 5, 8, 0, Math.PI*2);
      ctx.fill();
    }
  }
}

export class Chest extends Entity {
  constructor(x, y, item) {
    super(x, y, 18);
    this.opened = false;
    this.item = item;
  }

  draw(ctx, cam) {
    const sx = this.x - cam.x, sy = this.y - cam.y;
    ctx.fillStyle = this.opened ? "#5a4634" : COLORS.chest;
    ctx.fillRect(sx - 18, sy - 13, 36, 26);
    ctx.strokeStyle = "#1e140a";
    ctx.strokeRect(sx - 18, sy - 13, 36, 26);
    if (!this.opened) {
      ctx.fillStyle = "#f3d181";
      ctx.fillRect(sx - 4, sy - 2, 8, 5);
    }
  }
}

export class Pallet extends Entity {
  constructor(x, y, rot = 0) {
    super(x, y, 20);
    this.rot = rot;
    this.used = false;
    this.broken = false;
  }

  rect() {
    return this.rot === 0
      ? { x: this.x - 36, y: this.y - 8, w: 72, h: 16 }
      : { x: this.x - 8, y: this.y - 36, w: 16, h: 72 };
  }

  draw(ctx, cam) {
    if (this.broken) return;
    const r = this.rect();
    ctx.fillStyle = this.used ? "#6f3c2c" : COLORS.pallet;
    ctx.fillRect(r.x - cam.x, r.y - cam.y, r.w, r.h);
    ctx.strokeStyle = "#24100a";
    ctx.strokeRect(r.x - cam.x, r.y - cam.y, r.w, r.h);
  }
}

export class Locker extends Entity {
  constructor(x, y) {
    super(x, y, 18);
    this.inside = null;
  }

  draw(ctx, cam) {
    const sx = this.x - cam.x, sy = this.y - cam.y;
    ctx.fillStyle = COLORS.locker;
    ctx.fillRect(sx - 14, sy - 24, 28, 48);
    ctx.strokeStyle = "#10202a";
    ctx.strokeRect(sx - 14, sy - 24, 28, 48);
    ctx.fillStyle = "#c6f4ff";
    ctx.fillRect(sx + 5, sy - 3, 4, 4);
  }
}

export class ExitGate extends Entity {
  constructor(x, y) {
    super(x, y, 30);
    this.powered = false;
    this.open = false;
    this.progress = 0;
  }

  draw(ctx, cam) {
    const sx = this.x - cam.x, sy = this.y - cam.y;
    ctx.strokeStyle = this.open ? "#baffff" : COLORS.gate;
    ctx.lineWidth = 8;
    ctx.strokeRect(sx - 38, sy - 48, 76, 96);
    ctx.fillStyle = this.powered ? "#e8ffff" : "#26373b";
    ctx.fillRect(sx - 18, sy - 10, 36, 20);
    if (this.powered && !this.open) {
      ctx.fillStyle = "#56e6ff";
      ctx.fillRect(sx - 16, sy - 8, 32 * this.progress, 16);
    }
  }
}

export class Hatch extends Entity {
  constructor(x, y) {
    super(x, y, 22);
    this.open = false;
  }

  draw(ctx, cam) {
    const sx = this.x - cam.x, sy = this.y - cam.y;
    ctx.fillStyle = this.open ? "#020204" : COLORS.hatch;
    ctx.beginPath();
    ctx.ellipse(sx, sy, 27, 16, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = "#e9e3ff";
    ctx.stroke();
  }
}

export class Totem extends Entity {
  constructor(x, y, hex = false) {
    super(x, y, 18);
    this.hex = hex;
    this.cleansed = false;
  }

  draw(ctx, cam) {
    if (this.cleansed) return;
    const sx = this.x - cam.x, sy = this.y - cam.y;
    ctx.fillStyle = this.hex ? COLORS.hex : COLORS.totem;
    ctx.beginPath();
    ctx.moveTo(sx, sy - 19);
    ctx.lineTo(sx + 16, sy + 12);
    ctx.lineTo(sx - 16, sy + 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#17110b";
    ctx.stroke();

    if (this.hex) {
      ctx.strokeStyle = "rgba(255,80,150,0.45)";
      ctx.beginPath();
      ctx.arc(sx, sy, 26 + Math.sin(performance.now()/120)*4, 0, Math.PI*2);
      ctx.stroke();
    }
  }
}

export class WindowVault extends Entity {
  constructor(x, y, rot = 0) {
    super(x, y, 18);
    this.rot = rot;
  }

  rect() {
    return this.rot === 0
      ? { x: this.x - 30, y: this.y - 5, w: 60, h: 10 }
      : { x: this.x - 5, y: this.y - 30, w: 10, h: 60 };
  }

  draw(ctx, cam) {
    const r = this.rect();
    ctx.fillStyle = "#9be3ff";
    ctx.fillRect(r.x - cam.x, r.y - cam.y, r.w, r.h);
    ctx.strokeStyle = "#102b33";
    ctx.strokeRect(r.x - cam.x, r.y - cam.y, r.w, r.h);
  }
}

export class SnareTrap extends Entity {
  constructor(x, y, ownerPlayer = false) {
    super(x, y, 20);
    this.armed = 1.1;
    this.life = 95;
    this.triggered = 0;
    this.ownerPlayer = ownerPlayer;
  }

  update(dt) {
    this.armed = Math.max(0, this.armed - dt);
    this.life -= dt;
    this.triggered = Math.max(0, this.triggered - dt);
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx, cam) {
    const sx = this.x - cam.x, sy = this.y - cam.y;
    ctx.fillStyle = this.armed > 0 ? "rgba(90,80,100,0.35)" : COLORS.trap;
    ctx.beginPath();
    ctx.ellipse(sx, sy, 24, 14, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = this.triggered > 0 ? "#ff8080" : "#241d2d";
    ctx.stroke();
  }
}
