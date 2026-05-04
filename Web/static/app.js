const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messagesContainer = document.getElementById("messages");
const sendButton = document.getElementById("sendButton");
const statusBadge = document.getElementById("statusBadge");
const fileList = document.getElementById("fileList");
const folderPathInput = document.getElementById("folderPathInput");
const importFolderButton = document.getElementById("importFolderButton");
const reloadFolderButton = document.getElementById("reloadFolderButton");
const projectSelect = document.getElementById("projectSelect");
const projectNameInput = document.getElementById("projectNameInput");
const projectCreateButton = document.getElementById("projectCreateButton");
const projectPlayerList = document.getElementById("projectPlayerList");
const projectStatus = document.getElementById("projectStatus");
const folderStatus = document.getElementById("folderStatus");
const temperatureInput = document.getElementById("temperatureInput");
const temperatureValue = document.getElementById("temperatureValue");
const chatList = document.getElementById("chatList");
const newChatButton = document.getElementById("newChatButton");

let history = [];
let uploadedFiles = [];
let isBusy = false;
const TEMPERATURE_STORAGE_KEY = "eldran_temperature";
const ACTIVE_CHAT_STORAGE_KEY = "eldran_active_chat_id";
let currentChatId = null;

function setBusy(nextBusyState) {
  isBusy = nextBusyState;
  sendButton.disabled = nextBusyState;
  messageInput.disabled = nextBusyState;
  statusBadge.textContent = nextBusyState ? "Antwort wird erzeugt..." : "Bereit";
}

function updateTemperatureLabel() {
  temperatureValue.textContent = Number(temperatureInput.value).toFixed(1);
}

function getTemperature() {
  return Number(temperatureInput.value);
}

function initializeTemperature(defaultTemperature) {
  const storedValue = localStorage.getItem(TEMPERATURE_STORAGE_KEY);
  const nextValue = storedValue ?? String(defaultTemperature);
  temperatureInput.value = nextValue;
  updateTemperatureLabel();
}

function appendInlineMarkdown(target, text) {
  const parts = text.split(/(\*\*.+?\*\*)/g);
  for (const part of parts) {
    if (!part) {
      continue;
    }
    const match = part.match(/^\*\*(.+?)\*\*$/);
    if (match) {
      const strong = document.createElement("strong");
      strong.textContent = match[1];
      target.appendChild(strong);
      continue;
    }
    target.appendChild(document.createTextNode(part));
  }
}

function createMarkdownFragment(content) {
  const lines = content.split(/\r?\n/);
  const fragment = document.createDocumentFragment();
  let listItems = [];
  let paragraphLines = [];

  function isSectionLabel(text) {
    return /^\*\*[^*]+\*\*:?\s*$/.test(text.trim());
  }

  function flushList() {
    if (!listItems.length) {
      return;
    }
    const list = document.createElement("ul");
    for (const item of listItems) {
      const li = document.createElement("li");
      appendInlineMarkdown(li, item);
      list.appendChild(li);
    }
    fragment.appendChild(list);
    listItems = [];
  }

  function flushParagraph() {
    if (!paragraphLines.length) {
      return;
    }
    const paragraph = document.createElement("p");
    paragraphLines.forEach((line, index) => {
      if (index > 0) {
        paragraph.appendChild(document.createElement("br"));
      }
      appendInlineMarkdown(paragraph, line);
    });
    fragment.appendChild(paragraph);
    paragraphLines = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushParagraph();
      continue;
    }

    if (isSectionLabel(trimmed)) {
      flushList();
      flushParagraph();
      const heading = document.createElement("h3");
      heading.textContent = trimmed.replace(/^\*\*/, "").replace(/\*\*:?\s*$/, "");
      fragment.appendChild(heading);
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList();
      flushParagraph();
      const level = headingMatch[1].length;
      const heading = document.createElement(`h${level}`);
      appendInlineMarkdown(heading, headingMatch[2]);
      fragment.appendChild(heading);
      continue;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      listItems.push(listMatch[1]);
      continue;
    }

    flushList();
    paragraphLines.push(trimmed);
  }

  flushList();
  flushParagraph();
  return fragment;
}

function appendWikiReferences(article, sources) {
  const wikiSources = sources.filter((source) => source.url);
  if (!wikiSources.length) {
    return;
  }

  const uniqueSources = [];
  const seen = new Set();
  for (const source of wikiSources) {
    const key = `${source.url}|${source.page_title || source.file_name}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    uniqueSources.push(source);
  }

  const block = document.createElement("div");
  block.className = "message-sources";

  const label = document.createElement("div");
  label.className = "message-role";
  label.textContent = "Wiki";
  block.appendChild(label);

  for (const source of uniqueSources) {
    const link = document.createElement("a");
    link.className = "source-chip";
    link.href = source.url;
    link.textContent = source.page_title || source.file_name;
    block.appendChild(link);
  }

  article.appendChild(block);
}

function appendMessage(role, content, sources = []) {
  const article = document.createElement("article");
  article.className = `message ${role}`;

  const roleLabel = document.createElement("div");
  roleLabel.className = "message-role";
  roleLabel.textContent = role === "user" ? "Du" : "Eldran";

  const messageBody = document.createElement("div");
  messageBody.className = "message-content";
  messageBody.appendChild(createMarkdownFragment(content));

  article.append(roleLabel, messageBody);
  appendWikiReferences(article, sources);

  if (sources.length) {
    const sourcesBlock = document.createElement("div");
    sourcesBlock.className = "message-sources";
    for (const source of sources) {
      const sourceChip = document.createElement(source.url ? "a" : "div");
      sourceChip.className = "source-chip";
      sourceChip.textContent = source.url
        ? `${source.label}: ${source.page_title || source.file_name}, ${source.section_label || `Abschnitt ${source.chunk_index}`}`
        : `${source.label}: ${source.file_name}, Abschnitt ${source.chunk_index}`;
      if (source.url) {
        sourceChip.href = source.url;
      }
      sourcesBlock.appendChild(sourceChip);
    }
    article.appendChild(sourcesBlock);
  }

  messagesContainer.appendChild(article);
  article.scrollIntoView({ block: "start", behavior: "smooth" });
}

function autoresize() {
  messageInput.style.height = "auto";
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 220)}px`;
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function renderFiles() {
  if (!fileList) {
    return;
  }
  if (!uploadedFiles.length) {
    fileList.innerHTML = `<div class="file-meta">Noch keine Dateien vorhanden.</div>`;
    return;
  }

  fileList.innerHTML = "";
  for (const file of uploadedFiles) {
    const card = document.createElement("article");
    card.className = "file-card";

    const name = document.createElement("div");
    name.className = "file-name";
    name.textContent = file.original_name;

    const meta = document.createElement("div");
    meta.className = "file-meta";
    meta.textContent = `${formatBytes(file.size_bytes)}${file.content_type ? ` · ${file.content_type}` : ""}`;

    const source = document.createElement("div");
    source.className = "file-meta";
    source.textContent = file.source_type === "folder" ? (file.source_path || "Ordnerimport") : "Manueller Upload";

    const badge = document.createElement("div");
    badge.className = "file-badge";
    badge.textContent = file.has_text ? `${file.chunk_count} Abschnitte indexiert` : "nur gespeichert";

    card.append(name, meta, source, badge);
    fileList.appendChild(card);
  }
}

function setCurrentChat(chatId) {
  currentChatId = chatId;
  if (chatId) {
    localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, chatId);
  } else {
    localStorage.removeItem(ACTIVE_CHAT_STORAGE_KEY);
  }
}

function clearMessages() {
  messagesContainer.innerHTML = "";
}

function appendWelcomeMessage() {
  appendMessage("assistant", "Ich bin bereit. Frag mich nach Orten, NPCs, Quests oder Weltinformationen.");
}

function renderChatList(chats) {
  if (!chats.length) {
    chatList.innerHTML = `<div class="file-meta">Noch keine gespeicherten Chats.</div>`;
    return;
  }

  chatList.innerHTML = "";
  for (const chat of chats) {
    const row = document.createElement("div");
    row.className = `chat-list-row${chat.id === currentChatId ? " active" : ""}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = `chat-list-item${chat.id === currentChatId ? " active" : ""}`;
    button.textContent = chat.title;
    button.addEventListener("click", async () => {
      await loadChat(chat.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "chat-delete-button";
    deleteButton.textContent = "Loeschen";
    deleteButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      await deleteExistingChat(chat.id);
    });

    row.append(button, deleteButton);
    chatList.appendChild(row);
  }
}

async function loadChats() {
  const response = await fetch("/api/chats");
  const data = await response.json();
  renderChatList(data.chats || []);
  return data.chats || [];
}

async function refreshActiveChatState() {
  if (isBusy) {
    return;
  }
  const chats = await loadChats();
  const savedChatId = localStorage.getItem(ACTIVE_CHAT_STORAGE_KEY);
  const preferredChatId = savedChatId || currentChatId;

  if (preferredChatId && chats.some((chat) => chat.id === preferredChatId)) {
    await loadChat(preferredChatId);
    return;
  }
  if (chats.length) {
    await loadChat(chats[0].id);
    return;
  }
  await createNewChat();
}

async function loadChat(chatId) {
  const response = await fetch(`/api/chats/${chatId}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Chat konnte nicht geladen werden.");
  }

  setCurrentChat(data.id);
  history = data.messages.map((message) => ({ role: message.role, content: message.content }));
  clearMessages();
  for (const message of data.messages) {
    appendMessage(message.role, message.content, message.sources || []);
  }
  if (!data.messages.length) {
    appendWelcomeMessage();
  }
  await loadChats();
}

async function createNewChat() {
  const response = await fetch("/api/chats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Neuer Chat" }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Chat konnte nicht erstellt werden.");
  }

  setCurrentChat(data.id);
  history = [];
  clearMessages();
  appendWelcomeMessage();
  await loadChats();
}

async function deleteExistingChat(chatId) {
  const response = await fetch(`/api/chats/${chatId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Chat konnte nicht geloescht werden.");
  }

  if (currentChatId === chatId) {
    setCurrentChat(null);
    history = [];
    clearMessages();
  }

  const chats = await loadChats();
  if (chats.length) {
    await loadChat(chats[0].id);
    return;
  }
  await createNewChat();
}

async function loadFiles() {
  const response = await fetch("/api/files");
  const data = await response.json();
  uploadedFiles = data.files;
  renderFiles();
}

async function loadHealth() {
  const response = await fetch("/api/health");
  const data = await response.json();
  if (data.import_folder_path) {
    folderPathInput.value = data.import_folder_path;
  }
  initializeTemperature(data.default_temperature ?? 0);
}

async function importFolder(path, reloadOnly = false) {
  folderStatus.textContent = reloadOnly ? "Ordner wird neu eingelesen..." : "Ordner wird eingelesen...";

  const endpoint = reloadOnly ? "/api/import-folder/reload" : "/api/import-folder";
  const options = reloadOnly
    ? { method: "POST" }
    : {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder_path: path }),
      };

  const response = await fetch(endpoint, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Ordnerimport fehlgeschlagen.");
  }

  folderPathInput.value = data.folder_path;
  folderStatus.textContent = `${data.imported} Dateien eingelesen, ${data.skipped} uebersprungen.`;
  await loadFiles();
  appendMessage("assistant", `Ordner importiert: ${data.folder_path}`);
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (isBusy) {
    return;
  }

  const message = messageInput.value.trim();
  if (!message) {
    return;
  }

  appendMessage("user", message);
  history.push({ role: "user", content: message });
  messageInput.value = "";
  autoresize();
  setBusy(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: history.slice(0, -1),
        file_ids: uploadedFiles.filter((file) => file.has_text).map((file) => file.id),
        temperature: getTemperature(),
        chat_id: currentChatId,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || `Serverfehler ${response.status}`);
    }

    appendMessage("assistant", data.response, data.sources || []);
    setCurrentChat(data.chat_id);
    await loadChats();
    history.push({ role: "assistant", content: data.response });
  } catch (error) {
    appendMessage("assistant", `Fehler: ${error.message}`);
    history.pop();
  } finally {
    setBusy(false);
    messageInput.focus();
  }
});

messageInput.addEventListener("input", autoresize);

messageInput.addEventListener("keydown", (event) => {
  if (isBusy) {
    event.preventDefault();
    return;
  }
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

importFolderButton.addEventListener("click", async () => {
  const path = folderPathInput.value.trim();
  if (!path) {
    folderStatus.textContent = "Bitte zuerst einen Ordnerpfad eingeben.";
    return;
  }

  try {
    await importFolder(path, false);
  } catch (error) {
    folderStatus.textContent = error.message;
  }
});

reloadFolderButton.addEventListener("click", async () => {
  try {
    await importFolder(folderPathInput.value.trim(), true);
  } catch (error) {
    folderStatus.textContent = error.message;
  }
});

temperatureInput.addEventListener("input", () => {
  updateTemperatureLabel();
  localStorage.setItem(TEMPERATURE_STORAGE_KEY, temperatureInput.value);
});

newChatButton.addEventListener("click", async () => {
  try {
    await createNewChat();
  } catch (error) {
    appendMessage("assistant", `Fehler: ${error.message}`);
  }
});

autoresize();
initializeAuthUi({ required: false })
  .then(async () => {
    initProjectSelector({
      selectElement: projectSelect,
      createInputElement: projectNameInput,
      createButtonElement: projectCreateButton,
      playerListElement: projectPlayerList,
      statusElement: projectStatus,
      onProjectChanged: async () => {
        await refreshActiveChatState();
      },
    });
    await loadFiles();
    await loadHealth();
    await refreshActiveChatState();
  })
  .catch(() => {
    clearMessages();
    appendWelcomeMessage();
  });

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    refreshActiveChatState().catch(() => {});
  }
});

window.addEventListener("focus", () => {
  refreshActiveChatState().catch(() => {});
});

window.addEventListener("storage", (event) => {
  if (event.key === ACTIVE_CHAT_STORAGE_KEY) {
    refreshActiveChatState().catch(() => {});
  }
});

window.addEventListener("eldran:project-changed", () => {
  refreshActiveChatState().catch(() => {});
});

statusBadge.textContent = "Bereit";
