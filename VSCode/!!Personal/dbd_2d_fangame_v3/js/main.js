import { Input } from "./input.js";
import { AudioManager } from "./audio.js";
import { UI } from "./ui.js";
import { Game } from "./game.js";

const canvas = document.getElementById("game");
const input = new Input();
const audio = new AudioManager();
const ui = new UI(audio);
const game = new Game(canvas, input, ui, audio);

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  game.camera.w = canvas.width;
  game.camera.h = canvas.height;
}
window.addEventListener("resize", resize);
resize();

document.getElementById("startBtn").addEventListener("click", () => {
  audio.unlock();
  audio.enabled = ui.options.sound;
  audio.ui();
  game.start({
    role: ui.selectedRole,
    character: ui.selectedChar,
    map: ui.selectedMap,
    difficulty: ui.selectedDifficulty,
    sound: ui.options.sound,
    fog: ui.options.fog,
    minimap: ui.options.minimap
  });
});

document.getElementById("resumeBtn").addEventListener("click", () => {
  audio.ui();
  game.paused = false;
  ui.showPause(false);
});

document.getElementById("quitBtn").addEventListener("click", () => {
  audio.ui();
  game.running = false;
  game.paused = false;
  ui.showPause(false);
  ui.showHud(false);
  ui.showMenu(true);
});

document.getElementById("backMenuBtn").addEventListener("click", () => {
  audio.ui();
  game.running = false;
  ui.hideEnd();
  ui.showHud(false);
  ui.showMenu(true);
});

let last = performance.now();

function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  game.update(dt);
  game.draw();
  ui.update(game, dt);
  input.endFrame();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
