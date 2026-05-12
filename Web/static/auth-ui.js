const AUTH_TOKEN_STORAGE_KEY = "eldran-auth-token";

function getStoredAuthToken() {
  const token = window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
  if (token && !window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) {
    window.sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }
  return token;
}

function clearStoredAuthToken() {
  window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

function setStoredAuthToken(token) {
  window.sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

const originalFetch = window.fetch.bind(window);
window.fetch = (resource, options = {}) => {
  const token = getStoredAuthToken();
  if (!token) {
    return originalFetch(resource, options);
  }
  const headers = new Headers(options.headers || {});
  if (!headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return originalFetch(resource, { ...options, headers });
};

function helpRoleLabel(role) {
  if (role === "admin") return "Admin";
  if (role === "spielleiter") return "Spielleiter";
  if (role === "npc") return "NPC";
  if (role === "gegner") return "Gegner";
  if (role === "spieler") return "Spieler";
  return "Gast";
}

function currentHelpPageKey() {
  const path = window.location.pathname;
  if (["/karte", "/Karte"].includes(path)) return "map";
  if (["/battlemap", "/Battlemap"].includes(path)) return "battlemap";
  if (["/chat", "/Eldran", "/eldran", "/remote"].includes(path)) return "chat";
  if (["/charakterbogen", "/Charakterbogen"].includes(path)) return "sheet";
  if (["/charakter-builder", "/Charakter-Builder"].includes(path)) return "builder";
  if (path === "/wiki" || path.startsWith("/wiki/")) return "wiki";
  if (path === "/db") return "db";
  if (path === "/projekte/neu") return "project";
  return "general";
}

function addHelpSection(sections, title, items) {
  const filteredItems = (items || []).filter(Boolean);
  if (filteredItems.length) {
    sections.push({ title, items: filteredItems });
  }
}

function buildHelpSections(role) {
  const pageKey = currentHelpPageKey();
  const isManager = role === "admin" || role === "spielleiter";
  const isAdmin = role === "admin";
  const isPlayer = role === "spieler";
  const sections = [];

  addHelpSection(sections, "Grundlagen", [
    "F1 oeffnet und schliesst diese Hilfe. Esc schliesst sie ebenfalls.",
    "Die obere Navigation fuehrt zu Karte, Battlemap, Charakterbogen, Wiki und je nach Rolle weiteren Werkzeugen.",
    "Viele Seiten haben klappbare Seitenleisten. Die Panel-Anordnung wird im Browser gespeichert.",
    isPlayer
      ? "Als Spieler siehst und steuerst du vor allem die fuer dich freigegebenen Inhalte."
      : "Als Spielleiter/Admin kannst du Inhalte vorbereiten, live schalten, verwalten und fuer Spieler sichtbar machen.",
  ]);

  addHelpSection(sections, "Chatbefehle", [
    "Text ohne / wird als normale Command-Chat-Nachricht gesendet.",
    "/roll <wurf> fuehrt einen oeffentlichen Wurf aus, z. B. /roll d20 oder /roll 2d6+3.",
    "/gmroll <wurf> fuehrt einen verdeckten Wurf aus, den Spielleiter/Admins und der wuerfelnde Spieler sehen.",
    "/hiddenroll <wurf> fuehrt einen verdeckten Wurf aus, den nur Spielleiter/Admins sehen.",
    "Erlaubte Wuerfel sind d2, d4, d6, d8, d10, d12, d20 und d100.",
    "Wurfausdruecke erlauben Anzahl, Plus/Minus und feste Werte: d20+5, 2d6+3 oder 1d20+2d10-1.",
    "Unbekannte Befehle beginnen mit / und erzeugen eine Systemmeldung mit den verfuegbaren Wuerfelbefehlen.",
    isManager && "Der Button Clear im Command-Chat leert die Command-Chat-Liste fuer alle.",
  ]);

  if (pageKey === "map") {
    addHelpSection(sections, "Karte", [
      "Die Karte ist die freie Live-Flaeche fuer Bilder, Pins, Tokens, Notizen per Zeichnung und Sichtbereiche.",
      "Mausrad zoomt auf die Karte. Rechtsklick-Ziehen verschiebt die Ansicht.",
      "Ein einfacher Klick setzt einen Ping. Klicken und Ziehen zeichnet einen Strich.",
      "Striche koennen angeklickt und danach mit Delete geloescht werden. Spieler loeschen eigene Striche, Spielleiter/Admins alle.",
      "Strg+Z entfernt deinen letzten eigenen Strich.",
      isManager && "Links kannst du Karten, Ebenen, Hintergrundbilder, Zeichenfarbe und Strichdicke verwalten.",
      isManager && "Im Ebenen-Panel kannst du Ebenen wechseln, umbenennen, neue Ebenen anlegen und GM-Ebenen ein- oder ausblenden.",
      isManager && "Pins koennen verlinkte Ziele, Bilder, Sounds und Sichtbarkeit haben. Rechtsklick auf einen Pin oeffnet Ebenenaktionen.",
      isManager && "Tokens koennen Spielern zugeordnet werden. Spieler koennen nur ihre eigenen Tokens bewegen.",
      isManager && "Nebel, Wandmodus und Tuermodus steuern Sichtblocker. Tueren koennen geoeffnet oder geschlossen werden.",
      isPlayer && "Spieler sehen nur die freigegebenen Ebenen und Pins. Zugeordnete Tokens koennen bewegt werden.",
    ]);
  }

  if (pageKey === "battlemap") {
    addHelpSection(sections, "Battlemap", [
      "Die Battlemap ist fuer taktische Szenen mit Raster, Tokens, Hindernissen, Nebel und Runden gedacht.",
      "Tokens werden auf Feldern bewegt. Sicht, Bewegung und Reichweite helfen bei Begegnungen.",
      isManager && "Spielleiter/Admins koennen Battlemaps anlegen, aktivieren, Hintergruende setzen und Rastergroessen anpassen.",
      isManager && "Hindernisse, Fog-Waende, Tueren und Tokens koennen zur Vorbereitung einer Szene verwaltet werden.",
      isPlayer && "Spieler sehen die aktive Battlemap, ihre Tokens und die freigegebenen Sichtbereiche.",
    ]);
  }

  if (pageKey === "chat") {
    addHelpSection(sections, "Chat", [
      "Der Chat beantwortet Fragen anhand importierter Dokumente und zeigt Quellen an, wenn passende Inhalte gefunden werden.",
      "Du kannst eine Unterhaltung fortsetzen, neue Chats anlegen und vorhandene Chats wieder oeffnen.",
      "Auf Remote-Seiten ist der Chat fuer die Spieleransicht gedacht; lokal ist er eher Spielleiter-Werkzeug.",
      isManager && "Spielleiter/Admins koennen Dokumente importieren und neu indizieren, damit der Chat bessere Quellen findet.",
    ]);
  }

  if (pageKey === "sheet") {
    addHelpSection(sections, "Charakterbogen", [
      "Der Charakterbogen ist projektgebunden: ein Bogen pro Spieler und Projekt.",
      "Bei DnD-Projekten kann ein PDF eingelesen werden. Die App extrahiert Werte und zeigt sie als Sheet an.",
      "Der Button 'Sheet separat oeffnen' zeigt nur den Charakterbogen in einem eigenen Tab.",
      "In der separaten Sheet-Ansicht gibt es rechts ein Notizfeld mit Formatierung.",
      isManager && "Spielleiter/Admins koennen im Projekt die Sheets aller zugewiesenen Spieler sehen.",
      isPlayer && "Spieler bearbeiten und sehen den eigenen Charakterbogen.",
    ]);
  }

  if (pageKey === "builder") {
    addHelpSection(sections, "Charakter-Builder", [
      "Der Builder fuehrt schrittweise durch Identitaet, Volk, Attribute, Disziplinen, Kampfwerte und Notizen.",
      "Pflicht- und Plausibilitaetspruefungen werden pro Schritt angezeigt.",
      "Werte werden automatisch zwischengespeichert, wenn du berechtigt bist, den gewaehlten Bogen zu bearbeiten.",
      isManager && "Spielleiter/Admins koennen Spieler aus dem Projekt auswaehlen und deren Builder-Daten pruefen.",
      isPlayer && "Spieler bearbeiten den eigenen Charakter fuer das aktuelle Projekt.",
    ]);
  }

  if (pageKey === "wiki") {
    addHelpSection(sections, "Wiki", [
      "Das Wiki zeigt importierte und generierte Wissensseiten.",
      "Links innerhalb von Seiten fuehren direkt zu verwandten Wiki-Eintraegen.",
      "Die Suche und Seitenliste helfen, Orte, Personen, Regeln und Projektwissen schnell zu finden.",
    ]);
  }

  if (pageKey === "db") {
    addHelpSection(sections, "Datenbank", [
      isAdmin ? "Die Datenbankseite ist ein Admin-Werkzeug zum Pruefen und Ausfuehren von SQL." : "",
      isAdmin ? "Nutze sie vorsichtig: Aendernde SQL-Befehle wirken direkt auf die gespeicherten Daten." : "",
      isAdmin ? "Tabellen links anklicken, Query pruefen, dann ausfuehren." : "",
      !isAdmin ? "Diese Seite ist nur fuer Admins gedacht." : "",
    ]);
  }

  if (pageKey === "project") {
    addHelpSection(sections, "Projekt-Wizard", [
      "Hier legst du ein neues Projekt mit Regelwerk, Spielern und optionaler Startkarte an.",
      "Das Regelwerk bestimmt, welcher Charakterbogen-Workflow verwendet wird.",
      isManager && "Nach dem Anlegen wird das Projekt aktiv und kann auf Karte, Charakterbogen und Battlemap verwendet werden.",
    ]);
  }

  addHelpSection(sections, "Rollen", [
    "Spieler: sieht freigegebene Inhalte, nutzt eigene Charakterdaten und bewegt zugeordnete Tokens.",
    "Spielleiter: verwaltet Projekte, Karten, Battlemaps, Pins, Tokens, Sheets, Musik und Sichtbarkeit.",
    "Admin: hat zusaetzlich Zugriff auf Administration und Datenbankwerkzeuge.",
  ]);

  return sections;
}

function ensureHelpOverlay() {
  let overlay = document.getElementById("helpOverlay");
  if (overlay) {
    return overlay;
  }
  overlay = document.createElement("section");
  overlay.id = "helpOverlay";
  overlay.className = "help-overlay hidden";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <div class="help-backdrop" data-help-close></div>
    <article class="help-dialog" role="dialog" aria-modal="true" aria-labelledby="helpTitle">
      <header class="help-header">
        <div>
          <p class="eyebrow">Hilfe</p>
          <h2 id="helpTitle">Eldran Hilfe</h2>
          <p id="helpSubtitle" class="upload-hint"></p>
        </div>
        <button class="ghost-button compact-button" type="button" data-help-close>Schliessen</button>
      </header>
      <div id="helpContent" class="help-content"></div>
    </article>
  `;
  document.body.appendChild(overlay);
  overlay.querySelectorAll("[data-help-close]").forEach((element) => {
    element.addEventListener("click", closeHelpOverlay);
  });
  return overlay;
}

function renderHelpOverlay() {
  const overlay = ensureHelpOverlay();
  const role = globalThis.currentUserRole || "gast";
  const content = overlay.querySelector("#helpContent");
  const subtitle = overlay.querySelector("#helpSubtitle");
  subtitle.textContent = `Ansicht: ${helpRoleLabel(role)}. Inhalte sind auf diese Seite und Rolle zugeschnitten.`;
  content.innerHTML = "";
  for (const section of buildHelpSections(role)) {
    const article = document.createElement("section");
    article.className = "help-section";
    const title = document.createElement("h3");
    title.textContent = section.title;
    const list = document.createElement("ul");
    for (const item of section.items) {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    }
    article.append(title, list);
    content.appendChild(article);
  }
}

function openHelpOverlay() {
  renderHelpOverlay();
  const overlay = ensureHelpOverlay();
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
  overlay.querySelector("[data-help-close]")?.focus({ preventScroll: true });
}

function closeHelpOverlay() {
  const overlay = document.getElementById("helpOverlay");
  if (!overlay) return;
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

function installHelpShortcut() {
  if (window.__eldranHelpInstalled) {
    return;
  }
  window.__eldranHelpInstalled = true;
  document.addEventListener("keydown", (event) => {
    if (event.key === "F1") {
      event.preventDefault();
      const overlay = ensureHelpOverlay();
      if (overlay.classList.contains("hidden")) {
        openHelpOverlay();
      } else {
        closeHelpOverlay();
      }
      return;
    }
    if (event.key === "Escape") {
      closeHelpOverlay();
      closeHotkeyDialog();
      closePasswordDialog();
    }
  }, true);
}

installHelpShortcut();

function hotkeyStorageKey() {
  const userId = String(globalThis.currentUserId || globalThis.currentUsername || "gast").trim() || "gast";
  return `eldran-hotkey-bar:${userId}`;
}

function routeMode() {
  return window.sessionStorage.getItem("eldran-route-mode") || (window.location.pathname[1]?.toUpperCase() === window.location.pathname[1] ? "remote" : "local");
}

function routePath(localPath, remotePath = localPath) {
  return routeMode() === "remote" ? remotePath : localPath;
}

function commandDefinitions(role) {
  const isManager = role === "admin" || role === "spielleiter";
  const isAdmin = role === "admin";
  return [
    { id: "map", label: "Karte", kind: "navigate", localPath: "/karte", remotePath: "/Karte" },
    isManager ? { id: "battlemap", label: "Battlemap", kind: "navigate", localPath: "/battlemap", remotePath: "/Battlemap" } : null,
    { id: "sheet", label: "Charakterbogen", kind: "sheet-view" },
    { id: "wiki", label: "Wiki", kind: "navigate", localPath: "/wiki", remotePath: "/wiki" },
    { id: "help", label: "Hilfe", kind: "help" },
    isManager ? { id: "project", label: "Projekt", kind: "navigate", localPath: "/projekte/neu", remotePath: "/projekte/neu" } : null,
    isAdmin ? { id: "notes", label: "Notizen", kind: "navigate", localPath: "/notizen", remotePath: "/notizen" } : null,
    isAdmin ? { id: "db", label: "Datenbank", kind: "navigate", localPath: "/db", remotePath: "/db" } : null,
    { id: "custom-chat", label: "Chatcommand...", kind: "custom-chat" },
  ].filter(Boolean);
}

function definitionById(commandId) {
  return commandDefinitions(globalThis.currentUserRole || "spieler").find((definition) => definition.id === commandId) || null;
}

function defaultHotkeys(role) {
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

function loadHotkeys() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(hotkeyStorageKey()) || "[]");
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.slice(0, 10);
    }
  } catch {}
  return defaultHotkeys(globalThis.currentUserRole || "spieler");
}

function saveHotkeys(commands) {
  window.localStorage.setItem(hotkeyStorageKey(), JSON.stringify((commands || []).slice(0, 10)));
}

function normalizeHotkeyCommand(command) {
  if (!command || typeof command !== "object") return null;
  const normalized = JSON.parse(JSON.stringify(command));
  if (!normalized.type) return null;
  return normalized;
}

function parseDraggedHotkeyCommand(event) {
  const raw = event.dataTransfer?.getData("application/x-eldran-hotkey")
    || event.dataTransfer?.getData("text/plain")
    || "";
  if (!raw) return null;
  try {
    return normalizeHotkeyCommand(JSON.parse(raw));
  } catch {
    return null;
  }
}

function hasDraggedHotkeyCommand(event) {
  const types = event.dataTransfer?.types;
  if (!types) return false;
  if (typeof types.includes === "function") return types.includes("application/x-eldran-hotkey");
  if (typeof types.contains === "function") return types.contains("application/x-eldran-hotkey");
  return Array.from(types).includes("application/x-eldran-hotkey");
}

function persistHotkeys(commands) {
  saveHotkeys(commands);
  renderHotkeyBar();
  window.dispatchEvent(new CustomEvent("eldran:hotkeys-updated"));
}

function appendHotkeyCommand(command) {
  const normalized = normalizeHotkeyCommand(command);
  if (!normalized) return false;
  const commands = loadHotkeys();
  if (commands.length >= 10) {
    setHotkeyStatus("Maximal 10 Hotkeys");
    return false;
  }
  commands.push(normalized);
  persistHotkeys(commands);
  setHotkeyStatus("Zur Quickbar hinzugefuegt");
  return true;
}

function replaceHotkeyCommand(index, command) {
  const normalized = normalizeHotkeyCommand(command);
  if (!normalized || index < 0 || index > 9) return false;
  const commands = loadHotkeys();
  commands[index] = normalized;
  persistHotkeys(commands);
  setHotkeyStatus("Quickbar-Slot ersetzt");
  return true;
}

function bindHotkeyDropTarget(element, onDrop) {
  element.addEventListener("dragover", (event) => {
    if (!hasDraggedHotkeyCommand(event)) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    element.classList.add("drag-over");
  });
  element.addEventListener("dragleave", () => element.classList.remove("drag-over"));
  element.addEventListener("drop", (event) => {
    const droppedCommand = parseDraggedHotkeyCommand(event);
    if (!droppedCommand) return;
    event.preventDefault();
    event.stopPropagation();
    element.classList.remove("drag-over");
    document.getElementById("hotkeyBarSlots")?.classList.remove("drag-over");
    onDrop(droppedCommand);
  });
}

function hotkeyCommandLabel(command) {
  if (command.type === "chat") return command.label || "Chatcommand";
  if (command.type === "sheet-roll") return command.label || command.action?.name || "Sheet";
  const definition = definitionById(command.id);
  return definition?.label || command.label || "Befehl";
}

window.eldranNotifyCommandChatUpdated = function eldranNotifyCommandChatUpdated(detail = {}) {
  const payload = {
    ...detail,
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
};

async function sendHotkeyChatCommand(message) {
  const normalizedMessage = String(message || "").trim();
  if (!normalizedMessage) {
    throw new Error("Chatcommand ist leer.");
  }
  const response = await fetch("/api/command-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: normalizedMessage }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Chatcommand konnte nicht gesendet werden.");
  }
  window.eldranNotifyCommandChatUpdated({ source: "hotkey", messages: data.messages || [] });
}

const HOTKEY_DICE_TOKEN_PATTERN = /[+-]?\s*\d*\s*[dw]\s*(?:100|20|12|10|8|6|4|2)|[+-]\s*\d+/gi;
const HOTKEY_FIRST_DICE_PATTERN = /\d*\s*[dw]\s*(?:100|20|12|10|8|6|4|2)(?:\s*[+-]\s*\d+)?/i;
const HOTKEY_ROLL_TOKEN_PATTERN = /([+-]?)(?:(\d*)d(100|20|12|10|8|6|4|2)|(\d+))/iy;

function normalizeHotkeyRollExpression(expression) {
  return String(expression || "").replace(/w/gi, "d").replace(/\s+/g, "").replace(/^\+/, "");
}

function randomHotkeyInt(maxInclusive) {
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

function signedHotkeyPart(value, hasPrevious) {
  if (value < 0) return `-${Math.abs(value)}`;
  return hasPrevious ? `+${value}` : String(value);
}

function rollHotkeyExpression(expression) {
  const normalized = normalizeHotkeyRollExpression(expression).toLowerCase();
  if (!normalized) return null;
  const parts = [];
  let total = 0;
  let position = 0;
  while (position < normalized.length) {
    HOTKEY_ROLL_TOKEN_PATTERN.lastIndex = position;
    const match = HOTKEY_ROLL_TOKEN_PATTERN.exec(normalized);
    if (!match || match.index !== position) return null;
    const sign = match[1] === "-" ? -1 : 1;
    if (match[3]) {
      const count = Number.parseInt(match[2] || "1", 10);
      const sides = Number.parseInt(match[3], 10);
      for (let index = 0; index < count; index += 1) {
        const value = randomHotkeyInt(sides) * sign;
        total += value;
        parts.push(signedHotkeyPart(value, parts.length > 0));
      }
    } else {
      const value = sign * Number.parseInt(match[4], 10);
      total += value;
      parts.push(signedHotkeyPart(value, parts.length > 0));
    }
    position = HOTKEY_ROLL_TOKEN_PATTERN.lastIndex;
  }
  return { text: `${normalized} = ${parts.join("")} = ${total}` };
}

function hotkeyHitExpression(value) {
  const match = String(value || "").match(/[+-]\s*\d+/);
  return match ? normalizeHotkeyRollExpression(`d20${match[0]}`) : "";
}

function hotkeyDamageExpression(value) {
  const source = String(value || "").replace(/W/gi, "d");
  const firstDice = source.match(HOTKEY_FIRST_DICE_PATTERN);
  if (firstDice) {
    const start = firstDice.index || 0;
    HOTKEY_DICE_TOKEN_PATTERN.lastIndex = start;
    const tokens = [];
    let match = HOTKEY_DICE_TOKEN_PATTERN.exec(source);
    while (match && match.index <= start + 40) {
      tokens.push(match[0]);
      match = HOTKEY_DICE_TOKEN_PATTERN.exec(source);
    }
    return normalizeHotkeyRollExpression(tokens.join(""));
  }
  const flat = source.match(/\b\d+\b/);
  return flat ? flat[0] : "";
}

function firstHotkeyDamageExpression(...values) {
  for (const value of values) {
    const expression = hotkeyDamageExpression(value);
    if (expression) return expression;
  }
  return "";
}

function hotkeySpellLevelRank(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("cantrip") || text.includes("zaubertrick")) return 0;
  const match = text.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function hotkeyParseSlotsText(value) {
  const slots = {};
  const text = String(value || "");
  for (const match of text.matchAll(/S(?:tufe)?\s*(\d)\s*[:=]\s*(\d+)/gi)) {
    slots[match[1]] = Math.max(Number(slots[match[1]] || 0), Number(match[2] || 0));
  }
  for (const match of text.matchAll(/(\d+)\s*(?:slots?|zauberplaetze|zauberplätze).*?(?:stufe|level)?\s*(\d)/gi)) {
    slots[match[2]] = Math.max(Number(slots[match[2]] || 0), Number(match[1] || 0));
  }
  return slots;
}

function hotkeySlotTotals(spellcasting = {}) {
  const totals = {};
  const byLevel = spellcasting.slots_by_level && typeof spellcasting.slots_by_level === "object" ? spellcasting.slots_by_level : {};
  for (const [level, value] of Object.entries(byLevel)) {
    const parsed = Number.parseInt(String(value), 10);
    if (Number.isFinite(parsed) && parsed > 0) totals[String(Number.parseInt(level, 10))] = parsed;
  }
  Object.assign(totals, hotkeyParseSlotsText(spellcasting.slot_summary));
  for (const spell of Array.isArray(spellcasting.spells) ? spellcasting.spells : []) {
    const rank = hotkeySpellLevelRank(spell.level || spell.spell_level);
    if (!rank) continue;
    const parsed = hotkeyParseSlotsText(`${spell.slots || ""} Stufe ${rank}`);
    if (parsed[String(rank)]) totals[String(rank)] = Math.max(Number(totals[String(rank)] || 0), parsed[String(rank)]);
  }
  return totals;
}

async function consumeHotkeySpellSlot(action, level) {
  if (!level) return true;
  if (window.EldranDndSpellSlots?.consume) {
    return window.EldranDndSpellSlots.consume(level);
  }
  const projectId = String(action.project_id || "").trim();
  const userId = String(action.user_id || "").trim();
  if (!projectId || !userId) {
    throw new Error("Zauberplatz kann ausserhalb des Charakterbogens nicht geprueft werden.");
  }
  const response = await fetch(`/api/character-sheets/${encodeURIComponent(userId)}?project_id=${encodeURIComponent(projectId)}&ts=${Date.now()}`, { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || "Charakterbogen konnte nicht geladen werden.");
  const data = payload.sheet?.data || {};
  data.spellcasting = { ...(data.spellcasting || {}) };
  const totals = hotkeySlotTotals(data.spellcasting);
  const used = data.spellcasting.used_slots_by_level && typeof data.spellcasting.used_slots_by_level === "object"
    ? { ...data.spellcasting.used_slots_by_level }
    : {};
  const key = String(level);
  if (Math.max(0, Number(totals[key] || 0) - Number(used[key] || 0)) <= 0) {
    return false;
  }
  used[key] = Number(used[key] || 0) + 1;
  data.spellcasting.used_slots_by_level = used;
  const saveResponse = await fetch(`/api/character-sheets/${encodeURIComponent(userId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_id: projectId, data }),
  });
  const savePayload = await saveResponse.json().catch(() => ({}));
  if (!saveResponse.ok) throw new Error(savePayload.detail || "Zauberplatz konnte nicht gespeichert werden.");
  return true;
}

async function applyHotkeyLongRest(action) {
  if (window.EldranDndRests?.perform) {
    await window.EldranDndRests.perform("long");
    return true;
  }
  const projectId = String(action.project_id || "").trim();
  const userId = String(action.user_id || "").trim();
  if (!projectId || !userId) return false;
  const response = await fetch(`/api/character-sheets/${encodeURIComponent(userId)}?project_id=${encodeURIComponent(projectId)}&ts=${Date.now()}`, { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || "Charakterbogen konnte nicht geladen werden.");
  const data = payload.sheet?.data || {};
  data.combat = { ...(data.combat || {}) };
  data.spellcasting = { ...(data.spellcasting || {}) };
  data.combat.hit_points_current = String(data.combat.hit_points_max || data.combat.hit_points_current || "");
  const hitDiceMatch = String(data.combat.hit_dice || "").match(/(\d+)\s*d/i);
  data.combat.hit_dice_remaining = hitDiceMatch ? hitDiceMatch[1] : data.combat.hit_dice_remaining || "";
  data.spellcasting.used_slots_by_level = {};
  const saveResponse = await fetch(`/api/character-sheets/${encodeURIComponent(userId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_id: projectId, data }),
  });
  const savePayload = await saveResponse.json().catch(() => ({}));
  if (!saveResponse.ok) throw new Error(savePayload.detail || "Lange Rast konnte nicht gespeichert werden.");
  return true;
}

async function executeSheetRollHotkey(command) {
  const action = command.action || {};
  const username = String(globalThis.currentUsername || "Spieler").trim() || "Spieler";
  const label = String(command.label || action.name || "Aktion").trim() || "Aktion";
  const mode = String(command.mode || "action");
  if (mode === "rest") {
    const restKind = String(command.rest_type || action.rest_type || action.type || "").toLowerCase();
    if (restKind === "long") {
      await applyHotkeyLongRest(action);
      await sendHotkeyChatCommand(`${username} beendet eine lange Rast.\nTP, Trefferwuerfel und Zauberplaetze wurden zurueckgesetzt.`);
      setHotkeyStatus("Lange Rast");
      return;
    }
    if (window.EldranDndRests?.perform) {
      await window.EldranDndRests.perform("short");
    } else {
      await sendHotkeyChatCommand(`${username} beginnt eine kurze Rast.`);
      setHotkeyStatus("Gesendet");
    }
    return;
  }
  if (mode === "check") {
    const modifier = Number.parseInt(String(action.modifier || "0").replace(/[^\-+\d]/g, ""), 10) || 0;
    const roll = rollHotkeyExpression(`d20${modifier >= 0 ? "+" : ""}${modifier}`);
    if (!roll) throw new Error("Probe konnte nicht gewuerfelt werden.");
    await sendHotkeyChatCommand(`${username} wuerfelt ${action.kind || "Probe"}: ${label}.\n${label}: ${roll.text}`);
    setHotkeyStatus("Gewuerfelt");
    return;
  }
  if (mode === "feature") {
    const body = String(action.text || action.body || "").trim();
    await sendHotkeyChatCommand(`${username} verwendet ${label}.${body ? `\n${body}` : ""}`);
    setHotkeyStatus("Gesendet");
    return;
  }
  if (mode === "spell" && Number(action.spell_slot_level || 0) > 0) {
    const consumed = await consumeHotkeySpellSlot(action, Number(action.spell_slot_level));
    if (!consumed) {
      throw new Error("Kein Zauberplatz verfuegbar.");
    }
  }
  const hit = hotkeyHitExpression(action.hit || action.save_attack || action.save_atk || action.attack || "");
  const damage = firstHotkeyDamageExpression(action.damage, action.damage_notes, action.notes);
  if (!hit && !damage && mode !== "spell") throw new Error("Kein Treffer- oder Schadenswurf erkannt.");
  const lines = [`${username} verwendet ${label}.`];
  if (hit) {
    const roll = rollHotkeyExpression(hit);
    if (roll) lines.push(`Treffer: ${roll.text}`);
  }
  if (damage) {
    const roll = rollHotkeyExpression(damage);
    if (roll) lines.push(`Schaden: ${roll.text}`);
  }
  await sendHotkeyChatCommand(lines.join("\n"));
  setHotkeyStatus("Gewuerfelt");
}

async function openCharacterSheetViewFromHotkey() {
  try {
    const response = await fetch(`/api/character-sheets?ts=${Date.now()}`, { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || "Charaktersheet konnte nicht ermittelt werden.");
    }
    const sheets = Array.isArray(data.sheets) ? data.sheets : [];
    const targetUserId = data.default_user_id
      || sheets.find((sheet) => sheet.is_me)?.user_id
      || sheets.find((sheet) => sheet.has_sheet || sheet.has_pdf)?.user_id
      || sheets[0]?.user_id
      || "";
    const projectId = data.project?.id || "";
    if (!targetUserId || !projectId) {
      throw new Error("Kein Charaktersheet verfuegbar.");
    }
    const path = routePath("/charakterbogen/ansicht", "/Charakterbogen/Ansicht");
    const sheetUrl = `${path}?user_id=${encodeURIComponent(targetUserId)}&project_id=${encodeURIComponent(projectId)}`;
    window.open(sheetUrl, "_blank", "noopener");
  } catch (error) {
    setHotkeyStatus(error.message || "Charaktersheet nicht verfuegbar");
    window.setTimeout(() => {
      window.location.href = routePath("/charakterbogen", "/Charakterbogen");
    }, 900);
  }
}

async function executeHotkeyCommand(command) {
  if (!command) return;
  if (command.type === "sheet-roll") {
    await executeSheetRollHotkey(command);
    return;
  }
  if (command.type === "chat") {
    await sendHotkeyChatCommand(command.message || "");
    setHotkeyStatus("Gesendet");
    return;
  }
  const definition = definitionById(command.id);
  if (!definition) {
    setHotkeyStatus("Befehl nicht verfuegbar");
    return;
  }
  if (definition.kind === "help") {
    openHelpOverlay();
    return;
  }
  if (definition.kind === "sheet-view") {
    await openCharacterSheetViewFromHotkey();
    return;
  }
  if (definition.kind === "navigate") {
    window.location.href = routePath(definition.localPath, definition.remotePath);
  }
}

function setHotkeyStatus(message) {
  const status = document.getElementById("hotkeyBarStatus");
  if (!status) return;
  status.textContent = message || "";
  if (message) {
    window.clearTimeout(setHotkeyStatus.timeoutId);
    setHotkeyStatus.timeoutId = window.setTimeout(() => {
      status.textContent = "";
    }, 1800);
  }
}

function ensureHotkeyBar() {
  let bar = document.getElementById("hotkeyBar");
  if (bar) return bar;
  bar = document.createElement("section");
  bar.id = "hotkeyBar";
  bar.className = "hotkey-bar";
  bar.innerHTML = `
    <div id="hotkeyBarSlots" class="hotkey-slots"></div>
    <div class="hotkey-actions">
      <span id="hotkeyBarStatus" class="hotkey-status"></span>
      <button id="hotkeyAddButton" class="hotkey-tool-button" type="button" title="Befehl hinzufuegen">+</button>
      <button id="hotkeyEditButton" class="hotkey-tool-button" type="button" title="Hotkeys bearbeiten">Edit</button>
    </div>
  `;
  document.body.appendChild(bar);
  bar.querySelector("#hotkeyAddButton").addEventListener("click", openHotkeyDialog);
  bar.querySelector("#hotkeyEditButton").addEventListener("click", () => {
    bar.classList.toggle("editing");
    renderHotkeyBar();
  });
  return bar;
}

function renderHotkeyBar() {
  const bar = ensureHotkeyBar();
  const slotRoot = bar.querySelector("#hotkeyBarSlots");
  const commands = loadHotkeys();
  const editing = bar.classList.contains("editing");
  slotRoot.innerHTML = "";
  if (slotRoot.dataset.dragDropBound !== "true") {
    slotRoot.dataset.dragDropBound = "true";
    slotRoot.addEventListener("dragover", (event) => {
      if (!hasDraggedHotkeyCommand(event)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      slotRoot.classList.add("drag-over");
    });
    slotRoot.addEventListener("dragleave", (event) => {
      if (!slotRoot.contains(event.relatedTarget)) slotRoot.classList.remove("drag-over");
    });
    slotRoot.addEventListener("drop", (event) => {
      if (event.target?.closest?.(".hotkey-button")) return;
      const command = parseDraggedHotkeyCommand(event);
      if (!command) return;
      event.preventDefault();
      slotRoot.classList.remove("drag-over");
      appendHotkeyCommand(command);
    });
  }
  commands.forEach((command, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotkey-button";
    button.dataset.hotkeyIndex = String(index);
    button.title = `Alt+${index === 9 ? "0" : index + 1}`;
    const key = document.createElement("span");
    key.className = "hotkey-key";
    key.textContent = index === 9 ? "0" : String(index + 1);
    const label = document.createElement("span");
    label.className = "hotkey-label";
    label.textContent = hotkeyCommandLabel(command);
    button.append(key, label);
    bindHotkeyDropTarget(button, (droppedCommand) => replaceHotkeyCommand(index, droppedCommand));
    button.addEventListener("click", async () => {
      if (editing) return;
      try {
        await executeHotkeyCommand(command);
      } catch (error) {
        setHotkeyStatus(error.message);
      }
    });
    if (editing) {
      const remove = document.createElement("span");
      remove.className = "hotkey-remove";
      remove.textContent = "x";
      button.appendChild(remove);
      button.addEventListener("click", () => {
        const nextCommands = loadHotkeys();
        nextCommands.splice(index, 1);
        saveHotkeys(nextCommands);
        renderHotkeyBar();
      });
    }
    slotRoot.appendChild(button);
  });
  if (commands.length < 10) {
    const empty = document.createElement("button");
    empty.type = "button";
    empty.className = "hotkey-button hotkey-empty-slot";
    empty.title = "Eintrag hier ablegen";
    const key = document.createElement("span");
    key.className = "hotkey-key";
    key.textContent = commands.length === 9 ? "0" : String(commands.length + 1);
    const label = document.createElement("span");
    label.className = "hotkey-label";
    label.textContent = "Ablegen";
    empty.append(key, label);
    bindHotkeyDropTarget(empty, appendHotkeyCommand);
    empty.addEventListener("click", openHotkeyDialog);
    slotRoot.appendChild(empty);
  }
}

function ensureHotkeyDialog() {
  let overlay = document.getElementById("hotkeyDialogOverlay");
  if (overlay) return overlay;
  overlay = document.createElement("section");
  overlay.id = "hotkeyDialogOverlay";
  overlay.className = "hotkey-dialog-overlay hidden";
  overlay.innerHTML = `
    <div class="hotkey-dialog-backdrop" data-hotkey-close></div>
    <article class="hotkey-dialog" role="dialog" aria-modal="true" aria-labelledby="hotkeyDialogTitle">
      <header class="hotkey-dialog-header">
        <div>
          <p class="eyebrow">Hotkey-Bar</p>
          <h2 id="hotkeyDialogTitle">Befehl hinzufuegen</h2>
        </div>
        <button class="ghost-button compact-button" type="button" data-hotkey-close>Schliessen</button>
      </header>
      <div id="hotkeyCommandList" class="hotkey-command-list"></div>
    </article>
  `;
  document.body.appendChild(overlay);
  overlay.querySelectorAll("[data-hotkey-close]").forEach((element) => {
    element.addEventListener("click", closeHotkeyDialog);
  });
  return overlay;
}

function openHotkeyDialog() {
  const overlay = ensureHotkeyDialog();
  const list = overlay.querySelector("#hotkeyCommandList");
  list.innerHTML = "";
  for (const definition of commandDefinitions(globalThis.currentUserRole || "spieler")) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hotkey-command-option";
    button.textContent = definition.label;
    button.addEventListener("click", () => addHotkeyCommand(definition));
    list.appendChild(button);
  }
  overlay.classList.remove("hidden");
  overlay.querySelector("[data-hotkey-close]")?.focus({ preventScroll: true });
}

function closeHotkeyDialog() {
  document.getElementById("hotkeyDialogOverlay")?.classList.add("hidden");
}

function addHotkeyCommand(definition) {
  const commands = loadHotkeys();
  if (commands.length >= 10) {
    setHotkeyStatus("Maximal 10 Hotkeys");
    closeHotkeyDialog();
    return;
  }
  if (definition.kind === "custom-chat") {
    const label = window.prompt("Name fuer den Chatcommand:", "Command");
    if (!label) return;
    const message = window.prompt("Text fuer den Chatcommand:", "");
    if (!message) return;
    commands.push({ type: "chat", label: label.trim(), message: message.trim() });
  } else {
    commands.push({ type: "builtin", id: definition.id });
  }
  saveHotkeys(commands);
  closeHotkeyDialog();
  renderHotkeyBar();
}

window.eldranAddHotkeyCommand = function eldranAddHotkeyCommand(command) {
  return appendHotkeyCommand(command);
};

function installHotkeyShortcuts() {
  if (window.__eldranHotkeyBarInstalled) return;
  window.__eldranHotkeyBarInstalled = true;
  document.addEventListener("keydown", async (event) => {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const keyMap = { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "0": 9 };
    const index = keyMap[event.key];
    if (index === undefined) return;
    const command = loadHotkeys()[index];
    if (!command) return;
    event.preventDefault();
    try {
      await executeHotkeyCommand(command);
    } catch (error) {
      setHotkeyStatus(error.message);
    }
  }, true);
}

function initializeHotkeyBar() {
  ensureHotkeyBar();
  installHotkeyShortcuts();
  renderHotkeyBar();
}

window.addEventListener("eldran:hotkeys-updated", renderHotkeyBar);
window.addEventListener("storage", (event) => {
  if (event.key === hotkeyStorageKey()) renderHotkeyBar();
});

function ensurePasswordDialog() {
  let overlay = document.getElementById("passwordDialogOverlay");
  if (overlay) return overlay;
  overlay = document.createElement("section");
  overlay.id = "passwordDialogOverlay";
  overlay.className = "password-dialog-overlay hidden";
  overlay.innerHTML = `
    <div class="password-dialog-backdrop" data-password-close></div>
    <article class="password-dialog" role="dialog" aria-modal="true" aria-labelledby="passwordDialogTitle">
      <header class="hotkey-dialog-header">
        <div>
          <p class="eyebrow">Account</p>
          <h2 id="passwordDialogTitle">Passwort aendern</h2>
        </div>
        <button class="ghost-button compact-button" type="button" data-password-close>Schliessen</button>
      </header>
      <form id="passwordChangeForm" class="auth-form">
        <input id="passwordCurrentInput" class="sidebar-input" type="password" placeholder="Aktuelles Passwort" required>
        <input id="passwordNewInput" class="sidebar-input" type="password" placeholder="Neues Passwort" required>
        <input id="passwordConfirmInput" class="sidebar-input" type="password" placeholder="Neues Passwort bestaetigen" required>
        <button class="ghost-button compact-button" type="submit">Passwort speichern</button>
        <p id="passwordChangeStatus" class="upload-hint">Bereit.</p>
      </form>
    </article>
  `;
  document.body.appendChild(overlay);
  overlay.querySelectorAll("[data-password-close]").forEach((element) => {
    element.addEventListener("click", closePasswordDialog);
  });
  overlay.querySelector("#passwordChangeForm").addEventListener("submit", submitPasswordChange);
  return overlay;
}

function openPasswordDialog() {
  const overlay = ensurePasswordDialog();
  overlay.classList.remove("hidden");
  overlay.querySelector("#passwordCurrentInput")?.focus({ preventScroll: true });
}

function closePasswordDialog() {
  document.getElementById("passwordDialogOverlay")?.classList.add("hidden");
}

async function submitPasswordChange(event) {
  event.preventDefault();
  const overlay = ensurePasswordDialog();
  const status = overlay.querySelector("#passwordChangeStatus");
  const form = overlay.querySelector("#passwordChangeForm");
  status.textContent = "Passwort wird geaendert...";
  try {
    const response = await fetch("/api/auth/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_password: overlay.querySelector("#passwordCurrentInput").value,
        new_password: overlay.querySelector("#passwordNewInput").value,
        new_password_confirm: overlay.querySelector("#passwordConfirmInput").value,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || "Passwort konnte nicht geaendert werden.");
    }
    if (data.token) {
      setStoredAuthToken(data.token);
    }
    form.reset();
    status.textContent = "Passwort wurde geaendert.";
    window.setTimeout(closePasswordDialog, 900);
  } catch (error) {
    status.textContent = error.message;
  }
}

function installPasswordButtons(user) {
  if (user?.id === "local-admin") return;
  document.querySelectorAll(".auth-strip").forEach((strip) => {
    if (strip.querySelector("[data-password-button]")) return;
    const logoutButton = strip.querySelector("[data-logout-button]");
    const button = document.createElement("button");
    button.dataset.passwordButton = "true";
    button.className = "ghost-button compact-button";
    button.type = "button";
    button.textContent = "Passwort";
    button.addEventListener("click", openPasswordDialog);
    if (logoutButton) {
      strip.insertBefore(button, logoutButton);
    } else {
      strip.appendChild(button);
    }
  });
}

async function redirectSpielleiterWithoutProject(user) {
  if ((user?.role || "") !== "spielleiter" || window.location.pathname === "/projekte/neu") {
    return false;
  }
  const response = await fetch("/api/projects", { cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return false;
  }
  if (Array.isArray(data.projects) && data.projects.length) {
    return false;
  }
  window.location.href = "/projekte/neu";
  return true;
}

async function initializeAuthUi(options = {}) {
  const { required = true } = options;
  const response = await fetch("/api/auth/me", { cache: "no-store" });
  if (response.status === 401) {
    clearStoredAuthToken();
    if (required) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      return null;
    }

    document.querySelectorAll("[data-current-user]").forEach((element) => {
      element.textContent = "Gast";
    });

    document.querySelectorAll("[data-logout-button]").forEach((button) => {
      button.textContent = "Login";
      button.addEventListener("click", () => {
        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      });
    });
    return null;
  }
  const data = await response.json();
  const user = data.user;
  globalThis.currentUserId = user.id;
  globalThis.currentUsername = user.username;
  globalThis.currentUserRole = user.role;
  if (await redirectSpielleiterWithoutProject(user)) {
    return null;
  }
  const storedRouteMode = window.sessionStorage.getItem("eldran-route-mode");
  const currentPath = window.location.pathname;
  let routeMode = document.body?.dataset?.routeMode || "";
  if (!routeMode) {
    if (["/Karte", "/Battlemap", "/Eldran", "/Charakterbogen", "/Charakter-Builder"].includes(currentPath)) {
      routeMode = "remote";
    } else if (["/karte", "/battlemap", "/chat", "/db", "/notizen", "/charakterbogen", "/charakter-builder", "/projekte/neu"].includes(currentPath)) {
      routeMode = "local";
    } else if (storedRouteMode) {
      routeMode = storedRouteMode;
    } else {
      routeMode = (user.role === "admin" || user.role === "spielleiter") ? "local" : "remote";
    }
  }
  window.sessionStorage.setItem("eldran-route-mode", routeMode);
  const preferredMapPath = routeMode === "remote" ? "/Karte" : "/karte";
  const preferredBattlemapPath = routeMode === "remote" ? "/Battlemap" : "/battlemap";
  const preferredChatPath = routeMode === "remote" ? "/Eldran" : "/chat";
  const preferredSheetPath = routeMode === "remote" ? "/Charakterbogen" : "/charakterbogen";

  document.querySelectorAll("[data-current-user]").forEach((element) => {
    element.textContent = user.username;
  });

  document.querySelectorAll("[data-gm-only]").forEach((element) => {
    element.classList.toggle("hidden", !(user.role === "admin" || user.role === "spielleiter"));
  });
  document.querySelectorAll("[data-admin-only]").forEach((element) => {
    element.classList.toggle("hidden", user.role !== "admin");
  });
  installPasswordButtons(user);

  document.querySelectorAll('[data-surface-link="map"]').forEach((element) => {
    element.setAttribute("href", preferredMapPath);
    if (element.dataset.surfaceLinkBound !== "true") {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = preferredMapPath;
      });
      element.dataset.surfaceLinkBound = "true";
    }
  });
  document.querySelectorAll('[data-surface-link="battlemap"]').forEach((element) => {
    element.setAttribute("href", preferredBattlemapPath);
    if (element.dataset.surfaceLinkBound !== "true") {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = preferredBattlemapPath;
      });
      element.dataset.surfaceLinkBound = "true";
    }
  });
  document.querySelectorAll('[data-nav-link="chat"]').forEach((element) => {
    element.setAttribute("href", preferredChatPath);
    if (element.dataset.navLinkBound !== "true") {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = preferredChatPath;
      });
      element.dataset.navLinkBound = "true";
    }
  });
  document.querySelectorAll('[data-nav-link="sheet"]').forEach((element) => {
    element.setAttribute("href", preferredSheetPath);
    if (element.dataset.navLinkBound !== "true") {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = preferredSheetPath;
      });
      element.dataset.navLinkBound = "true";
    }
  });

  document.querySelectorAll("[data-logout-button]").forEach((button) => {
    button.addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      clearStoredAuthToken();
      window.location.href = "/login";
    });
  });

  initializeHotkeyBar();
  return user;
}
