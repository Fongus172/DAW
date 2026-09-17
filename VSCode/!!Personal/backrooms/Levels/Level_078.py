LEVEL_ID = "078"
LEVEL_NUMBER = 78
LEVEL_NAME = "Space Station"
IMAGE_NAME = "Level_078.png"

IS_DEVELOPED = False

PLACEHOLDER_TEXT = (
    "You've reached Level 78!\n\n"
    "A broken space station stretches endlessly in zero gravity.\n"
    "Beyond the portholes, there are only stars.\n\n"
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