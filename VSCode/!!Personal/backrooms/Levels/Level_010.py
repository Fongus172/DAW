import random

LEVEL_ID = "010"
LEVEL_NUMBER = 10
LEVEL_NAME = "Bumper Crop"
IMAGE_NAME = "Level_010.png"

INTRO_TEXT = (
    "You step into an endless field of wheat and barley.\n"
    "The sky is grey and heavy. Dirt roads cut through the crops in long, silent lines."
)

WALK_TEXTS = [
    "You walk between endless rows of wheat.",
    "A cold breeze rolls across the field.",
    "The overcast sky never seems to change.",
    "You pass a small wooden shed standing alone among the crops.",
    "A dirt road stretches between the fields.",
    "The smell of wet soil and wheat fills the air.",
    "You find tire tracks in the mud, but no vehicle in sight.",
    "A line of trees divides one field from another.",
    "Light rain begins to fall, then stops almost immediately.",
    "You pass a silent barn with its doors half-open.",
    "The wheat sways gently, all in the same direction.",
    "A shallow lake reflects the grey sky.",
    "You hear insects hidden somewhere in the crops.",
    "The fields feel peaceful, but too empty.",
    "You find an old fence disappearing into the distance.",
    "The dirt path beneath your feet does not seem to regrow.",
    "A patch of barley bends under the wind.",
    "You spot a farmhouse-like structure far away, but it never gets closer.",
    "The crops continue endlessly in every direction.",
    "You keep walking, using the road as your only guide."
]

POSSIBLE_EXITS = [
    {
        "target_level": "011",
        "chance": 5,
        "text": "You find a dirt road and follow it for what feels like hours. The fields thin out, and distant buildings begin to rise ahead.",
        "image": "Level_010_Exit_011.png",
        "enabled": True
    },
    {
        "target_level": "184",
        "chance": 1,
        "text": "You find a patch of canola among the wheat.",
        "image": "Level_010_Exit_184.png",
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