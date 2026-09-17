LEVEL_ID = "091"
LEVEL_NUMBER = 91
LEVEL_NAME = "But a Memory"
IMAGE_NAME = "Level_091.png"

IS_DEVELOPED = False

PLACEHOLDER_TEXT = (
    "You've reached Level 91!\n\n"
    "A quiet island rests beneath a clear sky.\n"
    "A small house waits near the cliff, peaceful, nostalgic, and strangely familiar.\n\n"
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