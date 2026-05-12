const notesList = document.getElementById("notesList");
const notesDirectory = document.getElementById("notesDirectory");
const notesStatusBadge = document.getElementById("notesStatusBadge");
const noteCreateButton = document.getElementById("noteCreateButton");
const noteSaveButton = document.getElementById("noteSaveButton");
const noteDeleteButton = document.getElementById("noteDeleteButton");
const noteTitleInput = document.getElementById("noteTitleInput");
const noteContentInput = document.getElementById("noteContentInput");
const noteEditorHeading = document.getElementById("noteEditorHeading");
const noteFileMeta = document.getElementById("noteFileMeta");
const automationRefreshButton = document.getElementById("automationRefreshButton");
const automationTasksList = document.getElementById("automationTasksList");

let currentNotes = [];
let currentAutomationTasks = [];
let currentNoteId = "";

function setNotesStatus(text) {
  notesStatusBadge.textContent = text;
}

function formatNoteDate(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderNotesList() {
  notesList.innerHTML = "";
  if (!currentNotes.length) {
    notesList.innerHTML = `<div class="empty-state">Noch keine Notizen vorhanden.</div>`;
    return;
  }
  for (const note of currentNotes) {
    const button = document.createElement("button");
    button.className = `chat-list-item note-list-item${note.id === currentNoteId ? " active" : ""}`;
    button.type = "button";
    const title = document.createElement("span");
    title.className = "note-list-title";
    title.textContent = note.title || "Ohne Titel";
    const meta = document.createElement("span");
    meta.className = "file-meta";
    meta.textContent = formatNoteDate(note.updated_at);
    button.append(title, meta);
    button.addEventListener("click", () => {
      loadNote(note.id).catch((error) => setNotesStatus(error.message));
    });
    notesList.appendChild(button);
  }
}

function automationStatusLabel(status) {
  if (status === "offen") return "offen";
  if (status === "in progress") return "in bearbeitung";
  if (status === "done") return "erledigt";
  if (status === "rejected") return "abgelehnt";
  return status || "offen";
}

function automationPrompt(task, note) {
  return [
    "Bitte lies diese Auto-Notiz und setze den Verbesserungswunsch um.",
    "",
    `Titel: ${note?.title || task.title}`,
    `Status: ${task.status || "offen"}`,
    "",
    note?.content || task.summary || "",
    "",
    "Bitte nach der Umsetzung testen und die geaenderten Dateien nach D:\\Eldran\\Web kopieren.",
  ].join("\n");
}

async function copyAutomationPrompt(task) {
  const data = await fetchJson(`/api/notes/${encodeURIComponent(task.id)}`);
  const prompt = automationPrompt(task, data.note);
  await navigator.clipboard.writeText(prompt);
  setNotesStatus("Auftrag in die Zwischenablage kopiert.");
}

function renderAutomationTasks() {
  automationTasksList.innerHTML = "";
  if (!currentAutomationTasks.length) {
    automationTasksList.innerHTML = `<div class="empty-state">Keine Auto-Aufgaben erkannt.</div>`;
    return;
  }
  for (const task of currentAutomationTasks) {
    const card = document.createElement("article");
    card.className = `automation-task-card automation-status-${String(task.status || "offen").replaceAll(" ", "-")}`;
    const header = document.createElement("div");
    header.className = "automation-task-header";
    const title = document.createElement("button");
    title.type = "button";
    title.className = "automation-task-title";
    title.textContent = task.title || "Auto-Aufgabe";
    title.addEventListener("click", () => loadNote(task.id).catch((error) => setNotesStatus(error.message)));
    const status = document.createElement("span");
    status.className = "automation-task-status";
    status.textContent = automationStatusLabel(task.status);
    header.append(title, status);

    const summary = document.createElement("p");
    summary.textContent = task.summary || "";

    const actions = document.createElement("div");
    actions.className = "automation-task-actions";
    const promptButton = document.createElement("button");
    promptButton.type = "button";
    promptButton.className = "ghost-button compact-button";
    promptButton.textContent = "Prompt kopieren";
    promptButton.addEventListener("click", () => copyAutomationPrompt(task).catch((error) => setNotesStatus(error.message)));
    const workButton = document.createElement("button");
    workButton.type = "button";
    workButton.className = "ghost-button compact-button";
    workButton.textContent = "In Bearbeitung";
    workButton.disabled = task.status === "in progress" || task.status === "done";
    workButton.addEventListener("click", () => setAutomationTaskStatus(task.id, "in progress").catch((error) => setNotesStatus(error.message)));
    const doneButton = document.createElement("button");
    doneButton.type = "button";
    doneButton.className = "ghost-button compact-button";
    doneButton.textContent = "Done";
    doneButton.disabled = task.status === "done";
    doneButton.addEventListener("click", () => setAutomationTaskStatus(task.id, "done").catch((error) => setNotesStatus(error.message)));
    actions.append(promptButton, workButton, doneButton);

    card.append(header, summary, actions);
    automationTasksList.appendChild(card);
  }
}

function setEditor(note) {
  currentNoteId = note?.id || "";
  noteTitleInput.value = note?.title || "";
  noteContentInput.value = note?.content || "";
  noteEditorHeading.textContent = note?.title || "Neue Notiz";
  noteFileMeta.textContent = note?.file_path ? `Datei: ${note.file_path}` : "Neue Notiz ist noch nicht gespeichert.";
  noteDeleteButton.disabled = !currentNoteId;
  renderNotesList();
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Anfrage fehlgeschlagen.");
  }
  return data;
}

async function loadNotes(preferredNoteId = currentNoteId) {
  setNotesStatus("Notizen werden geladen...");
  const data = await fetchJson("/api/notes");
  currentNotes = data.notes || [];
  notesDirectory.textContent = data.directory ? `Ordner: ${data.directory}` : "Ordner nicht bekannt.";
  renderNotesList();
  if (preferredNoteId && currentNotes.some((note) => note.id === preferredNoteId)) {
    await loadNote(preferredNoteId);
  } else if (currentNotes.length && !currentNoteId) {
    await loadNote(currentNotes[0].id);
  } else {
    setNotesStatus("Bereit");
  }
  await loadAutomationTasks();
}

async function loadNote(noteId) {
  setNotesStatus("Notiz wird geladen...");
  const data = await fetchJson(`/api/notes/${encodeURIComponent(noteId)}`);
  setEditor(data.note);
  setNotesStatus("Bereit");
}

async function saveCurrentNote() {
  const payload = {
    title: noteTitleInput.value.trim(),
    content: noteContentInput.value,
  };
  if (!payload.title) {
    setNotesStatus("Titel fehlt.");
    noteTitleInput.focus();
    return;
  }
  setNotesStatus("Notiz wird gespeichert...");
  const data = currentNoteId
    ? await fetchJson(`/api/notes/${encodeURIComponent(currentNoteId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    : await fetchJson("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  setEditor(data.note);
  await loadNotes(data.note.id);
  setNotesStatus("Gespeichert");
}

async function loadAutomationTasks() {
  const data = await fetchJson("/api/notes/automation/tasks");
  currentAutomationTasks = data.tasks || [];
  renderAutomationTasks();
}

async function setAutomationTaskStatus(noteId, status) {
  setNotesStatus("Auto-Aufgabe wird aktualisiert...");
  await fetchJson(`/api/notes/automation/tasks/${encodeURIComponent(noteId)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  await loadNotes(noteId);
  setNotesStatus("Auto-Aufgabe aktualisiert.");
}

async function deleteCurrentNote() {
  if (!currentNoteId) {
    return;
  }
  const title = noteTitleInput.value.trim() || "diese Notiz";
  if (!window.confirm(`Notiz "${title}" wirklich loeschen?`)) {
    return;
  }
  setNotesStatus("Notiz wird geloescht...");
  await fetchJson(`/api/notes/${encodeURIComponent(currentNoteId)}`, { method: "DELETE" });
  currentNoteId = "";
  setEditor(null);
  await loadNotes("");
  setNotesStatus("Geloescht");
}

noteCreateButton.addEventListener("click", () => {
  setEditor({ title: "Neue Notiz", content: "" });
  noteTitleInput.focus();
  noteTitleInput.select();
});

noteSaveButton.addEventListener("click", () => {
  saveCurrentNote().catch((error) => setNotesStatus(error.message));
});

noteDeleteButton.addEventListener("click", () => {
  deleteCurrentNote().catch((error) => setNotesStatus(error.message));
});

automationRefreshButton.addEventListener("click", () => {
  loadAutomationTasks().catch((error) => setNotesStatus(error.message));
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveCurrentNote().catch((error) => setNotesStatus(error.message));
  }
});

initializeAuthUi({ required: true })
  .then(async (user) => {
    if (user?.role !== "admin") {
      setNotesStatus("Admin-Rechte erforderlich.");
      return;
    }
    setEditor(null);
    await loadNotes();
  })
  .catch((error) => {
    setNotesStatus(error.message || "Anmeldung erforderlich.");
  });
