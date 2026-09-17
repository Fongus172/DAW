export function hashString(text) {
  let h = 2166136261 >>> 0;

  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return h >>> 0;
}

export function mulberry32(seed) {
  let a = seed >>> 0;

  return function next() {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Random {
  constructor(seedText = String(Date.now())) {
    this.seedText = seedText;
    this.seed = hashString(seedText);
    this.random = mulberry32(this.seed);
  }

  float(min = 0, max = 1) {
    return min + (max - min) * this.random();
  }

  int(min, max) {
    return Math.floor(this.float(min, max + 1));
  }

  chance(probability) {
    return this.random() < probability;
  }

  pick(array) {
    return array[this.int(0, array.length - 1)];
  }

  sign() {
    return this.chance(0.5) ? -1 : 1;
  }
}

export function hash2(x, y, seed = 1337) {
  let h = seed >>> 0;
  h ^= Math.imul(x + 374761393, 668265263);
  h ^= Math.imul(y + 1442695041, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}