import { SURVIVORS, DIFFICULTY, MAPS } from "./config.js";
import { formatTime } from "./utils.js";

export class UI {
  constructor(audio) {
    this.audio = audio;
    this.menu = document.getElementById("menu");
    this.help = document.getElementById("help");
    this.pause = document.getElementById("pause");
    this.end = document.getElementById("end");
    this.hud = document.getElementById("hud");
    this.survivorCards = document.getElementById("survivorCards");
    this.survivorSelect = document.getElementById("survivorSelect");
    this.killerInfo = document.getElementById("killerInfo");

    this.objective = document.getElementById("objective");
    this.messageLog = document.getElementById("messageLog");
    this.actionLabel = document.getElementById("actionLabel");
    this.actionFill = document.getElementById("actionFill");
    this.staminaFill = document.getElementById("staminaFill");
    this.powerFill = document.getElementById("powerFill");
    this.prompt = document.getElementById("prompt");
    this.survivorHud = document.getElementById("survivorHud");
    this.scoreboard = document.getElementById("scoreboard");

    this.endTitle = document.getElementById("endTitle");
    this.endText = document.getElementById("endText");
    this.endStats = document.getElementById("endStats");

    this.messages = [];
    this.selectedRole = "survivor";
    this.selectedChar = "alex";
    this.selectedMap = "scrapyard";
    this.selectedDifficulty = "normal";
    this.options = {
      sound: true,
      fog: true,
      minimap: true
    };

    this.buildSurvivorCards();
    this.bindStatic();
  }

  buildSurvivorCards() {
    this.survivorCards.innerHTML = "";
    for (const s of Object.values(SURVIVORS)) {
      const card = document.createElement("div");
      card.className = `survivor-card ${s.id === this.selectedChar ? "selected" : ""}`;
      card.dataset.id = s.id;
      card.innerHTML = `
        <div class="portrait" style="background:${s.color}">${s.icon}</div>
        <h3>${s.name}</h3>
        ${this.stat("Velocidad", s.speed, 126, 132)}
        ${this.stat("Reparación", s.repair, 0.9, 1.2)}
        ${this.stat("Curación", s.heal, 0.9, 1.15)}
        ${this.stat("Sigilo", s.stealth, 0.85, 1.4)}
        <div class="perk"><b>${s.perkName}:</b> ${s.perk}</div>
      `;
      card.addEventListener("click", () => {
        this.audio.ui();
        this.selectedChar = s.id;
        this.buildSurvivorCards();
      });
      this.survivorCards.appendChild(card);
    }
  }

  stat(label, v, min, max) {
    const pct = Math.round(((v - min) / (max - min)) * 100);
    return `<div class="stat"><span>${label}</span><i><b style="width:${Math.max(8, Math.min(100, pct))}%"></b></i></div>`;
  }

  bindStatic() {
    document.querySelectorAll(".role").forEach(btn => btn.addEventListener("click", () => {
      this.audio.ui();
      document.querySelectorAll(".role").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.selectedRole = btn.dataset.role;
      this.survivorSelect.classList.toggle("hidden", this.selectedRole !== "survivor");
      this.killerInfo.classList.toggle("hidden", this.selectedRole !== "killer");
    }));

    document.querySelectorAll(".map").forEach(btn => btn.addEventListener("click", () => {
      this.audio.ui();
      document.querySelectorAll(".map").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.selectedMap = btn.dataset.map;
    }));

    document.querySelectorAll(".difficulty").forEach(btn => btn.addEventListener("click", () => {
      this.audio.ui();
      document.querySelectorAll(".difficulty").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.selectedDifficulty = btn.dataset.difficulty;
    }));

    document.getElementById("soundToggle").addEventListener("change", e => this.options.sound = e.target.checked);
    document.getElementById("fogToggle").addEventListener("change", e => this.options.fog = e.target.checked);
    document.getElementById("minimapToggle").addEventListener("change", e => this.options.minimap = e.target.checked);

    document.getElementById("helpBtn").addEventListener("click", () => {
      this.audio.ui();
      this.help.classList.remove("hidden");
    });
    document.getElementById("closeHelp").addEventListener("click", () => {
      this.audio.ui();
      this.help.classList.add("hidden");
    });
  }

  showMenu(show = true) {
    this.menu.classList.toggle("hidden", !show);
  }

  showHud(show = true) {
    this.hud.classList.toggle("hidden", !show);
  }

  showPause(show = true) {
    this.pause.classList.toggle("hidden", !show);
  }

  showEnd(kind, stats) {
    this.end.classList.remove("hidden");
    this.showHud(false);

    const titles = {
      player_escape: "HAS ESCAPADO",
      player_dead: "HAS MUERTO",
      team_escape: "ESCAPADA EN EQUIPO",
      killer_win: "SACRIFICIO TOTAL",
      killer_loss: "SE TE HAN PIRADO",
      mixed: "PRUEBA TERMINADA",
      collapse: "COLAPSO FINAL"
    };

    this.endTitle.textContent = titles[kind] || "FIN DE LA PRUEBA";
    this.endText.textContent = stats.summary;

    this.endStats.innerHTML = `
      <div>Escapados: <b>${stats.escaped}</b></div>
      <div>Muertos: <b>${stats.dead}</b></div>
      <div>Generadores completados: <b>${stats.gens}</b></div>
      <div>Tiempo: <b>${formatTime(stats.time)}</b></div>
    `;
  }

  hideEnd() {
    this.end.classList.add("hidden");
  }

  addMessage(text, type = "normal") {
    this.messages.unshift({ text, type, life: 5 });
    this.messages = this.messages.slice(0, 5);
  }

  updateMessages(dt) {
    for (const m of this.messages) m.life -= dt;
    this.messages = this.messages.filter(m => m.life > 0);
    this.messageLog.innerHTML = this.messages.map(m => `<div class="msg">${m.text}</div>`).join("");
  }

  update(game, dt) {
    this.updateMessages(dt);
    if (!game || !game.player) return;

    const p = game.player;
    const openGate = game.gates.some(g => g.open);
    const alive = game.survivors.filter(s => s.alive).length;
    const escaped = game.survivors.filter(s => s.escaped).length;
    const dead = game.survivors.filter(s => s.dead).length;

    if (game.role === "survivor") {
      if (game.gensDone < game.gensNeeded) {
        this.objective.textContent = `${game.gensDone}/${game.gensNeeded} generadores reparados`;
      } else if (!openGate) {
        this.objective.textContent = "Abre una puerta de salida";
      } else {
        this.objective.textContent = game.endgameActive ? `Escapa | Colapso ${formatTime(game.endgameTimer)}` : "Escapa";
      }
    } else {
      this.objective.textContent = `Killer | Vivos ${alive} | Escapados ${escaped} | Muertos ${dead}`;
    }

    this.actionLabel.textContent = game.playerActionLabel || "Acción";
    this.actionFill.style.width = `${Math.round((game.playerActionProgress || 0) * 100)}%`;
    this.staminaFill.style.width = `${Math.round(p.stamina ?? 100)}%`;

    if (game.role === "killer") {
      const cd = game.killer.powerCd <= 0 ? 1 : 1 - Math.min(1, game.killer.powerCd / 10);
      this.powerFill.style.width = `${Math.round(cd * 100)}%`;
    } else {
      const charges = p.item?.charges || 0;
      const max = game.itemMaxCharges || 1;
      this.powerFill.style.width = `${Math.round(Math.min(1, charges / max) * 100)}%`;
    }

    this.prompt.textContent = game.promptText || "";
    this.prompt.classList.toggle("hidden", !game.promptText);

    this.drawSurvivorHud(game);
    this.drawScoreboard(game);
  }

  drawSurvivorHud(game) {
    this.survivorHud.innerHTML = game.survivors.map(s => {
      const state = s.dead ? "Muerto" :
        s.escaped ? "Escapó" :
        s.onHook ? `Gancho ${s.hookCount}` :
        s.carried ? "Cargado" :
        s.inLocker ? "Oculto" :
        s.state === "healthy" ? "Sano" :
        s.state === "injured" ? "Herido" : "Derribado";
      const color = s.dead ? "#555" : s.escaped ? "#aef" : s.char.color;
      return `
      <div class="surv-row">
        <div class="surv-icon" style="background:${color}">${s.char.icon}</div>
        <div>
          <div class="surv-name">${s.name}${s.isPlayer ? " (tú)" : ""}</div>
          <div class="surv-state">${state} · ${s.item.name}</div>
        </div>
        <div>${s.hookCount}/3</div>
      </div>`;
    }).join("");
  }

  drawScoreboard(game) {
    this.scoreboard.classList.toggle("hidden", !game.showScoreboard);
    if (!game.showScoreboard) return;

    const rows = game.survivors.map(s => `
      <div class="score-line">
        <div>${s.name}${s.isPlayer ? " (tú)" : ""}</div>
        <div>${s.state}</div>
        <div>${s.dead ? "Muerto" : s.escaped ? "Escapado" : "En prueba"}</div>
        <div>${Math.round(s.score.repair + s.score.altruism + s.score.boldness + s.score.survival)}</div>
      </div>
    `).join("");

    this.scoreboard.innerHTML = `
      <h2>Marcador</h2>
      <div class="score-line"><b>Jugador</b><b>Estado</b><b>Resultado</b><b>Puntos</b></div>
      ${rows}
    `;
  }
}
