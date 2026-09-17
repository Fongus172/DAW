import { PLAYER } from "./constants.js";

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.radius = PLAYER.RADIUS;
    this.facingX = 0;
    this.facingY = 1;

    this.steps = 0;
  }

  update(input, world, dt) {
    const move = input.movementVector();
    const running = input.down("ShiftLeft") || input.down("ShiftRight");
    const speed = running ? PLAYER.RUN_SPEED : PLAYER.WALK_SPEED;

    const targetVX = move.x * speed;
    const targetVY = move.y * speed;

    const smoothing = 1 - Math.exp(-PLAYER.ACCELERATION * dt);

    this.vx += (targetVX - this.vx) * smoothing;
    this.vy += (targetVY - this.vy) * smoothing;

    if (Math.hypot(move.x, move.y) > 0) {
      this.facingX = move.x;
      this.facingY = move.y;
    }

    this.moveAxis(world, this.vx * dt, 0);
    this.moveAxis(world, 0, this.vy * dt);

    this.steps += Math.hypot(this.vx * dt, this.vy * dt);
  }

  moveAxis(world, dx, dy) {
    if (dx === 0 && dy === 0) return;

    const nextX = this.x + dx;
    const nextY = this.y + dy;

    if (!this.collides(world, nextX, nextY)) {
      this.x = nextX;
      this.y = nextY;
      return;
    }

    const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 2);
    const stepX = dx / steps;
    const stepY = dy / steps;

    for (let i = 0; i < steps; i++) {
      const tryX = this.x + stepX;
      const tryY = this.y + stepY;

      if (!this.collides(world, tryX, tryY)) {
        this.x = tryX;
        this.y = tryY;
      } else {
        if (dx !== 0) this.vx *= -0.08;
        if (dy !== 0) this.vy *= -0.08;
        break;
      }
    }
  }

  collides(world, x, y) {
    const r = this.radius;

    const points = [
      { x: x - r, y: y - r },
      { x: x + r, y: y - r },
      { x: x - r, y: y + r },
      { x: x + r, y: y + r },
      { x: x, y: y - r },
      { x: x, y: y + r },
      { x: x - r, y: y },
      { x: x + r, y: y }
    ];

    for (const point of points) {
      if (world.isSolidAt(point.x, point.y)) {
        return true;
      }
    }

    return false;
  }
}