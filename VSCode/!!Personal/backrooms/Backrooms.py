import importlib
import json
import os
import tkinter as tk
from PIL import Image, ImageTk, ImageOps
from tkinter import messagebox


class BackroomsApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Backrooms")
        self.root.geometry("800x600")
        self.root.resizable(False, False)

        self.load_save_data()
        self.load_background_image()
        self.create_main_button()
        self.create_exploration_log_button()
        self.create_reset_data_button()
        self.create_main_menu_button()

        # ====== DEBUG ====== #
        self.exit_chance_multiplier = 1
        self.debug_exit_boost_enabled = False

        self.root.bind("<Control-g>", self.toggle_exit_boost)
        self.root.bind("<Control-G>", self.toggle_exit_boost)

        self.root.bind("<Right>", self.handle_right_arrow)
        self.root.bind("<Left>", self.handle_left_arrow)

    def handle_right_arrow(self, event=None):
        if hasattr(self, "walk_button"):
            self.walk_forward()

    def handle_left_arrow(self, event=None):
        if hasattr(self, "back_button"):
            self.go_back()
    
    def toggle_exit_boost(self, event=None):
        self.debug_exit_boost_enabled = not self.debug_exit_boost_enabled

        if self.debug_exit_boost_enabled:
            self.exit_chance_multiplier = 100
            message = "DEBUG: Exit chance boost enabled. Exit chances are now doubled."
        else:
            self.exit_chance_multiplier = 1
            message = "DEBUG: Exit chance boost disabled. Exit chances are back to normal."

        if hasattr(self, "text_box"):
            self.text_box.config(text=message)
    
    def load_background_image(self):
        image_route = os.path.join(
            os.path.dirname(__file__),
            "Images",
            "Frontrooms.png"
        )

        image = Image.open(image_route)
        image = image.resize((800, 600))

        self.background = ImageTk.PhotoImage(image)

        self.label_background = tk.Label(self.root, image=self.background)
        self.label_background.place(x=0, y=0, relwidth=1, relheight=1)
    
    def create_main_menu_button(self):
        self.main_menu_button = tk.Button(
            self.root,
            text="MAIN MENU",
            font=("Consolas", 10, "bold"),
            bg="#c9b08a",
            fg="#2b241b",
            activebackground="#bca07a",
            activeforeground="#000000",
            bd=2,
            relief="raised",
            padx=10,
            pady=5,
            cursor="hand2",
            command=self.return_to_main_menu
        )

        self.main_menu_button.place_forget()
    
    def create_main_button(self):
        
        self.title = tk.Label(
            self.root,
            text="THE BACKROOMS",
            font=("Consolas", 28, "bold"),
            bg="#c9b08a",
            fg="#2b241b",
            padx=20,
            pady=10
        )

        self.title.place(
            relx=0.5,
            rely=0.15,
            anchor="center"
        )

        self.enter_button = tk.Button(
            self.root,
            text="ENTER THE BACKROOMS",
            font=("Consolas", 14, "bold"),
            bg="#d7c09c",
            fg="#2b241b",
            activebackground="#bca07a",
            activeforeground="#000000",
            bd=2,
            relief="raised",
            padx=20,
            pady=10,
            cursor="hand2",
            command=self.enter_backrooms
        )

        self.enter_button.place(
            relx=0.5,
            rely=0.82,
            anchor="center"
        )
    
    def create_exploration_log_button(self):
        self.exploration_log_button = tk.Button(
            self.root,
            text="EXPLORATION LOG",
            font=("Consolas", 11, "bold"),
            bg="#c9b08a",
            fg="#2b241b",
            activebackground="#bca07a",
            activeforeground="#000000",
            bd=2,
            relief="raised",
            padx=12,
            pady=6,
            cursor="hand2",
            command=self.open_exploration_log
        )

        self.move_exploration_log_button_to_menu_position()
    
    def create_reset_data_button(self):
        self.reset_data_button = tk.Button(
            self.root,
            text="RESET DATA",
            font=("Consolas", 10, "bold"),
            bg="#8f2f2f",
            fg="#f0d8b0",
            activebackground="#5c1f1f",
            activeforeground="#ffffff",
            bd=2,
            relief="raised",
            padx=10,
            pady=5,
            cursor="hand2",
            command=self.reset_game_data
        )

        self.reset_data_button.place(
            relx=0.94,
            rely=0.95,
            anchor="center"
        )
    
    def open_exploration_log(self):
        exploration_log_window = tk.Toplevel(self.root)
        exploration_log_window.title("Exploration Log")
        exploration_log_window.geometry("500x600")
        exploration_log_window.resizable(False, False)
        exploration_log_window.configure(bg="#2b241b")

        title = tk.Label(
            exploration_log_window,
            text="EXPLORATION LOG",
            font=("Consolas", 16, "bold"),
            bg="#2b241b",
            fg="#d7c09c"
        )
        title.pack(pady=15)

        canvas = tk.Canvas(
            exploration_log_window,
            bg="#2b241b",
            highlightthickness=0
        )
        canvas.pack(side="left", fill="both", expand=True)

        scrollbar = tk.Scrollbar(
            exploration_log_window,
            orient="vertical",
            command=canvas.yview
        )
        scrollbar.pack(side="right", fill="y")

        canvas.configure(yscrollcommand=scrollbar.set)

        list_frame = tk.Frame(canvas, bg="#2b241b")
        canvas.create_window((0, 0), window=list_frame, anchor="nw")

        def on_mousewheel(event):
            canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

        canvas.bind_all("<MouseWheel>", on_mousewheel)

        def on_close():
            canvas.unbind_all("<MouseWheel>")
            exploration_log_window.destroy()

        exploration_log_window.protocol("WM_DELETE_WINDOW", on_close)

        self.level_icons = []

        for level_number in range(1000):
            level_id = f"{level_number:03d}"

            level_info = self.save_data_dict["levels"].get(level_id)

            if level_info is None:
                icon_name = "NoData.png"
                level_text = "[NO DATA]"
                use_grayscale = False
            
            else:
                icon_name = f"Level_{level_id}.png"

                if level_info["escaped"]:
                    level_text = level_info["display_name"]
                    use_grayscale = False
                else:
                    level_text = "???"
                    use_grayscale = True
            
            icon_path = os.path.join(
                os.path.dirname(__file__),
                "Images",
                icon_name
            )

            if not os.path.exists(icon_path):
                icon_path = os.path.join(
                    os.path.dirname(__file__),
                    "Images",
                    "NoData.png"
                )
            
            icon_image = Image.open(icon_path)
            icon_image = icon_image.resize((48, 48))

            if use_grayscale:
                icon_image = ImageOps.grayscale(icon_image)
                icon_image = ImageOps.colorize(
                    icon_image,
                    black="#2b241b",
                    white="#d7c09c"
                )
            
            icon_photo = ImageTk.PhotoImage(icon_image)
            self.level_icons.append(icon_photo)

            row_frame = tk.Frame(
                list_frame,
                bg="#2b241b",
                padx=8,
                pady=4
            )
            row_frame.pack(fill="x")

            icon_label = tk.Label(
                row_frame,
                image=icon_photo,
                bg="#2b241b"
            )
            icon_label.pack(side="left")

            text_label = tk.Label(
                row_frame,
                text=level_text,
                font=("Consolas", 12, "bold"),
                bg="#2b241b",
                fg="#d7c09c",
                anchor="w"
            )
            text_label.pack(side="left", padx=12)
        
        list_frame.update_idletasks()

        canvas.configure(
            scrollregion=canvas.bbox("all")
        )
    
    def enter_backrooms(self):
        level_module = self.load_level_module("000")
        level_data = level_module.get_level_data()
        self.load_level(level_data)
    
    def clear_level_interface(self):
        widgets = [
            "text_box",
            "walk_button",
            "back_button",
            "take_exit_button"
        ]

        for widget_name in widgets:
            if hasattr(self, widget_name):
                getattr(self, widget_name).destroy()
                delattr(self, widget_name)
    
    def return_to_main_menu(self):
        confirm = messagebox.askyesno(
            "Return to Main Menu",
            "Are you sure you want to return to the main menu?"
        )

        if not confirm:
            return

        self.clear_level_interface()

        self.current_level = None
        self.current_level_module = None
        self.current_step = 0
        self.path_events = []
        self.last_walk_text = None

        self.set_main_menu_background()

        self.title.config(text="THE BACKROOMS")

        self.enter_button.place(
            relx=0.5,
            rely=0.82,
            anchor="center"
        )

        self.move_exploration_log_button_to_menu_position()

        self.reset_data_button.place(
            relx=0.94,
            rely=0.95,
            anchor="center"
        )

        self.main_menu_button.place_forget()
    
    def set_main_menu_background(self):
        image_route = os.path.join(
            os.path.dirname(__file__),
            "Images",
            "Frontrooms.png"
        )

        image = Image.open(image_route)
        image = image.resize((800, 600))

        self.background = ImageTk.PhotoImage(image)
        self.label_background.config(image=self.background)
    
    def load_level(self, level_data):
        self.clear_level_interface()

        level_id = level_data["id"]

        self.current_level_module = self.load_level_module(level_id)

        if level_id not in self.save_data_dict["levels"]:
            self.save_data_dict["levels"][level_id] = {
                "visited": True,
                "escaped": False,
                "display_name": "???"
            }

            self.save_game_data()

        saved_level_data = self.save_data_dict["levels"][level_id]

        if saved_level_data["escaped"]:
            level_title = level_data["full_name"]
        else:
            level_title = "???"

        self.set_level_background(level_data["image"])
        self.title.config(text=level_title)

        self.enter_button.place_forget()
        self.move_exploration_log_button_to_corner()
        self.reset_data_button.place_forget()

        self.main_menu_button.place(
            relx=0.98,
            rely=0.04,
            anchor="ne"
        )

        self.current_level = level_data
        self.current_step = 0
        self.path_events = []
        self.last_walk_text = None

        self.create_level_interface()
    
    def get_unique_walk_event(self):
        event = self.current_level_module.get_walk_event(
            self.current_step,
            self.exit_chance_multiplier
        )

        attempts = 0

        while (
            event["type"] == "nothing"
            and event["text"] == self.last_walk_text
            and attempts < 10
        ):
            event = self.current_level_module.get_walk_event(
                self.current_step,
                self.exit_chance_multiplier
            )

            attempts += 1
        
        if event["type"] == "nothing":
            self.last_walk_text = event["text"]
        
        return event

    def move_exploration_log_button_to_corner(self):
        self.exploration_log_button.place(
            relx=0.02,
            rely=0.96,
            anchor="sw"
        )
    
    def move_exploration_log_button_to_menu_position(self):
        self.exploration_log_button.place(
            relx=0.5,
            rely=0.92,
            anchor="center"
        )
    
    def update_current_step_view(self):
        if hasattr(self, "take_exit_button"):
            self.take_exit_button.place_forget()

        self.set_level_background(self.current_level["image"])

        if self.current_step == 0:
            return

        current_event = self.path_events[self.current_step - 1]

        if current_event["type"] == "exit":
            self.set_level_background(current_event["image"])

            self.take_exit_button.place(
                relx=0.5,
                rely=0.94,
                anchor="center"
            )
    
    def create_level_interface(self):
        self.text_box = tk.Label(
            self.root,
            text=self.current_level["intro_text"],
            font=("Consolas", 12),
            bg="#c9b08a",
            fg="#2b241b",
            padx=20,
            pady=10,
            wraplength=700,
            justify="left"
        )

        self.text_box.place(
            relx=0.5,
            rely=0.68,
            anchor="center"
        )

        self.walk_button = tk.Button(
            self.root,
            text="WALK FORWARD",
            font=("Consolas", 12, "bold"),
            bg="#d7c09c",
            fg="#2b241b",
            activebackground="#bca07a",
            activeforeground="#000000",
            bd=2,
            relief="raised",
            padx=14,
            pady=7,
            cursor="hand2",
            command=self.walk_forward
        )

        self.walk_button.place(
            relx=0.62,
            rely=0.86,
            anchor="center"
        )

        self.back_button = tk.Button(
            self.root,
            text="GO BACK",
            font=("Consolas", 12, "bold"),
            bg="#d7c09c",
            fg="#2b241b",
            activebackground="#bca07a",
            activeforeground="#000000",
            bd=2,
            relief="raised",
            padx=14,
            pady=7,
            cursor="hand2",
            command=self.go_back
        )

        self.back_button.place(
            relx=0.38,
            rely=0.86,
            anchor="center"
        )

        self.take_exit_button = tk.Button(
            self.root,
            text="TAKE EXIT",
            font=("Consolas", 12, "bold"),
            bg="#8f8f8f",
            fg="#f0d8b0",
            activebackground="#5c1f1f",
            activeforeground="#ffffff",
            bd=2,
            relief="raised",
            padx=14,
            pady=7,
            cursor="hand2",
            command=self.take_exit
        )

        self.take_exit_button.place(
            relx=0.5,
            rely=0.94,
            anchor="center"
        )

        self.take_exit_button.place_forget()
    
    def set_level_background(self, image_name):
        image_path = os.path.join(
            os.path.dirname(__file__),
            "Images",
            image_name
        )

        image = Image.open(image_path)
        image = image.resize((800, 600))

        self.background = ImageTk.PhotoImage(image)
        self.label_background.config(image=self.background)
    
    def walk_forward(self):
        self.current_step += 1

        if self.current_step <= len(self.path_events):
            event = self.path_events[self.current_step - 1]
        else:
            event = self.get_unique_walk_event()
            self.path_events.append(event)

        self.update_current_step_view()

        self.text_box.config(
            text=f"Step {self.current_step}\n\n{event['text']}"
        )
    
    def go_back(self):
        if self.current_step == 0:
            self.text_box.config(
                text="You are already at the point where you entered this level."
            )
            return

        self.current_step -= 1
        self.update_current_step_view()

        if self.current_step == 0:
            self.text_box.config(
                text="You walked back to the point where you entered this level."
            )
            return

        previous_event = self.path_events[self.current_step - 1]

        self.text_box.config(
            text=f"Step {self.current_step}\n\nYou walked back.\n\nPrevious event:\n{previous_event['text']}"
        )
    
    def take_exit(self):
        if self.current_step == 0:
            return

        current_event = self.path_events[self.current_step - 1]

        if current_event["type"] != "exit":
            return

        current_level_id = self.current_level["id"]

        self.save_data_dict["levels"][current_level_id]["escaped"] = True
        self.save_data_dict["levels"][current_level_id]["display_name"] = self.current_level["full_name"]
        self.save_game_data()

        target_level_id = current_event["target_level"]

        target_level_module = self.load_level_module(target_level_id)
        next_level_data = target_level_module.get_level_data()

        self.load_level(next_level_data)

    def load_save_data(self):
        self.save_data_dict_route = os.path.join(
            os.path.dirname(__file__),
            "save_data.json"
        )

        if not os.path.exists(self.save_data_dict_route):
            initial_data = {
                "levels": {}
            }

            with open(self.save_data_dict_route, "w", encoding="utf-8") as file:
                json.dump(initial_data, file, indent=4, ensure_ascii=False)
        
        with open(self.save_data_dict_route, "r", encoding="utf-8") as file:
            self.save_data_dict = json.load(file)
    
    def save_game_data(self):
        with open(self.save_data_dict_route, "w", encoding="utf-8") as file:
            json.dump(
                self.save_data_dict,
                file,
                indent=4,
                ensure_ascii=False
            )
    
    def reset_game_data(self):
        confirm = messagebox.askyesno(
            "Reset Data",
            "Are you sure you want to delete all exploration data?"
        )

        if confirm:
            self.save_data_dict = {
                "levels": {}
            }

            self.save_game_data()

            messagebox.showinfo(
                "Reset Data",
                "Exploration data has been deleted."
            )
    
    def load_level_module(self, level_id):
        module_name = f"Levels.Level_{level_id}"
        return importlib.import_module(module_name)

if __name__ == "__main__":
    root = tk.Tk()
    app = BackroomsApp(root)
    root.mainloop()