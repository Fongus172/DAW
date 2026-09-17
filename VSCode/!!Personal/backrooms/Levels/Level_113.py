LEVEL_ID = "113"
LEVEL_NUMBER = 113
LEVEL_NAME = "Verum Terra Machinis"
IMAGE_NAME = "Level_113.png"

IS_DEVELOPED = False

PLACEHOLDER_TEXT = (
    "You've reached Level 113.\n\n"
    "A vast metallic city stretches across the horizon. "
    "Towering mechanical structures dominate the landscape while strange automated machines patrol the streets.\n\n"
    "Somewhere in the distance, countless gears, engines, and artificial intelligences continue operating for purposes unknown.\n\n"
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