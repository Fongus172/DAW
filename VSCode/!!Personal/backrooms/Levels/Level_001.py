import random

LEVEL_ID = "001"
LEVEL_NUMBER = 1
LEVEL_NAME = "Habitable Zone"
IMAGE_NAME = "Level_001.png"
IS_DEVELOPED = True

INTRO_TEXT = (
    "You fall out of the yellow halls and land on cold concrete.\n"
    "The air is humid. Pipes rumble above you. Somewhere far away, metal echoes."
)

WALK_TEXTS = [
    "You walk across a wide concrete hall. The space feels endless, but less unreal than before.",
    "Pipes run across the ceiling, occasionally dripping onto the floor.",
    "A distant metallic clang echoes through the level.",
    "You pass between concrete pillars stained by age and moisture.",
    "The air smells like dust, stagnant water, and rusted metal.",
    "You notice wooden crates stacked near a wall, but most of them are broken or empty.",
    "A flickering light makes the shadows stretch for a second too long.",
    "You see a dark corridor branching away from the open halls.",
    "The concrete floor is rough under your feet. At least it is not wet carpet.",
    "A puddle reflects the ceiling lights. You decide not to touch it.",
    "Somewhere above you, pipes groan as if something heavy moved through them.",
    "The halls feel almost habitable, but not safe.",
    "You find old scraps of wood and packing material scattered across the floor.",
    "For a moment, you think you hear voices, but the echo makes it impossible to tell.",
    "The level feels less empty than the last one. That does not make it comforting.",
    "You spot a faded mark on a wall, maybe left by another wanderer.",
    "The lights hum softly, then flicker just enough to make you stop walking.",
    "You keep moving, using the pillars as landmarks.",
    "A cold draft moves through the hall, carrying the smell of damp concrete.",
    "There are signs of people here, but no people in sight."
]


def get_level_data():
    return {
        "id": LEVEL_ID,
        "number": LEVEL_NUMBER,
        "name": LEVEL_NAME,
        "image": IMAGE_NAME,
        "full_name": f"Level {LEVEL_NUMBER} - {LEVEL_NAME}",
        "intro_text": INTRO_TEXT,
        "is_developed": IS_DEVELOPED
    }


EXIT_TEXTS = [
    "You find a corridor that stretches much farther than the others.",
    "A long concrete passage leads away from the open halls.",
    "You notice a maintenance-like corridor lined with pipes.",
    "The hall ahead narrows into something darker and more industrial."
]


def get_walk_event(step, exit_chance_multiplier=1):
    random_number = random.randint(1, 100)

    exit_chance = 5 * exit_chance_multiplier

    if random_number <= exit_chance:
        return {
            "type": "exit",
            "text": random.choice(EXIT_TEXTS),
            "image": "Level_001_Exit.png",
            "target_level": "002"
        }

    return {
        "type": "nothing",
        "text": random.choice(WALK_TEXTS)
    }
