import random

LEVEL_ID = "004"
LEVEL_NUMBER = 4
LEVEL_NAME = "Abandoned Office"
IMAGE_NAME = "Level_004.png"

INTRO_TEXT = (
    "The elevator opens into an empty office building.\n"
    "The air is calmer here. Rows of blank rooms stretch beneath cold fluorescent lights."
)

WALK_TEXTS = [
    "You walk past an empty office room with no furniture inside.",
    "A blacked-out window reflects only the hallway behind you.",
    "You find a water cooler filled with Almond Water.",
    "The carpet muffles your footsteps almost completely.",
    "A vending machine hums softly in the distance.",
    "The office lights buzz above you, steady and sterile.",
    "You pass a row of doors leading into identical empty rooms.",
    "A fountain stands against the wall, still running with clear Almond Water.",
    "You hear faint voices somewhere far away, probably other wanderers.",
    "A blacked-out window seems to absorb the light around it.",
    "The halls feel safer than the levels before, but not normal.",
    "You pass a hand-written note warning people not to approach uncovered windows.",
    "There are signs of human presence here: empty bottles, footprints, and old markings.",
    "The office space feels endless, but strangely livable.",
    "You find a quiet corner that looks like someone rested there recently.",
    "A distant elevator dings, but you see nobody nearby."
]

POSSIBLE_EXITS = [
    {
        "target_level": "005",
        "chance": 4,
        "text": "You find an office-style stairway leading down into a warmer, older-looking area.",
        "image": "Level_004_Exit.png",
        "enabled": True
    },
    {
        "target_level": "006",
        "chance": 4,
        "text": "You find a dark stairway descending into complete blackness.",
        "image": "Level_004_Exit.png",
        "enabled": True
    },
    {
        "target_level": "003",
        "chance": 3,
        "text": "An elevator opens with a metallic groan. The air inside smells like dust and electricity.",
        "image": "Level_004_Exit.png",
        "enabled": True
    },
    {
        "target_level": "071",
        "chance": 1,
        "text": "You find a stairway leading down into what looks like a basement.",
        "image": "Level_004_Exit.png",
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