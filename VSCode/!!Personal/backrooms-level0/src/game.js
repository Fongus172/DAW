import { Input } from "./input.js";
import { Ambience } from "./audio.js";
import { LevelWorld } from "./world.js";
import { Player } from "./player.js";
import { Renderer } from "./renderer.js";
import { LEVELS, getLevelById, getNextLevel } from "./levels.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.input = new Input();
    this.audio = new Ambience();
    this.renderer = new Renderer(canvas);

    this.world = null;
    this.player = null;

    this.state = "menu";
    this.time = 0;
    this.lastTime = performance.now();

    this.seed = "";
    this.level = LEVELS[0];
    this.shiftTimer = 0;
    this.shiftDelay = 18 + Math.random() * 18;
    this.shiftFlash = 0;
    this.nearExit = false;

    this.menu = document.getElementById("menu");
    this.menuTitle = document.getElementById("menuTitle");
    this.menuText = document.getElementById("menuText");
    this.seedInput = document.getElementById("seedInput");
    this.levelSelect = document.getElementById("levelSelect");
    this.startButton = document.getElementById("startButton");
    this.fullscreenButton = document.getElementById("fullscreenButton");

    this.hud = document.getElementById("hud");
    this.hudTitle = document.getElementById("hudTitle");
    this.hudSeed = document.getElementById("hudSeed");
    this.hudWarning = document.getElementById("hudWarning");
    this.prompt = document.getElementById("prompt");

    this.bindUI();
    this.populateLevelSelect();

    requestAnimationFrame((t) => this.loop(t));
  }

  populateLevelSelect() {
    this.levelSelect.innerHTML = "";

    for (const level of LEVELS) {
      const option = document.createElement("option");
      option.value = level.id;
      option.textContent = level.menuName;
      this.levelSelect.appendChild(option);
    }
  }

  bindUI() {
    this.startButton.addEventListener("click", () => {
      const selectedLevel = getLevelById(this.levelSelect.value);
      this.startNewRun(selectedLevel, true);
    });

    this.fullscreenButton.addEventListener("click", async () => {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen().catch(() => {});
      } else {
        await document.exitFullscreen().catch(() => {});
      }
    });
  }

  startNewRun(level, useInputSeed = false) {
    const typedSeed = this.seedInput.value.trim();

    if (useInputSeed) {
      this.seed = typedSeed.length > 0
        ? typedSeed
        : `backrooms-${Date.now().toString(36)}-${Math.floor(Math.random() * 99999)}`;
    }

    if (!this.seed) {
      this.seed = `backrooms-${Date.now().toString(36)}-${Math.floor(Math.random() * 99999)}`;
    }

    this.level = level;
    this.world = new LevelWorld(this.seed, level);
    this.player = new Player(this.world.spawn.x, this.world.spawn.y);

    this.state = "playing";
    this.time = 0;
    this.shiftTimer = 0;
    this.shiftDelay = 14 + Math.random() * 20;
    this.shiftFlash = 0;
    this.nearExit = false;

    this.menu.classList.add("hidden");
    this.hud.classList.remove("hidden");

    this.hudTitle.textContent = `LEVEL ${level.number} · ${level.name}`;
    this.hudSeed.textContent = `Seed: ${this.seed}`;
    this.hudWarning.textContent = "";

    this.audio.start();
  }

  advanceLevel() {
    const next = getNextLevel(this.level.id);

    this.menuTitle.textContent = `LEVEL ${next.number}`;
    this.menuText.textContent = this.level.nextText;
    this.startButton.textContent = `Entrar en ${next.name}`;
    this.levelSelect.value = next.id;

    this.level = next;
    this.startNewRun(next, false);
  }

  openPauseMenu() {
    this.state = "menu";

    this.menuTitle.textContent = "PAUSA";
    this.menuText.textContent =
      "El nivel sigue ahí fuera. Puedes generar otra semilla, cambiar de nivel o volver a meterte en el fregao.";
    this.startButton.textContent = "Generar nivel";

    this.menu.classList.remove("hidden");
    this.hud.classList.add("hidden");
    this.prompt.classList.add("hidden");
  }

  loop(now) {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    this.time = now;

    this.update(dt);
    this.renderer.render(this);

    this.input.finishFrame();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    if (this.state !== "playing") {
      this.audio.update(0.2, this.time);
      return;
    }

    if (this.input.consume("Escape")) {
      this.openPauseMenu();
      return;
    }

    this.player.update(this.input, this.world, dt);

    this.nearExit = Boolean(this.world.getExitNear(this.player.x, this.player.y, 48));

    if (this.nearExit) {
      this.prompt.textContent = this.level.prompt;
      this.prompt.classList.remove("hidden");

      if (this.input.consume("KeyE")) {
        this.advanceLevel();
        return;
      }
    } else {
      this.prompt.classList.add("hidden");
    }

    this.updatePeripheralShift(dt);

    const speed = Math.hypot(this.player.vx, this.player.vy);
    const intensity = Math.min(1, speed / 190) + (this.nearExit ? 0.55 : 0);
    this.audio.update(intensity, this.time);

    this.updateHudWarning();
  }

  updateHudWarning() {
    if (this.nearExit) {
      this.hudWarning.textContent = "Hay un umbral cerca. O una trampa. En los Backrooms normalmente son ambas.";
      return;
    }

    if (this.level.type === "darkness") {
      this.hudWarning.textContent = "No ves una mierda. Es literalmente el concepto.";
      return;
    }

    if (this.level.type === "ocean") {
      this.hudWarning.textContent = "El agua parece no tener fondo.";
      return;
    }

    if (this.level.type === "suburbs") {
      this.hudWarning.textContent = "Las casas parecen normales. Eso es lo peor.";
      return;
    }

    if (this.shiftFlash > 0.05) {
      this.hudWarning.textContent = "El mapa no estaba así hace un segundo.";
      return;
    }

    this.hudWarning.textContent = "";
  }

  updatePeripheralShift(dt) {
    this.shiftTimer += dt;

    if (this.shiftTimer >= this.shiftDelay) {
      this.shiftTimer = 0;
      this.shiftDelay = 16 + Math.random() * 24;

      const changed = this.world.shiftOffscreen(this.renderer.camera);

      if (changed) {
        this.shiftFlash = 0.18;
      }
    }

    if (this.shiftFlash > 0) {
      this.shiftFlash = Math.max(0, this.shiftFlash - dt * 0.8);
    }
  }
}