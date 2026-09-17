export class Input {
  constructor() {
    this.keys = new Set();
    this.pressed = new Set();

    window.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
      if (!this.keys.has(k)) this.pressed.add(k);
      this.keys.add(k);
      if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright", "tab"].includes(k)) e.preventDefault();
    });

    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.key.toLowerCase());
    });
  }

  down(k) {
    return this.keys.has(k.toLowerCase());
  }

  hit(k) {
    return this.pressed.has(k.toLowerCase());
  }

  axis() {
    let x = 0, y = 0;
    if (this.down("a") || this.down("arrowleft")) x -= 1;
    if (this.down("d") || this.down("arrowright")) x += 1;
    if (this.down("w") || this.down("arrowup")) y -= 1;
    if (this.down("s") || this.down("arrowdown")) y += 1;
    const m = Math.hypot(x, y) || 1;
    return { x: x / m, y: y / m, moving: x !== 0 || y !== 0 };
  }

  endFrame() {
    this.pressed.clear();
  }
}
