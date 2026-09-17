import os
try:
    import ctypes
except ImportError:
    ctypes = None

import psutil
import random
import sys
import win32gui
import win32process
from pathlib import Path

def get_base_dir() -> Path:
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS)
    return Path(__file__).resolve().parent

from PySide6.QtCore import QTimer, Qt, QSize, QRect, QPoint
from PySide6.QtGui import QFontDatabase, QFont, QIcon, QPixmap, QMovie
from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QScrollArea, QLabel,
    QSpacerItem, QSizePolicy, QHBoxLayout, QToolButton, QMenu, QWidgetAction,
    QSlider, QLayout, QFrame
)

from BadgeRules import BadgeRules, BadgeConfig
from ChatColors import get_random_chat_color
from Emotes import get_emote_path
from Messages import get_random_message_for_app
from Usernames import get_random_username

FIXED_USERNAME_COLORS = {
    "MegaFly95": "#daa420",
    "daniel_ideas": "#9bcd31",
}

class FlowLayout(QLayout):
    def __init__(self, parent=None, margin=0, spacing=6):
        super().__init__(parent)
        self._items = []
        self.setContentsMargins(margin, margin, margin, margin)
        self.setSpacing(spacing)

    def addItem(self, item):
        self._items.append(item)

    def addWidget(self, w):
        super().addWidget(w)

    def count(self):
        return len(self._items)

    def itemAt(self, index):
        if 0 <= index < len(self._items):
            return self._items[index]
        return None

    def takeAt(self, index):
        if 0 <= index < len(self._items):
            return self._items.pop(index)
        return None

    def expandingDirections(self):
        return Qt.Orientations(0)

    def hasHeightForWidth(self):
        return True

    def heightForWidth(self, width):
        return self._do_layout(QRect(0, 0, width, 0), test_only=True)

    def setGeometry(self, rect):
        super().setGeometry(rect)
        self._do_layout(rect, test_only=False)

    def sizeHint(self):
        return self.minimumSize()

    def minimumSize(self):
        size = QSize()
        for item in self._items:
            size = size.expandedTo(item.minimumSize())
        left, top, right, bottom = self.getContentsMargins()
        size += QSize(left + right, top + bottom)
        return size

    def _do_layout(self, rect, test_only):
        x = rect.x()
        y = rect.y()
        line_height = 0

        left, top, right, bottom = self.getContentsMargins()
        effective_rect = rect.adjusted(left, top, -right, -bottom)
        x = effective_rect.x()
        y = effective_rect.y()
        max_x = effective_rect.right()

        space_x = self.spacing()
        space_y = self.spacing()

        for item in self._items:
            w = item.sizeHint().width()
            h = item.sizeHint().height()

            next_x = x + w
            if next_x > max_x and line_height > 0:
                x = effective_rect.x()
                y = y + line_height + space_y
                next_x = x + w
                line_height = 0

            if not test_only:
                item.setGeometry(QRect(QPoint(x, y), item.sizeHint()))

            x = next_x + space_x
            line_height = max(line_height, h)

        return (y + line_height - rect.y()) + bottom


class ChatMessageWidget(QFrame):
    def __init__(
        self,
        username: str,
        username_color: str,
        message: str,
        font_family: str,
        badge_paths: list[Path] | None = None,
        parent=None
    ):
        super().__init__(parent)
        self._movies: list[QMovie] = []  # mantener QMovie vivos

        self.setStyleSheet("background: transparent;")

        # Un SOLO FlowLayout para todo (badges + username + ": " + mensaje)
        flow = FlowLayout(self, margin=0, spacing=0)
        self.setLayout(flow)

        # Badges (0..n) en orden ya decidido por BadgeRules
        if badge_paths:
            for bp in badge_paths:
                if bp is not None and bp.exists():
                    flow.addWidget(self._make_badge_widget(bp))

        # Username
        name_label = QLabel(username)
        name_label.setStyleSheet(
            f"color: {username_color};"
            f"font-family: '{font_family}';"
            f"font-size: 13px;"
            f"font-weight: 700;"
        )
        name_label.setSizePolicy(QSizePolicy.Maximum, QSizePolicy.Fixed)
        name_label.setTextInteractionFlags(Qt.NoTextInteraction)
        flow.addWidget(name_label)

        # ": "
        colon_label = QLabel(": ")
        colon_label.setStyleSheet(
            f"color: #e4e4e7;"
            f"font-family: '{font_family}';"
            f"font-size: 13px;"
            f"font-weight: 500;"
        )
        colon_label.setSizePolicy(QSizePolicy.Maximum, QSizePolicy.Fixed)
        colon_label.setTextInteractionFlags(Qt.NoTextInteraction)
        flow.addWidget(colon_label)

        # Mensaje tokenizado
        tokens = message.split(" ")
        for i, token in enumerate(tokens):
            if token == "":
                flow.addWidget(self._make_text_label(" ", font_family))
                continue

            emote_path = get_emote_path(token)
            if emote_path:
                flow.addWidget(self._make_emote_widget(emote_path))
            else:
                suffix = " " if i < len(tokens) - 1 else ""
                flow.addWidget(self._make_text_label(token + suffix, font_family))

    def _make_badge_widget(self, path: Path) -> QLabel:
        lbl = QLabel()
        lbl.setSizePolicy(QSizePolicy.Fixed, QSizePolicy.Fixed)
        lbl.setContentsMargins(0, 0, 0, 0)

        target_h = 16

        # para .ico, QIcon suele ir mejor que QPixmap directo
        ico = QIcon(str(path))
        pm = ico.pixmap(target_h, target_h)
        if not pm.isNull():
            lbl.setPixmap(pm)

        # separación mínima sin tocar el flow spacing
        lbl.setStyleSheet("margin-right: 4px;")
        return lbl

    def _make_text_label(self, text: str, font_family: str) -> QLabel:
        lbl = QLabel(text)
        lbl.setStyleSheet(
            f"color: #e4e4e7;"
            f"font-family: '{font_family}';"
            f"font-size: 13px;"
            f"font-weight: 500;"
        )
        lbl.setSizePolicy(QSizePolicy.Maximum, QSizePolicy.Fixed)
        lbl.setTextInteractionFlags(Qt.NoTextInteraction)
        return lbl

    def _make_emote_widget(self, path: Path) -> QLabel:
        lbl = QLabel()
        lbl.setSizePolicy(QSizePolicy.Fixed, QSizePolicy.Fixed)
        lbl.setContentsMargins(0, 0, 0, 0)

        ext = path.suffix.lower()
        target_h = 18  # altura tipo Twitch

        if ext == ".gif":
            movie = QMovie(str(path))

            # Necesitamos conocer el tamaño real del GIF (primer frame)
            movie.jumpToFrame(0)
            frame = movie.currentImage()
            frame_size = frame.size()

            # Si por lo que sea no hay tamaño, fallback a cuadrado
            if frame_size.height() > 0:
                scaled_w = int(frame_size.width() * (target_h / frame_size.height()))
            else:
                scaled_w = target_h

            movie.setScaledSize(QSize(scaled_w, target_h))

            # IMPORTANTE: fija el tamaño del label para que FlowLayout no lo “encaje raro”
            lbl.setFixedSize(scaled_w, target_h)

            lbl.setMovie(movie)
            movie.start()
            self._movies.append(movie)  # mantener vivo

        else:
            pix = QPixmap(str(path))
            if not pix.isNull():
                pix = pix.scaledToHeight(target_h, Qt.SmoothTransformation)
                lbl.setPixmap(pix)
                lbl.setFixedSize(pix.size())

        return lbl


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Base dir
        self.base_dir = get_base_dir()

        # Badge rules (Mod > Prime > Cheer)
        self.badge_rules = BadgeRules(BadgeConfig(
            base_dir=self.base_dir,
            event_probability=0.30,       # 30% de tener 1 badge de evento
            media_only_probability=0.05   # 5% de videoonly/audioonly (solo uno)
        ))

        self.setWindowIcon(QIcon(str(self.base_dir / "icons" / "twitch.ico")))
        self.setWindowTitle("Chat Simulator")
        self.resize(450, 600)

        # Widget central
        central_widget = QWidget()
        central_widget.setStyleSheet("background-color: #18181b;")
        self.setCentralWidget(central_widget)

        # Layout vertical principal
        main_layout = QVBoxLayout()
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)
        central_widget.setLayout(main_layout)

        # ===== Chat scrollable =====
        self.scroll_area = QScrollArea()
        self.scroll_area.setWidgetResizable(True)
        self.scroll_area.setFrameShape(QScrollArea.NoFrame)
        self.scroll_area.setStyleSheet("background-color: #18181b;")

        self.chat_container = QWidget()
        self.chat_container.setStyleSheet("background-color: #18181b;")

        self.chat_layout = QVBoxLayout()
        self.chat_layout.setContentsMargins(12, 12, 12, 12)
        self.chat_layout.setSpacing(2)
        self.chat_container.setLayout(self.chat_layout)
        self.chat_container.setMinimumHeight(0)

        # Spacer arriba para empujar los mensajes hacia abajo
        self.top_spacer = QSpacerItem(20, 40, QSizePolicy.Minimum, QSizePolicy.Expanding)
        self.chat_layout.addItem(self.top_spacer)

        self.scroll_area.setWidget(self.chat_container)

        # ===== Barra inferior =====
        toolbar = QWidget()
        toolbar.setFixedHeight(50)
        toolbar.setStyleSheet("""
            background-color: #18181b;
            border-top: 2px solid #27272a;
        """)
        toolbar_layout = QHBoxLayout()
        toolbar_layout.setContentsMargins(8, 0, 8, 0)
        toolbar_layout.setSpacing(8)
        toolbar.setLayout(toolbar_layout)

        self.pause_button = QToolButton()
        self.pause_button.setCheckable(True)
        self.pause_button.setChecked(False)
        self.pause_button.setIcon(QIcon(str(self.base_dir / "icons" / "pause.ico")))
        self.pause_button.setIconSize(QSize(20, 20))
        self.pause_button.setFixedSize(36, 36)
        self.pause_button.setToolTip("Pausar/Reanudar chat")
        self.pause_button.setStyleSheet("""
            QToolButton {
                background-color: transparent;
                border: none;
            }
            QToolButton:hover {
                background-color: #27272a;
                border-radius: 6px;
            }
            QToolButton:checked {
                background-color: #3f3f46;
                border-radius: 6px;
            }
        """)
        toolbar_layout.addWidget(self.pause_button)

        # Speed button
        self.speed_button = QToolButton()
        self.speed_button.setIcon(QIcon(str(self.base_dir / "icons" / "speed.ico")))
        self.speed_button.setIconSize(QSize(20, 20))
        self.speed_button.setFixedSize(36, 36)
        self.speed_button.setToolTip("Velocidad de chat")
        self.speed_button.setStyleSheet("""
            QToolButton {
                background-color: transparent;
                border: none;
            }
            QToolButton:hover {
                background-color: #27272a;
                border-radius: 6px;
            }
        """)
        self.speed_button.clicked.connect(self.show_speed_popup)
        toolbar_layout.addWidget(self.speed_button)

        # Detect apps button
        self.detectapps_button = QToolButton()
        self.detectapps_button.setCheckable(True)
        self.detectapps_button.setChecked(False)
        self.detectapps_button.setIcon(QIcon(str(self.base_dir / "icons" / "detectapps.ico")))
        self.detectapps_button.setIconSize(QSize(20, 20))
        self.detectapps_button.setFixedSize(36, 36)
        self.detectapps_button.setToolTip("Detectar aplicaciones")
        self.detectapps_button.setStyleSheet("""
            QToolButton {
                background-color: transparent;
                border: none;
            }
            QToolButton:hover {
                background-color: #27272a;
                border-radius: 6px;
            }
            QToolButton:checked {
                background-color: #3f3f46;
                border-radius: 6px;
            }
        """)
        toolbar_layout.addWidget(self.detectapps_button)

        # Clear chat button
        self.clearchat_button = QToolButton()
        self.clearchat_button.setIcon(QIcon(str(self.base_dir / "icons" / "clear.ico")))
        self.clearchat_button.setIconSize(QSize(20, 20))
        self.clearchat_button.setFixedSize(36, 36)
        self.clearchat_button.setToolTip("Limpiar chat")
        self.clearchat_button.setStyleSheet("""
            QToolButton {
                background-color: transparent;
                border: none;
            }
            QToolButton:hover {
                background-color: #27272a;
                border-radius: 6px;
            }
        """)
        self.clearchat_button.clicked.connect(self.clear_chat)
        toolbar_layout.addWidget(self.clearchat_button)

        main_layout.addWidget(self.scroll_area, 1)
        main_layout.addWidget(toolbar)

        # ===== Timer / speed =====
        self.speed_value = 50  # guardamos el valor del slider
        self.apply_speed_from_slider(self.speed_value)

        self.timer = QTimer(self)
        self.timer.timeout.connect(self.add_message)

        # Arranca desde el inicio (antes te faltaba esto y por eso “no hablaba” hasta tocar el slider)
        self.start_random_timer()

    def clear_chat(self):
        # En tu chat_layout, el item 0 es el spacer de arriba.
        # Todo lo demás (1..n) son mensajes.
        for i in range(self.chat_layout.count() - 1, 0, -1):
            item = self.chat_layout.takeAt(i)
            w = item.widget()
            if w is not None:
                w.deleteLater()

    def apply_speed_from_slider(self, value: int):
        # value: 0..100
        t = value / 100.0

        # OJO: tus comentarios decían 10s/60s pero los números eran 1_000/6_000
        # Lo dejo tal cual tus números para no cambiarte el “feeling”.
        min_left = 1_000   # 1s
        min_right = 10     # 10ms

        max_left = 6_000   # 6s
        max_right = 500    # 500ms

        self.min_delay = int(round(min_left + (min_right - min_left) * t))
        self.max_delay = int(round(max_left + (max_right - max_left) * t))

    def on_speed_slider_changed(self, value: int):
        self.speed_value = value
        self.apply_speed_from_slider(value)

        min_s = self.min_delay / 1000
        max_s = self.max_delay / 1000
        print(f"[Speed] Slider={value} | Min={min_s:.3f}s | Max={max_s:.3f}s")

        self.start_random_timer()

    def show_speed_popup(self):
        menu = QMenu(self)
        menu.setStyleSheet("""
            QMenu {
                background-color: #18181b;
                border: 1px solid #27272a;
                padding: 8px;
            }
        """)

        container = QWidget()
        layout = QHBoxLayout(container)
        layout.setContentsMargins(6, 4, 6, 4)
        layout.setSpacing(8)

        left_label = QLabel("Noob")
        left_label.setStyleSheet("color: #e4e4e7; font-size: 12px;")

        slider = QSlider(Qt.Horizontal)
        slider.setMinimum(0)
        slider.setMaximum(100)
        slider.setValue(self.speed_value)
        slider.valueChanged.connect(self.on_speed_slider_changed)
        slider.setFixedWidth(160)

        right_label = QLabel("Rubius")
        right_label.setStyleSheet("color: #e4e4e7; font-size: 12px;")

        layout.addWidget(left_label)
        layout.addWidget(slider)
        layout.addWidget(right_label)

        action = QWidgetAction(menu)
        action.setDefaultWidget(container)
        menu.addAction(action)

        pos = self.speed_button.mapToGlobal(self.speed_button.rect().bottomLeft())
        menu.exec(pos)

    def get_foreground_context(self):
        """Devuelve (exe_name, window_title) en minúsculas."""
        try:
            hwnd = win32gui.GetForegroundWindow()
            title = win32gui.GetWindowText(hwnd) or ""
            _, pid = win32process.GetWindowThreadProcessId(hwnd)
            exe = psutil.Process(pid).name() or ""
            return exe.lower(), title.lower()
        except Exception:
            return None, ""

    def get_foreground_app_key(self):
        exe, title = self.get_foreground_context()
        if not exe:
            return "default"

        # --- IDEs ---
        if exe == "devenv.exe":
            return "visualstudio"
        if exe == "code.exe":
            return "vscode"

        # --- Navegadores ---
        if exe == "chrome.exe":
            return "chrome"
        if exe == "msedge.exe":
            return "edge"

        # --- Explorer ---
        if exe == "explorer.exe":
            return "explorer"

        # --- SSMS ---
        if exe == "ssms.exe":
            return "ssms"

        # --- Teams ---
        if exe in ("ms-teams.exe", "teams.exe"):
            return "teams"

        # --- Outlook clásico ---
        if exe == "outlook.exe":
            return "outlook"

        # --- Outlook nuevo ---
        if exe == "olk.exe":
            return "outlook"
        if exe == "applicationframehost.exe" and "outlook" in title:
            return "outlook"

        # --- Vircore.SGDES ---
        if exe == "vircore.sgdes.exe" or "sgdes" in exe or "sgdes" in title:
            return "sgdes"

        return "default"

    def start_random_timer(self):
        delay = random.randint(self.min_delay, self.max_delay)
        self.timer.start(delay)

    def add_message(self):
        if self.pause_button.isChecked():
            self.start_random_timer()
            return
        
        username = get_random_username()

        if self.detectapps_button.isChecked():
            app_key = self.get_foreground_app_key()
        else:
            app_key = "default"

        message = get_random_message_for_app(app_key)

        app = QApplication.instance()
        if username == "MegaFly95":
            username_color = "#daa420"
        else:
            username_color = get_random_chat_color()

        # BadgeRules devuelve lista de badges en orden: Mod > Prime > Cheer
        badge_paths = self.badge_rules.get_badges_for_username(username)

        msg_widget = ChatMessageWidget(
            username=username,
            username_color=username_color,
            message=message,
            font_family=app.roobert_family,
            badge_paths=badge_paths
        )

        self.chat_layout.addWidget(msg_widget)
        QTimer.singleShot(10, self.scroll_to_bottom)
        self.start_random_timer()

    def scroll_to_bottom(self):
        if self.chat_layout.count() > 1:
            last_item = self.chat_layout.itemAt(self.chat_layout.count() - 1)
            widget = last_item.widget()
            if widget:
                self.scroll_area.ensureWidgetVisible(widget)


if __name__ == "__main__":
    app = QApplication(sys.argv)

    base_dir = Path(__file__).resolve().parent

    icon_path = base_dir / "icons" / "twitch.ico"

    # 1) Icono para toda la app
    app.setWindowIcon(QIcon(str(icon_path)))

    # 2) AppUserModelID (Windows taskbar)
    if ctypes is not None and os.name == "nt":
        myappid = "fongus.chat.simulator.twitch"
        ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(myappid)

    # Fuentes
    bold_path = base_dir / "fonts" / "RoobertMonoTRIAL-Bold-BF67243fd2cfa56.otf"
    light_path = base_dir / "fonts" / "RoobertMonoTRIAL-Medium-BF67243fd28915a.otf"

    bold_id = QFontDatabase.addApplicationFont(str(bold_path))
    light_id = QFontDatabase.addApplicationFont(str(light_path))

    if bold_id == -1 or light_id == -1:
        print("ERROR: No se pudieron cargar las fuentes Roobert")
        app.roobert_family = "Arial"
    else:
        bold_family = QFontDatabase.applicationFontFamilies(bold_id)[0]
        light_family = QFontDatabase.applicationFontFamilies(light_id)[0]

        print("BOLD FAMILY:", bold_family)
        print("MEDIUM FAMILY:", light_family)

        # Una sola familia (son iguales), y usamos font-weight en estilos
        app.roobert_family = bold_family
        app.setFont(QFont(app.roobert_family))

    window = MainWindow()
    window.show()
    sys.exit(app.exec())
