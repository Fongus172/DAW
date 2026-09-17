import random

CHAT_COLORS = [
    "#fe0000",
    "#0000ff",
    "#018001",
    "#b12222",
    "#ff7e4f",
    "#9bcd31",
    "#ff4400",
    "#2e8a57",
    "#daa420",
    "#d3691f",
    "#5f9fa0",
    "#1f91ff",
    "#ff69b3",
    "#8a2be1",
    "#00ff80",
]

def get_random_chat_color():
    return random.choice(CHAT_COLORS)
