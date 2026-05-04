function normalizeMentionValue(value) {
  return String(value || "").trim().toLocaleLowerCase();
}

function messageMentionsCurrentUser(messageContent, currentUsername) {
  const normalizedUsername = normalizeMentionValue(currentUsername);
  if (!normalizedUsername) {
    return false;
  }

  const normalizedContent = normalizeMentionValue(messageContent);
  if (!normalizedContent) {
    return false;
  }

  const tokens = normalizedContent.match(/@?[\p{L}\p{N}_-]+/gu) || [];
  return tokens.some((token) => token.replace(/^@/, "") === normalizedUsername);
}

function messageSignature(message) {
  return `${message.created_at}|${message.role}|${message.username}|${message.content}`;
}

function isRollResultMessage(message) {
  return message?.role === "system" && /\bwuerfelt\b/i.test(String(message?.content || ""));
}

function normalizeRollExpression(expression) {
  return String(expression || "").replace(/\s+/g, "").replace(/^\+/, "").toLocaleLowerCase();
}

function parseRollExpression(expression) {
  const normalizedExpression = normalizeRollExpression(expression);
  if (!normalizedExpression) {
    return null;
  }
  const tokenPattern = /([+-]?)(?:(\d*)d(100|20|12|10|8|6|4|2)|(\d+))/iy;
  const tokens = [];
  let position = 0;
  while (position < normalizedExpression.length) {
    tokenPattern.lastIndex = position;
    const match = tokenPattern.exec(normalizedExpression);
    if (!match || match.index !== position) {
      return null;
    }
    const sign = match[1] === "-" ? -1 : 1;
    if (match[3]) {
      tokens.push({
        kind: "dice",
        sign,
        count: Number.parseInt(match[2] || "1", 10),
        sides: Number.parseInt(match[3], 10),
      });
    } else {
      tokens.push({
        kind: "flat",
        value: sign * Number.parseInt(match[4], 10),
      });
    }
    position = tokenPattern.lastIndex;
  }
  return {
    expression: normalizedExpression,
    tokens,
  };
}

function parseRollBreakdown(breakdown) {
  return (String(breakdown || "").match(/[+-]?\d+/g) || []).map((value) => Number.parseInt(value, 10));
}

function parseRollMessageData(content) {
  const match = /^(.+?) wuerfelt ([^:]+):\s*(.+?)\s*=\s*(-?\d+)\s*$/i.exec(String(content || ""));
  if (!match) {
    return null;
  }
  const [, username, rawExpression, rawBreakdown, rawTotal] = match;
  const parsedExpression = parseRollExpression(rawExpression);
  const breakdownValues = parseRollBreakdown(rawBreakdown);
  if (!parsedExpression || !breakdownValues.length) {
    return null;
  }

  let cursor = 0;
  const items = [];
  for (const token of parsedExpression.tokens) {
    if (token.kind === "dice") {
      for (let index = 0; index < token.count; index += 1) {
        const rolledValue = breakdownValues[cursor];
        if (!Number.isFinite(rolledValue)) {
          return null;
        }
        items.push({
          kind: "dice",
          sides: token.sides,
          value: Math.abs(rolledValue),
          signedValue: rolledValue,
        });
        cursor += 1;
      }
      continue;
    }
    const flatValue = breakdownValues[cursor];
    if (!Number.isFinite(flatValue)) {
      return null;
    }
    items.push({
      kind: "flat",
      value: flatValue,
    });
    cursor += 1;
  }

  if (cursor !== breakdownValues.length) {
    return null;
  }

  return {
    username,
    expression: parsedExpression.expression,
    breakdown: String(rawBreakdown || "").trim(),
    total: Number.parseInt(rawTotal, 10),
    items,
  };
}

let rollOverlayRoot = null;
let rollOverlayQueue = [];
let rollOverlayActive = false;
const ROLL_CHIP_STAGGER_MS = 90;
const ROLL_TOTAL_DELAY_BASE_MS = 220;
const ROLL_TOTAL_ANIMATION_MS = 560;
const ROLL_VISIBLE_AFTER_RESULT_MS = 1800;

function getRollTotalDelayMs(parsed) {
  return Math.max(parsed.items.length - 1, 0) * ROLL_CHIP_STAGGER_MS + ROLL_TOTAL_DELAY_BASE_MS;
}

function ensureRollOverlayRoot() {
  if (rollOverlayRoot) {
    return rollOverlayRoot;
  }
  rollOverlayRoot = document.createElement("div");
  rollOverlayRoot.className = "command-roll-overlay hidden";
  document.body.appendChild(rollOverlayRoot);
  return rollOverlayRoot;
}

function buildRollOverlay(parsed) {
  const card = document.createElement("div");
  card.className = "command-roll-overlay-card";

  const title = document.createElement("div");
  title.className = "command-roll-overlay-title";
  title.textContent = `${parsed.username} wuerfelt`;

  const summary = document.createElement("div");
  summary.className = "command-roll-summary";

  const expression = document.createElement("div");
  expression.className = "command-roll-expression";
  expression.textContent = parsed.expression;

  const total = document.createElement("div");
  total.className = "command-roll-total";
  total.textContent = parsed.total;
  total.style.setProperty("--roll-total-delay", `${getRollTotalDelayMs(parsed)}ms`);

  summary.append(expression, total);

  const tray = document.createElement("div");
  tray.className = "command-roll-tray";

  parsed.items.forEach((item, index) => {
    const chip = document.createElement("div");
    chip.className = `command-roll-chip ${item.kind === "dice" ? "dice" : "modifier"}${item.value < 0 || item.signedValue < 0 ? " negative" : ""}`;
    chip.style.setProperty("--roll-index", String(index));

    const value = document.createElement("div");
    value.className = "command-roll-chip-value";
    value.textContent = item.kind === "dice"
      ? `${item.signedValue < 0 ? "-" : ""}${item.value}`
      : `${item.value > 0 ? "+" : ""}${item.value}`;

    const meta = document.createElement("div");
    meta.className = "command-roll-chip-meta";
    meta.textContent = item.kind === "dice" ? `d${item.sides}` : (item.value < 0 ? "Malus" : "Bonus");

    chip.append(value, meta);
    tray.appendChild(chip);
  });

  const equation = document.createElement("div");
  equation.className = "command-roll-equation";
  equation.textContent = `${parsed.breakdown} = ${parsed.total}`;

  card.append(title, tray, summary, equation);
  return card;
}

function runNextRollOverlay() {
  if (rollOverlayActive || !rollOverlayQueue.length) {
    return;
  }

  const parsed = rollOverlayQueue.shift();
  const root = ensureRollOverlayRoot();
  rollOverlayActive = true;
  root.innerHTML = "";
  root.appendChild(buildRollOverlay(parsed));
  root.classList.remove("hidden");
  root.classList.remove("active");
  void root.offsetWidth;
  root.classList.add("active");
  const overlayDurationMs = getRollTotalDelayMs(parsed) + ROLL_TOTAL_ANIMATION_MS + ROLL_VISIBLE_AFTER_RESULT_MS;

  window.setTimeout(() => {
    root.classList.remove("active");
    window.setTimeout(() => {
      if (!rollOverlayQueue.length) {
        root.classList.add("hidden");
      }
      rollOverlayActive = false;
      runNextRollOverlay();
    }, 240);
  }, overlayDurationMs);
}

function queueRollOverlay(message) {
  const parsed = parseRollMessageData(message.content);
  if (!parsed) {
    return;
  }
  rollOverlayQueue.push(parsed);
  runNextRollOverlay();
}

function renderCommandMessage(message, animateRoll = false) {
  const article = document.createElement("article");
  article.className = `command-message ${message.role}`;
  const currentUsername = globalThis.currentUsername || "";
  if (messageMentionsCurrentUser(message.content, currentUsername)) {
    article.classList.add("mentioned");
  }

  const role = document.createElement("div");
  role.className = "command-message-role";
  role.textContent = message.username
    ? `${message.role === "system" ? "System" : "Chat"} · ${message.username}`
    : (message.role === "system" ? "System" : "Chat");

  const content = document.createElement("div");
  content.className = "command-message-content";
  content.textContent = message.content;

  article.append(role, content);
  return article;
}

function initCommandChat({
  listElement,
  formElement,
  inputElement,
  statusElement,
  clearButton = null,
}) {
  let lastSignature = "";
  let previousMessageSignatures = new Set();
  let hasHydrated = false;

  function renderMessages(messages) {
    const messageSignatures = messages.map((message) => messageSignature(message));
    const signature = messageSignatures.join("\n");
    if (signature === lastSignature) {
      return;
    }
    lastSignature = signature;

    listElement.innerHTML = "";
    for (let index = 0; index < messages.length; index += 1) {
      const message = messages[index];
      const signatureItem = messageSignatures[index];
      const animateRoll = hasHydrated && isRollResultMessage(message) && !previousMessageSignatures.has(signatureItem);
      listElement.appendChild(renderCommandMessage(message, animateRoll));
      if (animateRoll) {
        queueRollOverlay(message);
      }
    }
    previousMessageSignatures = new Set(messageSignatures);
    hasHydrated = true;
    listElement.scrollTop = listElement.scrollHeight;
  }

  async function loadMessages() {
    const response = await fetch(`/api/command-chat?ts=${Date.now()}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Befehls-Chat konnte nicht geladen werden.");
    }
    renderMessages(data.messages || []);
  }

  async function sendMessage(message) {
    const response = await fetch("/api/command-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Befehl konnte nicht gesendet werden.");
    }
    await loadMessages();
  }

  async function clearMessages() {
    const response = await fetch("/api/command-chat", {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Befehls-Chat konnte nicht geleert werden.");
    }
    lastSignature = "";
    previousMessageSignatures = new Set();
    rollOverlayQueue = [];
    rollOverlayActive = false;
    if (rollOverlayRoot) {
      rollOverlayRoot.classList.remove("active");
      rollOverlayRoot.classList.add("hidden");
      rollOverlayRoot.innerHTML = "";
    }
    listElement.innerHTML = "";
    await loadMessages();
  }

  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = inputElement.value.trim();
    if (!message) {
      return;
    }

    inputElement.disabled = true;
    statusElement.textContent = "Laeuft...";
    try {
      await sendMessage(message);
      inputElement.value = "";
      statusElement.textContent = "Bereit";
    } catch (error) {
      statusElement.textContent = error.message;
    } finally {
      inputElement.disabled = false;
      inputElement.focus();
    }
  });

  if (clearButton) {
    clearButton.addEventListener("click", async () => {
      clearButton.disabled = true;
      statusElement.textContent = "Leert...";
      try {
        await clearMessages();
        statusElement.textContent = "Bereit";
      } catch (error) {
        statusElement.textContent = error.message;
      } finally {
        clearButton.disabled = false;
      }
    });
  }

  loadMessages()
    .then(() => {
      statusElement.textContent = "Bereit";
    })
    .catch((error) => {
      statusElement.textContent = error.message;
    });

  setInterval(() => {
    loadMessages().catch(() => {});
  }, 3000);
}
