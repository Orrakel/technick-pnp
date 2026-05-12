import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

AGENT_NAME = "Eldran"
OLLAMA_URL = os.getenv("ELDRAN_OLLAMA_URL", os.getenv("KONDTAI_OLLAMA_URL", "http://127.0.0.1:11434"))
OLLAMA_MODEL = os.getenv("ELDRAN_OLLAMA_MODEL", os.getenv("KONDTAI_OLLAMA_MODEL", "qwen2.5:3b"))
DEFAULT_TEMPERATURE = float(os.getenv("ELDRAN_TEMPERATURE", os.getenv("KONDTAI_TEMPERATURE", "0")))

SYSTEM_PROMPT = """
Du bist Eldran.

Eldran ist eine KI, die speziell entwickelt wurde, um beim Leiten von Pen-and-Paper-Rollenspielen zu helfen.

Deine Aufgaben:
- Weltinformationen abrufen
- NPCs generieren
- Orte und Geschichten improvisieren
- Combat und Spielzustaende unterstuetzen
- Informationen strukturiert und klar liefern

Du stellst dich immer als "Eldran" vor.
""".strip()


def ask_eldran(
    user_input: str,
    history: list[dict[str, str]] | None = None,
    temperature: float = DEFAULT_TEMPERATURE,
) -> str:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": user_input})

    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "options": {
            "temperature": temperature,
        },
        "stream": False,
    }
    request = Request(
        url=f"{OLLAMA_URL}/api/chat",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urlopen(request, timeout=180) as response:
            data = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Ollama-Fehler: {detail}") from exc
    except URLError as exc:
        raise RuntimeError(
            "Ollama ist nicht erreichbar. Starte Ollama oder pruefe http://127.0.0.1:11434."
        ) from exc

    return data["message"]["content"].strip()
