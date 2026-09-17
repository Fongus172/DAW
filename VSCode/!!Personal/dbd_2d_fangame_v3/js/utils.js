export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export function randi(min, max) {
  return Math.floor(rand(min, max + 1));
}

export function choose(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function distXY(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

export function angleTo(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

export function normalize(x, y) {
  const m = Math.hypot(x, y) || 1;
  return { x: x / m, y: y / m };
}

export function moveToward(ent, target, speed) {
  const n = normalize(target.x - ent.x, target.y - ent.y);
  ent.vx = n.x * speed;
  ent.vy = n.y * speed;
}

export function circleRectCollide(cx, cy, r, rect) {
  const nx = clamp(cx, rect.x, rect.x + rect.w);
  const ny = clamp(cy, rect.y, rect.y + rect.h);
  return Math.hypot(cx - nx, cy - ny) < r;
}

export function rectContains(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
