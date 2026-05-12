const sheetViewStatus = document.getElementById("sheetViewStatus");
const sheetViewLayout = document.getElementById("sheetViewLayout");
const sheetViewRoot = document.getElementById("sheetViewRoot");
const sheetNotesEditor = document.getElementById("sheetNotesEditor");
const sheetNotesStatus = document.getElementById("sheetNotesStatus");
const AUTH_TOKEN_STORAGE_KEY = "eldran-auth-token";
let currentNotesStorageKey = "";
let currentSheetUserId = "";
let currentSheetProjectId = "";
let currentSheetData = {};

const ABILITY_LABELS = {
  strength: "STAERKE",
  dexterity: "GESCHICKLICHKEIT",
  constitution: "KONSTITUTION",
  intelligence: "INTELLIGENZ",
  wisdom: "WEISHEIT",
  charisma: "CHARISMA",
};

const SKILL_LABELS = {
  acrobatics: "Akrobatik",
  animal_handling: "Mit Tieren umgehen",
  arcana: "Arkane Kunde",
  athletics: "Athletik",
  deception: "Taeuschen",
  history: "Geschichte",
  insight: "Motiv erkennen",
  intimidation: "Einschuechtern",
  investigation: "Nachforschungen",
  medicine: "Heilkunde",
  nature: "Naturkunde",
  perception: "Wahrnehmung",
  performance: "Auftreten",
  persuasion: "Ueberzeugen",
  religion: "Religion",
  sleight_of_hand: "Fingerfertigkeit",
  stealth: "Heimlichkeit",
  survival: "Ueberlebenskunst",
};

const DND_COIN_DEFINITIONS = [
  { key: "cp", shortLabel: "KM", label: "Kupfer", copperValue: 1 },
  { key: "sp", shortLabel: "SM", label: "Silber", copperValue: 10 },
  { key: "ep", shortLabel: "EM", label: "Elektrum", copperValue: 50 },
  { key: "gp", shortLabel: "GM", label: "Gold", copperValue: 100 },
  { key: "pp", shortLabel: "PM", label: "Platin", copperValue: 1000 },
];

const ELDRAN_ATTRIBUTES = [
  { key: "koerper", label: "Koerper" },
  { key: "geist", label: "Geist" },
  { key: "instinkt", label: "Instinkt" },
  { key: "praesenz", label: "Praesenz" },
  { key: "resonanz", label: "Resonanz" },
];

const ELDRAN_DISCIPLINES = [
  { key: "physisch", label: "Physisch", type: "Kampf", attribute: "Koerper" },
  { key: "mental", label: "Mental", type: "Kampf", attribute: "Geist" },
  { key: "feuer", label: "Feuer", type: "Kampf", attribute: "Resonanz" },
  { key: "wasser", label: "Wasser", type: "Kampf", attribute: "Resonanz" },
  { key: "natur", label: "Natur", type: "Kampf", attribute: "Resonanz" },
  { key: "frost", label: "Frost", type: "Kampf", attribute: "Resonanz" },
  { key: "erde", label: "Erde", type: "Kampf", attribute: "Resonanz" },
  { key: "wind", label: "Wind", type: "Kampf", attribute: "Resonanz" },
  { key: "runenkunde", label: "Runenkunde", type: "Allgemein", attribute: "Geist" },
  { key: "taktik", label: "Taktik", type: "Allgemein", attribute: "Geist" },
  { key: "ueberleben", label: "Ueberleben", type: "Allgemein", attribute: "Instinkt" },
  { key: "navigation", label: "Navigation", type: "Allgemein", attribute: "Instinkt" },
  { key: "heimlichkeit", label: "Heimlichkeit", type: "Allgemein", attribute: "Instinkt" },
  { key: "wahrnehmung", label: "Wahrnehmung", type: "Allgemein", attribute: "Instinkt" },
  { key: "ueberzeugen", label: "Ueberzeugen", type: "Allgemein", attribute: "Praesenz" },
  { key: "darstellen", label: "Darstellen", type: "Allgemein", attribute: "Praesenz" },
  { key: "fuehrung", label: "Fuehrung", type: "Allgemein", attribute: "Praesenz" },
  { key: "menschenkenntnis", label: "Menschenkenntnis", type: "Allgemein", attribute: "Instinkt" },
  { key: "gossenwissen", label: "Gossenwissen", type: "Allgemein", attribute: "Instinkt" },
  { key: "handwerk", label: "Handwerk", type: "Allgemein", attribute: "Koerper" },
  { key: "medizin", label: "Medizin", type: "Allgemein", attribute: "Geist" },
  { key: "naturkunde", label: "Naturkunde", type: "Allgemein", attribute: "Geist" },
  { key: "alchemie", label: "Alchemie", type: "Allgemein", attribute: "Geist" },
  { key: "technik", label: "Technik", type: "Allgemein", attribute: "Geist" },
  { key: "athletik", label: "Athletik", type: "Allgemein", attribute: "Koerper" },
  { key: "fortbewegung", label: "Fortbewegung", type: "Allgemein", attribute: "Koerper" },
  { key: "ressourcenabbau", label: "Ressourcenabbau", type: "Allgemein", attribute: "Koerper" },
  { key: "einschuechtern", label: "Einschuechtern", type: "Allgemein", attribute: "Praesenz" },
  { key: "handel", label: "Handel", type: "Allgemein", attribute: "Praesenz" },
];

const DND_SKILL_ABILITY_GROUPS = [
  { key: "STR", label: "Staerke" },
  { key: "DEX", label: "Geschicklichkeit" },
  { key: "CON", label: "Konstitution" },
  { key: "INT", label: "Intelligenz" },
  { key: "WIS", label: "Weisheit" },
  { key: "CHA", label: "Charisma" },
  { key: "", label: "Ohne Attribut" },
];

const DND_SKILL_DEFAULT_ABILITIES = {
  acrobatics: "DEX",
  animal_handling: "WIS",
  arcana: "INT",
  athletics: "STR",
  deception: "CHA",
  history: "INT",
  insight: "WIS",
  intimidation: "CHA",
  investigation: "INT",
  medicine: "WIS",
  nature: "INT",
  perception: "WIS",
  performance: "CHA",
  persuasion: "CHA",
  religion: "INT",
  sleight_of_hand: "DEX",
  stealth: "DEX",
  survival: "WIS",
};

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.values(value).some(hasValue);
  return value !== undefined && value !== null && String(value).trim() !== "" && String(value).trim() !== "-";
}

function text(value) {
  return hasValue(value) ? String(value) : "-";
}

function parseDndSignedNumber(value, fallback = 0) {
  const match = String(value ?? "").match(/[+-]?\d+/);
  if (!match) return fallback;
  const parsed = Number.parseInt(match[0], 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampDndHp(value, maxHp = 9999) {
  const parsed = Number.parseInt(String(value ?? "0"), 10);
  const upper = maxHp > 0 ? maxHp : 9999;
  return Math.max(0, Math.min(upper, Number.isFinite(parsed) ? parsed : 0));
}

function parseDndDeathSaveCount(value) {
  const textValue = String(value ?? "").trim();
  const numeric = Number.parseInt(textValue, 10);
  if (Number.isFinite(numeric)) {
    return Math.max(0, Math.min(3, numeric));
  }
  const marks = textValue.match(/[xX✓✔]/g);
  return Math.max(0, Math.min(3, marks?.length || 0));
}

function persistToken(token) {
  if (!token) return;
  window.sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

function hydrateTokenFromHash() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const token = hash.get("auth") || "";
  persistToken(token);
  if (token) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
}

function authHeaders() {
  const token = window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
  if (token && !window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) {
    persistToken(token);
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function notesStorageKey(userId, projectId) {
  return `eldran-sheet-notes:${projectId || "default"}:${userId}`;
}

function setNotesStatus(message) {
  sheetNotesStatus.textContent = message;
}

function loadNotes(userId, projectId) {
  currentNotesStorageKey = notesStorageKey(userId, projectId);
  sheetNotesEditor.innerHTML = window.localStorage.getItem(currentNotesStorageKey) || "";
  setNotesStatus("Bereit");
}

function saveNotes() {
  if (!currentNotesStorageKey) return;
  window.localStorage.setItem(currentNotesStorageKey, sheetNotesEditor.innerHTML);
  setNotesStatus("Gespeichert");
}

function bindNotesEditor() {
  document.querySelectorAll("[data-note-command]").forEach((button) => {
    button.addEventListener("click", () => {
      sheetNotesEditor.focus();
      document.execCommand(button.dataset.noteCommand, false, null);
      saveNotes();
    });
  });
  sheetNotesEditor.addEventListener("input", saveNotes);
}

function box(label, value) {
  const article = document.createElement("article");
  article.className = "dnd-sheet-box";
  const strong = document.createElement("strong");
  strong.textContent = text(value);
  const span = document.createElement("span");
  span.textContent = label;
  article.append(strong, span);
  return article;
}

function panel(titleText, child) {
  const section = document.createElement("section");
  section.className = "dnd-sheet-panel";
  const title = document.createElement("h3");
  title.textContent = titleText;
  section.appendChild(title);
  section.appendChild(child);
  return section;
}

function renderDndHpPanel(combat = {}) {
  const grid = document.createElement("div");
  grid.className = "dnd-hp-grid";
  grid.append(
    box("MAX TP", combat.hit_points_max),
    renderDndCurrentHpEditor(combat),
    renderDndTempHpEditor(combat),
    box("TREFFERWUERFEL", combat.hit_dice),
    renderDndDeathSavesPanel(combat),
  );
  return panel("TREFFERPUNKTE", grid);
}

function renderDndCurrentHpEditor(combat = {}) {
  const article = document.createElement("article");
  article.className = "dnd-sheet-box dnd-current-hp-editor";
  const maxHp = parseDndSignedNumber(combat.hit_points_max, 9999);
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "1";
  if (maxHp > 0) {
    input.max = String(maxHp);
  }
  input.value = String(clampDndHp(combat.hit_points_current, maxHp));
  const label = document.createElement("span");
  label.textContent = "AKTUELLE TP";
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Speichern";
  saveButton.addEventListener("click", async () => {
    const nextHp = clampDndHp(input.value, maxHp);
    const values = { hit_points_current: String(nextHp) };
    if (nextHp > 0) {
      values.death_saves_successes = "0";
      values.death_saves_failures = "0";
    }
    await saveDndCombatValues(values, "Aktuelle TP gespeichert");
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveButton.click();
    }
  });

  const adjustInput = document.createElement("input");
  adjustInput.type = "number";
  adjustInput.min = "0";
  adjustInput.step = "1";
  adjustInput.placeholder = "Wert";
  const healButton = document.createElement("button");
  healButton.type = "button";
  healButton.textContent = "Heilung";
  const damageButton = document.createElement("button");
  damageButton.type = "button";
  damageButton.textContent = "Schaden";
  const applyAdjustment = async (mode) => {
    const amount = Number.parseInt(adjustInput.value || "0", 10);
    if (!Number.isFinite(amount) || amount <= 0) {
      setNotesStatus("Bitte einen TP-Wert groesser als 0 eintragen");
      return;
    }
    const currentCombat = currentSheetData?.combat || combat || {};
    const currentHp = clampDndHp(currentCombat.hit_points_current, maxHp);
    const currentTempHp = clampDndHp(currentCombat.hit_points_temp, 9999);
    const values = {};
    if (mode === "heal") {
      const nextHp = clampDndHp(currentHp + amount, maxHp);
      values.hit_points_current = String(nextHp);
      if (nextHp > 0) {
        values.death_saves_successes = "0";
        values.death_saves_failures = "0";
      }
    } else {
      const tempAbsorbed = Math.min(currentTempHp, amount);
      const remainingDamage = amount - tempAbsorbed;
      values.hit_points_temp = String(Math.max(0, currentTempHp - tempAbsorbed));
      values.hit_points_current = String(clampDndHp(currentHp - remainingDamage, maxHp));
    }
    await saveDndCombatValues(values, mode === "heal" ? "Heilung angewendet" : "Schaden angewendet");
  };
  healButton.addEventListener("click", () => applyAdjustment("heal"));
  damageButton.addEventListener("click", () => applyAdjustment("damage"));
  adjustInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      healButton.click();
    }
  });
  const adjustRow = document.createElement("div");
  adjustRow.className = "dnd-hp-adjust-row";
  adjustRow.append(adjustInput, healButton, damageButton);
  article.append(input, label, saveButton, adjustRow);
  return article;
}

function renderDndTempHpEditor(combat = {}) {
  const article = document.createElement("article");
  article.className = "dnd-sheet-box dnd-current-hp-editor dnd-temp-hp-editor";
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "1";
  input.value = String(clampDndHp(combat.hit_points_temp, 9999));
  const label = document.createElement("span");
  label.textContent = "TEMP. TP";
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Speichern";
  saveButton.addEventListener("click", async () => {
    await saveDndCombatValues({ hit_points_temp: String(clampDndHp(input.value, 9999)) }, "Temp. TP gespeichert");
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveButton.click();
    }
  });
  article.append(input, label, saveButton);
  return article;
}

function renderDndDeathSavesPanel(combat = {}) {
  const article = document.createElement("article");
  article.className = "dnd-sheet-box dnd-death-save-box";
  const label = document.createElement("span");
  label.textContent = "TOD RETTEN";
  const counts = document.createElement("div");
  counts.className = "dnd-death-save-counts";
  const successes = parseDndDeathSaveCount(combat.death_saves_successes);
  const failures = parseDndDeathSaveCount(combat.death_saves_failures);
  const successText = document.createElement("strong");
  successText.textContent = `Erfolge ${successes}/3`;
  const failureText = document.createElement("strong");
  failureText.textContent = `Misserfolge ${failures}/3`;
  counts.append(successText, failureText);
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Tod retten";
  const currentHp = clampDndHp(combat.hit_points_current, parseDndSignedNumber(combat.hit_points_max, 9999));
  button.disabled = currentHp > 0;
  button.title = currentHp > 0 ? "Nur bei 0 aktuellen TP moeglich." : "Todesrettungswurf wuerfeln.";
  button.addEventListener("click", () => rollDndDeathSave(combat));
  article.append(label, counts, button);
  return article;
}

function table(headers, rows) {
  const tableElement = document.createElement("table");
  tableElement.className = "dnd-simple-table";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const header of headers) {
    const th = document.createElement("th");
    th.textContent = header;
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  const tbody = document.createElement("tbody");
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const value of row) {
      const td = document.createElement("td");
      td.textContent = text(value);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  tableElement.append(thead, tbody);
  return tableElement;
}

function parseDndCoinAmount(value) {
  const number = Number.parseInt(String(value ?? "0").replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(number) ? number : 0;
}

function dndCoinsToCopper(resources = {}) {
  return DND_COIN_DEFINITIONS.reduce(
    (total, coin) => total + Math.max(0, parseDndCoinAmount(resources[coin.key])) * coin.copperValue,
    0,
  );
}

function dndCoinsFromCopper(totalCopper) {
  let remaining = Math.max(0, Math.floor(Number(totalCopper) || 0));
  const result = {};
  for (const coin of [...DND_COIN_DEFINITIONS].reverse()) {
    result[coin.key] = Math.floor(remaining / coin.copperValue);
    remaining %= coin.copperValue;
  }
  return result;
}

function normalizeDndCoinResources(resources = {}) {
  return dndCoinsFromCopper(dndCoinsToCopper(resources));
}

function renderDndCoinsPanel(resources = {}, options = {}) {
  const section = document.createElement("section");
  section.className = "dnd-sheet-panel dnd-coins-panel";
  const title = document.createElement("h3");
  title.textContent = "MUENZEN";
  section.appendChild(title);

  const normalizedCoins = normalizeDndCoinResources(resources);
  const grid = document.createElement("div");
  grid.className = "dnd-coin-grid dnd-coin-summary-grid";
  const editable = Boolean(options.editableCoins && typeof options.onCoinsChange === "function");
  for (const coin of DND_COIN_DEFINITIONS) {
    const item = document.createElement("article");
    item.className = "dnd-coin-display";
    const caption = document.createElement("span");
    caption.textContent = `${coin.label} (${coin.shortLabel})`;
    const value = document.createElement("strong");
    value.textContent = String(normalizedCoins[coin.key] || 0);
    item.append(value, caption);
    grid.appendChild(item);
  }
  section.appendChild(grid);

  if (editable) {
    const details = document.createElement("details");
    details.className = "dnd-coin-editor";
    const summary = document.createElement("summary");
    summary.textContent = "Geld bearbeiten";
    const editorGrid = document.createElement("div");
    editorGrid.className = "dnd-coin-grid";
    const inputs = {};
    for (const coin of DND_COIN_DEFINITIONS) {
      const label = document.createElement("label");
      label.className = "dnd-coin-field";
      const caption = document.createElement("span");
      caption.textContent = `${coin.label} (${coin.shortLabel})`;
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.step = "1";
      input.placeholder = "0";
      inputs[coin.key] = input;
      label.append(caption, input);
      editorGrid.appendChild(label);
    }
    const actionRow = document.createElement("div");
    actionRow.className = "dnd-coin-action-row";
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "Hinzufuegen";
    const subtractButton = document.createElement("button");
    subtractButton.type = "button";
    subtractButton.textContent = "Abziehen";
    const applyDelta = (direction) => {
      const deltaCopper = DND_COIN_DEFINITIONS.reduce(
        (total, coin) => total + (parseDndCoinAmount(inputs[coin.key]?.value) * coin.copperValue),
        0,
      );
      if (!deltaCopper) {
        inputs.gp?.focus();
        return;
      }
      const nextTotal = dndCoinsToCopper(normalizedCoins) + (direction * deltaCopper);
      for (const input of Object.values(inputs)) {
        input.value = "";
      }
      options.onCoinsChange(dndCoinsFromCopper(nextTotal));
    };
    addButton.addEventListener("click", () => applyDelta(1));
    subtractButton.addEventListener("click", () => applyDelta(-1));
    actionRow.append(addButton, subtractButton);
    details.append(summary, editorGrid, actionRow);
    section.appendChild(details);
  }

  return section;
}

function attackTable(attacks, options = {}) {
  const tableElement = document.createElement("table");
  tableElement.className = "dnd-simple-table";
  tableElement.innerHTML = "<thead><tr><th>Name</th><th>Treffer</th><th>Schaden</th><th>Notizen</th><th></th></tr></thead>";
  const tbody = document.createElement("tbody");
  (attacks || []).forEach((attack, attackIndex) => {
    const row = document.createElement("tr");
    const equipped = isDndAttackEquipped(attack);
    if (!equipped) {
      row.classList.add("dnd-attack-row-unequipped");
    }
    for (const value of [attack.name, attack.hit, attack.damage, attack.notes]) {
      const cell = document.createElement("td");
      cell.textContent = text(value);
      row.appendChild(cell);
    }
    if (hasValue(attack)) {
      const actionCell = document.createElement("td");
      const actionWrap = document.createElement("div");
      actionWrap.className = "dnd-attack-actions";
      if (options.editableAttacks && typeof options.onAttackToggle === "function") {
        const toggleButton = document.createElement("button");
        toggleButton.type = "button";
        toggleButton.className = "dnd-attack-equip-button";
        toggleButton.textContent = equipped ? "Abruesten" : "Ausruesten";
        toggleButton.addEventListener("click", (event) => {
          event.stopPropagation();
          options.onAttackToggle(attackIndex, !equipped);
        });
        actionWrap.appendChild(toggleButton);
      }
      if (equipped && window.EldranSheetRolls) {
        const action = {
          name: attack.name || "Angriff",
          hit: attack.hit || "",
          damage: attack.damage || attack.notes || "",
          damage_notes: attack.notes || "",
        };
        const commandFactory = () => ({
          type: "sheet-roll",
          mode: "action",
          label: action.name,
          action,
        });
        actionWrap.appendChild(window.EldranSheetRolls.quickbarButton(commandFactory));
        window.EldranSheetRolls.makeQuickbarDraggable(row, commandFactory);
        window.EldranSheetRolls.makeRollable(row, action);
      }
      actionCell.appendChild(actionWrap);
      row.appendChild(actionCell);
    } else {
      row.appendChild(document.createElement("td"));
    }
    tbody.appendChild(row);
  });
  tableElement.appendChild(tbody);
  return tableElement;
}

function isDndAttackEquipped(attack = {}) {
  return attack.equipped !== false;
}

function dndSkillAbilityCode(key, value = {}) {
  return String(value.ability || DND_SKILL_DEFAULT_ABILITIES[key] || "").toUpperCase();
}

function dndIsSkillProficient(skillKey, skillValue = {}, abilities = {}, combat = {}) {
  if (skillValue?.proficient || skillValue?.expertise) return true;
  const proficiencyBonus = Math.abs(parseDndSignedNumber(combat.proficiency_bonus, 0));
  if (!proficiencyBonus) return false;
  const skillModifier = parseDndSignedNumber(skillValue?.modifier, 0);
  const abilityCode = dndSkillAbilityCode(skillKey, skillValue);
  const abilityEntry = Object.entries(ABILITY_LABELS).find(([key]) => {
    const codes = { strength: "STR", dexterity: "DEX", constitution: "CON", intelligence: "INT", wisdom: "WIS", charisma: "CHA" };
    return codes[key] === abilityCode;
  });
  const abilityModifier = abilityEntry ? parseDndSignedNumber(abilities?.[abilityEntry[0]]?.modifier, 0) : 0;
  const difference = skillModifier - abilityModifier;
  return difference === proficiencyBonus || difference === proficiencyBonus * 2;
}

function renderDndCheckLine({ label, modifier, proficient = false, kind = "Skill" }) {
  const row = document.createElement("div");
  row.className = "dnd-ability-check-line";
  if (proficient && kind === "Skill") {
    row.classList.add("dnd-skill-proficient");
  }
  const dot = document.createElement("span");
  dot.className = `dnd-proficiency-dot${proficient ? " filled" : ""}`;
  const valueElement = document.createElement("strong");
  valueElement.textContent = text(modifier);
  const labelElement = document.createElement("span");
  labelElement.textContent = label;
  if (proficient && kind === "Skill") {
    labelElement.className = "dnd-skill-proficient-label";
  }
  row.append(dot, valueElement, labelElement);
  if (window.EldranSheetRolls) {
    window.EldranSheetRolls.makeCheckRollable(row, {
      kind,
      name: label,
      modifier: modifier || "0",
    });
  }
  return row;
}

function dndSkillTable(skills) {
  const groups = document.createElement("div");
  groups.className = "dnd-skill-groups";
  const entries = Object.entries(skills || {});
  for (const groupDefinition of DND_SKILL_ABILITY_GROUPS) {
    const groupEntries = entries.filter(([, value]) => String(value?.ability || "").toUpperCase() === groupDefinition.key);
    if (!groupEntries.length) continue;
    const group = document.createElement("section");
    group.className = "dnd-skill-group";
    const heading = document.createElement("h4");
    heading.textContent = groupDefinition.label;
    const tableElement = document.createElement("table");
    tableElement.className = "dnd-simple-table dnd-skill-table";
    tableElement.innerHTML = "<thead><tr><th>Skill</th><th>Mod</th><th>Prof.</th></tr></thead>";
    const tbody = document.createElement("tbody");
    for (const [key, value] of groupEntries) {
      const row = document.createElement("tr");
      if (dndIsSkillProficient(key, value, {}, {})) {
        row.classList.add("dnd-skill-proficient");
      }
      const label = SKILL_LABELS[key] || key.replaceAll("_", " ");
      [label, value?.modifier, value?.expertise ? "Expertise" : value?.proficient ? "Ja" : "-"].forEach((cellValue, cellIndex) => {
        const cell = document.createElement("td");
        cell.textContent = text(cellValue);
        if (cellIndex === 0 && row.classList.contains("dnd-skill-proficient")) {
          cell.className = "dnd-skill-proficient-label";
        }
        row.appendChild(cell);
      });
      if (window.EldranSheetRolls) {
        window.EldranSheetRolls.makeCheckRollable(row, {
          kind: "Skill",
          name: label,
          modifier: value?.modifier || "0",
        });
      }
      tbody.appendChild(row);
    }
    tableElement.appendChild(tbody);
    group.append(heading, tableElement);
    groups.appendChild(group);
  }
  return groups;
}

function detailsPanel(titleText, value) {
  const section = document.createElement("section");
  section.className = "dnd-sheet-panel dnd-details-panel";
  const title = document.createElement("h3");
  title.textContent = titleText;
  section.appendChild(title);
  const blocks = splitBlocks(value);
  if (!blocks.length) {
    const empty = document.createElement("p");
    empty.className = "dnd-empty-text";
    empty.textContent = "Nicht ausgefuellt.";
    section.appendChild(empty);
    return section;
  }
  for (const block of blocks) {
    const details = document.createElement("details");
    details.open = blocks.length === 1;
    const summary = document.createElement("summary");
    summary.textContent = block.title;
    const p = document.createElement("p");
    p.textContent = block.body;
    details.append(summary);
    if (window.EldranSheetRolls) {
      const commandFactory = () => ({
        type: "sheet-roll",
        mode: "feature",
        label: block.title || titleText,
        action: {
          name: block.title || titleText,
          text: block.body || "",
        },
      });
      details.appendChild(window.EldranSheetRolls.quickbarButton(commandFactory));
      window.EldranSheetRolls.makeQuickbarDraggable(details, commandFactory);
    }
    details.appendChild(p);
    section.appendChild(details);
  }
  return section;
}

function splitBlocks(value) {
  const source = String(value || "").trim();
  if (!source) return [];
  const markerPattern = /===\s*([^=]+?)\s*===/g;
  const matches = [...source.matchAll(markerPattern)];
  if (!matches.length) return [{ title: "Details", body: source }];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? source.length;
    return { title: match[1].trim(), body: source.slice(start, end).trim() };
  }).filter((item) => item.body);
}

function isEldranSheet(data) {
  return Boolean(data?.combat_disciplines || data?.general_disciplines || data?.attributes?.koerper !== undefined);
}

function renderEldranSheet(data) {
  const identity = data.identity || {};
  const combat = data.combat || {};
  const equipment = data.equipment || {};
  const notes = data.notes || {};
  sheetViewRoot.innerHTML = "";

  const sheet = document.createElement("section");
  sheet.className = "dnd-sheet sheet-view-sheet eldran-sheet-view";

  const header = document.createElement("div");
  header.className = "dnd-sheet-header";
  const nameBox = box("CHARAKTERNAME", identity.character_name);
  nameBox.classList.add("dnd-character-name-box");
  const headerGrid = document.createElement("div");
  headerGrid.className = "dnd-header-grid";
  headerGrid.append(
    box("VOLK", identity.volk),
    box("STUFE", identity.level || 1),
    box("KONZEPT", identity.concept),
    box("FRAKTION", identity.faction),
    box("HERKUNFT", identity.origin),
    box("MOTIVATION", identity.motivation),
  );
  header.append(nameBox, headerGrid);
  sheet.appendChild(header);

  const dashboard = document.createElement("div");
  dashboard.className = "dnd-dashboard";
  dashboard.append(
    box("LP AKTUELL", combat.hp_current),
    box("LP MAX", combat.hp_max),
    box("RUESTUNG", combat.armor_value),
    box("INITIATIVE", combat.initiative_bonus),
    box("WAFFE", equipment.weapon_name || equipment.weapon_type),
    box("FOKUS", equipment.focus_type),
  );
  sheet.appendChild(dashboard);

  const body = document.createElement("div");
  body.className = "dnd-sheet-body eldran-sheet-body";
  body.append(
    renderEldranAttributesPanel(data.attributes || {}),
    renderEldranSkillTiersPanel(data),
    renderEldranDetailsColumn(data, equipment, notes),
  );
  sheet.appendChild(body);
  sheetViewRoot.appendChild(sheet);
}

function renderEldranAttributesPanel(attributes) {
  const column = document.createElement("div");
  column.className = "dnd-sheet-column dnd-ability-column";
  for (const definition of ELDRAN_ATTRIBUTES) {
    const card = document.createElement("article");
    card.className = "dnd-ability-card";
    const title = document.createElement("span");
    title.textContent = definition.label.toUpperCase();
    const score = document.createElement("strong");
    score.textContent = text(attributes[definition.key]);
    const hint = document.createElement("small");
    hint.textContent = "Attribut";
    card.append(title, score, hint);
    if (window.EldranSheetRolls) {
      window.EldranSheetRolls.makeCheckRollable(card, {
        kind: "Attribut",
        name: definition.label,
        modifier: attributes[definition.key] || 0,
      });
    }
    column.appendChild(card);
  }
  return column;
}

function eldranAttributeSkillTable(rows) {
  const tableElement = document.createElement("table");
  tableElement.className = "dnd-simple-table";
  tableElement.innerHTML = "<thead><tr><th>Skill</th><th>Stufe</th><th>Bereich</th></tr></thead>";
  const tbody = document.createElement("tbody");
  for (const rowData of rows) {
    const row = document.createElement("tr");
    for (const value of [rowData.label, rowData.level, rowData.type]) {
      const cell = document.createElement("td");
      cell.textContent = text(value);
      row.appendChild(cell);
    }
    if (window.EldranSheetRolls) {
      window.EldranSheetRolls.makeCheckRollable(row, {
        kind: "Skill",
        name: rowData.label,
        modifier: rowData.level,
      });
    }
    tbody.appendChild(row);
  }
  tableElement.appendChild(tbody);
  return tableElement;
}

function renderEldranSkillTiersPanel(data) {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel eldran-skill-tier-panel";
  const title = document.createElement("h3");
  title.textContent = "SKILLS NACH ATTRIBUT";
  panel.appendChild(title);

  const combatDisciplines = data.combat_disciplines || {};
  const generalDisciplines = data.general_disciplines || {};
  const rows = ELDRAN_DISCIPLINES.map((definition) => {
    const source = definition.type === "Kampf" ? combatDisciplines : generalDisciplines;
    return { ...definition, level: Math.max(0, Number(source[definition.key] || 0)) };
  }).sort((left, right) => right.level - left.level || left.label.localeCompare(right.label, "de"));

  const grouped = new Map();
  for (const row of rows) {
    if (!grouped.has(row.attribute)) grouped.set(row.attribute, []);
    grouped.get(row.attribute).push(row);
  }

  for (const attribute of ELDRAN_ATTRIBUTES.map((item) => item.label)) {
    const groupRows = grouped.get(attribute) || [];
    if (!groupRows.length) continue;
    const group = document.createElement("section");
    group.className = "eldran-skill-tier";
    const heading = document.createElement("h4");
    heading.textContent = attribute;
    const tableElement = eldranAttributeSkillTable(groupRows);
    group.append(heading, tableElement);
    panel.appendChild(group);
  }
  return panel;
}

function renderEldranDetailsColumn(data, equipment, notes) {
  const column = document.createElement("div");
  column.className = "dnd-sheet-column";
  column.appendChild(panel("AUSRUESTUNG", table(["Feld", "Wert"], [
    ["Waffenart", equipment.weapon_type],
    ["Waffenname", equipment.weapon_name],
    ["Waffenbonus", equipment.weapon_bonus],
    ["Offhand", equipment.offhand_type],
    ["Fokus", equipment.focus_type],
    ["Ruestung", equipment.armor_name],
    ["Werkzeuge", equipment.tools],
  ])));
  column.appendChild(detailsPanel("HINTERGRUND", data.identity?.background));
  column.appendChild(detailsPanel("STATUS", data.combat?.status_notes));
  column.appendChild(detailsPanel("NOTIZEN", [notes.abilities, notes.connections, notes.freeform].filter(Boolean).join("\n\n")));
  return column;
}

function spellLevelRank(level) {
  const source = String(level || "Cantrip").toLowerCase();
  if (source.includes("cantrip") || source.includes("zaubertrick")) return 0;
  const numeric = source.match(/\d+/);
  return numeric ? Number(numeric[0]) : 99;
}

function spellLevelLabel(level) {
  const rank = spellLevelRank(level);
  if (rank === 0) return "Zaubertricks";
  return rank === 99 ? String(level || "Unbekannte Stufe") : `Stufe ${rank}`;
}

function normalizedActionName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function findMatchingAttack(spell, attacks = []) {
  const spellName = normalizedActionName(spell?.name);
  if (!spellName) return null;
  return (Array.isArray(attacks) ? attacks : []).find((attack) => {
    const attackName = normalizedActionName(attack?.name);
    return attackName && (attackName === spellName || attackName.includes(spellName) || spellName.includes(attackName));
  }) || null;
}

function renderSpellsByLevelPanel(spellcasting = {}, attacks = []) {
  const panel = document.createElement("section");
  panel.className = "dnd-spells-section sheet-view-spells";
  const header = document.createElement("div");
  header.className = "dnd-spells-header";
  const title = document.createElement("h3");
  title.textContent = "ZAUBER NACH STUFE";
  const summary = document.createElement("div");
  summary.className = "dnd-spell-summary";
  summary.append(
    box("KLASSE", spellcasting.class),
    box("ATTRIBUT", spellcasting.ability),
    box("RETTUNGS-SG", spellcasting.save_dc),
    box("ANGRIFFSBONUS", spellcasting.attack_bonus),
  );
  header.append(title, summary);
  panel.appendChild(header);

  const spells = Array.isArray(spellcasting.spells) ? spellcasting.spells : [];
  if (!spells.length) {
    const empty = document.createElement("p");
    empty.className = "dnd-empty-text";
    empty.textContent = "Keine Zauber erkannt.";
    panel.appendChild(empty);
    return panel;
  }

  const grouped = new Map();
  for (const spell of spells) {
    const level = String(spell.level || spell.spell_level || "Cantrip");
    if (!grouped.has(level)) grouped.set(level, []);
    grouped.get(level).push(spell);
  }

  const levels = [...grouped.keys()].sort((left, right) => spellLevelRank(left) - spellLevelRank(right) || left.localeCompare(right, "de"));
  for (const level of levels) {
    const group = document.createElement("section");
    group.className = "dnd-spell-level-group";
    const heading = document.createElement("h4");
    heading.textContent = spellLevelLabel(level);
    const list = document.createElement("div");
    list.className = "dnd-spell-list";
    for (const spell of grouped.get(level).sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), "de"))) {
      list.appendChild(renderSpellCard(spell, level, findMatchingAttack(spell, attacks)));
    }
    group.append(heading, list);
    panel.appendChild(group);
  }
  return panel;
}

function renderSpellCard(spell, spellLevel, matchingAttack = null) {
  const article = document.createElement("article");
  article.className = "dnd-spell-card";
  const title = document.createElement("h4");
  title.textContent = spell.name || "Unbenannter Zauber";
  const badges = document.createElement("div");
  badges.className = "dnd-spell-badges";
  for (const [active, label] of [
    [spell.prepared, "Prepared"],
    [/\[r\]|\britual\b/i.test(`${spell.name || ""} ${spell.notes || ""}`), "Ritual"],
    [/\bconcentration\b|\bconc\b/i.test(`${spell.duration || ""} ${spell.notes || ""}`), "Concentration"],
  ]) {
    if (!active) continue;
    const badge = document.createElement("span");
    badge.textContent = label;
    badges.appendChild(badge);
  }
  const meta = document.createElement("p");
  meta.textContent = [
    spellLevel,
    spell.slots,
    spell.source,
    spell.save_attack || spell.save_atk || spell.attack,
    spell.casting_time,
    spell.range,
    spell.components,
    spell.duration,
    spell.page,
  ].filter(Boolean).join(" | ");
  const notes = document.createElement("p");
  notes.textContent = spell.notes || "";
  article.append(title, badges, meta, notes);
  if (window.EldranSheetRolls) {
    const action = {
      name: spell.name || "Zauber",
      hit: spell.save_attack || spell.save_atk || spell.attack || matchingAttack?.hit || "",
      damage: spell.damage || matchingAttack?.damage || "",
      damage_notes: matchingAttack?.notes || spell.notes || "",
    };
    const commandFactory = () => ({
      type: "sheet-roll",
      mode: "action",
      label: action.name,
      action,
    });
    article.appendChild(window.EldranSheetRolls.quickbarButton(commandFactory));
    window.EldranSheetRolls.makeQuickbarDraggable(article, commandFactory);
    window.EldranSheetRolls.makeRollable(article, action);
  }
  return article;
}

function renderSheet(data) {
  if (isEldranSheet(data)) {
    renderEldranSheet(data);
    return;
  }

  const identity = data.identity || {};
  const combat = data.combat || {};
  const abilities = data.abilities || {};
  const skills = data.skills || {};
  const resources = data.resources || {};
  const features = data.features || {};
  const spellcasting = data.spellcasting || {};

  sheetViewRoot.innerHTML = "";
  const sheet = document.createElement("section");
  sheet.className = "dnd-sheet sheet-view-sheet";

  const header = document.createElement("div");
  header.className = "dnd-sheet-header";
  const nameBox = box("CHARAKTERNAME", identity.character_name);
  nameBox.classList.add("dnd-character-name-box");
  const headerGrid = document.createElement("div");
  headerGrid.className = "dnd-header-grid";
  headerGrid.append(
    box("KLASSE & STUFE", identity.class_level),
    box("HINTERGRUND", identity.background),
    box("SPIELERNAME", identity.player_name),
    box("SPEZIES", identity.species),
    box("GESINNUNG", identity.alignment),
    box("ERFAHRUNG", identity.experience_points),
  );
  header.append(nameBox, headerGrid);
  sheet.appendChild(header);

  const dashboard = document.createElement("div");
  dashboard.className = "dnd-dashboard";
  for (const [label, value] of [
    ["RUESTUNGSKLASSE", combat.armor_class],
    ["INITIATIVE", combat.initiative],
    ["BEWEGUNG", combat.speed],
    ["MAX TP", combat.hit_points_max],
    ["TREFFERWUERFEL", combat.hit_dice],
    ["UEBUNGSBONUS", combat.proficiency_bonus],
    ["ZAUBERRETTUNGS-SG", spellcasting.save_dc],
    ["ZAUBERANGRIFF", spellcasting.attack_bonus],
  ]) dashboard.appendChild(box(label, value));
  sheet.appendChild(dashboard);

  const body = document.createElement("div");
  body.className = "dnd-sheet-body";
  const abilityColumn = document.createElement("div");
  abilityColumn.className = "dnd-sheet-column dnd-ability-column dnd-ability-skill-column";
  const abilityCodes = {
    strength: "STR",
    dexterity: "DEX",
    constitution: "CON",
    intelligence: "INT",
    wisdom: "WIS",
    charisma: "CHA",
  };
  for (const [key, label] of Object.entries(ABILITY_LABELS)) {
    const value = abilities[key] || {};
    const card = document.createElement("article");
    card.className = "dnd-ability-card dnd-ability-skill-card";
    const title = document.createElement("span");
    title.textContent = label;
    const score = document.createElement("strong");
    score.textContent = text(value.score);
    const modifier = document.createElement("em");
    modifier.textContent = text(value.modifier);
    const save = document.createElement("small");
    save.textContent = `Rettung ${text(value.save)}`;
    const checks = document.createElement("div");
    checks.className = "dnd-ability-checks";
    checks.appendChild(renderDndCheckLine({
      label: "Rettungswurf",
      modifier: value.save || value.modifier || "0",
      proficient: Boolean(value.save_proficient),
      kind: "Attribut",
    }));
    for (const [skillKey, skillValue] of Object.entries(skills || {})) {
      if (dndSkillAbilityCode(skillKey, skillValue) !== abilityCodes[key]) continue;
      checks.appendChild(renderDndCheckLine({
        label: SKILL_LABELS[skillKey] || skillKey.replaceAll("_", " "),
        modifier: skillValue?.modifier || "0",
        proficient: dndIsSkillProficient(skillKey, skillValue, abilities, combat),
        kind: "Skill",
      }));
    }
    card.append(title, score, modifier, save, checks);
    if (window.EldranSheetRolls) {
      window.EldranSheetRolls.makeCheckRollable(card, {
        kind: "Attribut",
        name: label,
        modifier: value.modifier || value.save || "0",
      });
    }
    abilityColumn.appendChild(card);
  }

  const middle = document.createElement("div");
  middle.className = "dnd-sheet-column";
  middle.appendChild(renderDndHpPanel(combat));
  middle.appendChild(renderDndCoinsPanel(resources, {
    editableCoins: true,
    onCoinsChange: saveDndCoinResources,
  }));
  middle.appendChild(panel("ANGRIFFE", attackTable(data.attacks || [], {
    editableAttacks: true,
    onAttackToggle: saveDndAttackEquippedState,
  })));
  middle.appendChild(panel("KAMPF", table(["Wert", "Bonus"], [
    ["Ruestungsklasse", combat.armor_class],
    ["Initiative", combat.initiative],
    ["Bewegung", combat.speed],
  ])));

  const right = document.createElement("div");
  right.className = "dnd-sheet-column dnd-sheet-lower-info";
  right.appendChild(panel("PASSIVE WERTE", table(["Wert", "Bonus"], [
    ["Passive Wahrnehmung", combat.passive_perception],
    ["Passiver Motiv erkennen", combat.passive_insight],
    ["Passive Nachforschungen", combat.passive_investigation],
    ["Sinne", features.senses],
  ])));

  body.append(abilityColumn, middle);
  sheet.appendChild(body);
  sheet.appendChild(right);
  sheet.appendChild(renderDndUnderAttributesDetails(features));
  sheet.appendChild(renderSpellsByLevelPanel(spellcasting, data.attacks || []));
  sheetViewRoot.appendChild(sheet);
}

function renderDndUnderAttributesDetails(features = {}) {
  const section = document.createElement("section");
  section.className = "dnd-under-attributes-details";
  section.append(
    detailsPanel("AKTIONEN", features.actions),
    detailsPanel("MERKMALE & EIGENSCHAFTEN", features.features_and_traits || features.additional_features_and_traits),
    detailsPanel("UEBUNG & SPRACHEN", features.proficiencies_and_training),
  );
  return section;
}

async function saveDndCombatValues(values, statusText = "Gespeichert") {
  if (!currentSheetUserId) return;
  const nextData = {
    ...(currentSheetData || {}),
    combat: {
      ...((currentSheetData || {}).combat || {}),
      ...values,
    },
  };
  currentSheetData = nextData;
  renderSheet(currentSheetData);
  setNotesStatus("TP werden gespeichert ...");
  try {
    const payload = await fetchJson(`/api/character-sheets/${encodeURIComponent(currentSheetUserId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: currentSheetProjectId,
        data: nextData,
      }),
    });
    currentSheetData = payload.sheet?.data || nextData;
    renderSheet(currentSheetData);
    setNotesStatus(statusText);
  } catch (error) {
    setNotesStatus(error.message || "TP konnten nicht gespeichert werden");
  }
}

async function rollDndDeathSave(combat = {}) {
  const maxHp = parseDndSignedNumber(combat.hit_points_max, 9999);
  const currentCombat = currentSheetData?.combat || combat || {};
  if (clampDndHp(currentCombat.hit_points_current, maxHp) > 0) {
    setNotesStatus("Todesrettung ist nur bei 0 aktuellen TP moeglich");
    return;
  }
  const roll = window.EldranSheetRolls?.rollExpression?.("1d20");
  const total = Number(roll?.total || Math.floor(Math.random() * 20) + 1);
  const rollText = roll?.text || `1d20 = ${total} = ${total}`;
  let successes = parseDndDeathSaveCount(currentCombat.death_saves_successes);
  let failures = parseDndDeathSaveCount(currentCombat.death_saves_failures);
  const values = {};
  let resultText = "";
  if (total === 20) {
    successes = 0;
    failures = 0;
    values.hit_points_current = "1";
    resultText = "Nat 20: genesen, aktuelle TP auf 1 gesetzt.";
  } else if (total === 1) {
    failures = Math.min(3, failures + 2);
    resultText = `Nat 1: 2 Misserfolge (${failures}/3).`;
  } else if (total >= 10) {
    successes = Math.min(3, successes + 1);
    resultText = `Erfolg (${successes}/3).`;
  } else {
    failures = Math.min(3, failures + 1);
    resultText = `Misserfolg (${failures}/3).`;
  }
  if (successes >= 3) {
    successes = 0;
    failures = 0;
    values.hit_points_current = "1";
    resultText = "3 Erfolge: genesen, aktuelle TP auf 1 gesetzt.";
  }
  values.death_saves_successes = String(successes);
  values.death_saves_failures = String(failures);
  await saveDndCombatValues(values, "Todesrettung gespeichert");
  await window.EldranSheetRolls?.postCommand?.(`Spieler wuerfelt Todesrettung.\nTodesrettung: ${rollText}\n${resultText}`);
}

async function saveDndCoinResources(nextResources) {
  if (!currentSheetUserId) return;
  const nextData = {
    ...(currentSheetData || {}),
    resources: {
      ...((currentSheetData || {}).resources || {}),
      ...normalizeDndCoinResources(nextResources),
    },
  };
  currentSheetData = nextData;
  renderSheet(currentSheetData);
  setNotesStatus("Muenzen werden gespeichert ...");
  try {
    const payload = await fetchJson(`/api/character-sheets/${encodeURIComponent(currentSheetUserId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: currentSheetProjectId,
        data: nextData,
      }),
    });
    currentSheetData = payload.sheet?.data || nextData;
    renderSheet(currentSheetData);
    setNotesStatus("Muenzen gespeichert");
  } catch (error) {
    setNotesStatus(error.message || "Muenzen konnten nicht gespeichert werden");
  }
}

async function saveDndAttackEquippedState(attackIndex, equipped) {
  if (!currentSheetUserId) return;
  const attacks = Array.isArray(currentSheetData.attacks)
    ? currentSheetData.attacks.map((attack) => ({ ...attack }))
    : [];
  if (!attacks[attackIndex]) {
    return;
  }
  attacks[attackIndex].equipped = Boolean(equipped);
  const nextData = {
    ...(currentSheetData || {}),
    attacks,
  };
  currentSheetData = nextData;
  renderSheet(currentSheetData);
  setNotesStatus(equipped ? "Waffe wird ausgeruestet ..." : "Waffe wird abgeruestet ...");
  try {
    const payload = await fetchJson(`/api/character-sheets/${encodeURIComponent(currentSheetUserId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: currentSheetProjectId,
        data: nextData,
      }),
    });
    currentSheetData = payload.sheet?.data || nextData;
    renderSheet(currentSheetData);
    setNotesStatus(equipped ? "Waffe ausgeruestet" : "Waffe abgeruestet");
  } catch (error) {
    setNotesStatus(error.message || "Waffenstatus konnte nicht gespeichert werden");
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  if (response.status === 401) {
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    throw new Error("Nicht eingeloggt.");
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || "Anfrage fehlgeschlagen.");
  return payload;
}

async function initSheetView() {
  try {
    hydrateTokenFromHash();
    await fetchJson("/api/auth/me");
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id");
    const projectId = params.get("project_id") || "";
    if (!userId) throw new Error("Kein Spieler ausgewaehlt.");
    currentSheetUserId = userId;
    currentSheetProjectId = projectId;
    loadNotes(userId, projectId);
    const payload = await fetchJson(`/api/character-sheets/${encodeURIComponent(userId)}?project_id=${encodeURIComponent(projectId)}`);
    currentSheetData = payload.sheet?.data || {};
    renderSheet(currentSheetData);
    document.title = payload.sheet?.character_name || "Charaktersheet";
    sheetViewStatus.classList.add("hidden");
    sheetViewLayout.classList.remove("hidden");
  } catch (error) {
    sheetViewStatus.querySelector("h3").textContent = "Charaktersheet konnte nicht geladen werden";
    sheetViewStatus.querySelector("p").textContent = error.message || "Unbekannter Fehler.";
  }
}

bindNotesEditor();
void initSheetView();
