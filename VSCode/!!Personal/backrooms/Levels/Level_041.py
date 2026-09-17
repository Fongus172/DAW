LEVEL_ID = "041"
LEVEL_NUMBER = 41
LEVEL_NAME = "The Black Lake"
IMAGE_NAME = "Level_041.png"

IS_DEVELOPED = False

PLACEHOLDER_TEXT = (
    "You've reached Level 41!\n\n"
    "A boiling black tar lake stretches through a grey fog.\n"
    "Charred piers, sinking platforms, and burning asphalt surround you.\n\n"
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