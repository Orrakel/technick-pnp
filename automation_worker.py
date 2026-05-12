import argparse
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


DEFAULT_BASE_URL = "http://127.0.0.1:8000"
DEFAULT_INTERVAL_SECONDS = 20


def request_json(base_url: str, path: str, *, method: str = "GET", payload: dict | None = None) -> dict:
    data = None
    headers = {"Accept": "application/json"}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(f"{base_url.rstrip('/')}{path}", data=data, headers=headers, method=method)
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8") or "{}")


def set_task_status(base_url: str, task_id: str, status: str) -> None:
    request_json(
        base_url,
        f"/api/notes/automation/tasks/{urllib.parse.quote(task_id)}/status",
        method="PATCH",
        payload={"status": status},
    )


def get_task_note(base_url: str, task_id: str) -> dict:
    payload = request_json(base_url, f"/api/notes/{urllib.parse.quote(task_id)}")
    return payload.get("note") or {}


def build_prompt(task: dict, note: dict) -> str:
    return "\n".join([
        "Bitte lies diese Auto-Notiz und setze den Verbesserungswunsch um.",
        "",
        f"Titel: {note.get('title') or task.get('title') or 'Auto-Aufgabe'}",
        f"Status: {task.get('status') or 'offen'}",
        "",
        str(note.get("content") or task.get("summary") or "").strip(),
        "",
        "Arbeite autonom: Code aendern, pruefen, nach D:\\Eldran\\Web kopieren und kurz zusammenfassen.",
    ])


def write_prompt_file(task_id: str, prompt: str) -> Path:
    prompt_dir = Path(tempfile.gettempdir()) / "eldran-automation-prompts"
    prompt_dir.mkdir(parents=True, exist_ok=True)
    prompt_path = prompt_dir / f"{task_id}.txt"
    prompt_path.write_text(prompt, encoding="utf-8")
    return prompt_path


def run_automation_command(command: str, workspace: Path, task: dict, prompt: str) -> int:
    prompt_path = write_prompt_file(str(task.get("id") or "task"), prompt)
    task_id = str(task.get("id") or "")
    env = os.environ.copy()
    env["ELDRAN_AUTOMATION_TASK_ID"] = task_id
    env["ELDRAN_AUTOMATION_TASK_TITLE"] = str(task.get("title") or "")
    env["ELDRAN_AUTOMATION_PROMPT"] = prompt
    env["ELDRAN_AUTOMATION_PROMPT_FILE"] = str(prompt_path)
    command_to_run = (
        command
        .replace("{prompt_file}", str(prompt_path))
        .replace("{task_id}", task_id)
        .replace("{prompt}", prompt)
    )
    return subprocess.run(command_to_run, cwd=workspace, env=env, shell=True, check=False).returncode


def process_one_open_task(base_url: str, command: str, workspace: Path) -> bool:
    payload = request_json(base_url, "/api/notes/automation/tasks")
    tasks = payload.get("tasks") or []
    open_tasks = [task for task in tasks if str(task.get("status") or "offen").lower() == "offen"]
    if not open_tasks:
        return False

    task = open_tasks[0]
    task_id = str(task.get("id") or "")
    if not task_id:
        return False

    if not command:
        print("[automation] Offene Aufgabe gefunden, aber ELDRAN_AUTOMATION_COMMAND ist nicht gesetzt.", flush=True)
        return False

    print(f"[automation] Starte Aufgabe: {task.get('title') or task_id}", flush=True)
    set_task_status(base_url, task_id, "in progress")
    note = get_task_note(base_url, task_id)
    prompt = build_prompt(task, note)

    exit_code = run_automation_command(command, workspace, task, prompt)
    if exit_code == 0:
        set_task_status(base_url, task_id, "done")
        print(f"[automation] Aufgabe erledigt: {task_id}", flush=True)
    else:
        set_task_status(base_url, task_id, "rejected")
        print(f"[automation] Aufgabe fehlgeschlagen: {task_id}, Exit-Code {exit_code}", flush=True)
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description="Eldran Auto-Notizen Worker")
    parser.add_argument("--base-url", default=os.environ.get("ELDRAN_AUTOMATION_BASE_URL", DEFAULT_BASE_URL))
    parser.add_argument("--interval", type=int, default=int(os.environ.get("ELDRAN_AUTOMATION_INTERVAL", DEFAULT_INTERVAL_SECONDS)))
    parser.add_argument("--workspace", default=os.environ.get("ELDRAN_AUTOMATION_WORKSPACE", os.getcwd()))
    parser.add_argument("--command", default=os.environ.get("ELDRAN_AUTOMATION_COMMAND", ""))
    parser.add_argument("--once", action="store_true")
    args = parser.parse_args()

    workspace = Path(args.workspace).resolve()
    print(f"[automation] Worker aktiv. URL={args.base_url} Workspace={workspace}", flush=True)
    if not args.command:
        print("[automation] Kein Agent-Befehl gesetzt. Setze ELDRAN_AUTOMATION_COMMAND.", flush=True)

    while True:
        try:
            process_one_open_task(args.base_url, args.command, workspace)
        except urllib.error.HTTPError as exc:
            print(f"[automation] HTTP {exc.code}: {exc.reason}", flush=True)
        except Exception as exc:
            print(f"[automation] Fehler: {exc}", flush=True)

        if args.once:
            return 0
        time.sleep(max(5, args.interval))


if __name__ == "__main__":
    raise SystemExit(main())
