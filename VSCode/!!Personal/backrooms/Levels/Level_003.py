import random

LEVEL_ID = "003"
LEVEL_NUMBER = 3
LEVEL_NAME = "Electrical Station"
IMAGE_NAME = "Level_003.png"

INTRO_TEXT = (
    "The utility halls twist into something darker and louder.\n"
    "Machinery roars behind the walls. The air is hot, dusty, and charged with electricity."
)

WALK_TEXTS = [
    "You move through a narrow brick hallway lined with copper pipes.",
    "The machinery around you growls loudly enough to drown out your footsteps.",
    "A grey tiled floor stretches ahead, coated in dust and grime.",
    "You pass rusty prison bars embedded into the corridor wall. Nothing behind them moves. Probably.",
    "Black sludge pulses through a pipe overhead.",
    "A generator hums behind a half-open electrical room door.",
    "Loose wires hang from the ceiling, sparking faintly.",
    "The air becomes warmer with every step.",
    "You hear something crawling somewhere beyond the machinery.",
    "A breaker box rattles violently, then falls silent.",
    "The corridor is so narrow you have to turn sideways to pass.",
    "A distant fluorescent light flickers in the darkness.",
    "You find an old flashlight on the floor, but its batteries are dead.",
    "The walls vibrate with the force of unseen engines.",
    "A smell like burning dust fills the hallway.",
    "You pass a room filled with security monitors showing only static.",
    "The pipes hiss. You decide not to touch them.",
    "Something metallic explodes far away, followed by silence.",
    "The heat becomes almost unbearable for a moment.",
    "You hear claws scrape against tile, but the sound fades before you see anything.",
    "You find a bottle labeled Almond Water, but leave it for now.",
    "The Wi-Fi signal on your device briefly jumps to full bars. Somehow.",
    "A machine sparks violently as you walk past it.",
    "The hallway twists again, splitting into more dark corridors.",
    "You feel watched from behind the prison bars."
]

POSSIBLE_EXITS = [
    {
        "target_level": "004",
        "chance": 4,
        "text": "You find an old elevator humming softly in the darkness. Its buttons still work.",
        "image": "Level_003_Exit.png",
        "enabled": True
    },
    {
        "target_level": "005",
        "chance": 4,
        "text": "You find an elevator, cleaner than the rest of the level. A brass number plate hangs beside it.",
        "image": "Level_003_Exit.png",
        "enabled": True
    },
    {
        "target_level": "031",
        "chance": 1,
        "text": "You find a wooden door standing alone in the electrical tunnels.",
        "image": "Level_003_Exit.png",
        "enabled": True
    },
    {
        "target_level": "069",
        "chance": 1,
        "text": "Inside an electrical room, you find an abandoned car. The front seat seems strangely inviting.",
        "image": "Level_003_Exit.png",
        "enabled": True
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