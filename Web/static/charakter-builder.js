const builderRoot = document.getElementById("builderRoot");
const builderEmptyState = document.getElementById("builderEmptyState");
const builderProjectName = document.getElementById("builderProjectName");
const builderProjectMeta = document.getElementById("builderProjectMeta");
const builderProjectRefreshButton = document.getElementById("builderProjectRefreshButton");
const builderRosterList = document.getElementById("builderRosterList");
const builderRosterStatus = document.getElementById("builderRosterStatus");
const builderStepList = document.getElementById("builderStepList");
const builderStorageStatus = document.getElementById("builderStorageStatus");
const builderHeadline = document.getElementById("builderHeadline");
const builderHeroTitle = document.getElementById("builderHeroTitle");
const builderHeroSubtitle = document.getElementById("builderHeroSubtitle");
const builderHeroTags = document.getElementById("builderHeroTags");
const builderSaveBadge = document.getElementById("builderSaveBadge");
const builderPlayerName = document.getElementById("builderPlayerName");
const builderProgressTitle = document.getElementById("builderProgressTitle");
const builderProgressCounter = document.getElementById("builderProgressCounter");
const builderProgressFill = document.getElementById("builderProgressFill");
const builderBackButton = document.getElementById("builderBackButton");
const builderNextButton = document.getElementById("builderNextButton");
const builderResetButton = document.getElementById("builderResetButton");
const builderStepValidationMessage = document.getElementById("builderStepValidationMessage");
const builderFrame = builderRoot.closest(".character-sheet-frame");

const builderRaceGrid = document.getElementById("builderRaceGrid");
const builderRaceInfoGrid = document.getElementById("builderRaceInfoGrid");
const builderAttributeGrid = document.getElementById("builderAttributeGrid");
const builderCombatDisciplineGrid = document.getElementById("builderCombatDisciplineGrid");
const builderGeneralDisciplineGrid = document.getElementById("builderGeneralDisciplineGrid");
const builderComplexityGrid = document.getElementById("builderComplexityGrid");
const builderCombatValuesGrid = document.getElementById("builderCombatValuesGrid");
const builderDisciplineAttributeSummary = document.getElementById("builderDisciplineAttributeSummary");
const builderReviewGrid = document.getElementById("builderReviewGrid");
const builderAttackReferenceGrid = document.getElementById("builderAttackReferenceGrid");
const builderStepNotes = document.getElementById("builderStepNotes");
const builderHpFormula = document.getElementById("builderHpFormula");

const builderSummaryProject = document.getElementById("builderSummaryProject");
const builderSummaryPlayer = document.getElementById("builderSummaryPlayer");
const builderSummaryRace = document.getElementById("builderSummaryRace");
const builderSummaryDisciplines = document.getElementById("builderSummaryDisciplines");
const builderSummaryAttributes = document.getElementById("builderSummaryAttributes");
const builderValidationStatus = document.getElementById("builderValidationStatus");
const builderValidationList = document.getElementById("builderValidationList");
const builderAttributePattern = document.getElementById("builderAttributePattern");
const builderDisciplineBudget = document.getElementById("builderDisciplineBudget");
const builderSelectedRaceInput = document.getElementById("builderSelectedRaceInput");

const builderWeaponTypeSelect = document.getElementById("builderWeaponTypeSelect");
const builderOffhandTypeSelect = document.getElementById("builderOffhandTypeSelect");
const builderFocusTypeSelect = document.getElementById("builderFocusTypeSelect");

const builderSteps = Array.from(document.querySelectorAll(".builder-step"));

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

const STEP_DEFINITIONS = [
  {
    title: "Identitaet",
    notes: [
      "Der Builder startet mit der Geschichte der Figur: Name, Konzept und Motivation setzen den Fokus fuer alle spaeteren Entscheidungen.",
      "Das Regelwerk ist hier bewusst offen. Wichtig ist nur, dass klar ist, weshalb die Figur in Konflikte und Abenteuer geraet.",
    ],
  },
  {
    title: "Volk",
    notes: [
      "Das Volk legt passive Faehigkeiten, Lebensbonus und Resistenzen fest, aber nicht die Persoenlichkeit.",
      "Waehlst du ein Volk, siehst du rechts sofort die abgeleiteten Werte. So bleibt klar, was spaeter im Kampf gilt.",
    ],
  },
  {
    title: "Attribute",
    notes: [
      "Startverteilung fuer Stufe 1: 3 / 2 / 2 / 1 / 1. Das ist die zentrale Regel dieses Schritts.",
      "Attribute bestimmen Talent. Disziplinen duerfen spaeter den typischen Attributwert nicht uebersteigen.",
    ],
  },
  {
    title: "Disziplinen",
    notes: [
      "Es gibt 10 Disziplinpunkte fuer die Erschaffung. Keine Startdisziplin ueber 3.",
      "Direkte Kampfdisziplinen sind fest an ihr Attribut gebunden, allgemeine Disziplinen zeigen ihr typisches Attribut und moegliche Alternativen.",
    ],
  },
  {
    title: "Kampf und Ausruestung",
    notes: [
      "Komplexitaeten starten auf 1. Der Builder laesst sie sichtbar, damit sofort klar ist, was aktuell moeglich ist.",
      "Max-Lebenspunkte werden automatisch aus Koerper und Lebensbonus berechnet. Aktuelle Lebenspunkte und Ruestung bleiben manuell.",
    ],
  },
  {
    title: "Abschluss",
    notes: [
      "Der letzte Schritt fasst den Charakter als spielbereiten Startbogen zusammen.",
      "Wenn die Regelpruefung rechts gruene Werte zeigt, kannst du direkt in den normalen Charakterbogen wechseln und dort feinere Details pflegen.",
    ],
  },
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

let currentUser = null;
let rosterPayload = null;
let selectedUserId = "";
let currentSheetData = deepClone(DEFAULT_SHEET_DATA);
let currentStepIndex = 0;
let isLoadingSheet = false;
let dirtySinceLastSave = false;
let autosaveTimerId = 0;

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

function normalizeSheetData(rawData = {}) {
  return syncDerivedCombatValues(mergeWithDefaults(DEFAULT_SHEET_DATA, isPlainObject(rawData) ? rawData : {}));
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

function renderSelectOptions(selectElement, options) {
  selectElement.innerHTML = "";
  for (const optionDefinition of options) {
    const optionElement = document.createElement("option");
    optionElement.value = optionDefinition.value;
    optionElement.textContent = optionDefinition.label;
    selectElement.appendChild(optionElement);
  }
}

function allFormFields() {
  return Array.from(builderRoot.querySelectorAll("[data-path]"));
}

function fillForm(data) {
  const normalized = normalizeSheetData(data);
  for (const field of allFormFields()) {
    const value = getValueAtPath(normalized, field.dataset.path);
    if (field.tagName === "SELECT") {
      field.value = String(value ?? "");
    } else if (field.type === "number") {
      field.value = Number.isFinite(Number(value)) ? String(Number(value)) : "0";
    } else {
      field.value = value === undefined || value === null ? "" : String(value);
    }
  }
}

function collectFormData() {
  const data = deepClone(DEFAULT_SHEET_DATA);
  for (const field of allFormFields()) {
    const path = field.dataset.path;
    const defaultValue = getValueAtPath(DEFAULT_SHEET_DATA, path);
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

function labelForSelectValue(options, value) {
  const match = options.find((option) => option.value === value);
  return match ? match.label : "Keine Angabe";
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

function setStorageStatus(text, tone = "normal") {
  builderStorageStatus.textContent = text;
  builderStorageStatus.classList.toggle("character-status-error", tone === "error");
}

function setRosterStatus(text, tone = "normal") {
  builderRosterStatus.textContent = text;
  builderRosterStatus.classList.toggle("character-status-error", tone === "error");
}

function setEditingEnabled(enabled) {
  builderRoot.querySelectorAll("input, textarea, select, button").forEach((element) => {
    element.disabled = !enabled;
  });
}

function showEmptyState(message) {
  builderEmptyState.classList.remove("hidden");
  builderEmptyState.querySelector("p").textContent = message;
  builderRoot.classList.add("hidden");
  setEditingEnabled(false);
}

function showBuilderState() {
  builderEmptyState.classList.add("hidden");
  builderRoot.classList.remove("hidden");
  setEditingEnabled(canEditSelectedSheet());
}

function fetchJson(url, options = {}) {
  return fetch(url, {
    cache: "no-store",
    ...options,
  }).then(async (response) => {
    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error("Nicht eingeloggt.");
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.detail || "Anfrage fehlgeschlagen.");
    }
    return payload;
  });
}

function buildAttributePattern(data) {
  return ATTRIBUTE_DEFINITIONS
    .map((definition) => Number(data.attributes[definition.key] || 0))
    .sort((left, right) => right - left)
    .join(" / ");
}

function raceDefinition(volkKey) {
  return RACES[volkKey] || RACES[""];
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

function totalDisciplinePoints(data) {
  return [
    ...Object.values(data.combat_disciplines || {}),
    ...Object.values(data.general_disciplines || {}),
  ].reduce((sum, value) => sum + (Number.isFinite(Number(value)) ? Number(value) : 0), 0);
}

function disciplineViolations(data) {
  const violations = [];
  for (const definition of COMBAT_DISCIPLINES) {
    const value = Number(data.combat_disciplines[definition.key] || 0);
    const limit = Number(data.attributes[definition.attribute] || 0);
    if (value > limit) {
      violations.push(`${definition.label} ${value} > ${definition.attributeLabel} ${limit}`);
    }
    if (value > 3) {
      violations.push(`${definition.label} ${value} > Startmaximum 3`);
    }
  }
  for (const definition of GENERAL_DISCIPLINES) {
    const value = Number(data.general_disciplines[definition.key] || 0);
    const limit = Number(data.attributes[definition.attribute] || 0);
    if (value > limit) {
      violations.push(`${definition.label} ${value} > ${definition.attributeLabel} ${limit}`);
    }
    if (value > 3) {
      violations.push(`${definition.label} ${value} > Startmaximum 3`);
    }
  }
  return violations;
}

function strongestAttributeTag(data) {
  let best = null;
  for (const definition of ATTRIBUTE_DEFINITIONS) {
    const value = Number(data.attributes[definition.key] || 0);
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

function renderHero(data) {
  const entry = selectedRosterEntry();
  const race = RACES[data.identity.volk] || RACES[""];
  const displayName = String(data.identity.character_name || "").trim() || "Unbenannter Charakter";
  const tags = [
    race.label,
    data.identity.concept || "Konzept offen",
    strongestAttributeTag(data),
    strongestDisciplineTag(data),
  ];

  builderHeadline.textContent = displayName;
  builderHeroTitle.textContent = displayName;
  builderHeroSubtitle.textContent = `${race.label} | ${data.identity.faction || "Fraktion offen"} | ${data.identity.origin || "Herkunft offen"}`;
  builderHeroTags.innerHTML = "";
  for (const tagText of tags) {
    const pill = document.createElement("span");
    pill.className = "character-pill";
    pill.textContent = tagText;
    builderHeroTags.appendChild(pill);
  }
  builderPlayerName.value = entry?.username || "";
}

function buildStepStatus(index, data) {
  const disciplinePoints = totalDisciplinePoints(data);
  const violations = disciplineViolations(data);
  const attributePattern = buildAttributePattern(data);
  const allComplexitiesOne = COMBAT_DISCIPLINES.every((definition) => Number(data.complexities[definition.key] || 1) === 1);

  if (index === 0) {
    const complete = Boolean(String(data.identity.character_name || "").trim() && String(data.identity.concept || "").trim());
    return { tone: complete ? "ok" : "warn", text: complete ? "Fertig" : "Name und Konzept fehlen" };
  }
  if (index === 1) {
    const complete = Boolean(data.identity.volk);
    return { tone: complete ? "ok" : "warn", text: complete ? "Volk gewaehlt" : "Volk offen" };
  }
  if (index === 2) {
    const complete = attributePattern === "3 / 2 / 2 / 1 / 1";
    return { tone: complete ? "ok" : "warn", text: complete ? "Startwerte passen" : "Startverteilung fehlt" };
  }
  if (index === 3) {
    const complete = disciplinePoints === 10;
    return { tone: complete ? "ok" : "warn", text: complete ? "Alle 10 Punkte verteilt" : "10 Punkte verteilen" };
  }
  if (index === 4) {
    const hpCurrent = Number(data.combat.hp_current || 0);
    const complete = Number(data.identity.level || 1) >= 1 && allComplexitiesOne && hpCurrent >= 0 && hpCurrent <= calculateMaxHp(data);
    return { tone: complete ? "ok" : "warn", text: complete ? "Kampfwerte gesetzt" : "Level, Komplexitaet oder LP pruefen" };
  }
  const overall = Boolean(data.identity.volk) && attributePattern === "3 / 2 / 2 / 1 / 1" && disciplinePoints === 10 && !violations.length;
  return { tone: overall ? "ok" : "warn", text: overall ? "Bereit fuer den Bogen" : "Abschluss offen" };
}

function renderStepList() {
  builderStepList.innerHTML = "";
  STEP_DEFINITIONS.forEach((definition, index) => {
    const stepStatus = buildStepStatus(index, currentSheetData);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "builder-step-button";
    if (index === currentStepIndex) {
      button.classList.add("active");
    }
    button.classList.add(`builder-step-${stepStatus.tone}`);

    const title = document.createElement("strong");
    title.textContent = `${index + 1}. ${definition.title}`;

    const meta = document.createElement("span");
    meta.className = "builder-step-button-meta";
    meta.textContent = stepStatus.text;

    button.append(title, meta);
    button.disabled = !canNavigateToStep(index);
    button.addEventListener("click", () => {
      if (!canNavigateToStep(index)) {
        return;
      }
      setCurrentStep(index, { scrollToTop: true });
    });
    builderStepList.appendChild(button);
  });
}

function scrollBuilderToTop() {
  if (builderFrame) {
    builderFrame.scrollTo({ top: 0, behavior: "smooth" });
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function validationMessageText(result) {
  if (result.valid) {
    if (currentStepIndex === STEP_DEFINITIONS.length - 1) {
      return "Der Builder ist vollstaendig. Du kannst jetzt in den Charakterbogen wechseln.";
    }
    return "Dieser Schritt ist vollstaendig. Weiter ist freigegeben.";
  }
  return `Vor dem Weitergehen fehlt noch: ${result.errors.join(" | ")}`;
}

function clearInlineValidationUi() {
  builderRoot.querySelectorAll(".builder-field-invalid").forEach((element) => {
    element.classList.remove("builder-field-invalid");
  });
  builderRoot.querySelectorAll(".builder-input-invalid").forEach((element) => {
    element.classList.remove("builder-input-invalid");
  });
  builderRoot.querySelectorAll(".builder-field-error-message, .builder-group-error").forEach((element) => {
    element.remove();
  });
  builderRoot.querySelectorAll(".builder-group-invalid").forEach((element) => {
    element.classList.remove("builder-group-invalid");
  });
}

function getFieldWrapper(field) {
  return field.closest("label, .character-complexity-card, .character-score-card, .character-discipline-card, .draw-control");
}

function appendFieldError(wrapper, path, message) {
  const errorElement = document.createElement("p");
  errorElement.className = "builder-field-error-message";
  errorElement.dataset.builderErrorFor = path;
  errorElement.textContent = message;
  wrapper.appendChild(errorElement);
}

function appendGroupError(container, message) {
  container.classList.add("builder-group-invalid");
  const errorElement = document.createElement("p");
  errorElement.className = "builder-group-error";
  errorElement.textContent = message;
  container.insertAdjacentElement("afterend", errorElement);
}

function renderCurrentStepFieldValidation(validationResult) {
  clearInlineValidationUi();

  Object.entries(validationResult.fieldErrors || {}).forEach(([path, messages]) => {
    const field = builderRoot.querySelector(`[data-path="${path}"]`);
    if (!field || field.type === "hidden") {
      return;
    }
    const wrapper = getFieldWrapper(field);
    if (!wrapper) {
      return;
    }
    wrapper.classList.add("builder-field-invalid");
    field.classList.add("builder-input-invalid");
    appendFieldError(wrapper, path, messages.join(" | "));
  });

  const groupTargets = {
    race: builderRaceGrid,
    attributes: builderAttributeGrid,
    disciplines: builderGeneralDisciplineGrid,
    combat: builderCombatValuesGrid,
    review: builderReviewGrid,
  };

  Object.entries(validationResult.groupErrors || {}).forEach(([groupKey, messages]) => {
    const target = groupTargets[groupKey];
    if (!target) {
      return;
    }
    appendGroupError(target, messages.join(" | "));
  });
}

function renderCurrentStepControls(options = {}) {
  const { scrollToTop = false } = options;
  const currentValidation = validateStep(currentStepIndex, currentSheetData);
  const stepDefinition = STEP_DEFINITIONS[currentStepIndex];
  builderProgressTitle.textContent = `Schritt ${currentStepIndex + 1}: ${stepDefinition.title}`;
  builderProgressCounter.textContent = `${currentStepIndex + 1} / ${STEP_DEFINITIONS.length}`;
  builderSaveBadge.textContent = `Schritt ${currentStepIndex + 1} von ${STEP_DEFINITIONS.length}`;
  builderProgressFill.style.width = `${((currentStepIndex + 1) / STEP_DEFINITIONS.length) * 100}%`;
  builderBackButton.disabled = currentStepIndex === 0 || !canEditSelectedSheet();
  builderNextButton.textContent = currentStepIndex === STEP_DEFINITIONS.length - 1 ? "Zum Charakterbogen" : "Weiter";
  builderNextButton.disabled = !canEditSelectedSheet() || !currentValidation.valid;
  builderStepValidationMessage.textContent = validationMessageText(currentValidation);
  builderStepValidationMessage.classList.toggle("character-status-error", !currentValidation.valid);
  renderStepNotes();
  renderStepList();
  renderCurrentStepFieldValidation(currentValidation);
  if (scrollToTop) {
    scrollBuilderToTop();
  }
}

function renderDerivedCombatValues() {
  const hpMaxField = builderRoot.querySelector('[data-path="combat.hp_max"]');
  const hpCurrentField = builderRoot.querySelector('[data-path="combat.hp_current"]');
  const normalizedCurrentHp = Number(currentSheetData.combat.hp_current || 0);
  if (hpMaxField) {
    hpMaxField.value = String(calculateMaxHp(currentSheetData));
  }
  if (hpCurrentField) {
    const numericFieldValue = Number(hpCurrentField.value);
    if (hpCurrentField.value === "" || !Number.isFinite(numericFieldValue) || numericFieldValue !== normalizedCurrentHp) {
      hpCurrentField.value = String(normalizedCurrentHp);
    }
  }
  if (builderHpFormula) {
    builderHpFormula.textContent = `Automatisch: ${maxHpFormulaDetails(currentSheetData)}`;
  }
}

function setCurrentStep(index, options = {}) {
  currentStepIndex = Math.max(0, Math.min(index, STEP_DEFINITIONS.length - 1));
  builderSteps.forEach((stepElement, stepIndex) => {
    stepElement.classList.toggle("hidden", stepIndex !== currentStepIndex);
  });
  renderCurrentStepControls(options);
}

function validateStep(stepIndex, data) {
  const errors = [];
  const fieldErrors = {};
  const groupErrors = {};
  const level = Math.max(1, Number(data.identity.level || 1));
  const attributePattern = buildAttributePattern(data);
  const disciplinePoints = totalDisciplinePoints(data);
  const violations = disciplineViolations(data);
  const allComplexitiesOne = COMBAT_DISCIPLINES.every((definition) => Number(data.complexities[definition.key] || 1) === 1);
  const hpCurrent = Number(data.combat.hp_current || 0);
  const hpMax = calculateMaxHp(data);

  const addFieldError = (path, message) => {
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(message);
  };

  const addGroupError = (groupKey, message) => {
    if (!groupErrors[groupKey]) {
      groupErrors[groupKey] = [];
    }
    groupErrors[groupKey].push(message);
  };

  if (stepIndex === 0) {
    if (!String(data.identity.character_name || "").trim()) {
      errors.push("Charaktername fehlt");
      addFieldError("identity.character_name", "Charaktername fehlt");
    }
    if (!String(data.identity.concept || "").trim()) {
      errors.push("Konzept fehlt");
      addFieldError("identity.concept", "Konzept fehlt");
    }
    if (!String(data.identity.faction || "").trim()) {
      errors.push("Fraktion oder Rolle fehlt");
      addFieldError("identity.faction", "Fraktion oder Rolle fehlt");
    }
    if (!String(data.identity.origin || "").trim()) {
      errors.push("Herkunft fehlt");
      addFieldError("identity.origin", "Herkunft fehlt");
    }
    if (!String(data.identity.motivation || "").trim()) {
      errors.push("Motivation fehlt");
      addFieldError("identity.motivation", "Motivation fehlt");
    }
    if (!String(data.identity.background || "").trim()) {
      errors.push("Hintergrund fehlt");
      addFieldError("identity.background", "Hintergrund fehlt");
    }
  }

  if (stepIndex === 1 && !data.identity.volk) {
    errors.push("Ein Volk muss gewaehlt werden");
    addGroupError("race", "Ein Volk muss gewaehlt werden");
  }

  if (stepIndex === 2 && attributePattern !== "3 / 2 / 2 / 1 / 1") {
    errors.push(`Die Startattribute muessen 3 / 2 / 2 / 1 / 1 ergeben, aktuell ${attributePattern}`);
    ATTRIBUTE_DEFINITIONS.forEach((definition) => {
      addFieldError(`attributes.${definition.key}`, "Startverteilung muss 3 / 2 / 2 / 1 / 1 ergeben");
    });
    addGroupError("attributes", `Aktuell ${attributePattern}. Erlaubt ist 3 / 2 / 2 / 1 / 1.`);
  }

  if (stepIndex === 3) {
    if (disciplinePoints !== 10) {
      errors.push(`Es muessen genau 10 Disziplinpunkte verteilt sein, aktuell ${disciplinePoints}`);
      addGroupError("disciplines", `Es muessen genau 10 Disziplinpunkte verteilt sein, aktuell ${disciplinePoints}.`);
    }
    for (const definition of COMBAT_DISCIPLINES) {
      const value = Number(data.combat_disciplines[definition.key] || 0);
      const limit = Number(data.attributes[definition.attribute] || 0);
      if (value > limit) {
        addFieldError(`combat_disciplines.${definition.key}`, `Hoeher als ${definition.attributeLabel} ${limit}`);
      }
    }
    for (const definition of GENERAL_DISCIPLINES) {
      const value = Number(data.general_disciplines[definition.key] || 0);
      const limit = Number(data.attributes[definition.attribute] || 0);
      if (value > limit) {
        addFieldError(`general_disciplines.${definition.key}`, `Hoeher als ${definition.attributeLabel} ${limit}`);
      }
    }
  }

  if (stepIndex === 4) {
    if (level !== 1) {
      errors.push("Ein neuer Charakter startet im Builder auf Level 1");
      addFieldError("identity.level", "Neue Charaktere starten hier auf Level 1");
    }
    if (!allComplexitiesOne) {
      errors.push("Alle Komplexitaeten muessen beim Start auf 1 stehen");
      COMBAT_DISCIPLINES.forEach((definition) => {
        if (Number(data.complexities[definition.key] || 1) !== 1) {
          addFieldError(`complexities.${definition.key}`, "Startwert muss 1 sein");
        }
      });
    }
    if (hpMax <= 0) {
      errors.push("Max-Lebenspunkte koennen erst aus Koerper und Lebensbonus berechnet werden");
      addGroupError("combat", "Koerper und Volk muessen eine positive Max-LP ergeben.");
    }
    if (hpCurrent < 0 || hpCurrent > hpMax) {
      errors.push("Lebenspunkte aktuell muessen zwischen 0 und den Max-Lebenspunkten liegen");
      addFieldError("combat.hp_current", "Muss zwischen 0 und den Max-Lebenspunkten liegen");
    }
    if (!String(data.equipment.weapon_type || "").trim()) {
      errors.push("Eine Waffenart muss gewaehlt werden");
      addFieldError("equipment.weapon_type", "Eine Waffenart muss gewaehlt werden");
    }
    if (!String(data.equipment.weapon_name || "").trim()) {
      errors.push("Ein Waffenname fehlt");
      addFieldError("equipment.weapon_name", "Ein Waffenname fehlt");
    }
    if (data.equipment.offhand_type === "fokus" && !String(data.equipment.focus_type || "").trim()) {
      errors.push("Wenn die Offhand ein Fokus ist, muss eine Fokusart gewaehlt werden");
      addFieldError("equipment.focus_type", "Bei Offhand Fokus muss eine Fokusart gewaehlt werden");
    }
  }

  if (stepIndex === 5) {
    for (let previousStepIndex = 0; previousStepIndex < 5; previousStepIndex += 1) {
      const previousResult = validateStep(previousStepIndex, data);
      if (!previousResult.valid) {
        errors.push(...previousResult.errors);
      }
    }
    if (violations.length) {
      errors.push(...violations);
      addGroupError("review", violations.join(" | "));
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    fieldErrors,
    groupErrors,
  };
}

function canNavigateToStep(targetStepIndex) {
  if (targetStepIndex <= currentStepIndex) {
    return true;
  }
  for (let stepIndex = 0; stepIndex < targetStepIndex; stepIndex += 1) {
    if (!validateStep(stepIndex, currentSheetData).valid) {
      return false;
    }
  }
  return true;
}

function renderStepNotes() {
  const notes = STEP_DEFINITIONS[currentStepIndex].notes;
  builderStepNotes.innerHTML = "";
  for (const noteText of notes) {
    const paragraph = document.createElement("p");
    paragraph.textContent = noteText;
    builderStepNotes.appendChild(paragraph);
  }
}

function createNumericCard(path, label, hint, min = 0, max = 5) {
  const labelElement = document.createElement("label");
  labelElement.className = "character-score-card";

  const title = document.createElement("span");
  title.className = "file-meta";
  title.textContent = label;

  const input = document.createElement("input");
  input.className = "character-score-input";
  input.type = "number";
  input.min = String(min);
  input.max = String(max);
  input.step = "1";
  input.dataset.path = path;

  const hintElement = document.createElement("span");
  hintElement.className = "character-score-hint";
  hintElement.textContent = hint;

  labelElement.append(title, input, hintElement);
  return labelElement;
}

function renderAttributeGrid() {
  builderAttributeGrid.innerHTML = "";
  for (const definition of ATTRIBUTE_DEFINITIONS) {
    builderAttributeGrid.appendChild(
      createNumericCard(`attributes.${definition.key}`, definition.label, definition.hint, 0, 5),
    );
  }
}

function createDisciplineCard(definition, prefix) {
  const label = document.createElement("label");
  label.className = "character-discipline-card";
  label.dataset.linkedAttribute = definition.attribute;
  label.dataset.linkedAttributeLabel = definition.attributeLabel;

  const header = document.createElement("div");
  header.className = "character-discipline-header";

  const title = document.createElement("span");
  title.className = "character-discipline-title";
  title.textContent = definition.label;

  const meta = document.createElement("span");
  meta.className = "character-discipline-meta";
  meta.dataset.disciplineAttributeMeta = definition.attribute;
  meta.dataset.disciplineAttributeLabel = definition.attributeLabel;
  meta.textContent = `Typisch: ${definition.attributeLabel}`;

  header.append(title, meta);

  const input = document.createElement("input");
  input.className = "sidebar-input character-number";
  input.type = "number";
  input.min = "0";
  input.max = "3";
  input.step = "1";
  input.dataset.path = `${prefix}.${definition.key}`;

  const hint = document.createElement("p");
  hint.className = "character-discipline-hint";
  hint.textContent = definition.note || `Alternativen: ${definition.alternatives.join(", ")}`;

  label.append(header, input, hint);
  return label;
}

function renderDisciplineGrids() {
  builderCombatDisciplineGrid.innerHTML = "";
  COMBAT_DISCIPLINES.forEach((definition) => {
    builderCombatDisciplineGrid.appendChild(createDisciplineCard(definition, "combat_disciplines"));
  });

  builderGeneralDisciplineGrid.innerHTML = "";
  GENERAL_DISCIPLINES.forEach((definition) => {
    builderGeneralDisciplineGrid.appendChild(createDisciplineCard(definition, "general_disciplines"));
  });
}

function renderComplexityGrid() {
  builderComplexityGrid.innerHTML = "";
  COMBAT_DISCIPLINES.forEach((definition) => {
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
    builderComplexityGrid.appendChild(label);
  });
}

function renderDisciplineAttributeSummary() {
  builderDisciplineAttributeSummary.innerHTML = "";
  ATTRIBUTE_DEFINITIONS.forEach((definition) => {
    const article = document.createElement("article");
    article.className = "builder-attribute-summary-card";

    const title = document.createElement("span");
    title.className = "file-meta";
    title.textContent = definition.label;

    const body = document.createElement("strong");
    body.textContent = String(Number(currentSheetData.attributes[definition.key] || 0));

    article.append(title, body);
    builderDisciplineAttributeSummary.appendChild(article);
  });
}

function updateDisciplineAttributeMeta() {
  builderRoot.querySelectorAll("[data-discipline-attribute-meta]").forEach((element) => {
    const attributeKey = element.dataset.disciplineAttributeMeta || "";
    const attributeLabel = element.dataset.disciplineAttributeLabel || "";
    const currentValue = Number(currentSheetData.attributes[attributeKey] || 0);
    element.textContent = `Typisch: ${attributeLabel} | Aktuell: ${currentValue}`;
  });
}

function renderAttackReference() {
  builderAttackReferenceGrid.innerHTML = "";
  ATTACK_TIERS.forEach((attackTier) => {
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
    builderAttackReferenceGrid.appendChild(article);
  });
}

function renderRaceCards() {
  builderRaceGrid.innerHTML = "";
  Object.entries(RACES)
    .filter(([key]) => key)
    .forEach(([key, race]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "builder-race-button";
      if (currentSheetData.identity.volk === key) {
        button.classList.add("active");
      }

      const title = document.createElement("strong");
      title.textContent = race.label;

      const meta = document.createElement("span");
      meta.className = "builder-race-meta";
      meta.textContent = `LP +${race.lifeBonus} | ${race.resistances.join(" | ")}`;

      const note = document.createElement("span");
      note.className = "builder-race-note";
      note.textContent = race.note;

      button.append(title, meta, note);
      button.addEventListener("click", () => {
        if (!canEditSelectedSheet()) {
          return;
        }
        builderSelectedRaceInput.value = key;
        currentSheetData.identity.volk = key;
        renderBuilderUi();
        scheduleAutosave();
      });
      builderRaceGrid.appendChild(button);
    });
}

function renderRaceInfo() {
  const race = raceDefinition(currentSheetData.identity.volk);
  const cards = [
    { title: "Lebensbonus", body: race.lifeBonus ? `+${race.lifeBonus}` : "0" },
    { title: "Resistenzen / Schwaechen", body: race.resistances.length ? race.resistances.join(" | ") : "Noch kein Volk gewaehlt" },
    { title: "Passive Faehigkeiten", body: race.passives.length ? race.passives.join(" | ") : "Noch keine passiven Faehigkeiten" },
    { title: "Hinweis", body: race.note },
  ];
  builderRaceInfoGrid.innerHTML = "";
  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "character-race-card";

    const title = document.createElement("span");
    title.className = "file-meta";
    title.textContent = card.title;

    const body = document.createElement("strong");
    body.textContent = card.body;

    article.append(title, body);
    builderRaceInfoGrid.appendChild(article);
  });
}

function reviewCards(data) {
  const race = raceDefinition(data.identity.volk);
  const topDisciplines = [
    ...COMBAT_DISCIPLINES.map((definition) => ({ label: definition.label, value: Number(data.combat_disciplines[definition.key] || 0) })),
    ...GENERAL_DISCIPLINES.map((definition) => ({ label: definition.label, value: Number(data.general_disciplines[definition.key] || 0) })),
  ]
    .filter((entry) => entry.value > 0)
    .sort((left, right) => right.value - left.value)
    .slice(0, 6)
    .map((entry) => `${entry.label} ${entry.value}`);

  return [
    {
      title: "Identitaet",
      body: `${String(data.identity.character_name || "").trim() || "Unbenannt"} | ${data.identity.concept || "Konzept offen"} | Level ${Number(data.identity.level || 1)}`,
    },
    {
      title: "Volk",
      body: `${race.label} | LP +${race.lifeBonus} | ${race.passives.join(" | ") || "keine Passive"}`,
    },
    {
      title: "Attribute",
      body: buildAttributePattern(data),
    },
    {
      title: "Top-Disziplinen",
      body: topDisciplines.length ? topDisciplines.join(" | ") : "Noch keine Disziplinen gesetzt",
    },
    {
      title: "Ausruestung",
      body: `${labelForSelectValue(WEAPON_TYPES, data.equipment.weapon_type)} | ${data.equipment.weapon_name || "Waffe offen"} | ${labelForSelectValue(OFFHAND_TYPES, data.equipment.offhand_type)}`,
    },
    {
      title: "Spielbereit",
      body: `Disziplinpunkte ${totalDisciplinePoints(data)} / 10 | Initiativeprobe: Instinkt + Wahrnehmung`,
    },
  ];
}

function renderReviewGrid() {
  builderReviewGrid.innerHTML = "";
  reviewCards(currentSheetData).forEach((card) => {
    const article = document.createElement("article");
    article.className = "character-sheet-summary-card";

    const title = document.createElement("span");
    title.className = "file-meta";
    title.textContent = card.title;

    const body = document.createElement("strong");
    body.textContent = card.body;

    article.append(title, body);
    builderReviewGrid.appendChild(article);
  });
}

function buildValidationItems(data) {
  const items = [];
  const level = Math.max(1, Number(data.identity.level || 1));
  const disciplinePoints = totalDisciplinePoints(data);
  const attributePattern = buildAttributePattern(data);
  const violations = disciplineViolations(data);
  const allComplexitiesOne = COMBAT_DISCIPLINES.every((definition) => Number(data.complexities[definition.key] || 1) === 1);

  items.push({
    tone: String(data.identity.character_name || "").trim() ? "ok" : "warn",
    text: String(data.identity.character_name || "").trim() ? "Charaktername gesetzt." : "Charaktername fehlt noch.",
  });
  items.push({
    tone: data.identity.volk ? "ok" : "warn",
    text: data.identity.volk ? `Volk gewaehlt: ${(RACES[data.identity.volk] || RACES[""]).label}.` : "Volk fehlt noch.",
  });
  items.push({
    tone: level === 1 && attributePattern === "3 / 2 / 2 / 1 / 1" ? "ok" : level === 1 ? "warn" : "info",
    text: level === 1
      ? (attributePattern === "3 / 2 / 2 / 1 / 1"
        ? "Attributverteilung entspricht der Startregel 3 / 2 / 2 / 1 / 1."
        : `Attributverteilung weicht von 3 / 2 / 2 / 1 / 1 ab: ${attributePattern}.`)
      : `Level ${level}: Startverteilung ist fuer Level 1 gedacht, aktuelle Werte ${attributePattern}.`,
  });
  items.push({
    tone: level === 1 && disciplinePoints === 10 && !violations.length ? "ok" : level === 1 ? "warn" : "info",
    text: level === 1
      ? (disciplinePoints === 10 && !violations.length
        ? "Disziplinen entsprechen 10 Startpunkten ohne Regelkonflikt."
        : `Disziplinpunkte: ${disciplinePoints} / 10. ${violations.length ? violations.join(" | ") : "Verteilung pruefen."}`)
      : `Level ${level}: aktuelle Disziplinpunkte ${disciplinePoints}.`,
  });
  items.push({
    tone: level === 1 && allComplexitiesOne ? "ok" : level === 1 ? "warn" : "info",
    text: level === 1
      ? (allComplexitiesOne ? "Alle Komplexitaeten stehen auf dem Startwert 1." : "Mindestens eine Komplexitaet weicht vom Startwert 1 ab.")
      : "Komplexitaeten koennen ausserhalb der Erschaffung bewusst angepasst werden.",
  });
  items.push({
    tone: calculateMaxHp(data) > 0 ? "ok" : "warn",
    text: calculateMaxHp(data) > 0
      ? `Max-Lebenspunkte werden automatisch berechnet: ${maxHpFormulaDetails(data)}.`
      : "Max-Lebenspunkte ergeben sich aus Koerper und Lebensbonus, aktuell noch 0.",
  });
  return items;
}

function renderValidation() {
  const items = buildValidationItems(currentSheetData);
  builderValidationList.innerHTML = "";

  let overallTone = "ok";
  if (items.some((item) => item.tone === "warn")) {
    overallTone = "warn";
  }
  if (items.some((item) => item.tone === "error")) {
    overallTone = "error";
  }
  if (!items.some((item) => item.tone === "warn" || item.tone === "error") && items.some((item) => item.tone === "info")) {
    overallTone = "info";
  }

  builderValidationStatus.textContent = overallTone === "ok"
    ? "Regelkonform"
    : overallTone === "warn"
      ? "Unvollstaendig"
      : overallTone === "info"
        ? "Hinweise aktiv"
        : "Regelkonflikt";

  items.forEach((item) => {
    const paragraph = document.createElement("p");
    paragraph.className = `character-validation-item character-validation-${item.tone}`;
    paragraph.textContent = item.text;
    builderValidationList.appendChild(paragraph);
  });
}

function renderSummary() {
  const entry = selectedRosterEntry();
  const race = RACES[currentSheetData.identity.volk] || RACES[""];
  builderSummaryProject.textContent = rosterPayload?.project?.name || "-";
  builderSummaryPlayer.textContent = entry?.username || "-";
  builderSummaryRace.textContent = race.label;
  builderSummaryDisciplines.textContent = `${totalDisciplinePoints(currentSheetData)} / 10`;
  builderSummaryAttributes.textContent = buildAttributePattern(currentSheetData);
  builderAttributePattern.textContent = buildAttributePattern(currentSheetData);
  builderDisciplineBudget.textContent = String(10 - totalDisciplinePoints(currentSheetData));
}

function renderBuilderUi() {
  renderHero(currentSheetData);
  renderRaceCards();
  renderRaceInfo();
  renderDisciplineAttributeSummary();
  updateDisciplineAttributeMeta();
  renderReviewGrid();
  renderSummary();
  renderDerivedCombatValues();
  renderValidation();
  renderCurrentStepControls();
}

function renderStaticUi() {
  renderSelectOptions(builderWeaponTypeSelect, WEAPON_TYPES);
  renderSelectOptions(builderOffhandTypeSelect, OFFHAND_TYPES);
  renderSelectOptions(builderFocusTypeSelect, FOCUS_TYPES);
  renderAttributeGrid();
  renderDisciplineGrids();
  renderComplexityGrid();
  renderAttackReference();
}

function renderRoster() {
  builderRosterList.innerHTML = "";
  const entries = Array.isArray(rosterPayload?.sheets) ? rosterPayload.sheets : [];
  if (!entries.length) {
    setRosterStatus("Keine Spieler fuer dieses Projekt vorhanden.", "error");
    return;
  }

  setRosterStatus(
    rosterPayload?.viewer?.can_manage_all
      ? `${entries.length} Spieler im Projekt.`
      : "Dein eigener Builder-Bogen fuer dieses Projekt.",
  );

  entries.forEach((entry) => {
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
    state.textContent = entry.has_sheet ? "Bogen vorhanden" : "Noch kein Bogen";

    header.append(name, state);

    const subtitle = document.createElement("div");
    subtitle.className = "character-roster-meta";
    subtitle.textContent = entry.character_name
      ? `${entry.character_name} | ${entry.volk || "Volk offen"} | Stufe ${entry.level || 1}`
      : `Letzte Aenderung: ${formatTimestamp(entry.updated_at)}`;

    button.append(header, subtitle);
    button.addEventListener("click", async () => {
      if (entry.user_id === selectedUserId) {
        return;
      }
      await selectUser(entry.user_id);
    });
    builderRosterList.appendChild(button);
  });
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
  entry.has_sheet = true;
}

function resetAutosaveTimer() {
  if (autosaveTimerId) {
    window.clearTimeout(autosaveTimerId);
    autosaveTimerId = 0;
  }
}

async function saveSheet(reason = "Gespeichert.") {
  if (!selectedUserId || !rosterPayload?.project?.id || !canEditSelectedSheet()) {
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

  currentSheetData = dirtySinceLastSave ? collectFormData() : normalizeSheetData(response.sheet?.data || payloadData);
  updateRosterEntryFromData(currentSheetData, response.sheet || {});
  renderRoster();
  renderBuilderUi();
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
  if (isLoadingSheet || !canEditSelectedSheet()) {
    return;
  }
  currentSheetData = collectFormData();
  dirtySinceLastSave = true;
  renderBuilderUi();
  setStorageStatus("Aenderungen ausstehend ...");
  resetAutosaveTimer();
  autosaveTimerId = window.setTimeout(() => {
    void flushAutosave();
  }, 700);
}

async function loadRoster(preferredUserId = "") {
  builderProjectName.textContent = "Projekt wird geladen...";
  try {
    rosterPayload = await fetchJson("/api/character-sheets");
    builderProjectName.textContent = rosterPayload.project?.name || "Unbekanntes Projekt";
    builderProjectMeta.textContent = `Projekt-ID ${rosterPayload.project?.id || "-"}. Speicherung erfolgt direkt im projektgebundenen Charakterbogen.`;
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
      renderBuilderUi();
      return;
    }

    await loadSheet(nextSelectedUserId);
  } catch (error) {
    rosterPayload = null;
    selectedUserId = "";
    builderProjectName.textContent = "Kein Projekt verfuegbar";
    builderProjectMeta.textContent = error.message || "Der Builder konnte nicht geladen werden.";
    showEmptyState(error.message || "Der Builder konnte nicht geladen werden.");
    setStorageStatus("Keine Speicherung moeglich.", "error");
    setRosterStatus(error.message || "Der Builder konnte nicht geladen werden.", "error");
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
  setStorageStatus("Builder-Daten werden geladen ...");

  try {
    const response = await fetchJson(`/api/character-sheets/${encodeURIComponent(userId)}?project_id=${encodeURIComponent(rosterPayload.project.id)}`);
    currentSheetData = normalizeSheetData(response.sheet?.data || {});
    fillForm(currentSheetData);
    showBuilderState();
    renderBuilderUi();
    setCurrentStep(currentStepIndex);
    setStorageStatus(
      response.sheet?.has_sheet
        ? `Builder-Daten geladen. Letzte Speicherung: ${formatTimestamp(response.sheet.updated_at)}.`
        : "Noch kein gespeicherter Bogen vorhanden. Der Builder legt ihn beim ersten Speichern an.",
    );
  } catch (error) {
    showEmptyState(error.message || "Der Builder konnte nicht geladen werden.");
    setStorageStatus(error.message || "Der Builder konnte nicht geladen werden.", "error");
  } finally {
    isLoadingSheet = false;
  }
}

async function selectUser(userId) {
  const saveSucceeded = await flushAutosave("Vor dem Wechsel gespeichert.");
  if (!saveSucceeded) {
    return;
  }
  await loadSheet(userId);
}

async function resetCurrentSheet() {
  const characterName = String(currentSheetData.identity.character_name || "").trim() || "diesen Builder-Bogen";
  if (!window.confirm(`Soll "${characterName}" wirklich geleert werden?`)) {
    return;
  }
  currentSheetData = deepClone(DEFAULT_SHEET_DATA);
  fillForm(currentSheetData);
  renderBuilderUi();
  setCurrentStep(0);
  dirtySinceLastSave = true;
  await flushAutosave("Builder-Bogen geleert.");
}

function preferredSheetPath() {
  const routeMode = window.sessionStorage.getItem("eldran-route-mode");
  return routeMode === "remote" ? "/Charakterbogen" : "/charakterbogen";
}

function bindEvents() {
  builderRoot.addEventListener("input", () => {
    scheduleAutosave();
  });
  builderRoot.addEventListener("change", () => {
    scheduleAutosave();
  });

  builderProjectRefreshButton.addEventListener("click", async () => {
    const saveSucceeded = await flushAutosave("Vor dem Neuladen gespeichert.");
    if (!saveSucceeded) {
      return;
    }
    await loadRoster(selectedUserId);
  });

  builderBackButton.addEventListener("click", () => {
    setCurrentStep(currentStepIndex - 1, { scrollToTop: true });
  });

  builderNextButton.addEventListener("click", async () => {
    const currentValidation = validateStep(currentStepIndex, collectFormData());
    if (!currentValidation.valid) {
      currentSheetData = collectFormData();
      renderBuilderUi();
      return;
    }
    if (currentStepIndex < STEP_DEFINITIONS.length - 1) {
      setCurrentStep(currentStepIndex + 1, { scrollToTop: true });
      return;
    }
    const saveSucceeded = await flushAutosave("Builder abgeschlossen.");
    if (!saveSucceeded) {
      return;
    }
    window.location.href = preferredSheetPath();
  });

  builderResetButton.addEventListener("click", async () => {
    await resetCurrentSheet();
  });

  window.addEventListener("beforeunload", (event) => {
    if (dirtySinceLastSave) {
      event.preventDefault();
      event.returnValue = "";
    }
  });
}

async function initializeBuilderPage() {
  renderStaticUi();
  bindEvents();
  renderBuilderUi();
  setCurrentStep(0);
  setEditingEnabled(false);
  currentUser = await initializeAuthUi({ required: true });
  if (!currentUser) {
    return;
  }
  await loadRoster();
}

void initializeBuilderPage();
