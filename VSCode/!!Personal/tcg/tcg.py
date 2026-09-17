import json
import os
import random
import sys
from datetime import datetime, date

# Colores ANSI
RESET = "\033[0m"
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
MAGENTA = "\033[95m"
CYAN = "\033[96m"
GRAY = "\033[90m"
ORANGE = "\033[33m"

DATA_FILE = 'PLAYER_DATA.JSON'
# Rarezas, weights y precio de venta por rareza
RARITY_WEIGHTS = {
    'legendaria': 0.5,    # 0.5% probabilidad
    'épica': 2.5,
    'rara': 5,
    'inusual': 20,
    'común': 72
}
SELL_PRICE_RARITY = {
    'legendaria': 100,
    'épica': 50,
    'rara': 20,
    'inusual': 10,
    'común': 5
}
RARITY_CARDS = {
    'legendaria': [
        # Balatro
        "Canio", "Chicot", "Triboulet", "Perkeo", "Yorick",
        # FNAF
        "Circus Baby", "Ennard", "The Mimic", "Puppet", "Springtrap", "Vanny",
        # Minecraft
        "Ender Dragon", "Herobrine", "Pigman", "Warden", "Wither",
        # Sonic
        "Biolizard", "Black Doom", "Dark Gaia", "Mephiles the Dark", "Perfect Chaos",
        # Team Fortress 2
        "Saxton Hale",
        # Undertale
        "W.D. Gaster"
    ],
    'épica': [
        # Balatro
        "Ancient Joker", "Baron", "Baseball Card", "Blueprint", "Brainstorm", "Burnt Joker", "Campfire", "DNA", "Driver's License",
        "Hit the Road", "Invisible Joker", "Obelisk", "Stuntman", "The Duo", "The Family", "The Order", "The Tribe", "The Trio", "Vagabond",
        "Wee Joker",
        # FNAF
        "Afton", "The Blob", "Burntrap", "Crying Child", "Dreadbear", "Fredbear", "Glitchtrap", "Golden Freddy", "Lefty", "Molten Freddy",
        "Purple Guy", "Scrap Baby", "Spring Bonnie", "Yellow Bear",
        # Minecraft
        "Allay", "Chicken Jockey", "Creaking", "Elder Guardian", "Evoker", "Illusioner", "Iron Golem", "Mooshroom (Brown)", "Notch (skin)",
        "Skeleton Horseman", "The Killer Bunny",
        # Sonic
        "Eggman Nega", "Emerl", "Infinite", "Neo Metal Sonic", "Super Shadow", "Super Silver", "Super Sonic",
        # Team Fortress 2
        "The Administrator", "Gray Mann",
        # Undertale
        "Asriel Dreemurr (Pacifist Route)", "Chara", "Mad Mew Mew", "Mettaton EX", "Mettaton NEO", "Photoshop Flowey", "The six souls",
        "Undyne the Undying"
    ],
    'rara': [
        # Balatro
        "Acrobat", "Arrowhead", "Astronomer", "Blackboard", "Bloodstone", "Bootstraps", "Bull", "Burglar", "Card Sharp", "Cartomancer",
        "Castle", "Ceremonial Dagger", "Certificate", "Constellation", "Diet Cola", "Dusk", "Fibonacci", "Flash Card", "Flower Pot",
        "Four Fingers", "Glass Joker", "Hiker", "Hologram", "Joker Stencil", "Loyalty Card", "Luchador", "Lucky Cat", "Madness", "Matador",
        "Merry Andy", "Midas Mask", "Mime", "Mr. Bones", "Onyx Agate", "Oops! All 6s", "Pareidolia", "Ramen", "Rocket", "Rough Gem",
        "Satellite", "Seeing Double", "Seltzer", "Showman", "Sixth Sense", "Smeared Joker", "Sock and Buskin", "Space Joker", "Steel Joker",
        "The Idol", "Throwback", "To the Moon", "Trading Card", "Troubadour",
        "Turtle Bean", "Vampire",
        # FNAF
        "8-Bit Baby", "Black Ice Frostbear", "Clown Springtrap", "The Curse", "DJ Music Man",
        "Flaming Springtrap", "Grim Foxy", "High Score Toy Chica", "Jack o’ Bonnie", "Jack o’ Chica",
        "Lolbit", "Melted Chocolate Bonnie", "Nightmare", "Nightmare BB", "Nightmare Fredbear",
        "Nightmare Mangle", "Nightmarionne", "Phone Guy", "Security Puppet", "Shadow Bonnie",
        "Shadow Freddy", "System Error Toy Bonnie", "Toxic Springtrap", "Twisted Bonnie", "Twisted Chica",
        "Twisted Foxy", "Twisted Freddy", "Twisted Wolf", "Vannessa", "VR Toy Freddy",
        # Minecraft
        "Alex", "Axolotl (Blue)", "Bogged", "Breeze", "Creeper", "Enderman", "Fox (Arctic)", "Ghast", "Ghastling", "Giant", "Guardian",
        "Happy Ghast", "Mooshroom", "Piglin Brute", "Ravager", "Shulker", "Skeleton Horse", "Sniffer", "Snow Golem", "Spider Jockey", "Steve",
        "Vex", "Wither Skeleton", "Zoglin", "Zombie Horse", "Zombie Pigman",
        # Sonic
        "Amy Rose", "Blaze the Cat", "Dr. Ivo \"Eggman\" Robotnik", "Espio the Chameleon", "E-123 Omega", "Knuckles the Echidna",
        "Maria Robotnik", "Metal Knuckles", "Metal Sonic", "Miles \"Tails\" Prower", "Rouge the Bat", "Sally Acorn", "Shadow the Hedgehog",
        "Silver the Hedgehog", "Sonic the Hedgehog", "Vector the Crocodile",
        # Team Fortress 2
        "Merasmus", "Miss Pauling",
        # Undertale
        "Alphys", "Asgore Dreemurr", "Asriel Dreemurr", "Flowey", "Frisk", "Mettaton", "Muffet", "Papyrus", "Sans", "So Sorry", "Toriel",
        "Undyne"
    ],
    'inusual': [
        # Balatro
        "Cavendish", "Cloud 9", "Erosion", "Gift Card", "Golden Ticket",
        "Gros Michel", "Hack", "Hanging Chad", "Joker", "Marble Joker",
        "Photograph", "Riff-Raff", "Séance", "Shoot the Moon", "Shortcut",
        "Spare Trousers", "Splash", "Stone Joker", "Supernova",
        # FNAF
        "Aeronaut Toy Freddy", "Arctic Ballora", "Big Bad Foxy", "Black Heart Bonnie", "Blacklight Bonnie",
        "Blacklight Chica", "Blacklight Foxy", "Blacklight Freddy", "Boiler Baby", "Bonnet",
        "Boulder Toy Bonnie", "Burnt Foxy", "Candy Cadet", "Captain Foxy", "Catrina Toy Chica",
        "Clockwork Ballora", "Dark Water Endo", "Easter Bonnie", "El Chip", "Firework Freddy",
        "Flamethrower Bare Endo", "Freddles", "Freddy Frostbear", "Frost Plushtrap", "Frostbite Balloon Boy",
        "Hand Unit", "Heartsick Baby", "Helpy", "Jetpack Balloon Boy", "JJ",
        "Liberty Chica", "Little Red Chica", "Magician Mangle", "Music Man", "Neon Bonnie",
        "Neon Chica", "Nightmare Bonnie", "Nightmare Chica", "Nightmare Foxy", "Nightmare Freddy",
        "Piranha Plushtrap", "Plushtrap", "Radioactive Foxy", "Ringmaster Foxy", "Scorching Chica",
        "Serpent Mangle", "Shamrock Freddy", "Swamp Balloon Boy", "Sunken Toy Bonnie", "Woodland Toy Freddy",
        "Yenndo"
        # Minecraft
        "Armadillo", "Axolotl", "Blaze", "Camel", "Cave Spider", "Endermite",
        "Fox", "Frog", "Glow Squid", "Goat", "Hoglin", "Husk",
        "Llama", "Magma Cube", "Mule", "Ocelot", "Panda", "Parrot",
        "Phantom", "Pillager", "Polar Bear", "Silverfish", "Stray", "Strider",
        "Tadpole", "Trader Llama", "Turtle", "Vindicator", "Wandering Trader",
        "Wither", "Zombie Villager",
        # Sonic
        "Amy Rose (Sonic Boom)", "Big the Cat", "Chaos", "Charmy Bee", "Chip",
        "Classic Amy", "Classic Knuckles", "Classic Metal Sonic", "Classic Robotnik",
        "Classic Sonic", "Classic Tails", "Cream the Rabbit", "Dr. Eggman (Sonic Boom)",
        "Fang the Sniper", "Honey the Cat", "Jet the Hawk", "Knuckles (Sonic Boom)",
        "Lyric", "Marine the Raccoon", "Mighty the Armadillo", "Mother Wisp", "Nega-Mother Wisp",
        "Princess Elise the 3rd", "Professor Gerald Robotnik", "Ray the Flying Squirrel",
        "Shadow (Sonic Boom)", "Sonic (Sonic Boom)", "Sticks the Badger", "Storm the Albatross",
        "Tails (Sonic Boom)", "Tikal the Echidna", "Trip the Sungazer", "Vanilla the Rabbit",
        "Vector (Sonic Boom)", "Wave the Swallow", "Yacker the Wisp",
        # Team Fortress 2
        "Demoman (RED)", "Engineer (RED)", "Heavy (RED)", "Medic (RED)", "Pyro (RED)", "Scout (RED)",
        "Sniper (RED)", "Soldier (RED)", "Spy (RED)",
        # Undertale
        "Bird that carries you over a disproportionately small gap", "Bratty and Catty",
        "Burgerpants", "Dogamy and Dogaressa", "Endogeny", "Glyde", "Gerson", "Greater Dog",
        "Grillby", "Gyftrot", "Heats Flamesman", "Lemon Bread", "Lesser Dog",
        "Mad Dummy", "Memoryhead", "Monster Kid", "Napstablook", "Nice Cream Guy",
        "Reaper Bird", "River Person", "Royal Guards", "Snowdin Shopkeeper",
        "Snowdrake's Mother", "Temmie", "Temmie Shopkeeper"
    ],
    'común': [
        # Balatro
        "8 Ball", "Abstract Joker", "Banner", "Blue Joker", "Business Card",
        "Chaos the Clown", "Clever Joker", "Crafty Joker", "Crazy Joker",
        "Credit Card", "Delayed Gratification", "Devious Joker", "Droll Joker",
        "Drunkard", "Egg", "Even Steven", "Faceless Joker", "Fortune Teller",
        "Gluttonous Joker", "Golden Joker", "Greedy Joker", "Green Joker",
        "Half Joker", "Hallucination", "Ice Cream", "Jolly Joker", "Juggler",
        "Lusty Joker", "Mad Joker", "Mail-In Rebate", "Misprint", "Mystic Summit",
        "Odd Todd", "Popcorn", "Raised Fist", "Red Card", "Reserved Parking",
        "Ride the Bus", "Runner", "Scary Face", "Scholar", "Sly Joker",
        "Smiley Face", "Square Joker", "Superposition", "Swashbuckler",
        "To Do List", "Walkie Talkie", "Wily Joker", "Wrathful Joker", "Zany Joker",
        # FNAF
        "Balloon Boy", "Ballora", "Bidybab", "Bon Bon", "Bonnie the Bunny",
        "Bucket Bob", "Chica the Chicken", "Chocolate Bonnie", "Electrobab", "Endo-01",
        "Endo-02", "Foxy the Pirate Fox", "Freddy Fazbear", "Funtime Chica", "Funtime Foxy",
        "Funtime Freddy", "Glamrock Chica", "Glamrock Endo", "Glamrock Freddy", "Happy Frog",
        "Mangle", "Map Bot", "Minireenas", "Montgomery Gator", "Moondrop",
        "Mr. Can-do", "Mr. Hippo", "Mr. Hugs", "Nedd Bear", "Nightmare Endo",
        "No. 1 Crate", "Orville Elephant", "Pan Stan", "Phantom BB", "Phantom Chica",
        "Phantom Foxy", "Phantom Mangle", "Phantom Puppet", "Pigpatch", "Rockstar Bonnie",
        "Rockstar Chica", "Rockstar Foxy", "Rockstar Freddy", "Roxanne Wolf", "Sunrise",
        "Toy Bonnie", "Toy Chica", "Toy Freddy", "Wet Floor Bot", "Withered Bonnie",
        "Withered Chica", "Withered Foxy", "Withered Freddy",
        # Minecraft
        "Ari (skin)", "Bat", "Bee", "Cat", "Chicken", "Cod", "Cow",
        "Dolphin", "Donkey", "Drowned", "Efe (skin)", "Horse", "Kai (skin)",
        "Makena (skin)", "Noor (skin)", "Pig", "Piglin", "Pufferfish",
        "Rabbit", "Salmon", "Sheep", "Skeleton", "Slime", "Spider",
        "Squid", "Sunny (skin)", "Tamed Wolf", "Tropical Fish", "Villager",
        "Wolf", "Zombie", "Zombified Piglin", "Zuri (skin)",
        # Sonic
        "Avatar (Sonic Forces)", "Bark the Polar Bear", "Bean the Dynamite", "Black Bomb Wisp",
        "Blue Cube Wisp", "Cheese", "Crimson Eagle Wisp", "Cubot", "Cyan Laser Wisp",
        "Dr. Gerald Robotnik", "E-100 Alpha", "E-101 Beta", "E-102 Gamma", "Froggy",
        "Gray Quake Wisp", "Green Hover Wisp", "Indigo Asteroid Wisp", "Ivory Lightning Wisp",
        "Jade Ghost Wisp", "King Boom Boo", "Magenta Rhythm Wisp", "Master Zik",
        "Mecha Knuckles", "Mecha Sonic", "Omochao", "Orange Rocket Wisp", "Orbot",
        "Pachacamac", "Pink Spike Wisp", "Purple Frenzy Wisp", "Red Burst Wisp",
        "Sage", "Sonic the Werehog", "Tails Doll", "Violet Void Wisp",
        "Yellow Drill Wisp", "Zavok", "Zazz", "Zeena", "Zomon", "Zor",
        # Team Fortress 2
        "Demoman (BLU)", "Engineer (BLU)", "Heavy (BLU)", "Medic (BLU)", "Pyro (BLU)", "Scout (BLU)",
        "Sniper (BLU)", "Soldier (BLU)", "Spy (BLU)",
        # Undertale
        "Aaron", "Annoying Dog", "Astigmatism", "Chilldrake", "Doggo", "Dummy",
        "Final Froggit", "Froggit", "Ice Cap", "Jerry", "Knight Knight", "Loox",
        "Madjick", "Migosp", "Migospel", "Moldbygg", "Moldessa", "Moldsmal",
        "Onionsan", "Parsnik", "Pyrope", "Shyren", "Snowdrake", "Tsunderplane",
        "Vegetoid", "Vulkin", "Whimsalot", "Whimsun", "Woshu"
    ]
}
# Lista total de cartas
CARDS = [c for group in RARITY_CARDS.values() for c in group]

PACK_SIZE = 3
BIG_PACK_SIZE = 10
DAILY_REWARD = 437
PACK_COST = 75
BIG_PACK_COST = 200


def clear_space():
    print("\n" * 50)


def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
    else:
        data = {'coins': 0, 'cards': {}, 'last_free_pack': None, 'last_daily_reward': None}
    for card in CARDS:
        data['cards'].setdefault(card, 0)
    obsolete = [c for c in data['cards'] if c not in CARDS]
    for c in obsolete:
        del data['cards'][c]
    return data


def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)


def can_claim_today(last_date_str):
    if not last_date_str:
        return True
    last = datetime.fromisoformat(last_date_str).date()
    return last < date.today()


def choose_card_by_rarity():
    rarities = list(RARITY_WEIGHTS.keys())
    weights = [RARITY_WEIGHTS[r] for r in rarities]
    rarity = random.choices(rarities, weights=weights, k=1)[0]
    card = random.choice(RARITY_CARDS[rarity])
    return card, rarity


def open_pack(data, free=False, size=PACK_SIZE, cost=PACK_COST):
    clear_space()
    if free:
        data['last_free_pack'] = date.today().isoformat()
        print(f"{CYAN}Abriendo sobre gratuito...{RESET}\n")
    else:
        data['coins'] -= cost
        print(f"{CYAN}Abriendo sobre comprado...{RESET}\n")

    rarity_colors = {
        'legendaria': ORANGE,
        'epica': MAGENTA,
        'épica': MAGENTA,
        'rara': RED,
        'inusual': GREEN,
        'comun': GRAY,
        'común': GRAY
    }

    for _ in range(size):
        card, rarity = choose_card_by_rarity()
        prev_count = data['cards'][card]
        data['cards'][card] = prev_count + 1
        color = rarity_colors.get(rarity, RESET)
        suffix = f" {YELLOW}Nuevo!{RESET}" if prev_count == 0 else ""
        print(f" {GREEN}> Obtuviste: {color}{card}{RESET}{suffix}")


def claim_daily_reward(data):
    clear_space()
    data['coins'] += DAILY_REWARD
    data['last_daily_reward'] = date.today().isoformat()
    print(f"{YELLOW}¡Has recibido {DAILY_REWARD} monedas como recompensa diaria!{RESET}\n")


def buy_pack(data):
    clear_space()
    if data['coins'] < PACK_COST:
        print(f"{RED}No tienes suficientes monedas ({PACK_COST}) para comprar un sobre.{RESET}\n")
        return
    open_pack(data)

def open_pack(data, free=False, pack_size=3, pack_cost=75):
    clear_space()
    if free:
        data['last_free_pack'] = date.today().isoformat()
        print(f"{CYAN}Abriendo sobre gratuito...{RESET}\n")
    else:
        data['coins'] -= pack_cost
        print(f"{CYAN}Abriendo sobre comprado...{RESET}\n")

    rarity_colors = {
        'legendaria': ORANGE,
        'épica': MAGENTA,
        'rara': RED,
        'inusual': GREEN,
        'común': GRAY
    }

    for _ in range(pack_size):
        card, rarity = choose_card_by_rarity()
        prev_count = data['cards'][card]
        data['cards'][card] = prev_count + 1
        color = rarity_colors.get(rarity, RESET)
        suffix = f" {YELLOW}Nuevo!{RESET}" if prev_count == 0 else ""
        print(f" {GREEN}> Obtuviste: {color}{card}{RESET}{suffix}")

def buy_big_pack(data):
    BIG_PACK_COST = 250
    BIG_PACK_SIZE = 10
    clear_space()
    if data['coins'] < BIG_PACK_COST:
        print(f"{RED}No tienes suficientes monedas ({BIG_PACK_COST}) para comprar un sobre grande.{RESET}\n")
        return
    open_pack(data, free=False, pack_size=BIG_PACK_SIZE, pack_cost=BIG_PACK_COST)


def view_cards(data):
    clear_space()
    total = len(CARDS)
    owned = sum(1 for cnt in data['cards'].values() if cnt > 0)
    print(f"{MAGENTA}Tus cartas:")

    plural_map = {
        'legendaria': 'Legendarias',
        'épica': 'Épicas',
        'rara': 'Raras',
        'inusual': 'Inusuales',
        'común': 'Comunes'
    }

    # Colores por rareza para títulos
    title_colors = {
        'legendaria': ORANGE,
        'épica': MAGENTA,
        'rara': RED,
        'inusual': GREEN,
        'común': GRAY
    }

    for rarity, cards in RARITY_CARDS.items():
        label = plural_map.get(rarity, rarity.capitalize())
        owned_group = sum(1 for c in cards if data['cards'].get(c, 0) > 0)
        color = title_colors.get(rarity, RESET)
        print(f"\n{color}{label} ({owned_group}/{len(cards)}):{RESET}")
        for card in cards:
            count = data['cards'].get(card, 0)
            if count > 0:
                print(f" - {card}: {count}")
    print(f"\n{MAGENTA}Tienes {owned}/{total} cartas coleccionadas.{RESET}\n")

def sell_duplicates(data):
    clear_space()
    total_gain = 0
    sold = 0
    for rarity, cards in RARITY_CARDS.items():
        for card in cards:
            cnt = data['cards'][card]
            if cnt > 1:
                duplicates = cnt - 1
                price = SELL_PRICE_RARITY[rarity]
                gain = duplicates * price
                total_gain += gain
                sold += duplicates
                data['cards'][card] = 1
    if sold == 0:
        print(f"{RED}No tienes cartas repetidas para vender.{RESET}\n")
    else:
        data['coins'] += total_gain
        print(f"{YELLOW}Has vendido {sold} cartas repetidas y ganado {total_gain} monedas.{RESET}\n")


def grant_infinite(data):
    clear_space()
    data['coins'] = 999999
    print(f"{CYAN}¡Tienes ahora {data['coins']} monedas! Dinero infinito activado.{RESET}\n")


def reset_daily(data):
    clear_space()
    data['last_free_pack'] = None
    data['last_daily_reward'] = None
    save_data(data)
    print(f"{CYAN}Se han reiniciado las recompensas diarias. Ahora puedes reclamar nuevamente.{RESET}\n")


def reset_all_data(data):
    clear_space()
    data['coins'] = 0
    data['cards'] = {card: 0 for card in CARDS}
    data['last_free_pack'] = None
    data['last_daily_reward'] = None
    save_data(data)
    print(f"{CYAN}Se han reiniciado todos los datos del jugador. ¡A empezar de nuevo!{RESET}\n")

def unlock_all_cards(data):
    clear_space()
    for card in [c for group in RARITY_CARDS.values() for c in group]:
        data['cards'][card] = 1
    print(f"{GREEN}¡Todas las cartas han sido desbloqueadas!{RESET}\n")


def main():
    data = load_data()
    while True:
        print(f"\n{YELLOW}==== Juego de Cartas Coleccionables de Videojuegos ===={RESET}")
        print(f"{GREEN}Monedas: {data['coins']}{RESET}")
        print(f"{CYAN}1. Abrir sobre diario gratis{RESET}")
        print(f"{CYAN}2. Reclamar recompensa diaria ({DAILY_REWARD} monedas){RESET}")
        print(f"{CYAN}3. Comprar un sobre ({PACK_COST} monedas){RESET}")
        print(f"{CYAN}4. Comprar sobre grande (250 monedas, 10 cartas){RESET}")
        print(f"{CYAN}5. Ver tus cartas{RESET}")
        print(f"{CYAN}6. Vender cartas repetidas{RESET}")
        print(f"{CYAN}7. Salir{RESET}")
        print(f"{MAGENTA}DEV 8. Resetear recompensas diarias{RESET}")
        print(f"{MAGENTA}DEV 9. Resetear datos del jugador{RESET}")
        print(f"{MAGENTA}DEV 10. Dinero infinito{RESET}")
        print(f"{MAGENTA}DEV 11. Desbloquear todas las cartas{RESET}")
        choice = input(f"{BLUE}Elige una opci\u00f3n: {RESET}")

        if choice == '1':
            if can_claim_today(data['last_free_pack']):
                open_pack(data, free=True)
            else:
                clear_space()
                print(f"{RED}Ya has abierto el sobre diario de hoy.{RESET}")
        elif choice == '2':
            if can_claim_today(data['last_daily_reward']):
                claim_daily_reward(data)
            else:
                clear_space()
                print(f"{RED}Ya has reclamado tu recompensa diaria de hoy.{RESET}")
        elif choice == '3':
            buy_pack(data)
        elif choice == '4':
            buy_big_pack(data)
        elif choice == '5':
            view_cards(data)
        elif choice == '6':
            sell_duplicates(data)
        elif choice == '7':
            save_data(data)
            clear_space()
            print(f"{GREEN}\u00a1Hasta luego!{RESET}")
            break
        elif choice == '8':
            reset_daily(data)
        elif choice == '9':
            reset_all_data(data)
        elif choice == '10':
            grant_infinite(data)
        elif choice == '11':
            unlock_all_cards(data)
        else:
            clear_space()
            print(f"{RED}Opci\u00f3n no v\u00e1lida. Int\u00e9ntalo de nuevo.{RESET}")

if __name__ == '__main__':
    clear_space()
    main()



