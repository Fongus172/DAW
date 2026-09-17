export class Input {
  constructor() {
    this.keys = new Set();
    this.pressed = new Set();

    window.addEventListener("keydown", (event) => {
      if (!this.keys.has(event.code)) {
        this.pressed.add(event.code);
      }

      this.keys.add(event.code);

      if (
        event.code === "ArrowUp" ||
        event.code === "ArrowDown" ||
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight" ||
        event.code === "Space"
      ) {
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      this.keys.delete(event.code);
    });

    window.addEventListener("blur", () => {
      this.keys.clear();
      this.pressed.clear();
    });
  }

  down(code) {
    return this.keys.has(code);
  }

  consume(code) {
    if (!this.pressed.has(code)) return false;
    this.pressed.delete(code);
    return true;
  }

  movementVector() {
    let x = 0;
    let y = 0;

    if (this.down("KeyA") || this.down("ArrowLeft")) x -= 1;
    if (this.down("KeyD") || this.down("ArrowRight")) x += 1;
    if (this.down("KeyW") || this.down("ArrowUp")) y -= 1;
    if (this.down("KeyS") || this.down("ArrowDown")) y += 1;

    const length = Math.hypot(x, y);

    if (length > 0) {
      x /= length;
      y /= length;
    }

    return { x, y };
  }

  finishFrame() {
    this.pressed.clear();
  }
}