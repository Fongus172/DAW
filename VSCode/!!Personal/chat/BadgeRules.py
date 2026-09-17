from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import random


@dataclass(frozen=True)
class BadgeConfig:
    base_dir: Path

    # Evento: 30% de tener 1 badge de evento (uno al azar)
    event_probability: float = 0.30

    # VideoOnly/AudioOnly: 5% de tener 1 (mutuamente excluyentes)
    media_only_probability: float = 0.05


class BadgeRules:
    """
    Devuelve una lista de badges (Paths) en el orden de prioridad:

    Mod > Event > (VideoOnly/AudioOnly)

    Reglas:
    - Si el username es mod:
      * Se aplica mod.ico
      * NO se aplican event/media-only por probabilidad
      * PERO puede tener badges extra "a dedo" (custom)
    - Si NO es mod:
      * Event: 30% de tener 1 badge de evento (uno al azar de la lista)
      * VideoOnly/AudioOnly: 5% de tener UNO entre los dos (mutuamente excluyentes)
      * Media-only va al final
    """

    def __init__(self, config: BadgeConfig):
        self.config = config
        badges_dir = self.config.base_dir / "badges"

        # Badge de mod
        self.badge_mod = badges_dir / "mod.ico"

        # ===== Badges de evento (definidos como atributos para poder reutilizarlos) =====
        self.badge_prime = badges_dir / "prime.ico"
        self.badge_cheer1 = badges_dir / "cheer1.ico"
        self.badge_cheer100 = badges_dir / "cheer100.ico"
        self.badge_cheer1000 = badges_dir / "cheer1000.ico"
        self.badge_glitchcon2020 = badges_dir / "glitchcon2020.ico"
        self.badge_minecraft15th = badges_dir / "minecraft15thanniversary.ico"
        self.badge_velada4 = badges_dir / "velada4.ico"
        self.badge_velada5 = badges_dir / "velada5.ico"
        self.badge_rplace2023 = badges_dir / "rplace2023.ico"
        self.badge_heart = badges_dir / "heart.ico"
        self.badge_glhfpledge = badges_dir / "glhfpledge.ico"
        self.badge_arcane = badges_dir / "arcane.ico"
        self.badge_recap2024 = badges_dir / "recap2024.ico"
        self.badge_recap2025 = badges_dir / "recap2025.ico"
        self.badge_umbrella = badges_dir / "umbrella.ico"
        self.badge_vip = badges_dir / "vip.ico"

        # Lista de evento (prime y cheer1 van aquí también)
        self.event_badges: list[Path] = [
            self.badge_prime,
            self.badge_cheer1,
            self.badge_cheer100,
            self.badge_cheer1000,
            self.badge_glitchcon2020,
            self.badge_minecraft15th,
            self.badge_velada4,
            self.badge_velada5,
            self.badge_rplace2023,
            self.badge_heart,
            self.badge_glhfpledge,
            self.badge_arcane,
            self.badge_recap2024,
            self.badge_recap2025,
            self.badge_umbrella,
        ]

        # ===== Media-only (mutuamente excluyentes) =====
        self.badge_videoonly = badges_dir / "videoonly.ico"
        self.badge_audioonly = badges_dir / "audioonly.ico"

        # ===== Mods =====
        self.mod_usernames: set[str] = {
            "donkey5o5",
            "lascronicasdebrando",
            "amdr3y15",
            "aiitorcm2000",
            "skyworld21",
            "MegaFly95",
            "luaralf",
            "may__vt",
            "jukushika",
            "Sasorler",
            "elciganda",
        }

        # ===== Badges custom para mods (además de mod.ico) =====
        self.mod_custom_badges: dict[str, list[Path]] = {
            "MegaFly95": [self.badge_prime],
            "daniel_ideas": [self.badge_vip],
        }

        # Orden de prioridad (informativo)
        self.priority = ["mod", "event", "mediaonly"]

    def is_mod(self, username: str) -> bool:
        return username in self.mod_usernames

    def _pick_event_badge(self) -> Path | None:
        """Devuelve 1 badge de evento existente (al azar) o None si no hay ninguno disponible."""
        available = [p for p in self.event_badges if p.exists()]
        if not available:
            return None
        return random.choice(available)

    def _pick_media_only_badge(self) -> Path | None:
        """Devuelve 1 badge media-only existente (al azar) o None."""
        candidates: list[Path] = []
        if self.badge_videoonly.exists():
            candidates.append(self.badge_videoonly)
        if self.badge_audioonly.exists():
            candidates.append(self.badge_audioonly)

        if not candidates:
            return None
        return random.choice(candidates)

    def get_badges_for_username(self, username: str) -> list[Path]:
        """
        Devuelve lista de badges (Paths) en orden:
        Mod > Event > (VideoOnly/AudioOnly)

        Puede devolver:
        - MOD: [mod] o [mod, extra...]
        - NO MOD: [], [event], [media], [event, media]
        """
        badges: list[Path] = []

        # 1) Si es MOD: mod + extras (y NADA de probabilidades)
        if self.is_mod(username):
            if self.badge_mod.exists():
                badges.append(self.badge_mod)

            extras = self.mod_custom_badges.get(username, [])
            for b in extras:
                if b is not None and b.exists():
                    badges.append(b)

            return badges

        # 2) Evento: 30% de tener 1
        event_badge: Path | None = None
        if random.random() < self.config.event_probability:
            event_badge = self._pick_event_badge()

        # 3) Media-only: 5% de tener 1
        media_badge: Path | None = None
        if random.random() < self.config.media_only_probability:
            media_badge = self._pick_media_only_badge()

        # 4) Orden final
        if event_badge is not None:
            badges.append(event_badge)
        if media_badge is not None:
            badges.append(media_badge)

        return badges
