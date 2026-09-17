LEVEL_ID = "083"
LEVEL_NUMBER = 83
LEVEL_NAME = "The Sunken Submarine"
IMAGE_NAME = "Level_083.png"

IS_DEVELOPED = False

PLACEHOLDER_TEXT = (
    "You've reached Level 83!\n\n"
    "You wake inside the USS Ace of Spades, a sunken submarine resting deep beneath an endless ocean.\n"
    "Something enormous watches through the windows.\n\n"
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