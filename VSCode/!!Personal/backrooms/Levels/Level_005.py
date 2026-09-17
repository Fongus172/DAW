import random

LEVEL_ID = "005"
LEVEL_NUMBER = 5
LEVEL_NAME = "Terror Hotel"
IMAGE_NAME = "Level_005.png"

INTRO_TEXT = (
    "The elevator doors open into an old hotel corridor.\n"
    "Smooth jazz plays somewhere far away. The air smells clean, warm, and wrong."
)

WALK_TEXTS = [
    "You walk through a corridor lined with red and gold wallpaper.",
    "A vintage speaker plays soft jazz from somewhere you cannot see.",
    "The polished floor reflects the lights too clearly.",
    "You pass a row of numbered doors. The numbers do not follow any order.",
    "A chandelier flickers above a silent hallway.",
    "You hear distant party chatter from behind the wall.",
    "An old painting seems to stare at you as you pass.",
    "A door closes by itself somewhere behind you.",
    "The hallway is spotless, as if the hotel cleans itself.",
    "You pass an antique sofa that looks freshly dusted.",
    "A turntable crackles, then changes songs on its own.",
    "You hear a faint whisper behind your shoulder, but nobody is there.",
    "A golden room placard hangs crookedly on a locked door.",
    "The carpet feels thick and expensive beneath your feet.",
    "You find a small silver sign pointing toward The Beverly Room.",
    "Warm air drifts from a corridor leading toward the Boiler Room.",
    "You hear water dripping through old pipes.",
    "A swarm-like fluttering echoes from a dark room nearby.",
    "The hotel feels occupied, but you have not seen anyone.",
    "A polished brass elevator waits at the end of the hall."
]

POSSIBLE_EXITS = [
    {
        "target_level": "003",
        "chance": 4,
        "text": "You find an old elevator. Its doors open with a tired metallic groan.",
        "image": "Level_005_Exit.png",
        "enabled": True
    },
    {
        "target_level": "004",
        "chance": 4,
        "text": "You find an old-fashioned stairway leading back up toward an office-like space.",
        "image": "Level_005_Exit_004.png",
        "enabled": True
    },
    {
        "target_level": "006",
        "chance": 4,
        "text": "You travel deeper into the Boiler Room. The heat rises until the lights disappear behind you.",
        "image": "Level_005_Exit_006.png",
        "enabled": True
    },
    {
        "target_level": "009",
        "chance": 1,
        "text": "You find a dark wooden door at the end of a silent hallway.",
        "image": "Level_005_Exit_009.png",
        "enabled": True
    },
    {
        "target_level": "063",
        "chance": 1,
        "text": "You find an open door showing a forest scene beyond it.",
        "image": "Level_005_Exit.png",
        "enabled": True
    },
    {
        "target_level": "098",
        "chance": 1,
        "text": "You find a metal door in the Main Hall.",
        "image": "Level_005_Exit.png",
        "enabled": True
    },
    {
        "target_level": "427",
        "chance": 1,
        "text": "The lights flicker in unison, and a wooden door appears where there was only wall before.",
        "image": "Level_005_Exit.png",
        "enabled": True
    },
    {
        "target_level": "040",
        "chance": 1,
        "text": "You find an arcade cabinet humming inside the Boiler Room.",
        "image": "Level_005_Exit.png",
        "enabled": True
    },
    {
        "target_level": "078",
        "chance": 1,
        "text": "An airlock-like door stands between the old machinery.",
        "image": "Level_005_Exit.png",
        "enabled": True
    },
    {
        "target_level": "084",
        "chance": 1,
        "text": "A large wooden gate appears inside The Beverly Room.",
        "image": "Level_005_Exit.png",
        "enabled": True
    },
    {
        "target_level": "171",
        "chance": 1,
        "text": "You find a secured hotel wing marked by M.E.G. warnings.",
        "image": "Level_005_Exit.png",
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