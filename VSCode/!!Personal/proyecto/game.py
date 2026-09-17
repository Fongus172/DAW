import pygame, random, math, json, os
from dataclasses import dataclass

pygame.init()

INTERNAL_W, INTERNAL_H = 1280, 720
FPS = 60
SAVE_FILE = "save.json"

BLACK = (5, 5, 12)
DARK = (14, 14, 24)
DARK2 = (28, 28, 44)
WHITE = (240, 240, 248)
GRAY = (120, 120, 135)
RED = (235, 60, 70)
GREEN = (80, 235, 140)
BLUE = (80, 170, 255)
CYAN = (70, 245, 245)
YELLOW = (255, 225, 90)
ORANGE = (255, 140, 55)
PURPLE = (185, 90, 255)
PINK = (255, 100, 180)

WINDOW_SIZES = [
    (960, 540),
    (1280, 720),
    (1600, 900),
    (1920, 1080),
]

DEFAULT_SETTINGS = {
    "window_size_index": 1,
    "fullscreen": False,
    "borderless": False,
    "integer_scale": False,
    "ui_scale": 1.0,

    "visual_quality": 2,
    "glow": True,
    "particles": True,
    "particle_amount": 1.0,
    "screen_shake": True,
    "scanlines": True,
    "vignette": True,
    "animated_background": True,
    "bullet_trails": True,
    "damage_numbers": True,

    "reduced_motion": False,
    "high_contrast": False,
    "colorblind_mode": False,
    "large_text": False,
    "aim_line": True,
    "enemy_health_bars": True,
    "flash_intensity": 1.0,

    "auto_fire": False,
    "hold_to_fire": True,
    "pause_on_focus_loss": True,
    "show_controls": True,
    "show_fps": False,
    "confirm_quit": True,
    "difficulty": 1,
}

def clamp(v, a, b):
    return max(a, min(b, v))

def distance(a, b, c, d):
    return math.hypot(a - c, b - d)

def deep_settings(data):
    result = DEFAULT_SETTINGS.copy()
    if isinstance(data, dict):
        result.update(data)
    return result

def load_save():
    if not os.path.exists(SAVE_FILE):
        return {
            "best": 0,
            "coins": 0,
            "runs": 0,
            "unlocked": ["pulse"],
            "logs": [],
            "seen_intro": False,
            "settings": DEFAULT_SETTINGS.copy(),
        }

    try:
        with open(SAVE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except:
        data = {}

    data.setdefault("best", 0)
    data.setdefault("coins", 0)
    data.setdefault("runs", 0)
    data.setdefault("unlocked", ["pulse"])
    data.setdefault("logs", [])
    data.setdefault("seen_intro", False)
    data["settings"] = deep_settings(data.get("settings", {}))
    return data

def write_save(data):
    with open(SAVE_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

save = load_save()
settings = save["settings"]

screen = None
clock = pygame.time.Clock()

def apply_display():
    global screen

    if settings["fullscreen"]:
        flags = pygame.FULLSCREEN
        screen = pygame.display.set_mode((0, 0), flags)
    else:
        w, h = WINDOW_SIZES[settings["window_size_index"]]
        flags = pygame.RESIZABLE
        if settings["borderless"]:
            flags |= pygame.NOFRAME
        screen = pygame.display.set_mode((w, h), flags)

    pygame.display.set_caption("???")

apply_display()

render = pygame.Surface((INTERNAL_W, INTERNAL_H))
glow_layer = pygame.Surface((INTERNAL_W, INTERNAL_H), pygame.SRCALPHA)
ui_layer = pygame.Surface((INTERNAL_W, INTERNAL_H), pygame.SRCALPHA)

def rebuild_fonts():
    base = 1.18 if settings["large_text"] else 1.0
    scale = settings["ui_scale"] * base

    return {
        "tiny": pygame.font.SysFont("consolas", int(12 * scale)),
        "small": pygame.font.SysFont("consolas", int(15 * scale)),
        "font": pygame.font.SysFont("consolas", int(20 * scale)),
        "mid": pygame.font.SysFont("consolas", int(34 * scale), bold=True),
        "big": pygame.font.SysFont("consolas", int(72 * scale), bold=True),
    }

fonts = rebuild_fonts()

def refresh_fonts():
    global fonts
    fonts = rebuild_fonts()

def get_mouse():
    sw, sh = screen.get_size()
    mx, my = pygame.mouse.get_pos()
    return mx * INTERNAL_W / sw, my * INTERNAL_H / sh

def screen_to_internal_pos(pos):
    sw, sh = screen.get_size()
    return pos[0] * INTERNAL_W / sw, pos[1] * INTERNAL_H / sh

def output_frame():
    sw, sh = screen.get_size()

    if settings["integer_scale"]:
        scale = max(1, min(sw // INTERNAL_W, sh // INTERNAL_H))
        out_w = INTERNAL_W * scale
        out_h = INTERNAL_H * scale
        frame = pygame.transform.scale(render, (out_w, out_h))
        screen.fill(BLACK)
        screen.blit(frame, ((sw - out_w) // 2, (sh - out_h) // 2))
    else:
        frame = pygame.transform.smoothscale(render, (sw, sh))
        screen.blit(frame, (0, 0))

    pygame.display.flip()

def text(surf, txt, font, color, x, y, center=False):
    img = font.render(str(txt), True, color)
    rect = img.get_rect()
    if center:
        rect.center = (x, y)
    else:
        rect.topleft = (x, y)
    surf.blit(img, rect)

def palette(color):
    if settings["high_contrast"]:
        if color == BLACK or color == DARK or color == DARK2:
            return (0, 0, 0)
        if color == GRAY:
            return (190, 190, 200)
        return color

    if settings["colorblind_mode"]:
        if color == RED:
            return (230, 120, 40)
        if color == GREEN:
            return (60, 190, 230)
        if color == BLUE:
            return (90, 150, 255)
        if color == YELLOW:
            return (255, 220, 90)
        if color == PURPLE:
            return (190, 120, 255)

    return color

def glow_circle(surf, x, y, radius, color, strength=90):
    if not settings["glow"] or settings["visual_quality"] == 0:
        return

    strength = int(strength * settings["flash_intensity"])

    loops = 2 if settings["visual_quality"] == 1 else 4
    color = palette(color)

    for i in range(loops, 0, -1):
        alpha = int(strength / i)
        r = radius * i
        pygame.draw.circle(surf, (*color, alpha), (int(x), int(y)), int(r))

def neon_rect(surf, rect, color, radius=12):
    color = palette(color)

    if settings["glow"]:
        pygame.draw.rect(surf, (*color, 35), rect.inflate(16, 16), border_radius=radius + 8)
        pygame.draw.rect(surf, (*color, 80), rect.inflate(8, 8), 2, border_radius=radius + 4)

    pygame.draw.rect(surf, (*color, 220), rect, 2, border_radius=radius)

def vignette():
    if not settings["vignette"]:
        return

    overlay = pygame.Surface((INTERNAL_W, INTERNAL_H), pygame.SRCALPHA)

    amount = 50 if settings["reduced_motion"] else 70

    for i in range(amount):
        alpha = int(i * 1.22)
        pygame.draw.rect(
            overlay,
            (0, 0, 0, alpha),
            (-i * 8, -i * 5, INTERNAL_W + i * 16, INTERNAL_H + i * 10),
            2,
        )

    render.blit(overlay, (0, 0))

def scanlines():
    if not settings["scanlines"]:
        return

    overlay = pygame.Surface((INTERNAL_W, INTERNAL_H), pygame.SRCALPHA)
    alpha = 18 if settings["reduced_motion"] else 28

    for y in range(0, INTERNAL_H, 4):
        pygame.draw.line(overlay, (0, 0, 0, alpha), (0, y), (INTERNAL_W, y))

    render.blit(overlay, (0, 0))

WEAPONS = {
    "pulse": ("PULSE", "estable, simple, fiable", 0, CYAN),
    "thorn": ("THORN", "persigue lo que respira", 25, GREEN),
    "ember": ("EMBER", "explota como si debiera dinero", 45, ORANGE),
    "split": ("SPLIT", "muchos disparos, pocas preguntas", 65, PURPLE),
}

LOGS = [
    "Registro 01: La sala cambia cuando nadie mira.",
    "Registro 02: Las monedas no son monedas. Ojalá lo fueran.",
    "Registro 03: Si aparece una luz roja, no la sigas.",
    "Registro 04: Los disparos despiertan cosas. El silencio también.",
    "Registro 05: El centro no existe. Da igual cuánto camines.",
]

INTRO = [
    "No recuerdas haber entrado aquí.",
    "La última luz parpadeó tres veces.",
    "Luego, silencio.",
    "Ahora todo responde a tus pasos.",
]

UPGRADES = [
    ("daño +1", "Tus disparos pegan más fuerte.", lambda p: setattr(p, "damage", p.damage + 1)),
    ("cadencia +", "Menos espera entre disparos.", lambda p: setattr(p, "fire_delay", max(4, p.fire_delay - 1))),
    ("velocidad +", "Piernas más decentes.", lambda p: setattr(p, "speed", p.speed + .32)),
    ("vida máxima +25", "Más margen para liarla.", lambda p: (setattr(p, "max_hp", p.max_hp + 25), setattr(p, "hp", min(p.max_hp, p.hp + 25)))),
    ("imán +50", "Los objetos vienen a ti.", lambda p: setattr(p, "magnet", p.magnet + 50)),
    ("perforación +1", "Las balas atraviesan enemigos.", lambda p: setattr(p, "pierce", p.pierce + 1)),
    ("proyectil +1", "Más plomo, más fiesta.", lambda p: setattr(p, "projectiles", p.projectiles + 1)),
    ("dash mejorado", "Esquivas más a menudo.", lambda p: setattr(p, "dash_max", max(30, p.dash_max - 14))),
    ("crítico +", "Más golpes brutales.", lambda p: setattr(p, "crit", p.crit + .06)),
    ("escudo", "Bloquea un golpe cada cierto tiempo.", lambda p: setattr(p, "shield_max", max(120, p.shield_max - 30))),
]

@dataclass
class Particle:
    x: float
    y: float
    vx: float
    vy: float
    life: int
    max_life: int
    color: tuple
    size: int

    def update(self):
        self.x += self.vx
        self.y += self.vy
        self.vx *= .965
        self.vy *= .965
        self.life -= 1

    def draw(self, cam):
        if self.life <= 0 or not settings["particles"]:
            return

        k = self.life / self.max_life
        color = palette(self.color)

        glow_circle(glow_layer, self.x - cam.x, self.y - cam.y, self.size * k, color, 55)
        pygame.draw.circle(render, color, (int(self.x - cam.x), int(self.y - cam.y)), max(1, int(self.size * k)))

@dataclass
class FloatText:
    x: float
    y: float
    txt: str
    color: tuple
    life: int = 55

    def update(self):
        self.y -= .7 if not settings["reduced_motion"] else .35
        self.life -= 1

    def draw(self, cam):
        if self.life > 0 and settings["damage_numbers"]:
            text(render, self.txt, fonts["small"], palette(self.color), self.x - cam.x, self.y - cam.y, True)

class Camera:
    def __init__(self):
        self.x = self.y = 0
        self.shake = 0

    def update(self, x, y):
        self.x += (x - INTERNAL_W / 2 - self.x) * .08
        self.y += (y - INTERNAL_H / 2 - self.y) * .08

        if self.shake > 0:
            if settings["screen_shake"] and not settings["reduced_motion"]:
                self.x += random.randint(-self.shake, self.shake)
                self.y += random.randint(-self.shake, self.shake)
            self.shake -= 1

class Player:
    def __init__(self, weapon="pulse"):
        self.x = self.y = 0
        self.r = 18
        self.weapon = weapon
        self.hp = self.max_hp = 125
        self.speed = 4.7
        self.damage = 1
        self.fire_delay = 11
        self.cooldown = 0
        self.projectiles = 1
        self.spread = .18
        self.pierce = 0
        self.magnet = 105
        self.dash = 0
        self.dash_max = 95
        self.invuln = 0
        self.crit = .04
        self.shield = 0
        self.shield_max = 260
        self.score = 0
        self.coins = 0
        self.level = 1
        self.xp = 0
        self.trail = []

    def needed_xp(self):
        return 90 + self.level * 45

    def gain_xp(self, n):
        self.xp += n
        up = False

        while self.xp >= self.needed_xp():
            self.xp -= self.needed_xp()
            self.level += 1
            up = True

        return up

    def update(self, keys):
        dx = keys[pygame.K_d] - keys[pygame.K_a]
        dy = keys[pygame.K_s] - keys[pygame.K_w]

        if dx or dy:
            l = math.hypot(dx, dy)
            dx /= l
            dy /= l

        self.x += dx * self.speed
        self.y += dy * self.speed

        if keys[pygame.K_SPACE] and self.dash <= 0 and (dx or dy):
            self.x += dx * 150
            self.y += dy * 150
            self.dash = self.dash_max
            self.invuln = 24

        if settings["bullet_trails"] and not settings["reduced_motion"]:
            self.trail.append((self.x, self.y))
            self.trail = self.trail[-18:]
        else:
            self.trail.clear()

        self.cooldown = max(0, self.cooldown - 1)
        self.dash = max(0, self.dash - 1)
        self.invuln = max(0, self.invuln - 1)
        self.shield = max(0, self.shield - 1)

    def draw(self, cam):
        if settings["bullet_trails"]:
            for i, pos in enumerate(self.trail):
                k = i / max(1, len(self.trail))
                pygame.draw.circle(
                    glow_layer,
                    (*palette(CYAN), int(50 * k)),
                    (int(pos[0] - cam.x), int(pos[1] - cam.y)),
                    int(self.r * k),
                )

        px, py = int(self.x - cam.x), int(self.y - cam.y)

        glow_circle(glow_layer, px, py, 24, CYAN, 70)

        if self.invuln % 6 < 3:
            pygame.draw.circle(render, palette(CYAN), (px, py), self.r)
            pygame.draw.circle(render, WHITE, (px, py), self.r, 2)

        if self.shield <= 0 and self.shield_max < 260:
            pygame.draw.circle(render, palette(BLUE), (px, py), self.r + 9, 2)
            glow_circle(glow_layer, px, py, self.r + 9, BLUE, 35)

        mx, my = get_mouse()
        a = math.atan2(my - py, mx - px)
        pygame.draw.circle(render, BLACK, (int(px + math.cos(a) * 6), int(py + math.sin(a) * 6)), 4)

class Bullet:
    def __init__(self, x, y, a, spd, dmg, pierce, color, r=5, homing=False, explosive=False, wave=False):
        self.x, self.y = x, y
        self.vx, self.vy = math.cos(a) * spd, math.sin(a) * spd
        self.damage = dmg
        self.pierce = pierce
        self.color = color
        self.r = r
        self.life = 145
        self.dead = False
        self.homing = homing
        self.explosive = explosive
        self.wave = wave
        self.tick = 0
        self.trail = []

    def update(self, enemies):
        self.tick += 1

        if settings["bullet_trails"]:
            self.trail.append((self.x, self.y))
            self.trail = self.trail[-8:]

        if self.homing and enemies:
            target = min(enemies, key=lambda e: distance(self.x, self.y, e.x, e.y))
            a = math.atan2(target.y - self.y, target.x - self.x)
            self.vx += math.cos(a) * .42
            self.vy += math.sin(a) * .42
            l = max(.1, math.hypot(self.vx, self.vy))
            self.vx = self.vx / l * 12
            self.vy = self.vy / l * 12

        if self.wave and not settings["reduced_motion"]:
            self.x += math.sin(self.tick / 6) * 2.8

        self.x += self.vx
        self.y += self.vy
        self.life -= 1

        if self.life <= 0:
            self.dead = True

    def draw(self, cam):
        color = palette(self.color)

        if settings["bullet_trails"]:
            for i, p in enumerate(self.trail):
                k = i / max(1, len(self.trail))
                pygame.draw.circle(
                    glow_layer,
                    (*color, int(90 * k)),
                    (int(p[0] - cam.x), int(p[1] - cam.y)),
                    int(self.r * k + 1),
                )

        glow_circle(glow_layer, self.x - cam.x, self.y - cam.y, self.r + 3, color, 95)
        pygame.draw.circle(render, color, (int(self.x - cam.x), int(self.y - cam.y)), self.r)
        pygame.draw.circle(render, WHITE, (int(self.x - cam.x), int(self.y - cam.y)), self.r, 1)

class EnemyBullet:
    def __init__(self, x, y, a, spd=5.2, r=7, color=ORANGE):
        self.x, self.y = x, y
        self.vx, self.vy = math.cos(a) * spd, math.sin(a) * spd
        self.r = r
        self.color = color
        self.life = 190
        self.dead = False

    def update(self):
        self.x += self.vx
        self.y += self.vy
        self.life -= 1

        if self.life <= 0:
            self.dead = True

    def draw(self, cam):
        color = palette(self.color)
        glow_circle(glow_layer, self.x - cam.x, self.y - cam.y, self.r + 2, color, 80)
        pygame.draw.circle(render, color, (int(self.x - cam.x), int(self.y - cam.y)), self.r)

class Enemy:
    DATA = {
        "shade": (3, 1.65, 17, RED, 18, 45),
        "skitter": (2, 3.05, 13, ORANGE, 20, 55),
        "brute": (11, .85, 29, PURPLE, 46, 125),
        "split": (5, 1.35, 21, PINK, 35, 90),
        "spitter": (4, 1.00, 18, YELLOW, 42, 115),
        "ghost": (3, 2.10, 16, BLUE, 32, 95),
    }

    def __init__(self, kind, wave, px, py, x=None, y=None):
        hp, spd, r, col, xp, score = self.DATA[kind]
        self.kind = kind

        if x is None:
            a = random.uniform(0, math.tau)
            d = random.randint(680, 980)
            self.x = px + math.cos(a) * d
            self.y = py + math.sin(a) * d
        else:
            self.x, self.y = x, y

        difficulty = settings["difficulty"]

        self.max_hp = hp + wave // 2 + difficulty
        self.hp = self.max_hp
        self.speed = spd + wave * .025 + difficulty * .06
        self.r = r
        self.color = col
        self.xp = xp
        self.score = score
        self.timer = random.randint(40, 130)
        self.phase = random.random() * 100

    def update(self, player, enemy_bullets):
        a = math.atan2(player.y - self.y, player.x - self.x)
        d = distance(self.x, self.y, player.x, player.y)

        if self.kind == "spitter" and d < 470:
            self.x -= math.cos(a) * self.speed * .25
            self.y -= math.sin(a) * self.speed * .25
            self.timer -= 1

            if self.timer <= 0:
                enemy_bullets.append(EnemyBullet(self.x, self.y, a))
                self.timer = random.randint(80, 140)
        else:
            wiggle = 0 if settings["reduced_motion"] else math.sin(pygame.time.get_ticks() / 220 + self.phase) * (.85 if self.kind == "ghost" else .35)
            self.x += math.cos(a + wiggle) * self.speed
            self.y += math.sin(a + wiggle) * self.speed

    def draw(self, cam):
        color = palette(self.color)
        x, y = int(self.x - cam.x), int(self.y - cam.y)

        glow_circle(glow_layer, x, y, self.r + 4, color, 45)
        pygame.draw.circle(render, color, (x, y), self.r)
        pygame.draw.circle(render, BLACK, (x, y), self.r, 2)

        if settings["enemy_health_bars"]:
            hpw = int((self.hp / self.max_hp) * self.r * 2)
            pygame.draw.rect(render, palette(RED), (x - self.r, y - self.r - 11, self.r * 2, 5))
            pygame.draw.rect(render, palette(GREEN), (x - self.r, y - self.r - 11, hpw, 5))

class Boss:
    def __init__(self, wave, px, py):
        self.x = px + random.choice([-760, 760])
        self.y = py + random.choice([-430, 430])
        self.r = 55
        self.max_hp = 160 + wave * 34 + settings["difficulty"] * 45
        self.hp = self.max_hp
        self.speed = 1.12 + wave * .025 + settings["difficulty"] * .08
        self.timer = 0

    def update(self, player, enemies, enemy_bullets):
        self.timer += 1
        a = math.atan2(player.y - self.y, player.x - self.x)
        self.x += math.cos(a) * self.speed
        self.y += math.sin(a) * self.speed

        if self.timer % max(55, 85 - settings["difficulty"] * 10) == 0:
            for i in range(18):
                enemy_bullets.append(EnemyBullet(self.x, self.y, math.tau * i / 18, 4.5, 6, RED))

        if self.timer % 165 == 0:
            for _ in range(5 + settings["difficulty"]):
                enemies.append(Enemy("skitter", 5, player.x, player.y, self.x + random.randint(-45, 45), self.y + random.randint(-45, 45)))

    def draw(self, cam):
        x, y = int(self.x - cam.x), int(self.y - cam.y)
        pulse = 0 if settings["reduced_motion"] else int(math.sin(pygame.time.get_ticks() / 80) * 7)

        glow_circle(glow_layer, x, y, self.r + 18, RED, 90)
        pygame.draw.circle(render, palette((185, 35, 45)), (x, y), self.r)
        pygame.draw.circle(render, palette(RED), (x, y), self.r + pulse, 2)
        pygame.draw.circle(render, BLACK, (x, y), self.r, 4)

class Pickup:
    COLORS = {"xp": BLUE, "coin": YELLOW, "heart": GREEN, "bomb": RED, "log": WHITE}

    def __init__(self, x, y, kind):
        self.x, self.y = x, y
        self.kind = kind
        self.r = 9 if kind != "log" else 13
        self.life = 950
        self.color = self.COLORS[kind]

    def update(self, player):
        d = distance(self.x, self.y, player.x, player.y)

        if d < player.magnet or self.kind == "log":
            a = math.atan2(player.y - self.y, player.x - self.x)
            f = clamp((player.magnet + 40 - d) / max(1, player.magnet), .1, 1)
            self.x += math.cos(a) * 9.5 * f
            self.y += math.sin(a) * 9.5 * f

        self.life -= 1

    def draw(self, cam):
        color = palette(self.color)
        x, y = int(self.x - cam.x), int(self.y - cam.y)
        pulse = 0 if settings["reduced_motion"] else int(math.sin(pygame.time.get_ticks() / 110) * 2)

        glow_circle(glow_layer, x, y, self.r + pulse + 4, color, 65)
        pygame.draw.circle(render, color, (x, y), self.r + pulse)
        pygame.draw.circle(render, WHITE, (x, y), self.r + pulse, 1)

        if self.kind == "log":
            text(render, "?", fonts["small"], BLACK, x, y - 8, True)

class Door:
    def __init__(self, x, y, kind):
        self.x, self.y = x, y
        self.w, self.h = 88, 120
        self.kind = kind

    def draw(self, cam):
        color = {"shop": YELLOW, "risk": RED, "heal": GREEN, "vault": PURPLE}[self.kind]
        color = palette(color)

        x, y = int(self.x - cam.x), int(self.y - cam.y)
        rect = pygame.Rect(x - self.w // 2, y - self.h // 2, self.w, self.h)

        glow_circle(glow_layer, x, y, 55, color, 55)
        pygame.draw.rect(render, DARK2, rect, border_radius=10)
        pygame.draw.rect(render, color, rect, 3, border_radius=10)
        text(render, "???", fonts["small"], color, x, y + 68, True)

class Button:
    def __init__(self, label, x, y, w, h, action=None):
        self.label = label
        self.rect = pygame.Rect(x, y, w, h)
        self.action = action

    def hovered(self):
        mx, my = get_mouse()
        return self.rect.collidepoint(mx, my)

    def draw(self, locked=False, sub=""):
        color = (42, 42, 62) if self.hovered() else DARK2

        pygame.draw.rect(ui_layer, (*color, 235), self.rect, border_radius=14)
        neon_rect(ui_layer, self.rect, GRAY if locked else CYAN, 14)

        text(ui_layer, self.label, fonts["font"], WHITE if not locked else GRAY, self.rect.centerx, self.rect.y + 18, True)

        if sub:
            text(ui_layer, sub, fonts["tiny"], YELLOW if not locked else GRAY, self.rect.centerx, self.rect.y + 48, True)

class ToggleButton:
    def __init__(self, key, label, x, y, w=380):
        self.key = key
        self.label = label
        self.rect = pygame.Rect(x, y, w, 42)

    def hovered(self):
        mx, my = get_mouse()
        return self.rect.collidepoint(mx, my)

    def click(self):
        settings[self.key] = not settings[self.key]
        save["settings"] = settings
        write_save(save)

        if self.key in ["fullscreen", "borderless"]:
            apply_display()

        if self.key in ["large_text", "ui_scale"]:
            refresh_fonts()

    def draw(self):
        enabled = settings[self.key]
        color = GREEN if enabled else GRAY

        pygame.draw.rect(ui_layer, (22, 22, 36, 230), self.rect, border_radius=10)
        pygame.draw.rect(ui_layer, color, self.rect, 2, border_radius=10)

        text(ui_layer, self.label, fonts["small"], WHITE, self.rect.x + 14, self.rect.y + 11)
        text(ui_layer, "ON" if enabled else "OFF", fonts["small"], color, self.rect.right - 46, self.rect.y + 11)

class CycleButton:
    def __init__(self, key, label, values, names, x, y, w=380, callback=None):
        self.key = key
        self.label = label
        self.values = values
        self.names = names
        self.callback = callback
        self.rect = pygame.Rect(x, y, w, 42)

    def hovered(self):
        mx, my = get_mouse()
        return self.rect.collidepoint(mx, my)

    def click(self):
        value = settings[self.key]
        i = self.values.index(value) if value in self.values else 0
        settings[self.key] = self.values[(i + 1) % len(self.values)]
        save["settings"] = settings
        write_save(save)

        if self.callback:
            self.callback()

    def draw(self):
        value = settings[self.key]
        i = self.values.index(value) if value in self.values else 0
        name = self.names[i]

        pygame.draw.rect(ui_layer, (22, 22, 36, 230), self.rect, border_radius=10)
        pygame.draw.rect(ui_layer, CYAN, self.rect, 2, border_radius=10)

        text(ui_layer, self.label, fonts["small"], WHITE, self.rect.x + 14, self.rect.y + 11)
        text(ui_layer, name, fonts["small"], YELLOW, self.rect.right - 14, self.rect.y + 11, False)

class Game:
    def __init__(self):
        self.state = "menu"
        self.menu_page = "main"
        self.selected_weapon = "pulse"
        self.player = Player()
        self.camera = Camera()

        self.bullets = []
        self.enemy_bullets = []
        self.enemies = []
        self.pickups = []
        self.particles = []
        self.texts = []
        self.doors = []

        self.wave = 1
        self.spawn_timer = 0
        self.boss = None
        self.message = ""
        self.message_timer = 0
        self.options = []
        self.story_index = 0
        self.confirming_quit = False

        self.make_buttons()
        self.make_settings_buttons()

    def make_buttons(self):
        self.buttons = {
            "play": Button("EMPEZAR", INTERNAL_W // 2 - 150, 270, 300, 58),
            "weapons": Button("ARSENAL", INTERNAL_W // 2 - 150, 340, 300, 58),
            "settings": Button("AJUSTES", INTERNAL_W // 2 - 150, 410, 300, 58),
            "logs": Button("REGISTROS", INTERNAL_W // 2 - 150, 480, 300, 58),
            "quit": Button("SALIR", INTERNAL_W // 2 - 150, 550, 300, 58),
            "back": Button("VOLVER", 40, INTERNAL_H - 90, 220, 54),
        }

    def make_settings_buttons(self):
        left_x = 105
        right_x = 705
        y0 = 150
        step = 48

        self.settings_tabs = ["pantalla", "accesibilidad", "calidad", "qol"]
        self.settings_tab = "pantalla"

        self.setting_buttons = {
            "pantalla": [
                CycleButton("window_size_index", "Tamaño ventana", [0, 1, 2, 3], ["960x540", "1280x720", "1600x900", "1920x1080"], left_x, y0, callback=apply_display),
                ToggleButton("fullscreen", "Pantalla completa", left_x, y0 + step),
                ToggleButton("borderless", "Sin bordes", left_x, y0 + step * 2),
                ToggleButton("integer_scale", "Escalado entero", left_x, y0 + step * 3),
                CycleButton("ui_scale", "Escala interfaz", [0.85, 1.0, 1.15, 1.3], ["85%", "100%", "115%", "130%"], left_x, y0 + step * 4, callback=refresh_fonts),
                ToggleButton("show_fps", "Mostrar FPS", left_x, y0 + step * 5),
            ],
            "accesibilidad": [
                ToggleButton("large_text", "Texto grande", left_x, y0),
                ToggleButton("high_contrast", "Alto contraste", left_x, y0 + step),
                ToggleButton("colorblind_mode", "Paleta daltónica", left_x, y0 + step * 2),
                ToggleButton("reduced_motion", "Reducir movimiento", left_x, y0 + step * 3),
                ToggleButton("aim_line", "Línea de apuntado", left_x, y0 + step * 4),
                ToggleButton("enemy_health_bars", "Barras de vida enemigas", left_x, y0 + step * 5),
                CycleButton("flash_intensity", "Intensidad destellos", [0.35, 0.65, 1.0], ["baja", "media", "normal"], right_x, y0),
            ],
            "calidad": [
                CycleButton("visual_quality", "Calidad visual", [0, 1, 2], ["baja", "media", "alta"], left_x, y0),
                ToggleButton("glow", "Brillos / bloom falso", left_x, y0 + step),
                ToggleButton("particles", "Partículas", left_x, y0 + step * 2),
                CycleButton("particle_amount", "Cantidad partículas", [0.35, 0.7, 1.0], ["baja", "media", "alta"], left_x, y0 + step * 3),
                ToggleButton("screen_shake", "Vibración de cámara", left_x, y0 + step * 4),
                ToggleButton("scanlines", "Scanlines", left_x, y0 + step * 5),
                ToggleButton("vignette", "Viñeta oscura", right_x, y0),
                ToggleButton("animated_background", "Fondo animado", right_x, y0 + step),
                ToggleButton("bullet_trails", "Estelas", right_x, y0 + step * 2),
                ToggleButton("damage_numbers", "Números de daño", right_x, y0 + step * 3),
            ],
            "qol": [
                ToggleButton("auto_fire", "Disparo automático", left_x, y0),
                ToggleButton("hold_to_fire", "Mantener click para disparar", left_x, y0 + step),
                ToggleButton("pause_on_focus_loss", "Pausar al perder foco", left_x, y0 + step * 2),
                ToggleButton("show_controls", "Mostrar controles", left_x, y0 + step * 3),
                ToggleButton("confirm_quit", "Confirmar al salir", left_x, y0 + step * 4),
                CycleButton("difficulty", "Dificultad", [0, 1, 2], ["relajada", "normal", "dolor"], left_x, y0 + step * 5),
            ],
        }

    def reset_run(self):
        weapon = self.selected_weapon

        self.player = Player(weapon)
        self.camera = Camera()
        self.bullets.clear()
        self.enemy_bullets.clear()
        self.enemies.clear()
        self.pickups.clear()
        self.particles.clear()
        self.texts.clear()
        self.doors.clear()

        self.wave = 1
        self.spawn_timer = 0
        self.boss = None
        self.message = "..."
        self.message_timer = 90
        self.options = []
        self.state = "playing"

    def boom(self, x, y, color, n=24, power=7):
        if not settings["particles"]:
            return

        n = int(n * settings["particle_amount"])
        if settings["reduced_motion"]:
            n = max(3, n // 3)
            power *= .45

        for _ in range(n):
            a = random.uniform(0, math.tau)
            s = random.uniform(.4, power)
            self.particles.append(
                Particle(
                    x,
                    y,
                    math.cos(a) * s,
                    math.sin(a) * s,
                    random.randint(22, 58),
                    58,
                    color,
                    random.randint(2, 7),
                )
            )

    def spawn_enemy(self):
        pool = ["shade"]

        if self.wave >= 2:
            pool += ["skitter"]
        if self.wave >= 3:
            pool += ["ghost"]
        if self.wave >= 4:
            pool += ["brute"]
        if self.wave >= 5:
            pool += ["split"]
        if self.wave >= 7:
            pool += ["spitter"]

        self.enemies.append(Enemy(random.choice(pool), self.wave, self.player.x, self.player.y))

    def shoot(self):
        p = self.player

        if p.cooldown > 0:
            return

        mx, my = get_mouse()
        a = math.atan2(my + self.camera.y - p.y, mx + self.camera.x - p.x)
        name, desc, cost, color = WEAPONS[p.weapon]

        homing = p.weapon == "thorn"
        explosive = p.weapon == "ember"
        wave = p.weapon == "split"

        projectiles = p.projectiles + (2 if wave else 0)
        spread = p.spread + (.15 if wave else 0)
        speed = 10.5 if explosive else 11.5 if homing else 13
        radius = 7 if explosive else 5

        for i in range(projectiles):
            off = (i - (projectiles - 1) / 2) * spread
            dmg = p.damage * (2 if random.random() < p.crit else 1)
            self.bullets.append(Bullet(p.x, p.y, a + off, speed, dmg, p.pierce, color, radius, homing, explosive, wave))

        p.cooldown = p.fire_delay

    def damage_player(self, amount):
        p = self.player

        if p.invuln > 0:
            return

        if p.shield <= 0 and p.shield_max < 260:
            p.shield = p.shield_max
            p.invuln = 18
            self.boom(p.x, p.y, BLUE, 45, 8)
            return

        p.hp -= amount
        p.invuln = 34
        self.camera.shake = 9
        self.boom(p.x, p.y, RED, 35, 8)

    def drop(self, x, y, kind, amount):
        for _ in range(amount):
            self.pickups.append(Pickup(x + random.randint(-28, 28), y + random.randint(-28, 28), kind))

    def kill_enemy(self, e, drop=True):
        self.player.score += e.score
        self.boom(e.x, e.y, e.color, 28, 8)

        if drop:
            self.drop(e.x, e.y, "xp", 1)

            if random.random() < .25:
                self.drop(e.x, e.y, "coin", 1)

            if random.random() < .035:
                self.drop(e.x, e.y, "heart", 1)

            if random.random() < .018:
                self.drop(e.x, e.y, "bomb", 1)

        if e.kind == "split":
            for _ in range(2):
                self.enemies.append(
                    Enemy(
                        "skitter",
                        self.wave,
                        self.player.x,
                        self.player.y,
                        e.x + random.randint(-30, 30),
                        e.y + random.randint(-30, 30),
                    )
                )

        if e in self.enemies:
            self.enemies.remove(e)

    def generate_doors(self):
        self.doors.clear()

        if self.wave % 3 == 0:
            types = random.sample(["shop", "risk", "heal", "vault"], 3)
            base = random.uniform(0, math.tau)

            for i, kind in enumerate(types):
                a = base + i * math.tau / 3
                self.doors.append(Door(self.player.x + math.cos(a) * 430, self.player.y + math.sin(a) * 430, kind))

            self.message = "han aparecido puertas"
            self.message_timer = 120

    def level_choices(self):
        self.options = random.sample(UPGRADES, 3)
        self.state = "upgrade"

    def update_playing(self):
        keys = pygame.key.get_pressed()
        self.player.update(keys)
        self.camera.update(self.player.x, self.player.y)

        mouse_down = pygame.mouse.get_pressed()[0]

        if settings["auto_fire"] or (settings["hold_to_fire"] and mouse_down):
            self.shoot()

        self.spawn_timer -= 1

        if self.spawn_timer <= 0:
            amount = 1 + self.wave // 3 + settings["difficulty"] // 2

            for _ in range(amount):
                self.spawn_enemy()

            self.spawn_timer = max(14, 68 - self.wave * 3 - settings["difficulty"] * 3)

        if self.wave % 5 == 0 and self.boss is None:
            self.boss = Boss(self.wave, self.player.x, self.player.y)
            self.message = "la sala se enfada"
            self.message_timer = 130

        if self.boss:
            self.boss.update(self.player, self.enemies, self.enemy_bullets)

        for e in self.enemies:
            e.update(self.player, self.enemy_bullets)

        targets = self.enemies[:] + ([self.boss] if self.boss else [])

        for b in self.bullets:
            b.update(targets)

        for b in self.enemy_bullets:
            b.update()

        for p in self.pickups:
            p.update(self.player)

        for e in self.enemies[:]:
            if distance(e.x, e.y, self.player.x, self.player.y) < e.r + self.player.r:
                self.damage_player(22 if e.kind == "brute" else 12)

                if e in self.enemies:
                    self.enemies.remove(e)

        if self.boss and distance(self.boss.x, self.boss.y, self.player.x, self.player.y) < self.boss.r + self.player.r:
            self.damage_player(30)

        for eb in self.enemy_bullets[:]:
            if distance(eb.x, eb.y, self.player.x, self.player.y) < eb.r + self.player.r:
                self.damage_player(10)
                eb.dead = True

        for bullet in self.bullets[:]:
            for target in targets:
                if target and distance(bullet.x, bullet.y, target.x, target.y) < bullet.r + target.r:
                    target.hp -= bullet.damage

                    if settings["damage_numbers"]:
                        self.texts.append(FloatText(target.x, target.y - target.r, str(bullet.damage), WHITE))

                    self.boom(bullet.x, bullet.y, bullet.color, 9, 4)

                    if bullet.explosive:
                        self.camera.shake = 6
                        self.boom(bullet.x, bullet.y, ORANGE, 40, 9)

                        for e in self.enemies:
                            if distance(bullet.x, bullet.y, e.x, e.y) < 95:
                                e.hp -= max(1, bullet.damage // 2)

                    bullet.pierce -= 1

                    if bullet.pierce < 0:
                        bullet.dead = True

                    if isinstance(target, Enemy) and target.hp <= 0:
                        self.kill_enemy(target)

                    if isinstance(target, Boss) and target.hp <= 0:
                        self.player.score += 1800
                        self.drop(target.x, target.y, "coin", 14)
                        self.drop(target.x, target.y, "xp", 18)
                        self.boom(target.x, target.y, RED, 120, 15)
                        self.boss = None
                        self.wave += 1
                        self.generate_doors()

                    break

        for p in self.pickups[:]:
            if distance(p.x, p.y, self.player.x, self.player.y) < p.r + self.player.r:
                if p.kind == "xp":
                    if self.player.gain_xp(25):
                        self.level_choices()

                elif p.kind == "coin":
                    self.player.coins += 1

                elif p.kind == "heart":
                    self.player.hp = min(self.player.max_hp, self.player.hp + 32)

                elif p.kind == "bomb":
                    self.camera.shake = 20
                    self.boom(self.player.x, self.player.y, RED, 130, 15)

                    for e in self.enemies[:]:
                        self.kill_enemy(e, False)

                    if self.boss:
                        self.boss.hp -= 90

                self.pickups.remove(p)

        for d in self.doors[:]:
            if distance(d.x, d.y, self.player.x, self.player.y) < 72:
                self.doors.clear()

                if d.kind == "heal":
                    self.player.hp = self.player.max_hp
                    self.boom(self.player.x, self.player.y, GREEN, 70, 9)

                elif d.kind == "risk":
                    self.player.score += 500

                    for _ in range(13):
                        self.spawn_enemy()

                elif d.kind == "vault":
                    self.player.coins += random.randint(8, 18)
                    self.drop(self.player.x, self.player.y, "xp", 8)

                elif d.kind == "shop":
                    self.options = random.sample(UPGRADES, 3)
                    self.state = "shop"

        if not self.boss and self.player.score >= self.wave * 620:
            self.wave += 1
            self.message = f"capa {self.wave}"
            self.message_timer = 100

            if random.random() < .55:
                self.drop(self.player.x, self.player.y, "heart", 1)

            if random.random() < .18:
                self.drop(self.player.x, self.player.y, "bomb", 1)

            self.generate_doors()

        self.bullets = [b for b in self.bullets if not b.dead]
        self.enemy_bullets = [b for b in self.enemy_bullets if not b.dead]
        self.pickups = [p for p in self.pickups if p.life > 0]

        for p in self.particles[:]:
            p.update()

            if p.life <= 0:
                self.particles.remove(p)

        for t in self.texts[:]:
            t.update()

            if t.life <= 0:
                self.texts.remove(t)

        if self.player.hp <= 0:
            self.state = "dead"
            save["runs"] += 1
            save["best"] = max(save["best"], self.player.score)
            save["coins"] += self.player.coins
            write_save(save)

    def draw_background(self):
        bg = (0, 0, 0) if settings["high_contrast"] else (4, 4, 13)
        render.fill(bg)

        tile = 90
        sx = int(self.camera.x // tile) * tile - tile
        sy = int(self.camera.y // tile) * tile - tile

        line_a = (45, 45, 62) if settings["high_contrast"] else (22, 22, 38)
        line_b = (35, 35, 52) if settings["high_contrast"] else (17, 17, 31)

        for x in range(sx, int(self.camera.x + INTERNAL_W) + tile, tile):
            c = line_a if x // tile % 2 == 0 else line_b
            pygame.draw.line(render, c, (x - self.camera.x, 0), (x - self.camera.x, INTERNAL_H))

        for y in range(sy, int(self.camera.y + INTERNAL_H) + tile, tile):
            c = line_a if y // tile % 2 == 0 else line_b
            pygame.draw.line(render, c, (0, y - self.camera.y), (INTERNAL_W, y - self.camera.y))

        if settings["animated_background"] and not settings["reduced_motion"]:
            t = pygame.time.get_ticks() / 1000
        else:
            t = 0

        if settings["visual_quality"] > 0:
            star_count = 90 if settings["visual_quality"] == 2 else 45

            for i in range(star_count):
                x = ((i * 173) % 2600) - 1300 - self.camera.x * .12 + INTERNAL_W // 2
                y = ((i * 97) % 1600) - 800 - self.camera.y * .12 + INTERNAL_H // 2
                r = 1 + int((math.sin(t * 2 + i) + 1) * .8)
                pygame.draw.circle(render, (35, 35, 58), (int(x), int(y)), r)

    def draw_world(self):
        glow_layer.fill((0, 0, 0, 0))
        self.draw_background()

        for d in self.doors:
            d.draw(self.camera)

        for p in self.pickups:
            p.draw(self.camera)

        for b in self.bullets:
            b.draw(self.camera)

        for b in self.enemy_bullets:
            b.draw(self.camera)

        for e in self.enemies:
            e.draw(self.camera)

        if self.boss:
            self.boss.draw(self.camera)

        for p in self.particles:
            p.draw(self.camera)

        for t in self.texts:
            t.draw(self.camera)

        self.player.draw(self.camera)

        render.blit(glow_layer, (0, 0), special_flags=pygame.BLEND_RGBA_ADD)

        if settings["aim_line"]:
            mx, my = get_mouse()
            pygame.draw.line(
                render,
                (170, 170, 200) if settings["high_contrast"] else (100, 100, 125),
                (self.player.x - self.camera.x, self.player.y - self.camera.y),
                (mx, my),
                1,
            )

    def draw_hud(self):
        ui_layer.fill((0, 0, 0, 0))
        p = self.player

        panel = pygame.Rect(18, 16, 305, 178)
        pygame.draw.rect(ui_layer, (10, 10, 20, 185), panel, border_radius=16)
        pygame.draw.rect(ui_layer, (90, 240, 240, 90), panel, 2, border_radius=16)

        pygame.draw.rect(ui_layer, palette(RED), (38, 34, 250, 22), border_radius=8)
        pygame.draw.rect(ui_layer, palette(GREEN), (38, 34, int(250 * clamp(p.hp / p.max_hp, 0, 1)), 22), border_radius=8)
        pygame.draw.rect(ui_layer, WHITE, (38, 34, 250, 22), 2, border_radius=8)

        pygame.draw.rect(ui_layer, DARK2, (38, 66, 250, 14), border_radius=7)
        pygame.draw.rect(ui_layer, palette(BLUE), (38, 66, int(250 * clamp(p.xp / p.needed_xp(), 0, 1)), 14), border_radius=7)

        text(ui_layer, f"vida {int(p.hp)}/{p.max_hp}", fonts["small"], WHITE, 48, 36)
        text(ui_layer, f"lvl {p.level}", fonts["small"], WHITE, 294, 63)
        text(ui_layer, f"puntos {p.score}", fonts["font"], WHITE, 38, 94)
        text(ui_layer, f"capa {self.wave}", fonts["font"], WHITE, 38, 120)
        text(ui_layer, f"monedas {p.coins}", fonts["font"], YELLOW, 38, 146)
        text(ui_layer, WEAPONS[p.weapon][0], fonts["font"], palette(WEAPONS[p.weapon][3]), 188, 146)

        if self.boss:
            bw = 700
            pygame.draw.rect(ui_layer, palette(RED), (INTERNAL_W // 2 - bw // 2, INTERNAL_H - 58, bw, 28), border_radius=10)
            pygame.draw.rect(ui_layer, palette(PURPLE), (INTERNAL_W // 2 - bw // 2, INTERNAL_H - 58, int(bw * self.boss.hp / self.boss.max_hp), 28), border_radius=10)
            pygame.draw.rect(ui_layer, WHITE, (INTERNAL_W // 2 - bw // 2, INTERNAL_H - 58, bw, 28), 2, border_radius=10)

        if self.message_timer > 0:
            self.message_timer -= 1
            text(ui_layer, self.message, fonts["mid"], YELLOW, INTERNAL_W // 2, 85, True)

        if settings["show_controls"]:
            text(ui_layer, "WASD | Click | ESPACIO | P | ESC", fonts["small"], GRAY, INTERNAL_W // 2, INTERNAL_H - 22, True)

        if settings["show_fps"]:
            text(ui_layer, f"{int(clock.get_fps())} FPS", fonts["small"], GREEN, INTERNAL_W - 88, 20, True)

        render.blit(ui_layer, (0, 0))

    def draw_playing(self):
        self.draw_world()
        self.draw_hud()
        vignette()
        scanlines()

    def draw_menu(self):
        render.fill(BLACK)
        glow_layer.fill((0, 0, 0, 0))
        ui_layer.fill((0, 0, 0, 0))

        if settings["animated_background"] and not settings["reduced_motion"]:
            t = pygame.time.get_ticks() / 1000
        else:
            t = 0

        for i in range(140):
            x = (i * 93 + t * 22) % INTERNAL_W
            y = (i * 47 + math.sin(t + i) * 20) % INTERNAL_H
            pygame.draw.circle(render, (30, 30, 55), (int(x), int(y)), 1)

        glow_circle(glow_layer, INTERNAL_W // 2, 142, 120, CYAN, 45)
        render.blit(glow_layer, (0, 0), special_flags=pygame.BLEND_RGBA_ADD)

        text(render, "???", fonts["big"], CYAN, INTERNAL_W // 2, 125, True)
        text(render, "no mires demasiado al menú", fonts["small"], GRAY, INTERNAL_W // 2, 195, True)

        if self.menu_page == "main":
            for k in ["play", "weapons", "settings", "logs", "quit"]:
                self.buttons[k].draw()

            text(ui_layer, f"récord: {save['best']}", fonts["font"], WHITE, INTERNAL_W // 2, 630, True)
            text(ui_layer, f"monedas: {save['coins']}", fonts["font"], YELLOW, INTERNAL_W // 2, 660, True)

            if self.confirming_quit:
                text(ui_layer, "pulsa SALIR otra vez para cerrar", fonts["small"], RED, INTERNAL_W // 2, 695, True)

        elif self.menu_page == "weapons":
            text(ui_layer, "arsenal", fonts["mid"], WHITE, INTERNAL_W // 2, 230, True)

            for i, (key, w) in enumerate(WEAPONS.items()):
                name, desc, cost, color = w
                unlocked = key in save["unlocked"] or save["coins"] >= cost
                rect = pygame.Rect(INTERNAL_W // 2 - 390 + (i % 2) * 400, 285 + (i // 2) * 115, 360, 88)

                pygame.draw.rect(ui_layer, (28, 28, 44, 230), rect, border_radius=14)
                neon_rect(ui_layer, rect, palette(color) if unlocked else GRAY, 14)

                title = f"> {name} <" if self.selected_weapon == key else name
                text(ui_layer, title, fonts["font"], palette(color) if unlocked else GRAY, rect.centerx, rect.y + 22, True)
                text(ui_layer, desc, fonts["small"], GRAY, rect.centerx, rect.y + 51, True)

                if not unlocked:
                    text(ui_layer, f"{cost} monedas", fonts["tiny"], YELLOW, rect.centerx, rect.y + 70, True)

            self.buttons["back"].draw()

        elif self.menu_page == "logs":
            text(ui_layer, "registros", fonts["mid"], WHITE, INTERNAL_W // 2, 220, True)

            if not save["logs"]:
                text(ui_layer, "no has encontrado nada todavía", fonts["font"], GRAY, INTERNAL_W // 2, 340, True)

            self.buttons["back"].draw()

        elif self.menu_page == "settings":
            self.draw_settings()

        render.blit(ui_layer, (0, 0))
        vignette()
        scanlines()

    def draw_settings(self):
        text(ui_layer, "ajustes", fonts["mid"], WHITE, INTERNAL_W // 2, 72, True)

        tab_w = 220
        start = INTERNAL_W // 2 - (tab_w * len(self.settings_tabs)) // 2

        for i, tab in enumerate(self.settings_tabs):
            rect = pygame.Rect(start + i * tab_w, 105, tab_w - 12, 42)
            active = tab == self.settings_tab
            pygame.draw.rect(ui_layer, (38, 38, 58) if active else (22, 22, 34), rect, border_radius=10)
            pygame.draw.rect(ui_layer, CYAN if active else GRAY, rect, 2, border_radius=10)
            text(ui_layer, tab.upper(), fonts["small"], WHITE if active else GRAY, rect.centerx, rect.y + 12, True)

        for button in self.setting_buttons[self.settings_tab]:
            button.draw()

        info = {
            "pantalla": "La ventana es redimensionable arrastrando los bordes. Estos ajustes se guardan solos.",
            "accesibilidad": "Opciones para visibilidad, movimiento, colores, texto y lectura rápida.",
            "calidad": "Baja efectos si va petado o si el PC del curro está pidiendo eutanasia.",
            "qol": "Ajustes de comodidad: disparo, pausa, dificultad e interfaz.",
        }[self.settings_tab]

        text(ui_layer, info, fonts["small"], GRAY, INTERNAL_W // 2, INTERNAL_H - 130, True)
        self.buttons["back"].draw()

    def draw_upgrade(self):
        self.draw_playing()

        overlay = pygame.Surface((INTERNAL_W, INTERNAL_H), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 215))
        render.blit(overlay, (0, 0))

        text(render, "elige", fonts["mid"], WHITE, INTERNAL_W // 2, 120, True)

        for i, op in enumerate(self.options):
            rect = pygame.Rect(INTERNAL_W // 2 - 275, 210 + i * 115, 550, 86)
            pygame.draw.rect(render, (20, 20, 35), rect, border_radius=14)
            pygame.draw.rect(render, CYAN, rect, 2, border_radius=14)
            text(render, f"{i + 1}. {op[0]}", fonts["font"], YELLOW, INTERNAL_W // 2, rect.y + 24, True)
            text(render, op[1], fonts["small"], GRAY, INTERNAL_W // 2, rect.y + 55, True)

    def draw_shop(self):
        self.draw_upgrade()
        text(render, "1/2/3 comprar | ESC salir", fonts["small"], GRAY, INTERNAL_W // 2, INTERNAL_H - 90, True)

    def draw_dead(self):
        self.draw_world()

        overlay = pygame.Surface((INTERNAL_W, INTERNAL_H), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 225))
        render.blit(overlay, (0, 0))

        text(render, "FIN", fonts["big"], RED, INTERNAL_W // 2, 190, True)
        text(render, f"puntuación: {self.player.score}", fonts["mid"], WHITE, INTERNAL_W // 2, 300, True)
        text(render, f"monedas encontradas: {self.player.coins}", fonts["font"], YELLOW, INTERNAL_W // 2, 350, True)
        text(render, "R reiniciar | ESC menú", fonts["font"], GRAY, INTERNAL_W // 2, 455, True)

    def draw_intro(self):
        render.fill(BLACK)

        if self.story_index < len(INTRO):
            text(render, INTRO[self.story_index], fonts["mid"], WHITE, INTERNAL_W // 2, INTERNAL_H // 2, True)
            text(render, "ENTER", fonts["small"], GRAY, INTERNAL_W // 2, INTERNAL_H - 110, True)
        else:
            save["seen_intro"] = True
            write_save(save)
            self.reset_run()

    def click_menu(self):
        mx, my = get_mouse()

        if self.menu_page == "main":
            if self.buttons["play"].hovered():
                if save["seen_intro"]:
                    self.reset_run()
                else:
                    self.state = "intro"

            elif self.buttons["weapons"].hovered():
                self.menu_page = "weapons"
                self.confirming_quit = False

            elif self.buttons["settings"].hovered():
                self.menu_page = "settings"
                self.confirming_quit = False

            elif self.buttons["logs"].hovered():
                self.menu_page = "logs"
                self.confirming_quit = False

            elif self.buttons["quit"].hovered():
                if settings["confirm_quit"] and not self.confirming_quit:
                    self.confirming_quit = True
                    return True
                return False

            else:
                self.confirming_quit = False

        elif self.menu_page == "weapons":
            for i, (key, w) in enumerate(WEAPONS.items()):
                rect = pygame.Rect(INTERNAL_W // 2 - 390 + (i % 2) * 400, 285 + (i // 2) * 115, 360, 88)

                if rect.collidepoint(mx, my):
                    name, desc, cost, color = w

                    if key in save["unlocked"]:
                        self.selected_weapon = key
                    elif save["coins"] >= cost:
                        save["coins"] -= cost
                        save["unlocked"].append(key)
                        self.selected_weapon = key
                        write_save(save)

            if self.buttons["back"].hovered():
                self.menu_page = "main"

        elif self.menu_page == "logs":
            if self.buttons["back"].hovered():
                self.menu_page = "main"

        elif self.menu_page == "settings":
            tab_w = 220
            start = INTERNAL_W // 2 - (tab_w * len(self.settings_tabs)) // 2

            for i, tab in enumerate(self.settings_tabs):
                rect = pygame.Rect(start + i * tab_w, 105, tab_w - 12, 42)

                if rect.collidepoint(mx, my):
                    self.settings_tab = tab
                    return True

            for button in self.setting_buttons[self.settings_tab]:
                if button.hovered():
                    button.click()
                    return True

            if self.buttons["back"].hovered():
                self.menu_page = "main"

        return True

game = Game()
running = True

while running:
    clock.tick(FPS)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.VIDEORESIZE and not settings["fullscreen"]:
            screen = pygame.display.set_mode((event.w, event.h), pygame.RESIZABLE | (pygame.NOFRAME if settings["borderless"] else 0))

        if event.type == pygame.WINDOWFOCUSLOST:
            if settings["pause_on_focus_loss"] and game.state == "playing":
                game.state = "pause"

        if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if game.state == "menu":
                running = game.click_menu()
            elif game.state == "playing" and not settings["hold_to_fire"] and not settings["auto_fire"]:
                game.shoot()

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_F11:
                settings["fullscreen"] = not settings["fullscreen"]
                save["settings"] = settings
                write_save(save)
                apply_display()

            if event.key == pygame.K_ESCAPE:
                if game.state == "playing":
                    game.state = "pause"
                elif game.state == "pause":
                    game.state = "playing"
                elif game.state == "menu" and game.menu_page != "main":
                    game.menu_page = "main"

            if game.state == "intro" and event.key == pygame.K_RETURN:
                game.story_index += 1

            elif game.state == "playing" and event.key == pygame.K_p:
                game.state = "pause"

            elif game.state == "pause" and event.key == pygame.K_p:
                game.state = "playing"

            elif game.state == "upgrade" and event.key in [pygame.K_1, pygame.K_2, pygame.K_3]:
                idx = event.key - pygame.K_1

                if idx < len(game.options):
                    game.options[idx][2](game.player)
                    game.state = "playing"

            elif game.state == "shop":
                if event.key == pygame.K_ESCAPE:
                    game.state = "playing"

                elif event.key in [pygame.K_1, pygame.K_2, pygame.K_3]:
                    idx = event.key - pygame.K_1

                    if idx < len(game.options) and game.player.coins >= 8 + idx * 5:
                        game.player.coins -= 8 + idx * 5
                        game.options[idx][2](game.player)
                        game.state = "playing"

            elif game.state == "dead":
                if event.key == pygame.K_r:
                    selected = game.selected_weapon
                    game = Game()
                    game.selected_weapon = selected
                    game.reset_run()

                elif event.key == pygame.K_ESCAPE:
                    game = Game()

    if game.state == "menu":
        game.draw_menu()

    elif game.state == "intro":
        game.draw_intro()

    elif game.state == "playing":
        game.update_playing()
        game.draw_playing()

    elif game.state == "upgrade":
        game.draw_upgrade()

    elif game.state == "shop":
        game.draw_shop()

    elif game.state == "pause":
        game.draw_playing()

        overlay = pygame.Surface((INTERNAL_W, INTERNAL_H), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 180))
        render.blit(overlay, (0, 0))

        text(render, "PAUSA", fonts["big"], WHITE, INTERNAL_W // 2, INTERNAL_H // 2 - 40, True)
        text(render, "P / ESC para volver", fonts["font"], YELLOW, INTERNAL_W // 2, INTERNAL_H // 2 + 35, True)
        text(render, "F11 alterna pantalla completa", fonts["small"], GRAY, INTERNAL_W // 2, INTERNAL_H // 2 + 72, True)

    elif game.state == "dead":
        game.draw_dead()

    output_frame()

pygame.quit()