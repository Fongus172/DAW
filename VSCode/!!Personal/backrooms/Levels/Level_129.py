LEVEL_ID = "129"
LEVEL_NUMBER = 129
LEVEL_NAME = "The White Forest"
IMAGE_NAME = "Level_129.png"

IS_DEVELOPED = False

PLACEHOLDER_TEXT = (
    "You've reached Level 129!\n\n"
    "A freezing forest of black trees and endless white snow surrounds you.\n"
    "The air is painfully cold, and the forest becomes less stable the deeper it goes.\n\n"
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