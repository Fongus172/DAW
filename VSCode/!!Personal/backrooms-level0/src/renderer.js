import { TILE, RENDER } from "./constants.js";
import { hash2 } from "./random.js";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false });

    this.width = 1;
    this.height = 1;
    this.dpr = 1;

    this.camera = {
      x: 0,
      y: 0,
      w: 1,
      h: 1
    };

    window.addEventListener("resize", () => this.resize());
    this.resize();
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, RENDER.MAX_DPR);

    this.width = Math.floor(window.innerWidth);
    this.height = Math.floor(window.innerHeight);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  render(game) {
    const ctx = this.ctx;

    if (!game.world || !game.player) {
      ctx.fillStyle = "#050502";
      ctx.fillRect(0, 0, this.width, this.height);
      return;
    }

    const { world, player } = game;

    const targetX = player.x - this.width / 2;
    const targetY = player.y - this.height / 2;

    const maxX = world.width * world.tileSize - this.width;
    const maxY = world.height * world.tileSize - this.height;

    const clampedX = Math.max(0, Math.min(maxX, targetX));
    const clampedY = Math.max(0, Math.min(maxY, targetY));

    this.camera.x += (clampedX - this.camera.x) * RENDER.CAMERA_LERP;
    this.camera.y += (clampedY - this.camera.y) * RENDER.CAMERA_LERP;
    this.camera.w = this.width;
    this.camera.h = this.height;

    ctx.fillStyle = world.level.palette.shadow;
    ctx.fillRect(0, 0, this.width, this.height);

    this.drawTiles(world, game.time);
    this.drawLights(world, game.time);
    this.drawPlayer(player);
    this.drawAtmosphere(game);
  }

  drawTiles(world, time) {
    const size = world.tileSize;

    const minX = Math.max(0, Math.floor(this.camera.x / size) - 2);
    const minY = Math.max(0, Math.floor(this.camera.y / size) - 2);
    const maxX = Math.min(world.width - 1, Math.ceil((this.camera.x + this.width) / size) + 2);
    const maxY = Math.min(world.height - 1, Math.ceil((this.camera.y + this.height) / size) + 2);

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const sx = Math.floor(x * size - this.camera.x);
        const sy = Math.floor(y * size - this.camera.y);
        const tile = world.get(x, y);
        const meta = world.meta[world.index(x, y)];

        this.drawTile(world, tile, x, y, sx, sy, size, meta, time);
      }
    }
  }

  drawTile(world, tile, x, y, sx, sy, size, meta, time) {
    const ctx = this.ctx;
    const p = world.level.palette;
    const n = world.noise(x, y);

    if (tile === TILE.FLOOR || tile === TILE.DARK || tile === TILE.RED || tile === TILE.RAIL) {
      this.drawFloor(world, tile, x, y, sx, sy, size, meta);
      return;
    }

    if (tile === TILE.WATER) {
      this.drawWater(world, x, y, sx, sy, size, time);
      return;
    }

    if (tile === TILE.ROAD) {
      ctx.fillStyle = n > 0.5 ? "#24282b" : "#1c2023";
      ctx.fillRect(sx, sy, size, size);

      if ((x + y) % 9 === 0) {
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = "#7b8184";
        ctx.fillRect(sx + size * 0.4, sy + size * 0.45, size * 0.2, 2);
        ctx.globalAlpha = 1;
      }

      return;
    }

    if (tile === TILE.GRASS) {
      ctx.fillStyle = n > 0.5 ? "#324b2d" : "#283d25";
      ctx.fillRect(sx, sy, size, size);
      this.drawSpecks(x, y, sx, sy, size, "#6d8a4c", 0.12);
      return;
    }

    if (tile === TILE.CROP) {
      ctx.fillStyle = n > 0.5 ? p.floorA : p.floorB;
      ctx.fillRect(sx, sy, size, size);

      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "#efe09a";
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(sx + i * 8 + (meta % 5), sy + 3);
        ctx.lineTo(sx + i * 8 - 5, sy + size - 3);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      return;
    }

    if (tile === TILE.WALL || tile === TILE.BUILDING || tile === TILE.POOL_EDGE) {
      this.drawWall(world, tile, x, y, sx, sy, size, meta);
      return;
    }

    if (tile === TILE.PILLAR) {
      this.drawBlock(sx, sy, size, p.wallA, p.wallB, p.trim);
      return;
    }

    if (tile === TILE.EXIT) {
      this.drawExit(world, x, y, sx, sy, size, time);
      return;
    }

    if (tile === TILE.HOLE || tile === TILE.VOID) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(sx, sy, size, size);
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.strokeRect(sx + 3, sy + 3, size - 6, size - 6);
      return;
    }

    if (tile === TILE.TREE) {
      ctx.fillStyle = "#1a2617";
      ctx.fillRect(sx, sy, size, size);
      ctx.fillStyle = "#314426";
      ctx.beginPath();
      ctx.arc(sx + size / 2, sy + size / 2, size * 0.42, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    if (
      tile === TILE.PIPE ||
      tile === TILE.MACHINE ||
      tile === TILE.CRATE ||
      tile === TILE.FURNITURE ||
      tile === TILE.DOOR ||
      tile === TILE.STAIRS ||
      tile === TILE.WINDOW
    ) {
      this.drawObject(world, tile, x, y, sx, sy, size, meta, time);
      return;
    }
  }

  drawFloor(world, tile, x, y, sx, sy, size, meta) {
    const ctx = this.ctx;
    const p = world.level.palette;
    const n = world.noise(x, y);

    if (tile === TILE.RED) {
      ctx.fillStyle = n > 0.48 ? "#7c1c16" : "#681610";
    } else if (tile === TILE.DARK) {
      ctx.fillStyle = n > 0.5 ? "#1b1b1b" : "#0e0e0e";
    } else if (tile === TILE.RAIL) {
      ctx.fillStyle = "#2d2d2d";
    } else {
      ctx.fillStyle = n > 0.5 ? p.floorA : p.floorB;
    }

    ctx.fillRect(sx, sy, size, size);

    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "#ffffff";

    if (world.level.type === "office" || world.level.type === "poolrooms") {
      ctx.strokeStyle = "rgba(40, 50, 50, 0.25)";
      ctx.strokeRect(sx + 0.5, sy + 0.5, size, size);
    } else {
      for (let i = 0; i < 4; i++) {
        const yy = sy + ((i * 9 + meta * 3) % size);
        ctx.fillRect(sx, yy, size, 1);
      }
    }

    ctx.globalAlpha = 1;
    this.drawSpecks(x, y, sx, sy, size, "#000000", 0.08);
  }

  drawWall(world, tile, x, y, sx, sy, size, meta) {
    const ctx = this.ctx;
    const p = world.level.palette;
    const n = world.noise(x + 999, y + 999);

    let a = p.wallA;
    let b = p.wallB;

    if (tile === TILE.BUILDING) {
      a = "#555b60";
      b = "#3f464c";
    }

    if (tile === TILE.POOL_EDGE) {
      a = "#edf6ef";
      b = "#d5dfd8";
    }

    ctx.fillStyle = n > 0.52 ? a : b;
    ctx.fillRect(sx, sy, size, size);

    if (world.level.type === "yellow" || world.level.type === "hotel") {
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = p.trim;

      for (let py = -size; py < size * 2; py += 10) {
        ctx.beginPath();
        ctx.moveTo(sx + 4, sy + py + meta);
        ctx.lineTo(sx + size / 2, sy + py + 6 + meta);
        ctx.lineTo(sx + size - 4, sy + py + meta);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    }

    if (world.level.type === "poolrooms") {
      ctx.globalAlpha = 0.28;
      ctx.strokeStyle = "#6e8f88";
      ctx.strokeRect(sx + 0.5, sy + 0.5, size, size);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(sx, sy + size - 4, size, 4);

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(sx, sy, size, 3);
  }

  drawWater(world, x, y, sx, sy, size, time) {
    const ctx = this.ctx;

    let a = "#155a65";
    let b = "#0e3e4a";

    if (world.level.type === "poolrooms") {
      a = "#42c4bd";
      b = "#198885";
    }

    if (world.level.type === "ocean") {
      a = "#0a3145";
      b = "#061b29";
    }

    const wave = Math.sin(time * 0.004 + x * 0.6 + y * 0.8) * 0.5 + 0.5;

    ctx.fillStyle = wave > 0.5 ? a : b;
    ctx.fillRect(sx, sy, size, size);

    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#d9fff6";

    ctx.beginPath();
    ctx.moveTo(sx, sy + size * (0.35 + wave * 0.2));
    ctx.quadraticCurveTo(
      sx + size * 0.5,
      sy + size * (0.15 + wave * 0.2),
      sx + size,
      sy + size * (0.35 + wave * 0.2)
    );
    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  drawBlock(sx, sy, size, a, b, trim) {
    const ctx = this.ctx;
    const gradient = ctx.createLinearGradient(sx, sy, sx + size, sy + size);
    gradient.addColorStop(0, a);
    gradient.addColorStop(1, b);

    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.fillRect(sx + 4, sy + 5, size, size);

    ctx.fillStyle = gradient;
    ctx.fillRect(sx + 2, sy + 2, size - 4, size - 4);

    ctx.strokeStyle = trim;
    ctx.strokeRect(sx + 4.5, sy + 4.5, size - 9, size - 9);
  }

  drawObject(world, tile, x, y, sx, sy, size, meta, time) {
    const ctx = this.ctx;

    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.fillRect(sx + 4, sy + 5, size - 5, size - 4);

    if (tile === TILE.PIPE) {
      ctx.fillStyle = "#7d4f35";
      ctx.fillRect(sx + 4, sy + size * 0.38, size - 8, size * 0.24);
      ctx.fillStyle = "#b87845";
      ctx.fillRect(sx + 4, sy + size * 0.38, size - 8, 2);
      return;
    }

    if (tile === TILE.MACHINE) {
      ctx.fillStyle = "#2d3336";
      ctx.fillRect(sx + 3, sy + 3, size - 6, size - 6);
      ctx.fillStyle = "#89b7a5";
      ctx.fillRect(sx + 7, sy + 7, size - 14, 4);
      return;
    }

    if (tile === TILE.CRATE) {
      ctx.fillStyle = "#7a552d";
      ctx.fillRect(sx + 4, sy + 4, size - 8, size - 8);
      ctx.strokeStyle = "#3f2a13";
      ctx.strokeRect(sx + 6, sy + 6, size - 12, size - 12);
      return;
    }

    if (tile === TILE.FURNITURE) {
      ctx.fillStyle = world.level.type === "hotel" ? "#3c1d15" : "#46433c";
      ctx.fillRect(sx + 4, sy + 7, size - 8, size - 11);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(sx + 7, sy + 9, size - 14, 3);
      return;
    }

    if (tile === TILE.DOOR || tile === TILE.STAIRS) {
      ctx.fillStyle = "#2b1a12";
      ctx.fillRect(sx + 5, sy + 2, size - 10, size - 4);
      ctx.fillStyle = "#d0a25c";
      ctx.beginPath();
      ctx.arc(sx + size - 9, sy + size / 2, 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    if (tile === TILE.WINDOW) {
      const glow = 0.35 + Math.sin(time * 0.005 + x + y) * 0.18;
      ctx.fillStyle = `rgba(150, 190, 255, ${glow})`;
      ctx.fillRect(sx + 3, sy + 3, size - 6, size - 6);
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.strokeRect(sx + 3.5, sy + 3.5, size - 7, size - 7);
    }
  }

  drawExit(world, x, y, sx, sy, size, time) {
    const ctx = this.ctx;

    const flicker =
      0.45 +
      Math.sin(time * 0.012 + x * 1.7 + y * 0.8) * 0.22 +
      (hash2(x, y, Math.floor(time / 200)) > 0.88 ? 0.35 : 0);

    const p = world.level.palette;

    ctx.fillStyle = p.wallA;
    ctx.fillRect(sx, sy, size, size);

    ctx.globalAlpha = 0.22 + flicker * 0.45;
    ctx.fillStyle = p.light;
    ctx.fillRect(sx + 2, sy + 2, size - 4, size - 4);

    ctx.globalAlpha = 1;
    ctx.strokeStyle = `rgba(255,255,230,${0.25 + flicker * 0.6})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(sx + 3, sy + 3, size - 6, size - 6);
  }

  drawLights(world, time) {
    const ctx = this.ctx;
    const size = world.tileSize;

    const minX = Math.max(0, Math.floor(this.camera.x / size) - 2);
    const minY = Math.max(0, Math.floor(this.camera.y / size) - 2);
    const maxX = Math.min(world.width - 1, Math.ceil((this.camera.x + this.width) / size) + 2);
    const maxY = Math.min(world.height - 1, Math.ceil((this.camera.y + this.height) / size) + 2);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const idx = world.index(x, y);
        if (!world.lights[idx]) continue;

        const sx = x * size - this.camera.x;
        const sy = y * size - this.camera.y;

        const f =
          0.58 +
          Math.sin(time * 0.006 + x * 1.7 + y * 0.8) * 0.09 -
          (hash2(x, y, Math.floor(time / 170)) > 0.95 ? 0.3 : 0);

        const glow = ctx.createRadialGradient(
          sx + size / 2,
          sy + size / 2,
          2,
          sx + size / 2,
          sy + size / 2,
          size * 5.8
        );

        glow.addColorStop(0, `rgba(255,255,225,${0.12 * f})`);
        glow.addColorStop(0.45, `rgba(255,230,130,${0.05 * f})`);
        glow.addColorStop(1, "rgba(255,230,130,0)");

        ctx.fillStyle = glow;
        ctx.fillRect(sx - size * 6, sy - size * 6, size * 12, size * 12);

        ctx.globalAlpha = 0.32 + f * 0.2;
        ctx.fillStyle = world.level.palette.light;
        ctx.fillRect(sx + size * 0.22, sy + size * 0.08, size * 0.56, size * 0.16);
        ctx.globalAlpha = 1;
      }
    }

    ctx.restore();
  }

  drawPlayer(player) {
    const ctx = this.ctx;
    const sx = player.x - this.camera.x;
    const sy = player.y - this.camera.y;

    ctx.save();

    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.beginPath();
    ctx.ellipse(sx + 2, sy + 5, player.radius * 1.4, player.radius * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();

    const bob = Math.sin(player.steps * 0.12) * 1.4;

    ctx.fillStyle = "#26313a";
    ctx.beginPath();
    ctx.arc(sx, sy + bob, player.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,248,197,0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#fff2b0";
    ctx.beginPath();
    ctx.arc(
      sx + player.facingX * 4,
      sy + bob + player.facingY * 4,
      2.4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }

  drawAtmosphere(game) {
    const ctx = this.ctx;
    const world = game.world;

    let darkness = 0.68;

    if (world.level.type === "darkness") darkness = 0.97;
    if (world.level.type === "suburbs") darkness = 0.82;
    if (world.level.type === "caves") darkness = 0.88;
    if (world.level.type === "ocean") darkness = 0.72;
    if (world.level.type === "fields") darkness = 0.38;
    if (world.level.type === "poolrooms") darkness = 0.34;
    if (world.level.type === "city") darkness = 0.55;

    if (game.nearExit) darkness -= 0.1;

    const vignette = ctx.createRadialGradient(
      this.width / 2,
      this.height / 2,
      Math.min(this.width, this.height) * 0.16,
      this.width / 2,
      this.height / 2,
      Math.max(this.width, this.height) * 0.68
    );

    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(0.58, `rgba(0,0,0,${Math.max(0.08, darkness - 0.42)})`);
    vignette.addColorStop(1, `rgba(0,0,0,${darkness})`);

    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = world.level.palette.fog;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "#fff0a4";

    const grainCount = Math.floor(this.width * this.height * RENDER.GRAIN_DENSITY);

    for (let i = 0; i < grainCount; i++) {
      const x = hash2(i, Math.floor(game.time / 40), 15) * this.width;
      const y = hash2(i, Math.floor(game.time / 40), 21) * this.height;
      const s = hash2(i, 7, 19) > 0.82 ? 2 : 1;
      ctx.fillRect(x, y, s, s);
    }

    ctx.globalAlpha = 0.055;
    ctx.fillStyle = "#000000";

    for (let y = 0; y < this.height; y += 4) {
      ctx.fillRect(0, y, this.width, 1);
    }

    ctx.globalAlpha = 1;

    if (game.shiftFlash > 0) {
      ctx.fillStyle = `rgba(255,242,160,${game.shiftFlash})`;
      ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  drawSpecks(x, y, sx, sy, size, color, alpha) {
    const ctx = this.ctx;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;

    const specks = 2 + Math.floor(hash2(x, y, 98) * 4);

    for (let i = 0; i < specks; i++) {
      const px = sx + hash2(x + i * 17, y, 177) * size;
      const py = sy + hash2(x, y + i * 13, 201) * size;
      ctx.fillRect(px, py, 1.2, 1.2);
    }

    ctx.globalAlpha = 1;
  }
}