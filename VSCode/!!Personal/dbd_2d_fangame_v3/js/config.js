export const TILE = 48;

export const GAME = {
  gensTotal: 7,
  gensNeeded: 5,
  hooksTotal: 11,
  chestsTotal: 7,
  palletsTotal: 16,
  lockersTotal: 16,
  totemsTotal: 5,
  windowsTotal: 10,
  mapW: 72,
  mapH: 46,
  terrorRadius: 300,
  chaseRange: 390,
  rescueDuration: 3.2,
  gateDuration: 13,
  chestDuration: 4.2,
  totemDuration: 10,
  sabotageDuration: 5.8,
  recoverDuration: 18,
  endgameDuration: 150
};

export const DIFFICULTY = {
  easy: {
    killerAi: 0.78,
    survivorAi: 1.10,
    skillCheck: 0.85,
    name: "Suave"
  },
  normal: {
    killerAi: 1.0,
    survivorAi: 1.0,
    skillCheck: 1.0,
    name: "Normal"
  },
  hard: {
    killerAi: 1.22,
    survivorAi: 0.92,
    skillCheck: 1.18,
    name: "Chunga"
  }
};

export const SURVIVORS = {
  alex: {
    id: "alex",
    name: "Alex",
    icon: "A",
    color: "#6ecbff",
    speed: 132,
    sprint: 206,
    repair: 1.0,
    heal: 1.0,
    stealth: 1.0,
    courage: 1.0,
    perkName: "Manos firmes",
    perk: "Las zonas de prueba de habilidad son algo más amplias."
  },
  mara: {
    id: "mara",
    name: "Mara",
    icon: "M",
    color: "#c99aff",
    speed: 129,
    sprint: 203,
    repair: 0.95,
    heal: 1.02,
    stealth: 1.38,
    courage: 0.95,
    perkName: "Paso ligero",
    perk: "Deja menos marcas de carrera y tarda más en ser detectada."
  },
  bruno: {
    id: "bruno",
    name: "Bruno",
    icon: "B",
    color: "#ffb86c",
    speed: 126,
    sprint: 196,
    repair: 0.98,
    heal: 0.94,
    stealth: 0.86,
    courage: 1.34,
    perkName: "No me bajo",
    perk: "Aguanta más en gancho y sangra más lento al estar derribado."
  },
  nina: {
    id: "nina",
    name: "Nina",
    icon: "N",
    color: "#85ff9e",
    speed: 131,
    sprint: 202,
    repair: 1.18,
    heal: 1.10,
    stealth: 0.95,
    courage: 0.92,
    perkName: "Técnica",
    perk: "Repara, cura y sabotea más rápido."
  }
};

export const ITEMS = {
  none: { id: "none", name: "Nada", charges: 0 },
  medkit: { id: "medkit", name: "Botiquín", charges: 24, desc: "Cura más rápido y permite autocurarse." },
  toolbox: { id: "toolbox", name: "Caja de herramientas", charges: 28, desc: "Acelera reparaciones y sabotea ganchos." },
  flashlight: { id: "flashlight", name: "Linterna", charges: 6, desc: "Puede cegar al killer si está cerca y visible." },
  key: { id: "key", name: "Llave vieja", charges: 1, desc: "Abre la trampilla si está disponible." },
  map: { id: "map", name: "Mapa ajado", charges: 20, desc: "Revela objetivos cercanos durante unos segundos." }
};

export const MAPS = {
  scrapyard: {
    id: "scrapyard",
    name: "Chatarrería lúgubre",
    floorA: "#303035",
    floorB: "#282a2f",
    wall: "#1a1b20",
    accent: "#c47a38",
    fog: "rgba(20,18,16,0.54)",
    decorA: "#5b5145",
    decorB: "#31483a"
  },
  clinic: {
    id: "clinic",
    name: "Clínica abandonada",
    floorA: "#2f3538",
    floorB: "#283033",
    wall: "#1d2528",
    accent: "#85d6d5",
    fog: "rgba(16,24,27,0.56)",
    decorA: "#c9d5d7",
    decorB: "#4d676d"
  },
  farm: {
    id: "farm",
    name: "Granja marchita",
    floorA: "#2f2c22",
    floorB: "#26271f",
    wall: "#20190f",
    accent: "#d0a14b",
    fog: "rgba(24,20,12,0.58)",
    decorA: "#82613a",
    decorB: "#3f5c30"
  }
};

export const COLORS = {
  red: "#d04444",
  blood: "#ad2525",
  downed: "#8d1d1d",
  injured: "#ffb14a",
  hook: "#a77bff",
  gen: "#ddbf4c",
  genDone: "#72ff88",
  chest: "#b98044",
  pallet: "#c66b3c",
  locker: "#3d8093",
  gate: "#65d8ff",
  hatch: "#a48dff",
  totem: "#f3e7ad",
  hex: "#ff4f8b",
  trap: "#493c51"
};
