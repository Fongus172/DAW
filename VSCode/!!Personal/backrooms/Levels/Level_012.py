import random

LEVEL_ID = "012"
LEVEL_NUMBER = 12
LEVEL_NAME = "Matrix"
IMAGE_NAME = "Level_012.png"

INTRO_TEXT = (
    "You enter a bright white room.\n"
    "There is a table, a chair, and a locked door. Everything feels censored, unfinished, and wrong."
)

WALK_TEXTS = [
    "You walk through the white open area. Distance feels impossible to measure.",
    "A plain chair sits halfway through the floor.",
    "The white walls blur together until the room feels endless.",
    "You find a copy of the locked door standing alone in the empty space.",
    "Your memories feel slightly foggy.",
    "A table appears in the distance, but it vanishes when you look away.",
    "The floor is too clean, too flat, too silent.",
    "You hear nothing except your own footsteps.",
    "A drawer lies on its side, old and beaten up.",
    "You feel like the level is refusing to be understood.",
    "The empty space stretches farther than it should.",
    "For a moment, you forget what you were looking for.",
    "A lamp flickers without being plugged into anything.",
    "You find another locked door. It leads back to the same room.",
    "The white void seems to censor itself around you."
]

POSSIBLE_EXITS = [
    {
        "target_level": "001",
        "chance": 4,
        "text": "After repeating the strange sequence, the locked door finally opens. Beyond it, you see concrete walls and distant pipes.",
        "image": "Level_012_Exit.png",
        "enabled": True
    },
    {
        "target_level": "004",
        "chance": 4,
        "text": "The locked door clicks open. A quiet office hallway waits on the other side.",
        "image": "Level_012_Exit.png",
        "enabled": True
    },
    {
        "target_level": "010",
        "chance": 4,
        "text": "The door opens into grey daylight. Wheat fields stretch endlessly beyond the frame.",
        "image": "Level_012_Exit.png",
        "enabled": True
    },
    {
        "target_level": "019",
        "chance": 1,
        "text": "The door opens to somewhere cold and unfamiliar.",
        "image": "Level_012_Exit.png",
        "enabled": False
    },
    {
        "target_level": "023",
        "chance": 1,
        "text": "The door opens into a place your mind refuses to keep clear.",
        "image": "Level_012_Exit.png",
        "enabled": False
    },
    {
        "target_level": "025",
        "chance": 1,
        "text": "The door opens to the sound of distant arcade machines.",
        "image": "Level_012_Exit.png",
        "enabled": False
    },
    {
        "target_level": "034",
        "chance": 1,
        "text": "The door opens into damp concrete and the smell of sewage.",
        "image": "Level_012_Exit.png",
        "enabled": False
    },
    {
        "target_level": "287",
        "chance": 1,
        "text": "The door opens into a level you do not recognize.",
        "image": "Level_012_Exit.png",
        "enabled": False
    }
]


def get_level_data():
    return {
        "id": LEVEL_ID,
        "number": LEVEL_NUMBER,
        "name": LEVEL_NAME,
        "image": IMAGE_NAME,
        "full_name": f"Level {LEVEL_NUMBER} - {LEVEL_NAME}",
        "intro_text": INTRO_TEXT
    }


def get_walk_event(step, exit_chance_multiplier=1):
    enabled_exits = [
        exit_data for exit_data in POSSIBLE_EXITS
        if exit_data["enabled"]
    ]

    for exit_data in enabled_exits:
        random_number = random.randint(1, 100)
        exit_chance = exit_data["chance"] * exit_chance_multiplier

        if random_number <= exit_chance:
            return {
                "type": "exit",
                "text": exit_data["text"],
                "image": exit_data["image"],
                "target_level": exit_data["target_level"]
            }

    return {
        "type": "nothing",
        "text": random.choice(WALK_TEXTS)
    }