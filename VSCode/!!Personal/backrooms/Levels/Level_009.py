import random

LEVEL_ID = "009"
LEVEL_NUMBER = 9
LEVEL_NAME = "The Suburbs"
IMAGE_NAME = "Level_009.png"

INTRO_TEXT = (
    "You emerge into a silent suburban neighborhood.\n"
    "The streets are wet, the houses are dark, and the night never seems to end."
)

WALK_TEXTS = [
    "You walk past another dark house with curtains drawn shut.",
    "A flickering streetlamp briefly illuminates the road ahead.",
    "Dead leaves scrape across the asphalt in the wind.",
    "The windows of a nearby house seem to follow your movement.",
    "A puddle reflects the sky, but no stars appear in it.",
    "You hear something moving between two houses.",
    "The sidewalk stretches endlessly through the darkness.",
    "A mailbox stands open, completely empty.",
    "The fog begins to thicken before slowly fading away.",
    "You notice two identical houses standing side-by-side.",
    "A distant dog barks, then falls silent.",
    "The neighborhood remains completely abandoned.",
    "You pass a parked car covered in condensation.",
    "A porch light flickers once, then dies.",
    "You feel like something is watching you from behind a window.",
    "The air smells like rain, even though the sky is clear.",
    "You hear footsteps behind you, but nobody is there when you turn around.",
    "A road sign points somewhere you've never heard of.",
    "The darkness between the houses feels deeper than it should.",
    "The road continues endlessly beneath the midnight sky."
]

POSSIBLE_EXITS = [
    {
        "target_level": "010",
        "chance": 4,
        "text": "The sidewalk ends beside an open grassy field. Leaving the pavement behind, you walk into the tall grass.",
        "image": "Level_009_Exit_010.png",
        "enabled": True
    },
    {
        "target_level": "011",
        "chance": 5,
        "text": "You find a series of arrow road signs. Following them for what feels like miles, the suburbs slowly begin to change.",
        "image": "Level_009_Exit_011.png",
        "enabled": True
    },
    {
        "target_level": "053",
        "chance": 1,
        "text": "One of the houses feels strangely inviting. The front door slowly swings open.",
        "image": "Level_009_Exit.png",
        "enabled": True
    },
    {
        "target_level": "060",
        "chance": 1,
        "text": "A crack appears in the asphalt beneath your feet.",
        "image": "Level_009_Exit_060.png",
        "enabled": False
    },
    {
        "target_level": "113",
        "chance": 1,
        "text": "The electrical power lines seem to stretch toward somewhere beyond the neighborhood.",
        "image": "Level_009_Exit_113.png",
        "enabled": False
    },
    {
        "target_level": "036",
        "chance": 1,
        "text": "In the distance, you spot the lights of an airport.",
        "image": "Level_009_Exit_036.png",
        "enabled": False
    },
    {
        "target_level": "283",
        "chance": 1,
        "text": "A children's playground appears between two rows of houses.",
        "image": "Level_009_Exit_283.png",
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