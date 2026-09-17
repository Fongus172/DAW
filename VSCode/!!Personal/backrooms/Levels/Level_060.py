LEVEL_ID = "060"
LEVEL_NUMBER = 60
LEVEL_NAME = "The Baywalk"
IMAGE_NAME = "Level_060.png"

IS_DEVELOPED = False

PLACEHOLDER_TEXT = (
    "You've reached Level 60.\n\n"
    "A dark concrete baywalk stretches endlessly beside a mysterious sea. "
    "Broken streetlights flicker in the distance while cold ocean winds blow across the shoreline.\n\n"
    "Something about the breeze makes you want to stop, relax, and forget the dangers lurking nearby.\n\n"
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