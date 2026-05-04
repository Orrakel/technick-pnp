# Eldran Web Chat

Dieses Projekt stellt Eldran als Web-Chatoberflaeche ueber Ollama bereit.

## Voraussetzungen

- Python 3.10 oder neuer
- Ollama
- Ein lokales Ollama-Modell, standardmaessig `qwen2.5:3b`

## Installation

```powershell
pip install -r requirements.txt
```

## Starten

```powershell
uvicorn app:app --reload
```

Danach ist die Oberflaeche unter `http://127.0.0.1:8000` erreichbar.

Die Datenbank-Seite ist unter `http://127.0.0.1:8000/db` erreichbar.

## Dateien hochladen

Markdown-Dateien koennen in der Weboberflaeche hochgeladen werden. Die App speichert:

- die Originaldatei unter `data/uploads`
- Metadaten und extrahierbaren Text in `data/eldran.db`

Beim Chat koennen hochgeladene Dateien als Kontext fuer Antworten verwendet werden.
Die App zerlegt Dokumente dafuer in Abschnitte und waehlt pro Frage nur die relevantesten Teile aus.
Damit existiert bereits ein lokales RAG: Markdown-Dateien werden eingelesen, in strukturierte Elemente und Chunks ueberfuehrt und bei Anfragen per Retrieval in den Prompt eingefuegt.

## Ordnerimport

Auf der Chat-Seite kann ein Ordnerpfad eingetragen werden. Beim Einlesen oder Reload werden die Dateien aus diesem Ordner neu in die Datenbank importiert und die bisherigen Ordnerimporte ersetzt.
Wenn der Ordner ein RAG-Paket mit `documents.json` und `chunks.jsonl` enthaelt, wird dieses direkt importiert. In diesem Fall werden die vorbereiteten Chunks uebernommen, statt Dateien erneut aus Markdown zu extrahieren.

## Optional: Ollama-Konfiguration

```powershell
$env:KONDTAI_OLLAMA_MODEL="qwen2.5:3b"
$env:KONDTAI_OLLAMA_URL="http://127.0.0.1:11434"
uvicorn app:app --reload
```

Die Ollama-Anfrage wird mit `temperature=0` gesendet, damit Antworten moeglichst deterministisch bleiben.
