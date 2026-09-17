LEVEL_ID = "427"
LEVEL_NUMBER = 427
LEVEL_NAME = "Woodrooms"
IMAGE_NAME = "Level_427.png"

IS_DEVELOPED = False

PLACEHOLDER_TEXT = (
    "You've reached Level 427!\n\n"
    "An endless maze of wooden hallways stretches in every direction.\n"
    "You hear mechanical ticking behind the walls.\n\n"
    "You'll be able to explore more from here in the future."
)


def get_level_data():
    return {
        "id": LEVEL_ID,
        "number": LEVEL_NUMBER,
        "name": LEVEL_NAME,
        "image": IMAGE_NAME,
        "full_name": f"Level {LEVEL_NUMBER} - {LEVEL_NAME}",
        "intro_text": PLACEHOLDER_TEXT,
        "is_developed": IS_DEVELOPED
    }


def get_walk_event(step, exit_chance_multiplier=1):
    return {
        "type": "nothing",
        "text": PLACEHOLDER_TEXT
    }