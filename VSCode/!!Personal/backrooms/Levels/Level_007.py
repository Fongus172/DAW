import random

LEVEL_ID = "007"
LEVEL_NUMBER = 7
LEVEL_NAME = "Thalassophobia"
IMAGE_NAME = "Level_007.png"

INTRO_TEXT = (
    "You descend the stairwell until you reach a furnished room filled with shallow water.\n"
    "Across the room, a doorway opens above a vast, dim ocean."
)

WALK_TEXTS = [
    "You move carefully through the entrance room, listening to the water below.",
    "The shallow water on the carpet ripples around your feet.",
    "You look through the doorway and see only endless ocean beneath the concrete ceiling.",
    "A cold breeze rises from the water outside.",
    "The distant surface of the ocean shifts under dim natural light.",
    "You hear waves echoing through the impossible concrete chamber.",
    "The furnished room feels like the only safe place in the entire level.",
    "You see the bookcase against the wall, its books swollen by moisture.",
    "A single chair sits beside the coffee table, untouched by the water.",
    "You keep away from the ocean doorway. One wrong step could send you falling.",
    "The water outside looks calm, but something about it feels occupied.",
    "You hear a heavy movement far below the surface.",
    "A rope hangs near the doorway, disappearing down toward the water.",
    "The air smells of salt, wet carpet, and old concrete.",
    "You stare into the ocean until the darkness below starts to feel aware of you.",
    "Something breaks the surface far away, then vanishes.",
    "The silence of the entrance room feels fragile.",
    "You think you see an island in the distance, but the shape fades into the dim light.",
    "The water below seems impossibly deep.",
    "You hear a faint splash from somewhere beneath the entrance."
]

POSSIBLE_EXITS = [
    {
        "target_level": "008",
        "chance": 4,
        "text": "You dive beneath the entrance and follow the depths downward. Far below, an underwater cave opens in the side of a tall mountain.",
        "image": "Level_007_Exit.png",
        "enabled": True
    },
    {
        "target_level": "009",
        "chance": 3,
        "text": "West of the entrance, beneath the surface, you find massive pipes and stone pillars surrounding a wooden door in the floor.",
        "image": "Level_007_Exit.png",
        "enabled": True
    },
    {
        "target_level": "083",
        "chance": 1,
        "text": "The Abyss below seems to pull at you. Diving deeper would be a terrible idea.",
        "image": "Level_007_Exit.png",
        "enabled": True
    },
    {
        "target_level": "880",
        "chance": 1,
        "text": "Far to the west, the ocean seems to stretch toward somewhere else.",
        "image": "Level_007_Exit.png",
        "enabled": False
    }
]


def get_level_data():
    return {
        "id": LEVEL_ID,
        "number": LEVEL_NUMBER,
        "name": LEVEL_NAME,
        "image": IMAGE_NAME,
        "full_name": f"Level {LEVEL_NUMBER} - {LEVEL_NAME}",
        "intro_text": INTRO_TEXT
    }


def get_walk_event(step, exit_chance_multiplier=1):
    enabled_exits = [
        exit_data for exit_data in POSSIBLE_EXITS
        if exit_data["enabled"]
    ]

    for exit_data in enabled_exits:
        random_number = random.randint(1, 100)
        exit_chance = exit_data["chance"] * exit_chance_multiplier

        if random_number <= exit_chance:
            return {
                "type": "exit",
                "text": exit_data["text"],
                "image": exit_data["image"],
                "target_level": exit_data["target_level"]
            }

    return {
        "type": "nothing",
        "text": random.choice(WALK_TEXTS)
    }