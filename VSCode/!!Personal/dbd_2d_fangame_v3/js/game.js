import { GameMap } from "./map.js";
import { ParticleSystem } from "./particles.js";
import {
  Survivor, Killer, Generator, Hook, Chest, Pallet, Locker, ExitGate,
  Hatch, Totem, WindowVault, SnareTrap
} from "./entities.js";
import { GAME, SURVIVORS, ITEMS, DIFFICULTY, COLORS, TILE } from "./config.js";
import { clamp, dist, rand, choose, circleRectCollide, angleTo, normalize, formatTime } from "./utils.js";
import { updateSurvivorAI, updateKillerAI } from "./ai.js";

export class Game {
  constructor(canvas, input, ui, audio) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.input = input;
    this.ui = ui;
    this.audio = audio;
    this.camera = { x: 0, y: 0, w: canvas.width, h: canvas.height };
    this.running = false;
    this.paused = false;
    this.player = null;
    this.role = "survivor";
    this.promptText = "";
    this.playerActionLabel = "";
    this.playerActionProgress = 0;
    this.showScoreboard = false;
    this.skillCheck = null;
  }

  start(options) {
    this.role = options.role;
    this.options = options;
    this.difficulty = DIFFICULTY[options.difficulty] || DIFFICULTY.normal;
    this.audio.enabled = options.sound;
    this.map = new GameMap(options.map);
    this.particles = new ParticleSystem();

    this.generators = [];
    this.hooks = [];
    this.chests = [];
    this.pallets = [];
    this.lockers = [];
    this.gates = [];
    this.totems = [];
    this.windows = [];
    this.traps = [];
    this.noises = [];

    this.time = 0;
    this.gensDone = 0;
    this.hexActive = true;
    this.endgameActive = false;
    this.endgameTimer = GAME.endgameDuration;
    this.end = null;
    this.running = true;
    this.paused = false;
    this.promptText = "";
    this.playerActionLabel = "";
    this.playerActionProgress = 0;
    this.skillCheck = null;
    this.itemMaxCharges = 1;
    this.softlockTimer = 0;
    this.reachabilityAnchor = this.map.spawnPoints[0] || this.map.randomOpenPoint();
    this.objectiveReservations = new Map();

    this.placeObjectives();
    this.spawnCharacters(options.character);
    this.ensureSpawnSafety();
    this.resetNavigationMemory();

    this.ui.messages = [];
    this.ui.showMenu(false);
    this.ui.showHud(true);
    this.ui.hideEnd();
    this.ui.addMessage(`Mapa: ${this.map.theme.name}. La prueba empieza.`, "info");
    this.ui.addMessage(this.role === "survivor" ? "Repara 5 generadores y escapa." : "Caza a los cuatro supervivientes.", "info");
  }

  placeObjectives() {
    const used = [];
    const place = (min = 180, openRadius = 1) => {
      for (let i = 0; i < 900; i++) {
        const p = this.map.randomOpenPoint();
        if (used.every(u => Math.hypot(u.x - p.x, u.y - p.y) > min)) {
          this.map.ensureOpenArea(p.x, p.y, openRadius);
          used.push(p);
          return this.map.nearestOpenPoint(p.x, p.y);
        }
      }
      const fallback = this.map.randomOpenPoint();
      this.map.ensureOpenArea(fallback.x, fallback.y, openRadius);
      used.push(fallback);
      return this.map.nearestOpenPoint(fallback.x, fallback.y);
    };

    for (let i = 0; i < GAME.gensTotal; i++) {
      const p = place(260);
      this.generators.push(new Generator(p.x, p.y));
    }

    for (let i = 0; i < GAME.hooksTotal; i++) {
      const p = place(190);
      this.hooks.push(new Hook(p.x, p.y));
    }

    const loot = ["medkit", "toolbox", "flashlight", "key", "map", "medkit", "toolbox"];
    for (let i = 0; i < GAME.chestsTotal; i++) {
      const p = place(170);
      this.chests.push(new Chest(p.x, p.y, loot[i % loot.length]));
    }

    for (let i = 0; i < GAME.palletsTotal; i++) {
      const p = place(120);
      this.pallets.push(new Pallet(p.x, p.y, Math.random() < 0.5 ? 0 : 1));
    }

    for (let i = 0; i < GAME.lockersTotal; i++) {
      const p = place(120);
      this.lockers.push(new Locker(p.x, p.y));
    }

    for (let i = 0; i < GAME.totemsTotal; i++) {
      const p = place(220);
      this.totems.push(new Totem(p.x, p.y, i === 0));
    }

    for (let i = 0; i < GAME.windowsTotal; i++) {
      const p = place(150);
      this.windows.push(new WindowVault(p.x, p.y, Math.random() < 0.5 ? 0 : 1));
    }

    const g1 = this.map.nearestOpenPoint(96, this.map.h * TILE * 0.50);
    const g2 = this.map.nearestOpenPoint(this.map.w * TILE - 96, this.map.h * TILE * 0.52);
    this.map.ensureOpenArea(g1.x, g1.y, 2);
    this.map.ensureOpenArea(g2.x, g2.y, 2);
    this.gates.push(new ExitGate(g1.x, g1.y));
    this.gates.push(new ExitGate(g2.x, g2.y));
    const hp = place(300, 2);
    this.hatch = new Hatch(hp.x, hp.y);
  }

  spawnCharacters(selectedChar = "alex") {
    const ids = Object.keys(SURVIVORS);
    this.survivors = [];
    const sp = this.map.spawnPoints;

    for (let i = 0; i < 4; i++) {
      const id = this.role === "survivor" && i === 0 ? selectedChar : ids[i];
      const p = sp[i] || this.map.randomOpenPoint();
      const s = new Survivor(p.x, p.y, id, this.role === "survivor" && i === 0);
      this.survivors.push(s);
      if (s.isPlayer) this.player = s;
    }

    this.killer = new Killer(this.map.killerSpawn.x, this.map.killerSpawn.y, this.role === "killer");
    if (this.role === "killer") this.player = this.killer;
  }

  update(dt) {
    if (!this.running || this.end) return;

    if (this.input.hit("escape")) {
      this.paused = !this.paused;
      this.ui.showPause(this.paused);
    }
    this.showScoreboard = this.input.down("tab");

    if (this.paused) return;

    this.time += dt;
    this.promptText = "";
    this.playerActionLabel = "";
    this.playerActionProgress = 0;

    for (const g of this.generators) g.users.clear();

    this.updateNoises(dt);
    this.updateEntities(dt);
    this.updatePlayer(dt);

    for (const s of this.survivors) updateSurvivorAI(this, s, dt);
    updateKillerAI(this, this.killer, dt);

    this.moveAll(dt);
    this.resolveWorldInteractions(dt);
    this.updateObjectives(dt);
    this.updateAntiSoftlocks(dt);
    this.updateCamera();
    this.updateAudio(dt);
    this.checkEnd();
  }

  updateEntities(dt) {
    for (const s of this.survivors) s.update(dt);
    this.killer.update(dt);
    for (const t of this.traps) t.update(dt);
    this.traps = this.traps.filter(t => !t.dead);
    this.particles.update(dt);
  }

  updateNoises(dt) {
    for (const n of this.noises) n.life -= dt;
    this.noises = this.noises.filter(n => n.life > 0);
  }

  addNoise(x, y, strength = 1, text = "ruido") {
    this.noises.push({ x, y, strength, text, life: 4 });
  }

  updatePlayer(dt) {
    if (!this.player || !this.player.alive && this.role === "survivor") return;
    if (this.role === "survivor") this.updatePlayerSurvivor(this.player, dt);
    else this.updatePlayerKiller(this.killer, dt);
  }

  updatePlayerSurvivor(s, dt) {
    s.vx = 0;
    s.vy = 0;

    if (s.dead || s.escaped) return;

    if (s.onHook) {
      this.promptText = "En gancho: E para intentar soltarte una vez, espera rescate";
      if (this.input.hit("e") && s.hookCount === 1) {
        if (Math.random() < 0.04) {
          this.unhookSelf(s);
        } else {
          s.hookTimer -= 10;
          this.ui.addMessage("Intento fallido. Eso ha dolido hasta de verlo.");
          this.audio.hit();
        }
      }
      return;
    }

    if (s.inLocker) {
      this.promptText = "E para salir de la taquilla";
      if (this.input.hit("e")) this.exitLocker(s);
      return;
    }

    if (s.state === "downed") {
      this.promptText = s.recover < 0.95 ? "Mantén E para recuperarte hasta el 95%" : "Recuperado al 95%. Necesitas ayuda.";
      if (this.input.down("e")) this.performRecover(s, dt, false);
      else this.clearAction(s);
      return;
    }

    if (this.input.hit("u")) this.emergencyUnstuck(s, true);

    const ax = this.input.axis();
    const sprinting = ax.moving && this.input.down("shift") && s.stamina > 0;
    const spd = s.speed(sprinting);
    s.vx = ax.x * spd;
    s.vy = ax.y * spd;

    if (ax.moving) {
      s.lastDir = { x: ax.x, y: ax.y };
      if (sprinting) {
        s.stamina = clamp(s.stamina - dt * 30, 0, 100);
        if (Math.random() < 0.55 / s.char.stealth) {
          s.markTrails.push({ x: s.x, y: s.y, life: 4.2 / s.char.stealth });
          this.particles.trail(s.x, s.y, "rgba(255,70,70,0.55)");
        }
      } else {
        s.stamina = clamp(s.stamina + dt * 18, 0, 100);
      }
    } else {
      s.stamina = clamp(s.stamina + dt * 24, 0, 100);
    }

    const target = this.nearestInteractable(s, 64);
    if (target) this.promptText = this.describeInteract(s, target);

    if (this.input.hit("q") && s.item.id !== "none") {
      this.ui.addMessage(`${s.name} suelta ${s.item.name}.`);
      s.item = { ...ITEMS.none };
      this.itemMaxCharges = 1;
    }

    if (this.input.hit("f")) this.useSurvivorItem(s);

    if (this.input.down("e") && target) {
      this.handleSurvivorInteract(s, target, dt, false);
    } else if (this.input.down("e") && s.item.id === "medkit" && s.state === "injured") {
      this.performHeal(s, s, dt, false);
    } else if (!this.input.down("e")) {
      this.clearAction(s);
    }

    this.updateSkillCheck(dt);
  }

  updatePlayerKiller(k, dt) {
    k.vx = 0;
    k.vy = 0;
    if (k.stun > 0) {
      this.promptText = "Aturdido";
      return;
    }

    if (this.input.hit("u")) this.emergencyUnstuck(k, true);

    const ax = this.input.axis();
    if (ax.moving) {
      k.lastDir = { x: ax.x, y: ax.y };
      k.vx = ax.x * k.speed;
      k.vy = ax.y * k.speed;
    }

    const target = this.nearestKillerInteractable(k, 64);
    if (target) this.promptText = this.describeKillerInteract(target);

    if (this.input.hit("f")) this.useKillerPower();
    if (this.input.hit("r")) this.placeTrap(true);

    if (this.input.down("e")) {
      if (target) this.handleKillerInteract(k, target, dt);
      else if (this.input.hit("e")) this.killerAttack(k);
    } else {
      this.clearAction(k);
    }

    if (this.input.hit(" ")) this.killerAttack(k);
  }

  nearestInteractable(ent, maxD = 60) {
    const list = [
      ...this.generators, ...this.chests, ...this.pallets, ...this.lockers, ...this.gates,
      ...this.hooks, ...this.totems, ...this.windows, this.hatch,
      ...this.survivors.filter(s => s !== ent)
    ];

    let best = null;
    let bd = maxD;
    for (const x of list) {
      if (!x || x.dead || x.escaped) continue;
      if (x.cleansed || x.broken) continue;
      const d = dist(ent, x);
      if (d < bd) {
        bd = d;
        best = x;
      }
    }
    return best;
  }

  nearestKillerInteractable(k, maxD = 64) {
    let list = [
      ...this.generators.filter(g => !g.done && g.progress > 0.02),
      ...this.pallets.filter(p => p.used && !p.broken),
      ...this.lockers,
      ...this.hooks.filter(h => !h.occupied && h.sabotaged <= 0),
      ...this.windows,
      ...this.survivors.filter(s => s.alive && s.state === "downed" && !s.carried && !s.onHook)
    ];

    let best = null, bd = maxD;
    for (const x of list) {
      const d = dist(k, x);
      if (d < bd) {
        best = x;
        bd = d;
      }
    }
    return best;
  }

  describeInteract(s, target) {
    if (target instanceof Generator) return target.done ? "Generador completado" : "Mantén E para reparar";
    if (target instanceof Chest) return target.opened ? "Cofre abierto" : "Mantén E para abrir cofre";
    if (target instanceof Pallet) return target.used ? "E para saltar pallet" : "E para tirar pallet";
    if (target instanceof Locker) return "E para esconderte";
    if (target instanceof ExitGate) return target.powered ? (target.open ? "E para escapar" : "Mantén E para abrir puerta") : "Puerta sin energía";
    if (target instanceof Hatch) return target.open ? "E para escapar por la trampilla" : "Trampilla cerrada";
    if (target instanceof Hook) return s.item.id === "toolbox" ? "Mantén E para sabotear gancho" : "Necesitas caja para sabotear";
    if (target instanceof Totem) return target.hex ? "Mantén E para limpiar tótem hex" : "Mantén E para limpiar tótem";
    if (target instanceof WindowVault) return "E para saltar ventana";
    if (target instanceof Survivor) {
      if (target.onHook) return "Mantén E para rescatar";
      if (target.state === "injured" || target.state === "downed") return "Mantén E para curar";
    }
    return "E para interactuar";
  }

  describeKillerInteract(target) {
    if (target instanceof Generator) return "Mantén E para patear generador";
    if (target instanceof Pallet) return "Mantén E para romper pallet";
    if (target instanceof Locker) return target.inside ? "E para sacar superviviente" : "E para registrar taquilla";
    if (target instanceof Hook) return this.killer.carrying ? "E para colgar" : "Gancho libre";
    if (target instanceof WindowVault) return "Mantén E para saltar ventana";
    if (target instanceof Survivor) return "E para recoger superviviente";
    return "E para interactuar";
  }

  handleSurvivorInteract(s, target, dt, ai) {
    if (target instanceof Generator) this.performRepair(s, target, dt, ai);
    else if (target instanceof Chest) this.performChest(s, target, dt, ai);
    else if (target instanceof Pallet) {
      if (target.used) this.vaultPallet(s, target, ai);
      else this.dropPallet(s, target);
    }
    else if (target instanceof Locker) this.enterLocker(s, target);
    else if (target instanceof ExitGate) this.performGate(s, target, dt, ai);
    else if (target instanceof Hatch) this.tryHatch(s, target);
    else if (target instanceof Hook) this.performSabotage(s, target, dt, ai);
    else if (target instanceof Totem) this.performTotem(s, target, dt, ai);
    else if (target instanceof WindowVault) this.vaultEntity(s, target, ai);
    else if (target instanceof Survivor) {
      if (target.onHook) this.performRescue(s, target, dt, ai);
      else if (target.state === "injured" || target.state === "downed") this.performHeal(s, target, dt, ai);
    }
  }

  handleKillerInteract(k, target, dt) {
    if (k.carrying && target instanceof Hook) {
      this.hookSurvivor(k.carrying, target);
      return;
    }
    if (target instanceof Survivor && target.state === "downed") this.pickUpSurvivor(target);
    else if (target instanceof Generator) this.performKillerAction(k, target, "Pateando generador", 1.7, dt, () => this.kickGenerator(target));
    else if (target instanceof Pallet) this.performKillerAction(k, target, "Rompiendo pallet", 2.1, dt, () => this.breakPallet(target));
    else if (target instanceof Locker) {
      if (target.inside) this.grabFromLocker(target);
      else this.performKillerAction(k, target, "Registrando taquilla", 1.1, dt, () => this.ui.addMessage("Taquilla vacía. Humillación silenciosa."));
    }
    else if (target instanceof WindowVault) this.performKillerAction(k, target, "Saltando ventana", 1.4, dt, () => this.vaultEntity(k, target, false));
  }

  performRepair(s, gen, dt, ai = false) {
    if (gen.done || s.state === "downed") return;
    const coop = Math.max(1, gen.users.size + 1);
    const hexPenalty = this.hexActive ? 0.88 : 1;
    const itemBoost = s.item.id === "toolbox" && s.item.charges > 0 ? 1.55 : 1;
    const speed = 0.030 * s.char.repair * hexPenalty * itemBoost * (0.82 + coop * 0.18);

    gen.users.add(s);
    gen.progress += speed * dt;
    s.score.repair += dt * 8;
    gen.regress = 0;

    if (!ai) {
      this.setPlayerAction("Reparando generador", gen.progress);
      if (!this.skillCheck && Math.random() < dt * 0.32 * this.difficulty.skillCheck) this.spawnSkillCheck("gen", gen, s);
    }

    if (s.item.id === "toolbox" && s.item.charges > 0) {
      s.item.charges -= dt * 3.5;
      if (s.item.charges <= 0) {
        s.item = { ...ITEMS.none };
        this.ui.addMessage("La caja de herramientas se ha gastado.");
      }
    }
  }

  performChest(s, chest, dt, ai = false) {
    if (chest.opened) return;
    this.progressAction(s, chest, "chest", "Abriendo cofre", GAME.chestDuration, dt, () => {
      chest.opened = true;
      s.item = { ...ITEMS[chest.item] };
      this.itemMaxCharges = s.item.charges || 1;
      this.ui.addMessage(`${s.name} encuentra ${s.item.name}.`);
      this.audio.ui();
    }, ai);
  }

  performGate(s, gate, dt, ai = false) {
    if (!gate.powered) return;
    if (gate.open) {
      this.tryEscape(s, gate);
      return;
    }
    gate.progress += dt / GAME.gateDuration;
    if (!ai) this.setPlayerAction("Abriendo puerta", gate.progress);
    if (gate.progress >= 1) {
      gate.open = true;
      this.startEndgame();
      this.ui.addMessage("Una puerta de salida se ha abierto.");
      this.audio.genDone();
    }
  }

  performHeal(s, target, dt, ai = false) {
    if (!target.alive || target.carried || target.onHook || target.state === "healthy") return;
    const self = s === target;
    if (self && s.item.id !== "medkit") return;

    const base = target.state === "downed" ? 9.0 : 11.0;
    const medkitBoost = s.item.id === "medkit" ? 1.65 : 1;
    const duration = base / (s.char.heal * medkitBoost);

    this.progressAction(s, target, "heal", self ? "Autocurándote" : `Curando a ${target.name}`, duration, dt, () => {
      target.healOneState();
      s.score.altruism += self ? 90 : 250;
      this.ui.addMessage(`${target.name} ha sido curado.`);
      this.particles.burst(target.x, target.y, "#8dff98", 12, 70, 0.6);
      if (s.item.id === "medkit") {
        s.item.charges -= 12;
        if (s.item.charges <= 0) s.item = { ...ITEMS.none };
      }
    }, ai);

    if (!ai && !this.skillCheck && Math.random() < dt * 0.20 * this.difficulty.skillCheck) this.spawnSkillCheck("heal", target, s);
  }

  performRecover(s, dt, ai = false) {
    if (s.state !== "downed" || s.recover >= 0.95) return;
    s.recover = Math.min(0.95, s.recover + dt / GAME.recoverDuration);
    if (!ai) this.setPlayerAction("Recuperándote", s.recover);
  }

  performRescue(s, target, dt, ai = false) {
    if (!target.onHook) return;
    this.progressAction(s, target, "rescue", `Rescatando a ${target.name}`, GAME.rescueDuration, dt, () => {
      const hook = this.hooks.find(h => h.occupied === target);
      if (hook) hook.occupied = null;
      target.onHook = false;
      target.state = "injured";
      target.endurance = 8;
      target.invuln = 1.2;
      target.hookTimer = 0;
      target.x = s.x + 28;
      target.y = s.y + 28;
      s.score.altruism += 450;
      this.ui.addMessage(`${target.name} ha sido descolgado.`);
      this.particles.burst(target.x, target.y, "#fff", 12, 80, 0.5);
    }, ai);
  }

  performSabotage(s, hook, dt, ai = false) {
    if (hook.occupied || hook.sabotaged > 0 || s.item.id !== "toolbox") return;
    const duration = GAME.sabotageDuration / (s.char.repair * 1.15);
    this.progressAction(s, hook, "sabotage", "Saboteando gancho", duration, dt, () => {
      hook.sabotaged = 38;
      s.item.charges -= 16;
      if (s.item.charges <= 0) s.item = { ...ITEMS.none };
      s.score.boldness += 280;
      this.ui.addMessage("Gancho saboteado. El killer acaba de apretar el culo.");
      this.particles.burst(hook.x, hook.y, "#a77bff", 14, 100, 0.75);
    }, ai);
  }

  performTotem(s, totem, dt, ai = false) {
    if (totem.cleansed) return;
    const duration = totem.hex ? GAME.totemDuration : GAME.totemDuration * 0.75;
    this.progressAction(s, totem, "totem", totem.hex ? "Limpiando tótem hex" : "Limpiando tótem", duration, dt, () => {
      totem.cleansed = true;
      if (totem.hex) {
        this.hexActive = false;
        this.ui.addMessage("Tótem hex limpiado. Reparaciones normalizadas.");
      } else {
        this.ui.addMessage("Tótem limpiado.");
      }
      s.score.boldness += totem.hex ? 420 : 180;
      this.particles.burst(totem.x, totem.y, totem.hex ? COLORS.hex : COLORS.totem, 18, 120, 0.8);
    }, ai);
  }

  performKillerAction(k, target, label, duration, dt, done) {
    this.progressAction(k, target, label, label, duration, dt, done, false);
  }

  progressAction(user, target, type, label, duration, dt, done, ai = false) {
    if (!user.action || user.action.target !== target || user.action.type !== type) {
      user.action = { target, type, progress: 0 };
    }

    user.action.progress += dt / duration;

    if (user.isPlayer && !ai) this.setPlayerAction(label, user.action.progress);

    if (user.action.progress >= 1) {
      user.action = null;
      if (user.isPlayer) this.setPlayerAction("", 0);
      done();
    }
  }

  clearAction(ent) {
    if (ent) ent.action = null;
    if (ent?.isPlayer || ent === this.player) this.setPlayerAction("", 0);
  }

  setPlayerAction(label, progress) {
    this.playerActionLabel = label || "Acción";
    this.playerActionProgress = clamp(progress || 0, 0, 1);
  }

  spawnSkillCheck(type, target, survivor) {
    const baseZone = survivor.char.id === "alex" ? 0.16 : 0.12;
    const hex = this.hexActive && type === "gen" ? 0.76 : 1;
    this.skillCheck = {
      type,
      target,
      survivor,
      cursor: 0,
      speed: rand(0.85, 1.35) * this.difficulty.skillCheck,
      zone: baseZone * hex,
      great: 0.035,
      pos: rand(0.18, 0.82)
    };
  }

  updateSkillCheck(dt) {
    if (!this.skillCheck) return;
    const sc = this.skillCheck;
    sc.cursor += dt * sc.speed;
    if (this.input.hit(" ")) this.resolveSkillCheck();
    if (sc.cursor > 1) this.failSkillCheck("No pulsaste a tiempo.");
  }

  resolveSkillCheck() {
    const sc = this.skillCheck;
    if (!sc) return;
    const delta = Math.abs(sc.cursor - sc.pos);
    if (delta < sc.great) {
      if (sc.type === "gen") sc.target.progress += 0.045;
      this.ui.addMessage("Prueba perfecta. Qué sobrada, cabrón.");
      this.audio.skill(true);
      sc.survivor.score.repair += 120;
      this.skillCheck = null;
    } else if (delta < sc.zone) {
      if (sc.type === "gen") sc.target.progress += 0.018;
      this.ui.addMessage("Prueba superada.");
      this.audio.skill(true);
      this.skillCheck = null;
    } else {
      this.failSkillCheck("Prueba fallida.");
    }
  }

  failSkillCheck(reason) {
    const sc = this.skillCheck;
    if (!sc) return;
    if (sc.type === "gen") {
      sc.target.progress = clamp(sc.target.progress - 0.08, 0, 1);
      sc.target.flash = 0.8;
      sc.target.noise = 1.2;
      this.addNoise(sc.target.x, sc.target.y, 1.4, "explosión de generador");
    }
    this.ui.addMessage(`${reason} El ruido se ha escuchado medio mapa.`);
    this.audio.skill(false);
    this.particles.burst(sc.target.x, sc.target.y, "#ff5555", 20, 120, 0.7);
    this.skillCheck = null;
  }

  useSurvivorItem(s) {
    if (s.item.id === "none") return;
    if (s.item.id === "medkit" && s.state === "injured") {
      this.ui.addMessage("Mantén E sin objetivo cercano para autocurarte con el botiquín.");
      return;
    }
    if (s.item.id === "flashlight") {
      if (s.item.charges <= 0) return;
      s.item.charges -= 1;
      this.particles.burst(s.x + s.lastDir.x * 30, s.y + s.lastDir.y * 30, "#fff7ad", 18, 180, 0.32);
      if (dist(s, this.killer) < 175 && !this.map.lineBlocked(s, this.killer)) {
        this.killer.stun = Math.max(this.killer.stun, 1.7);
        this.ui.addMessage("¡Killer cegado con linterna!");
        this.audio.skill(true);
      } else {
        this.ui.addMessage("Linternazo al aire. Cinematográfico, pero inútil.");
      }
      if (s.item.charges <= 0) s.item = { ...ITEMS.none };
    }
    if (s.item.id === "map") {
      s.revealed = 8;
      s.item.charges -= 4;
      this.ui.addMessage("El mapa revela objetivos cercanos.");
      if (s.item.charges <= 0) s.item = { ...ITEMS.none };
    }
    if (s.item.id === "key") {
      if (this.hatch.open && dist(s, this.hatch) < 80) this.tryHatch(s, this.hatch);
      else this.ui.addMessage("La llave vibra, pero aquí no abre nada.");
    }
  }

  useKillerPower() {
    const k = this.killer;
    if (k.powerCd > 0 || k.stun > 0) {
      if (k.isPlayer) this.ui.addMessage("Poder en enfriamiento.");
      return;
    }
    k.powerActive = 0.38;
    k.powerCd = 10.5;
    this.particles.burst(k.x, k.y, "#ff6d6d", 18, 120, 0.5);
    this.audio.hit();
  }

  placeTrap(playerMade = false) {
    const k = this.killer;
    if (k.trapCd > 0 || this.traps.length >= 6) {
      if (playerMade) this.ui.addMessage("No puedes poner otra trampa todavía.");
      return;
    }
    const tr = new SnareTrap(k.x - k.lastDir.x * 22, k.y - k.lastDir.y * 22, playerMade);
    this.traps.push(tr);
    k.trapCd = 8;
    if (playerMade) this.ui.addMessage("Trampa de lodo colocada.");
  }

  killerAttack(k) {
    if (k.attackCd > 0 || k.stun > 0) return;
    k.attackCd = k.powerActive > 0 ? 0.75 : 1.05;
    k.attackFx = 0.18;
    let hit = false;

    for (const s of this.survivors) {
      if (!s.alive || s.onHook || s.carried || s.inLocker) continue;
      const range = k.powerActive > 0 ? 64 : 48;
      if (dist(k, s) <= range && !this.map.lineBlocked(k, s)) {
        const result = s.hit();
        hit = true;
        s.score.boldness += 60;
        if (result === "endurance") this.ui.addMessage(`${s.name} resiste el golpe por aguante.`);
        else this.ui.addMessage(`${s.name} recibe un golpe.`);
        this.particles.burst(s.x, s.y, COLORS.blood, 18, 125, 0.7);
        this.audio.hit();
        this.addNoise(s.x, s.y, 1, "grito");
        break;
      }
    }

    if (!hit && k.isPlayer) {
      this.ui.addMessage("Golpe fallado. Whiff legendario.");
      this.audio.noise(0.08, 0.02);
    }
  }

  pickUpSurvivor(s) {
    if (this.killer.carrying || s.state !== "downed" || s.carried) return;
    this.killer.carrying = s;
    s.carried = true;
    s.action = null;
    this.ui.addMessage(`${s.name} ha sido recogido.`);
  }

  hookSurvivor(s, hook) {
    if (!s || !hook || hook.occupied || hook.sabotaged > 0) return;
    this.killer.carrying = null;
    s.carried = false;
    s.onHook = true;
    s.state = "injured";
    s.hookCount += 1;
    s.hookTimer = 70 * s.char.courage;
    s.x = hook.x;
    s.y = hook.y;
    hook.occupied = s;
    this.particles.burst(hook.x, hook.y, COLORS.hook, 18, 100, 0.7);
    this.ui.addMessage(`${s.name} colgado. Gancho ${s.hookCount}/3.`);
    if (s.hookCount >= 3) this.killSurvivor(s, "sacrificio");
  }

  unhookSelf(s) {
    const hook = this.hooks.find(h => h.occupied === s);
    if (hook) hook.occupied = null;
    s.onHook = false;
    s.state = "injured";
    s.endurance = 6;
    s.x += 28;
    this.ui.addMessage(`${s.name} se ha soltado solo. Eso sí que es potra.`);
  }

  killSurvivor(s, reason = "muerte") {
    const hook = this.hooks.find(h => h.occupied === s);
    if (hook) hook.occupied = null;
    s.dead = true;
    s.onHook = false;
    s.carried = false;
    if (this.killer.carrying === s) this.killer.carrying = null;
    this.ui.addMessage(`${s.name} ha muerto (${reason}).`);
    this.particles.burst(s.x, s.y, COLORS.blood, 28, 160, 1.0);
  }

  kickGenerator(gen) {
    gen.progress = clamp(gen.progress - 0.07, 0, 1);
    gen.regress = 24;
    gen.flash = 0.5;
    this.addNoise(gen.x, gen.y, 0.7, "generador pateado");
    this.ui.addMessage("Generador pateado.");
    this.audio.noise(0.12, 0.04);
  }

  breakPallet(pallet) {
    pallet.broken = true;
    this.ui.addMessage("Pallet roto. Astillas emocionales incluidas.");
    this.particles.burst(pallet.x, pallet.y, COLORS.pallet, 20, 130, 0.75);
    this.audio.noise(0.18, 0.05);
  }

  dropPallet(s, pallet) {
    if (pallet.used || pallet.broken) return;
    pallet.used = true;
    s.score.boldness += 100;
    this.ui.addMessage(`${s.name} tira un pallet.`);
    this.particles.burst(pallet.x, pallet.y, COLORS.pallet, 14, 100, 0.6);

    if (dist(this.killer, pallet) < 58) {
      this.killer.stun = Math.max(this.killer.stun, 2.25);
      if (this.killer.carrying) {
        this.killer.carrying.carried = false;
        this.killer.carrying.state = "downed";
        this.killer.carrying.x = this.killer.x + 24;
        this.killer.carrying.y = this.killer.y + 24;
        this.killer.carrying = null;
      }
      this.ui.addMessage("¡Killer aturdido con pallet!");
      this.audio.hit();
    }
  }

  vaultPallet(ent, pallet, ai = false) {
    if (pallet.broken || !pallet.used) return;
    const dx = ent.x - pallet.x;
    const dy = ent.y - pallet.y;
    if (pallet.rot === 0) ent.y = pallet.y + (dy >= 0 ? -42 : 42);
    else ent.x = pallet.x + (dx >= 0 ? -42 : 42);
    if (!ai && ent.isPlayer) this.ui.addMessage("Saltas el pallet.");
  }

  vaultEntity(ent, vault, ai = false) {
    const dx = ent.x - vault.x;
    const dy = ent.y - vault.y;
    if (vault.rot === 0) ent.y = vault.y + (dy >= 0 ? -62 : 62);
    else ent.x = vault.x + (dx >= 0 ? -62 : 62);
    if (ent.role === "survivor") ent.score.boldness += 25;
    if (!ai && ent.isPlayer) this.ui.addMessage("Vault realizado.");
  }

  enterLocker(s, locker) {
    if (locker.inside || s.state === "downed") return;
    locker.inside = s;
    s.inLocker = locker;
    s.vx = s.vy = 0;
    s.x = locker.x;
    s.y = locker.y;
    this.clearAction(s);
    if (s.isPlayer) this.ui.addMessage("Te escondes en una taquilla.");
  }

  exitLocker(s) {
    if (!s.inLocker) return;
    s.inLocker.inside = null;
    s.inLocker = null;
    s.x += 32;
    if (s.isPlayer) this.ui.addMessage("Sales de la taquilla.");
  }

  grabFromLocker(locker) {
    const s = locker.inside;
    if (!s) return;
    locker.inside = null;
    s.inLocker = null;
    s.state = "downed";
    this.pickUpSurvivor(s);
    this.ui.addMessage(`${s.name} ha sido sacado de una taquilla. Pillada histórica.`);
  }

  startEndgame() {
    if (!this.endgameActive) {
      this.endgameActive = true;
      this.endgameTimer = GAME.endgameDuration;
      this.ui.addMessage("Colapso final iniciado.");
    }
  }

  tryEscape(s, gate) {
    if (!gate.open || !s.alive) return;
    if (dist(s, gate) <= 72) {
      s.escaped = true;
      s.score.survival += 1200;
      this.ui.addMessage(`${s.name} ha escapado.`);
      this.particles.burst(s.x, s.y, "#aeefff", 24, 160, 0.8);
      this.audio.genDone();
    }
  }

  tryHatch(s, hatch) {
    if (!hatch.open || !s.alive) return;
    if (s.item.id === "key" || this.livingSurvivors().length <= 1) {
      s.escaped = true;
      s.score.survival += 1500;
      if (s.item.id === "key") s.item = { ...ITEMS.none };
      this.ui.addMessage(`${s.name} escapa por la trampilla.`);
      this.audio.genDone();
    }
  }

  moveAll(dt) {
    for (const s of this.survivors) {
      if (!s.alive || s.carried || s.onHook || s.inLocker) continue;
      this.map.moveEntity(s, dt);
    }

    this.map.moveEntity(this.killer, dt);

    if (this.killer.carrying) {
      const c = this.killer.carrying;
      c.x = this.killer.x + 24;
      c.y = this.killer.y;
    }
  }

  resolveWorldInteractions(dt) {
    for (const h of this.hooks) {
      h.sabotaged = Math.max(0, h.sabotaged - dt);
      if (h.occupied) {
        const s = h.occupied;
        s.hookTimer -= dt;
        if (s.hookTimer <= 0) this.killSurvivor(s, "gancho");
      }
    }

    for (const p of this.pallets) {
      if (!p.used || p.broken) continue;
      const r = p.rect();
      if (circleRectCollide(this.killer.x, this.killer.y, this.killer.r, r)) {
        this.killer.x -= this.killer.vx * dt * 1.5;
        this.killer.y -= this.killer.vy * dt * 1.5;
      }
    }

    for (const tr of this.traps) {
      if (tr.armed > 0 || tr.dead) continue;
      for (const s of this.survivors) {
        if (!s.interactable || s.state === "downed") continue;
        if (dist(s, tr) < 26) {
          tr.triggered = 1.2;
          tr.dead = true;
          s.scream = 1.2;
          s.revealed = 6;
          s.stamina = 0;
          this.addNoise(s.x, s.y, 1.8, "trampa activada");
          this.ui.addMessage(`${s.name} pisa una trampa de lodo.`);
          this.particles.burst(s.x, s.y, "#6c5878", 22, 120, 0.7);
        }
      }
    }
  }

  updateObjectives(dt) {
    for (const g of this.generators) {
      const wasDone = g.done;
      g.update(dt);
      if (!wasDone && g.done) {
        this.ui.addMessage("Generador completado.");
        this.particles.burst(g.x, g.y, COLORS.genDone, 26, 150, 0.75);
        this.audio.genDone();
      }
    }

    this.gensDone = this.generators.filter(g => g.done).length;
    for (const gate of this.gates) gate.powered = this.gensDone >= GAME.gensNeeded;

    this.hatch.open = this.livingSurvivors().length <= 1 || this.gensDone >= GAME.gensNeeded + 1;
    if (Math.floor(this.time) % 20 === 0) this.forceObjectiveFallbacks();

    if (this.endgameActive) {
      this.endgameTimer -= dt;
      if (this.endgameTimer <= 0) {
        for (const s of this.survivors) {
          if (s.alive && !s.escaped) this.killSurvivor(s, "colapso final");
        }
        this.end = "collapse";
      }
    }

    const anyOpen = this.gates.some(g => g.open);
    if (anyOpen) this.startEndgame();

    const activeChase = this.survivors.some(s => s.interactable && dist(s, this.killer) < GAME.chaseRange && !this.map.lineBlocked(s, this.killer));
    if (activeChase) this.killer.bloodlust += dt;
    else this.killer.bloodlust = Math.max(0, this.killer.bloodlust - dt * 2.5);
  }


  ensureSpawnSafety() {
    for (const p of this.map.spawnPoints) this.map.ensureOpenArea(p.x, p.y, 2);
    this.map.ensureOpenArea(this.killer.x, this.killer.y, 2);

    for (const ent of [...this.survivors, this.killer]) {
      const safe = this.map.nearestOpenPoint(ent.x, ent.y, 20);
      ent.x = safe.x;
      ent.y = safe.y;
      ent.vx = 0;
      ent.vy = 0;
    }

    for (const obj of [
      ...this.generators, ...this.hooks, ...this.chests, ...this.pallets,
      ...this.lockers, ...this.gates, ...this.totems, ...this.windows, this.hatch
    ]) {
      if (!obj) continue;
      const path = this.map.findPath(this.reachabilityAnchor, obj, { maxIterations: 6000 });
      if (path.length === 0 || this.map.collidesCircle(obj.x, obj.y, Math.max(8, obj.r || 8))) {
        const safe = this.map.randomOpenPointReachableFrom(this.reachabilityAnchor, 150, 800);
        this.map.ensureOpenArea(safe.x, safe.y, 2);
        obj.x = safe.x;
        obj.y = safe.y;
      }
    }
  }

  resetNavigationMemory() {
    for (const ent of [...this.survivors, this.killer]) {
      ent.watchdog = { x: ent.x, y: ent.y, still: 0, fixes: 0, lastReason: "" };
      ent.ai = ent.ai || {};
      ent.ai.nav = { path: [], index: 0, key: "", repath: 0, failures: 0 };
      ent.ai.blackboard = { objectiveAge: 0, lastSafePos: { x: ent.x, y: ent.y } };
    }
  }

  targetKey(target) {
    if (!target) return "none";
    return `${target.id || target.name || "p"}:${Math.round(target.x / 24)}:${Math.round(target.y / 24)}`;
  }

  smartMove(ent, target, speed, dt, opts = {}) {
    if (!target || speed <= 0) {
      ent.vx = 0;
      ent.vy = 0;
      return false;
    }

    ent.ai = ent.ai || {};
    ent.ai.nav = ent.ai.nav || { path: [], index: 0, key: "", repath: 0, failures: 0 };
    const nav = ent.ai.nav;
    const directRange = opts.directRange ?? 92;
    const stopRange = opts.stopRange ?? 42;
    const repathEvery = opts.repathEvery ?? 0.38;
    const finalDistance = dist(ent, target);

    if (finalDistance <= stopRange) {
      ent.vx = 0;
      ent.vy = 0;
      return true;
    }

    if (finalDistance < directRange && !this.map.lineBlocked(ent, target)) {
      const n = normalize(target.x - ent.x, target.y - ent.y);
      ent.vx = n.x * speed;
      ent.vy = n.y * speed;
      return true;
    }

    nav.repath -= dt;
    const key = this.targetKey(target);
    const mustRepath = key !== nav.key || nav.repath <= 0 || !nav.path?.length || nav.index >= nav.path.length;

    if (mustRepath) {
      nav.path = this.map.findPath(ent, target, { margin: opts.margin ?? 0, maxIterations: opts.maxIterations ?? 6500 });
      nav.index = 0;
      nav.key = key;
      nav.repath = repathEvery + Math.random() * 0.18;
      if (!nav.path.length) nav.failures = (nav.failures || 0) + 1;
      else nav.failures = 0;
    }

    if (!nav.path.length) {
      const near = this.map.nearestOpenPoint(target.x, target.y, 16);
      if (near && !this.map.lineBlocked(ent, near)) {
        const n = normalize(near.x - ent.x, near.y - ent.y);
        ent.vx = n.x * speed;
        ent.vy = n.y * speed;
        return true;
      }
      ent.vx = 0;
      ent.vy = 0;
      return false;
    }

    while (nav.index < nav.path.length - 1 && dist(ent, nav.path[nav.index]) < 28) nav.index++;
    const wp = nav.path[nav.index] || target;
    const n = normalize(wp.x - ent.x, wp.y - ent.y);
    ent.vx = n.x * speed;
    ent.vy = n.y * speed;
    return true;
  }

  invalidateNav(ent) {
    if (ent?.ai?.nav) {
      ent.ai.nav.path = [];
      ent.ai.nav.index = 0;
      ent.ai.nav.key = "";
      ent.ai.nav.repath = 0;
    }
  }

  countSurvivorIntent(goal, target, exclude = null) {
    return this.survivors.filter(s => s !== exclude && s.alive && s.ai?.goal === goal && s.ai?.target === target).length;
  }

  bestGeneratorFor(s) {
    const candidates = this.generators.filter(g => !g.done);
    if (!candidates.length) return null;
    return candidates
      .map(g => {
        const crowd = g.users.size + this.countSurvivorIntent("repair", g, s);
        const danger = dist(g, this.killer) < GAME.terrorRadius ? 450 : 0;
        const progressBonus = -g.progress * 260;
        return { g, score: dist(s, g) + crowd * 190 + danger + progressBonus };
      })
      .sort((a, b) => a.score - b.score)[0]?.g || candidates[0];
  }

  bestGateFor(s) {
    return [...this.gates].sort((a, b) => dist(s, a) - dist(s, b))[0] || this.gates[0];
  }

  safeHookForKiller() {
    if (!this.killer.carrying) return null;
    return this.hooks
      .filter(h => !h.occupied && h.sabotaged <= 0)
      .sort((a, b) => dist(this.killer, a) - dist(this.killer, b))[0] || null;
  }

  updateAntiSoftlocks(dt) {
    this.softlockTimer = (this.softlockTimer || 0) + dt;
    if (this.softlockTimer < 0.18) return;
    const step = this.softlockTimer;
    this.softlockTimer = 0;

    const ents = [...this.survivors, this.killer];
    for (const ent of ents) {
      if (!ent || ent.dead || ent.escaped || ent.carried || ent.onHook || ent.inLocker) continue;
      ent.watchdog = ent.watchdog || { x: ent.x, y: ent.y, still: 0, fixes: 0, lastReason: "" };
      const wd = ent.watchdog;

      if (this.map.collidesCircle(ent.x, ent.y, ent.r)) {
        this.emergencyUnstuck(ent, ent.isPlayer, "dentro de una colisión");
        continue;
      }

      const wantedMove = Math.hypot(ent.vx, ent.vy) > 18;
      const moved = Math.hypot(ent.x - wd.x, ent.y - wd.y);
      if (wantedMove && moved < 2.5) wd.still += step;
      else wd.still = Math.max(0, wd.still - step * 1.5);

      wd.x = ent.x;
      wd.y = ent.y;

      if (ent.isPlayer) {
        if (wd.still > 1.8) this.promptText = `${this.promptText ? this.promptText + " | " : ""}Pulsa U para destrabarte`;
        continue;
      }

      if (wd.still > 1.25) {
        wd.fixes++;
        this.invalidateNav(ent);
        ent.action = null;
        if (ent.ai) {
          ent.ai.think = 0;
          ent.ai.panic = Math.max(ent.ai.panic || 0, 0.5);
        }
      }

      if (wd.still > 3.0 || wd.fixes >= 4) {
        this.emergencyUnstuck(ent, false, "watchdog NPC");
        wd.fixes = 0;
        wd.still = 0;
      }
    }
  }

  emergencyUnstuck(ent, notify = false, reason = "manual") {
    const old = { x: ent.x, y: ent.y };
    let safe = this.map.nearestOpenPoint(ent.x, ent.y, 22);

    if (!safe || this.map.collidesCircle(safe.x, safe.y, ent.r)) {
      if (ent.role === "killer") safe = this.map.randomOpenPointReachableFrom(this.reachabilityAnchor, 200, 800);
      else safe = this.map.randomOpenPointReachableFrom(this.reachabilityAnchor, 120, 800);
    }

    ent.x = safe.x;
    ent.y = safe.y;
    ent.vx = 0;
    ent.vy = 0;
    ent.action = null;
    this.invalidateNav(ent);

    if (ent.watchdog) {
      ent.watchdog.x = ent.x;
      ent.watchdog.y = ent.y;
      ent.watchdog.still = 0;
      ent.watchdog.lastReason = reason;
    }

    this.particles.burst(ent.x, ent.y, "#bdefff", 12, 90, 0.45);
    if (notify) this.ui.addMessage(`${ent.name || "Jugador"} recolocado para evitar softlock.`);
    return Math.hypot(old.x - ent.x, old.y - ent.y);
  }

  forceObjectiveFallbacks() {
    if (this.gensDone < GAME.gensNeeded) {
      const active = this.generators.filter(g => !g.done);
      if (active.length <= GAME.gensNeeded - this.gensDone) {
        for (const g of active) g.progress = Math.max(g.progress, 0.15);
      }
    }
  }

  livingSurvivors() {
    return this.survivors.filter(s => s.alive);
  }

  findFreshTrailNear(k, maxD) {
    let best = null, bd = maxD;
    for (const s of this.survivors) {
      for (const tr of s.markTrails) {
        const d = Math.hypot(k.x - tr.x, k.y - tr.y);
        if (d < bd) {
          best = tr;
          bd = d;
        }
      }
    }
    return best;
  }

  updateCamera() {
    const p = this.player;
    this.camera.w = this.canvas.width;
    this.camera.h = this.canvas.height;
    this.camera.x = clamp(p.x - this.camera.w/2, 0, this.map.w * TILE - this.camera.w);
    this.camera.y = clamp(p.y - this.camera.h/2, 0, this.map.h * TILE - this.camera.h);
  }

  updateAudio(dt) {
    if (this.role === "survivor" && this.player?.alive) {
      const d = dist(this.player, this.killer);
      const intensity = clamp(1 - d / GAME.terrorRadius, 0, 1);
      this.audio.updateHeartbeat(dt, intensity);
    }
  }

  checkEnd() {
    if (!this.running) return;

    const alive = this.survivors.filter(s => s.alive);
    const escaped = this.survivors.filter(s => s.escaped);
    const dead = this.survivors.filter(s => s.dead);

    let kind = null;
    if (this.role === "survivor") {
      if (this.player.escaped) kind = "player_escape";
      else if (this.player.dead) kind = "player_dead";
      else if (escaped.length >= 3) kind = "team_escape";
    } else {
      if (alive.length === 0) kind = escaped.length >= 3 ? "killer_loss" : (escaped.length === 0 ? "killer_win" : "mixed");
      else if (escaped.length >= 3) kind = "killer_loss";
    }

    if (this.end === "collapse") kind = "collapse";

    if (kind) {
      this.running = false;
      this.ui.showEnd(kind, {
        escaped: escaped.length,
        dead: dead.length,
        gens: this.gensDone,
        time: this.time,
        summary: this.resultSummary(kind, escaped.length, dead.length)
      });
    }
  }

  resultSummary(kind, escaped, dead) {
    if (kind === "player_escape") return "Has salido vivo. Te puedes permitir chulearte un poco.";
    if (kind === "player_dead") return "La Entidad te ha hecho contrato indefinido. Mal asunto.";
    if (kind === "team_escape") return "La mayoría del equipo ha escapado.";
    if (kind === "killer_win") return "No ha escapado nadie. Carnicería limpia.";
    if (kind === "killer_loss") return "Han escapado demasiados. El sindicato de killers te abre expediente.";
    if (kind === "collapse") return "El colapso final ha cerrado la prueba.";
    return `Partida mixta: ${escaped} escapados, ${dead} muertos.`;
  }

  draw() {
    const ctx = this.ctx;
    const cam = this.camera;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.map) return;

    this.map.draw(ctx, cam);

    this.drawScratchMarks(ctx, cam);
    for (const tr of this.traps) tr.draw(ctx, cam);
    for (const g of this.generators) g.draw(ctx, cam);
    for (const h of this.hooks) h.draw(ctx, cam);
    for (const c of this.chests) c.draw(ctx, cam);
    for (const t of this.totems) t.draw(ctx, cam);
    for (const w of this.windows) w.draw(ctx, cam);
    for (const p of this.pallets) p.draw(ctx, cam);
    for (const l of this.lockers) l.draw(ctx, cam);
    for (const gate of this.gates) gate.draw(ctx, cam);
    this.hatch.draw(ctx, cam);

    for (const n of this.noises) this.drawNoise(ctx, cam, n);

    this.particles.draw(ctx, cam);

    for (const s of this.survivors) s.draw(ctx, cam);
    this.killer.draw(ctx, cam);

    this.drawSkillCheck(ctx);
    if (this.options?.minimap) this.drawMinimap(ctx);
    if (this.options?.fog) this.drawFog(ctx);
  }

  drawScratchMarks(ctx, cam) {
    for (const s of this.survivors) {
      for (const tr of s.markTrails) {
        const alpha = clamp(tr.life / 4, 0, 0.6);
        ctx.fillStyle = `rgba(255,65,65,${alpha})`;
        ctx.beginPath();
        ctx.ellipse(tr.x - cam.x, tr.y - cam.y, 7, 3, rand(0, Math.PI), 0, Math.PI*2);
        ctx.fill();
      }
    }
  }

  drawNoise(ctx, cam, n) {
    if (this.role !== "killer" && this.player?.revealed <= 0) return;
    ctx.strokeStyle = `rgba(255,255,255,${clamp(n.life / 4, 0, 0.7)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(n.x - cam.x, n.y - cam.y, 28 + (4 - n.life) * 20, 0, Math.PI*2);
    ctx.stroke();
  }

  drawSkillCheck(ctx) {
    if (!this.skillCheck) return;
    const sc = this.skillCheck;
    const x = this.canvas.width / 2 - 180;
    const y = this.canvas.height - 92;
    const w = 360;
    const h = 20;
    ctx.fillStyle = "rgba(0,0,0,0.78)";
    ctx.fillRect(x - 18, y - 24, w + 36, 66);
    ctx.fillStyle = "#2b2d35";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#52ff8c";
    ctx.fillRect(x + (sc.pos - sc.zone) * w, y, sc.zone * 2 * w, h);
    ctx.fillStyle = "#f3e45f";
    ctx.fillRect(x + (sc.pos - sc.great) * w, y, sc.great * 2 * w, h);
    ctx.fillStyle = "#fff";
    ctx.fillRect(x + sc.cursor * w - 2, y - 9, 4, h + 18);
    ctx.textAlign = "center";
    ctx.font = "bold 13px Arial";
    ctx.fillText("ESPACIO", x + w / 2, y - 7);
  }

  drawMinimap(ctx) {
    const scale = 0.075;
    const mw = this.map.w * 48 * scale;
    const mh = this.map.h * 48 * scale;
    const x = this.canvas.width - mw - 18;
    const y = this.canvas.height - mh - 18;
    ctx.fillStyle = "rgba(0,0,0,0.58)";
    ctx.fillRect(x - 8, y - 8, mw + 16, mh + 16);

    ctx.fillStyle = "#444";
    for (const wall of this.map.walls) ctx.fillRect(x + wall.x*scale, y + wall.y*scale, wall.w*scale, wall.h*scale);

    for (const g of this.generators) {
      ctx.fillStyle = g.done ? COLORS.genDone : COLORS.gen;
      ctx.fillRect(x + g.x*scale - 2, y + g.y*scale - 2, 4, 4);
    }

    ctx.fillStyle = COLORS.gate;
    for (const gate of this.gates) ctx.fillRect(x + gate.x*scale - 3, y + gate.y*scale - 3, 6, 6);

    ctx.fillStyle = COLORS.red;
    ctx.beginPath();
    ctx.arc(x + this.killer.x*scale, y + this.killer.y*scale, 4, 0, Math.PI*2);
    ctx.fill();

    for (const s of this.survivors) {
      if (!s.alive) continue;
      ctx.fillStyle = s.isPlayer ? "#fff" : "#7dff8a";
      ctx.beginPath();
      ctx.arc(x + s.x*scale, y + s.y*scale, 3, 0, Math.PI*2);
      ctx.fill();
    }
  }

  drawFog(ctx) {
    const cam = this.camera;
    const themeFog = this.map.theme.fog;
    const p = this.player || { x: cam.x + cam.w/2, y: cam.y + cam.h/2 };
    const sx = p.x - cam.x;
    const sy = p.y - cam.y;

    const grd = ctx.createRadialGradient(sx, sy, 120, sx, sy, this.role === "killer" ? 660 : 520);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(0.55, "rgba(0,0,0,0.12)");
    grd.addColorStop(1, themeFog);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, cam.w, cam.h);

    ctx.fillStyle = "rgba(0,0,0,0.26)";
    ctx.fillRect(0, 0, cam.w, 16);
    ctx.fillRect(0, cam.h - 16, cam.w, 16);
  }
}
