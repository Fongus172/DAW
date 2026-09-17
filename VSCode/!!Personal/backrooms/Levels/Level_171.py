LEVEL_ID = "171"
LEVEL_NUMBER = 171
LEVEL_NAME = "A Grand Illusion"
IMAGE_NAME = "Level_171.png"

IS_DEVELOPED = False

PLACEHOLDER_TEXT = (
    "You've reached Level 171!\n\n"
    "A decaying golden atrium stretches ahead while old jazz echoes through the halls.\n"
    "The lights flicker. Something moves when they go out.\n\n"
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