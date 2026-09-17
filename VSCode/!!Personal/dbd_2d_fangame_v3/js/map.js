import { TILE, GAME, MAPS } from "./config.js";
import { randi, rand, circleRectCollide } from "./utils.js";

export class GameMap {
  constructor(themeId = "scrapyard") {
    this.theme = MAPS[themeId] || MAPS.scrapyard;
    this.w = GAME.mapW;
    this.h = GAME.mapH;
    this.tiles = [];
    this.walls = [];
    this.decor = [];
    this.spawnPoints = [];
    this.killerSpawn = { x: TILE * (this.w - 6), y: TILE * 6 };
    this.generate();
  }

  generate() {
    for (let y = 0; y < this.h; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.w; x++) {
        this.tiles[y][x] = (x === 0 || y === 0 || x === this.w - 1 || y === this.h - 1) ? 1 : 0;
      }
    }

    const rooms = [
      [3,3,13,8], [22,3,16,8], [48,3,18,9],
      [5,17,14,11], [27,15,15,10], [52,16,12,12],
      [4,34,17,8], [27,33,16,8], [50,33,17,8],
      [33,8,5,24], [17,9,4,18], [45,11,4,18]
    ];

    for (const r of rooms) this.carveRoom(...r);

    this.carveCorridor(8, 12, 60, 12, 3);
    this.carveCorridor(12, 30, 62, 30, 3);
    this.carveCorridor(23, 5, 23, 38, 3);
    this.carveCorridor(43, 6, 43, 37, 3);

    for (let i = 0; i < 120; i++) {
      const x = randi(2, this.w - 3);
      const y = randi(2, this.h - 3);
      if (this.tiles[y][x] === 0 && Math.random() < 0.34 && !this.nearImportant(x, y)) this.tiles[y][x] = 1;
    }

    for (let i = 0; i < 70; i++) {
      const x = randi(2, this.w - 3);
      const y = randi(2, this.h - 3);
      if (this.tiles[y][x] === 1 && Math.random() < 0.35 && !this.nearImportant(x, y)) this.tiles[y][x] = 0;
    }

    this.rebuildWalls();

    this.spawnPoints = [
      { x: TILE * 5, y: TILE * 5 },
      { x: TILE * 9, y: TILE * 38 },
      { x: TILE * 34, y: TILE * 36 },
      { x: TILE * 60, y: TILE * 37 },
      { x: TILE * 55, y: TILE * 8 },
      { x: TILE * 30, y: TILE * 7 }
    ];

    for (let i = 0; i < 230; i++) {
      const p = this.randomOpenPoint();
      this.decor.push({
        x: p.x,
        y: p.y,
        r: rand(4, 18),
        kind: Math.random() < 0.55 ? "soft" : "hard"
      });
    }
  }

  carveRoom(rx, ry, rw, rh) {
    for (let y = ry; y < ry + rh; y++) {
      for (let x = rx; x < rx + rw; x++) {
        const edge = x === rx || y === ry || x === rx + rw - 1 || y === ry + rh - 1;
        this.tiles[y][x] = edge ? 1 : 0;
      }
    }

    const doors = [
      [rx + Math.floor(rw / 2), ry],
      [rx + Math.floor(rw / 2), ry + rh - 1],
      [rx, ry + Math.floor(rh / 2)],
      [rx + rw - 1, ry + Math.floor(rh / 2)]
    ];

    for (const [x, y] of doors) {
      for (let yy = -1; yy <= 1; yy++) for (let xx = -1; xx <= 1; xx++) {
        if (this.tiles[y + yy]?.[x + xx] !== undefined) this.tiles[y + yy][x + xx] = 0;
      }
    }
  }

  carveCorridor(x1, y1, x2, y2, half = 1) {
    const dx = Math.sign(x2 - x1);
    const dy = Math.sign(y2 - y1);
    let x = x1, y = y1;
    while (x !== x2 || y !== y2) {
      for (let yy = -half; yy <= half; yy++) for (let xx = -half; xx <= half; xx++) {
        if (this.tiles[y + yy]?.[x + xx] !== undefined) this.tiles[y + yy][x + xx] = 0;
      }
      if (x !== x2) x += dx;
      if (y !== y2) y += dy;
    }
  }

  nearImportant(x, y) {
    return (x < 8 && y < 8) || (x > this.w - 9 && y < 9) || (x > 28 && x < 45 && y > 15 && y < 30);
  }

  rebuildWalls() {
    this.walls = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.tiles[y][x] === 1) this.walls.push({ x: x*TILE, y: y*TILE, w: TILE, h: TILE });
      }
    }
  }

  isWallAtTile(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= this.w || ty >= this.h) return true;
    return this.tiles[ty][tx] === 1;
  }

  randomOpenPoint(minEdge = 2) {
    for (let i = 0; i < 1000; i++) {
      const tx = randi(minEdge, this.w - minEdge - 1);
      const ty = randi(minEdge, this.h - minEdge - 1);
      if (!this.isWallAtTile(tx, ty)) return { x: tx*TILE + TILE/2, y: ty*TILE + TILE/2 };
    }
    return { x: TILE * 8, y: TILE * 8 };
  }

  collidesCircle(x, y, r) {
    for (const wall of this.walls) {
      if (circleRectCollide(x, y, r, wall)) return true;
    }
    return false;
  }

  moveEntity(ent, dt) {
    if (ent.noClip) {
      ent.x += ent.vx * dt;
      ent.y += ent.vy * dt;
      return;
    }

    const ox = ent.x, oy = ent.y;
    let nx = ent.x + ent.vx * dt;
    if (!this.collidesCircle(nx, ent.y, ent.r)) ent.x = nx;
    else ent.vx = 0;

    let ny = ent.y + ent.vy * dt;
    if (!this.collidesCircle(ent.x, ny, ent.r)) ent.y = ny;
    else ent.vy = 0;

    ent.stuck = Math.hypot(ent.x - ox, ent.y - oy) < 1 && Math.hypot(ent.vx, ent.vy) > 20;
  }

  lineBlocked(a, b) {
    const steps = Math.ceil(Math.hypot(a.x - b.x, a.y - b.y) / (TILE * 0.45));
    for (let i = 0; i <= steps; i++) {
      const t = i / Math.max(1, steps);
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      const tx = Math.floor(x / TILE);
      const ty = Math.floor(y / TILE);
      if (this.isWallAtTile(tx, ty)) return true;
    }
    return false;
  }


  worldToTile(posOrX, maybeY) {
    const x = typeof posOrX === "number" ? posOrX : posOrX.x;
    const y = typeof posOrX === "number" ? maybeY : posOrX.y;
    return { tx: Math.floor(x / TILE), ty: Math.floor(y / TILE) };
  }

  tileToWorld(tx, ty) {
    return { x: tx * TILE + TILE / 2, y: ty * TILE + TILE / 2 };
  }

  isWalkableTile(tx, ty, margin = 0) {
    if (tx < 1 || ty < 1 || tx >= this.w - 1 || ty >= this.h - 1) return false;
    for (let y = ty - margin; y <= ty + margin; y++) {
      for (let x = tx - margin; x <= tx + margin; x++) {
        if (x < 0 || y < 0 || x >= this.w || y >= this.h || this.tiles[y][x] === 1) return false;
      }
    }
    return true;
  }

  nearestOpenTile(tx, ty, maxRadius = 18, margin = 0) {
    tx = Math.max(1, Math.min(this.w - 2, tx));
    ty = Math.max(1, Math.min(this.h - 2, ty));
    if (this.isWalkableTile(tx, ty, margin)) return { tx, ty };

    for (let r = 1; r <= maxRadius; r++) {
      for (let y = ty - r; y <= ty + r; y++) {
        for (let x = tx - r; x <= tx + r; x++) {
          if (Math.abs(x - tx) !== r && Math.abs(y - ty) !== r) continue;
          if (this.isWalkableTile(x, y, margin)) return { tx: x, ty: y };
        }
      }
    }
    return null;
  }

  nearestOpenPoint(x, y, maxRadius = 18) {
    const t = this.worldToTile(x, y);
    const open = this.nearestOpenTile(t.tx, t.ty, maxRadius, 0);
    return open ? this.tileToWorld(open.tx, open.ty) : this.randomOpenPoint();
  }

  ensureOpenArea(x, y, radiusTiles = 1) {
    const { tx, ty } = this.worldToTile(x, y);
    for (let yy = ty - radiusTiles; yy <= ty + radiusTiles; yy++) {
      for (let xx = tx - radiusTiles; xx <= tx + radiusTiles; xx++) {
        if (xx > 0 && yy > 0 && xx < this.w - 1 && yy < this.h - 1) this.tiles[yy][xx] = 0;
      }
    }
    this.rebuildWalls();
  }

  randomOpenPointReachableFrom(anchor, minDistance = 0, tries = 500) {
    for (let i = 0; i < tries; i++) {
      const p = this.randomOpenPoint();
      if (anchor && Math.hypot(anchor.x - p.x, anchor.y - p.y) < minDistance) continue;
      if (!anchor || this.findPath(anchor, p, { maxIterations: 4500 }).length > 0) return p;
    }
    return this.randomOpenPoint();
  }

  findPath(start, goal, opts = {}) {
    const margin = opts.margin ?? 0;
    const maxIterations = opts.maxIterations ?? 6500;
    const s0 = this.worldToTile(start);
    const g0 = this.worldToTile(goal);
    const s = this.nearestOpenTile(s0.tx, s0.ty, 14, margin);
    const g = this.nearestOpenTile(g0.tx, g0.ty, 14, margin);
    if (!s || !g) return [];
    if (s.tx === g.tx && s.ty === g.ty) return [this.tileToWorld(g.tx, g.ty)];

    const key = (x, y) => `${x},${y}`;
    const h = (x, y) => Math.hypot(x - g.tx, y - g.ty);
    const open = [{ tx: s.tx, ty: s.ty, f: h(s.tx, s.ty), g: 0 }];
    const came = new Map();
    const gScore = new Map([[key(s.tx, s.ty), 0]]);
    const closed = new Set();
    const dirs = [
      [1,0,1],[-1,0,1],[0,1,1],[0,-1,1],
      [1,1,1.414],[1,-1,1.414],[-1,1,1.414],[-1,-1,1.414]
    ];

    let iterations = 0;
    while (open.length && iterations++ < maxIterations) {
      let best = 0;
      for (let i = 1; i < open.length; i++) if (open[i].f < open[best].f) best = i;
      const cur = open.splice(best, 1)[0];
      const curKey = key(cur.tx, cur.ty);
      if (closed.has(curKey)) continue;
      closed.add(curKey);

      if (cur.tx === g.tx && cur.ty === g.ty) {
        const tiles = [{ tx: cur.tx, ty: cur.ty }];
        let ck = curKey;
        while (came.has(ck)) {
          const prev = came.get(ck);
          tiles.push(prev);
          ck = key(prev.tx, prev.ty);
        }
        tiles.reverse();
        return this.smoothPath(tiles.map(t => this.tileToWorld(t.tx, t.ty)));
      }

      for (const [dx, dy, cost] of dirs) {
        const nx = cur.tx + dx;
        const ny = cur.ty + dy;
        if (!this.isWalkableTile(nx, ny, margin)) continue;
        if (dx !== 0 && dy !== 0) {
          if (!this.isWalkableTile(cur.tx + dx, cur.ty, margin) || !this.isWalkableTile(cur.tx, cur.ty + dy, margin)) continue;
        }
        const nk = key(nx, ny);
        if (closed.has(nk)) continue;
        const tentative = cur.g + cost;
        if (tentative < (gScore.get(nk) ?? Infinity)) {
          came.set(nk, { tx: cur.tx, ty: cur.ty });
          gScore.set(nk, tentative);
          open.push({ tx: nx, ty: ny, g: tentative, f: tentative + h(nx, ny) });
        }
      }
    }
    return [];
  }

  smoothPath(points) {
    if (points.length <= 2) return points;
    const out = [points[0]];
    for (let i = 2; i < points.length - 1; i += 3) out.push(points[i]);
    out.push(points[points.length - 1]);
    return out;
  }

  drawDebugPath(ctx, cam, path, color = "rgba(120,220,255,0.45)") {
    if (!path || path.length < 2) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(path[0].x - cam.x, path[0].y - cam.y);
    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].x - cam.x, path[i].y - cam.y);
    ctx.stroke();
  }

  draw(ctx, cam) {
    ctx.fillStyle = "#06070a";
    ctx.fillRect(0, 0, cam.w, cam.h);

    const startX = Math.floor(cam.x / TILE) - 2;
    const startY = Math.floor(cam.y / TILE) - 2;
    const endX = startX + Math.ceil(cam.w / TILE) + 4;
    const endY = startY + Math.ceil(cam.h / TILE) + 4;

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (x < 0 || y < 0 || x >= this.w || y >= this.h) continue;
        const sx = x*TILE - cam.x;
        const sy = y*TILE - cam.y;
        if (this.tiles[y][x] === 1) {
          ctx.fillStyle = this.theme.wall;
          ctx.fillRect(sx, sy, TILE, TILE);
          ctx.fillStyle = "rgba(255,255,255,0.045)";
          ctx.fillRect(sx+3, sy+3, TILE-6, 5);
          ctx.fillStyle = "rgba(0,0,0,0.14)";
          ctx.fillRect(sx, sy+TILE-7, TILE, 7);
        } else {
          const checker = (x + y) % 2 === 0;
          ctx.fillStyle = checker ? this.theme.floorA : this.theme.floorB;
          ctx.fillRect(sx, sy, TILE, TILE);
          ctx.fillStyle = "rgba(255,255,255,0.025)";
          ctx.fillRect(sx, sy, TILE, 1);
          ctx.fillRect(sx, sy, 1, TILE);
        }
      }
    }

    for (const d of this.decor) {
      const sx = d.x - cam.x;
      const sy = d.y - cam.y;
      if (sx < -50 || sy < -50 || sx > cam.w + 50 || sy > cam.h + 50) continue;
      ctx.fillStyle = d.kind === "soft" ? this.theme.decorB : this.theme.decorA;
      ctx.globalAlpha = d.kind === "soft" ? 0.42 : 0.28;
      ctx.beginPath();
      ctx.arc(sx, sy, d.r, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
}
