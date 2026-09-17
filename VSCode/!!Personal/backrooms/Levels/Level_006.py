import random

LEVEL_ID = "006"
LEVEL_NUMBER = 6
LEVEL_NAME = "Lights Out"
IMAGE_NAME = "Level_006.png"

INTRO_TEXT = (
    "The light disappears completely.\n"
    "You can no longer see the walls, the floor, or your own hands.\n"
    "There is only darkness, silence, and the shape of the hallway beneath your fingers."
)

WALK_TEXTS = [
    "You move forward slowly, keeping one hand against the cold wall.",
    "The silence is so complete that your own breathing feels intrusive.",
    "Your foot brushes against something on the floor, but you cannot tell what it is.",
    "You stop walking. For a moment, you are sure something else stopped too.",
    "The wall beside you feels smooth, cold, and endless.",
    "You hear nothing. Somehow, that is worse.",
    "You take another step into the darkness.",
    "Your sense of direction begins to collapse.",
    "For a second, you think you hear whispering directly behind you.",
    "You reach forward, but your hand finds only empty air.",
    "The hallway feels tighter than before.",
    "You almost call out, then decide against it.",
    "Something scuttles far away. Or maybe your mind invented it.",
    "The darkness feels thick enough to touch.",
    "You keep walking, counting your steps until you lose track.",
    "Your shoulder scrapes against a wall you did not expect to be there.",
    "You hear a faint breath that does not match your own.",
    "There is no light. No echo. No comfort.",
    "You take a turn without knowing why.",
    "For one awful second, you feel like you are the only one here who cannot see."
]

POSSIBLE_EXITS = [
    {
        "target_level": "005",
        "chance": 3,
        "text": "You feel warmer air behind you. Following it, you find the way back toward the Boiler Room.",
        "image": "Level_006_Exit_005.png",
        "enabled": True
    },
    {
        "target_level": "007",
        "chance": 4,
        "text": "Far ahead, you hear the faint sound of waves. Your hand finds the railing of a stairwell descending deeper.",
        "image": "Level_006_Exit_007.png",
        "enabled": True
    },
    {
        "target_level": "129",
        "chance": 1,
        "text": "Your hand touches a large metal door. It is impossibly cold.",
        "image": "Level_006_Exit_129.png",
        "enabled": True
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