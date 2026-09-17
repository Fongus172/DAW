import random

LEVEL_ID = "000"
LEVEL_NUMBER = 0
LEVEL_NAME = "The Threshold"
IMAGE_NAME = "Level_000.png"
IS_DEVELOPED = True

INTRO_TEXT = (
    "You awaken under the buzzing fluorescent lights.\n"
    "The carpet is damp. The air smells stale. Every hallway looks wrong."
)

WALK_TEXTS = [
    "You keep walking through the yellow halls. Nothing changes.",
    "The fluorescent lights buzz above you without pause.",
    "Your footsteps sink slightly into the damp carpet.",
    "You pass another empty room. It looks almost identical to the last one.",
    "The wallpaper pattern repeats until it starts to feel hostile.",
    "For a moment, you think the hallway behind you is not the same one you came from.",
    "The air feels warm, stale, and completely still.",
    "You hear a faint sound behind the walls, but it fades before you can place it.",
    "The ceiling lights flicker once, then continue humming.",
    "You walk past a corner that feels too familiar.",
    "The smell of wet carpet gets stronger.",
    "You try to keep track of your path, but the rooms blur together.",
    "There are no windows. No doors. Only more yellow.",
    "Your own breathing sounds too loud in the empty space.",
    "The silence between the buzzing lights feels heavier than it should."
]

EXIT_TEXTS = [
    "One section of wall flickers strangely, as if it is less real than the others.",
    "You notice a dark opening where there was only wallpaper before.",
    "A broken stretch of hallway leads into a space that feels different.",
    "The wall ahead seems to ripple for a second. Something lies beyond it."
]


def get_level_data():
    return {
        "id": LEVEL_ID,
        "number": LEVEL_NUMBER,
        "name": LEVEL_NAME,
        "image": IMAGE_NAME,
        "full_name": f"Level {LEVEL_NUMBER} - {LEVEL_NAME}",
        "intro_text": INTRO_TEXT,
        "is_developed": IS_DEVELOPED
    }


def get_walk_event(step, exit_chance_multiplier=1):
    random_number = random.randint(1, 100)

    exit_chance = 5 * exit_chance_multiplier

    if random_number <= exit_chance:
        return {
            "type": "exit",
            "text": random.choice(EXIT_TEXTS),
            "image": "Level_000_Exit_001.png",
            "target_level": "001"
        }

    return {
        "type": "nothing",
        "text": random.choice(WALK_TEXTS)
    }