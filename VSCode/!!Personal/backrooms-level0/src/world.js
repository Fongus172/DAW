import { TILE, WORLD } from "./constants.js";
import { Random, hash2 } from "./random.js";

export class LevelWorld {
  constructor(seedText, level) {
    this.seedText = seedText;
    this.level = level;
    this.rng = new Random(`${seedText}-${level.id}`);

    this.width = WORLD.WIDTH;
    this.height = WORLD.HEIGHT;
    this.tileSize = WORLD.TILE_SIZE;

    this.tiles = new Uint8Array(this.width * this.height);
    this.meta = new Uint8Array(this.width * this.height);
    this.lights = new Uint8Array(this.width * this.height);

    this.rooms = [];
    this.exitTiles = [];
    this.shiftCount = 0;

    this.spawn = {
      x: Math.floor(this.width / 2) * this.tileSize + this.tileSize / 2,
      y: Math.floor(this.height / 2) * this.tileSize + this.tileSize / 2
    };

    this.tiles.fill(TILE.WALL);
    this.generateByType();
  }

  index(x, y) {
    return y * this.width + x;
  }

  inside(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  get(x, y) {
    if (!this.inside(x, y)) return TILE.WALL;
    return this.tiles[this.index(x, y)];
  }

  set(x, y, tile) {
    if (!this.inside(x, y)) return;
    this.tiles[this.index(x, y)] = tile;
  }

  isPassableTile(tile) {
    return (
      tile === TILE.FLOOR ||
      tile === TILE.DARK ||
      tile === TILE.RED ||
      tile === TILE.ROAD ||
      tile === TILE.GRASS ||
      tile === TILE.CROP ||
      tile === TILE.WATER ||
      tile === TILE.RAIL
    );
  }

  isSolidTile(tile) {
    return (
      tile === TILE.WALL ||
      tile === TILE.PILLAR ||
      tile === TILE.EXIT ||
      tile === TILE.HOLE ||
      tile === TILE.TREE ||
      tile === TILE.WINDOW ||
      tile === TILE.PIPE ||
      tile === TILE.MACHINE ||
      tile === TILE.CRATE ||
      tile === TILE.FURNITURE ||
      tile === TILE.DOOR ||
      tile === TILE.STAIRS ||
      tile === TILE.BUILDING ||
      tile === TILE.VOID ||
      tile === TILE.POOL_EDGE
    );
  }

  isSolidAt(worldX, worldY) {
    const tx = Math.floor(worldX / this.tileSize);
    const ty = Math.floor(worldY / this.tileSize);
    return this.isSolidTile(this.get(tx, ty));
  }

  tileCenter(x, y) {
    return {
      x: x * this.tileSize + this.tileSize / 2,
      y: y * this.tileSize + this.tileSize / 2
    };
  }

  generateByType() {
    switch (this.level.type) {
      case "yellow":
        this.generateYellow();
        break;
      case "warehouse":
        this.generateWarehouse();
        break;
      case "pipes":
        this.generatePipes();
        break;
      case "electrical":
        this.generateElectrical();
        break;
      case "office":
        this.generateOffice();
        break;
      case "hotel":
        this.generateHotel();
        break;
      case "darkness":
        this.generateDarkness();
        break;
      case "ocean":
        this.generateOcean();
        break;
      case "caves":
        this.generateCaves();
        break;
      case "suburbs":
        this.generateSuburbs();
        break;
      case "fields":
        this.generateFields();
        break;
      case "city":
        this.generateCity();
        break;
      case "poolrooms":
        this.generatePoolrooms();
        break;
      default:
        this.generateYellow();
        break;
    }

    this.addOuterBorder();
    this.cleanupReachability();
    this.addLights();
    this.addExits();
    this.spawnAtCenter();
  }

  spawnAtCenter() {
    const nearest = this.findNearestPassableTile(
      Math.floor(this.width / 2),
      Math.floor(this.height / 2)
    );

    this.spawn = this.tileCenter(nearest.x, nearest.y);
  }

  carveRect(x, y, w, h, tile = TILE.FLOOR) {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        if (xx <= 1 || yy <= 1 || xx >= this.width - 2 || yy >= this.height - 2) continue;
        this.set(xx, yy, tile);
        this.meta[this.index(xx, yy)] = this.rng.int(0, 15);
      }
    }
  }

  carveCircle(cx, cy, radius, tile = TILE.FLOOR, roughness = 0.22) {
    for (let y = cy - radius - 2; y <= cy + radius + 2; y++) {
      for (let x = cx - radius - 2; x <= cx + radius + 2; x++) {
        if (!this.inside(x, y)) continue;
        const n = this.noise(x, y);
        const d = Math.hypot(x - cx, y - cy);
        const limit = radius + (n - 0.5) * radius * roughness;
        if (d <= limit) {
          this.set(x, y, tile);
          this.meta[this.index(x, y)] = this.rng.int(0, 15);
        }
      }
    }
  }

  carveCorridor(x1, y1, x2, y2, width = 3, tile = TILE.FLOOR) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    const half = Math.floor(width / 2);

    for (let y = minY - half; y <= maxY + half; y++) {
      for (let x = minX - half; x <= maxX + half; x++) {
        if (!this.inside(x, y)) continue;

        const onSegment =
          (x >= minX && x <= maxX && Math.abs(y - y1) <= half) ||
          (y >= minY && y <= maxY && Math.abs(x - x1) <= half);

        if (onSegment) {
          this.set(x, y, tile);
          this.meta[this.index(x, y)] = this.rng.int(0, 15);
        }
      }
    }
  }

  connectRooms(a, b, width = 3, tile = TILE.FLOOR) {
    const ac = { x: Math.floor(a.x + a.w / 2), y: Math.floor(a.y + a.h / 2) };
    const bc = { x: Math.floor(b.x + b.w / 2), y: Math.floor(b.y + b.h / 2) };

    if (this.rng.chance(0.5)) {
      this.carveCorridor(ac.x, ac.y, bc.x, ac.y, width, tile);
      this.carveCorridor(bc.x, ac.y, bc.x, bc.y, width, tile);
    } else {
      this.carveCorridor(ac.x, ac.y, ac.x, bc.y, width, tile);
      this.carveCorridor(ac.x, bc.y, bc.x, bc.y, width, tile);
    }
  }

  addRoom(room, tile = TILE.FLOOR) {
    this.carveRect(room.x, room.y, room.w, room.h, tile);
    this.rooms.push(room);
  }

  generateRoomGraph(options) {
    const {
      attempts = 160,
      minW = 5,
      maxW = 16,
      minH = 5,
      maxH = 16,
      corridorW = 3,
      tile = TILE.FLOOR,
      longBias = 0.25
    } = options;

    const cx = Math.floor(this.width / 2);
    const cy = Math.floor(this.height / 2);

    const start = {
      x: cx - 8,
      y: cy - 6,
      w: 16,
      h: 12,
      kind: "start"
    };

    this.addRoom(start, tile);

    for (let i = 0; i < attempts; i++) {
      const from = this.rooms[this.rng.int(Math.max(0, this.rooms.length - 32), this.rooms.length - 1)];
      const dir = this.rng.pick(["north", "south", "west", "east"]);

      let w = this.rng.int(minW, maxW);
      let h = this.rng.int(minH, maxH);

      if (this.rng.chance(longBias)) {
        if (dir === "east" || dir === "west") {
          w = this.rng.int(maxW, maxW * 3);
          h = this.rng.int(2, Math.max(3, Math.floor(minH * 0.8)));
        } else {
          w = this.rng.int(2, Math.max(3, Math.floor(minW * 0.8)));
          h = this.rng.int(maxH, maxH * 3);
        }
      }

      const gap = this.rng.int(1, 10);
      let x = from.x;
      let y = from.y;

      if (dir === "north") {
        x = from.x + this.rng.int(-Math.floor(w * 0.6), from.w - 2);
        y = from.y - h - gap;
      }

      if (dir === "south") {
        x = from.x + this.rng.int(-Math.floor(w * 0.6), from.w - 2);
        y = from.y + from.h + gap;
      }

      if (dir === "west") {
        x = from.x - w - gap;
        y = from.y + this.rng.int(-Math.floor(h * 0.6), from.h - 2);
      }

      if (dir === "east") {
        x = from.x + from.w + gap;
        y = from.y + this.rng.int(-Math.floor(h * 0.6), from.h - 2);
      }

      x = Math.max(3, Math.min(this.width - w - 4, x));
      y = Math.max(3, Math.min(this.height - h - 4, y));

      const room = { x, y, w, h, kind: "room" };
      this.addRoom(room, tile);
      this.connectRooms(from, room, corridorW, tile);
    }
  }

  generateYellow() {
    this.generateRoomGraph({
      attempts: 185,
      minW: 5,
      maxW: 18,
      minH: 5,
      maxH: 16,
      corridorW: 3,
      longBias: 0.34
    });

    this.addPartitions(0.62);
    this.addColumnFields(0.36);
    this.scatterSpecial(TILE.HOLE, 36, 3);
    this.scatterDarkZones(14);
    this.scatterRedRooms(4);
  }

  generateWarehouse() {
    this.generateRoomGraph({
      attempts: 130,
      minW: 10,
      maxW: 28,
      minH: 8,
      maxH: 22,
      corridorW: 5,
      longBias: 0.18
    });

    this.addColumnFields(0.78);
    this.scatterObjects(TILE.CRATE, 170, 2);
    this.scatterObjects(TILE.PIPE, 90, 2);
    this.scatterWaterPuddles(70);
  }

  generatePipes() {
    this.generateRoomGraph({
      attempts: 210,
      minW: 2,
      maxW: 8,
      minH: 2,
      maxH: 8,
      corridorW: 2,
      longBias: 0.72
    });

    this.addIndustrialClutter(260);
    this.addFortyFiveBranches(36, TILE.FLOOR);
    this.scatterDarkZones(22);
  }

  generateElectrical() {
    this.generateRoomGraph({
      attempts: 200,
      minW: 3,
      maxW: 10,
      minH: 3,
      maxH: 10,
      corridorW: 2,
      longBias: 0.64
    });

    this.addIndustrialClutter(340);
    this.scatterObjects(TILE.MACHINE, 210, 2);
    this.scatterObjects(TILE.PIPE, 260, 2);
    this.scatterDarkZones(32);
  }

  generateOffice() {
    this.generateRoomGraph({
      attempts: 165,
      minW: 7,
      maxW: 20,
      minH: 6,
      maxH: 18,
      corridorW: 3,
      longBias: 0.2
    });

    this.addPartitions(0.82);
    this.scatterObjects(TILE.FURNITURE, 70, 2);
    this.addWindows(180);
    this.scatterObjects(TILE.CRATE, 34, 2);
  }

  generateHotel() {
    const cx = Math.floor(this.width / 2);
    const cy = Math.floor(this.height / 2);

    const mainHall = { x: cx - 18, y: cy - 10, w: 36, h: 20, kind: "main-hall" };
    this.addRoom(mainHall, TILE.RED);

    this.generateRoomGraph({
      attempts: 150,
      minW: 5,
      maxW: 14,
      minH: 5,
      maxH: 14,
      corridorW: 3,
      tile: TILE.RED,
      longBias: 0.36
    });

    this.addColumnFields(0.52);
    this.scatterObjects(TILE.FURNITURE, 150, 2);
    this.scatterObjects(TILE.DOOR, 120, 1);
    this.addBoilerRooms(6);
  }

  generateDarkness() {
    this.generateRoomGraph({
      attempts: 180,
      minW: 2,
      maxW: 7,
      minH: 2,
      maxH: 7,
      corridorW: 2,
      tile: TILE.DARK,
      longBias: 0.78
    });

    this.scatterObjects(TILE.WALL, 40, 4);
  }

  generateOcean() {
    this.tiles.fill(TILE.WATER);

    const cx = Math.floor(this.width / 2);
    const cy = Math.floor(this.height / 2);

    this.carveRect(cx - 10, cy - 7, 20, 14, TILE.FLOOR);
    this.rooms.push({ x: cx - 10, y: cy - 7, w: 20, h: 14 });

    for (let i = 0; i < 32; i++) {
      const x = this.rng.int(8, this.width - 22);
      const y = this.rng.int(8, this.height - 22);
      const w = this.rng.int(5, 20);
      const h = this.rng.int(4, 16);

      const tile = this.rng.chance(0.75) ? TILE.FLOOR : TILE.POOL_EDGE;
      this.carveRect(x, y, w, h, tile);

      if (tile === TILE.FLOOR) {
        this.rooms.push({ x, y, w, h });
      }
    }

    for (let i = 0; i < 80; i++) {
      const a = this.rng.pick(this.rooms);
      const b = this.rng.pick(this.rooms);
      this.connectRooms(a, b, this.rng.int(2, 4), TILE.FLOOR);
    }

    this.addColumnFields(0.25);
  }

  generateCaves() {
    this.tiles.fill(TILE.WALL);

    const walkers = [];

    const cx = Math.floor(this.width / 2);
    const cy = Math.floor(this.height / 2);

    for (let i = 0; i < 10; i++) {
      walkers.push({
        x: cx + this.rng.int(-8, 8),
        y: cy + this.rng.int(-8, 8),
        dir: this.rng.int(0, 3)
      });
    }

    for (let step = 0; step < 7600; step++) {
      const walker = this.rng.pick(walkers);

      this.carveCircle(walker.x, walker.y, this.rng.int(2, 4), TILE.FLOOR, 0.7);

      if (this.rng.chance(0.28)) walker.dir = this.rng.int(0, 3);

      if (walker.dir === 0) walker.x++;
      if (walker.dir === 1) walker.x--;
      if (walker.dir === 2) walker.y++;
      if (walker.dir === 3) walker.y--;

      walker.x = Math.max(5, Math.min(this.width - 6, walker.x));
      walker.y = Math.max(5, Math.min(this.height - 6, walker.y));

      if (this.rng.chance(0.018)) {
        walkers.push({
          x: walker.x,
          y: walker.y,
          dir: this.rng.int(0, 3)
        });
      }

      if (walkers.length > 26) walkers.shift();
    }

    this.scatterObjects(TILE.HOLE, 90, 3);
    this.scatterWaterPuddles(60);
  }

  generateSuburbs() {
    this.tiles.fill(TILE.GRASS);

    const roadSpacing = 22;
    const offsetX = this.rng.int(0, roadSpacing - 1);
    const offsetY = this.rng.int(0, roadSpacing - 1);

    for (let x = offsetX; x < this.width; x += roadSpacing) {
      this.carveRect(x - 2, 0, 5, this.height, TILE.ROAD);
    }

    for (let y = offsetY; y < this.height; y += roadSpacing) {
      this.carveRect(0, y - 2, this.width, 5, TILE.ROAD);
    }

    for (let y = 8; y < this.height - 16; y += 12) {
      for (let x = 8; x < this.width - 16; x += 14) {
        if (!this.rng.chance(0.62)) continue;
        if (this.nearTile(x, y, TILE.ROAD, 3)) continue;

        const w = this.rng.int(5, 9);
        const h = this.rng.int(5, 8);

        this.carveRect(x, y, w, h, TILE.BUILDING);

        if (this.rng.chance(0.25)) {
          this.carveRect(x + this.rng.int(1, w - 2), y + h, 2, 2, TILE.FLOOR);
        }
      }
    }

    this.scatterObjects(TILE.TREE, 260, 3);
    this.scatterWaterPuddles(80);
  }

  generateFields() {
    this.tiles.fill(TILE.CROP);

    for (let x = 0; x < this.width; x += this.rng.int(18, 32)) {
      this.carveRect(x, 0, this.rng.int(2, 4), this.height, TILE.TREE);
    }

    for (let y = 0; y < this.height; y += this.rng.int(18, 32)) {
      this.carveRect(0, y, this.width, this.rng.int(2, 4), TILE.TREE);
    }

    for (let i = 0; i < 120; i++) {
      const x = this.rng.int(4, this.width - 8);
      const y = this.rng.int(4, this.height - 8);
      this.carveRect(x, y, this.rng.int(3, 7), this.rng.int(2, 5), TILE.GRASS);
    }

    for (let i = 0; i < 26; i++) {
      this.carveCircle(this.rng.int(10, this.width - 10), this.rng.int(10, this.height - 10), this.rng.int(3, 7), TILE.WATER, 0.3);
    }

    const cx = Math.floor(this.width / 2);
    const cy = Math.floor(this.height / 2);
    this.carveRect(cx - 5, cy - 5, 10, 10, TILE.GRASS);
  }

  generateCity() {
    this.tiles.fill(TILE.BUILDING);

    const block = 16;

    for (let x = 6; x < this.width; x += block) {
      this.carveRect(x, 0, 5, this.height, TILE.ROAD);
    }

    for (let y = 6; y < this.height; y += block) {
      this.carveRect(0, y, this.width, 5, TILE.ROAD);
    }

    for (let i = 0; i < 240; i++) {
      const x = this.rng.int(4, this.width - 14);
      const y = this.rng.int(4, this.height - 14);

      if (this.nearTile(x, y, TILE.ROAD, 3)) continue;

      const tile = this.rng.chance(0.22) ? TILE.FLOOR : TILE.BUILDING;
      this.carveRect(x, y, this.rng.int(4, 10), this.rng.int(4, 10), tile);
    }

    for (let i = 0; i < 12; i++) {
      const x = this.rng.int(10, this.width - 30);
      const y = this.rng.int(10, this.height - 30);

      if (this.rng.chance(0.5)) {
        this.carveRect(x, y, this.rng.int(5, 8), this.rng.int(18, 38), TILE.WATER);
      } else {
        this.carveRect(x, y, this.rng.int(18, 38), this.rng.int(5, 8), TILE.WATER);
      }
    }
  }

  generatePoolrooms() {
    this.tiles.fill(TILE.POOL_EDGE);

    this.generateRoomGraph({
      attempts: 140,
      minW: 8,
      maxW: 22,
      minH: 7,
      maxH: 20,
      corridorW: 4,
      tile: TILE.WATER,
      longBias: 0.28
    });

    for (const room of this.rooms) {
      if (this.rng.chance(0.55)) {
        this.carveRect(room.x + 2, room.y + 2, Math.max(2, room.w - 4), Math.max(2, room.h - 4), TILE.WATER);
      }
    }

    this.addColumnFields(0.55, TILE.POOL_EDGE);
    this.addPartitions(0.44, TILE.POOL_EDGE);

    const cx = Math.floor(this.width / 2);
    const cy = Math.floor(this.height / 2);
    this.carveRect(cx - 5, cy - 4, 10, 8, TILE.FLOOR);
  }

  addPartitions(probability = 0.5, tile = TILE.WALL) {
    for (const room of this.rooms) {
      if (room.w < 9 || room.h < 9) continue;
      if (!this.rng.chance(probability)) continue;

      const count = this.rng.int(1, 4);

      for (let i = 0; i < count; i++) {
        const vertical = this.rng.chance(0.5);

        if (vertical) {
          const x = this.rng.int(room.x + 2, room.x + room.w - 3);
          const y1 = this.rng.int(room.y + 1, room.y + Math.floor(room.h * 0.4));
          const y2 = this.rng.int(room.y + Math.floor(room.h * 0.6), room.y + room.h - 2);
          const gap = this.rng.int(y1 + 1, y2);

          for (let y = y1; y <= y2; y++) {
            if (Math.abs(y - gap) <= 1) continue;
            if (this.isPassableTile(this.get(x, y))) this.set(x, y, tile);
          }
        } else {
          const y = this.rng.int(room.y + 2, room.y + room.h - 3);
          const x1 = this.rng.int(room.x + 1, room.x + Math.floor(room.w * 0.4));
          const x2 = this.rng.int(room.x + Math.floor(room.w * 0.6), room.x + room.w - 2);
          const gap = this.rng.int(x1 + 1, x2);

          for (let x = x1; x <= x2; x++) {
            if (Math.abs(x - gap) <= 1) continue;
            if (this.isPassableTile(this.get(x, y))) this.set(x, y, tile);
          }
        }
      }
    }
  }

  addColumnFields(probability = 0.4, tile = TILE.PILLAR) {
    for (const room of this.rooms) {
      if (room.w < 12 || room.h < 10) continue;
      if (!this.rng.chance(probability)) continue;

      const spacingX = this.rng.int(5, 8);
      const spacingY = this.rng.int(5, 8);
      const offsetX = this.rng.int(2, spacingX);
      const offsetY = this.rng.int(2, spacingY);

      for (let y = room.y + offsetY; y < room.y + room.h - 2; y += spacingY) {
        for (let x = room.x + offsetX; x < room.x + room.w - 2; x += spacingX) {
          if (this.isPassableTile(this.get(x, y)) && this.openNeighborCount(x, y) >= 3) {
            this.set(x, y, tile);
          }
        }
      }
    }
  }

  scatterObjects(tile, count, minDistanceFromSpawn = 0) {
    const cx = Math.floor(this.width / 2);
    const cy = Math.floor(this.height / 2);

    for (let i = 0; i < count; i++) {
      const x = this.rng.int(3, this.width - 4);
      const y = this.rng.int(3, this.height - 4);

      if (Math.hypot(x - cx, y - cy) < minDistanceFromSpawn) continue;
      if (this.isPassableTile(this.get(x, y)) && this.openNeighborCount(x, y) >= 2) {
        this.set(x, y, tile);
        this.meta[this.index(x, y)] = this.rng.int(0, 15);
      }
    }
  }

  scatterSpecial(tile, count, minOpen = 3) {
    for (let i = 0; i < count; i++) {
      const x = this.rng.int(4, this.width - 5);
      const y = this.rng.int(4, this.height - 5);
      if (this.isPassableTile(this.get(x, y)) && this.openNeighborCount(x, y) >= minOpen) {
        this.set(x, y, tile);
      }
    }
  }

  scatterWaterPuddles(count) {
    for (let i = 0; i < count; i++) {
      const x = this.rng.int(4, this.width - 5);
      const y = this.rng.int(4, this.height - 5);

      if (this.isPassableTile(this.get(x, y))) {
        this.set(x, y, TILE.WATER);
      }
    }
  }

  scatterDarkZones(count) {
    for (let i = 0; i < count; i++) {
      const room = this.rng.pick(this.rooms);
      if (!room) continue;

      const w = this.rng.int(4, Math.min(12, room.w));
      const h = this.rng.int(4, Math.min(12, room.h));
      const x = this.rng.int(room.x, Math.max(room.x, room.x + room.w - w));
      const y = this.rng.int(room.y, Math.max(room.y, room.y + room.h - h));

      for (let yy = y; yy < y + h; yy++) {
        for (let xx = x; xx < x + w; xx++) {
          if (this.isPassableTile(this.get(xx, yy))) this.set(xx, yy, TILE.DARK);
        }
      }
    }
  }

  scatterRedRooms(count) {
    for (let i = 0; i < count; i++) {
      const room = this.rng.pick(this.rooms);
      if (!room) continue;

      for (let y = room.y + 1; y < room.y + room.h - 1; y++) {
        for (let x = room.x + 1; x < room.x + room.w - 1; x++) {
          if (this.isPassableTile(this.get(x, y))) this.set(x, y, TILE.RED);
        }
      }
    }
  }

  addIndustrialClutter(count) {
    for (let i = 0; i < count; i++) {
      const x = this.rng.int(3, this.width - 4);
      const y = this.rng.int(3, this.height - 4);

      if (!this.isPassableTile(this.get(x, y))) continue;
      if (!this.hasSolidNeighbor(x, y)) continue;

      this.set(x, y, this.rng.chance(0.55) ? TILE.PIPE : TILE.MACHINE);
    }
  }

  addFortyFiveBranches(count, tile) {
    for (let i = 0; i < count; i++) {
      let x = this.rng.int(10, this.width - 10);
      let y = this.rng.int(10, this.height - 10);

      if (!this.isPassableTile(this.get(x, y))) continue;

      const dx = this.rng.sign();
      const dy = this.rng.sign();
      const length = this.rng.int(10, 32);

      for (let s = 0; s < length; s++) {
        this.carveRect(x - 1, y - 1, 3, 3, tile);
        x += dx;
        y += dy;
        if (!this.inside(x, y)) break;
      }
    }
  }

  addWindows(count) {
    for (let i = 0; i < count; i++) {
      const x = this.rng.int(3, this.width - 4);
      const y = this.rng.int(3, this.height - 4);

      if (this.get(x, y) !== TILE.WALL) continue;
      if (this.hasPassableNeighbor(x, y)) {
        this.set(x, y, TILE.WINDOW);
      }
    }
  }

  addBoilerRooms(count) {
    for (let i = 0; i < count; i++) {
      const room = this.rng.pick(this.rooms);
      if (!room) continue;

      for (let y = room.y; y < room.y + room.h; y++) {
        for (let x = room.x; x < room.x + room.w; x++) {
          if (this.isPassableTile(this.get(x, y)) && this.rng.chance(0.24)) {
            this.set(x, y, this.rng.chance(0.6) ? TILE.PIPE : TILE.MACHINE);
          }
        }
      }
    }
  }

  addLights() {
    for (let y = 2; y < this.height - 2; y++) {
      for (let x = 2; x < this.width - 2; x++) {
        const tile = this.get(x, y);
        const idx = this.index(x, y);

        if (this.level.type === "darkness") {
          this.lights[idx] = 0;
          continue;
        }

        if (!this.isPassableTile(tile)) {
          this.lights[idx] = 0;
          continue;
        }

        let chance = 0.035;

        if (this.level.type === "yellow") chance = 0.055;
        if (this.level.type === "warehouse") chance = 0.045;
        if (this.level.type === "pipes") chance = 0.028;
        if (this.level.type === "electrical") chance = 0.035;
        if (this.level.type === "office") chance = 0.06;
        if (this.level.type === "hotel") chance = 0.055;
        if (this.level.type === "ocean") chance = 0.018;
        if (this.level.type === "poolrooms") chance = 0.052;
        if (this.level.type === "suburbs") chance = 0.018;
        if (this.level.type === "city") chance = 0.03;
        if (this.level.type === "fields") chance = 0.006;
        if (this.level.type === "caves") chance = 0.012;

        this.lights[idx] = this.rng.chance(chance) ? 1 : 0;
      }
    }
  }

  addExits() {
    this.exitTiles.length = 0;

    const candidates = [];
    const spawnTile = {
      x: Math.floor(this.spawn.x / this.tileSize),
      y: Math.floor(this.spawn.y / this.tileSize)
    };

    for (let y = 4; y < this.height - 4; y++) {
      for (let x = 4; x < this.width - 4; x++) {
        const tile = this.get(x, y);
        const distance = Math.hypot(x - spawnTile.x, y - spawnTile.y);
        if (distance < 72) continue;

        if (this.level.type === "fields") {
          if (tile === TILE.TREE && this.hasPassableNeighbor(x, y)) candidates.push({ x, y, distance });
          continue;
        }

        if (this.level.type === "suburbs" || this.level.type === "city") {
          if ((tile === TILE.BUILDING || tile === TILE.DOOR) && this.hasPassableNeighbor(x, y)) {
            candidates.push({ x, y, distance });
          }
          continue;
        }

        if (this.level.type === "ocean" || this.level.type === "poolrooms") {
          if ((tile === TILE.WALL || tile === TILE.POOL_EDGE) && this.hasPassableNeighbor(x, y)) {
            candidates.push({ x, y, distance });
          }
          continue;
        }

        if ((tile === TILE.WALL || tile === TILE.DOOR || tile === TILE.STAIRS) && this.hasPassableNeighbor(x, y)) {
          candidates.push({ x, y, distance });
        }
      }
    }

    candidates.sort((a, b) => b.distance - a.distance);

    const exits = this.rng.chance(0.1) ? 2 : 1;

    for (let i = 0; i < exits && candidates.length > 0; i++) {
      const pickIndex = this.rng.int(0, Math.min(90, candidates.length - 1));
      const exit = candidates.splice(pickIndex, 1)[0];
      this.set(exit.x, exit.y, TILE.EXIT);
      this.meta[this.index(exit.x, exit.y)] = 99;
      this.exitTiles.push(exit);
    }
  }

  cleanupReachability() {
    const start = this.findNearestPassableTile(
      Math.floor(this.width / 2),
      Math.floor(this.height / 2)
    );

    const visited = new Uint8Array(this.width * this.height);
    const queue = [start];
    visited[this.index(start.x, start.y)] = 1;

    for (let i = 0; i < queue.length; i++) {
      const c = queue[i];

      const neighbors = [
        { x: c.x + 1, y: c.y },
        { x: c.x - 1, y: c.y },
        { x: c.x, y: c.y + 1 },
        { x: c.x, y: c.y - 1 }
      ];

      for (const n of neighbors) {
        if (!this.inside(n.x, n.y)) continue;

        const idx = this.index(n.x, n.y);
        if (visited[idx]) continue;

        if (this.isPassableTile(this.get(n.x, n.y))) {
          visited[idx] = 1;
          queue.push(n);
        }
      }
    }

    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        const idx = this.index(x, y);
        if (this.isPassableTile(this.tiles[idx]) && !visited[idx]) {
          this.tiles[idx] = TILE.WALL;
        }
      }
    }
  }

  addOuterBorder() {
    for (let x = 0; x < this.width; x++) {
      this.set(x, 0, TILE.WALL);
      this.set(x, this.height - 1, TILE.WALL);
    }

    for (let y = 0; y < this.height; y++) {
      this.set(0, y, TILE.WALL);
      this.set(this.width - 1, y, TILE.WALL);
    }
  }

  findNearestPassableTile(startX, startY) {
    const queue = [{ x: startX, y: startY }];
    const visited = new Set([`${startX},${startY}`]);

    for (let i = 0; i < queue.length; i++) {
      const current = queue[i];

      if (this.isPassableTile(this.get(current.x, current.y))) {
        return current;
      }

      const neighbors = [
        { x: current.x + 1, y: current.y },
        { x: current.x - 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 }
      ];

      for (const n of neighbors) {
        const key = `${n.x},${n.y}`;
        if (!this.inside(n.x, n.y) || visited.has(key)) continue;
        visited.add(key);
        queue.push(n);
      }
    }

    return { x: startX, y: startY };
  }

  getExitNear(worldX, worldY, maxDistance = 42) {
    for (const exit of this.exitTiles) {
      const center = this.tileCenter(exit.x, exit.y);
      const distance = Math.hypot(center.x - worldX, center.y - worldY);
      if (distance <= maxDistance) return exit;
    }

    return null;
  }

  shiftOffscreen(camera) {
    if (this.level.type === "fields" || this.level.type === "suburbs" || this.level.type === "city") {
      return false;
    }

    this.shiftCount++;

    for (let attempt = 0; attempt < 140; attempt++) {
      const x = this.rng.int(4, this.width - 5);
      const y = this.rng.int(4, this.height - 5);
      const wx = x * this.tileSize;
      const wy = y * this.tileSize;

      const visible =
        wx > camera.x - 140 &&
        wy > camera.y - 140 &&
        wx < camera.x + camera.w + 140 &&
        wy < camera.y + camera.h + 140;

      if (visible) continue;

      const tile = this.get(x, y);

      if (this.isPassableTile(tile) && this.rng.chance(0.28)) {
        this.meta[this.index(x, y)] = this.rng.int(0, 15);
        this.lights[this.index(x, y)] = this.lights[this.index(x, y)] ? 0 : 1;
        return true;
      }

      if (tile === TILE.WALL && this.hasPassableNeighbor(x, y) && this.rng.chance(0.16)) {
        this.set(x, y, TILE.FLOOR);
        return true;
      }
    }

    return false;
  }

  hasPassableNeighbor(x, y) {
    return (
      this.isPassableTile(this.get(x + 1, y)) ||
      this.isPassableTile(this.get(x - 1, y)) ||
      this.isPassableTile(this.get(x, y + 1)) ||
      this.isPassableTile(this.get(x, y - 1))
    );
  }

  hasSolidNeighbor(x, y) {
    return (
      this.isSolidTile(this.get(x + 1, y)) ||
      this.isSolidTile(this.get(x - 1, y)) ||
      this.isSolidTile(this.get(x, y + 1)) ||
      this.isSolidTile(this.get(x, y - 1))
    );
  }

  openNeighborCount(x, y) {
    let count = 0;
    if (this.isPassableTile(this.get(x + 1, y))) count++;
    if (this.isPassableTile(this.get(x - 1, y))) count++;
    if (this.isPassableTile(this.get(x, y + 1))) count++;
    if (this.isPassableTile(this.get(x, y - 1))) count++;
    return count;
  }

  nearTile(x, y, tile, radius) {
    for (let yy = y - radius; yy <= y + radius; yy++) {
      for (let xx = x - radius; xx <= x + radius; xx++) {
        if (this.get(xx, yy) === tile) return true;
      }
    }

    return false;
  }

  noise(x, y) {
    return hash2(x, y, this.rng.seed);
  }
}