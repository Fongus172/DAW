LEVEL_ID = "053"
LEVEL_NUMBER = 53
LEVEL_NAME = "Alone"
IMAGE_NAME = "Level_053.png"

IS_DEVELOPED = False

PLACEHOLDER_TEXT = (
    "You've reached Level 53!\n\n"
    "A quiet suburban house sits frozen in an endless morning.\n"
    "The furniture is untouched, the television still works, and someone seems to have lived here for years.\n\n"
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