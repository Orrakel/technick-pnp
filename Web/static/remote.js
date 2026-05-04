const remoteChatForm = document.getElementById("remoteChatForm");
const remoteMessageInput = document.getElementById("remoteMessageInput");
const remoteMessages = document.getElementById("remoteMessages");
const remoteSendButton = document.getElementById("remoteSendButton");
const remoteChatList = document.getElementById("remoteChatList");
const remoteNewChatButton = document.getElementById("remoteNewChatButton");

let remoteHistory = [];
let isRemoteBusy = false;
const REMOTE_CLIENT_ID_STORAGE_KEY = "eldran_remote_client_id";
const REMOTE_ACTIVE_CHAT_STORAGE_KEY = "eldran_remote_active_chat_id";
let remoteCurrentChatId = null;

function getRemoteClientId() {
  let clientId = sessionStorage.getItem(REMOTE_CLIENT_ID_STORAGE_KEY);
  if (clientId) {
    return clientId;
  }

  clientId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  sessionStorage.setItem(REMOTE_CLIENT_ID_STORAGE_KEY, clientId);
  return clientId;
}

const remoteClientId = getRemoteClientId();

function setRemoteBusy(isBusy) {
  isRemoteBusy = isBusy;
  remoteSendButton.disabled = isBusy;
  remoteMessageInput.disabled = isBusy;
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

function appendRemoteWikiReferences(article, sources) {
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

function appendRemoteMessage(role, content, sources = []) {
  const article = document.createElement("article");
  article.className = `message ${role}`;

  const roleLabel = document.createElement("div");
  roleLabel.className = "message-role";
  roleLabel.textContent = role === "user" ? "Du" : "Eldran";

  const body = document.createElement("div");
  body.className = "message-content";
  body.appendChild(createMarkdownFragment(content));

  article.append(roleLabel, body);
  appendRemoteWikiReferences(article, sources);

  if (sources.length) {
    const sourcesBlock = document.createElement("div");
    sourcesBlock.className = "message-sources";
    for (const source of sources) {
      const chip = document.createElement(source.url ? "a" : "div");
      chip.className = "source-chip";
      chip.textContent = source.url
        ? `${source.label}: ${source.page_title || source.file_name}, ${source.section_label || `Abschnitt ${source.chunk_index}`}`
        : `${source.label}: ${source.file_name}, Abschnitt ${source.chunk_index}`;
      if (source.url) {
        chip.href = source.url;
      }
      sourcesBlock.appendChild(chip);
    }
    article.appendChild(sourcesBlock);
  }

  remoteMessages.appendChild(article);
  article.scrollIntoView({ block: "start", behavior: "smooth" });
}

function autoresizeRemote() {
  remoteMessageInput.style.height = "auto";
  remoteMessageInput.style.height = `${Math.min(remoteMessageInput.scrollHeight, 220)}px`;
}

function setRemoteCurrentChat(chatId) {
  remoteCurrentChatId = chatId;
  if (chatId) {
    sessionStorage.setItem(REMOTE_ACTIVE_CHAT_STORAGE_KEY, chatId);
  } else {
    sessionStorage.removeItem(REMOTE_ACTIVE_CHAT_STORAGE_KEY);
  }
}

function clearRemoteMessages() {
  remoteMessages.innerHTML = "";
}

function appendRemoteWelcomeMessage() {
  appendRemoteMessage("assistant", "Ich bin bereit. Stelle mir deine Frage zu Nova Gaia.");
}

function renderRemoteChatList(chats) {
  if (!chats.length) {
    remoteChatList.innerHTML = `<div class="file-meta">Noch keine gespeicherten Chats.</div>`;
    return;
  }

  remoteChatList.innerHTML = "";
  for (const chat of chats) {
    const row = document.createElement("div");
    row.className = `chat-list-row${chat.id === remoteCurrentChatId ? " active" : ""}`;

    const button = document.createElement("button");
    button.type = "button";
    button.className = `chat-list-item${chat.id === remoteCurrentChatId ? " active" : ""}`;
    button.textContent = chat.title;
    button.addEventListener("click", async () => {
      await loadRemoteChat(chat.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "chat-delete-button";
    deleteButton.textContent = "Loeschen";
    deleteButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      await deleteRemoteChat(chat.id);
    });

    row.append(button, deleteButton);
    remoteChatList.appendChild(row);
  }
}

async function loadRemoteChats() {
  const response = await fetch(`/api/chats?scope=remote&client_id=${encodeURIComponent(remoteClientId)}`);
  const data = await response.json();
  renderRemoteChatList(data.chats || []);
  return data.chats || [];
}

async function refreshRemoteActiveChatState() {
  if (isRemoteBusy) {
    return;
  }
  const chats = await loadRemoteChats();
  const savedChatId = sessionStorage.getItem(REMOTE_ACTIVE_CHAT_STORAGE_KEY);
  const preferredChatId = savedChatId || remoteCurrentChatId;

  if (preferredChatId && chats.some((chat) => chat.id === preferredChatId)) {
    await loadRemoteChat(preferredChatId);
    return;
  }
  if (chats.length) {
    await loadRemoteChat(chats[0].id);
    return;
  }
  await createRemoteChat();
}

async function loadRemoteChat(chatId) {
  const response = await fetch(`/api/chats/${chatId}?scope=remote&client_id=${encodeURIComponent(remoteClientId)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Chat konnte nicht geladen werden.");
  }

  setRemoteCurrentChat(data.id);
  remoteHistory = data.messages.map((message) => ({ role: message.role, content: message.content }));
  clearRemoteMessages();
  for (const message of data.messages) {
    appendRemoteMessage(message.role, message.content, message.sources || []);
  }
  if (!data.messages.length) {
    appendRemoteWelcomeMessage();
  }
  await loadRemoteChats();
}

async function createRemoteChat() {
  const response = await fetch("/api/chats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Neuer Chat",
      chat_scope: "remote",
      client_id: remoteClientId,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Chat konnte nicht erstellt werden.");
  }

  setRemoteCurrentChat(data.id);
  remoteHistory = [];
  clearRemoteMessages();
  appendRemoteWelcomeMessage();
  await loadRemoteChats();
}

async function deleteRemoteChat(chatId) {
  const response = await fetch(`/api/chats/${chatId}?scope=remote&client_id=${encodeURIComponent(remoteClientId)}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Chat konnte nicht geloescht werden.");
  }

  if (remoteCurrentChatId === chatId) {
    setRemoteCurrentChat(null);
    remoteHistory = [];
    clearRemoteMessages();
  }

  const chats = await loadRemoteChats();
  if (chats.length) {
    await loadRemoteChat(chats[0].id);
    return;
  }
  await createRemoteChat();
}

remoteChatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (isRemoteBusy) {
    return;
  }
  const message = remoteMessageInput.value.trim();
  if (!message) {
    return;
  }

  appendRemoteMessage("user", message);
  remoteHistory.push({ role: "user", content: message });
  remoteMessageInput.value = "";
  autoresizeRemote();
  setRemoteBusy(true);

  try {
    const filesResponse = await fetch("/api/files");
    const filesData = await filesResponse.json();
    const fileIds = filesData.files.filter((file) => file.has_text).map((file) => file.id);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: remoteHistory.slice(0, -1),
        file_ids: fileIds,
        chat_id: remoteCurrentChatId,
        chat_scope: "remote",
        client_id: remoteClientId,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || `Serverfehler ${response.status}`);
    }

    appendRemoteMessage("assistant", data.response, data.sources || []);
    setRemoteCurrentChat(data.chat_id);
    await loadRemoteChats();
    remoteHistory.push({ role: "assistant", content: data.response });
  } catch (error) {
    appendRemoteMessage("assistant", `Fehler: ${error.message}`);
    remoteHistory.pop();
  } finally {
    setRemoteBusy(false);
    remoteMessageInput.focus();
  }
});

remoteMessageInput.addEventListener("input", autoresizeRemote);
remoteMessageInput.addEventListener("keydown", (event) => {
  if (isRemoteBusy) {
    event.preventDefault();
    return;
  }
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    remoteChatForm.requestSubmit();
  }
});

remoteNewChatButton.addEventListener("click", async () => {
  try {
    await createRemoteChat();
  } catch (error) {
    appendRemoteMessage("assistant", `Fehler: ${error.message}`);
  }
});

initializeAuthUi()
  .then(async () => {
    await refreshRemoteActiveChatState();
  })
  .catch(() => {
    clearRemoteMessages();
    appendRemoteWelcomeMessage();
  });

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    refreshRemoteActiveChatState().catch(() => {});
  }
});

window.addEventListener("focus", () => {
  refreshRemoteActiveChatState().catch(() => {});
});

autoresizeRemote();
