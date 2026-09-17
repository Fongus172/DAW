LEVEL_ID = "040"
LEVEL_NUMBER = 40
LEVEL_NAME = "Roller Rockin' Pizza!"
IMAGE_NAME = "Level_040.png"

IS_DEVELOPED = False

PLACEHOLDER_TEXT = (
    "You've reached Level 40!\n\n"
    "An endless neon arcade stretches beyond sight.\n"
    "The sounds of arcade machines and distant conversations echo through the halls.\n\n"
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