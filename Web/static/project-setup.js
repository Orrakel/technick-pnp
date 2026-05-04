const projectSetupForm = document.getElementById("projectSetupForm");
const projectSetupName = document.getElementById("projectSetupName");
const projectSetupPlayers = document.getElementById("projectSetupPlayers");
const projectSetupMapName = document.getElementById("projectSetupMapName");
const projectSetupCreateMap = document.getElementById("projectSetupCreateMap");
const projectSetupSubmit = document.getElementById("projectSetupSubmit");
const projectSetupStatus = document.getElementById("projectSetupStatus");

function setProjectSetupStatus(text) {
  projectSetupStatus.textContent = text;
}

function selectedRuleset() {
  return document.querySelector("input[name='ruleset']:checked")?.value || "dnd";
}

function selectedPlayerIds() {
  return Array.from(projectSetupPlayers.querySelectorAll("input[type='checkbox']:checked")).map((input) => input.value);
}

function renderPlayers(players) {
  projectSetupPlayers.innerHTML = "";
  if (!players.length) {
    projectSetupPlayers.innerHTML = '<p class="upload-hint">Keine Spieler vorhanden. Spieler koennen spaeter in der Datenbank angelegt und im Projektpanel hinzugefuegt werden.</p>';
    return;
  }
  for (const player of players) {
    const label = document.createElement("label");
    label.className = "player-check-row";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = player.id;
    const name = document.createElement("span");
    name.textContent = player.username;
    label.append(input, name);
    projectSetupPlayers.appendChild(label);
  }
}

async function loadPlayers() {
  const response = await fetch("/api/map-token-users", { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Spieler konnten nicht geladen werden.");
  }
  renderPlayers(data.users || []);
}

function applyInitialQuery() {
  const params = new URLSearchParams(window.location.search);
  const initialName = params.get("name") || "";
  if (initialName) {
    projectSetupName.value = initialName;
  }
}

async function submitProjectSetup(event) {
  event.preventDefault();
  const name = projectSetupName.value.trim();
  const mapName = projectSetupMapName.value.trim();
  if (!name) {
    setProjectSetupStatus("Projektname fehlt.");
    projectSetupName.focus();
    return;
  }
  if (projectSetupCreateMap.checked && !mapName) {
    setProjectSetupStatus("Kartenname fehlt.");
    projectSetupMapName.focus();
    return;
  }
  projectSetupSubmit.disabled = true;
  setProjectSetupStatus("Projekt wird erstellt...");
  try {
    const response = await fetch("/api/projects/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        ruleset: selectedRuleset(),
        player_ids: selectedPlayerIds(),
        create_empty_map: projectSetupCreateMap.checked,
        map_name: mapName || "Startkarte",
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Projekt konnte nicht erstellt werden.");
    }
    setProjectSetupStatus("Projekt wurde erstellt. Karte wird geoeffnet...");
    window.location.href = "/karte";
  } catch (error) {
    setProjectSetupStatus(error.message);
    projectSetupSubmit.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  applyInitialQuery();
  try {
    const user = await initializeAuthUi({ required: true });
    if (!["admin", "spielleiter"].includes(user?.role || "")) {
      setProjectSetupStatus("Spielleiter- oder Admin-Rechte erforderlich.");
      projectSetupSubmit.disabled = true;
      return;
    }
    await loadPlayers();
    setProjectSetupStatus("Bereit.");
  } catch (error) {
    setProjectSetupStatus(error.message || "Projektanlage konnte nicht geladen werden.");
  }
});

projectSetupForm.addEventListener("submit", submitProjectSetup);
