import tkinter as tk
from tkinter import messagebox
import random


class TestAmistadPsicologico:
    def __init__(self, root):
        self.root = root
        self.root.title("Test de amistad")
        self.root.geometry("900x620")
        self.root.resizable(False, False)

        self.score = 0
        self.unease = 0
        self.current = "start"
        self.history = []

        self.profile = {
            "distance": 0,
            "control": 0,
            "emptiness": 0,
            "hostility": 0,
            "contradiction": 0,
            "compatibility": 0
        }

        self.radio_value = None
        self.entry = None

        self.questions = self.build_questions()

        self.show_intro()

    def build_questions(self):
        return {
            "start": {
                "title": "Primera impresión",
                "text": "Estás conociendo a alguien por primera vez. ¿Qué haces normalmente?",
                "answers": [
                    {
                        "text": "Observo un poco y luego hablo",
                        "score": 3,
                        "unease": 0,
                        "profile": {"compatibility": 2},
                        "next": "humor"
                    },
                    {
                        "text": "Hablo con naturalidad",
                        "score": 2,
                        "unease": 0,
                        "profile": {"compatibility": 1},
                        "next": "humor"
                    },
                    {
                        "text": "Me cuesta abrirme",
                        "score": 1,
                        "unease": 1,
                        "profile": {"distance": 2},
                        "next": "trust"
                    },
                    {
                        "text": "Normalmente no quiero conocer a nadie",
                        "score": -3,
                        "unease": 2,
                        "profile": {"distance": 3, "emptiness": 1},
                        "next": "distance_soft"
                    }
                ]
            },

            "humor": {
                "title": "Humor",
                "text": "¿Qué tipo de humor te resulta más cómodo?",
                "answers": [
                    {
                        "text": "Humor absurdo, memes y referencias raras",
                        "score": 5,
                        "unease": 0,
                        "profile": {"compatibility": 3},
                        "next": "likes"
                    },
                    {
                        "text": "Humor tranquilo",
                        "score": 2,
                        "unease": 0,
                        "profile": {"compatibility": 1},
                        "next": "likes"
                    },
                    {
                        "text": "No me gusta demasiado que la gente bromee",
                        "score": -2,
                        "unease": 2,
                        "profile": {"distance": 2},
                        "next": "serious_soft"
                    },
                    {
                        "text": "Me resulta irritante",
                        "score": -4,
                        "unease": 3,
                        "profile": {"hostility": 2, "distance": 1},
                        "next": "serious_soft"
                    }
                ]
            },

            "likes": {
                "title": "Gustos",
                "text": "¿Cuál de estos planes te representa más?",
                "answers": [
                    {
                        "text": "Jugar a videojuegos tranquilamente",
                        "score": 5,
                        "unease": 0,
                        "profile": {"compatibility": 3},
                        "next": "nostalgia"
                    },
                    {
                        "text": "Ver vídeos, memes o hablar por Discord",
                        "score": 4,
                        "unease": 0,
                        "profile": {"compatibility": 2},
                        "next": "nostalgia"
                    },
                    {
                        "text": "Salir todo el rato y hacer muchos planes",
                        "score": -1,
                        "unease": 1,
                        "profile": {"control": 1},
                        "next": "social_soft"
                    },
                    {
                        "text": "No tengo un plan favorito",
                        "score": -2,
                        "unease": 2,
                        "profile": {"emptiness": 2},
                        "next": "empty_soft"
                    }
                ]
            },

            "nostalgia": {
                "title": "Nostalgia",
                "text": "¿Qué relación tienes con la nostalgia?",
                "answers": [
                    {
                        "text": "Me gusta mucho recordar épocas pasadas",
                        "score": 5,
                        "unease": 0,
                        "profile": {"compatibility": 3},
                        "next": "trust"
                    },
                    {
                        "text": "Me gusta, pero sin obsesionarme",
                        "score": 2,
                        "unease": 0,
                        "profile": {"compatibility": 1},
                        "next": "trust"
                    },
                    {
                        "text": "No me dice demasiado",
                        "score": 0,
                        "unease": 1,
                        "profile": {"distance": 1},
                        "next": "trust"
                    },
                    {
                        "text": "Mirar al pasado me parece inútil",
                        "score": -4,
                        "unease": 3,
                        "profile": {"hostility": 1, "distance": 2},
                        "next": "memory_soft"
                    }
                ]
            },

            "trust": {
                "title": "Confianza",
                "text": "Si un amigo tarda en responder, ¿qué haces?",
                "answers": [
                    {
                        "text": "Lo entiendo, cada persona tiene su ritmo",
                        "score": 5,
                        "unease": 0,
                        "profile": {"compatibility": 3},
                        "next": "final_normal_text"
                    },
                    {
                        "text": "Pregunto si está bien, pero sin presionar",
                        "score": 4,
                        "unease": 0,
                        "profile": {"compatibility": 2},
                        "next": "final_normal_text"
                    },
                    {
                        "text": "Me molesta, aunque intento no decirlo",
                        "score": -2,
                        "unease": 2,
                        "profile": {"control": 2, "contradiction": 1},
                        "next": "control_soft"
                    },
                    {
                        "text": "Si no contesta, dejo de hablarle",
                        "score": -5,
                        "unease": 4,
                        "profile": {"control": 3, "hostility": 2},
                        "next": "control_soft"
                    }
                ]
            },

            "distance_soft": {
                "title": "Distancia",
                "text": "Entonces, ¿por qué estás haciendo este test?",
                "answers": [
                    {
                        "text": "Por curiosidad",
                        "score": 0,
                        "unease": 1,
                        "profile": {"contradiction": 1},
                        "next": "likes"
                    },
                    {
                        "text": "No lo sé exactamente",
                        "score": -1,
                        "unease": 2,
                        "profile": {"emptiness": 2},
                        "next": "empty_soft"
                    },
                    {
                        "text": "Quería ver qué pasaba si respondía mal",
                        "score": -4,
                        "unease": 4,
                        "profile": {"contradiction": 3, "hostility": 1},
                        "next": "contradiction_mid"
                    }
                ]
            },

            "serious_soft": {
                "title": "Ajuste",
                "text": "Está bien. No todo el mundo conecta con el mismo humor.",
                "answers": [
                    {
                        "text": "Exacto, solo tengo otro tipo de humor",
                        "score": 1,
                        "unease": 0,
                        "profile": {"compatibility": 1},
                        "next": "likes"
                    },
                    {
                        "text": "Me molesta cuando alguien insiste demasiado",
                        "score": -2,
                        "unease": 2,
                        "profile": {"distance": 2, "control": 1},
                        "next": "control_soft"
                    },
                    {
                        "text": "A veces prefiero que la gente se calle",
                        "score": -4,
                        "unease": 4,
                        "profile": {"hostility": 3},
                        "next": "hostility_mid"
                    }
                ]
            },

            "social_soft": {
                "title": "Ritmo",
                "text": "¿Te molestaría tener un amigo más casero?",
                "answers": [
                    {
                        "text": "No, lo respetaría",
                        "score": 4,
                        "unease": 0,
                        "profile": {"compatibility": 2},
                        "next": "trust"
                    },
                    {
                        "text": "Intentaría que saliera más",
                        "score": -1,
                        "unease": 2,
                        "profile": {"control": 2},
                        "next": "control_soft"
                    },
                    {
                        "text": "No creo que pudiera aguantarlo",
                        "score": -4,
                        "unease": 4,
                        "profile": {"hostility": 2, "control": 2},
                        "next": "hostility_mid"
                    }
                ]
            },

            "empty_soft": {
                "title": "Pausa",
                "text": "Has elegido varias respuestas poco concretas. No pasa nada. A veces cuesta elegir.",
                "answers": [
                    {
                        "text": "Sí, simplemente me cuesta decidir",
                        "score": 1,
                        "unease": 1,
                        "profile": {"contradiction": 1},
                        "next": "trust"
                    },
                    {
                        "text": "No siento que ninguna opción encaje",
                        "score": -2,
                        "unease": 3,
                        "profile": {"emptiness": 3},
                        "next": "empty_mid"
                    },
                    {
                        "text": "Las preguntas no importan mucho",
                        "score": -4,
                        "unease": 4,
                        "profile": {"emptiness": 2, "hostility": 1},
                        "next": "empty_mid"
                    }
                ]
            },

            "memory_soft": {
                "title": "Memoria",
                "text": "Aun así, todo el mundo conserva algo. Una canción. Un juego. Una conversación.",
                "answers": [
                    {
                        "text": "Sí, supongo que algo sí",
                        "score": 2,
                        "unease": 0,
                        "profile": {"compatibility": 1},
                        "next": "trust"
                    },
                    {
                        "text": "Prefiero no pensar en eso",
                        "score": -2,
                        "unease": 3,
                        "profile": {"distance": 2, "emptiness": 1},
                        "next": "distance_mid"
                    },
                    {
                        "text": "No hay nada que conservar",
                        "score": -5,
                        "unease": 5,
                        "profile": {"emptiness": 4},
                        "next": "empty_mid"
                    }
                ]
            },

            "control_soft": {
                "title": "Control",
                "text": "Cuando alguien no actúa como esperas, ¿te cuesta aceptarlo?",
                "answers": [
                    {
                        "text": "A veces, pero intento entenderlo",
                        "score": 2,
                        "unease": 1,
                        "profile": {"compatibility": 1},
                        "next": "trust_repair"
                    },
                    {
                        "text": "Sí, me cuesta bastante",
                        "score": -2,
                        "unease": 3,
                        "profile": {"control": 3},
                        "next": "control_mid"
                    },
                    {
                        "text": "Si alguien me importa, debería actuar de cierta forma",
                        "score": -5,
                        "unease": 5,
                        "profile": {"control": 4, "hostility": 1},
                        "next": "control_mid"
                    }
                ]
            },

            "trust_repair": {
                "title": "Reajuste",
                "text": "Eso suena más razonable. ¿Te resulta fácil pedir perdón?",
                "answers": [
                    {
                        "text": "Sí, si me doy cuenta de que he fallado",
                        "score": 4,
                        "unease": -2,
                        "profile": {"compatibility": 3},
                        "next": "final_normal_text"
                    },
                    {
                        "text": "Me cuesta, pero lo intento",
                        "score": 2,
                        "unease": -1,
                        "profile": {"compatibility": 1},
                        "next": "final_normal_text"
                    },
                    {
                        "text": "No suelo pedir perdón",
                        "score": -3,
                        "unease": 4,
                        "profile": {"hostility": 2, "control": 2},
                        "next": "hostility_mid"
                    }
                ]
            },

            "distance_mid": {
                "title": "La distancia",
                "text": "Has marcado distancia varias veces. El test está intentando calcular si es timidez o rechazo.",
                "answers": [
                    {
                        "text": "Es timidez",
                        "score": 1,
                        "unease": 1,
                        "profile": {"distance": 1},
                        "next": "quiet_horror"
                    },
                    {
                        "text": "Es rechazo",
                        "score": -4,
                        "unease": 5,
                        "profile": {"distance": 3, "hostility": 2},
                        "next": "hostility_mid"
                    },
                    {
                        "text": "No lo sé",
                        "score": -2,
                        "unease": 4,
                        "profile": {"emptiness": 2, "contradiction": 2},
                        "next": "empty_mid"
                    }
                ]
            },

            "control_mid": {
                "title": "Patrón",
                "text": "Hay una repetición: esperas cercanía, pero castigas la distancia.",
                "answers": [
                    {
                        "text": "Eso no es verdad",
                        "score": -2,
                        "unease": 4,
                        "profile": {"contradiction": 3},
                        "next": "contradiction_mid"
                    },
                    {
                        "text": "Puede que sea verdad",
                        "score": 1,
                        "unease": 2,
                        "profile": {"compatibility": 1},
                        "next": "quiet_horror"
                    },
                    {
                        "text": "No quiero responder a eso",
                        "score": -3,
                        "unease": 5,
                        "profile": {"distance": 2, "control": 2},
                        "next": "control_late"
                    }
                ]
            },

            "hostility_mid": {
                "title": "Tono",
                "text": "Algunas respuestas tienen una dureza que no estaba al principio.",
                "answers": [
                    {
                        "text": "Solo estoy siendo sincero",
                        "score": -1,
                        "unease": 3,
                        "profile": {"hostility": 2},
                        "next": "hostility_late"
                    },
                    {
                        "text": "Quizá he exagerado",
                        "score": 2,
                        "unease": -1,
                        "profile": {"compatibility": 2},
                        "next": "trust_repair"
                    },
                    {
                        "text": "Me da igual cómo suene",
                        "score": -5,
                        "unease": 6,
                        "profile": {"hostility": 4},
                        "next": "hostility_late"
                    }
                ]
            },

            "empty_mid": {
                "title": "Hueco",
                "text": "Cuanto menos eliges, más fácil resulta que el test elija por ti.",
                "answers": [
                    {
                        "text": "No quiero que el test elija por mí",
                        "score": -1,
                        "unease": 3,
                        "profile": {"control": 1, "contradiction": 2},
                        "next": "contradiction_mid"
                    },
                    {
                        "text": "Me da igual",
                        "score": -4,
                        "unease": 6,
                        "profile": {"emptiness": 4},
                        "next": "empty_late"
                    },
                    {
                        "text": "No sé qué debería elegir",
                        "score": -2,
                        "unease": 4,
                        "profile": {"emptiness": 2},
                        "next": "quiet_horror"
                    }
                ]
            },

            "contradiction_mid": {
                "title": "Contradicción",
                "text": "Tus respuestas se corrigen unas a otras. Eso no impide terminar el test, pero cambia el resultado.",
                "answers": [
                    {
                        "text": "Estoy cambiando de opinión",
                        "score": 1,
                        "unease": 1,
                        "profile": {"compatibility": 1},
                        "next": "quiet_horror"
                    },
                    {
                        "text": "Estoy probando el sistema",
                        "score": -4,
                        "unease": 5,
                        "profile": {"contradiction": 4},
                        "next": "contradiction_late"
                    },
                    {
                        "text": "No hay contradicción",
                        "score": -2,
                        "unease": 4,
                        "profile": {"contradiction": 3},
                        "next": "contradiction_late"
                    }
                ]
            },

            "quiet_horror": {
                "title": "Silencio",
                "text": "El test se queda unos segundos en silencio. No por error. Solo está ajustando las preguntas.",
                "answers": [
                    {
                        "text": "Continuar",
                        "score": 0,
                        "unease": 2,
                        "profile": {},
                        "next": "route_by_profile"
                    },
                    {
                        "text": "Prefiero acabar ya",
                        "score": -2,
                        "unease": 4,
                        "profile": {"distance": 2},
                        "next": "route_by_profile"
                    },
                    {
                        "text": "Esto ya no parece un test de amistad",
                        "score": -1,
                        "unease": 3,
                        "profile": {"contradiction": 2},
                        "next": "route_by_profile"
                    }
                ]
            },

            "control_late": {
                "title": "Permiso",
                "text": "Si el test te ofreciera una salida, ¿la usarías o esperarías a ver qué quiere preguntarte?",
                "answers": [
                    {
                        "text": "Usaría la salida",
                        "score": -1,
                        "unease": 3,
                        "profile": {"distance": 2},
                        "next": "ending_distance"
                    },
                    {
                        "text": "Esperaría",
                        "score": -3,
                        "unease": 5,
                        "profile": {"control": 3},
                        "next": "ending_control"
                    },
                    {
                        "text": "No necesito permiso de un test",
                        "score": -4,
                        "unease": 5,
                        "profile": {"hostility": 2, "control": 2},
                        "next": "ending_control"
                    }
                ]
            },

            "hostility_late": {
                "title": "Respuesta",
                "text": "No hace falta que elijas la opción más fría. Pero sigues encontrándola.",
                "answers": [
                    {
                        "text": "Porque es la más sincera",
                        "score": -5,
                        "unease": 6,
                        "profile": {"hostility": 4},
                        "next": "ending_hostility"
                    },
                    {
                        "text": "No me había dado cuenta",
                        "score": 1,
                        "unease": 1,
                        "profile": {"compatibility": 1},
                        "next": "ending_uncertain"
                    },
                    {
                        "text": "El test está exagerando",
                        "score": -2,
                        "unease": 4,
                        "profile": {"contradiction": 2},
                        "next": "contradiction_late"
                    }
                ]
            },

            "empty_late": {
                "title": "Ausencia",
                "text": "Hay respuestas que no dicen nada, pero pesan más que las demás.",
                "answers": [
                    {
                        "text": "No sé qué quieres de mí",
                        "score": -3,
                        "unease": 5,
                        "profile": {"emptiness": 3},
                        "next": "ending_empty"
                    },
                    {
                        "text": "Solo quiero terminar",
                        "score": -2,
                        "unease": 4,
                        "profile": {"distance": 2},
                        "next": "ending_distance"
                    },
                    {
                        "text": "No siento nada raro",
                        "score": -4,
                        "unease": 6,
                        "profile": {"emptiness": 4, "contradiction": 1},
                        "next": "ending_empty"
                    }
                ]
            },

            "contradiction_late": {
                "title": "Registro",
                "text": "El test no necesita saber qué respuesta es verdadera. Solo necesita saber cuál repites.",
                "answers": [
                    {
                        "text": "Eso no tiene sentido",
                        "score": -2,
                        "unease": 4,
                        "profile": {"contradiction": 3},
                        "next": "ending_contradiction"
                    },
                    {
                        "text": "He estado respondiendo al azar",
                        "score": -4,
                        "unease": 6,
                        "profile": {"contradiction": 4, "emptiness": 1},
                        "next": "ending_contradiction"
                    },
                    {
                        "text": "Quiero una pregunta normal",
                        "score": 0,
                        "unease": 2,
                        "profile": {"compatibility": 1},
                        "next": "final_distorted_text"
                    }
                ]
            },

            "final_normal_text": {
                "title": "Pregunta final",
                "text": "Escribe algo que te guste mucho: videojuego, saga, youtuber, meme, película o plan favorito.",
                "type": "text",
                "next": "result_normal"
            },

            "final_distorted_text": {
                "title": "Pregunta final",
                "text": "Escribe algo que te guste. Algo concreto. Algo que no cambie cuando lo mires demasiado.",
                "type": "text",
                "next": "route_by_profile"
            },
        }

    def style(self):
        if self.unease < 4:
            return {
                "bg": "#101018",
                "card": "#202030",
                "text": "#ffffff",
                "muted": "#b8b8c8",
                "accent": "#8b5cf6",
                "button": "#8b5cf6"
            }
        elif self.unease < 8:
            return {
                "bg": "#0d0d14",
                "card": "#1c1b28",
                "text": "#f4f4f5",
                "muted": "#aaa6b8",
                "accent": "#7c3aed",
                "button": "#6d28d9"
            }
        elif self.unease < 13:
            return {
                "bg": "#09090d",
                "card": "#17141c",
                "text": "#f5eeee",
                "muted": "#9b8f96",
                "accent": "#991b1b",
                "button": "#7f1d1d"
            }
        elif self.unease < 18:
            return {
                "bg": "#050507",
                "card": "#130d0f",
                "text": "#ffecec",
                "muted": "#8f6b6b",
                "accent": "#7f1d1d",
                "button": "#450a0a"
            }
        else:
            return {
                "bg": "#020000",
                "card": "#0b0000",
                "text": "#ffdddd",
                "muted": "#6f3b3b",
                "accent": "#991b1b",
                "button": "#300000"
            }

    def clear(self):
        for widget in self.root.winfo_children():
            widget.destroy()

    def add_profile(self, changes):
        for key, value in changes.items():
            self.profile[key] = self.profile.get(key, 0) + value

    def dominant_profile(self):
        horror_keys = ["distance", "control", "emptiness", "hostility", "contradiction"]
        return max(horror_keys, key=lambda k: self.profile.get(k, 0))

    def route_by_profile(self):
        dominant = self.dominant_profile()

        routes = {
            "distance": "control_late" if self.profile["control"] > self.profile["distance"] else "ending_distance",
            "control": "control_late",
            "emptiness": "empty_late",
            "hostility": "hostility_late",
            "contradiction": "contradiction_late"
        }

        return routes.get(dominant, "ending_uncertain")

    def make_button(self, parent, text, command):
        s = self.style()

        return tk.Button(
            parent,
            text=text,
            command=command,
            font=("Segoe UI", 11, "bold"),
            bg=s["button"],
            fg="white",
            activebackground=s["accent"],
            activeforeground="white",
            bd=0,
            padx=24,
            pady=10,
            cursor="hand2"
        )

    def corrupt_text(self, text):
        if self.unease < 13:
            return text

        result = ""
        for char in text:
            if random.random() < 0.025:
                result += random.choice([".", "_", "", " "])
            else:
                result += char

        return result

    def footer(self):
        if self.unease < 5:
            return ""

        if self.unease < 9:
            return random.choice([
                "El test se está ajustando.",
                "Algunas respuestas pesan más que otras.",
                "No hay problema. Todavía."
            ])

        if self.unease < 14:
            return random.choice([
                "Las rutas normales siguen disponibles, aunque menos cerca.",
                "El patrón todavía puede corregirse.",
                "La siguiente pregunta no estaba al principio."
            ])

        return random.choice([
            "Ya no se está midiendo compatibilidad.",
            "Hay respuestas que permanecen aunque vuelvas atrás.",
            "El resultado empezó antes de la última pregunta."
        ])

    def show_intro(self):
        self.clear()
        s = self.style()
        self.root.configure(bg=s["bg"])

        tk.Label(
            self.root,
            text="Test para saber si podrías ser mi amigo",
            font=("Segoe UI", 28, "bold"),
            fg=s["text"],
            bg=s["bg"],
            wraplength=780
        ).pack(pady=(95, 20))

        tk.Label(
            self.root,
            text="Responde con sinceridad. El test se adaptará a tus respuestas.",
            font=("Segoe UI", 13),
            fg=s["muted"],
            bg=s["bg"]
        ).pack(pady=10)

        self.make_button(self.root, "Empezar", self.show_question).pack(pady=40)

    def show_question(self):
        if self.current == "route_by_profile":
            self.current = self.route_by_profile()

        self.clear()
        s = self.style()
        self.root.configure(bg=s["bg"])

        if self.unease < 8:
            self.root.title("Test de amistad")
        elif self.unease < 14:
            self.root.title("Test de amistad - ajustando preguntas")
        else:
            self.root.title("Test de amistad - continuar")

        q = self.questions[self.current]

        top = tk.Frame(self.root, bg=s["bg"])
        top.pack(fill="x", padx=30, pady=(18, 0))

        tk.Label(
            top,
            text=f"Puntuación: {self.score}",
            font=("Segoe UI", 10, "bold"),
            fg=s["muted"],
            bg=s["bg"]
        ).pack(side="right")

        if self.history and self.unease < 14:
            tk.Button(
                top,
                text="← Volver",
                command=self.go_back,
                font=("Segoe UI", 10),
                bg=s["bg"],
                fg=s["muted"],
                activebackground=s["bg"],
                activeforeground=s["text"],
                bd=0,
                cursor="hand2"
            ).pack(side="left")

        card = tk.Frame(self.root, bg=s["card"], width=750, height=420)
        card.pack(pady=35)
        card.pack_propagate(False)

        tk.Label(
            card,
            text=self.corrupt_text(q["title"]),
            font=("Segoe UI", 15, "bold"),
            fg=s["accent"],
            bg=s["card"]
        ).pack(pady=(25, 8))

        tk.Label(
            card,
            text=self.corrupt_text(q["text"]),
            font=("Segoe UI", 17, "bold"),
            fg=s["text"],
            bg=s["card"],
            wraplength=650,
            justify="center"
        ).pack(pady=(5, 25))

        self.radio_value = tk.StringVar()
        self.entry = None

        qtype = q.get("type", "radio")

        if qtype == "radio":
            for answer in q["answers"]:
                rb = tk.Radiobutton(
                    card,
                    text=self.corrupt_text(answer["text"]),
                    variable=self.radio_value,
                    value=answer["text"],
                    font=("Segoe UI", 11),
                    fg=s["text"],
                    bg=s["card"],
                    selectcolor=s["bg"],
                    activebackground=s["card"],
                    activeforeground=s["accent"],
                    cursor="hand2",
                    wraplength=620,
                    justify="left"
                )
                rb.pack(anchor="w", padx=75, pady=5)

        elif qtype == "text":
            self.entry = tk.Entry(
                card,
                font=("Segoe UI", 14),
                width=48,
                bg="#eeeeff" if self.unease < 10 else "#1a0505",
                fg="#111111" if self.unease < 10 else "#ffdddd",
                insertbackground="#111111" if self.unease < 10 else "#ffdddd",
                bd=0
            )
            self.entry.pack(pady=28, ipady=8)

        f = self.footer()
        if f:
            tk.Label(
                self.root,
                text=f,
                font=("Segoe UI", 10, "italic"),
                fg=s["muted"],
                bg=s["bg"]
            ).pack(pady=(0, 10))

        self.make_button(self.root, "Siguiente", self.next_question).pack()

    def next_question(self):
        q = self.questions[self.current]
        qtype = q.get("type", "radio")

        old_state = {
            "current": self.current,
            "score": self.score,
            "unease": self.unease,
            "profile": self.profile.copy()
        }

        if qtype == "radio":
            selected = self.radio_value.get()

            if not selected:
                messagebox.showwarning("Aviso", "Selecciona una respuesta.")
                return

            chosen = None
            for answer in q["answers"]:
                if answer["text"] == selected:
                    chosen = answer
                    break

            self.score += chosen.get("score", 0)
            self.unease += chosen.get("unease", 0)
            self.unease = max(0, self.unease)
            self.add_profile(chosen.get("profile", {}))
            next_id = chosen["next"]

        else:
            text = self.entry.get().strip().lower()

            if not text:
                messagebox.showwarning("Aviso", "Escribe una respuesta.")
                return

            if self.current == "final_normal_text":
                good_words = ["minecraft", "sonic", "rubius", "kakytron", "youtube", "memes", "pizza", "undertale", "deltarune"]
                if any(word in text for word in good_words):
                    self.score += 6
                    self.add_profile({"compatibility": 3})
                else:
                    self.score += 1

                next_id = q["next"]

            elif self.current == "final_distorted_text":
                empty_words = ["nada", "nadie", "vacío", "vacio", "solo", "miedo", "oscuro"]
                if any(word in text for word in empty_words):
                    self.unease += 5
                    self.score -= 3
                    self.add_profile({"emptiness": 3})
                else:
                    self.unease += 2
                    self.score += 1

                next_id = q["next"]

            else:
                next_id = q["next"]

        self.history.append(old_state)

        if next_id == "result_normal":
            if self.unease >= 10:
                self.current = "route_by_profile"
                self.show_question()
            else:
                self.show_normal_result()
            return

        if next_id.startswith("ending_"):
            self.show_horror_ending(next_id)
            return

        self.current = next_id
        self.show_question()

    def go_back(self):
        if not self.history:
            return

        state = self.history.pop()
        self.current = state["current"]
        self.score = state["score"]
        self.unease = state["unease"]
        self.profile = state["profile"]
        self.show_question()

    def show_normal_result(self):
        self.clear()
        s = self.style()
        self.root.configure(bg=s["bg"])
        self.root.title("Test de amistad - resultado")

        if self.score >= 22:
            result = "Sí. Podríamos ser amigos."
            desc = "Tus respuestas encajan bastante bien con mis gustos y mi forma de socializar."
        elif self.score >= 12:
            result = "Podría funcionar."
            desc = "Hay algunas coincidencias, aunque no sería una compatibilidad perfecta."
        else:
            result = "No creo que fuésemos muy compatibles."
            desc = "Hay diferencias claras en gustos, humor o forma de relacionarse."

        self.result_card("Resultado final", result, desc, f"Puntuación: {self.score}", self.restart)

    def show_horror_ending(self, ending):
        self.clear()

        self.unease = max(self.unease, 16)
        s = self.style()
        self.root.configure(bg=s["bg"])
        self.root.title("Test de amistad - resultado")

        endings = {
            "ending_distance": (
                "Resultado final",
                "No es que no pudiéramos ser amigos.",
                "Es que cada respuesta tuya se alejaba un poco más. Al final, el test no encontró rechazo. Encontró una puerta cerrada desde el principio."
            ),
            "ending_control": (
                "Resultado final",
                "El problema no era la compatibilidad.",
                "Era la necesidad de que la otra persona respondiera exactamente como esperabas. El test no ha fallado. Solo ha dejado de obedecer."
            ),
            "ending_empty": (
                "Resultado final",
                "No había suficiente información para conocerte.",
                "Pero sí había suficiente silencio para sacar una conclusión. A veces el hueco que deja una respuesta dice más que la respuesta."
            ),
            "ending_hostility": (
                "Resultado final",
                "No.",
                "No por tus gustos. No por tus planes. No por tu humor. Sino porque, poco a poco, cada opción elegida parecía querer hacer daño antes que conectar."
            ),
            "ending_contradiction": (
                "Resultado final",
                "El resultado no es estable.",
                "Cada respuesta intentaba borrar la anterior. El test ha terminado, pero no ha podido decidir si estabas respondiendo tú o la versión de ti que quería romperlo."
            ),
            "ending_uncertain": (
                "Resultado final",
                "No hay una respuesta clara.",
                "La compatibilidad no ha sido descartada, pero algo en el camino ha cambiado demasiado. El test termina aquí porque seguir preguntando empeoraría el resultado."
            )
        }

        title, result, desc = endings.get(ending, endings["ending_uncertain"])

        self.result_card(
            title,
            result,
            desc,
            f"Puntuación: {self.score}    Incomodidad: {self.unease}",
            self.restart
        )

    def result_card(self, title, result, desc, footer, command):
        s = self.style()

        card = tk.Frame(self.root, bg=s["card"], width=760, height=390)
        card.place(relx=0.5, rely=0.46, anchor="center")
        card.pack_propagate(False)

        tk.Label(
            card,
            text=title,
            font=("Segoe UI", 24, "bold"),
            fg=s["accent"],
            bg=s["card"]
        ).pack(pady=(35, 18))

        tk.Label(
            card,
            text=result,
            font=("Segoe UI", 19, "bold"),
            fg=s["text"],
            bg=s["card"],
            wraplength=660,
            justify="center"
        ).pack(pady=10)

        tk.Label(
            card,
            text=desc,
            font=("Segoe UI", 12),
            fg=s["muted"],
            bg=s["card"],
            wraplength=660,
            justify="center"
        ).pack(pady=20)

        tk.Label(
            card,
            text=footer,
            font=("Segoe UI", 10, "bold"),
            fg=s["accent"],
            bg=s["card"]
        ).pack(pady=10)

        self.make_button(self.root, "Volver al inicio", command).place(relx=0.5, rely=0.86, anchor="center")

    def restart(self):
        self.score = 0
        self.unease = 0
        self.current = "start"
        self.history = []
        self.profile = {
            "distance": 0,
            "control": 0,
            "emptiness": 0,
            "hostility": 0,
            "contradiction": 0,
            "compatibility": 0
        }
        self.root.title("Test de amistad")
        self.show_intro()


if __name__ == "__main__":
    root = tk.Tk()
    app = TestAmistadPsicologico(root)
    root.mainloop()