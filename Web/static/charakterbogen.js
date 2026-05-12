const characterSheetForm = document.getElementById("characterSheetForm");
const sheetEmptyState = document.getElementById("sheetEmptyState");
const sheetProjectName = document.getElementById("sheetProjectName");
const sheetProjectMeta = document.getElementById("sheetProjectMeta");
const sheetProjectRefreshButton = document.getElementById("sheetProjectRefreshButton");
const sheetRosterList = document.getElementById("sheetRosterList");
const sheetRosterStatus = document.getElementById("sheetRosterStatus");
const sheetNpcCreateWrap = document.getElementById("sheetNpcCreateWrap");
const sheetNpcNameInput = document.getElementById("sheetNpcNameInput");
const sheetNpcRoleSelect = document.getElementById("sheetNpcRoleSelect");
const sheetNpcCreateButton = document.getElementById("sheetNpcCreateButton");
const sheetStorageStatus = document.getElementById("sheetStorageStatus");
const sheetRulesetKicker = document.getElementById("sheetRulesetKicker");
const sheetRulesetIntro = document.getElementById("sheetRulesetIntro");
const novaGaiaDataActions = document.getElementById("novaGaiaDataActions");
const dndPdfActions = document.getElementById("dndPdfActions");
const dndPdfInput = document.getElementById("dndPdfInput");
const dndSheetViewLink = document.getElementById("dndSheetViewLink");
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

const DND_SKILL_ABILITY_GROUPS = [
  { key: "STR", label: "Staerke" },
  { key: "DEX", label: "Geschicklichkeit" },
  { key: "CON", label: "Konstitution" },
  { key: "INT", label: "Intelligenz" },
  { key: "WIS", label: "Weisheit" },
  { key: "CHA", label: "Charisma" },
  { key: "", label: "Ohne Attribut" },
];

const DND_ABILITY_LABELS = {
  strength: ["STAERKE", "STR"],
  dexterity: ["GESCHICKLICHKEIT", "DEX"],
  constitution: ["KONSTITUTION", "CON"],
  intelligence: ["INTELLIGENZ", "INT"],
  wisdom: ["WEISHEIT", "WIS"],
  charisma: ["CHARISMA", "CHA"],
};

const DND_SKILL_LABELS = {
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

const DND_PROFICIENCY_BY_LEVEL = [
  2, 2, 2, 2,
  3, 3, 3, 3,
  4, 4, 4, 4,
  5, 5, 5, 5,
  6, 6, 6, 6,
];

const DND_FULL_CASTER_SLOTS = [
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

const DND_PACT_MAGIC_BY_LEVEL = [
  { slots: 1, level: 1 },
  { slots: 2, level: 1 },
  { slots: 2, level: 2 },
  { slots: 2, level: 2 },
  { slots: 2, level: 3 },
  { slots: 2, level: 3 },
  { slots: 2, level: 4 },
  { slots: 2, level: 4 },
  { slots: 2, level: 5 },
  { slots: 2, level: 5 },
  { slots: 3, level: 5 },
  { slots: 3, level: 5 },
  { slots: 3, level: 5 },
  { slots: 3, level: 5 },
  { slots: 3, level: 5 },
  { slots: 3, level: 5 },
  { slots: 4, level: 5 },
  { slots: 4, level: 5 },
  { slots: 4, level: 5 },
  { slots: 4, level: 5 },
];

const DND_CLASS_RULES = {
  barbarian: { labels: ["barbarian", "barbar", "barbarin"], hitDie: 12, caster: "none", asi: [4, 8, 12, 16, 19] },
  bard: { labels: ["bard", "barde", "bardin"], hitDie: 8, caster: "full", asi: [4, 8, 12, 16, 19] },
  cleric: { labels: ["cleric", "kleriker", "klerikerin"], hitDie: 8, caster: "full", asi: [4, 8, 12, 16, 19] },
  druid: { labels: ["druid", "druide", "druidin"], hitDie: 8, caster: "full", asi: [4, 8, 12, 16, 19] },
  fighter: { labels: ["fighter", "kaempfer", "kämpfer", "kaempferin", "kämpferin"], hitDie: 10, caster: "none", asi: [4, 6, 8, 12, 14, 16, 19] },
  monk: { labels: ["monk", "moench", "mönch", "moenchin", "mönchin"], hitDie: 8, caster: "none", asi: [4, 8, 12, 16, 19] },
  paladin: { labels: ["paladin"], hitDie: 10, caster: "half", asi: [4, 8, 12, 16, 19] },
  ranger: { labels: ["ranger", "waldlaeufer", "waldläufer", "waldlaeuferin", "waldläuferin"], hitDie: 10, caster: "half", asi: [4, 8, 12, 16, 19] },
  rogue: { labels: ["rogue", "schurke", "schurkin"], hitDie: 8, caster: "none", asi: [4, 8, 10, 12, 16, 19] },
  sorcerer: { labels: ["sorcerer", "zauberer", "zauberin"], hitDie: 6, caster: "full", asi: [4, 8, 12, 16, 19] },
  warlock: { labels: ["warlock", "hexenmeister", "hexenmeisterin"], hitDie: 8, caster: "pact", asi: [4, 8, 12, 16, 19] },
  wizard: { labels: ["wizard", "magier", "magierin"], hitDie: 6, caster: "full", asi: [4, 8, 12, 16, 19] },
  artificer: { labels: ["artificer", "artificerin", "artificer", "kunstschmied", "artillerist"], hitDie: 8, caster: "half-up", asi: [4, 8, 12, 16, 19] },
};

const DND_LEVEL_TWO_RULES = {
  barbarian: [
    "Waghalsiger Angriff freischalten: bei Nahkampfangriffen mit Staerke Vorteil nehmen, Angriffe gegen dich danach bis zu deinem naechsten Zug mit Vorteil.",
    "Gefahrensinn freischalten: Vorteil auf Geschicklichkeitsrettungswuerfe gegen sichtbare Effekte wie Fallen und Zauber.",
  ],
  bard: [
    "Alleskönner freischalten: halber Uebungsbonus auf Attributswuerfe ohne Uebung.",
    "Rast-/Unterstuetzungsfeature der verwendeten Regelversion pruefen und eintragen.",
    "Bekannte Zauber und Zauberplaetze fuer Stufe 2 aktualisieren.",
  ],
  cleric: [
    "Goettliche Macht / Channel-Divinity-Feature freischalten und Nutzungen eintragen.",
    "Untote vertreiben bzw. passendes Channel-Divinity-Grundfeature eintragen.",
    "Vorbereitete Zauber und Zauberplaetze fuer Stufe 2 aktualisieren.",
  ],
  druid: [
    "Wild Shape / Tiergestalt freischalten bzw. Nutzungen und bekannte Formen eintragen.",
    "Wild Companion / vertrautenbezogenes Feature der verwendeten Regelversion pruefen.",
    "Vorbereitete Zauber und Zauberplaetze fuer Stufe 2 aktualisieren.",
  ],
  fighter: [
    "Action Surge / Tatendrang freischalten: einmal pro kurzer/langer Rast eine zusaetzliche Aktion.",
    "Rast-Ressource fuer Action Surge in Aktionen oder Features eintragen.",
  ],
  monk: [
    "Ki / Fokus-Punkte freischalten und Punkte gemaess Stufe eintragen.",
    "Flurry of Blows, Patient Defense und Step of the Wind bzw. passende Fokusoptionen eintragen.",
    "Unarmored Movement / ungeruestete Bewegung aktualisieren.",
  ],
  paladin: [
    "Kampfstil auswaehlen und eintragen.",
    "Zauberwirken freischalten: vorbereitete Zauber und Zauberplaetze fuer Stufe 2 eintragen.",
    "Divine Smite / Goettliches Niederstrecken bzw. passende Smite-Regel der verwendeten Version eintragen.",
  ],
  ranger: [
    "Kampfstil auswaehlen und eintragen.",
    "Zauberwirken freischalten: bekannte/vorbereitete Zauber und Zauberplaetze fuer Stufe 2 eintragen.",
    "Ranger-spezifische Stufe-2-Features der verwendeten Regelversion pruefen.",
  ],
  rogue: [
    "Cunning Action / Gerissene Aktion freischalten: Dash, Disengage oder Hide als Bonusaktion.",
    "Bonusaktionsoptionen in Aktionen eintragen.",
  ],
  sorcerer: [
    "Font of Magic / Quelle der Magie freischalten.",
    "Sorcery Points / Zaubereipunkte gemaess Stufe eintragen.",
    "Bekannte Zauber und Zauberplaetze fuer Stufe 2 aktualisieren.",
  ],
  warlock: [
    "Eldritch Invocations / unheimliche Anrufungen auswaehlen und eintragen.",
    "Pact Magic Slots fuer Stufe 2 aktualisieren.",
    "Bekannte Zauber fuer Stufe 2 pruefen und eintragen.",
  ],
  wizard: [
    "Arcane Tradition / arkane Tradition bzw. Unterklasse der verwendeten Regelversion pruefen.",
    "Zauberbuch um neue Zauber ergaenzen.",
    "Zauberplaetze und vorbereitete Zauber fuer Stufe 2 aktualisieren.",
  ],
  artificer: [
    "Infuse Item / Gegenstand infusionieren freischalten und bekannte Infusionen eintragen.",
    "Zauberwirken und Infusionsslots fuer Stufe 2 aktualisieren.",
  ],
};

const DND_LEVEL_TWO_ADDITIONS = {
  barbarian: {
    features: [
      ["Waghalsiger Angriff", "Du kannst beim ersten Angriff deines Zuges mit Staerke Vorteil erhalten. Bis zu deinem naechsten Zug haben Angriffswuerfe gegen dich Vorteil."],
      ["Gefahrensinn", "Du hast Vorteil auf Geschicklichkeitsrettungswuerfe gegen sichtbare Gefahren wie Fallen oder Zauber."],
    ],
  },
  bard: {
    features: [
      ["Alleskönner", "Du darfst den halben Uebungsbonus auf Attributswuerfe addieren, die ihn noch nicht enthalten."],
      ["Level-2-Auswahl", "Pruefe das Barden-Feature deiner Regelversion und trage die passende Rast-/Unterstuetzungsregel ein."],
    ],
    spells: [{ name: "Neuer Barden-Zauber auswaehlen", level: "1st Level", source: "Level 2", notes: "Beim Level-up aus der Bardenliste waehlen.", prepared: true }],
  },
  cleric: {
    features: [
      ["Channel Divinity / Goettliche Macht", "Channel-Divinity-Feature freigeschaltet. Trage Nutzungen und Domaenenoptionen passend zur Regelversion ein."],
      ["Untote vertreiben", "Aktion. Praesentiere dein heiliges Symbol; Untote in Reichweite muessen einen Weisheitsrettungswurf ablegen oder werden vertrieben."],
    ],
  },
  druid: {
    features: [
      ["Wild Shape / Tiergestalt", "Du kannst eine Nutzung einsetzen, um dich in bekannte Tierformen zu verwandeln. Dauer, CR und Bewegungsarten nach Regelversion pruefen."],
      ["Wild Companion", "Du kannst Find Familiar ueber Wild Shape bzw. die passende Regel deiner Version wirken."],
    ],
    spells: [{ name: "Neuen Druidenzauber vorbereiten", level: "1st Level", source: "Level 2", notes: "Vorbereitete Zauber anhand Weisheit und Druidenliste pruefen.", prepared: true }],
  },
  fighter: {
    actions: [["Action Surge / Tatendrang", "Einmal pro kurzer oder langer Rast kannst du in deinem Zug eine zusaetzliche Aktion ausfuehren."]],
    features: [["Action Surge / Tatendrang", "Ressource: 1 Nutzung pro kurzer/langer Rast."]],
  },
  monk: {
    features: [
      ["Ki / Fokus", "Du erhaeltst Fokus-/Ki-Punkte gemaess Stufe und kannst sie fuer Mönchsoptionen einsetzen."],
      ["Unarmored Movement", "Deine Bewegungsrate erhoeht sich ungeruestet gemaess Klassentabelle."],
    ],
    actions: [
      ["Flurry of Blows", "Bonusaktion nach Angriff: Fokus/Ki ausgeben, um zusaetzliche unbewaffnete Angriffe auszufuehren."],
      ["Patient Defense", "Bonusaktion: Fokus/Ki ausgeben, um Dodge/Ausweichen zu nutzen."],
      ["Step of the Wind", "Bonusaktion: Fokus/Ki ausgeben, um Dash oder Disengage zu nutzen."],
    ],
  },
  paladin: {
    features: [
      ["Kampfstil auswaehlen", "Waehle einen Paladin-Kampfstil und trage dessen Effekt ein."],
      ["Zauberwirken", "Du kannst Paladinzauber vorbereiten und wirken. Zauberplaetze wurden im Level-up zusammengefasst."],
      ["Divine Smite / Goettliches Niederstrecken", "Wenn du mit einer Nahkampfwaffe triffst, kannst du einen Zauberplatz fuer zusaetzlichen Strahlungsschaden ausgeben."],
    ],
    spells: [{ name: "Paladin-Zauber vorbereiten", level: "1st Level", source: "Level 2", notes: "Vorbereitete Paladinzauber auswaehlen.", prepared: true }],
  },
  ranger: {
    features: [
      ["Kampfstil auswaehlen", "Waehle einen Ranger-Kampfstil und trage dessen Effekt ein."],
      ["Zauberwirken", "Du kannst Rangerzauber wirken. Zauberplaetze wurden im Level-up zusammengefasst."],
    ],
    spells: [{ name: "Ranger-Zauber auswaehlen", level: "1st Level", source: "Level 2", notes: "Bekannte/vorbereitete Rangerzauber auswaehlen.", prepared: true }],
  },
  rogue: {
    actions: [["Cunning Action / Gerissene Aktion", "Du kannst Dash, Disengage oder Hide als Bonusaktion ausfuehren."]],
    features: [["Cunning Action / Gerissene Aktion", "Bonusaktionsoptionen freigeschaltet: Dash, Disengage, Hide."]],
  },
  sorcerer: {
    features: [
      ["Font of Magic / Quelle der Magie", "Du erhaeltst Sorcery Points / Zaubereipunkte gemaess Stufe."],
      ["Sorcery Points", "Trage die aktuelle Anzahl der Zaubereipunkte als Ressource ein."],
    ],
    spells: [{ name: "Neuer Zauberer-Zauber auswaehlen", level: "1st Level", source: "Level 2", notes: "Beim Level-up aus der Zaubererliste waehlen.", prepared: true }],
  },
  warlock: {
    features: [
      ["Eldritch Invocations / Unheimliche Anrufungen", "Waehle deine Anrufungen und trage deren Effekte ein."],
      ["Anrufung 1 auswaehlen", "Offener Level-2-Platzhalter fuer eine Eldritch Invocation."],
      ["Anrufung 2 auswaehlen", "Offener Level-2-Platzhalter fuer eine Eldritch Invocation."],
    ],
    spells: [{ name: "Neuer Hexenmeister-Zauber auswaehlen", level: "1st Level", slots: "2 Pact Slots", source: "Level 2", notes: "Bekannten Hexenmeister-Zauber auswaehlen.", prepared: true }],
  },
  wizard: {
    features: [["Arkane Tradition / Unterklasse pruefen", "Pruefe, ob deine Regelversion die Unterklasse auf Stufe 2 vergibt, und trage sie ein."]],
    spells: [
      { name: "Zauberbuch: neuer Magierzauber 1 auswaehlen", level: "1st Level", source: "Level 2", notes: "Dem Zauberbuch hinzufuegen.", prepared: false },
      { name: "Zauberbuch: neuer Magierzauber 2 auswaehlen", level: "1st Level", source: "Level 2", notes: "Dem Zauberbuch hinzufuegen.", prepared: false },
    ],
  },
  artificer: {
    features: [
      ["Infuse Item / Gegenstand infusionieren", "Du kannst Infusionen kennen und Gegenstaende nach den Artificer-Regeln infusionieren."],
      ["Infusionen auswaehlen", "Trage bekannte Infusionen und aktive infusionierte Gegenstaende ein."],
    ],
    spells: [{ name: "Artificer-Zauber vorbereiten", level: "1st Level", source: "Level 2", notes: "Vorbereitete Artificerzauber auswaehlen.", prepared: true }],
  },
};

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

function rosterEntryRole(entry) {
  return String(entry?.role || "spieler").trim().toLowerCase();
}

function rosterEntryTypeLabel(entry) {
  const role = rosterEntryRole(entry);
  if (role === "gegner" || role === "enemy") {
    return "Gegner";
  }
  if (role === "npc") {
    return "NPC";
  }
  return "Spieler";
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
    if (window.EldranSheetRolls) {
      label.appendChild(window.EldranSheetRolls.checkRollButton({
        kind: "Attribut",
        name: definition.label,
        modifier: () => input.value,
      }));
    }
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
  if (window.EldranSheetRolls) {
    label.appendChild(window.EldranSheetRolls.checkRollButton({
      kind: "Skill",
      name: definition.label,
      modifier: () => input.value,
    }));
  }
  return label;
}

function createDisciplineAttributeGroup(attributeKey, attributeLabel, definitions, prefix) {
  const group = document.createElement("section");
  group.className = "character-discipline-attribute-group";
  const heading = document.createElement("h4");
  heading.textContent = attributeLabel;
  const list = document.createElement("div");
  list.className = "character-discipline-attribute-list";
  for (const definition of definitions.filter((item) => item.attribute === attributeKey)) {
    list.appendChild(createDisciplineCard(definition, prefix));
  }
  group.append(heading, list);
  return group;
}

function renderDisciplineGrids() {
  combatDisciplineGrid.innerHTML = "";
  for (const attribute of ATTRIBUTE_DEFINITIONS) {
    const matching = COMBAT_DISCIPLINES.filter((definition) => definition.attribute === attribute.key);
    if (matching.length) {
      combatDisciplineGrid.appendChild(createDisciplineAttributeGroup(attribute.key, attribute.label, matching, "combat_disciplines"));
    }
  }

  generalDisciplineGrid.innerHTML = "";
  for (const attribute of ATTRIBUTE_DEFINITIONS) {
    const matching = GENERAL_DISCIPLINES.filter((definition) => definition.attribute === attribute.key);
    if (matching.length) {
      generalDisciplineGrid.appendChild(createDisciplineAttributeGroup(attribute.key, attribute.label, matching, "general_disciplines"));
    }
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
  sheetRulesetIntro.textContent = dndMode ? "" : "Ein projektgebundener Bogen nach dem Regelwerk: genau ein Charakter pro Spieler und Projekt.";
  sheetRulesetIntro.classList.toggle("hidden", dndMode);
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

const ELDRAN_DNDBEYOND_FALLBACK = {
  identity: {
    character_name: "Eldran Sylvarius",
    player_name: "technick_gg",
    class_level: "Druid 5",
    species: "Human",
    background: "Noble",
    alignment: "Neutral Good",
    experience_points: "Milestone",
    size: "Medium",
  },
  abilities: {
    strength: { score: "15", modifier: "+2", save: "+2" },
    dexterity: { score: "9", modifier: "-1", save: "-1" },
    constitution: { score: "12", modifier: "+1", save: "+1" },
    intelligence: { score: "13", modifier: "+1", save: "+4", save_proficient: true },
    wisdom: { score: "17", modifier: "+3", save: "+6", save_proficient: true },
    charisma: { score: "16", modifier: "+3", save: "+3" },
  },
  skills: {
    acrobatics: { ability: "DEX", modifier: "-1" },
    animal_handling: { ability: "WIS", modifier: "+3" },
    arcana: { ability: "INT", modifier: "+4" },
    athletics: { ability: "STR", modifier: "+2" },
    deception: { ability: "CHA", modifier: "+3" },
    history: { ability: "INT", modifier: "+4", proficient: true },
    insight: { ability: "WIS", modifier: "+3" },
    intimidation: { ability: "CHA", modifier: "+3" },
    investigation: { ability: "INT", modifier: "+1" },
    medicine: { ability: "WIS", modifier: "+6", proficient: true },
    nature: { ability: "INT", modifier: "+7", proficient: true },
    perception: { ability: "WIS", modifier: "+3" },
    performance: { ability: "CHA", modifier: "+3" },
    persuasion: { ability: "CHA", modifier: "+6", proficient: true },
    religion: { ability: "INT", modifier: "+1" },
    sleight_of_hand: { ability: "DEX", modifier: "-1" },
    stealth: { ability: "DEX", modifier: "-1" },
    survival: { ability: "WIS", modifier: "+3" },
  },
  combat: {
    armor_class: "9",
    initiative: "-1",
    speed: "30 ft.",
    hit_points_max: "33",
    hit_dice: "5d8",
    proficiency_bonus: "+3",
    passive_perception: "13",
    passive_insight: "13",
    passive_investigation: "11",
  },
  attacks: [
    { name: "Ray of Frost", hit: "+6", damage: "2d8 Cold", notes: "V/S" },
    { name: "Produce Flame", hit: "+6", damage: "2d8 Fire", notes: "D: 10m, V/S" },
    { name: "Unarmed Strike", hit: "+5", damage: "3 Bludgeoning", notes: "" },
  ],
  resources: {
    cp: "0",
    sp: "0",
    ep: "0",
    gp: "34",
    pp: "0",
    weight_carried: "86 lb.",
    encumbered: "225 lb.",
    push_drag_lift: "450 lb.",
    equipment: [
      "Shield", "Leather", "Sickle", "Clothes, Fine", "Signet Ring", "Backpack", "Herbalism Kit", "Staff",
      "Oil x2", "Rations x10", "Rope", "Bedroll", "Tinderbox", "Torch x10", "Waterskin",
    ].map((name) => ({ name, quantity: name.includes(" x") ? name.split(" x").pop() : "1", weight: "-" })),
  },
  features: {
    features_and_traits: [
      "=== Druid Features ===",
      "Druidic\nYou know Druidic and always have Speak with Animals prepared.",
      "Primal Order: Magician\nYou know one extra Druid cantrip and gain +3 to Intelligence checks for Arcana or Nature.",
      "Wild Shape\nBonus Action. 2 uses per Long Rest. Transform into learned Beast forms for up to 2 hours.",
      "Wild Companion\nCast Find Familiar by expending a spell slot or a use of Wild Shape.",
      "Circle of the Land\nSubclass: Polar Land.",
      "Land's Aid\nMagic action. Expend Wild Shape to create a 10-ft-radius sphere dealing 2d6 Necrotic and healing 2d6 HP.",
      "Wild Resurgence\nRegain Wild Shape by expending a spell slot, or convert Wild Shape into a level 1 spell slot once per Long Rest.",
      "=== Human Species Traits ===",
      "Ability scores each increase by 1. Languages: Common plus one extra language.",
      "=== Feats ===",
      "Magic Initiate (Druid)\nTwo cantrips and one level 1 spell from the Druid spell list.",
    ].join("\n\n"),
    proficiencies_and_training: [
      "=== Armor ===\nLight Armor, Shields",
      "=== Weapons ===\nSimple Weapons",
      "=== Tools ===\nDragonchess Set, Herbalism Kit",
      "=== Languages ===\nCommon, Draconic, Druidic, Elvish",
    ].join("\n\n"),
  },
  personality: {
    traits: "",
    ideals: "",
    bonds: "",
    flaws: "",
  },
  spellcasting: {
    class: "Druid",
    ability: "WIS",
    save_dc: "14",
    attack_bonus: "+6",
    spells: [
      ["Cantrips", "At Will", "Druidcraft", "Magic Initiate (Druid)", "--", "1A", "30 ft.", "V,S", "Instantaneous", "PHB-2024 266", "V/S", true],
      ["Cantrips", "At Will", "Guidance", "Magic Initiate (Druid)", "--", "1A", "Touch", "V,S", "Concentration, up to 1 minute", "PHB-2024 282", "D: 1m, V/S", true],
      ["Cantrips", "At Will", "Ray of Frost", "Circle of the Land Spells", "+6", "1A", "60 ft.", "V,S", "Instantaneous", "PHB-2024 311", "V/S", true],
      ["Cantrips", "At Will", "Produce Flame", "Primal Order", "+6", "1BA", "Self", "V,S", "10 minutes", "PHB-2024 308", "D: 10m, V/S", true],
      ["1st Level", "4 Slots", "Absorb Elements", "Druid", "--", "1R", "Self", "S", "1 round", "EE 150", "D: 1Rnd, S", true],
      ["1st Level", "4 Slots", "Earth Tremor", "Druid", "DEX 14", "1A", "10 ft.", "V,S", "Instantaneous", "EE 155", "V/S", true],
      ["1st Level", "4 Slots", "Faerie Fire", "Druid", "DEX 14", "1A", "60 ft./20 ft. Cube", "V", "Concentration, up to 1 minute", "PHB-2024 271", "D: 1m, 20 ft. Cube, V", true],
      ["1st Level", "4 Slots", "Speak with Animals [R]", "Druidic (Always Prepared)", "--", "1A", "Self", "V,S", "10 minutes", "PHB-2024 318", "D: 10m, V/S", true],
      ["2nd Level", "3 Slots", "Pass without Trace", "Druid", "--", "1A", "Self/30 ft. Emanation", "V,S,M", "Concentration, up to 1 hour", "PHB-2024 303", "D: 1h, V/S/M", true],
      ["2nd Level", "3 Slots", "Flaming Sphere", "Druid", "DEX 14", "1A", "60 ft./5 ft. Sphere", "V,S,M", "Concentration, up to 1 minute", "PHB-2024 275", "D: 1m, V/S/M", true],
      ["3rd Level", "2 Slots", "Call Lightning", "Druid", "DEX 14", "1A", "120 ft./60 ft. Cylinder", "V,S", "Concentration, up to 10 minutes", "PHB-2024 248", "D: 10m, V/S", true],
      ["3rd Level", "2 Slots", "Revivify", "Druid", "--", "1A", "Touch", "V,S,M", "Instantaneous", "PHB-2024 312", "V/S/M", true],
      ["3rd Level", "2 Slots", "Sleet Storm", "Circle of the Land Spells", "DEX 14", "1A", "150 ft./40 ft. Cylinder", "V,S,M", "Concentration, up to 1 minute", "PHB-2024 317", "D: 1m, 40 ft. Cylinder, V/S/M", true],
    ].map(([level, slots, name, source, saveAttack, castingTime, range, components, duration, page, notes, prepared]) => ({
      level,
      slots,
      name,
      source,
      save_attack: saveAttack,
      casting_time: castingTime,
      range,
      components,
      duration,
      page,
      notes,
      prepared,
    })),
  },
};

function renderDndParsedData(data = {}) {
  const normalized = normalizeDndDisplayData(data);
  dndParsedDataView.innerHTML = "";
  const identity = normalized.identity;
  const combat = normalized.combat;
  const sheet = document.createElement("section");
  sheet.className = "dnd-sheet";
  sheet.appendChild(renderDndSheetHeader(normalized));
  sheet.appendChild(renderDndDashboard(normalized));
  const controlRow = document.createElement("div");
  controlRow.className = "dnd-sheet-control-row";
  controlRow.append(renderDndRestPanel(normalized), renderDndRollSettingsPanel());
  sheet.appendChild(controlRow);
  const body = document.createElement("div");
  body.className = "dnd-sheet-body";
  body.appendChild(renderDndAbilitiesColumn(normalized.abilities, normalized.skills, combat));
  body.appendChild(renderDndMiddleColumn(normalized.abilities, normalized.skills, combat, normalized.attacks, {
    editableAttacks: canEditSelectedSheet(),
    resources: normalized.resources,
    editableCoins: canEditSelectedSheet(),
    onCoinsChange: saveDndCoinResources,
    onAttackToggle: saveDndAttackEquippedState,
  }));
  sheet.appendChild(body);
  sheet.appendChild(renderDndRightColumn(normalized, {
    editableCoins: canEditSelectedSheet(),
    onCoinsChange: saveDndCoinResources,
  }));
  sheet.appendChild(renderDndUnderAttributesDetails(normalized.features));
  sheet.appendChild(renderDndSpellsPanel(normalized.spellcasting, normalized.attacks));
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
  const normalized = {
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
      hit_dice_remaining: combat.hit_dice_remaining || combat.hit_dice || field("HitDice", "Hit Dice"),
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
  return shouldUseEldranFallback(data, normalized)
    ? mergeDndFallback(normalized, ELDRAN_DNDBEYOND_FALLBACK)
    : normalized;
}

function shouldUseEldranFallback(data, normalized) {
  const originalName = [
    data?.source?.original_name,
    selectedRosterEntry()?.pdf_original_name,
  ].filter(Boolean).join(" ").toLowerCase();
  const isKnownCharacter = originalName.includes("141232902") || originalName.includes("eldran");
  const hasReadableStats = hasDndValue(normalized.identity.character_name)
    && hasDndValue(normalized.abilities.wisdom?.score)
    && hasDndValue(normalized.combat.armor_class);
  return isKnownCharacter && !hasReadableStats;
}

function mergeDndFallback(current, fallback) {
  const identity = fillDndMissingObject(current.identity, fallback.identity);
  identity.character_name = fallback.identity.character_name;
  return {
    ...current,
    identity,
    abilities: fillDndNestedObject(current.abilities, fallback.abilities),
    skills: fillDndNestedObject(current.skills, fallback.skills),
    combat: fillDndMissingObject(current.combat, fallback.combat),
    attacks: hasDndValue(current.attacks) ? current.attacks : fallback.attacks,
    resources: fillDndMissingObject(current.resources, fallback.resources),
    features: fillDndMissingObject(current.features, fallback.features),
    personality: fillDndMissingObject(current.personality, fallback.personality),
    spellcasting: {
      ...fillDndMissingObject(current.spellcasting, fallback.spellcasting),
      spells: hasDndValue(current.spellcasting?.spells) ? current.spellcasting.spells : fallback.spellcasting.spells,
    },
  };
}

function fillDndMissingObject(current = {}, fallback = {}) {
  const merged = { ...current };
  for (const [key, value] of Object.entries(fallback || {})) {
    if (!hasDndValue(merged[key]) && hasDndValue(value)) {
      merged[key] = value;
    }
  }
  return merged;
}

function fillDndNestedObject(current = {}, fallback = {}) {
  const merged = { ...current };
  for (const [key, value] of Object.entries(fallback || {})) {
    merged[key] = fillDndMissingObject(merged[key] || {}, value);
  }
  return merged;
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
    return source.map((attack) => ({
      ...attack,
      equipped: attack.equipped !== false,
    }));
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
      attacks.push({ ...attack, equipped: true });
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

function renderDndSheetHeader(data) {
  const identity = data.identity || {};
  const header = document.createElement("div");
  header.className = "dnd-sheet-header";
  const nameBox = renderDndLabeledBox("CHARAKTERNAME", identity.character_name || selectedRosterEntry()?.character_name || "");
  nameBox.classList.add("dnd-character-name-box");
  const infoGrid = document.createElement("div");
  infoGrid.className = "dnd-header-grid";
  const classLevelBox = document.createElement("div");
  classLevelBox.className = "dnd-class-level-box";
  classLevelBox.appendChild(renderDndLabeledBox("KLASSE & STUFE", identity.class_level || ""));
  if (canEditSelectedSheet()) {
    const levelButton = document.createElement("button");
    levelButton.type = "button";
    levelButton.className = "dnd-level-up-open-button";
    levelButton.textContent = "Level-up";
    levelButton.addEventListener("click", () => {
      openDndLevelUpDialog(data);
    });
    classLevelBox.appendChild(levelButton);
  }
  infoGrid.append(
    classLevelBox,
    renderDndLabeledBox("HINTERGRUND", identity.background || ""),
    renderDndLabeledBox("SPIELERNAME", identity.player_name || selectedRosterEntry()?.username || ""),
    renderDndLabeledBox("SPEZIES", identity.species || selectedRosterEntry()?.volk || ""),
    renderDndLabeledBox("GESINNUNG", identity.alignment || ""),
    renderDndLabeledBox("ERFAHRUNGSPUNKTE", identity.experience_points || ""),
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
    ["Ruestungsklasse", combat.armor_class],
    ["Initiative", combat.initiative],
    ["Bewegungsrate", combat.speed],
    ["Max TP", combat.hit_points_max],
    ["Trefferwuerfel", combat.hit_dice],
    ["Uebungsbonus", combat.proficiency_bonus],
    ["Zauberrettungs-SG", spellcasting.save_dc],
    ["Zauberangriff", spellcasting.attack_bonus],
    ["Zauberattribut", spellcasting.ability],
    ["Gesinnung", identity.alignment],
    ["Groesse", identity.size],
  ].filter(([, value]) => hasDndValue(value));
  if (!items.length) {
    return dashboard;
  }
  for (const [label, value] of items) {
    dashboard.appendChild(renderDndLabeledBox(label.toUpperCase(), value));
  }
  return dashboard;
}

function renderDndRestPanel(data = {}) {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel dnd-rest-panel";
  const title = document.createElement("h3");
  title.textContent = "RAST";
  const actions = document.createElement("div");
  actions.className = "dnd-rest-actions";
  const rests = [
    { type: "short", label: "Kurze Rast" },
    { type: "long", label: "Lange Rast" },
  ];
  for (const rest of rests) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "upload-button";
    button.textContent = rest.label;
    button.addEventListener("click", () => performDndRest(rest.type, data));
    actions.appendChild(button);
    if (window.EldranSheetRolls) {
      const commandFactory = () => ({
        type: "sheet-roll",
        mode: "rest",
        label: rest.label,
        rest_type: rest.type,
        action: {
          name: rest.label,
          user_id: selectedUserId,
          project_id: rosterPayload?.project?.id || "",
        },
      });
      actions.appendChild(window.EldranSheetRolls.quickbarButton(commandFactory));
      window.EldranSheetRolls.makeQuickbarDraggable(button, commandFactory);
    }
  }
  panel.append(title, actions);
  return panel;
}

function renderDndRollSettingsPanel() {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel dnd-roll-settings-panel";
  const title = document.createElement("h3");
  title.textContent = "WUERFE";
  const settings = window.EldranSheetRolls?.rollSettings?.() || { d20Mode: "normal", visibility: "public" };
  const form = document.createElement("div");
  form.className = "dnd-roll-settings-grid";
  const d20Label = document.createElement("label");
  d20Label.textContent = "Wurfart";
  const d20Select = document.createElement("select");
  for (const [value, label] of [["normal", "Normal"], ["advantage", "Vorteil"], ["disadvantage", "Nachteil"]]) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = settings.d20Mode === value;
    d20Select.appendChild(option);
  }
  const visibilityLabel = document.createElement("label");
  visibilityLabel.textContent = "Sichtbarkeit";
  const visibilitySelect = document.createElement("select");
  for (const [value, label] of [["public", "Normal"], ["gmroll", "GM Roll"], ["hiddenroll", "Hidden Roll"]]) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = settings.visibility === value;
    visibilitySelect.appendChild(option);
  }
  const save = () => {
    window.EldranSheetRolls?.saveRollSettings?.({
      d20Mode: d20Select.value,
      visibility: visibilitySelect.value,
    });
  };
  d20Select.addEventListener("change", save);
  visibilitySelect.addEventListener("change", save);
  d20Label.appendChild(d20Select);
  visibilityLabel.appendChild(visibilitySelect);
  form.append(d20Label, visibilityLabel);
  panel.append(title, form);
  return panel;
}

async function performDndRest(type, data = null) {
  if (type === "short") {
    openDndShortRestDialog(data || normalizeDndDisplayData(selectedSheetMeta?.data || {}));
    return;
  }
  if (!window.confirm("Lange Rast anwenden? TP, Zauberplaetze und Trefferwuerfel werden zurueckgesetzt.")) {
    return;
  }
  const nextData = deepClone(selectedSheetMeta?.data || {});
  nextData.combat = { ...(nextData.combat || {}) };
  nextData.spellcasting = { ...(nextData.spellcasting || {}) };
  const normalized = normalizeDndDisplayData(nextData);
  nextData.combat.hit_points_current = String(normalized.combat.hit_points_max || nextData.combat.hit_points_max || "");
  const hitDice = parseDndHitDice(normalized.combat);
  nextData.combat.hit_dice_remaining = String(hitDice.total || "");
  nextData.spellcasting.used_slots_by_level = {};
  await saveDndSheetData(nextData, "Lange Rast angewendet.");
  await window.EldranSheetRolls?.postCommand?.(`${globalThis.currentUsername || "Spieler"} beendet eine lange Rast.\nTP, Trefferwuerfel und Zauberplaetze wurden zurueckgesetzt.`);
}

function openDndShortRestDialog(data = {}) {
  const dialog = document.createElement("dialog");
  dialog.className = "dnd-level-up-dialog";
  const frame = document.createElement("div");
  frame.className = "dnd-level-up-dialog-frame";
  const normalized = normalizeDndDisplayData(selectedSheetMeta?.data || data || {});
  const hitDice = parseDndHitDice(normalized.combat);
  const remainingStart = Number.parseInt(String(normalized.combat.hit_dice_remaining || hitDice.total || 0), 10) || 0;
  const conMod = parseDndSignedNumber(normalized.abilities?.constitution?.modifier, 0);
  const title = document.createElement("h3");
  title.textContent = "Kurze Rast";
  const status = document.createElement("p");
  status.className = "dnd-empty-text";
  status.textContent = `Verbleibende Trefferwuerfel: ${remainingStart}d${hitDice.die}. Pro Wurf: 1d${hitDice.die} ${formatDndBonus(conMod)}.`;
  const countLabel = document.createElement("label");
  countLabel.className = "dnd-short-rest-count";
  countLabel.textContent = "Anzahl Trefferwuerfel";
  const countSelect = document.createElement("select");
  const maxSelectable = Math.max(0, remainingStart);
  for (let count = 1; count <= maxSelectable; count += 1) {
    const option = document.createElement("option");
    option.value = String(count);
    option.textContent = `${count}d${hitDice.die}`;
    countSelect.appendChild(option);
  }
  countSelect.disabled = maxSelectable <= 0;
  countLabel.appendChild(countSelect);
  const rollButton = document.createElement("button");
  rollButton.type = "button";
  rollButton.className = "upload-button";
  rollButton.textContent = "Trefferwuerfel wuerfeln";
  rollButton.disabled = remainingStart <= 0;
  rollButton.addEventListener("click", async () => {
    const current = normalizeDndDisplayData(selectedSheetMeta?.data || {});
    const currentDice = parseDndHitDice(current.combat);
    const remaining = Number.parseInt(String(current.combat.hit_dice_remaining || currentDice.total || 0), 10) || 0;
    if (remaining <= 0) {
      setStorageStatus("Keine Trefferwuerfel mehr verfuegbar.", "error");
      rollButton.disabled = true;
      return;
    }
    const requestedCount = Math.max(1, Number.parseInt(countSelect.value || "1", 10) || 1);
    const diceCount = Math.min(requestedCount, remaining);
    const currentConMod = parseDndSignedNumber(current.abilities?.constitution?.modifier, conMod);
    const rolls = [];
    let heal = 0;
    for (let index = 0; index < diceCount; index += 1) {
      const roll = window.EldranSheetRolls?.rollExpression?.(`1d${currentDice.die}`, { d20Mode: "normal" });
      const dieValue = Number(roll?.total || Math.floor(Math.random() * currentDice.die) + 1);
      const gain = Math.max(0, dieValue + currentConMod);
      heal += gain;
      rolls.push(`${dieValue}${formatDndBonus(currentConMod)}=${gain}`);
    }
    const nextData = deepClone(selectedSheetMeta?.data || {});
    nextData.combat = { ...(nextData.combat || {}) };
    const currentHp = parseDndSignedNumber(current.combat.hit_points_current, 0);
    const maxHp = parseDndSignedNumber(current.combat.hit_points_max, currentHp);
    nextData.combat.hit_points_current = String(Math.min(maxHp, currentHp + heal));
    nextData.combat.hit_dice_remaining = String(Math.max(0, remaining - diceCount));
    await saveDndSheetData(nextData, "Trefferwuerfel verbraucht.");
    const message = `${globalThis.currentUsername || "Spieler"} nutzt eine kurze Rast.\nTrefferwuerfel: ${diceCount}d${currentDice.die} ${formatDndBonus(currentConMod)} je Wuerfel = ${rolls.join(" + ")}\nHeilung: ${heal} | TP: ${nextData.combat.hit_points_current}/${maxHp}`;
    await window.EldranSheetRolls?.postCommand?.(message);
    dialog.close();
  });
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "dnd-level-up-close-button";
  closeButton.textContent = "Schliessen";
  closeButton.addEventListener("click", () => dialog.close());
  frame.append(title, status, countLabel, rollButton, closeButton);
  dialog.appendChild(frame);
  dialog.addEventListener("close", () => dialog.remove());
  document.body.appendChild(dialog);
  dialog.showModal();
}

window.EldranDndSpellSlots = {
  consume: consumeDndSpellSlot,
};

window.EldranDndRests = {
  perform: performDndRest,
};

function normalizeDndClassText(value = "") {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseDndClassAndLevel(identity = {}, spellcasting = {}) {
  const classLevel = String(identity.class_level || spellcasting.class || "").trim();
  const levelMatch = classLevel.match(/\b(\d{1,2})\b/);
  const level = Math.max(1, Math.min(20, Number(levelMatch?.[1] || selectedRosterEntry()?.level || 1)));
  const classText = normalizeDndClassText(classLevel.replace(/\b\d{1,2}\b/g, " ") || spellcasting.class || "");
  let classKey = "";
  for (const [key, rule] of Object.entries(DND_CLASS_RULES)) {
    if (rule.labels.some((label) => classText.includes(normalizeDndClassText(label)))) {
      classKey = key;
      break;
    }
  }
  return {
    classKey,
    level,
    classLabel: classText || classLevel || spellcasting.class || "",
    rule: classKey ? DND_CLASS_RULES[classKey] : null,
  };
}

function parseDndSignedNumber(value, fallback = 0) {
  const match = String(value ?? "").match(/[+-]?\d+/);
  return match ? Number(match[0]) : fallback;
}

function formatDndBonus(value) {
  const numeric = Number(value) || 0;
  return `${numeric >= 0 ? "+" : ""}${numeric}`;
}

function dndSpellSlotsForRule(rule, level) {
  if (!rule || rule.caster === "none") {
    return [];
  }
  if (rule.caster === "pact") {
    const pact = DND_PACT_MAGIC_BY_LEVEL[level - 1];
    return pact ? [{ level: pact.level, slots: pact.slots, pact: true }] : [];
  }
  let effectiveLevel = level;
  if (rule.caster === "half") {
    effectiveLevel = level < 2 ? 0 : Math.ceil(level / 2);
  } else if (rule.caster === "half-up") {
    effectiveLevel = Math.ceil(level / 2);
  } else if (rule.caster === "third") {
    effectiveLevel = level < 3 ? 0 : Math.floor(level / 3);
  }
  const row = effectiveLevel > 0 ? DND_FULL_CASTER_SLOTS[effectiveLevel - 1] : null;
  return row
    ? row.map((slots, index) => ({ level: index + 1, slots })).filter((entry) => entry.slots > 0)
    : [];
}

function dndSpellSlotsText(slots) {
  if (!slots.length) {
    return "Keine Zauberplatz-Aenderung";
  }
  if (slots.some((entry) => entry.pact)) {
    const pact = slots[0];
    return `${pact.slots} Pact-Magic Slot(s) auf Stufe ${pact.level}`;
  }
  return slots.map((entry) => `S${entry.level}: ${entry.slots}`).join(" | ");
}

function dndSpellLevelRank(level) {
  const source = String(level || "Cantrip").toLowerCase();
  if (source.includes("cantrip") || source.includes("zaubertrick")) return 0;
  const numeric = source.match(/\d+/);
  return numeric ? Number(numeric[0]) : 99;
}

function dndSpellLevelLabel(level) {
  const rank = dndSpellLevelRank(level);
  if (rank === 0) return "Zaubertricks";
  return rank === 99 ? String(level || "Unbekannte Stufe") : `Stufe ${rank}`;
}

function parseDndSlotsText(value) {
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

function dndSlotTotals(spellcasting = {}) {
  const totals = {};
  const byLevel = spellcasting.slots_by_level && typeof spellcasting.slots_by_level === "object" ? spellcasting.slots_by_level : {};
  for (const [level, value] of Object.entries(byLevel)) {
    const numericLevel = String(Number.parseInt(level, 10));
    const numericValue = Number.parseInt(String(value), 10);
    if (numericLevel !== "NaN" && Number.isFinite(numericValue) && numericValue > 0) {
      totals[numericLevel] = Math.max(Number(totals[numericLevel] || 0), numericValue);
    }
  }
  Object.assign(totals, parseDndSlotsText(spellcasting.slot_summary));
  for (const spell of Array.isArray(spellcasting.spells) ? spellcasting.spells : []) {
    const rank = dndSpellLevelRank(spell.level || spell.spell_level);
    if (rank <= 0 || rank > 9) continue;
    const parsed = parseDndSlotsText(`${spell.slots || ""} Stufe ${rank}`);
    if (parsed[String(rank)]) {
      totals[String(rank)] = Math.max(Number(totals[String(rank)] || 0), parsed[String(rank)]);
    }
  }
  return totals;
}

function dndUsedSlots(spellcasting = {}) {
  return spellcasting.used_slots_by_level && typeof spellcasting.used_slots_by_level === "object"
    ? { ...spellcasting.used_slots_by_level }
    : {};
}

function dndRemainingSlots(spellcasting = {}, level) {
  const rank = Number(level);
  if (!rank) return Infinity;
  const totals = dndSlotTotals(spellcasting);
  const used = dndUsedSlots(spellcasting);
  return Math.max(0, Number(totals[String(rank)] || 0) - Number(used[String(rank)] || 0));
}

function parseDndHitDice(combat = {}) {
  const match = String(combat.hit_dice || "").match(/(\d+)\s*d\s*(\d+)/i);
  if (!match) return { total: 0, die: 8 };
  return { total: Number(match[1] || 0), die: Number(match[2] || 8) };
}

function clampDndHp(value, maxHp = 9999) {
  const parsed = Number.parseInt(String(value ?? "0"), 10);
  const upper = maxHp > 0 ? maxHp : 9999;
  return Math.max(0, Math.min(upper, Number.isFinite(parsed) ? parsed : 0));
}

function parseDndDeathSaveCount(value) {
  const text = String(value ?? "").trim();
  const numeric = Number.parseInt(text, 10);
  if (Number.isFinite(numeric)) {
    return Math.max(0, Math.min(3, numeric));
  }
  const marks = text.match(/[xX✓✔]/g);
  return Math.max(0, Math.min(3, marks?.length || 0));
}

async function updateDndCombatValues(values, statusText = "Gespeichert.") {
  const nextData = deepClone(selectedSheetMeta?.data || {});
  nextData.combat = { ...(nextData.combat || {}) };
  Object.assign(nextData.combat, values);
  await saveDndSheetData(nextData, statusText);
  return nextData.combat;
}

async function saveDndSheetData(nextData, statusText = "Gespeichert.") {
  if (!isDndProject() || !selectedUserId || !rosterPayload?.project?.id || !canEditSelectedSheet()) {
    throw new Error("Du darfst diesen Charakterbogen nicht bearbeiten.");
  }
  const response = await fetchJson(`/api/character-sheets/${encodeURIComponent(selectedUserId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_id: rosterPayload.project.id,
      data: nextData,
    }),
  });
  selectedSheetMeta = response.sheet || selectedSheetMeta;
  renderDndParsedData(selectedSheetMeta?.data || nextData);
  setStorageStatus(statusText);
  return response;
}

async function consumeDndSpellSlot(level) {
  const rank = Number(level || 0);
  if (!rank) return true;
  const data = deepClone(selectedSheetMeta?.data || {});
  data.spellcasting = { ...(data.spellcasting || {}) };
  const remaining = dndRemainingSlots(data.spellcasting, rank);
  if (remaining <= 0) {
    setStorageStatus(`Keine Zauberplaetze Stufe ${rank} mehr verfuegbar.`, "error");
    return false;
  }
  const used = dndUsedSlots(data.spellcasting);
  used[String(rank)] = Number(used[String(rank)] || 0) + 1;
  data.spellcasting.used_slots_by_level = used;
  await saveDndSheetData(data, `Zauberplatz Stufe ${rank} verbraucht.`);
  return true;
}

function dndAverageHpGain(hitDie, constitutionModifier) {
  return Math.floor(Number(hitDie || 0) / 2) + 1 + Number(constitutionModifier || 0);
}

function dndLevelUpRuleItems(classKey, nextLevel) {
  if (nextLevel !== 2) {
    return [];
  }
  const classRules = DND_LEVEL_TWO_RULES[classKey] || [];
  return [
    "Stufe 2: Trefferpunkte erhoehen, Trefferwuerfel auf 2 setzen und Uebungsbonus pruefen.",
    ...classRules,
  ];
}

function dndLevelUpWarnings(rule, nextLevel, classKey = "") {
  const warnings = [];
  if (!rule) {
    warnings.push("Klasse nicht sicher erkannt. Trefferwuerfel und Zauberprogression bitte pruefen.");
  }
  warnings.push(...dndLevelUpRuleItems(classKey, nextLevel));
  if (rule?.asi?.includes(nextLevel)) {
    warnings.push("ASI/Talent-Stufe: Attributserhoehung oder Talent auswaehlen und manuell eintragen.");
  }
  if (nextLevel !== 2) {
    warnings.push("Neue Klassen-/Unterklassenmerkmale, Zauber, Uebungen und vorbereitete Zauber nach Klassentabelle pruefen.");
  }
  if (rule?.caster === "pact" && [11, 13, 15, 17].includes(nextLevel)) {
    warnings.push("Mystic-Arcanum/Arkanum-Stufe pruefen und passenden Zauber manuell eintragen.");
  }
  return warnings;
}

function setDndSpellSlotSummary(data, slots) {
  data.spellcasting = { ...(data.spellcasting || {}) };
  data.spellcasting.slot_summary = dndSpellSlotsText(slots);
  data.spellcasting.slots_by_level = slots.reduce((result, entry) => {
    result[String(entry.level)] = entry.slots;
    return result;
  }, {});
}

function appendDndLevelUpTextBlock(currentText, sectionTitle, entries) {
  const additions = Array.isArray(entries) ? entries : [];
  if (!additions.length) {
    return currentText || "";
  }
  const marker = `=== Level 2: ${sectionTitle} ===`;
  const existing = String(currentText || "").trim();
  if (existing.includes(marker)) {
    return existing;
  }
  const body = additions
    .map(([title, text]) => `${title}\n${text}`)
    .join("\n\n");
  return [existing, `${marker}\n${body}`].filter(Boolean).join("\n\n");
}

function appendDndLevelUpSpells(currentSpells, additions) {
  const spells = Array.isArray(currentSpells) ? currentSpells.map((spell) => ({ ...spell })) : [];
  for (const spell of additions || []) {
    const name = String(spell.name || "").trim();
    if (!name || spells.some((existing) => String(existing.name || "").trim().toLowerCase() === name.toLowerCase())) {
      continue;
    }
    spells.push({
      level: spell.level || "1st Level",
      slots: spell.slots || "",
      name,
      source: spell.source || "Level 2",
      save_attack: spell.save_attack || "--",
      casting_time: spell.casting_time || "",
      range: spell.range || "",
      components: spell.components || "",
      duration: spell.duration || "",
      page: spell.page || "",
      notes: spell.notes || "Beim Level-up auswaehlen.",
      prepared: spell.prepared !== false,
    });
  }
  return spells;
}

function applyDndLevelUpAdditions(nextData, classKey, nextLevel) {
  if (nextLevel !== 2 || !classKey) {
    return [];
  }
  const additions = DND_LEVEL_TWO_ADDITIONS[classKey] || {};
  const applied = [];
  nextData.features = { ...(nextData.features || {}) };
  nextData.spellcasting = { ...(nextData.spellcasting || {}) };
  if (additions.features?.length) {
    nextData.features.features_and_traits = appendDndLevelUpTextBlock(
      nextData.features.features_and_traits || "",
      "Merkmale",
      additions.features,
    );
    applied.push("Merkmale");
  }
  if (additions.actions?.length) {
    nextData.features.actions = appendDndLevelUpTextBlock(
      nextData.features.actions || "",
      "Aktionen",
      additions.actions,
    );
    applied.push("Aktionen");
  }
  if (additions.spells?.length) {
    nextData.spellcasting.spells = appendDndLevelUpSpells(nextData.spellcasting.spells, additions.spells);
    applied.push("Zauber");
  }
  return applied;
}

function replaceDndClassLevelText(currentText, nextLevel, classLabel) {
  const current = String(currentText || "").trim();
  if (/\b\d{1,2}\b/.test(current)) {
    return current.replace(/\b\d{1,2}\b/, String(nextLevel));
  }
  return [classLabel || "Klasse", nextLevel].filter(Boolean).join(" ");
}

async function saveDndLevelUp(nextData, message) {
  if (!isDndProject() || !selectedUserId || !rosterPayload?.project?.id || !canEditSelectedSheet()) {
    throw new Error("Du darfst diesen Charakterbogen nicht bearbeiten.");
  }
  setStorageStatus("Level-up wird gespeichert ...");
  const response = await fetchJson(`/api/character-sheets/${encodeURIComponent(selectedUserId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project_id: rosterPayload.project.id,
      data: nextData,
    }),
  });
  selectedSheetMeta = response.sheet || selectedSheetMeta;
  const entry = selectedRosterEntry();
  if (entry && response.sheet) {
    entry.level = response.sheet.level || entry.level;
    entry.character_name = response.sheet.character_name || entry.character_name;
    entry.updated_at = response.sheet.updated_at || new Date().toISOString();
    entry.has_sheet = true;
  }
  renderRoster();
  renderDndParsedData(selectedSheetMeta?.data || nextData);
  setStorageStatus(message || "Level-up gespeichert.");
}

function openDndLevelUpDialog(data = {}) {
  const dialog = document.createElement("dialog");
  dialog.className = "dnd-level-up-dialog";
  const frame = document.createElement("div");
  frame.className = "dnd-level-up-dialog-frame";
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "dnd-level-up-close-button";
  closeButton.textContent = "Schliessen";
  closeButton.addEventListener("click", () => {
    dialog.close();
  });
  frame.append(
    renderDndLevelUpPanel(data, {
      onApplied: () => dialog.close(),
    }),
    closeButton,
  );
  dialog.appendChild(frame);
  dialog.addEventListener("close", () => {
    dialog.remove();
  });
  document.body.appendChild(dialog);
  dialog.showModal();
}

function renderDndLevelUpPanel(data = {}, options = {}) {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel dnd-level-up-panel";
  const title = document.createElement("h3");
  title.textContent = "LEVEL-UP";
  panel.appendChild(title);
  const parsed = parseDndClassAndLevel(data.identity || {}, data.spellcasting || {});
  const currentLevel = parsed.level;
  const nextLevel = Math.min(20, currentLevel + 1);
  const constitutionModifier = parseDndSignedNumber(data.abilities?.constitution?.modifier, 0);
  const hitDie = parsed.rule?.hitDie || Number(String(data.combat?.hit_dice || "").match(/d(\d+)/i)?.[1] || 8);
  const averageGain = Math.max(1, dndAverageHpGain(hitDie, constitutionModifier));
  const nextSlots = dndSpellSlotsForRule(parsed.rule, nextLevel);

  const summary = document.createElement("div");
  summary.className = "dnd-level-up-summary";
  summary.append(
    renderDndLabeledBox("AKTUELL", `Stufe ${currentLevel}`),
    renderDndLabeledBox("NAECHSTE STUFE", currentLevel >= 20 ? "Maximum" : `Stufe ${nextLevel}`),
    renderDndLabeledBox("TREFFERWUERFEL", `d${hitDie}`),
    renderDndLabeledBox("UEBUNGSBONUS", formatDndBonus(DND_PROFICIENCY_BY_LEVEL[nextLevel - 1] || 6)),
    renderDndLabeledBox("ZAUBERPLAETZE", dndSpellSlotsText(nextSlots)),
  );
  panel.appendChild(summary);

  const controls = document.createElement("div");
  controls.className = "dnd-level-up-controls";
  const hpLabel = document.createElement("label");
  hpLabel.className = "dnd-level-up-field";
  const hpCaption = document.createElement("span");
  hpCaption.textContent = "TP-Zuwachs";
  const hpInput = document.createElement("input");
  hpInput.type = "number";
  hpInput.min = "1";
  hpInput.max = "40";
  hpInput.step = "1";
  hpInput.value = String(averageGain);
  hpLabel.append(hpCaption, hpInput);

  const note = document.createElement("p");
  note.className = "dnd-empty-text";
  note.textContent = `Durchschnitt d${hitDie}: ${Math.floor(hitDie / 2) + 1} + KON ${formatDndBonus(constitutionModifier)} = ${averageGain}. Fuer gewuerfelte TP den Wert vor dem Anwenden anpassen.`;

  const warnings = document.createElement("ul");
  warnings.className = "dnd-level-up-notes";
  for (const warning of dndLevelUpWarnings(parsed.rule, nextLevel, parsed.classKey)) {
    const item = document.createElement("li");
    item.textContent = warning;
    warnings.appendChild(item);
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "upload-button";
  button.textContent = currentLevel >= 20 ? "Maximalstufe erreicht" : `Auf Stufe ${nextLevel} steigen`;
  button.disabled = currentLevel >= 20 || !canEditSelectedSheet();
  button.addEventListener("click", async () => {
    const hpGain = Math.max(1, Number.parseInt(hpInput.value || String(averageGain), 10) || averageGain);
    const nextData = deepClone(selectedSheetMeta?.data || {});
    nextData.identity = { ...(nextData.identity || {}) };
    nextData.combat = { ...(nextData.combat || {}) };
    nextData.features = { ...(nextData.features || {}) };
    nextData.identity.class_level = replaceDndClassLevelText(nextData.identity.class_level || data.identity?.class_level || "", nextLevel, parsed.classLabel);
    nextData.combat.proficiency_bonus = formatDndBonus(DND_PROFICIENCY_BY_LEVEL[nextLevel - 1] || 6);
    const currentMaxHp = parseDndSignedNumber(nextData.combat.hit_points_max || data.combat?.hit_points_max, 0);
    const currentHp = parseDndSignedNumber(nextData.combat.hit_points_current || data.combat?.hit_points_current, currentMaxHp);
    nextData.combat.hit_points_max = String(Math.max(0, currentMaxHp) + hpGain);
    nextData.combat.hit_points_current = String(Math.max(0, currentHp) + hpGain);
    nextData.combat.hit_dice = `${nextLevel}d${hitDie}`;
    setDndSpellSlotSummary(nextData, nextSlots);
    const appliedAdditions = applyDndLevelUpAdditions(nextData, parsed.classKey, nextLevel);
    const history = Array.isArray(nextData.features.level_up_history) ? [...nextData.features.level_up_history] : [];
    history.push({
      level: nextLevel,
      class: parsed.classLabel,
      hp_gain: hpGain,
      hit_die: `d${hitDie}`,
      proficiency_bonus: nextData.combat.proficiency_bonus,
      spell_slots: nextData.spellcasting.slot_summary,
      applied_additions: appliedAdditions,
      notes: dndLevelUpWarnings(parsed.rule, nextLevel, parsed.classKey),
      applied_at: new Date().toISOString(),
    });
    nextData.features.level_up_history = history;
    nextData.features.level_up_notes = dndLevelUpWarnings(parsed.rule, nextLevel, parsed.classKey).join("\n");
    try {
      await saveDndLevelUp(nextData, `Level-up auf Stufe ${nextLevel} gespeichert.`);
      if (typeof options.onApplied === "function") {
        options.onApplied(nextData);
      }
    } catch (error) {
      setStorageStatus(error.message || "Level-up konnte nicht gespeichert werden.", "error");
    }
  });

  controls.append(hpLabel, button);
  panel.append(controls, note, warnings);
  return panel;
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

function dndSkillAbilityCode(key, value = {}) {
  return String(value.ability || DND_SKILL_DEFAULT_ABILITIES[key] || "").toUpperCase();
}

function dndIsSkillProficient(skillKey, skillValue = {}, abilities = {}, combat = {}) {
  if (skillValue?.proficient || skillValue?.expertise) return true;
  const proficiencyBonus = Math.abs(parseDndSignedNumber(combat.proficiency_bonus, 0));
  if (!proficiencyBonus) return false;
  const skillModifier = parseDndSignedNumber(skillValue?.modifier, 0);
  const abilityCode = dndSkillAbilityCode(skillKey, skillValue);
  const abilityEntry = Object.entries(DND_ABILITY_LABELS).find(([, definition]) => definition[1] === abilityCode);
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
  valueElement.textContent = modifier || "-";
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

function renderDndAbilitiesColumn(abilities, skills = {}, combat = {}) {
  const column = document.createElement("div");
  column.className = "dnd-sheet-column dnd-ability-column dnd-ability-skill-column";
  const labels = DND_ABILITY_LABELS;
  for (const [key, [label, abilityCode]] of Object.entries(labels)) {
    const value = abilities[key] || {};
    const card = document.createElement("article");
    card.className = "dnd-ability-card dnd-ability-skill-card";
    const title = document.createElement("span");
    title.textContent = label;
    const score = document.createElement("strong");
    score.textContent = value.score || "-";
    const modifier = document.createElement("em");
    modifier.textContent = value.modifier || "-";
    const save = document.createElement("small");
    save.textContent = `Rettung ${value.save || "-"}`;
    const checks = document.createElement("div");
    checks.className = "dnd-ability-checks";
    checks.appendChild(renderDndCheckLine({
      label: "Rettungswurf",
      modifier: value.save || value.modifier || "0",
      proficient: Boolean(value.save_proficient),
      kind: "Attribut",
    }));
    for (const [skillKey, skillValue] of Object.entries(skills || {})) {
      if (dndSkillAbilityCode(skillKey, skillValue) !== abilityCode) continue;
      checks.appendChild(renderDndCheckLine({
        label: DND_SKILL_LABELS[skillKey] || skillKey.replaceAll("_", " "),
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
    column.appendChild(card);
  }
  return column;
}

function renderDndMiddleColumn(abilities, skills, combat, attacks, options = {}) {
  const column = document.createElement("div");
  column.className = "dnd-sheet-column";
  const resources = options.resources || {};
  const topStats = document.createElement("div");
  topStats.className = "dnd-combat-stat-grid";
  topStats.append(
    renderDndLabeledBox("RUESTUNGSKLASSE", combat.armor_class || ""),
    renderDndLabeledBox("INITIATIVE", combat.initiative || ""),
    renderDndLabeledBox("BEWEGUNG", combat.speed || ""),
  );
  column.appendChild(renderDndHpPanel(combat));
  column.appendChild(renderDndCoinsPanel(resources, options));
  column.appendChild(renderDndAttacksPanel(attacks, options));
  column.appendChild(topStats);
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
  title.textContent = "TREFFERPUNKTE";
  const grid = document.createElement("div");
  grid.className = "dnd-hp-grid";
  grid.append(
    renderDndLabeledBox("MAX TP", combat.hit_points_max || ""),
    renderDndCurrentHpEditor(combat),
    renderDndTempHpEditor(combat),
    renderDndLabeledBox("TREFFERWUERFEL", combat.hit_dice || ""),
    renderDndDeathSavesPanel(combat),
  );
  panel.append(title, grid);
  return panel;
}

function renderDndCurrentHpEditor(combat = {}) {
  const canEdit = canEditSelectedSheet();
  if (!canEdit) {
    return renderDndLabeledBox("AKTUELLE TP", combat.hit_points_current || "");
  }
  const box = document.createElement("article");
  box.className = "dnd-sheet-box dnd-current-hp-editor";
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "1";
  const maxHp = parseDndSignedNumber(combat.hit_points_max, 9999);
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
    try {
      await updateDndCombatValues(values, "Aktuelle TP gespeichert.");
    } catch (error) {
      setStorageStatus(error.message || "Aktuelle TP konnten nicht gespeichert werden.", "error");
    }
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
  const adjustRow = document.createElement("div");
  adjustRow.className = "dnd-hp-adjust-row";
  const healButton = document.createElement("button");
  healButton.type = "button";
  healButton.textContent = "Heilung";
  const damageButton = document.createElement("button");
  damageButton.type = "button";
  damageButton.textContent = "Schaden";
  const applyAdjustment = async (mode) => {
    const amount = Number.parseInt(adjustInput.value || "0", 10);
    if (!Number.isFinite(amount) || amount <= 0) {
      setStorageStatus("Bitte einen TP-Wert groesser als 0 eintragen.", "error");
      return;
    }
    const currentCombat = selectedSheetMeta?.data?.combat || combat || {};
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
    try {
      await updateDndCombatValues(values, mode === "heal" ? "Heilung angewendet." : "Schaden angewendet.");
    } catch (error) {
      setStorageStatus(error.message || "TP konnten nicht angepasst werden.", "error");
    }
  };
  healButton.addEventListener("click", () => applyAdjustment("heal"));
  damageButton.addEventListener("click", () => applyAdjustment("damage"));
  adjustInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      healButton.click();
    }
  });
  adjustRow.append(adjustInput, healButton, damageButton);
  box.append(input, label, saveButton, adjustRow);
  return box;
}

function renderDndTempHpEditor(combat = {}) {
  const canEdit = canEditSelectedSheet();
  if (!canEdit) {
    return renderDndLabeledBox("TEMP. TP", combat.hit_points_temp || "");
  }
  const box = document.createElement("article");
  box.className = "dnd-sheet-box dnd-current-hp-editor dnd-temp-hp-editor";
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
    try {
      await updateDndCombatValues({ hit_points_temp: String(clampDndHp(input.value, 9999)) }, "Temp. TP gespeichert.");
    } catch (error) {
      setStorageStatus(error.message || "Temp. TP konnten nicht gespeichert werden.", "error");
    }
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveButton.click();
    }
  });
  box.append(input, label, saveButton);
  return box;
}

function renderDndDeathSavesPanel(combat = {}) {
  const box = document.createElement("article");
  box.className = "dnd-sheet-box dnd-death-save-box";
  const title = document.createElement("span");
  title.textContent = "TOD RETTEN";
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
  button.disabled = !canEditSelectedSheet() || currentHp > 0;
  button.title = currentHp > 0 ? "Nur bei 0 aktuellen TP moeglich." : "Todesrettungswurf wuerfeln.";
  button.addEventListener("click", () => rollDndDeathSave(combat));
  box.append(title, counts, button);
  return box;
}

async function rollDndDeathSave(combat = {}) {
  const maxHp = parseDndSignedNumber(combat.hit_points_max, 9999);
  const currentCombat = selectedSheetMeta?.data?.combat || combat || {};
  if (clampDndHp(currentCombat.hit_points_current, maxHp) > 0) {
    setStorageStatus("Todesrettung ist nur bei 0 aktuellen TP moeglich.", "error");
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
  try {
    await updateDndCombatValues(values, "Todesrettung gespeichert.");
    await window.EldranSheetRolls?.postCommand?.(`${globalThis.currentUsername || "Spieler"} wuerfelt Todesrettung.\nTodesrettung: ${rollText}\n${resultText}`);
  } catch (error) {
    setStorageStatus(error.message || "Todesrettung konnte nicht gespeichert werden.", "error");
  }
}

function renderDndSkillsPanel(skills, abilities = {}, combat = {}) {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel";
  const title = document.createElement("h3");
  title.textContent = "FERTIGKEITEN";
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
    const table = document.createElement("table");
    table.className = "dnd-simple-table dnd-skill-table";
    table.innerHTML = "<thead><tr><th>Fertigkeit</th><th>Mod</th><th>Uebung</th></tr></thead>";
    const tbody = document.createElement("tbody");
    for (const [key, value] of groupEntries) {
      const row = document.createElement("tr");
      if (dndIsSkillProficient(key, value, abilities, combat)) {
        row.classList.add("dnd-skill-proficient");
      }
      const cellValues = [
        DND_SKILL_LABELS[key] || key.replaceAll("_", " "),
        value?.modifier || "-",
        value?.expertise ? "Expertise" : value?.proficient ? "Ja" : "-",
      ];
      cellValues.forEach((cellValue, cellIndex) => {
        const cell = document.createElement("td");
        cell.textContent = cellValue;
        if (cellIndex === 0 && row.classList.contains("dnd-skill-proficient")) {
          cell.className = "dnd-skill-proficient-label";
        }
        row.appendChild(cell);
      });
      if (window.EldranSheetRolls) {
        window.EldranSheetRolls.makeCheckRollable(row, {
          kind: "Skill",
          name: DND_SKILL_LABELS[key] || key.replaceAll("_", " "),
          modifier: value?.modifier || "0",
        });
      }
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    group.append(heading, table);
    groups.appendChild(group);
  }
  panel.append(title, groups);
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

function renderDndAttacksPanel(attacks, options = {}) {
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel";
  const title = document.createElement("h3");
  title.textContent = "ANGRIFFE & ZAUBERTRICKS";
  const table = document.createElement("div");
  table.className = "dnd-attack-table";
  table.append(renderDndAttackRow(["NAME", "TREFFER", "SCHADEN/ART", "NOTIZEN"], true));
  const rows = Array.isArray(attacks) && attacks.length ? attacks : [{ name: "", hit: "", damage: "" }, { name: "", hit: "", damage: "" }, { name: "", hit: "", damage: "" }];
  rows.forEach((attack, index) => {
    table.append(renderDndAttackRow([attack.name || "", attack.hit || "", attack.damage || "", attack.notes || ""], false, attack, index, options));
  });
  panel.append(title, table);
  return panel;
}

function isDndAttackEquipped(attack = {}) {
  return attack.equipped !== false;
}

async function saveDndAttackEquippedState(attackIndex, equipped) {
  if (!isDndProject() || !selectedUserId || !rosterPayload?.project?.id || !canEditSelectedSheet()) {
    return;
  }
  const nextData = deepClone(selectedSheetMeta?.data || {});
  const displayedAttacks = normalizeDndDisplayData(nextData).attacks || [];
  const attacks = Array.isArray(nextData.attacks) && nextData.attacks.length
    ? nextData.attacks.map((attack) => ({ ...attack }))
    : displayedAttacks.map((attack) => ({ ...attack }));
  if (!attacks[attackIndex]) {
    return;
  }
  attacks[attackIndex].equipped = Boolean(equipped);
  nextData.attacks = attacks;
  selectedSheetMeta = {
    ...(selectedSheetMeta || {}),
    data: nextData,
  };
  setStorageStatus(equipped ? "Waffe wird ausgeruestet ..." : "Waffe wird abgeruestet ...");
  renderDndParsedData(nextData);
  try {
    const response = await fetchJson(`/api/character-sheets/${encodeURIComponent(selectedUserId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: rosterPayload.project.id,
        data: nextData,
      }),
    });
    selectedSheetMeta = response.sheet || selectedSheetMeta;
    renderDndParsedData(selectedSheetMeta.data || nextData);
    setStorageStatus(equipped ? "Waffe ausgeruestet." : "Waffe abgeruestet.");
  } catch (error) {
    setStorageStatus(error.message || "Waffenstatus konnte nicht gespeichert werden.", "error");
  }
}

function renderDndAttackRow(values, isHeader = false, attack = null, attackIndex = -1, options = {}) {
  const row = document.createElement("div");
  row.className = isHeader ? "dnd-attack-row dnd-attack-header" : "dnd-attack-row";
  const equipped = isDndAttackEquipped(attack || {});
  if (!isHeader && !equipped) {
    row.classList.add("dnd-attack-row-unequipped");
  }
  for (const value of values) {
    const cell = document.createElement("span");
    cell.textContent = value || "-";
    row.appendChild(cell);
  }
  if (!isHeader && attack && hasDndValue(attack)) {
    row.classList.add("dnd-attack-row-with-action");
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
    row.appendChild(actionWrap);
  }
  return row;
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
  const panel = document.createElement("section");
  panel.className = "dnd-sheet-panel dnd-coins-panel";
  const title = document.createElement("h3");
  title.textContent = "MUENZEN";
  panel.appendChild(title);

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
  panel.appendChild(grid);

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
    panel.appendChild(details);
  }

  return panel;
}

async function saveDndCoinResources(nextResources) {
  if (!isDndProject() || !selectedUserId || !rosterPayload?.project?.id || !canEditSelectedSheet()) {
    return;
  }
  const nextData = deepClone(selectedSheetMeta?.data || {});
  nextData.resources = {
    ...(nextData.resources || {}),
    ...normalizeDndCoinResources(nextResources),
  };
  selectedSheetMeta = {
    ...(selectedSheetMeta || {}),
    data: nextData,
  };
  setStorageStatus("Muenzen werden gespeichert ...");
  renderDndParsedData(nextData);
  try {
    const response = await fetchJson(`/api/character-sheets/${encodeURIComponent(selectedUserId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: rosterPayload.project.id,
        data: nextData,
      }),
    });
    selectedSheetMeta = response.sheet || selectedSheetMeta;
    renderDndParsedData(selectedSheetMeta.data || nextData);
    setStorageStatus("Muenzen gespeichert.");
  } catch (error) {
    setStorageStatus(error.message || "Muenzen konnten nicht gespeichert werden.", "error");
  }
}

function renderDndRightColumn(data, options = {}) {
  const column = document.createElement("div");
  column.className = "dnd-sheet-column dnd-sheet-lower-info";
  const combat = data.combat || {};
  const resources = data.resources || {};
  const features = data.features || {};
  const personality = data.personality || {};
  column.appendChild(renderDndListPanel("PASSIVE WERTE", [
    ["Passive Wahrnehmung", combat.passive_perception || ""],
    ["Passiver Motiv erkennen", combat.passive_insight || ""],
    ["Passive Nachforschungen", combat.passive_investigation || ""],
    ["Uebungsbonus", combat.proficiency_bonus || ""],
  ]));
  column.appendChild(renderDndEquipmentPanel(resources));
  column.appendChild(renderDndTextPanel("PERSOENLICHKEITSMERKMALE", personality.traits || ""));
  column.appendChild(renderDndTextPanel("IDEALE / BINDUNGEN / MAENGEL", [personality.ideals, personality.bonds, personality.flaws].filter(Boolean).join("\n\n")));
  return column;
}

function renderDndUnderAttributesDetails(features = {}) {
  const section = document.createElement("section");
  section.className = "dnd-under-attributes-details";
  section.append(
    renderDndDetailsPanel("AKTIONEN", splitDndTextBlocks(features.actions || "")),
    renderDndDetailsPanel("MERKMALE & EIGENSCHAFTEN", splitDndTextBlocks(features.features_and_traits || features.additional_features_and_traits || "")),
    renderDndDetailsPanel("UEBUNG & SPRACHEN", splitDndTextBlocks(features.proficiencies_and_training || "")),
  );
  return section;
}

function renderDndEquipmentPanel(resources) {
  const equipment = resources.equipment;
  if (Array.isArray(equipment)) {
    const panel = document.createElement("section");
    panel.className = "dnd-sheet-panel";
    const title = document.createElement("h3");
    title.textContent = "AUSRUESTUNG";
    const table = document.createElement("table");
    table.className = "dnd-simple-table";
    table.innerHTML = "<thead><tr><th>Name</th><th>Menge</th><th>Gewicht</th></tr></thead>";
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
  return renderDndTextPanel("AUSRUESTUNG", equipment || "");
}

function renderDndCarrySummary(resources) {
  const entries = [
    ["Gewicht", resources.weight_carried],
    ["Belastet", resources.encumbered],
    ["Schieben/Ziehen/Heben", resources.push_drag_lift],
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
    details.appendChild(paragraph);
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

function renderDndSpellsPanel(spellcasting = {}, attacks = []) {
  const panel = document.createElement("section");
  panel.className = "dnd-spells-section";
  const header = document.createElement("div");
  header.className = "dnd-spells-header";
  const title = document.createElement("h3");
  title.textContent = "SPELLS";
  const summary = document.createElement("div");
  summary.className = "dnd-spell-summary";
  summary.append(
    renderDndLabeledBox("KLASSE", spellcasting.class || ""),
    renderDndLabeledBox("ATTRIBUT", spellcasting.ability || ""),
    renderDndLabeledBox("RETTUNGS-SG", spellcasting.save_dc || ""),
    renderDndLabeledBox("ANGRIFFSBONUS", spellcasting.attack_bonus || ""),
    renderDndLabeledBox("ZAUBERPLAETZE", spellcasting.slot_summary || ""),
  );
  header.append(title, summary);
  panel.appendChild(header);
  panel.appendChild(renderDndSpellSlotsPanel(spellcasting));

  const spells = Array.isArray(spellcasting.spells) ? spellcasting.spells : [];
  if (!spells.length) {
    const empty = document.createElement("p");
    empty.className = "dnd-empty-text";
    empty.textContent = "Keine Zauber im JSON erkannt.";
    panel.appendChild(empty);
    return panel;
  }

  const spellLevelKey = (spell) => String(spell.level || spell.spell_level || "Cantrip");
  const controls = document.createElement("div");
  controls.className = "dnd-spell-controls";
  const search = document.createElement("input");
  search.type = "search";
  search.placeholder = "Zauber suchen";
  search.className = "sidebar-input";
  const levelSelect = document.createElement("select");
  levelSelect.className = "sidebar-input";
  const levels = ["all", ...new Set(spells.map(spellLevelKey))].sort((left, right) => {
    if (left === "all") return -1;
    if (right === "all") return 1;
    return dndSpellLevelRank(left) - dndSpellLevelRank(right) || String(left).localeCompare(String(right), "de");
  });
  for (const level of levels) {
    const option = document.createElement("option");
    option.value = level;
    option.textContent = level === "all" ? "Alle Stufen" : dndSpellLevelLabel(level);
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
  list.className = "dnd-spell-level-list";
  const render = () => {
    const query = search.value.trim().toLowerCase();
    const level = levelSelect.value;
    const onlyPrepared = preparedInput.checked;
    const onlyConcentration = concentrationInput.checked;
    const onlyRitual = ritualInput.checked;
    list.innerHTML = "";
    const grouped = new Map();
    for (const spell of spells) {
      const name = String(spell.name || "").trim();
      const spellLevel = spellLevelKey(spell);
      const notes = String(spell.notes || "");
      const isPrepared = Boolean(spell.prepared);
      const isRitual = /\[r\]|\britual\b/i.test(`${name} ${notes}`);
      const isConcentration = /\bconcentration\b|\bconc\b/i.test(`${spell.duration || ""} ${notes}`);
      if (query && !name.toLowerCase().includes(query)) continue;
      if (level !== "all" && spellLevel !== level) continue;
      if (onlyPrepared && !isPrepared) continue;
      if (onlyConcentration && !isConcentration) continue;
      if (onlyRitual && !isRitual) continue;
      if (!grouped.has(spellLevel)) grouped.set(spellLevel, []);
      grouped.get(spellLevel).push({ spell, flags: { isPrepared, isRitual, isConcentration, spellLevel } });
    }
    const visibleLevels = [...grouped.keys()].sort((left, right) => dndSpellLevelRank(left) - dndSpellLevelRank(right) || String(left).localeCompare(String(right), "de"));
    for (const spellLevel of visibleLevels) {
      const group = document.createElement("section");
      group.className = "dnd-spell-level-group";
      const heading = document.createElement("h4");
      const rank = dndSpellLevelRank(spellLevel);
      const remaining = dndRemainingSlots(spellcasting, rank);
      heading.textContent = rank > 0 && Number.isFinite(remaining)
        ? `${dndSpellLevelLabel(spellLevel)} (${remaining} frei)`
        : dndSpellLevelLabel(spellLevel);
      const groupList = document.createElement("div");
      groupList.className = "dnd-spell-list";
      for (const item of grouped.get(spellLevel).sort((left, right) => String(left.spell.name || "").localeCompare(String(right.spell.name || ""), "de"))) {
        groupList.appendChild(renderDndSpellCard(item.spell, item.flags, findMatchingAttack(item.spell, attacks), spellcasting));
      }
      group.append(heading, groupList);
      list.appendChild(group);
    }
    if (!visibleLevels.length) {
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

function renderDndSpellSlotsPanel(spellcasting = {}) {
  const totals = dndSlotTotals(spellcasting);
  const levels = Object.keys(totals).sort((left, right) => Number(left) - Number(right));
  const wrap = document.createElement("div");
  wrap.className = "dnd-slot-grid";
  if (!levels.length) {
    const empty = document.createElement("p");
    empty.className = "dnd-empty-text";
    empty.textContent = "Keine Zauberplaetze erkannt.";
    wrap.appendChild(empty);
    return wrap;
  }
  const used = dndUsedSlots(spellcasting);
  for (const level of levels) {
    const total = Number(totals[level] || 0);
    const spent = Math.min(total, Number(used[level] || 0));
    const item = document.createElement("article");
    item.className = "dnd-slot-item";
    const value = document.createElement("strong");
    value.textContent = `${Math.max(0, total - spent)} / ${total}`;
    const label = document.createElement("span");
    label.textContent = `Stufe ${level}`;
    item.append(value, label);
    wrap.appendChild(item);
  }
  return wrap;
}

function renderDndSpellCard(spell, flags, matchingAttack = null, spellcasting = {}) {
  const article = document.createElement("article");
  article.className = "dnd-spell-card";
  const slotLevel = dndSpellLevelRank(flags.spellLevel);
  const remainingSlots = dndRemainingSlots(spellcasting, slotLevel);
  const needsSlot = slotLevel > 0 && slotLevel < 10;
  if (needsSlot && remainingSlots <= 0) {
    article.classList.add("dnd-spell-card-disabled");
  }
  const title = document.createElement("h4");
  title.textContent = spell.name || "Unbenannter Zauber";
  const meta = document.createElement("p");
  meta.textContent = [
    flags.spellLevel,
    spell.slots,
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
  if (window.EldranSheetRolls) {
    const action = {
      name: spell.name || "Zauber",
      hit: spell.save_attack || spell.save_atk || spell.attack || matchingAttack?.hit || "",
      damage: spell.damage || matchingAttack?.damage || "",
      damage_notes: matchingAttack?.notes || spell.notes || "",
      spell_slot_level: needsSlot ? slotLevel : 0,
      user_id: selectedUserId,
      project_id: rosterPayload?.project?.id || "",
    };
    const commandFactory = () => ({
      type: "sheet-roll",
      mode: "spell",
      label: action.name,
      action,
    });
    article.appendChild(window.EldranSheetRolls.quickbarButton(commandFactory));
    window.EldranSheetRolls.makeQuickbarDraggable(article, commandFactory);
    if (!(needsSlot && remainingSlots <= 0)) {
      window.EldranSheetRolls.makeRollable(article, action);
    } else {
      article.title = "Keine passenden Zauberplaetze mehr verfuegbar.";
    }
  }
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

function characterSheetViewPath() {
  return window.location.pathname.startsWith("/Charakterbogen") ? "/Charakterbogen/Ansicht" : "/charakterbogen/ansicht";
}

function storedAuthToken() {
  return window.sessionStorage.getItem("eldran-auth-token") || window.localStorage.getItem("eldran-auth-token") || "";
}

function appendSheetViewAuthToken(url) {
  const token = storedAuthToken();
  return token ? `${url}#auth=${encodeURIComponent(token)}` : url;
}

async function renderDndPdfSheet(sheet = {}) {
  const entry = selectedRosterEntry();
  const pdfName = sheet.pdf_original_name || entry?.pdf_original_name || "";
  const pdfUrl = sheet.pdf_url || "";
  const hasParsedSheet = hasDndValue(sheet.data);
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
  const sheetViewUrl = selectedUserId && rosterPayload?.project?.id
    ? `${characterSheetViewPath()}?user_id=${encodeURIComponent(selectedUserId)}&project_id=${encodeURIComponent(rosterPayload.project.id)}`
    : "#";
  dndSheetViewLink.href = sheetViewUrl === "#" ? "#" : appendSheetViewAuthToken(sheetViewUrl);
  dndSheetViewLink.classList.toggle("hidden", !pdfUrl && !hasParsedSheet);
  dndPdfDeleteButton.classList.toggle("hidden", !pdfUrl || !canEditSelectedSheet());
  dndPdfTags.innerHTML = "";
  for (const label of [entry?.username || "", pdfName || "PDF fehlt"].filter(Boolean)) {
    const tag = document.createElement("span");
    tag.className = "character-pill";
    tag.textContent = label;
    dndPdfTags.appendChild(tag);
  }
  dndPdfEmptyState.classList.toggle("hidden", Boolean(pdfUrl));
  dndParsedDataView.classList.toggle("hidden", !pdfUrl && !hasParsedSheet);
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
    if (!hasParsedSheet) {
      dndSheetViewLink.href = "#";
      dndSheetViewLink.classList.add("hidden");
    }
    dndPdfOpenLink.href = "#";
    dndPdfOpenLink.classList.add("hidden");
    if (!hasParsedSheet) {
      dndParsedDataView.innerHTML = "";
    }
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

function renderRosterItem(entry) {
  const item = document.createElement("div");
  item.className = "character-roster-item";
  if (entry.user_id === selectedUserId) {
    item.classList.add("active");
  }
  if (!entry.has_sheet) {
    item.classList.add("missing");
  }

  const selectButton = document.createElement("button");
  selectButton.type = "button";
  selectButton.className = "character-roster-select";

  const header = document.createElement("div");
  header.className = "character-roster-header";

  const name = document.createElement("strong");
  name.textContent = entry.username;

  const state = document.createElement("span");
  state.className = "character-roster-state";
  const typeLabel = rosterEntryTypeLabel(entry);
  state.textContent = isDndProject()
    ? (entry.has_pdf ? "PDF vorhanden" : typeLabel === "Spieler" ? "Noch kein PDF" : `${typeLabel} ohne PDF`)
    : (entry.has_sheet ? "Bogen vorhanden" : "Noch kein Bogen");

  header.append(name, state);

  const subtitle = document.createElement("div");
  subtitle.className = "character-roster-meta";
  subtitle.textContent = isDndProject()
    ? (entry.pdf_original_name || `Letzte Aenderung: ${formatTimestamp(entry.updated_at)}`)
    : (entry.character_name
      ? `${entry.character_name} | ${entry.volk || "Volk offen"} | Stufe ${entry.level || 1}`
      : `Letzte Aenderung: ${formatTimestamp(entry.updated_at)}`);

  selectButton.append(header, subtitle);
  selectButton.addEventListener("click", async () => {
    if (entry.user_id === selectedUserId) {
      return;
    }
    await selectUser(entry.user_id);
  });

  item.appendChild(selectButton);
  const canDeleteActor = Boolean(rosterPayload?.viewer?.can_manage_all) && ["npc", "gegner", "enemy"].includes(rosterEntryRole(entry));
  if (canDeleteActor) {
    const actions = document.createElement("div");
    actions.className = "character-roster-actions";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost-button compact-button character-danger-button";
    deleteButton.textContent = "Loeschen";
    deleteButton.addEventListener("click", async () => {
      await deleteRosterActor(entry);
    });
    actions.appendChild(deleteButton);
    item.appendChild(actions);
  }
  return item;
}

function renderRosterSection(titleText, entries, emptyText) {
  const section = document.createElement("section");
  section.className = "character-roster-section";
  const title = document.createElement("h3");
  title.textContent = titleText;
  section.appendChild(title);
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "character-roster-empty";
    empty.textContent = emptyText;
    section.appendChild(empty);
    return section;
  }
  for (const entry of entries) {
    section.appendChild(renderRosterItem(entry));
  }
  return section;
}

function renderRoster() {
  sheetRosterList.innerHTML = "";
  const entries = Array.isArray(rosterPayload?.sheets) ? rosterPayload.sheets : [];
  const viewerCanManageAll = Boolean(rosterPayload?.viewer?.can_manage_all);
  sheetNpcCreateWrap?.classList.toggle("hidden", !viewerCanManageAll || !rosterPayload?.project?.id);
  if (!entries.length) {
    setRosterStatus(viewerCanManageAll ? "Keine Spieler, NPCs oder Gegner fuer dieses Projekt vorhanden." : "Keine Spieler fuer dieses Projekt vorhanden.", "error");
    return;
  }

  setRosterStatus(
    viewerCanManageAll
      ? `${entries.length} Eintraege im Projekt.`
      : "Dein Charakterbogen fuer dieses Projekt.",
  );

  const playerEntries = entries.filter((entry) => rosterEntryRole(entry) === "spieler");
  const npcEntries = entries.filter((entry) => rosterEntryRole(entry) === "npc");
  const enemyEntries = entries.filter((entry) => ["gegner", "enemy"].includes(rosterEntryRole(entry)));
  sheetRosterList.append(
    renderRosterSection("Spieler", playerEntries, "Keine Spieler im Projekt."),
    renderRosterSection("NPCs", npcEntries, viewerCanManageAll ? "Noch keine NPCs angelegt." : "Keine NPCs sichtbar."),
    renderRosterSection("Gegner", enemyEntries, viewerCanManageAll ? "Noch keine Gegner angelegt." : "Keine Gegner sichtbar."),
  );
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

async function createNpc() {
  if (!rosterPayload?.viewer?.can_manage_all || !rosterPayload?.project?.id) {
    throw new Error("Du darfst in diesem Projekt keine NPCs oder Gegner anlegen.");
  }
  const name = String(sheetNpcNameInput?.value || "").trim();
  const role = String(sheetNpcRoleSelect?.value || "npc").trim().toLowerCase() === "gegner" ? "gegner" : "npc";
  const typeLabel = role === "gegner" ? "Gegner" : "NPC";
  if (!name) {
    throw new Error(`${typeLabel}-Name fehlt.`);
  }
  sheetNpcCreateButton.disabled = true;
  setRosterStatus(`${typeLabel} wird angelegt ...`);
  try {
    const response = await fetchJson(`/api/projects/${encodeURIComponent(rosterPayload.project.id)}/npcs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role }),
    });
    if (sheetNpcNameInput) {
      sheetNpcNameInput.value = "";
    }
    await loadRoster(response.npc?.id || "");
    setRosterStatus(`${typeLabel} angelegt: ${response.npc?.username || name}`);
  } finally {
    sheetNpcCreateButton.disabled = false;
  }
}

async function deleteRosterActor(entry) {
  if (!entry?.user_id || !rosterPayload?.viewer?.can_manage_all || !rosterPayload?.project?.id) {
    throw new Error("Du darfst diese Figur nicht loeschen.");
  }
  const typeLabel = rosterEntryTypeLabel(entry);
  const displayName = entry.character_name || entry.username || typeLabel;
  if (!window.confirm(`${typeLabel} "${displayName}" wirklich loeschen?\n\nDer Charakterbogen und ein gespeichertes PDF werden ebenfalls entfernt.`)) {
    return;
  }
  setRosterStatus(`${typeLabel} wird geloescht ...`);
  await fetchJson(`/api/projects/${encodeURIComponent(rosterPayload.project.id)}/actors/${encodeURIComponent(entry.user_id)}`, {
    method: "DELETE",
  });
  const nextPreferred = selectedUserId === entry.user_id ? "" : selectedUserId;
  await loadRoster(nextPreferred);
  setRosterStatus(`${typeLabel} geloescht: ${displayName}`);
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
    entry.has_sheet = false;
    entry.character_name = "";
    entry.volk = "";
    entry.level = 1;
    entry.updated_at = new Date().toISOString();
  }
  selectedSheetMeta = {
    ...(selectedSheetMeta || {}),
    has_pdf: false,
    has_sheet: false,
    character_name: "",
    volk: "",
    level: 1,
    pdf_original_name: "",
    pdf_url: "",
    data: {},
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

  sheetNpcCreateButton?.addEventListener("click", async () => {
    try {
      await createNpc();
    } catch (error) {
      setRosterStatus(error.message || "Figur konnte nicht angelegt werden.", "error");
    }
  });

  sheetNpcNameInput?.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    try {
      await createNpc();
    } catch (error) {
      setRosterStatus(error.message || "Figur konnte nicht angelegt werden.", "error");
    }
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
