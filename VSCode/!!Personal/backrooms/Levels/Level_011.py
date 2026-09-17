import random

LEVEL_ID = "011"
LEVEL_NUMBER = 11
LEVEL_NAME = "The City That Never Sleeps"
IMAGE_NAME = "Level_011.png"

INTRO_TEXT = (
    "The road opens into an endless city.\n"
    "Buildings stretch in every direction, silent but somehow alive."
)

WALK_TEXTS = [
    "You walk down a wide city avenue lined with parked cars.",
    "A traffic light changes color for nobody.",
    "The windows of nearby buildings reflect the street like black mirrors.",
    "You pass a row of plain shops with their lights still on.",
    "An empty bus stop stands beside the road.",
    "A billboard changes when you look away.",
    "You hear distant machinery from inside a factory.",
    "A subway entrance descends beneath the sidewalk.",
    "A canal cuts through the city, its water perfectly still.",
    "A construction site blocks part of the street.",
    "You pass an apartment building with every door locked.",
    "A supermarket sits fully stocked, but completely empty.",
    "Cars line the curb, none of them running.",
    "Graffiti on a wall points toward a safer street.",
    "You find a barricade made from furniture and metal sheets.",
    "A group of buildings ahead all look exactly the same.",
    "The city feels inhabited, even when nobody is around.",
    "A shop sign flickers above an empty storefront.",
    "You hear footsteps in an alley, but see no one.",
    "The roads continue in perfect block formations.",
    "A distant train passes underground.",
    "You walk past a park surrounded by identical streets.",
    "The city changes in small ways whenever you stop watching.",
    "A building entrance seems open, but the inside is pitch black.",
    "You pass a memorial covered in old notes and faded flowers."
]

POSSIBLE_EXITS = [
    {
        "target_level": "012",
        "chance": 4,
        "text": "You find a window that does not reflect the street correctly. Its surface looks wrong, almost alive.",
        "image": "Level_011_Exit_012.png",
        "enabled": True
    },
    {
        "target_level": "063",
        "chance": 1,
        "text": "You trip into a patch of shrubbery beside the road.",
        "image": "Level_011_Exit_063.png",
        "enabled": False
    },
    {
        "target_level": "164",
        "chance": 1,
        "text": "A large plain building stands nearby, strangely featureless.",
        "image": "Level_011_Exit_164.png",
        "enabled": False
    },
    {
        "target_level": "178",
        "chance": 1,
        "text": "The pavement beneath you feels thin and unstable.",
        "image": "Level_011_Exit_178.png",
        "enabled": False
    },
    {
        "target_level": "325",
        "chance": 1,
        "text": "A construction site nearby feels unstable, as if space is folding through it.",
        "image": "Level_011_Exit_325.png",
        "enabled": False
    },
    {
        "target_level": "470",
        "chance": 1,
        "text": "You linger too long inside an unfinished building.",
        "image": "Level_011_Exit_470.png",
        "enabled": False
    },
    {
        "target_level": "740",
        "chance": 1,
        "text": "You enter an operational power plant humming with impossible energy.",
        "image": "Level_011_Exit_740.png",
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