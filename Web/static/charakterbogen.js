const characterSheetForm = document.getElementById("characterSheetForm");
const sheetEmptyState = document.getElementById("sheetEmptyState");
const sheetProjectName = document.getElementById("sheetProjectName");
const sheetProjectMeta = document.getElementById("sheetProjectMeta");
const sheetProjectRefreshButton = document.getElementById("sheetProjectRefreshButton");
const sheetRosterList = document.getElementById("sheetRosterList");
const sheetRosterStatus = document.getElementById("sheetRosterStatus");
const sheetStorageStatus = document.getElementById("sheetStorageStatus");
const sheetRulesetKicker = document.getElementById("sheetRulesetKicker");
const sheetRulesetIntro = document.getElementById("sheetRulesetIntro");
const novaGaiaDataActions = document.getElementById("novaGaiaDataActions");
const dndPdfActions = document.getElementById("dndPdfActions");
const dndPdfInput = document.getElementById("dndPdfInput");
const dndPdfOpenLink = document.getElementById("dndPdfOpenLink");
const dndPdfDeleteButton = document.getElementById("dndPdfDeleteButton");
const dndPdfPanel = document.getElementById("dndPdfPanel");
const dndPdfInfoBlock = document.getElementById("dndPdfInfoBlock");
const dndPdfTitle = document.getElementById("dndPdfTitle");
const dndPdfSubtitle = document.getElementById("dndPdfSubtitle");
const dndPdfTags = document.getElementById("dndPdfTags");
const dndPdfEmptyState = document.getElementById("dndPdfEmptyState");
const dndParsedDataView = document.getElementById("dndParsedDataView");
const sheetExportButton = document.getElementById("sheetExportButton");
const sheetImportInput = document.getElementById("sheetImportInput");
const sheetResetButton = document.getElementById("sheetResetButton");
const sheetHeadline = document.getElementById("sheetHeadline");
const sheetHeroTitle = document.getElementById("sheetHeroTitle");
const sheetHeroSubtitle = document.getElementById("sheetHeroSubtitle");
const sheetHeroTags = document.getElementById("sheetHeroTags");
const sheetSaveBadge = document.getElementById("sheetSaveBadge");
const sheetPlayerName = document.getElementById("sheetPlayerName");
const characterSheetRightSidebar = document.getElementById("characterSheetRightSidebar");

const attributeGrid = document.getElementById("attributeGrid");
const combatDisciplineGrid = document.getElementById("combatDisciplineGrid");
const generalDisciplineGrid = document.getElementById("generalDisciplineGrid");
const complexityGrid = document.getElementById("complexityGrid");
const raceInfoGrid = document.getElementById("sheetRaceInfoGrid");
const attackReferenceGrid = document.getElementById("attackReferenceGrid");
const disciplineReferenceList = document.getElementById("disciplineReferenceList");
const sheetHpFormula = document.getElementById("sheetHpFormula");

const summaryProject = document.getElementById("summaryProject");
const summarySelectedPlayer = document.getElementById("summarySelectedPlayer");
const summaryVolk = document.getElementById("summaryVolk");
const summaryInitiative = document.getElementById("summaryInitiative");
const summaryDisciplines = document.getElementById("summaryDisciplines");
const validationStatus = document.getElementById("validationStatus");
const validationList = document.getElementById("validationList");

const volkSelect = document.getElementById("sheetVolkSelect");
const weaponTypeSelect = document.getElementById("sheetWeaponTypeSelect");
const offhandTypeSelect = document.getElementById("sheetOffhandTypeSelect");
const focusTypeSelect = document.getElementById("sheetFocusTypeSelect");

const ATTRIBUTE_DEFINITIONS = [
  { key: "koerper", label: "Koerper", hint: "Staerke, Belastbarkeit, Nahkampf" },
  { key: "geist", label: "Geist", hint: "Verstand, Analyse, mentale Kontrolle" },
  { key: "instinkt", label: "Instinkt", hint: "Wahrnehmung, Intuition, Reaktion" },
  { key: "praesenz", label: "Praesenz", hint: "Ausstrahlung, Fuehrung, Einfluss" },
  { key: "resonanz", label: "Resonanz", hint: "Aetherverbindung und Elementarkraefte" },
];

const COMBAT_DISCIPLINES = [
  { key: "physisch", label: "Physisch", attribute: "koerper", attributeLabel: "Koerper", note: "Nahkampf, Waffenfuehrung, Kraft" },
  { key: "mental", label: "Mental", attribute: "geist", attributeLabel: "Geist", note: "Mentale Angriffe und Kontrolle" },
  { key: "feuer", label: "Feuer", attribute: "resonanz", attributeLabel: "Resonanz", note: "Hitze, Flammen, Explosionen" },
  { key: "wasser", label: "Wasser", attribute: "resonanz", attributeLabel: "Resonanz", note: "Fluessigkeiten, Stroemung, Druck" },
  { key: "natur", label: "Natur", attribute: "resonanz", attributeLabel: "Resonanz", note: "Pflanzen, organische Kraefte, Gift" },
  { key: "frost", label: "Frost", attribute: "resonanz", attributeLabel: "Resonanz", note: "Kaelte, Eis, Verlangsamung" },
  { key: "erde", label: "Erde", attribute: "resonanz", attributeLabel: "Resonanz", note: "Stein, Boden, mineralische Kontrolle" },
  { key: "wind", label: "Wind", attribute: "resonanz", attributeLabel: "Resonanz", note: "Luft, Druck, Bewegung" },
];

const GENERAL_DISCIPLINES = [
  { key: "runenkunde", label: "Runenkunde", attribute: "geist", attributeLabel: "Geist", alternatives: ["Resonanz", "Instinkt"] },
  { key: "taktik", label: "Taktik", attribute: "geist", attributeLabel: "Geist", alternatives: ["Praesenz", "Instinkt"] },
  { key: "ueberleben", label: "Ueberleben", attribute: "instinkt", attributeLabel: "Instinkt", alternatives: ["Geist", "Koerper"] },
  { key: "navigation", label: "Navigation", attribute: "instinkt", attributeLabel: "Instinkt", alternatives: ["Geist", "Resonanz"] },
  { key: "heimlichkeit", label: "Heimlichkeit", attribute: "instinkt", attributeLabel: "Instinkt", alternatives: ["Koerper", "Praesenz"] },
  { key: "wahrnehmung", label: "Wahrnehmung", attribute: "instinkt", attributeLabel: "Instinkt", alternatives: ["Geist", "Resonanz"] },
  { key: "ueberzeugen", label: "Ueberzeugen", attribute: "praesenz", attributeLabel: "Praesenz", alternatives: ["Geist", "Instinkt"] },
  { key: "darstellen", label: "Darstellen", attribute: "praesenz", attributeLabel: "Praesenz", alternatives: ["Instinkt", "Geist"] },
  { key: "fuehrung", label: "Fuehrung", attribute: "praesenz", attributeLabel: "Praesenz", alternatives: ["Geist", "Koerper"] },
  { key: "menschenkenntnis", label: "Menschenkenntnis", attribute: "instinkt", attributeLabel: "Instinkt", alternatives: ["Geist", "Praesenz"] },
  { key: "gossenwissen", label: "Gossenwissen", attribute: "instinkt", attributeLabel: "Instinkt", alternatives: ["Praesenz", "Geist"] },
  { key: "handwerk", label: "Handwerk", attribute: "koerper", attributeLabel: "Koerper", alternatives: ["Geist", "Resonanz"] },
  { key: "medizin", label: "Medizin", attribute: "geist", attributeLabel: "Geist", alternatives: ["Instinkt", "Resonanz"] },
  { key: "naturkunde", label: "Naturkunde", attribute: "geist", attributeLabel: "Geist", alternatives: ["Instinkt"] },
  { key: "alchemie", label: "Alchemie", attribute: "geist", attributeLabel: "Geist", alternatives: ["Resonanz"] },
  { key: "technik", label: "Technik", attribute: "geist", attributeLabel: "Geist", alternatives: ["Koerper", "Resonanz"] },
  { key: "athletik", label: "Athletik", attribute: "koerper", attributeLabel: "Koerper", alternatives: ["Instinkt", "Resonanz"] },
  { key: "fortbewegung", label: "Fortbewegung", attribute: "koerper", attributeLabel: "Koerper", alternatives: ["Instinkt", "Praesenz"] },
  { key: "ressourcenabbau", label: "Ressourcenabbau", attribute: "koerper", attributeLabel: "Koerper", alternatives: ["Instinkt", "Geist"] },
  { key: "einschuechtern", label: "Einschuechtern", attribute: "praesenz", attributeLabel: "Praesenz", alternatives: ["Koerper", "Geist"] },
  { key: "handel", label: "Handel", attribute: "praesenz", attributeLabel: "Praesenz", alternatives: ["Geist", "Instinkt"] },
];

const ATTACK_TIERS = [
  { key: "schwach", label: "Schwacher Angriff", difficulty: 6, complexity: 1, damage: "1W6", examples: "Faustschlag, improvisierte Waffe, kleiner Impuls" },
  { key: "standard", label: "Standardangriff", difficulty: 10, complexity: 1, damage: "1W8", examples: "Schwertschlag, Elementarprojektil, mentaler Stoss" },
  { key: "stark", label: "Starker Angriff", difficulty: 12, complexity: 2, damage: "1W10", examples: "Schwere Waffenangriffe, groessere Effekte" },
  { key: "maechtig", label: "Maechtiger Angriff", difficulty: 14, complexity: 3, damage: "1W12", examples: "Grosse Flaechen, massive Kontrolle, intensive mentale Angriffe" },
];

const RACES = {
  "": { label: "Kein Volk gewaehlt", lifeBonus: 0, resistances: [], passives: [], note: "Volk waehlen, um Lebensbonus, Resistenzen und passive Faehigkeiten zu sehen." },
  bestarii: {
    label: "Bestarii",
    lifeBonus: 4,
    resistances: ["Physisch -3", "Natur -1", "Mental +2"],
    passives: ["Bestialische Staerke", "Tierbindung"],
    note: "Koerperbetonte Jaeger und Kaempfer mit hoher Widerstandskraft.",
  },
  aetheris: {
    label: "Aetheris",
    lifeBonus: 2,
    resistances: ["Wind -3", "Mental -1", "Erde +2"],
    passives: ["Windschritt", "Luftgleiten"],
    note: "Bewegliche Strategen mit starker Verbindung zu Luftstroemen.",
  },
  auralithen: {
    label: "Auralithen",
    lifeBonus: 4,
    resistances: ["Frost -3", "Wasser -1", "Feuer +2"],
    passives: ["Eisstruktur", "Kaelteresistenz"],
    note: "Kontrollierte Eisgeborene mit starkem Struktur- und Frostbezug.",
  },
  mareth: {
    label: "Mareth",
    lifeBonus: 3,
    resistances: ["Wasser -3", "Wind -1", "Frost +2"],
    passives: ["Wasseranpassung", "Stroemungsschlag"],
    note: "Anpassungsfaehige Wasserwanderer mit sicherer Bewegung in Stroemungen.",
  },
  novani: {
    label: "Novani",
    lifeBonus: 3,
    resistances: ["Feuer -3", "Natur -1", "Wasser +2"],
    passives: ["Flammenkern", "Hitzewelle"],
    note: "Ordnung und kontrollierte Macht mit starker Feuerpraegung.",
  },
  phythera: {
    label: "Phythera",
    lifeBonus: 2,
    resistances: ["Natur -3", "Wasser -1", "Feuer +2"],
    passives: ["Natuerliche Regeneration", "Rankenbindung"],
    note: "Organische Naturverbundene mit lebendiger Regeneration.",
  },
  psioniker: {
    label: "Psioniker",
    lifeBonus: 2,
    resistances: ["Mental -3", "Wind -1", "Physisch +2"],
    passives: ["Gedankenfokus", "Geistesdruck"],
    note: "Praezise Mentalisten mit Dominanz ueber Gedanken und Wahrnehmung.",
  },
  steinvolk: {
    label: "Steinvolk",
    lifeBonus: 4,
    resistances: ["Erde -3", "Physisch -1", "Wind +2"],
    passives: ["Steinhaut", "Unerschuetterlich"],
    note: "Massive Verteidiger mit starker Bindung an Stein und Standfestigkeit.",
  },
};

const WEAPON_TYPES = [
  { value: "", label: "Keine Angabe" },
  { value: "einhand", label: "Einhandwaffe" },
  { value: "zweihand", label: "Zweihandwaffe" },
  { value: "fernkampf", label: "Fernkampfwaffe" },
  { value: "sonstiges", label: "Sonstige / narrativ" },
];

const OFFHAND_TYPES = [
  { value: "", label: "Keine Offhand" },
  { value: "schild", label: "Schild" },
  { value: "fokus", label: "Fokus" },
];

const FOCUS_TYPES = [
  { value: "", label: "Kein Fokus" },
  { value: "praezisionsfokus", label: "Praezisionsfokus" },
  { value: "aetherkristall", label: "Aetherkristall" },
  { value: "speicherkristall", label: "Speicherkristall" },
  { value: "heilfokus", label: "Heilfokus" },
  { value: "stabilitaetsfokus", label: "Stabilitaetsfokus" },
  { value: "reichweitenfokus", label: "Reichweitenfokus" },
  { value: "effizienzfokus", label: "Effizienzfokus" },
  { value: "kontrollfokus", label: "Kontrollfokus" },
  { value: "resonanzfokus", label: "Resonanzfokus" },
];

const DEFAULT_SHEET_DATA = {
  identity: {
    character_name: "",
    volk: "",
    level: 1,
    concept: "",
    faction: "",
    origin: "",
    motivation: "",
    background: "",
  },
  attributes: {
    koerper: 0,
    geist: 0,
    instinkt: 0,
    praesenz: 0,
    resonanz: 0,
  },
  combat_disciplines: Object.fromEntries(COMBAT_DISCIPLINES.map((definition) => [definition.key, 0])),
  general_disciplines: Object.fromEntries(GENERAL_DISCIPLINES.map((definition) => [definition.key, 0])),
  complexities: Object.fromEntries(COMBAT_DISCIPLINES.map((definition) => [definition.key, 1])),
  combat: {
    hp_current: 0,
    hp_max: 0,
    armor_value: 0,
    initiative_bonus: 0,
    status_notes: "",
  },
  equipment: {
    weapon_type: "",
    weapon_name: "",
    weapon_bonus: 0,
    offhand_type: "",
    focus_type: "",
    armor_name: "",
    tools: "",
    travel_gear: "",
    notes: "",
  },
  notes: {
    abilities: "",
    connections: "",
    freeform: "",
  },
};

const FLAT_DEFAULT_PATHS = flattenLeafPaths(DEFAULT_SHEET_DATA);

let currentUser = null;
let rosterPayload = null;
let selectedUserId = "";
let selectedSheetMeta = null;
let currentSheetData = deepClone(DEFAULT_SHEET_DATA);
let isLoadingSheet = false;
let dirtySinceLastSave = false;
let autosaveTimerId = 0;
let currentDndPdfObjectUrl = "";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeWithDefaults(defaultValue, rawValue) {
  if (isPlainObject(defaultValue)) {
    const result = {};
    for (const [key, childDefault] of Object.entries(defaultValue)) {
      result[key] = mergeWithDefaults(childDefault, isPlainObject(rawValue) ? rawValue[key] : undefined);
    }
    return result;
  }
  if (typeof defaultValue === "number") {
    const numeric = Number(rawValue);
    return Number.isFinite(numeric) ? numeric : defaultValue;
  }
  if (typeof defaultValue === "string") {
    return rawValue === undefined || rawValue === null ? defaultValue : String(rawValue);
  }
  return rawValue === undefined ? defaultValue : rawValue;
}

function flattenLeafPaths(node, prefix = "") {
  if (!isPlainObject(node)) {
    return prefix ? [prefix] : [];
  }
  const result = [];
  for (const [key, value] of Object.entries(node)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    result.push(...flattenLeafPaths(value, nextPrefix));
  }
  return result;
}

function getDefaultValueByPath(path) {
  return getValueAtPath(DEFAULT_SHEET_DATA, path);
}

function getValueAtPath(target, path) {
  return path.split(".").reduce((value, key) => (value && value[key] !== undefined ? value[key] : undefined), target);
}

function setValueAtPath(target, path, value) {
  const keys = path.split(".");
  let cursor = target;
  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    if (!isPlainObject(cursor[key])) {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }
  cursor[keys[keys.length - 1]] = value;
}

function normalizeSheetData(rawData = {}) {
  return syncDerivedCombatValues(mergeWithDefaults(DEFAULT_SHEET_DATA, isPlainObject(rawData) ? rawData : {}));
}

function normalizeSelectValue(selectElement, value) {
  const stringValue = String(value ?? "");
  if (Array.from(selectElement.options).some((option) => option.value === stringValue)) {
    return stringValue;
  }
  return "";
}

function labelForSelectValue(options, value) {
  const match = options.find((option) => option.value === value);
  return match ? match.label : "Keine Angabe";
}

function raceDefinition(volkKey) {
  return RACES[volkKey] || RACES[""];
}

function formatTimestamp(value) {
  if (!value) {
    return "Noch nicht gespeichert";
  }
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return "Noch nicht gespeichert";
  }
  return timestamp.toLocaleString("de-DE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function formatRuleValue(value) {
  if (!value) {
    return "-";
  }
  return String(value);
}

function getNumericValue(path, fallback = 0) {
  const value = Number(getValueAtPath(currentSheetData, path));
  return Number.isFinite(value) ? value : fallback;
}

function selectedRosterEntry() {
  return rosterPayload?.sheets?.find((entry) => entry.user_id === selectedUserId) || null;
}

function canEditSelectedSheet() {
  if (!currentUser || !selectedUserId) {
    return false;
  }
  if (currentUser.role === "admin" || currentUser.role === "spielleiter") {
    return true;
  }
  return currentUser.id === selectedUserId;
}

function currentProjectRuleset() {
  return String(rosterPayload?.project?.ruleset || "nova_gaia").trim().toLowerCase();
}

function isDndProject() {
  return currentProjectRuleset() === "dnd";
}

function viewerIsPlayer() {
  return String(currentUser?.role || "").trim().toLowerCase() === "spieler";
}

function setStorageStatus(text, tone = "normal") {
  sheetStorageStatus.textContent = text;
  sheetStorageStatus.classList.toggle("character-status-error", tone === "error");
}

function setRosterStatus(text, tone = "normal") {
  sheetRosterStatus.textContent = text;
  sheetRosterStatus.classList.toggle("character-status-error", tone === "error");
}

function setEditingEnabled(enabled) {
  characterSheetForm.querySelectorAll("input, textarea, select, button").forEach((element) => {
    element.disabled = !enabled;
  });
  sheetExportButton.disabled = !enabled || isDndProject();
  sheetResetButton.disabled = !enabled || isDndProject();
  sheetImportInput.disabled = !enabled || isDndProject();
  if (dndPdfInput) {
    dndPdfInput.disabled = !canEditSelectedSheet() || !isDndProject();
  }
  if (dndPdfDeleteButton) {
    dndPdfDeleteButton.disabled = !canEditSelectedSheet() || !isDndProject();
  }
}

function renderSelectOptions(selectElement, options) {
  selectElement.innerHTML = "";
  for (const optionDefinition of options) {
    const optionElement = document.createElement("option");
    optionElement.value = optionDefinition.value;
    optionElement.textContent = optionDefinition.label;
    selectElement.appendChild(optionElement);
  }
}

function renderAttributeGrid() {
  attributeGrid.innerHTML = "";
  for (const definition of ATTRIBUTE_DEFINITIONS) {
    const label = document.createElement("label");
    label.className = "character-score-card";

    const title = document.createElement("span");
    title.className = "file-meta";
    title.textContent = definition.label;

    const input = document.createElement("input");
    input.className = "character-score-input";
    input.type = "number";
    input.min = "0";
    input.max = "5";
    input.step = "1";
    input.dataset.path = `attributes.${definition.key}`;

    const hint = document.createElement("span");
    hint.className = "character-score-hint";
    hint.textContent = definition.hint;

    label.append(title, input, hint);
    attributeGrid.appendChild(label);
  }
}

function createDisciplineCard(definition, prefix) {
  const label = document.createElement("label");
  label.className = "character-discipline-card";

  const header = document.createElement("div");
  header.className = "character-discipline-header";

  const title = document.createElement("span");
  title.className = "character-discipline-title";
  title.textContent = definition.label;

  const meta = document.createElement("span");
  meta.className = "character-discipline-meta";
  meta.textContent = `Typisch: ${definition.attributeLabel}`;

  header.append(title, meta);

  const input = document.createElement("input");
  input.className = "sidebar-input character-number";
  input.type = "number";
  input.min = "0";
  input.max = "5";
  input.step = "1";
  input.dataset.path = `${prefix}.${definition.key}`;

  const hint = document.createElement("p");
  hint.className = "character-discipline-hint";
  hint.textContent = definition.note || `Alternativen: ${definition.alternatives.join(", ")}`;

  label.append(header, input, hint);
  return label;
}

function renderDisciplineGrids() {
  combatDisciplineGrid.innerHTML = "";
  for (const definition of COMBAT_DISCIPLINES) {
    combatDisciplineGrid.appendChild(createDisciplineCard(definition, "combat_disciplines"));
  }

  generalDisciplineGrid.innerHTML = "";
  for (const definition of GENERAL_DISCIPLINES) {
    generalDisciplineGrid.appendChild(createDisciplineCard(definition, "general_disciplines"));
  }
}

function renderComplexityGrid() {
  complexityGrid.innerHTML = "";
  for (const definition of COMBAT_DISCIPLINES) {
    const label = document.createElement("label");
    label.className = "character-complexity-card";

    const title = document.createElement("span");
    title.className = "character-discipline-title";
    title.textContent = definition.label;

    const input = document.createElement("input");
    input.className = "sidebar-input character-number";
    input.type = "number";
    input.min = "1";
    input.max = "3";
    input.step = "1";
    input.dataset.path = `complexities.${definition.key}`;

    const hint = document.createElement("span");
    hint.className = "character-discipline-meta";
    hint.textContent = "Start: 1";

    label.append(title, input, hint);
    complexityGrid.appendChild(label);
  }
}

function renderAttackReference() {
  attackReferenceGrid.innerHTML = "";
  for (const attackTier of ATTACK_TIERS) {
    const article = document.createElement("article");
    article.className = "character-attack-card";

    const title = document.createElement("strong");
    title.textContent = attackTier.label;

    const values = document.createElement("p");
    values.textContent = `SG ${attackTier.difficulty} | Komplexitaet ${attackTier.complexity} | Schaden ${attackTier.damage}`;

    const examples = document.createElement("p");
    examples.className = "character-attack-note";
    examples.textContent = attackTier.examples;

    article.append(title, values, examples);
    attackReferenceGrid.appendChild(article);
  }
}

function renderDisciplineReference() {
  const hints = [
    "Allgemeine Disziplinen haben in der Charaktererschaffung ein typisches Attribut. Im Spiel kann der Spielleiter alternative Kombinationen zulassen.",
    "Physisch ist an Koerper gebunden, Mental an Geist, alle Elementardisziplinen an Resonanz.",
    "Initiative ist immer eine Probe aus Instinkt und Wahrnehmung.",
    "Komplexitaet begrenzt, welche Effekte ueberhaupt moeglich sind, auch bei sehr guten Wuerfen.",
  ];
  disciplineReferenceList.innerHTML = "";
  for (const hintText of hints) {
    const paragraph = document.createElement("p");
    paragraph.textContent = hintText;
    disciplineReferenceList.appendChild(paragraph);
  }
}

function renderStaticUi() {
  renderSelectOptions(volkSelect, [
    { value: "", label: "Volk waehlen" },
    ...Object.entries(RACES)
      .filter(([key]) => key)
      .map(([key, value]) => ({ value: key, label: value.label })),
  ]);
  renderSelectOptions(weaponTypeSelect, WEAPON_TYPES);
  renderSelectOptions(offhandTypeSelect, OFFHAND_TYPES);
  renderSelectOptions(focusTypeSelect, FOCUS_TYPES);
  renderAttributeGrid();
  renderDisciplineGrids();
  renderComplexityGrid();
  renderAttackReference();
  renderDisciplineReference();
}

function applyRulesetMode() {
  const dndMode = isDndProject();
  sheetRulesetKicker.textContent = dndMode ? "DnD" : "Nova Gaia";
  sheetRulesetIntro.textContent = dndMode
    ? "Projektgebundene DnD-Charaktersheets als PDF: Spieler sehen ihr eigenes Sheet, Spielleiter alle Sheets im Projekt."
    : "Ein projektgebundener Bogen nach dem Regelwerk: genau ein Charakter pro Spieler und Projekt.";
  novaGaiaDataActions.classList.toggle("hidden", dndMode);
  dndPdfActions.classList.toggle("hidden", !dndMode);
  characterSheetForm.classList.toggle("hidden", dndMode);
  dndPdfPanel.classList.toggle("hidden", !dndMode);
  characterSheetRightSidebar.classList.toggle("hidden", dndMode);
  document.querySelector(".app-shell")?.classList.toggle("character-dnd-mode", dndMode);
}

function allFormFields() {
  return Array.from(characterSheetForm.querySelectorAll("[data-path]"));
}

function fillForm(data) {
  const normalized = normalizeSheetData(data);
  for (const field of allFormFields()) {
    const path = field.dataset.path;
    const value = getValueAtPath(normalized, path);
    if (field.tagName === "SELECT") {
      field.value = normalizeSelectValue(field, value);
      continue;
    }
    if (field.type === "number") {
      field.value = Number.isFinite(Number(value)) ? String(Number(value)) : "0";
      continue;
    }
    field.value = value === undefined || value === null ? "" : String(value);
  }
}

function collectFormData() {
  const data = deepClone(DEFAULT_SHEET_DATA);
  for (const field of allFormFields()) {
    const path = field.dataset.path;
    const defaultValue = getDefaultValueByPath(path);
    let value;
    if (field.tagName === "SELECT") {
      value = String(field.value || "");
    } else if (field.type === "number") {
      const numeric = Number(field.value);
      value = Number.isFinite(numeric) ? numeric : defaultValue;
    } else {
      value = String(field.value || "");
    }
    setValueAtPath(data, path, value);
  }
  return normalizeSheetData(data);
}

function completionPercentage(data) {
  const changedFields = FLAT_DEFAULT_PATHS.filter((path) => {
    const currentValue = getValueAtPath(data, path);
    const defaultValue = getDefaultValueByPath(path);
    return JSON.stringify(currentValue) !== JSON.stringify(defaultValue);
  }).length;
  return Math.round((changedFields / FLAT_DEFAULT_PATHS.length) * 100);
}

function strongestAttributeTag(data) {
  let best = null;
  for (const definition of ATTRIBUTE_DEFINITIONS) {
    const value = Number(getValueAtPath(data, `attributes.${definition.key}`) || 0);
    if (!best || value > best.value) {
      best = { label: definition.label, value };
    }
  }
  return best && best.value > 0 ? `${best.label} ${best.value}` : "Attribute offen";
}

function strongestDisciplineTag(data) {
  const allDisciplines = [
    ...COMBAT_DISCIPLINES.map((definition) => ({ ...definition, path: `combat_disciplines.${definition.key}` })),
    ...GENERAL_DISCIPLINES.map((definition) => ({ ...definition, path: `general_disciplines.${definition.key}` })),
  ];
  let best = null;
  for (const definition of allDisciplines) {
    const value = Number(getValueAtPath(data, definition.path) || 0);
    if (!best || value > best.value) {
      best = { label: definition.label, value };
    }
  }
  return best && best.value > 0 ? `${best.label} ${best.value}` : "Disziplinen offen";
}

function renderHeroTags(data) {
  const race = RACES[data.identity.volk] || RACES[""];
  const tags = [
    race.label,
    data.identity.concept || "Konzept offen",
    strongestAttributeTag(data),
    strongestDisciplineTag(data),
  ];
  const focusLabel = labelForSelectValue(FOCUS_TYPES, data.equipment.focus_type);
  if (data.equipment.offhand_type === "fokus" && data.equipment.focus_type) {
    tags.push(focusLabel);
  }
  sheetHeroTags.innerHTML = "";
  for (const tagText of tags) {
    const pill = document.createElement("span");
    pill.className = "character-pill";
    pill.textContent = tagText;
    sheetHeroTags.appendChild(pill);
  }
}

function renderRaceInfo(volkKey) {
  const race = RACES[volkKey] || RACES[""];
  raceInfoGrid.innerHTML = "";

  const cards = [
    {
      title: "Lebensbonus",
      body: race.lifeBonus ? `+${race.lifeBonus}` : "0",
    },
    {
      title: "Resistenzen / Schwaechen",
      body: race.resistances.length ? race.resistances.join(" | ") : "Noch kein Volk gewaehlt",
    },
    {
      title: "Passive Faehigkeiten",
      body: race.passives.length ? race.passives.join(" | ") : "Noch keine passiven Faehigkeiten",
    },
    {
      title: "Hinweis",
      body: race.note,
    },
  ];

  for (const card of cards) {
    const article = document.createElement("article");
    article.className = "character-race-card";

    const title = document.createElement("span");
    title.className = "file-meta";
    title.textContent = card.title;

    const body = document.createElement("strong");
    body.textContent = card.body;

    article.append(title, body);
    raceInfoGrid.appendChild(article);
  }
}

function summarizeSheetName(data) {
  const characterName = String(data.identity.character_name || "").trim();
  return characterName || "Unbenannter Charakter";
}

function renderSummary(data) {
  const entry = selectedRosterEntry();
  const race = RACES[data.identity.volk] || RACES[""];
  const displayName = summarizeSheetName(data);
  const subtitleParts = [
    race.label,
    data.identity.faction || "Fraktion offen",
    data.identity.origin || "Herkunft offen",
  ];

  sheetHeadline.textContent = displayName;
  sheetHeroTitle.textContent = displayName;
  sheetHeroSubtitle.textContent = subtitleParts.join(" | ");
  sheetSaveBadge.textContent = `${completionPercentage(data)} % ausgefuellt`;

  summaryProject.textContent = rosterPayload?.project?.name || "-";
  summarySelectedPlayer.textContent = entry?.username || "-";
  summaryVolk.textContent = race.label;
  summaryDisciplines.textContent = String(totalDisciplinePoints(data));
  summaryInitiative.textContent = buildInitiativeSummary(data);
  sheetPlayerName.value = entry?.username || "";

  renderRaceInfo(data.identity.volk);
  renderHeroTags(data);
}

function totalDisciplinePoints(data) {
  return [
    ...Object.values(data.combat_disciplines || {}),
    ...Object.values(data.general_disciplines || {}),
  ].reduce((sum, value) => sum + (Number.isFinite(Number(value)) ? Number(value) : 0), 0);
}

function raceLifeBonus(data) {
  return Math.max(0, Number(raceDefinition(data.identity.volk).lifeBonus || 0));
}

function calculateMaxHp(data) {
  const koerper = Math.max(0, Number(data.attributes.koerper || 0));
  return koerper + raceLifeBonus(data);
}

function maxHpFormulaDetails(data) {
  const koerper = Math.max(0, Number(data.attributes.koerper || 0));
  const lifeBonus = raceLifeBonus(data);
  const hpMax = calculateMaxHp(data);
  return `Koerper ${koerper} + Lebensbonus ${lifeBonus} = ${hpMax}`;
}

function syncDerivedCombatValues(data) {
  const hpMax = calculateMaxHp(data);
  const hpCurrent = Number(data.combat.hp_current || 0);
  data.combat.hp_max = hpMax;
  data.combat.hp_current = Number.isFinite(hpCurrent)
    ? Math.max(0, Math.min(hpCurrent, hpMax))
    : 0;
  return data;
}

function buildInitiativeSummary(data) {
  const instinkt = Number(data.attributes.instinkt || 0);
  const wahrnehmung = Number(data.general_disciplines.wahrnehmung || 0);
  const bonus = Number(data.combat.initiative_bonus || 0);
  const bonusText = bonus ? ` (+${bonus})` : "";
  return `Instinkt ${instinkt} + Wahrnehmung ${wahrnehmung}${bonusText}`;
}

function buildValidationItems(data) {
  const items = [];
  const level = Math.max(1, Number(data.identity.level || 1));
  const attributeValues = ATTRIBUTE_DEFINITIONS.map((definition) => Number(data.attributes[definition.key] || 0));
  const sortedAttributes = [...attributeValues].sort((left, right) => right - left);
  const disciplinePoints = totalDisciplinePoints(data);
  const complexityValues = COMBAT_DISCIPLINES.map((definition) => Number(data.complexities[definition.key] || 1));

  if (level === 1) {
    const creationPattern = JSON.stringify(sortedAttributes) === JSON.stringify([3, 2, 2, 1, 1]);
    items.push({
      tone: creationPattern ? "ok" : "warn",
      text: creationPattern
        ? "Attributverteilung entspricht der Startregel 3 / 2 / 2 / 1 / 1."
        : `Startattribute weichen von 3 / 2 / 2 / 1 / 1 ab: aktuell ${sortedAttributes.join(" / ")}.`,
    });

    items.push({
      tone: disciplinePoints === 10 ? "ok" : disciplinePoints > 10 ? "error" : "warn",
      text: disciplinePoints === 10
        ? "Disziplinpunkte entsprechen der Startregel von 10 Punkten."
        : `Disziplinpunkte bei Stufe 1: aktuell ${disciplinePoints}, vorgesehen sind 10.`,
    });

    const allComplexitiesOne = complexityValues.every((value) => value === 1);
    items.push({
      tone: allComplexitiesOne ? "ok" : "warn",
      text: allComplexitiesOne
        ? "Komplexitaeten stehen auf Startwert 1."
        : `Komplexitaeten weichen vom Startwert 1 ab: ${complexityValues.join(", ")}.`,
    });
  } else {
    items.push({
      tone: "info",
      text: `Stufe ${level}: Die Startregeln fuer Attribute, 10 Disziplinpunkte und Komplexitaet 1 gelten nur fuer die Erschaffung auf Level 1.`,
    });
  }

  const violations = [];
  for (const definition of COMBAT_DISCIPLINES) {
    const value = Number(data.combat_disciplines[definition.key] || 0);
    const limit = Number(data.attributes[definition.attribute] || 0);
    if (value > limit) {
      violations.push(`${definition.label} ${value} > ${definition.attributeLabel} ${limit}`);
    }
  }
  for (const definition of GENERAL_DISCIPLINES) {
    const value = Number(data.general_disciplines[definition.key] || 0);
    const limit = Number(data.attributes[definition.attribute] || 0);
    if (value > limit) {
      violations.push(`${definition.label} ${value} > ${definition.attributeLabel} ${limit}`);
    }
  }
  items.push({
    tone: violations.length ? "error" : "ok",
    text: violations.length
      ? `Disziplinen ueber zugehoerigem Attribut: ${violations.join(" | ")}`
      : "Alle Disziplinen liegen innerhalb ihres typischen Attributs.",
  });

  const race = RACES[data.identity.volk] || RACES[""];
  items.push({
    tone: data.identity.volk ? "ok" : "warn",
    text: data.identity.volk
      ? `Volkswerte aktiv: Lebensbonus +${race.lifeBonus}, ${race.resistances.join(" | ")}`
      : "Volk fehlt noch. Lebensbonus, Resistenzen und Passive sind daher offen.",
  });

  items.push({
    tone: calculateMaxHp(data) > 0 ? "ok" : "warn",
    text: calculateMaxHp(data) > 0
      ? `Max-Lebenspunkte werden automatisch berechnet: ${maxHpFormulaDetails(data)}.`
      : "Max-Lebenspunkte ergeben sich aus Koerper und Lebensbonus, aktuell noch 0.",
  });

  return items;
}

function renderDerivedCombatValues(data) {
  const hpMaxField = characterSheetForm.querySelector('[data-path="combat.hp_max"]');
  const hpCurrentField = characterSheetForm.querySelector('[data-path="combat.hp_current"]');
  const normalizedCurrentHp = Number(data.combat.hp_current || 0);
  if (hpMaxField) {
    hpMaxField.value = String(calculateMaxHp(data));
  }
  if (hpCurrentField) {
    const numericFieldValue = Number(hpCurrentField.value);
    if (hpCurrentField.value === "" || !Number.isFinite(numericFieldValue) || numericFieldValue !== normalizedCurrentHp) {
      hpCurrentField.value = String(normalizedCurrentHp);
    }
  }
  if (sheetHpFormula) {
    sheetHpFormula.textContent = `Automatisch: ${maxHpFormulaDetails(data)}`;
  }
}

function renderValidation(data) {
  const items = buildValidationItems(data);
  validationList.innerHTML = "";

  let overallTone = "ok";
  if (items.some((item) => item.tone === "error")) {
    overallTone = "error";
  } else if (items.some((item) => item.tone === "warn")) {
    overallTone = "warn";
  } else if (items.some((item) => item.tone === "info")) {
    overallTone = "info";
  }

  validationStatus.textContent = overallTone === "error"
    ? "Regelkonflikt"
    : overallTone === "warn"
      ? "Unvollstaendig"
      : overallTone === "info"
        ? "Hinweise aktiv"
        : "Regelkonform";

  for (const item of items) {
    const paragraph = document.createElement("p");
    paragraph.className = `character-validation-item character-validation-${item.tone}`;
    paragraph.textContent = item.text;
    validationList.appendChild(paragraph);
  }
}

function renderCurrentSheetUi() {
  renderDerivedCombatValues(currentSheetData);
  renderSummary(currentSheetData);
  renderValidation(currentSheetData);
}

function clearDndPdfObjectUrl() {
  if (currentDndPdfObjectUrl) {
    window.URL.revokeObjectURL(currentDndPdfObjectUrl);
    currentDndPdfObjectUrl = "";
  }
}

function appendDndDataCard(title, value) {
  const article = document.createElement("article");
  article.className = "dnd-data-card";
  const label = document.createElement("span");
  label.className = "file-meta";
  label.textContent = title;
  const body = document.createElement("strong");
  body.textContent = value || "-";
  article.append(label, body);
  dndParsedDataView.appendChild(article);
}

function renderDndParsedData(data = {}) {
  const normalized = normalizeDndDisplayData(data);
  dndParsedDataView.innerHTML = "";
  const identity = normalized.identity;
  const combat = normalized.combat;
  const sheet = document.createElement("section");
  sheet.className = "dnd-sheet";
  sheet.appendChild(renderDndSheetHeader(identity));
  sheet.appendChild(renderDndDashboard(normalized));
  const body = document.createElement("div");
  body.className = "dnd-sheet-body";
  body.appendChild(renderDndAbilitiesColumn(normalized.abilities));
  body.appendChild(renderDndMiddleColumn(normalized.abilities, normalized.skills, combat, normalized.attacks));
  body.appendChild(renderDndRightColumn(normalized));
  sheet.appendChild(body);
  sheet.appendChild(renderDndSpellsPanel(normalized.spellcasting));
  sheet.appendChild(renderDndPdfTextSection(normalized.pages, normalized.source));
  dndParsedDataView.appendChild(sheet);
}

function normalizeDndDisplayData(data = {}) {
  const fields = data.pdf_fields && typeof data.pdf_fields === "object" ? data.pdf_fields : {};
  const normalizedFields = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key.toLowerCase().replace(/[^a-z0-9]/g, ""), String(value || "").trim()]));
  const field = (...names) => {
    for (const name of names) {
      const value = normalizedFields[String(name).toLowerCase().replace(/[^a-z0-9]/g, "")];
      if (value) return value;
    }
    return "";
  };
  const identity = data.identity || {};
  const combat = data.combat || {};
  const spellcasting = data.spellcasting || {};
  const abilities = normalizeDndAbilities(data.abilities || {}, field);
  const skills = normalizeDndSkills(data.skills || {}, field);
  const attacks = normalizeDndAttacks(data.attacks, field);
  const resources = normalizeDndResources(data.resources || {}, field);
  const spells = normalizeDndSpells(spellcasting.spells, field, normalizedFields);
  return {
    source: data.source || {},
    pages: Array.isArray(data.pages) ? data.pages : [],
    identity: {
      character_name: identity.character_name || field("CharacterName", "Character Name") || selectedRosterEntry()?.character_name || "",
      player_name: identity.player_name || field("PlayerName", "Player Name") || selectedRosterEntry()?.username || "",
      class_level: identity.class_level || field("ClassLevel", "Class & Level"),
      species: identity.species || field("Species", "Race") || selectedRosterEntry()?.volk || "",
      background: identity.background || field("Background"),
      alignment: identity.alignment || field("Alignment"),
      experience_points: identity.experience_points || field("ExperiencePoints", "Experience Points", "XP"),
      size: identity.size || field("Size"),
    },
    abilities,
    skills,
    combat: {
      ...combat,
      armor_class: combat.armor_class || field("ArmorClass", "Armor Class", "AC"),
      initiative: combat.initiative || field("Initiative"),
      speed: combat.speed || field("Speed"),
      hit_points_max: combat.hit_points_max || field("MaxHP", "Max HP"),
      hit_points_current: combat.hit_points_current || field("CurrentHP", "Current HP"),
      hit_points_temp: combat.hit_points_temp || field("TempHP", "Temp HP"),
      hit_dice: combat.hit_dice || field("HitDice", "Hit Dice"),
      proficiency_bonus: combat.proficiency_bonus || field("ProficiencyBonus", "Proficiency Bonus"),
      passive_perception: combat.passive_perception || field("PassivePerception", "Passive Perception"),
      passive_insight: combat.passive_insight || field("PassiveInsight", "Passive Insight"),
      passive_investigation: combat.passive_investigation || field("PassiveInvestigation", "Passive Investigation"),
    },
    attacks,
    resources,
    features: data.features || {},
    personality: data.personality || {},
    spellcasting: {
      ...spellcasting,
      class: spellcasting.class || field("SpellcastingClass", "Spellcasting Class"),
      ability: spellcasting.ability || field("SpellcastingAbility", "Spellcasting Ability", "spellAbility"),
      save_dc: spellcasting.save_dc || field("SpellSaveDC", "Spell Save DC", "spellSaveDC0"),
      attack_bonus: spellcasting.attack_bonus || field("SpellAttackBonus", "Spell Attack Bonus", "spellAtkBonus0"),
      spells,
    },
  };
}

function normalizeDndAbilities(source, field) {
  const aliases = {
    strength: ["Strength", "STR"],
    dexterity: ["Dexterity", "DEX"],
    constitution: ["Constitution", "CON"],
    intelligence: ["Intelligence", "INT"],
    wisdom: ["Wisdom", "WIS"],
    charisma: ["Charisma", "CHA"],
  };
  return Object.fromEntries(Object.entries(aliases).map(([key, names]) => {
    const existing = source[key] || {};
    return [key, {
      score: existing.score || field(...names.map((name) => `${name}Score`), ...names),
      modifier: existing.modifier || field(...names.map((name) => `${name}Mod`), ...names.map((name) => `${name} Modifier`)),
      save: existing.save || field(...names.map((name) => `${name}Save`), ...names.map((name) => `${name} Saving Throw`)),
      save_proficient: Boolean(existing.save_proficient),
    }];
  }));
}

function normalizeDndSkills(source, field) {
  const skills = {
    acrobatics: ["Acrobatics", "acrobatics"],
    animal_handling: ["Animal Handling", "AnimalHandling", "animal handling"],
    arcana: ["Arcana", "arcana"],
    athletics: ["Athletics", "athletics"],
    deception: ["Deception", "deception"],
    history: ["History", "history"],
    insight: ["Insight", "insight"],
    intimidation: ["Intimidation", "intimidation"],
    investigation: ["Investigation", "investigation"],
    medicine: ["Medicine", "medicine"],
    nature: ["Nature", "nature"],
    perception: ["Perception", "perception"],
    performance: ["Performance", "performance"],
    persuasion: ["Persuasion", "persuasion"],
    religion: ["Religion", "religion"],
    sleight_of_hand: ["Sleight of Hand", "SleightOfHand", "sleight of hand"],
    stealth: ["Stealth", "stealth"],
    survival: ["Survival", "survival"],
  };
  return Object.fromEntries(Object.entries(skills).map(([key, aliases]) => {
    const existing = source[key] || {};
    return [key, {
      modifier: existing.modifier || field(...aliases, ...aliases.map((alias) => `${alias}Mod`)),
      ability: existing.ability || "",
      proficient: Boolean(existing.proficient),
      expertise: Boolean(existing.expertise),
    }];
  }));
}

function normalizeDndAttacks(source, field) {
  if (Array.isArray(source) && source.some((attack) => hasDndValue(attack))) {
    return source;
  }
  const attacks = [];
  for (let index = 0; index < 12; index += 1) {
    const attack = {
      name: field(`AttackName${index}`, `WeaponName${index}`, `atkName${index}`),
      hit: field(`AttackBonus${index}`, `AttackHit${index}`, `WeaponHit${index}`, `atkBonus${index}`),
      damage: field(`AttackDamage${index}`, `DamageType${index}`, `WeaponDamage${index}`, `atkDamage${index}`),
      notes: field(`AttackNotes${index}`, `WeaponNotes${index}`, `atkNotes${index}`),
    };
    if (hasDndValue(attack)) {
      attacks.push(attack);
    }
  }
  return attacks;
}

function normalizeDndResources(resources, field) {
  const normalized = { ...resources };
  for (const coin of ["cp", "sp", "ep", "gp", "pp"]) {
    normalized[coin] = resources[coin] || field(coin.toUpperCase(), coin);
  }
  const equipment = Array.isArray(resources.equipment) ? resources.equipment : [];
  for (let index = 0; index < 120; index += 1) {
    const item = {
      name: field(`Eq Name${index}`, `EqName${index}`, `EquipmentName${index}`),
      quantity: field(`Eq Qty${index}`, `EqQty${index}`, `EquipmentQty${index}`),
      weight: field(`Eq Weight${index}`, `EqWeight${index}`, `EquipmentWeight${index}`),
    };
    if (hasDndValue(item)) {
      equipment.push(item);
    }
  }
  normalized.equipment = equipment.length ? equipment : (resources.equipment || field("Equipment", "EquipmentList"));
  normalized.weight_carried = resources.weight_carried || field("WeightCarried", "Weight Carried");
  normalized.encumbered = resources.encumbered || field("Encumbered");
  normalized.push_drag_lift = resources.push_drag_lift || field("PushDragLift", "Push Drag Lift");
  return normalized;
}

function normalizeDndSpells(source, field, normalizedFields) {
  const spells = Array.isArray(source) ? [...source] : [];
  const indexes = new Set();
  for (const key of Object.keys(normalizedFields)) {
    const match = key.match(/^spellname(\d+)$/);
    if (match) {
      indexes.add(Number(match[1]));
    }
  }
  for (const index of [...indexes].sort((a, b) => a - b)) {
    const spell = {
      name: field(`spellName${index}`),
      level: field(`spellLevel${index}`, `spellLevelSchool${index}`),
      prepared: /^yes|true|prepared|1|x$/i.test(field(`spellPrepared${index}`, `spellPrep${index}`)),
      source: field(`spellSource${index}`),
      save_attack: field(`spellSaveHit${index}`, `spellSaveAtk${index}`, `spellAttack${index}`),
      casting_time: field(`spellCastingTime${index}`, `spellCastTime${index}`),
      range: field(`spellRange${index}`),
      components: field(`spellComponents${index}`),
      duration: field(`spellDuration${index}`),
      page: field(`spellPage${index}`),
      notes: field(`spellNotes${index}`, `spellDescription${index}`),
    };
    if (hasDndValue(spell) && !spells.some((existing) => existing.name === spell.name && existing.source === spell.source && existing.page === spell.page)) {
      spells.push(spell);
    }
  }
  return spells;
}

function renderDndSheetHeader(identity) {
  const header = document.createElement("div");
  header.className = "dnd-sheet-header";
  const nameBox = renderDndLabeledBox("CHARACTER NAME", identity.character_name || selectedRosterEntry()?.character_name || "");
  nameBox.classList.add("dnd-character-name-box");
  const infoGrid = document.createElement("div");
  infoGrid.className = "dnd-header-grid";
  infoGrid.append(
    renderDndLabeledBox("CLASS & LEVEL", identity.class_level || ""),
    renderDndLabeledBox("BACKGROUND", identity.background || ""),
    renderDndLabeledBox("PLAYER NAME", identity.player_name || selectedRosterEntry()?.username || ""),
    renderDndLabeledBox("SPECIES", identity.species || selectedRosterEntry()?.volk || ""),
    renderDndLabeledBox("ALIGNMENT", identity.alignment || ""),
    renderDndLabeledBox("EXPERIENCE POINTS", identity.experience_points || ""),
  );
  header.append(nameBox, infoGrid);
  return header;
}

function renderDndDashboard(data) {
  const dashboard = document.createElement("div");
  dashboard.className = "dnd-dashboard";
  const combat = data.combat || {};
  const spellcasting = data.spellcasting || {};
  const identity = data.identity || {};
  const items = [
    ["Armor Class", combat.armor_class],
    ["Initiative", combat.initiative],
    ["Speed", combat.speed],
    ["Max HP", combat.hit_points_max],
    ["Hit Dice", combat.hit_dice],
    ["Proficiency", combat.proficiency_bonus],
    ["Spell Save DC", spellcasting.save_dc],
    ["Spell Attack", spellcasting.attack_bonus],
    ["Spell Ability", spellcasting.ability],
    ["Alignment", identity.alignment],
    ["Size", identity.size],
  ].filter(([, value]) => hasDndValue(value));
  if (!items.length) {
    return dashboard;
  }
  for (const [label, value] of items) {
    dashboard.appendChild(renderDndLabeledBox(label.toUpperCase(), value));
  }
  return dashboard;
}

function renderDndLabeledBox(label, value) {
  const box = document.createElement("article");
  box.className = "dnd-sheet-box";
  const valueElement = document.createElement("strong");
  valueElement.textContent = hasDndValue(value) ? String(value) : "-";
  const labelElement = document.createElement("span");
  labelElement.textContent = label;
  box.append(valueElement, labelElement);
  return box;
}

function renderDndAbilitiesColumn(abilities) {
  const column = document.createElement("div");
  column.className = "dnd-sheet-column dnd-ability-column";
  const labels = {
    strength: "STRENGTH",
    dexterity: "DEXTERITY",
    constitution: "CONSTITUTION",
    intelligence: "INTELLIGENCE",
    wisdom: "WISDOM",
    charisma: "CHARISMA",
  };
  for (const [key, label] of Object.entries(labels)) {
    const value = abilities[key] || {};
    const card = document.createElement("article");
    card.className = "dnd-ability-card";
    const title = document.createElement("span");
    title.textContent = label;
    const score = document.createElement("strong");
    score.textContent = value.score || "-";
    const modifier = document.createElement("em");
    modifier.textContent = value.modifier || "-";
    const save = document.createElement("small");
    save.textContent = `Save ${value.save || "-"}`;
    card.append(title, score, modifier, save);
    column.appendChild(card);
  }
  return column;
}

function renderDndMiddleColumn(abilities, skills, combat, attacks) {
  const column = document.createElement("div");
  column.className = "dnd-sheet-column";
  const topStats = document.createElement("div");
  topStats.className = "dnd-combat-stat-grid";
  topStats.append(
    renderDndLabeledBox("ARMOR CLASS", combat.armor_class || ""),
    renderDndLabeledBox("INITIATIVE", combat.initiative || ""),
    renderDndLabeledBox("SPEED", combat.speed || ""),
  );
  column.appendChild(topStats);
  column.appendChild(renderDndHpPanel(combat));
  column.appendChild(renderDndSavingThrowsPanel(abilities));
  column.appendChild(renderDndSkillsPanel(skills));
  column.appendChild(renderDndAttacksPanel(attacks));
  return column;
}

function renderDndSavingThrowsPanel(abilities) {
  const labels = {
    strength: "Strength",
    dexterity: "Dexterity",
    constitution: "Constitution",
    intelligence: "Intelligence",
    wisdom: "Wisdom",
    charisma: "Charisma",
  };
  return renderDndListPanel("SAVING THROWS", Object.entries(labels).map(([key, label]) => [label, abilities?.[key]?.save || ""]), true);
}

function renderDndHpPanel(combat) {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel";
  const title = document.createElement("h3");
  title.textContent = "HIT POINTS";
  const grid = document.createElement("div");
  grid.className = "dnd-hp-grid";
  grid.append(
    renderDndLabeledBox("MAX HP", combat.hit_points_max || ""),
    renderDndLabeledBox("CURRENT HP", combat.hit_points_current || ""),
    renderDndLabeledBox("TEMP HP", combat.hit_points_temp || ""),
    renderDndLabeledBox("HIT DICE", combat.hit_dice || ""),
    renderDndLabeledBox("DEATH SAVE SUCCESSES", combat.death_saves_successes || ""),
    renderDndLabeledBox("DEATH SAVE FAILURES", combat.death_saves_failures || ""),
  );
  panel.append(title, grid);
  return panel;
}

function renderDndSkillsPanel(skills) {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel";
  const title = document.createElement("h3");
  title.textContent = "SKILLS";
  const table = document.createElement("table");
  table.className = "dnd-simple-table dnd-skill-table";
  table.innerHTML = "<thead><tr><th>Skill</th><th>Ability</th><th>Mod</th><th>Prof.</th></tr></thead>";
  const tbody = document.createElement("tbody");
  for (const [key, value] of Object.entries(skills || {})) {
    const row = document.createElement("tr");
    for (const cellValue of [
      key.replaceAll("_", " "),
      value?.ability || "-",
      value?.modifier || "-",
      value?.expertise ? "Expertise" : value?.proficient ? "Ja" : "-",
    ]) {
      const cell = document.createElement("td");
      cell.textContent = cellValue;
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  panel.append(title, table);
  return panel;
}

function renderDndListPanel(titleText, entries, showEmptyRows = false) {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel";
  const title = document.createElement("h3");
  title.textContent = titleText;
  const list = document.createElement("div");
  list.className = "dnd-line-list";
  const visibleEntries = showEmptyRows ? entries : entries.filter(([, value]) => hasDndValue(value));
  if (!visibleEntries.length) {
    const empty = document.createElement("p");
    empty.className = "dnd-empty-text";
    empty.textContent = "Nicht ausgefuellt.";
    panel.append(title, empty);
    return panel;
  }
  for (const [label, value] of visibleEntries) {
    const row = document.createElement("div");
    const valueElement = document.createElement("strong");
    valueElement.textContent = String(value);
    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    row.append(valueElement, labelElement);
    list.appendChild(row);
  }
  panel.append(title, list);
  return panel;
}

function hasDndValue(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (value && typeof value === "object") {
    return Object.values(value).some((item) => hasDndValue(item));
  }
  return value !== undefined && value !== null && String(value).trim() !== "" && String(value).trim() !== "-";
}

function renderDndAttacksPanel(attacks) {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel";
  const title = document.createElement("h3");
  title.textContent = "WEAPON ATTACKS & CANTRIPS";
  const table = document.createElement("div");
  table.className = "dnd-attack-table";
  table.append(renderDndAttackRow(["NAME", "HIT", "DAMAGE/TYPE"], true));
  const rows = Array.isArray(attacks) && attacks.length ? attacks : [{ name: "", hit: "", damage: "" }, { name: "", hit: "", damage: "" }, { name: "", hit: "", damage: "" }];
  for (const attack of rows) {
    table.append(renderDndAttackRow([attack.name || "", attack.hit || "", attack.damage || ""]));
  }
  panel.append(title, table);
  return panel;
}

function renderDndAttackRow(values, isHeader = false) {
  const row = document.createElement("div");
  row.className = isHeader ? "dnd-attack-row dnd-attack-header" : "dnd-attack-row";
  for (const value of values) {
    const cell = document.createElement("span");
    cell.textContent = value || "-";
    row.appendChild(cell);
  }
  return row;
}

function renderDndRightColumn(data) {
  const column = document.createElement("div");
  column.className = "dnd-sheet-column";
  const combat = data.combat || {};
  const resources = data.resources || {};
  const features = data.features || {};
  const personality = data.personality || {};
  column.appendChild(renderDndListPanel("PASSIVES", [
    ["Passive Perception", combat.passive_perception || ""],
    ["Passive Insight", combat.passive_insight || ""],
    ["Passive Investigation", combat.passive_investigation || ""],
    ["Proficiency Bonus", combat.proficiency_bonus || ""],
  ]));
  column.appendChild(renderDndDetailsPanel("FEATURES & TRAITS", splitDndTextBlocks(features.features_and_traits || features.additional_features_and_traits || "")));
  column.appendChild(renderDndDetailsPanel("PROFICIENCIES & LANGUAGES", splitDndTextBlocks(features.proficiencies_and_training || "")));
  column.appendChild(renderDndEquipmentPanel(resources));
  column.appendChild(renderDndListPanel("COINS", [["CP", resources.cp], ["SP", resources.sp], ["EP", resources.ep], ["GP", resources.gp], ["PP", resources.pp]]));
  column.appendChild(renderDndTextPanel("PERSONALITY TRAITS", personality.traits || ""));
  column.appendChild(renderDndTextPanel("IDEALS / BONDS / FLAWS", [personality.ideals, personality.bonds, personality.flaws].filter(Boolean).join("\n\n")));
  return column;
}

function renderDndEquipmentPanel(resources) {
  const equipment = resources.equipment;
  if (Array.isArray(equipment)) {
    const panel = document.createElement("section");
    panel.className = "dnd-sheet-panel";
    const title = document.createElement("h3");
    title.textContent = "EQUIPMENT";
    const table = document.createElement("table");
    table.className = "dnd-simple-table";
    table.innerHTML = "<thead><tr><th>Name</th><th>Qty</th><th>Weight</th></tr></thead>";
    const tbody = document.createElement("tbody");
    for (const item of equipment) {
      const row = document.createElement("tr");
      for (const cellValue of [item.name || "-", item.quantity || "-", item.weight || "-"]) {
        const cell = document.createElement("td");
        cell.textContent = cellValue;
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    panel.append(title);
    const carrying = renderDndCarrySummary(resources);
    if (carrying) {
      panel.appendChild(carrying);
    }
    panel.appendChild(table);
    return panel;
  }
  return renderDndTextPanel("EQUIPMENT", equipment || "");
}

function renderDndCarrySummary(resources) {
  const entries = [
    ["Weight", resources.weight_carried],
    ["Encumbered", resources.encumbered],
    ["Push/Drag/Lift", resources.push_drag_lift],
  ].filter(([, value]) => hasDndValue(value));
  if (!entries.length) {
    return null;
  }
  const summary = document.createElement("div");
  summary.className = "dnd-carry-summary";
  for (const [label, value] of entries) {
    const item = document.createElement("span");
    item.textContent = `${label}: ${value}`;
    summary.appendChild(item);
  }
  return summary;
}

function splitDndTextBlocks(text) {
  const normalized = String(text || "").trim();
  if (!normalized) {
    return [];
  }
  const markerPattern = /===\s*([^=]+?)\s*===/g;
  const matches = [...normalized.matchAll(markerPattern)];
  if (!matches.length) {
    return [{ title: "Details", body: normalized }];
  }
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? normalized.length;
    return { title: match[1].trim(), body: normalized.slice(start, end).trim() };
  }).filter((item) => item.body);
}

function renderDndDetailsPanel(titleText, blocks) {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel dnd-details-panel";
  const title = document.createElement("h3");
  title.textContent = titleText;
  panel.appendChild(title);
  if (!blocks.length) {
    const empty = document.createElement("p");
    empty.className = "dnd-empty-text";
    empty.textContent = "Nicht ausgefuellt.";
    panel.appendChild(empty);
    return panel;
  }
  for (const block of blocks) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = block.title || "Details";
    const paragraph = document.createElement("p");
    paragraph.textContent = block.body || "";
    details.append(summary, paragraph);
    panel.appendChild(details);
  }
  return panel;
}

function renderDndTextPanel(titleText, value) {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel dnd-text-panel";
  const title = document.createElement("h3");
  title.textContent = titleText;
  const paragraph = document.createElement("p");
  paragraph.textContent = value || "Nicht ausgefuellt.";
  panel.append(title, paragraph);
  return panel;
}

function renderDndPdfTextSection(pages, source = {}) {
  const section = document.createElement("section");
  section.className = "dnd-pdf-text-section";
  const title = document.createElement("h3");
  title.textContent = "AUS PDF GELESEN";
  const note = document.createElement("p");
  note.className = "dnd-pdf-note";
  note.textContent = Number(source.form_field_count || 0) > 0
    ? `${source.form_field_count} Formularfelder erkannt und in den Bogen uebernommen.`
    : "Diese PDF enthaelt keine auslesbaren Formularwerte. Der sichtbare PDF-Text wird vollstaendig nach Seiten angezeigt.";
  section.append(title, note);
  if (!Array.isArray(pages) || !pages.length) {
    const empty = document.createElement("p");
    empty.className = "upload-hint";
    empty.textContent = "Kein PDF-Text erkannt.";
    section.appendChild(empty);
    return section;
  }
  for (const page of pages) {
    const article = document.createElement("article");
    article.className = "dnd-pdf-page";
    const pageTitle = document.createElement("h4");
    pageTitle.textContent = `Seite ${page.page || ""}`;
    const lines = document.createElement("div");
    lines.className = "dnd-pdf-lines";
    for (const line of page.lines || []) {
      const lineElement = document.createElement("span");
      lineElement.textContent = line;
      lines.appendChild(lineElement);
    }
    article.append(pageTitle, lines);
    section.appendChild(article);
  }
  return section;
}

function renderDndSpellsPanel(spellcasting = {}) {
  const panel = document.createElement("section");
  panel.className = "dnd-spells-section";
  const header = document.createElement("div");
  header.className = "dnd-spells-header";
  const title = document.createElement("h3");
  title.textContent = "SPELLS";
  const summary = document.createElement("div");
  summary.className = "dnd-spell-summary";
  summary.append(
    renderDndLabeledBox("CLASS", spellcasting.class || ""),
    renderDndLabeledBox("ABILITY", spellcasting.ability || ""),
    renderDndLabeledBox("SAVE DC", spellcasting.save_dc || ""),
    renderDndLabeledBox("ATTACK BONUS", spellcasting.attack_bonus || ""),
  );
  header.append(title, summary);
  panel.appendChild(header);

  const spells = Array.isArray(spellcasting.spells) ? spellcasting.spells : [];
  if (!spells.length) {
    const empty = document.createElement("p");
    empty.className = "dnd-empty-text";
    empty.textContent = "Keine Zauber im JSON erkannt.";
    panel.appendChild(empty);
    return panel;
  }

  const controls = document.createElement("div");
  controls.className = "dnd-spell-controls";
  const search = document.createElement("input");
  search.type = "search";
  search.placeholder = "Zauber suchen";
  search.className = "sidebar-input";
  const levelSelect = document.createElement("select");
  levelSelect.className = "sidebar-input";
  const levels = ["all", ...new Set(spells.map((spell) => String(spell.level || spell.spell_level || "Cantrip")))];
  for (const level of levels) {
    const option = document.createElement("option");
    option.value = level;
    option.textContent = level === "all" ? "Alle Level" : level;
    levelSelect.appendChild(option);
  }
  const preparedToggle = document.createElement("label");
  preparedToggle.className = "dnd-toggle";
  const preparedInput = document.createElement("input");
  preparedInput.type = "checkbox";
  preparedToggle.append(preparedInput, document.createTextNode("Nur vorbereitet"));
  const concentrationToggle = document.createElement("label");
  concentrationToggle.className = "dnd-toggle";
  const concentrationInput = document.createElement("input");
  concentrationInput.type = "checkbox";
  concentrationToggle.append(concentrationInput, document.createTextNode("Konzentration"));
  const ritualToggle = document.createElement("label");
  ritualToggle.className = "dnd-toggle";
  const ritualInput = document.createElement("input");
  ritualInput.type = "checkbox";
  ritualToggle.append(ritualInput, document.createTextNode("Ritual"));
  controls.append(search, levelSelect, preparedToggle, concentrationToggle, ritualToggle);
  const list = document.createElement("div");
  list.className = "dnd-spell-list";
  const render = () => {
    const query = search.value.trim().toLowerCase();
    const level = levelSelect.value;
    const onlyPrepared = preparedInput.checked;
    const onlyConcentration = concentrationInput.checked;
    const onlyRitual = ritualInput.checked;
    list.innerHTML = "";
    for (const spell of spells) {
      const name = String(spell.name || "").trim();
      const spellLevel = String(spell.level || spell.spell_level || "Cantrip");
      const notes = String(spell.notes || "");
      const isPrepared = Boolean(spell.prepared);
      const isRitual = /\[r\]|\britual\b/i.test(`${name} ${notes}`);
      const isConcentration = /\bconcentration\b|\bconc\b/i.test(`${spell.duration || ""} ${notes}`);
      if (query && !name.toLowerCase().includes(query)) continue;
      if (level !== "all" && spellLevel !== level) continue;
      if (onlyPrepared && !isPrepared) continue;
      if (onlyConcentration && !isConcentration) continue;
      if (onlyRitual && !isRitual) continue;
      list.appendChild(renderDndSpellCard(spell, { isPrepared, isRitual, isConcentration, spellLevel }));
    }
    if (!list.children.length) {
      const empty = document.createElement("p");
      empty.className = "dnd-empty-text";
      empty.textContent = "Keine passenden Zauber.";
      list.appendChild(empty);
    }
  };
  search.addEventListener("input", render);
  levelSelect.addEventListener("change", render);
  preparedInput.addEventListener("change", render);
  concentrationInput.addEventListener("change", render);
  ritualInput.addEventListener("change", render);
  panel.append(controls, list);
  render();
  return panel;
}

function renderDndSpellCard(spell, flags) {
  const article = document.createElement("article");
  article.className = "dnd-spell-card";
  const title = document.createElement("h4");
  title.textContent = spell.name || "Unbenannter Zauber";
  const meta = document.createElement("p");
  meta.textContent = [
    flags.spellLevel,
    spell.source,
    spell.save_attack || spell.save_atk || spell.attack,
    spell.casting_time,
    spell.range,
    spell.components,
    spell.duration,
    spell.page,
  ].filter(Boolean).join(" | ");
  const badges = document.createElement("div");
  badges.className = "dnd-spell-badges";
  for (const [active, text] of [[flags.isPrepared, "Prepared"], [flags.isRitual, "Ritual"], [flags.isConcentration, "Concentration"]]) {
    if (!active) continue;
    const badge = document.createElement("span");
    badge.textContent = text;
    badges.appendChild(badge);
  }
  const notes = document.createElement("p");
  notes.textContent = spell.notes || "";
  article.append(title, badges, meta, notes);
  return article;
}

async function loadDndPdfIntoFrame(pdfUrl) {
  clearDndPdfObjectUrl();
  if (!pdfUrl) {
    dndPdfOpenLink.href = "#";
    dndPdfOpenLink.classList.add("hidden");
    return;
  }
  const response = await fetch(`${pdfUrl}${pdfUrl.includes("?") ? "&" : "?"}ts=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || "PDF konnte nicht geladen werden.");
  }
  const blob = await response.blob();
  currentDndPdfObjectUrl = window.URL.createObjectURL(blob);
  dndPdfOpenLink.href = currentDndPdfObjectUrl;
  dndPdfOpenLink.classList.remove("hidden");
}

async function renderDndPdfSheet(sheet = {}) {
  const entry = selectedRosterEntry();
  const pdfName = sheet.pdf_original_name || entry?.pdf_original_name || "";
  const pdfUrl = sheet.pdf_url || "";
  sheetHeadline.textContent = entry?.username ? `DnD-Sheet: ${entry.username}` : "DnD-Charaktersheet";
  sheetHeroTitle.textContent = pdfName || "DnD-Charaktersheet";
  dndPdfInfoBlock.classList.toggle("hidden", viewerIsPlayer());
  dndPdfTitle.textContent = pdfName || "Noch kein PDF geladen";
  dndPdfSubtitle.textContent = entry?.username
    ? `Gespeichert fuer ${entry.username} im Projekt ${rosterPayload?.project?.name || ""}.`
    : "Lade ein Charaktersheet-PDF hoch, um es hier anzusehen.";
  summaryProject.textContent = rosterPayload?.project?.name || "-";
  summarySelectedPlayer.textContent = entry?.username || "-";
  summaryVolk.textContent = "DnD";
  summaryInitiative.textContent = "PDF";
  summaryDisciplines.textContent = pdfName ? "1" : "0";
  validationStatus.textContent = pdfName ? "PDF vorhanden" : "PDF fehlt";
  sheetSaveBadge.textContent = pdfName ? "PDF geladen" : "Kein PDF";
  dndPdfDeleteButton.classList.toggle("hidden", !pdfUrl || !canEditSelectedSheet());
  dndPdfTags.innerHTML = "";
  for (const label of [entry?.username || "", pdfName || "PDF fehlt"].filter(Boolean)) {
    const tag = document.createElement("span");
    tag.className = "character-pill";
    tag.textContent = label;
    dndPdfTags.appendChild(tag);
  }
  dndPdfEmptyState.classList.toggle("hidden", Boolean(pdfUrl));
  dndParsedDataView.classList.toggle("hidden", !pdfUrl);
  renderDndParsedData(sheet.data || {});
  if (pdfUrl) {
    try {
      await loadDndPdfIntoFrame(pdfUrl);
    } catch (error) {
      dndPdfOpenLink.href = "#";
      dndPdfOpenLink.classList.add("hidden");
      setStorageStatus(`PDF wurde geparsed, Original-PDF konnte aber nicht geoeffnet werden: ${error.message}`, "error");
    }
  } else {
    clearDndPdfObjectUrl();
    dndPdfOpenLink.href = "#";
    dndPdfOpenLink.classList.add("hidden");
    dndParsedDataView.innerHTML = "";
    dndPdfEmptyState.querySelector("h3").textContent = "Kein PDF vorhanden";
    dndPdfEmptyState.querySelector("p").textContent = viewerIsPlayer()
      ? "Lade dein DnD-Charaktersheet als PDF ein."
      : "Fuer diesen Spieler wurde noch kein DnD-Charaktersheet als PDF eingelesen.";
  }
}

function showEmptyState(message) {
  sheetEmptyState.classList.remove("hidden");
  sheetEmptyState.querySelector("p").textContent = message;
  characterSheetForm.classList.add("hidden");
  dndPdfPanel.classList.add("hidden");
  setEditingEnabled(false);
  sheetSaveBadge.textContent = "Nicht verfuegbar";
}

function showFormState() {
  sheetEmptyState.classList.add("hidden");
  characterSheetForm.classList.toggle("hidden", isDndProject());
  dndPdfPanel.classList.toggle("hidden", !isDndProject());
  setEditingEnabled(canEditSelectedSheet());
}

function updateRosterEntryFromData(savedData, meta = {}) {
  const entry = selectedRosterEntry();
  if (!entry) {
    return;
  }
  entry.character_name = String(savedData.identity.character_name || "");
  entry.volk = String(savedData.identity.volk || "");
  entry.level = Math.max(1, Number(savedData.identity.level || 1));
  entry.updated_at = meta.updated_at || new Date().toISOString();
  entry.created_at = meta.created_at || entry.created_at || entry.updated_at;
  entry.has_sheet = true;
}

function renderRoster() {
  sheetRosterList.innerHTML = "";
  const entries = Array.isArray(rosterPayload?.sheets) ? rosterPayload.sheets : [];
  if (!entries.length) {
    setRosterStatus("Keine Spieler fuer dieses Projekt vorhanden.", "error");
    return;
  }

  const viewerCanManageAll = Boolean(rosterPayload?.viewer?.can_manage_all);
  setRosterStatus(
    viewerCanManageAll
      ? `${entries.length} Spieler im Projekt.`
      : "Dein Charakterbogen fuer dieses Projekt.",
  );

  for (const entry of entries) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "character-roster-item";
    if (entry.user_id === selectedUserId) {
      button.classList.add("active");
    }
    if (!entry.has_sheet) {
      button.classList.add("missing");
    }

    const header = document.createElement("div");
    header.className = "character-roster-header";

    const name = document.createElement("strong");
    name.textContent = entry.username;

    const state = document.createElement("span");
    state.className = "character-roster-state";
    state.textContent = isDndProject()
      ? (entry.has_pdf ? "PDF vorhanden" : "Noch kein PDF")
      : (entry.has_sheet ? "Bogen vorhanden" : "Noch kein Bogen");

    header.append(name, state);

    const subtitle = document.createElement("div");
    subtitle.className = "character-roster-meta";
    subtitle.textContent = isDndProject()
      ? (entry.pdf_original_name || `Letzte Aenderung: ${formatTimestamp(entry.updated_at)}`)
      : (entry.character_name
        ? `${entry.character_name} | ${entry.volk || "Volk offen"} | Stufe ${entry.level || 1}`
        : `Letzte Aenderung: ${formatTimestamp(entry.updated_at)}`);

    button.append(header, subtitle);
    button.addEventListener("click", async () => {
      if (entry.user_id === selectedUserId) {
        return;
      }
      await selectUser(entry.user_id);
    });
    sheetRosterList.appendChild(button);
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    cache: "no-store",
    ...options,
  });
  if (response.status === 401) {
    window.location.href = "/login";
    throw new Error("Nicht eingeloggt.");
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.detail || "Anfrage fehlgeschlagen.");
  }
  return payload;
}

function resetAutosaveTimer() {
  if (autosaveTimerId) {
    window.clearTimeout(autosaveTimerId);
    autosaveTimerId = 0;
  }
}

async function saveSheet(reason = "Gespeichert.") {
  if (isDndProject() || !selectedUserId || !rosterPayload?.project?.id || !canEditSelectedSheet()) {
    return null;
  }
  const payloadData = collectFormData();
  currentSheetData = payloadData;
  setStorageStatus("Speichert ...");
  const response = await fetchJson(`/api/character-sheets/${encodeURIComponent(selectedUserId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_id: rosterPayload.project.id,
      data: payloadData,
    }),
  });
  currentSheetData = dirtySinceLastSave
    ? collectFormData()
    : normalizeSheetData(response.sheet?.data || payloadData);
  selectedSheetMeta = response.sheet || null;
  updateRosterEntryFromData(
    dirtySinceLastSave ? currentSheetData : normalizeSheetData(response.sheet?.data || payloadData),
    response.sheet || {},
  );
  renderRoster();
  renderCurrentSheetUi();
  setStorageStatus(dirtySinceLastSave ? "Weitere Aenderungen ausstehend ..." : reason);
  return response;
}

async function flushAutosave(reason = "Automatisch gespeichert.") {
  resetAutosaveTimer();
  if (!dirtySinceLastSave || isLoadingSheet) {
    return true;
  }
  dirtySinceLastSave = false;
  try {
    await saveSheet(reason);
    return true;
  } catch (error) {
    dirtySinceLastSave = true;
    setStorageStatus(error.message || "Speichern fehlgeschlagen.", "error");
    return false;
  }
}

function scheduleAutosave() {
  if (isDndProject() || isLoadingSheet || !canEditSelectedSheet()) {
    return;
  }
  currentSheetData = collectFormData();
  dirtySinceLastSave = true;
  renderCurrentSheetUi();
  setStorageStatus("Aenderungen ausstehend ...");
  resetAutosaveTimer();
  autosaveTimerId = window.setTimeout(() => {
    void flushAutosave();
  }, 700);
}

async function loadRoster(preferredUserId = "") {
  sheetProjectName.textContent = "Projekt wird geladen...";
  try {
    rosterPayload = await fetchJson("/api/character-sheets");
    applyRulesetMode();
    sheetProjectName.textContent = rosterPayload.project?.name || "Unbekanntes Projekt";
    sheetProjectMeta.textContent = isDndProject()
      ? `DnD-Projekt. PDF-Sheets werden serverseitig pro Spieler gespeichert.`
      : `Projekt-ID ${rosterPayload.project?.id || "-"}. Speicherung erfolgt serverseitig pro Spieler.`;
    summaryProject.textContent = rosterPayload.project?.name || "-";
    renderRoster();

    const availableUserIds = new Set((rosterPayload.sheets || []).map((entry) => entry.user_id));
    const nextSelectedUserId =
      (preferredUserId && availableUserIds.has(preferredUserId) && preferredUserId) ||
      (selectedUserId && availableUserIds.has(selectedUserId) && selectedUserId) ||
      (rosterPayload.default_user_id && availableUserIds.has(rosterPayload.default_user_id) && rosterPayload.default_user_id) ||
      (rosterPayload.sheets?.[0]?.user_id || "");

    if (!nextSelectedUserId) {
      selectedUserId = "";
      currentSheetData = deepClone(DEFAULT_SHEET_DATA);
      showEmptyState("Diesem Projekt ist noch kein Spieler mit Charakterbogen zugeordnet.");
      renderCurrentSheetUi();
      return;
    }
    await loadSheet(nextSelectedUserId);
  } catch (error) {
    rosterPayload = null;
    selectedUserId = "";
    sheetProjectName.textContent = "Kein Projekt verfuegbar";
    sheetProjectMeta.textContent = error.message || "Der Charakterbogen konnte nicht geladen werden.";
    showEmptyState(error.message || "Der Charakterbogen konnte nicht geladen werden.");
    setRosterStatus(error.message || "Der Charakterbogen konnte nicht geladen werden.", "error");
    setStorageStatus("Keine Speicherung moeglich.", "error");
  }
}

async function loadSheet(userId) {
  selectedUserId = userId;
  renderRoster();
  if (!rosterPayload?.project?.id) {
    showEmptyState("Es ist kein aktives Projekt verfuegbar.");
    return;
  }

  isLoadingSheet = true;
  dirtySinceLastSave = false;
  resetAutosaveTimer();
  setStorageStatus("Charakterbogen wird geladen ...");

  try {
    const response = await fetchJson(`/api/character-sheets/${encodeURIComponent(userId)}?project_id=${encodeURIComponent(rosterPayload.project.id)}`);
    selectedSheetMeta = response.sheet || null;
    showFormState();
    if (isDndProject()) {
      currentSheetData = deepClone(DEFAULT_SHEET_DATA);
      await renderDndPdfSheet(response.sheet || {});
    } else {
      currentSheetData = normalizeSheetData(response.sheet?.data || {});
      fillForm(currentSheetData);
      renderCurrentSheetUi();
    }
    const baseStatus = isDndProject()
      ? (response.sheet?.has_pdf
        ? `PDF geladen: ${response.sheet.pdf_original_name || "Charaktersheet.pdf"}.`
        : "Noch kein PDF vorhanden. Der Upload speichert den DnD-Bogen fuer dieses Projekt.")
      : (response.sheet?.has_sheet
        ? `Bogen geladen. Letzte Speicherung: ${formatTimestamp(response.sheet.updated_at)}.`
        : "Noch kein gespeicherter Bogen vorhanden. Der erste Save legt ihn fuer dieses Projekt an.");
    setStorageStatus(baseStatus);
  } catch (error) {
    showEmptyState(error.message || "Der Charakterbogen konnte nicht geladen werden.");
    setStorageStatus(error.message || "Der Charakterbogen konnte nicht geladen werden.", "error");
  } finally {
    isLoadingSheet = false;
  }
}

async function selectUser(userId) {
  if (!isDndProject()) {
    const saveSucceeded = await flushAutosave("Vor dem Wechsel gespeichert.");
    if (!saveSucceeded) {
      return;
    }
  }
  await loadSheet(userId);
}

function exportCurrentSheet() {
  const exportPayload = {
    version: 2,
    exported_at: new Date().toISOString(),
    project: rosterPayload?.project || null,
    user: {
      id: selectedUserId,
      username: selectedRosterEntry()?.username || "",
    },
    sheet: {
      data: collectFormData(),
    },
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = summarizeSheetName(exportPayload.sheet.data).replace(/[^\w-]+/g, "_");
  link.href = url;
  link.download = `${safeName || "charakterbogen"}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  setStorageStatus("JSON exportiert.");
}

async function importCurrentSheet(file) {
  const rawText = await file.text();
  const parsed = JSON.parse(rawText);
  const importedData = normalizeSheetData(parsed?.sheet?.data || parsed?.data || parsed);
  currentSheetData = importedData;
  fillForm(currentSheetData);
  renderCurrentSheetUi();
  dirtySinceLastSave = true;
  await flushAutosave("JSON importiert und gespeichert.");
}

async function uploadDndPdf(file) {
  if (!selectedUserId || !rosterPayload?.project?.id || !canEditSelectedSheet()) {
    throw new Error("Du darfst diesen Charakterbogen nicht bearbeiten.");
  }
  if (!isDndProject()) {
    throw new Error("PDF-Import ist nur fuer DnD-Projekte verfuegbar.");
  }
  const formData = new FormData();
  formData.append("project_id", rosterPayload.project.id);
  formData.append("pdf", file);
  setStorageStatus("PDF wird eingelesen ...");
  const response = await fetchJson(`/api/character-sheets/${encodeURIComponent(selectedUserId)}/pdf`, {
    method: "POST",
    body: formData,
  });
  selectedSheetMeta = response.sheet || null;
  const entry = selectedRosterEntry();
  if (entry) {
    entry.has_sheet = true;
    entry.has_pdf = Boolean(response.sheet?.has_pdf);
    entry.pdf_original_name = response.sheet?.pdf_original_name || file.name;
    entry.character_name = response.sheet?.character_name || entry.character_name || "";
    entry.updated_at = response.sheet?.updated_at || new Date().toISOString();
  }
  renderRoster();
  setStorageStatus("PDF wurde gespeichert. Anzeige wird geladen ...");
  await renderDndPdfSheet(response.sheet || {});
  if (!sheetStorageStatus.classList.contains("character-status-error")) {
    setStorageStatus("PDF wurde gespeichert.");
  }
}

async function deleteDndPdf() {
  if (!selectedUserId || !rosterPayload?.project?.id || !canEditSelectedSheet()) {
    throw new Error("Du darfst diesen Charakterbogen nicht bearbeiten.");
  }
  const entry = selectedRosterEntry();
  const displayName = entry?.pdf_original_name || "dieses PDF";
  if (!window.confirm(`Soll ${displayName} wirklich geloescht werden?`)) {
    return;
  }
  setStorageStatus("PDF wird geloescht ...");
  await fetchJson(`/api/character-sheets/${encodeURIComponent(selectedUserId)}/pdf?project_id=${encodeURIComponent(rosterPayload.project.id)}`, {
    method: "DELETE",
  });
  if (entry) {
    entry.has_pdf = false;
    entry.pdf_original_name = "";
    entry.has_sheet = Boolean(entry.character_name);
    entry.updated_at = new Date().toISOString();
  }
  selectedSheetMeta = {
    ...(selectedSheetMeta || {}),
    has_pdf: false,
    pdf_original_name: "",
    pdf_url: "",
  };
  clearDndPdfObjectUrl();
  renderRoster();
  await renderDndPdfSheet(selectedSheetMeta);
  setStorageStatus("PDF wurde geloescht.");
}

async function resetCurrentSheet() {
  const displayName = summarizeSheetName(currentSheetData);
  if (!window.confirm(`Soll "${displayName}" wirklich geleert werden?`)) {
    return;
  }
  currentSheetData = deepClone(DEFAULT_SHEET_DATA);
  fillForm(currentSheetData);
  renderCurrentSheetUi();
  dirtySinceLastSave = true;
  await flushAutosave("Charakterbogen geleert.");
}

function bindEvents() {
  characterSheetForm.addEventListener("input", () => {
    scheduleAutosave();
  });
  characterSheetForm.addEventListener("change", () => {
    scheduleAutosave();
  });

  sheetProjectRefreshButton.addEventListener("click", async () => {
    const saveSucceeded = await flushAutosave("Vor dem Neuladen gespeichert.");
    if (!saveSucceeded) {
      return;
    }
    await loadRoster(selectedUserId);
  });

  sheetExportButton.addEventListener("click", () => {
    exportCurrentSheet();
  });

  sheetResetButton.addEventListener("click", async () => {
    await resetCurrentSheet();
  });

  sheetImportInput.addEventListener("change", async () => {
    const [file] = Array.from(sheetImportInput.files || []);
    if (!file) {
      return;
    }
    try {
      await importCurrentSheet(file);
    } catch (error) {
      setStorageStatus(error.message || "JSON konnte nicht importiert werden.", "error");
    } finally {
      sheetImportInput.value = "";
    }
  });

  dndPdfInput.addEventListener("change", async () => {
    const [file] = Array.from(dndPdfInput.files || []);
    if (!file) {
      return;
    }
    try {
      await uploadDndPdf(file);
    } catch (error) {
      setStorageStatus(error.message || "PDF konnte nicht eingelesen werden.", "error");
    } finally {
      dndPdfInput.value = "";
    }
  });

  dndPdfDeleteButton.addEventListener("click", async () => {
    try {
      await deleteDndPdf();
    } catch (error) {
      setStorageStatus(error.message || "PDF konnte nicht geloescht werden.", "error");
    }
  });

  window.addEventListener("beforeunload", (event) => {
    clearDndPdfObjectUrl();
    if (dirtySinceLastSave) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
}

async function initializeCharacterSheetPage() {
  renderStaticUi();
  bindEvents();
  setEditingEnabled(false);
  currentUser = await initializeAuthUi({ required: true });
  if (!currentUser) {
    return;
  }
  await loadRoster();
}

void initializeCharacterSheetPage();
