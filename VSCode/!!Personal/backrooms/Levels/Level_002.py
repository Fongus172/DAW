import random

LEVEL_ID = "002"
LEVEL_NUMBER = 2
LEVEL_NAME = "Abandoned Utility Halls"
IMAGE_NAME = "Level_002.png"

INTRO_TEXT = (
    "The open concrete halls are gone.\n"
    "You now stand inside a narrow maintenance tunnel.\n"
    "Pipes cover the walls, and the air feels hot, stale, and metallic."
)

WALK_TEXTS = [
    "You squeeze through a tight corridor lined with rusted pipes.",
    "A machine hidden in the wall produces a weak internal whir.",
    "The tunnel bends sharply at a forty-five degree angle.",
    "Exposed cables hang loosely from the ceiling.",
    "A fluorescent light buzzes above you, dimmer than it should be.",
    "The concrete wall leaves pale dust on your fingers.",
    "You pass a locked steel door with a scratched window.",
    "The air smells of oil, dust, and old machinery.",
    "Broken glass crunches under your shoes.",
    "Several pipes vibrate faintly as you walk beneath them.",
    "The maintenance halls continue with no clear pattern."
]

POSSIBLE_EXITS = [
    {
        "target_level": "001",
        "chance": 4,
        "text": "You find an unlocked door marked with old scratches. It seems to lead back to the Habitable Zone.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "003",
        "chance": 5,
        "text": "You find an unlocked industrial door. The air beyond it feels heavier and colder.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "004",
        "chance": 3,
        "text": "You find a door with signs pointing toward an office-like area.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "031",
        "chance": 1,
        "text": "You find a plywood door fitted awkwardly into the concrete wall.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "070",
        "chance": 1,
        "text": "You find a massive floor-to-ceiling door with the number 70 engraved into it.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "101",
        "chance": 1,
        "text": "You find an unlocked door that feels unusually clean compared to the tunnels.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "126",
        "chance": 1,
        "text": "You hear echoing piano notes behind an unlocked door.",
        "image": "Level_002_Exit.png",
        "enabled": False
    },
    {
        "target_level": "127",
        "chance": 1,
        "text": "You find another plywood door. Something about it feels misplaced.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "137",
        "chance": 1,
        "text": "You find an aged wooden door, warped and dry.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "141",
        "chance": 1,
        "text": "You find a plain metal door with a cold handle.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "175",
        "chance": 1,
        "text": "You find a blue door standing out against the machinery.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "283",
        "chance": 1,
        "text": "You find a huge rainbow-painted door reaching from floor to ceiling.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "811",
        "chance": 1,
        "text": "Blue pulsating lights run along the pipes toward a door with a blade embedded in it.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "916",
        "chance": 1,
        "text": "After wandering for far too long, you find wooden doors with a broken doorknob.",
        "image": "Level_002_Exit.png",
        "enabled": False
    },
    {
        "target_level": "997",
        "chance": 1,
        "text": "You find a pink door in the middle of the utility tunnels.",
        "image": "Level_002_Exit.png",
        "enabled": True
    },
    {
        "target_level": "998",
        "chance": 1,
        "text": "You find elevator-like metal double doors.",
        "image": "Level_002_Exit.png",
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