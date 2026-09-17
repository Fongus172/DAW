export const TILE = Object.freeze({
  FLOOR: 0,
  WALL: 1,
  PILLAR: 2,
  EXIT: 3,
  DARK: 4,
  RED: 5,
  HOLE: 6,
  WATER: 7,
  ROAD: 8,
  GRASS: 9,
  TREE: 10,
  WINDOW: 11,
  PIPE: 12,
  MACHINE: 13,
  CRATE: 14,
  FURNITURE: 15,
  DOOR: 16,
  STAIRS: 17,
  BUILDING: 18,
  CROP: 19,
  VOID: 20,
  RAIL: 21,
  POOL_EDGE: 22
});

export const WORLD = Object.freeze({
  WIDTH: 240,
  HEIGHT: 240,
  TILE_SIZE: 28
});

export const PLAYER = Object.freeze({
  RADIUS: 8.2,
  WALK_SPEED: 122,
  RUN_SPEED: 178,
  ACCELERATION: 14
});

export const RENDER = Object.freeze({
  MAX_DPR: 2,
  CAMERA_LERP: 0.1,
  GRAIN_DENSITY: 0.0028
});