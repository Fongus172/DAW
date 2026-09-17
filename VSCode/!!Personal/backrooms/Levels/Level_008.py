import random

LEVEL_ID = "008"
LEVEL_NUMBER = 8
LEVEL_NAME = "Cave Systems"
IMAGE_NAME = "Level_008.png"

INTRO_TEXT = (
    "You emerge from freezing water into a vast cave chamber.\n"
    "Jagged rocks surround you like prison bars. Somewhere ahead, a sign reads: WELCOME TO THE 9TH ROAD."
)

WALK_TEXTS = [
    "You crawl through a narrow passage, the stone pressing against your shoulders.",
    "Cold water drips from the ceiling onto your neck.",
    "A marker with the M.E.G. logo points deeper into the cave.",
    "The tunnel twists strangely. You are no longer sure which way gravity is pulling.",
    "Loose rocks shift beneath your feet.",
    "You hear distant clicking somewhere in the darkness.",
    "A stream of cold water runs across the cave floor.",
    "The air feels thin and stale.",
    "You pass a marker labeled 9th Road, but the number seems lower than the last one.",
    "Something with too many legs skitters across the wall and disappears.",
    "A faint blue-green glow dances in a distant chamber.",
    "You squeeze through a crevice and scrape your arm against sharp rock.",
    "The cave opens into a larger chamber filled with echoes.",
    "A cold wind moves through the tunnel, carrying the smell of wet stone.",
    "You see old footprints in the mud, but they suddenly stop.",
    "The darkness ahead feels alive.",
    "You hear running water somewhere below you.",
    "The ground changes from rock to gravel, then back again.",
    "A damaged sign warns you not to leave the marked route.",
    "You keep following the 9th Road markers."
]

POSSIBLE_EXITS = [
    {
        "target_level": "009",
        "chance": 8,
        "text": "The rock turns to sand, then gravel, then asphalt. A dim suburban glow appears ahead at the end of the 9th Road.",
        "image": "Level_008_Exit_009.png",
        "enabled": True
    },
    {
        "target_level": "002",
        "chance": 2,
        "text": "You climb through a vent in the ceiling of the Rottnest Jungle. The air beyond smells of machinery and old concrete.",
        "image": "Level_008_Exit.png",
        "enabled": True
    },
    {
        "target_level": "041",
        "chance": 1,
        "text": "A pool of black tar begins to move. Hands reach from beneath the surface and drag you under.",
        "image": "Level_008_Exit.png",
        "enabled": True
    },
    {
        "target_level": "091",
        "chance": 1,
        "text": "A pool of black tar pulls you down into the boiling darkness. When you wake, the cave is gone.",
        "image": "Level_008_Exit.png",
        "enabled": True
    },
    {
        "target_level": "075",
        "chance": 1,
        "text": "You find a rare, tight passageway coated in a strange silvery substance.",
        "image": "Level_008_Exit.png",
        "enabled": True
    },
    {
        "target_level": "093",
        "chance": 1,
        "text": "One section of cave wall feels thin and unstable. You press through it and no-clip away.",
        "image": "Level_008_Exit.png",
        "enabled": True
    },
    {
        "target_level": "203",
        "chance": 1,
        "text": "Near Harmouth Camp 4, you find a door embedded in the stone. It does not belong here.",
        "image": "Level_008_Exit.png",
        "enabled": True
    },
    {
        "target_level": "205",
        "chance": 1,
        "text": "You force yourself upward through the ceiling. The stone gives way as reality folds around you.",
        "image": "Level_008_Exit.png",
        "enabled": True
    },
    {
        "target_level": "069",
        "chance": 1,
        "text": "The floor suddenly vanishes beneath your feet. You fall through the cave and into darkness.",
        "image": "Level_008_Exit.png",
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