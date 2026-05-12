(function initSheetRolls() {
  const AUTH_TOKEN_STORAGE_KEY = "eldran-auth-token";
  const DICE_TOKEN_PATTERN = /[+-]?\s*\d*\s*[dw]\s*(?:100|20|12|10|8|6|4|2)|[+-]\s*\d+/gi;
  const FIRST_DICE_PATTERN = /\d*\s*[dw]\s*(?:100|20|12|10|8|6|4|2)(?:\s*[+-]\s*\d+)?/i;
  const ROLL_TOKEN_PATTERN = /([+-]?)(?:(\d*)d(100|20|12|10|8|6|4|2)|(\d+))/iy;
  const ROLL_SETTINGS_STORAGE_KEY = "eldran-sheet-roll-settings";
  let currentUsernamePromise = null;
  let currentUserPromise = null;

  function authHeaders() {
    const token = window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  function normalizeRollExpression(expression) {
    return String(expression || "")
      .replace(/w/gi, "d")
      .replace(/\s+/g, "")
      .replace(/^\+/, "");
  }

  function randomInt(maxInclusive) {
    const cryptoApi = window.crypto || window.msCrypto;
    if (cryptoApi?.getRandomValues) {
      const array = new Uint32Array(1);
      const limit = Math.floor(0xffffffff / maxInclusive) * maxInclusive;
      do {
        cryptoApi.getRandomValues(array);
      } while (array[0] >= limit);
      return (array[0] % maxInclusive) + 1;
    }
    return Math.floor(Math.random() * maxInclusive) + 1;
  }

  function parseRollExpression(expression) {
    const normalized = normalizeRollExpression(expression).toLowerCase();
    if (!normalized) return null;
    const tokens = [];
    let position = 0;
    while (position < normalized.length) {
      ROLL_TOKEN_PATTERN.lastIndex = position;
      const match = ROLL_TOKEN_PATTERN.exec(normalized);
      if (!match || match.index !== position) return null;
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
      position = ROLL_TOKEN_PATTERN.lastIndex;
    }
    return { expression: normalized, tokens };
  }

  function signedPart(value, hasPrevious) {
    if (value < 0) return `-${Math.abs(value)}`;
    return hasPrevious ? `+${value}` : String(value);
  }

  function rollSettings() {
    try {
      const stored = JSON.parse(window.localStorage.getItem(ROLL_SETTINGS_STORAGE_KEY) || "{}");
      return {
        d20Mode: ["normal", "advantage", "disadvantage"].includes(stored.d20Mode) ? stored.d20Mode : "normal",
        visibility: ["public", "gmroll", "hiddenroll"].includes(stored.visibility) ? stored.visibility : "public",
      };
    } catch {
      return { d20Mode: "normal", visibility: "public" };
    }
  }

  function saveRollSettings(settings = {}) {
    const current = rollSettings();
    const next = {
      d20Mode: ["normal", "advantage", "disadvantage"].includes(settings.d20Mode) ? settings.d20Mode : current.d20Mode,
      visibility: ["public", "gmroll", "hiddenroll"].includes(settings.visibility) ? settings.visibility : current.visibility,
    };
    window.localStorage.setItem(ROLL_SETTINGS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("eldran:sheet-roll-settings-changed", { detail: next }));
    return next;
  }

  function d20ModeLabel(mode) {
    if (mode === "advantage") return "Vorteil";
    if (mode === "disadvantage") return "Nachteil";
    return "Normal";
  }

  function rollExpression(expression, options = {}) {
    const parsed = parseRollExpression(expression);
    if (!parsed) return null;
    const settings = rollSettings();
    const d20Mode = options.d20Mode || settings.d20Mode;
    const d20TokenCount = parsed.tokens.reduce((count, token) => count + (token.kind === "dice" && token.sides === 20 ? token.count : 0), 0);
    const canUseD20Mode = d20TokenCount === 1 && d20Mode !== "normal";
    const parts = [];
    let total = 0;
    let naturalD20 = null;
    for (const token of parsed.tokens) {
      if (token.kind === "dice") {
        for (let index = 0; index < token.count; index += 1) {
          let value = randomInt(token.sides);
          if (canUseD20Mode && token.sides === 20) {
            const first = value;
            const second = randomInt(20);
            value = d20Mode === "advantage" ? Math.max(first, second) : Math.min(first, second);
            naturalD20 = value;
            const signedValue = value * token.sign;
            total += signedValue;
            parts.push(`${parts.length > 0 && signedValue >= 0 ? "+" : ""}${d20ModeLabel(d20Mode)}(${first},${second})=${signedValue}`);
            continue;
          }
          if (token.sides === 20) {
            naturalD20 = value;
          }
          value *= token.sign;
          total += value;
          parts.push(signedPart(value, parts.length > 0));
        }
        continue;
      }
      total += token.value;
      parts.push(signedPart(token.value, parts.length > 0));
    }
    return {
      expression: parsed.expression,
      breakdown: parts.join(""),
      naturalD20,
      total,
      text: `${parsed.expression} = ${parts.join("")} = ${total}`,
    };
  }

  async function currentUsername() {
    if (!currentUsernamePromise) {
      currentUsernamePromise = currentUser().then((user) => user.username || "");
    }
    return currentUsernamePromise;
  }

  async function currentUser() {
    if (globalThis.currentUserId || globalThis.currentUsername) {
      return {
        id: globalThis.currentUserId || "",
        username: String(globalThis.currentUsername || ""),
        role: globalThis.currentUserRole || "",
      };
    }
    if (!currentUserPromise) {
      currentUserPromise = fetch("/api/auth/me", { cache: "no-store", headers: authHeaders() })
        .then((response) => response.ok ? response.json() : {})
        .then((payload) => payload.user || { id: payload.id || "", username: payload.username || "" })
        .catch(() => ({}));
    }
    return currentUserPromise;
  }

  function hitExpression(value) {
    const match = String(value || "").match(/[+-]\s*\d+/);
    return match ? normalizeRollExpression(`d20${match[0]}`) : "";
  }

  function damageExpression(value) {
    const source = String(value || "").replace(/W/gi, "d");
    const firstDice = source.match(FIRST_DICE_PATTERN);
    if (firstDice) {
      const start = firstDice.index || 0;
      DICE_TOKEN_PATTERN.lastIndex = start;
      const tokens = [];
      let match = DICE_TOKEN_PATTERN.exec(source);
      while (match && match.index <= start + 40) {
        tokens.push(match[0]);
        match = DICE_TOKEN_PATTERN.exec(source);
      }
      return normalizeRollExpression(tokens.join(""));
    }
    const flat = source.match(/\b\d+\b/);
    return flat ? flat[0] : "";
  }

  function firstDamageExpression(...values) {
    for (const value of values) {
      const expression = damageExpression(value);
      if (expression) return expression;
    }
    return "";
  }

  function ensureRollPanel() {
    let panel = document.getElementById("sheetRollPanel");
    if (panel) return panel;
    panel = document.createElement("aside");
    panel.id = "sheetRollPanel";
    panel.className = "sheet-roll-panel hidden";
    panel.innerHTML = '<div class="sheet-roll-header"><strong>Wuerfe</strong><button type="button" aria-label="Wuerfe ausblenden">x</button></div><div class="sheet-roll-list"></div>';
    panel.querySelector("button")?.addEventListener("click", () => panel.classList.add("hidden"));
    document.body.appendChild(panel);
    return panel;
  }

  function appendRollStatus(text, tone = "") {
    const panel = ensureRollPanel();
    const list = panel.querySelector(".sheet-roll-list");
    const entry = document.createElement("div");
    entry.className = `sheet-roll-entry${tone ? ` ${tone}` : ""}`;
    entry.textContent = text;
    list.appendChild(entry);
    panel.classList.remove("hidden");
    list.scrollTop = list.scrollHeight;
  }

  async function postCommand(message, options = {}) {
    const settings = rollSettings();
    const visibility = options.visibility || settings.visibility || "public";
    const response = await fetch("/api/command-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ message, visibility }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || "Wurf konnte nicht gesendet werden.");
    }
    if (typeof window.eldranNotifyCommandChatUpdated === "function") {
      window.eldranNotifyCommandChatUpdated({ source: "sheet-roll", messages: data.messages || [] });
    } else {
      const payload = {
        source: "sheet-roll",
        messages: data.messages || [],
        nonce: `${Date.now()}:${Math.random().toString(36).slice(2)}`,
      };
      window.dispatchEvent(new CustomEvent("eldran:command-chat-updated", { detail: payload }));
      try {
        const channel = new BroadcastChannel("eldran-command-chat");
        channel.postMessage(payload);
        channel.close();
      } catch {}
      try {
        window.localStorage.setItem("eldran-command-chat-updated", JSON.stringify(payload));
      } catch {}
    }
    return data.messages || [];
  }

  async function rollAction(action) {
    const label = String(action?.name || "Aktion").trim() || "Aktion";
    const hit = hitExpression(action?.hit || action?.save_attack || action?.save_atk || action?.attack || "");
    const damage = firstDamageExpression(action?.damage, action?.damage_notes, action?.notes);
    if (Number(action?.spell_slot_level || 0) > 0 && window.EldranDndSpellSlots?.consume) {
      const consumed = await window.EldranDndSpellSlots.consume(Number(action.spell_slot_level));
      if (!consumed) {
        appendRollStatus(`${label}: Kein Zauberplatz verfuegbar.`, "warn");
        return;
      }
    }
    try {
      const username = await currentUsername();
      const lines = [`${username || "Spieler"} verwendet ${label}.`];
      if (hit) {
        const hitRoll = rollExpression(hit);
        if (hitRoll) lines.push(`Treffer: ${hitRoll.text}`);
      }
      if (damage) {
        const damageRoll = rollExpression(damage);
        if (damageRoll) lines.push(`Schaden: ${damageRoll.text}`);
      }
      if (!hit && !damage && !Number(action?.spell_slot_level || 0)) {
        appendRollStatus(`${label}: Kein Treffer- oder Schadenswurf erkannt.`, "warn");
        return;
      }
      const message = lines.join("\n");
      appendRollStatus(message, "result");
      await postCommand(message);
    } catch (error) {
      appendRollStatus(`${label}: ${error.message || "Wurf fehlgeschlagen."}`, "warn");
    }
  }

  async function rollRest(action) {
    const type = String(action?.rest_type || action?.type || "").trim().toLowerCase();
    if (window.EldranDndRests?.perform) {
      await window.EldranDndRests.perform(type);
      return;
    }
    const username = await currentUsername();
    const label = type === "long" ? "lange Rast" : "kurze Rast";
    const message = `${username || "Spieler"} beginnt eine ${label}.`;
    appendRollStatus(message, "result");
    await postCommand(message);
  }

  async function rollCheck(action) {
    const label = String(action?.name || "Probe").trim() || "Probe";
    const kind = String(action?.kind || "Probe").trim() || "Probe";
    const rawModifier = typeof action?.modifier === "function" ? action.modifier() : action?.modifier;
    const modifier = Number.parseInt(String(rawModifier || "0").replace(/[^\-+\d]/g, ""), 10) || 0;
    const expression = normalizeRollExpression(`d20${modifier >= 0 ? "+" : ""}${modifier}`);
    const roll = rollExpression(expression);
    if (!roll) {
      appendRollStatus(`${label}: Probe konnte nicht gewuerfelt werden.`, "warn");
      return;
    }
    try {
      const username = await currentUsername();
      const message = `${username || "Spieler"} wuerfelt ${kind}: ${label}.\n${label}: ${roll.text}`;
      appendRollStatus(message, "result");
      await postCommand(message);
    } catch (error) {
      appendRollStatus(`${label}: ${error.message || "Wurf fehlgeschlagen."}`, "warn");
    }
  }

  function makeCheckRollable(element, action) {
    if (!element || !action) return element;
    element.classList.add("sheet-rollable");
    element.tabIndex = 0;
    element.setAttribute("role", "button");
    element.setAttribute("title", "Probe wuerfeln");
    const handler = (event) => {
      if (event?.target?.closest?.("input, textarea, select, button, a")) return;
      if (event?.target?.closest?.(".sheet-rollable") !== element) return;
      rollCheck(action);
    };
    element.addEventListener("click", handler);
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        rollCheck(action);
      }
    });
    return element;
  }

  function checkRollButton(action) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sheet-roll-button";
    button.textContent = "Wuerfeln";
    button.addEventListener("click", () => rollCheck(action));
    return button;
  }

  async function quickbarStorageKey() {
    const user = await currentUser();
    const userId = String(user?.id || user?.username || "gast").trim() || "gast";
    return `eldran-hotkey-bar:${userId}`;
  }

  function defaultQuickbarCommands(role) {
    const isManager = role === "admin" || role === "spielleiter";
    return [
      { type: "builtin", id: "map" },
      isManager ? { type: "builtin", id: "battlemap" } : { type: "builtin", id: "sheet" },
      isManager ? { type: "builtin", id: "sheet" } : { type: "builtin", id: "wiki" },
      isManager ? { type: "builtin", id: "wiki" } : { type: "builtin", id: "help" },
      isManager ? { type: "builtin", id: "project" } : null,
      isManager ? { type: "builtin", id: "help" } : null,
    ].filter(Boolean);
  }

  async function addQuickbarCommand(command) {
    if (!command) return false;
    const normalized = JSON.parse(JSON.stringify(command));
    if (typeof window.eldranAddHotkeyCommand === "function") {
      const added = window.eldranAddHotkeyCommand(normalized);
      appendRollStatus(added ? "Zur Quickbar hinzugefuegt." : "Quickbar ist voll.", added ? "" : "warn");
      return added;
    }
    const key = await quickbarStorageKey();
    const stored = window.localStorage.getItem(key);
    const user = await currentUser();
    const commands = stored ? JSON.parse(stored) : defaultQuickbarCommands(user?.role || "spieler");
    if (commands.length >= 10) {
      appendRollStatus("Quickbar ist voll.", "warn");
      return false;
    }
    commands.push(normalized);
    window.localStorage.setItem(key, JSON.stringify(commands.slice(0, 10)));
    window.dispatchEvent(new CustomEvent("eldran:hotkeys-updated"));
    appendRollStatus("Zur Quickbar hinzugefuegt.");
    return true;
  }

  function resolveQuickbarCommand(commandFactory) {
    const command = typeof commandFactory === "function" ? commandFactory() : commandFactory;
    return command ? JSON.parse(JSON.stringify(command)) : null;
  }

  function makeQuickbarDraggable(element, commandFactory) {
    if (!element || !commandFactory) return element;
    element.draggable = true;
    element.classList.add("sheet-quickbar-draggable");
    if (!element.getAttribute("title")) {
      element.setAttribute("title", "Wuerfeln oder in die Quickbar ziehen");
    }
    element.addEventListener("dragstart", (event) => {
      const command = resolveQuickbarCommand(commandFactory);
      if (!command) return;
      const payload = JSON.stringify(command);
      event.dataTransfer.setData("application/x-eldran-hotkey", payload);
      event.dataTransfer.setData("text/plain", payload);
      event.dataTransfer.effectAllowed = "copy";
      element.classList.add("dragging");
    });
    element.addEventListener("dragend", () => element.classList.remove("dragging"));
    return element;
  }

  function quickbarButton(commandFactory) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sheet-quickbar-button";
    button.textContent = "+ Quickbar";
    button.title = "Zur Quickbar hinzufuegen";
    makeQuickbarDraggable(button, commandFactory);
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        await addQuickbarCommand(resolveQuickbarCommand(commandFactory));
      } catch (error) {
        appendRollStatus(error.message || "Quickbar konnte nicht aktualisiert werden.", "warn");
      }
    });
    return button;
  }

  function makeRollable(element, action) {
    if (!element || !action) return element;
    element.classList.add("sheet-rollable");
    element.tabIndex = 0;
    element.setAttribute("role", "button");
    element.setAttribute("title", "Wuerfeln");
    const handler = (event) => {
      if (event?.target?.closest?.("input, textarea, select, button, a")) return;
      if (event?.target?.closest?.(".sheet-rollable") !== element) return;
      rollAction(action);
    };
    element.addEventListener("click", handler);
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        rollAction(action);
      }
    });
    return element;
  }

  window.EldranSheetRolls = {
    addQuickbarCommand,
    damageExpression,
    firstDamageExpression,
    hitExpression,
    checkRollButton,
    makeCheckRollable,
    makeQuickbarDraggable,
    makeRollable,
    quickbarButton,
    postCommand,
    rollExpression,
    rollSettings,
    saveRollSettings,
    rollAction,
    rollCheck,
    rollRest,
  };
})();
