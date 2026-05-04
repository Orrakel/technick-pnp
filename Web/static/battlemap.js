const battlemapList = document.getElementById("battlemapList");
const battlemapListStatus = document.getElementById("battlemapListStatus");
const battlemapAppShell = document.getElementById("battlemapAppShell");
const battlemapSidebar = document.getElementById("battlemapSidebar");
const battlemapSidebarTurnOrderPanel = document.getElementById("battlemapSidebarTurnOrderPanel");
const battlemapCreateName = document.getElementById("battlemapCreateName");
const battlemapCreateWidth = document.getElementById("battlemapCreateWidth");
const battlemapCreateHeight = document.getElementById("battlemapCreateHeight");
const battlemapCreateCellSize = document.getElementById("battlemapCreateCellSize");
const battlemapCreateScale = document.getElementById("battlemapCreateScale");
const battlemapCreateObstacleColor = document.getElementById("battlemapCreateObstacleColor");
const battlemapCreateBackground = document.getElementById("battlemapCreateBackground");
const battlemapCreateButton = document.getElementById("battlemapCreateButton");
const battlemapNameInput = document.getElementById("battlemapNameInput");
const battlemapWidthInput = document.getElementById("battlemapWidthInput");
const battlemapHeightInput = document.getElementById("battlemapHeightInput");
const battlemapCellSizeInput = document.getElementById("battlemapCellSizeInput");
const battlemapScaleInput = document.getElementById("battlemapScaleInput");
const battlemapObstacleColorInput = document.getElementById("battlemapObstacleColorInput");
const battlemapBackgroundInput = document.getElementById("battlemapBackgroundInput");
const battlemapSaveButton = document.getElementById("battlemapSaveButton");
const battlemapActivateButton = document.getElementById("battlemapActivateButton");
const battlemapTokenNameInput = document.getElementById("battlemapTokenNameInput");
const battlemapTokenTypeInput = document.getElementById("battlemapTokenTypeInput");
const battlemapTokenColorInput = document.getElementById("battlemapTokenColorInput");
const battlemapTokenXInput = document.getElementById("battlemapTokenXInput");
const battlemapTokenYInput = document.getElementById("battlemapTokenYInput");
const battlemapTokenMoveInput = document.getElementById("battlemapTokenMoveInput");
const battlemapTokenAttackInput = document.getElementById("battlemapTokenAttackInput");
const battlemapTokenVisionInput = document.getElementById("battlemapTokenVisionInput");
const battlemapTokenAssignedUserInput = document.getElementById("battlemapTokenAssignedUserInput");
const battlemapTokenInitiativeInput = document.getElementById("battlemapTokenInitiativeInput");
const battlemapTokenLayerInput = document.getElementById("battlemapTokenLayerInput");
const battlemapAddTokenButton = document.getElementById("battlemapAddTokenButton");
const battlemapTokenStatus = document.getElementById("battlemapTokenStatus");
const battlemapSelectedTokenNameInput = document.getElementById("battlemapSelectedTokenNameInput");
const battlemapSelectedTokenTypeInput = document.getElementById("battlemapSelectedTokenTypeInput");
const battlemapSelectedTokenColorInput = document.getElementById("battlemapSelectedTokenColorInput");
const battlemapSelectedTokenXInput = document.getElementById("battlemapSelectedTokenXInput");
const battlemapSelectedTokenYInput = document.getElementById("battlemapSelectedTokenYInput");
const battlemapSelectedTokenMoveInput = document.getElementById("battlemapSelectedTokenMoveInput");
const battlemapSelectedTokenAttackInput = document.getElementById("battlemapSelectedTokenAttackInput");
const battlemapSelectedTokenVisionInput = document.getElementById("battlemapSelectedTokenVisionInput");
const battlemapSelectedTokenAssignedUserInput = document.getElementById("battlemapSelectedTokenAssignedUserInput");
const battlemapSelectedTokenInitiativeInput = document.getElementById("battlemapSelectedTokenInitiativeInput");
const battlemapSelectedTokenImageInput = document.getElementById("battlemapSelectedTokenImageInput");
const battlemapSelectedTokenSaveButton = document.getElementById("battlemapSelectedTokenSaveButton");
const battlemapSelectedTokenMoveToggle = document.getElementById("battlemapSelectedTokenMoveToggle");
const battlemapSelectedTokenDeleteButton = document.getElementById("battlemapSelectedTokenDeleteButton");
const battlemapSelectedTokenStatus = document.getElementById("battlemapSelectedTokenStatus");
const battlemapStatusBadge = document.getElementById("battlemapStatusBadge");
const battlemapRoundBadge = document.getElementById("battlemapRoundBadge");
const battlemapTurnBadge = document.getElementById("battlemapTurnBadge");
const battlemapSidebarTurnOrder = document.getElementById("battlemapSidebarTurnOrder");
const battlemapSidebarTurnOrderSummary = document.getElementById("battlemapSidebarTurnOrderSummary");
const battlemapFogToggle = document.getElementById("battlemapFogToggle");
const battlemapWallModeToggle = document.getElementById("battlemapWallModeToggle");
const battlemapDoorModeToggle = document.getElementById("battlemapDoorModeToggle");
const battlemapFogDeleteLastButton = document.getElementById("battlemapFogDeleteLastButton");
const battlemapObstacleToggle = document.getElementById("battlemapObstacleToggle");
const battlemapBackButton = document.getElementById("battlemapBackButton");
const battlemapMusicAudio = document.getElementById("battlemapMusicAudio");
const battlemapMusicVolumeWrap = document.getElementById("battlemapMusicVolumeWrap");
const battlemapMusicVolumeInput = document.getElementById("battlemapMusicVolumeInput");
const battlemapMusicMuteButton = document.getElementById("battlemapMusicMuteButton");
const battlemapMusicSource = document.getElementById("battlemapMusicSource");
const battlemapMusicStatus = document.getElementById("battlemapMusicStatus");
const battlemapMusicManagerWrap = document.getElementById("battlemapMusicManagerWrap");
const battlemapMusicPlayButton = document.getElementById("battlemapMusicPlayButton");
const battlemapMusicPauseButton = document.getElementById("battlemapMusicPauseButton");
const battlemapMusicClearButton = document.getElementById("battlemapMusicClearButton");
const battlemapCommandChatMessages = document.getElementById("battlemapCommandChatMessages");
const battlemapCommandChatForm = document.getElementById("battlemapCommandChatForm");
const battlemapCommandChatInput = document.getElementById("battlemapCommandChatInput");
const battlemapCommandChatStatus = document.getElementById("battlemapCommandChatStatus");
const battlemapCommandChatClearButton = document.getElementById("battlemapCommandChatClearButton");
const battlemapObstacleClearButton = document.getElementById("battlemapObstacleClearButton");
const battlemapSelectionClearButton = document.getElementById("battlemapSelectionClearButton");
const battlemapUseActionButton = document.getElementById("battlemapUseActionButton");
const battlemapZoomInput = document.getElementById("battlemapZoomInput");
const battlemapZoomValue = document.getElementById("battlemapZoomValue");
const battlemapFogInfo = document.getElementById("battlemapFogInfo");
const battlemapSelectionInfo = document.getElementById("battlemapSelectionInfo");
const battlemapScroller = document.getElementById("battlemapScroller");
const battlemapStage = document.getElementById("battlemapStage");
const battlemapBoard = document.getElementById("battlemapBoard");
const battlemapBackground = document.getElementById("battlemapBackground");
const battlemapGrid = document.getElementById("battlemapGrid");
const battlemapOverlay = document.getElementById("battlemapOverlay");
const battlemapTokenLayer = document.getElementById("battlemapTokenLayer");
const battlemapSectionPanels = Array.from(document.querySelectorAll(".battlemap-collapsible"));
const liveSurfaceReturnKey = "eldran-live-surface-return";
const projectSelect = document.getElementById("projectSelect");
const projectNameInput = document.getElementById("projectNameInput");
const projectCreateButton = document.getElementById("projectCreateButton");
const projectPlayerList = document.getElementById("projectPlayerList");
const projectStatus = document.getElementById("projectStatus");

let currentBattlemaps = [];
let currentActiveBattlemapId = "";
let currentSelectedBattlemapId = "";
let currentBattlemap = null;
let selectedTokenId = "";
let obstacleEditEnabled = false;
let fogEditMode = "";
let reachableCells = [];
let attackCells = [];
let zoomScale = 1;
let panOffsetX = 0;
let panOffsetY = 0;
let panState = null;
let isAnimatingMovement = false;
let pendingObstacleColor = "";
let tokenFreeMoveEnabled = false;
let battlemapAssignableUsers = [];
let battlemapSuppressRefreshUntil = 0;
const battlemapSectionStorageKey = "eldran-battlemap-sections";
let battlemapLayerMenu = null;

function canManageBattlemap() {
  return globalThis.currentUserRole === "admin" || globalThis.currentUserRole === "spielleiter";
}

function battlemapHomePath() {
  return canManageBattlemap() ? "/karte" : "/Karte";
}

function followSurfaceState(activeSurface) {
  if ((globalThis.currentUserRole || "") !== "spieler") {
    return false;
  }
  const kind = String(activeSurface?.kind || "").trim().toLowerCase();
  if (kind === "battlemap") {
    return false;
  }
  const fallbackPath = window.sessionStorage.getItem(liveSurfaceReturnKey) || battlemapHomePath();
  window.location.href = fallbackPath;
  return true;
}

function syncBattlemapAccessMode() {
  const manage = canManageBattlemap();
  battlemapAppShell?.classList.toggle("battlemap-player-view", !manage);
  if (battlemapSidebarTurnOrderPanel) {
    battlemapSidebarTurnOrderPanel.hidden = manage;
  }
  const brand = battlemapSidebar?.querySelector(".brand");
  if (brand) {
    brand.hidden = !manage;
  }
  for (const panel of battlemapSectionPanels) {
    const sectionId = panel.dataset.battlemapSectionId || "";
    if (!manage) {
      panel.hidden = true;
      continue;
    }
    if (["battlemap-create", "battlemap-config", "battlemap-token-create", "battlemap-token-selected"].includes(sectionId)) {
      panel.hidden = !manage;
    }
  }
  battlemapActivateButton.hidden = !manage;
  battlemapSaveButton.hidden = !manage;
  battlemapFogToggle.hidden = !manage;
  battlemapWallModeToggle.hidden = !manage;
  battlemapDoorModeToggle.hidden = !manage;
  battlemapFogDeleteLastButton.hidden = !manage;
  battlemapObstacleToggle.hidden = !manage;
  battlemapObstacleClearButton.hidden = !manage;
  battlemapUseActionButton.hidden = !manage;
  battlemapBackButton.hidden = !manage;
  battlemapCommandChatClearButton.hidden = !manage;
}

function setBattlemapStatus(text) {
  battlemapStatusBadge.textContent = text;
}

function ensureBattlemapLayerMenu() {
  if (battlemapLayerMenu) {
    return battlemapLayerMenu;
  }
  battlemapLayerMenu = document.createElement("div");
  battlemapLayerMenu.className = "layer-context-menu hidden";
  document.body.appendChild(battlemapLayerMenu);
  document.addEventListener("pointerdown", (event) => {
    if (!battlemapLayerMenu || battlemapLayerMenu.classList.contains("hidden")) {
      return;
    }
    if (event.target instanceof Element && battlemapLayerMenu.contains(event.target)) {
      return;
    }
    hideBattlemapLayerMenu();
  });
  return battlemapLayerMenu;
}

function hideBattlemapLayerMenu() {
  if (battlemapLayerMenu) {
    battlemapLayerMenu.classList.add("hidden");
    battlemapLayerMenu.innerHTML = "";
  }
}

function showBattlemapLayerMenu(token, event) {
  if (!canManageBattlemap()) {
    return;
  }
  const menu = ensureBattlemapLayerMenu();
  menu.innerHTML = "";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "layer-context-menu-item";
  const currentLayer = String(token.visibility_layer || "public");
  const nextLayer = currentLayer === "gm" ? "public" : "gm";
  button.textContent = currentLayer === "gm" ? "Auf sichtbare Ebene bringen" : "Auf Spielleiter-Ebene verschieben";
  button.addEventListener("click", async () => {
    hideBattlemapLayerMenu();
    try {
      setBattlemapStatus("Token-Ebene wird aktualisiert...");
      await updateTokenVisibilityLayer(token.id, nextLayer);
      setBattlemapStatus("Bereit");
    } catch (error) {
      setBattlemapStatus(error.message);
    }
  });
  menu.appendChild(button);
  menu.style.left = `${event.clientX}px`;
  menu.style.top = `${event.clientY}px`;
  menu.classList.remove("hidden");
}

function obstacleKey(x, y) {
  return `${x}:${y}`;
}

function tokenTypeLabel(tokenType) {
  return tokenType === "enemy" ? "Gegner" : "Spieler";
}

function normalizedObstacleColor(color) {
  return /^#[0-9a-f]{6}$/i.test(String(color || "").trim()) ? String(color).trim().toLowerCase() : "#7f858c";
}

function hexToRgba(color, alpha) {
  const normalized = normalizedObstacleColor(color);
  const red = parseInt(normalized.slice(1, 3), 16);
  const green = parseInt(normalized.slice(3, 5), 16);
  const blue = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function applyObstacleColorPreview(color) {
  const obstacleColor = normalizedObstacleColor(color);
  battlemapBoard.style.setProperty("--battlemap-obstacle-fill", hexToRgba(obstacleColor, 0.5));
  battlemapBoard.style.setProperty("--battlemap-obstacle-line", hexToRgba(obstacleColor, 0.95));
  battlemapBoard.style.setProperty("--battlemap-obstacle-glow", hexToRgba(obstacleColor, 0.28));
}

function clampBattlemapVisionRange(value) {
  return Math.min(Math.max(Number(value || 6), 1), 24);
}

function tokenAssignedToCurrentUser(token) {
  const userId = String(globalThis.currentUserId || "").trim();
  const username = String(globalThis.currentUsername || "").trim().toLowerCase();
  const assignedUserId = String(token?.assigned_user_id || "").trim();
  const assignedUsername = String(token?.assigned_username || "").trim().toLowerCase();
  if (userId && assignedUserId && userId === assignedUserId) {
    return true;
  }
  if (username && assignedUsername && username === assignedUsername) {
    return true;
  }
  return false;
}

function activeFogBlockers() {
  if (!currentBattlemap) {
    return [];
  }
  const expand = (item) => {
    if (String(item?.shape || "") !== "cell") {
      return [item];
    }
    const x1 = Number(item.x1 || 0);
    const y1 = Number(item.y1 || 0);
    const x2 = Number(item.x2 || 0);
    const y2 = Number(item.y2 || 0);
    return [
      { x1, y1, x2, y2: y1 },
      { x1: x2, y1, x2, y2 },
      { x1, y1: y2, x2, y2 },
      { x1, y1, x2: x1, y2 },
    ];
  };
  const walls = Array.isArray(currentBattlemap.fog_walls) ? currentBattlemap.fog_walls.flatMap(expand) : [];
  const doors = Array.isArray(currentBattlemap.fog_doors)
    ? currentBattlemap.fog_doors.filter((door) => !door.is_open).flatMap(expand)
    : [];
  return walls.concat(doors);
}

function edgeKey(segment) {
  const x1 = Number(segment.x1 || 0);
  const y1 = Number(segment.y1 || 0);
  const x2 = Number(segment.x2 || 0);
  const y2 = Number(segment.y2 || 0);
  const shape = String(segment?.shape || (Math.abs(x2 - x1) === 1 && Math.abs(y2 - y1) === 1 ? "cell" : "edge"));
  if (shape === "cell") {
    return `cell:${Math.min(x1, x2)}:${Math.min(y1, y2)}:${Math.max(x1, x2)}:${Math.max(y1, y2)}`;
  }
  if (x2 < x1 || (x2 === x1 && y2 < y1)) {
    return `edge:${x2}:${y2}:${x1}:${y1}`;
  }
  return `edge:${x1}:${y1}:${x2}:${y2}`;
}

function fogCellShape(x, y) {
  return { x1: x, y1: y, x2: x + 1, y2: y + 1, shape: "cell" };
}

function battlemapVisibleTokensForFog() {
  const tokens = Array.isArray(currentBattlemap?.tokens) ? currentBattlemap.tokens : [];
  const publicPlayers = tokens.filter((token) => token.type === "player" && token.visibility_layer !== "gm");
  if (canManageBattlemap()) {
    return publicPlayers;
  }
  return publicPlayers.filter((token) => tokenAssignedToCurrentUser(token));
}

function battlemapFogAlpha() {
  return canManageBattlemap() ? 0.62 : 0.9;
}

function battlemapWallAlpha() {
  return canManageBattlemap() ? 0.62 : 0.9;
}

function crossProduct(ax, ay, bx, by) {
  return (ax * by) - (ay * bx);
}

function battlemapBoundsSegments() {
  const { width, height } = gridSize();
  return [
    { x1: 0, y1: 0, x2: width, y2: 0 },
    { x1: width, y1: 0, x2: width, y2: height },
    { x1: width, y1: height, x2: 0, y2: height },
    { x1: 0, y1: height, x2: 0, y2: 0 },
  ];
}

function castBattlemapVisibilityRay(origin, angle, maxDistance, segments) {
  const rayX = Math.cos(angle);
  const rayY = Math.sin(angle);
  let nearestDistance = maxDistance;
  let nearestPoint = {
    x: origin.x + (rayX * maxDistance),
    y: origin.y + (rayY * maxDistance),
  };
  for (const segment of segments) {
    const segX = Number(segment.x2) - Number(segment.x1);
    const segY = Number(segment.y2) - Number(segment.y1);
    const denominator = crossProduct(rayX, rayY, segX, segY);
    if (Math.abs(denominator) < 1e-9) {
      continue;
    }
    const diffX = Number(segment.x1) - origin.x;
    const diffY = Number(segment.y1) - origin.y;
    const rayDistance = crossProduct(diffX, diffY, segX, segY) / denominator;
    const segmentFactor = crossProduct(diffX, diffY, rayX, rayY) / denominator;
    if (rayDistance < 0 || segmentFactor < 0 || segmentFactor > 1) {
      continue;
    }
    if (rayDistance < nearestDistance) {
      nearestDistance = rayDistance;
      nearestPoint = {
        x: origin.x + (rayX * rayDistance),
        y: origin.y + (rayY * rayDistance),
      };
    }
  }
  return nearestPoint;
}

function getBattlemapVisibilityPolygon(token) {
  const radius = clampBattlemapVisionRange(token?.vision_range || 6);
  const origin = {
    x: Number(token.x || 0) + 0.5,
    y: Number(token.y || 0) + 0.5,
  };
  const blockers = activeFogBlockers().concat(battlemapBoundsSegments());
  const angles = [];
  for (let index = 0; index < 96; index += 1) {
    angles.push((Math.PI * 2 * index) / 96);
  }
  for (const segment of blockers) {
    for (const endpoint of [
      { x: Number(segment.x1), y: Number(segment.y1) },
      { x: Number(segment.x2), y: Number(segment.y2) },
    ]) {
      const angle = Math.atan2(endpoint.y - origin.y, endpoint.x - origin.x);
      angles.push(angle - 0.0001, angle, angle + 0.0001);
    }
  }
  const points = angles
    .sort((left, right) => left - right)
    .map((angle) => castBattlemapVisibilityRay(origin, angle, radius, blockers));
  return { origin, points, radius };
}

function buildBattlemapFogOverlay() {
  const canvas = document.createElement("canvas");
  canvas.className = "battlemap-overlay-canvas";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("battlemap-overlay-svg");
  canvas.style.pointerEvents = "none";
  svg.style.pointerEvents = "none";
  battlemapOverlay.append(canvas, svg);
  return { canvas, svg };
}

function pointInPolygon(point, polygon) {
  const points = Array.isArray(polygon?.points) ? polygon.points : [];
  if (points.length < 3) {
    return false;
  }
  const pointOnSegment = (candidate, start, end) => {
    const cross = ((candidate.y - start.y) * (end.x - start.x)) - ((candidate.x - start.x) * (end.y - start.y));
    if (Math.abs(cross) > 1e-6) {
      return false;
    }
    const dot = ((candidate.x - start.x) * (end.x - start.x)) + ((candidate.y - start.y) * (end.y - start.y));
    if (dot < 0) {
      return false;
    }
    const squaredLength = ((end.x - start.x) ** 2) + ((end.y - start.y) ** 2);
    return dot <= squaredLength;
  };
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
    const current = points[index];
    const prior = points[previous];
    if (pointOnSegment(point, prior, current)) {
      return true;
    }
    const intersects = ((current.y > point.y) !== (prior.y > point.y))
      && (point.x < (((prior.x - current.x) * (point.y - current.y)) / ((prior.y - current.y) || 1e-9)) + current.x);
    if (intersects) {
      inside = !inside;
    }
  }
  return inside;
}

function currentVisionPolygons() {
  if (!currentBattlemap?.fog_enabled || canManageBattlemap()) {
    return [];
  }
  return battlemapVisibleTokensForFog().map((token) => getBattlemapVisibilityPolygon(token));
}

function isEnemyVisible(token, polygons) {
  if (canManageBattlemap()) {
    return true;
  }
  if (!currentBattlemap?.fog_enabled || token.type !== "enemy") {
    return true;
  }
  const baseX = Number(token.x || 0);
  const baseY = Number(token.y || 0);
  const samplePoints = [
    { x: baseX + 0.5, y: baseY + 0.5 },
    { x: baseX + 0.18, y: baseY + 0.18 },
    { x: baseX + 0.82, y: baseY + 0.18 },
    { x: baseX + 0.18, y: baseY + 0.82 },
    { x: baseX + 0.82, y: baseY + 0.82 },
  ];
  return polygons.some((polygon) => samplePoints.some((point) => pointInPolygon(point, polygon)));
}

function battlemapDoorCell(door) {
  return {
    x: Math.min(Number(door.x1 || 0), Number(door.x2 || 0)),
    y: Math.min(Number(door.y1 || 0), Number(door.y2 || 0)),
  };
}

function collectGroupedDoorIds(startDoor) {
  const doors = Array.isArray(currentBattlemap?.fog_doors) ? currentBattlemap.fog_doors : [];
  const byId = new Map(doors.map((door) => [String(door.id || ""), door]));
  const pending = [String(startDoor.id || "")];
  const visited = new Set();
  while (pending.length) {
    const currentId = pending.pop();
    if (!currentId || visited.has(currentId)) {
      continue;
    }
    visited.add(currentId);
    const current = byId.get(currentId);
    if (!current || String(current.shape || "") !== "cell") {
      continue;
    }
    const currentCell = battlemapDoorCell(current);
    for (const candidate of doors) {
      const candidateId = String(candidate.id || "");
      if (!candidateId || visited.has(candidateId) || String(candidate.shape || "") !== "cell") {
        continue;
      }
      const candidateCell = battlemapDoorCell(candidate);
      const distance = Math.abs(candidateCell.x - currentCell.x) + Math.abs(candidateCell.y - currentCell.y);
      if (distance === 1) {
        pending.push(candidateId);
      }
    }
  }
  return Array.from(visited);
}

function updateFogToolbar() {
  if (!battlemapFogInfo) {
    return;
  }
  const fogEnabled = Boolean(currentBattlemap?.fog_enabled);
  if (!fogEnabled) {
    battlemapFogInfo.textContent = "Nebel inaktiv.";
  } else if (fogEditMode === "wall") {
    battlemapFogInfo.textContent = "Wandmodus aktiv.";
  } else if (fogEditMode === "door") {
    battlemapFogInfo.textContent = "Tuermodus aktiv.";
  } else {
    const wallCount = Array.isArray(currentBattlemap?.fog_walls) ? currentBattlemap.fog_walls.length : 0;
    const doorCount = Array.isArray(currentBattlemap?.fog_doors) ? currentBattlemap.fog_doors.length : 0;
    battlemapFogInfo.textContent = `Nebel aktiv. ${wallCount} Waende, ${doorCount} Tueren.`;
  }
  if (battlemapFogToggle) {
    battlemapFogToggle.textContent = fogEnabled ? "Nebel an" : "Nebel aus";
  }
  if (battlemapWallModeToggle) {
    battlemapWallModeToggle.textContent = fogEditMode === "wall" ? "Wandmodus beenden" : "Waende setzen";
  }
  if (battlemapDoorModeToggle) {
    battlemapDoorModeToggle.textContent = fogEditMode === "door" ? "Tuermodus beenden" : "Tueren setzen";
  }
}

function setSelectedTokenStatus(text) {
  battlemapSelectedTokenStatus.textContent = text;
}

function suspendBattlemapRefresh(ms = 2500) {
  battlemapSuppressRefreshUntil = Date.now() + ms;
}

function populateBattlemapAssignedUserSelects() {
  const options = [{ id: "", username: "Nicht zugewiesen" }, ...battlemapAssignableUsers];
  for (const select of [battlemapTokenAssignedUserInput, battlemapSelectedTokenAssignedUserInput]) {
    if (!select) {
      continue;
    }
    const previousValue = String(select.value || "");
    select.innerHTML = "";
    for (const option of options) {
      const element = document.createElement("option");
      element.value = option.id;
      element.textContent = option.username;
      select.appendChild(element);
    }
    select.value = options.some((option) => option.id === previousValue) ? previousValue : "";
  }
}

async function loadBattlemapAssignableUsers() {
  if (!canManageBattlemap()) {
    battlemapAssignableUsers = [];
    populateBattlemapAssignedUserSelects();
    return;
  }
  const response = await fetch("/api/map-token-users", { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Spielerliste konnte nicht geladen werden.");
  }
  battlemapAssignableUsers = Array.isArray(data.users) ? data.users : [];
  populateBattlemapAssignedUserSelects();
}

function loadBattlemapSectionState() {
  try {
    return JSON.parse(window.localStorage.getItem(battlemapSectionStorageKey) || "{}");
  } catch (error) {
    return {};
  }
}

function saveBattlemapSectionState(state) {
  window.localStorage.setItem(battlemapSectionStorageKey, JSON.stringify(state));
}

function initializeBattlemapSections() {
  const state = loadBattlemapSectionState();
  for (const panel of battlemapSectionPanels) {
    const sectionId = panel.dataset.battlemapSectionId || "";
    const toggle = panel.querySelector(".battlemap-section-toggle");
    if (!toggle || !sectionId) {
      continue;
    }
    if (state[sectionId]) {
      panel.classList.add("collapsed");
    }
    const togglePanel = () => {
      panel.classList.toggle("collapsed");
      state[sectionId] = panel.classList.contains("collapsed");
      saveBattlemapSectionState(state);
    };
    toggle.addEventListener("click", togglePanel);
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        togglePanel();
      }
    });
  }
}

function activeToken() {
  return currentBattlemap?.tokens.find((item) => item.id === currentBattlemap?.active_token_id) || null;
}

function isActiveToken(token) {
  return Boolean(token && currentBattlemap?.active_token_id && token.id === currentBattlemap.active_token_id);
}

function remainingSteps(token) {
  return Math.max(0, Number(token?.move_range || 0) - Number(token?.steps_used || 0));
}

function fillSelectedTokenForm() {
  const token = currentBattlemap?.tokens.find((item) => item.id === selectedTokenId) || null;
  if (!token) {
    battlemapSelectedTokenNameInput.value = "";
    battlemapSelectedTokenTypeInput.value = "player";
    battlemapSelectedTokenColorInput.value = "#58c4ff";
    battlemapSelectedTokenXInput.value = "0";
    battlemapSelectedTokenYInput.value = "0";
    battlemapSelectedTokenMoveInput.value = "4";
    battlemapSelectedTokenAttackInput.value = "1";
    battlemapSelectedTokenVisionInput.value = "6";
    battlemapSelectedTokenAssignedUserInput.value = "";
    battlemapSelectedTokenInitiativeInput.value = "10";
    battlemapSelectedTokenImageInput.value = "";
    battlemapSelectedTokenImageInput.disabled = true;
    battlemapSelectedTokenSaveButton.disabled = true;
    battlemapSelectedTokenDeleteButton.disabled = true;
    battlemapSelectedTokenMoveToggle.disabled = true;
    battlemapSelectedTokenMoveToggle.textContent = "Freies Verschieben aus";
    setSelectedTokenStatus("Noch kein Token ausgewaehlt.");
    return;
  }
  battlemapSelectedTokenNameInput.value = token.name;
  battlemapSelectedTokenTypeInput.value = token.type;
  battlemapSelectedTokenColorInput.value = token.color || (token.type === "enemy" ? "#ff6b6b" : "#58c4ff");
  battlemapSelectedTokenXInput.value = String(token.x);
  battlemapSelectedTokenYInput.value = String(token.y);
  battlemapSelectedTokenMoveInput.value = String(token.move_range);
  battlemapSelectedTokenAttackInput.value = String(token.attack_range);
  battlemapSelectedTokenVisionInput.value = String(clampBattlemapVisionRange(token.vision_range));
  battlemapSelectedTokenAssignedUserInput.value = String(token.assigned_user_id || "");
  battlemapSelectedTokenInitiativeInput.value = String(token.initiative);
  battlemapSelectedTokenImageInput.disabled = false;
  battlemapSelectedTokenSaveButton.disabled = false;
  battlemapSelectedTokenDeleteButton.disabled = false;
  battlemapSelectedTokenMoveToggle.disabled = false;
  battlemapSelectedTokenMoveToggle.textContent = tokenFreeMoveEnabled ? "Freies Verschieben an" : "Freies Verschieben aus";
  setSelectedTokenStatus(token.image_url ? "Token mit Bild ausgewaehlt." : "Token ausgewaehlt.");
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function syncTokenColorWithType() {
  if (battlemapTokenTypeInput.value === "enemy" && battlemapTokenColorInput.value.toLowerCase() === "#58c4ff") {
    battlemapTokenColorInput.value = "#ff6b6b";
  }
  if (battlemapTokenTypeInput.value === "player" && battlemapTokenColorInput.value.toLowerCase() === "#ff6b6b") {
    battlemapTokenColorInput.value = "#58c4ff";
  }
}

function battlemapCellSize() {
  if (!currentBattlemap) {
    return 72;
  }
  return Math.max(16, Math.round(currentBattlemap.cell_size * (currentBattlemap.scale_percent / 100)));
}

function gridSize() {
  if (!currentBattlemap) {
    return { width: 0, height: 0 };
  }
  return {
    width: currentBattlemap.grid_width,
    height: currentBattlemap.grid_height,
  };
}

function obstacleCells() {
  const cells = new Set();
  if (!currentBattlemap) {
    return cells;
  }
  for (const item of currentBattlemap.obstacles) {
    cells.add(obstacleKey(item.x, item.y));
  }
  return cells;
}

function occupiedCells(excludingTokenId = "") {
  const occupied = new Set();
  if (!currentBattlemap) {
    return occupied;
  }
  for (const token of currentBattlemap.tokens) {
    if (token.id === excludingTokenId) {
      continue;
    }
    occupied.add(obstacleKey(token.x, token.y));
  }
  return occupied;
}

function computeMovementData(token) {
  const { width, height } = gridSize();
  const blocked = obstacleCells();
  const occupied = occupiedCells(token.id);
  const startKey = obstacleKey(token.x, token.y);
  const queue = [{ x: token.x, y: token.y, distance: 0 }];
  const visited = new Map([[startKey, null]]);
  const reachable = [];
  const maxDistance = remainingSteps(token);

  while (queue.length) {
    const current = queue.shift();
    if (current.distance > 0) {
      reachable.push({ x: current.x, y: current.y });
    }
    if (current.distance >= maxDistance) {
      continue;
    }
    const neighbors = [
      { x: current.x + 1, y: current.y },
      { x: current.x - 1, y: current.y },
      { x: current.x, y: current.y + 1 },
      { x: current.x, y: current.y - 1 },
    ];
    for (const next of neighbors) {
      if (next.x < 0 || next.y < 0 || next.x >= width || next.y >= height) {
        continue;
      }
      const key = obstacleKey(next.x, next.y);
      if (visited.has(key) || blocked.has(key) || occupied.has(key)) {
        continue;
      }
      visited.set(key, obstacleKey(current.x, current.y));
      queue.push({ ...next, distance: current.distance + 1 });
    }
  }

  return { reachable, parents: visited };
}

function pathFromParents(parents, startX, startY, targetX, targetY) {
  const startKey = obstacleKey(startX, startY);
  const targetKey = obstacleKey(targetX, targetY);
  if (!parents.has(targetKey)) {
    return [];
  }
  const reversePath = [];
  let currentKey = targetKey;
  while (currentKey && currentKey !== startKey) {
    const [x, y] = currentKey.split(":").map(Number);
    reversePath.push({ x, y });
    currentKey = parents.get(currentKey);
  }
  reversePath.reverse();
  return reversePath;
}

function computeAttackCells(token) {
  const { width, height } = gridSize();
  const cells = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const distance = Math.abs(token.x - x) + Math.abs(token.y - y);
      if (distance > 0 && distance <= token.attack_range) {
        cells.push({ x, y });
      }
    }
  }
  return cells;
}

function updateZoomLabel() {
  if (battlemapZoomValue) {
    battlemapZoomValue.textContent = `${Math.round(zoomScale * 100)} %`;
  }
  if (battlemapZoomInput) {
    battlemapZoomInput.value = String(Math.round(zoomScale * 100));
  }
}

function applyViewTransform() {
  battlemapStage.style.transform = `translate(${panOffsetX}px, ${panOffsetY}px) scale(${zoomScale})`;
}

function resetView() {
  zoomScale = 0.5;
  panOffsetX = 0;
  panOffsetY = 0;
  updateZoomLabel();
  applyViewTransform();
}

function setZoom(nextZoom, anchorPoint = null) {
  const clampedZoom = Math.min(Math.max(nextZoom, 0.25), 2.5);
  if (anchorPoint && zoomScale > 0) {
    const localX = (anchorPoint.x - panOffsetX) / zoomScale;
    const localY = (anchorPoint.y - panOffsetY) / zoomScale;
    panOffsetX = anchorPoint.x - (localX * clampedZoom);
    panOffsetY = anchorPoint.y - (localY * clampedZoom);
  }
  zoomScale = clampedZoom;
  updateZoomLabel();
  applyViewTransform();
}

function cellCenterPosition(x, y) {
  const cellSize = battlemapCellSize();
  return {
    left: `${x * cellSize + (cellSize / 2)}px`,
    top: `${y * cellSize + (cellSize / 2)}px`,
  };
}

function updateSelectionInfo() {
  const modeLabel = obstacleEditEnabled
    ? "Hindernis-Modus aktiv."
    : fogEditMode === "wall"
      ? "Wandmodus aktiv."
      : fogEditMode === "door"
        ? "Tuermodus aktiv."
        : "Kein Token ausgewaehlt.";
  if (!currentBattlemap || !selectedTokenId) {
    battlemapSelectionInfo.textContent = modeLabel;
    if (battlemapUseActionButton) {
      battlemapUseActionButton.disabled = true;
    }
    fillSelectedTokenForm();
    return;
  }
  const token = currentBattlemap.tokens.find((item) => item.id === selectedTokenId);
  if (!token) {
    battlemapSelectionInfo.textContent = modeLabel;
    if (battlemapUseActionButton) {
      battlemapUseActionButton.disabled = true;
    }
    fillSelectedTokenForm();
    return;
  }
  const active = isActiveToken(token);
  battlemapSelectionInfo.textContent = `${token.name}: Ini ${token.initiative}, Schritte ${remainingSteps(token)}/${token.move_range}, Angriff ${token.attack_range}, Zug ${token.action_used ? "beendet" : "offen"}${tokenFreeMoveEnabled ? ", freies Verschieben" : ""}${active ? ", am Zug" : ""}`;
  if (battlemapUseActionButton) {
    battlemapUseActionButton.disabled = !active || isAnimatingMovement;
  }
  fillSelectedTokenForm();
}

function updateRoundBadge() {
  const roundNumber = currentBattlemap?.round_number || 1;
  battlemapRoundBadge.textContent = `Runde ${roundNumber}`;
  const token = activeToken();
  battlemapTurnBadge.textContent = token
    ? `Am Zug: ${token.name} (Ini ${token.initiative})`
    : "Keine aktive Figur";
  renderTurnOrder();
}

function renderTurnOrder() {
  const containers = [
    { list: battlemapSidebarTurnOrder, summary: battlemapSidebarTurnOrderSummary },
  ];
  for (const container of containers) {
    if (container.list) {
      container.list.innerHTML = "";
    }
  }
  const polygons = currentVisionPolygons();
  const tokens = Array.isArray(currentBattlemap?.tokens)
    ? currentBattlemap.tokens.filter((token) => isEnemyVisible(token, polygons))
    : [];
  if (!tokens.length) {
    for (const container of containers) {
      if (container.summary) {
        container.summary.textContent = "Keine Tokens vorhanden.";
      }
    }
    return;
  }
  const activeId = currentBattlemap?.active_token_id || "";
  const activeIndex = tokens.findIndex((item) => item.id === activeId);
  const summaryText = activeIndex >= 0
    ? `${activeIndex + 1}/${tokens.length} am Zug`
    : `${tokens.length} Tokens`;
  for (const container of containers) {
    if (container.summary) {
      container.summary.textContent = summaryText;
    }
  }
  for (const token of tokens) {
    for (const container of containers) {
      if (!container.list) {
        continue;
      }
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = `battlemap-turn-order-item${token.id === activeId ? " active-turn" : ""}${selectedTokenId === token.id ? " selected" : ""}${token.action_used ? " action-used" : ""}`;
      chip.addEventListener("click", () => {
        selectToken(token.id);
      });

      const marker = document.createElement("span");
      marker.className = "battlemap-turn-order-marker";
      marker.style.background = token.color || (token.type === "enemy" ? "#ff6b6b" : "#58c4ff");

      const name = document.createElement("span");
      name.className = "battlemap-turn-order-name";
      name.textContent = token.name || "Token";

      const meta = document.createElement("span");
      meta.className = "battlemap-turn-order-meta";
      meta.textContent = `Ini ${token.initiative} · ${token.action_used ? "fertig" : "offen"}`;

      chip.append(marker, name, meta);
      container.list.appendChild(chip);
    }
  }
}

function fillConfigForm() {
  if (!currentBattlemap) {
    battlemapNameInput.value = "";
    battlemapWidthInput.value = "";
    battlemapHeightInput.value = "";
    battlemapCellSizeInput.value = "";
    battlemapScaleInput.value = "";
    battlemapObstacleColorInput.value = "#7f858c";
    pendingObstacleColor = "";
    updateRoundBadge();
    return;
  }
  battlemapNameInput.value = currentBattlemap.name;
  battlemapWidthInput.value = String(currentBattlemap.grid_width);
  battlemapHeightInput.value = String(currentBattlemap.grid_height);
  battlemapCellSizeInput.value = String(currentBattlemap.cell_size);
  battlemapScaleInput.value = String(currentBattlemap.scale_percent);
  battlemapObstacleColorInput.value = normalizedObstacleColor(currentBattlemap.obstacle_color);
  pendingObstacleColor = normalizedObstacleColor(currentBattlemap.obstacle_color);
  updateRoundBadge();
}

function renderBattlemapList() {
  battlemapList.innerHTML = "";
  for (const item of currentBattlemaps) {
    const row = document.createElement("div");
    row.className = "chat-list-row";
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chat-list-item${item.id === currentSelectedBattlemapId ? " active" : ""}`;
    button.textContent = item.name;
    button.addEventListener("click", () => {
      currentSelectedBattlemapId = item.id;
      loadSelectedBattlemap({ resetViewport: true, preserveSelection: false }).catch((error) => {
        setBattlemapStatus(error.message);
      });
    });
    const badge = document.createElement("div");
    badge.className = "file-meta";
    badge.textContent = item.id === currentActiveBattlemapId ? "Aktiv" : `${item.grid_width}x${item.grid_height}`;
    row.append(button, badge);
    battlemapList.appendChild(row);
  }
}

function applyBoardSize() {
  const cellSize = battlemapCellSize();
  const { width, height } = gridSize();
  battlemapBoard.style.setProperty("--battlemap-cell-size", `${cellSize}px`);
  applyObstacleColorPreview(currentBattlemap?.obstacle_color);
  battlemapBoard.style.width = `${width * cellSize}px`;
  battlemapBoard.style.height = `${height * cellSize}px`;
}

function drawBattlemapStructures(svg) {
  if (!svg || !currentBattlemap || !canManageBattlemap()) {
    return;
  }
  const cellSize = battlemapCellSize();
  svg.setAttribute("viewBox", `0 0 ${currentBattlemap.grid_width * cellSize} ${currentBattlemap.grid_height * cellSize}`);
  svg.setAttribute("preserveAspectRatio", "none");
  const appendLine = (segment, className) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(Number(segment.x1) * cellSize));
    line.setAttribute("y1", String(Number(segment.y1) * cellSize));
    line.setAttribute("x2", String(Number(segment.x2) * cellSize));
    line.setAttribute("y2", String(Number(segment.y2) * cellSize));
    line.setAttribute("class", className);
    line.style.pointerEvents = "auto";
    svg.appendChild(line);
    return line;
  };
  const appendRect = (segment, className) => {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(Number(segment.x1) * cellSize));
    rect.setAttribute("y", String(Number(segment.y1) * cellSize));
    rect.setAttribute("width", String((Number(segment.x2) - Number(segment.x1)) * cellSize));
    rect.setAttribute("height", String((Number(segment.y2) - Number(segment.y1)) * cellSize));
    rect.setAttribute("class", className);
    rect.style.pointerEvents = "auto";
    svg.appendChild(rect);
    return rect;
  };
  for (const wall of currentBattlemap.fog_walls || []) {
    if (String(wall.shape || "") === "cell") {
      const rect = appendRect(wall, "battlemap-fog-block battlemap-fog-wall-block");
      rect.style.cursor = fogEditMode === "wall" ? "pointer" : "default";
      rect.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!canManageBattlemap() || fogEditMode !== "wall") {
          return;
        }
        try {
          await deleteBattlemapFogSegment("wall", wall);
          setBattlemapStatus("Wandfeld geloescht.");
        } catch (error) {
          setBattlemapStatus(error.message);
        }
      });
    } else {
      const line = appendLine(wall, "battlemap-fog-wall");
      line.style.cursor = fogEditMode === "wall" ? "pointer" : "default";
      line.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!canManageBattlemap() || fogEditMode !== "wall") {
          return;
        }
        try {
          await deleteBattlemapFogSegment("wall", wall);
          setBattlemapStatus("Wand geloescht.");
        } catch (error) {
          setBattlemapStatus(error.message);
        }
      });
    }
  }
  for (const door of currentBattlemap.fog_doors || []) {
    if (String(door.shape || "") === "cell") {
      const rect = appendRect(door, `battlemap-fog-block battlemap-fog-door-block ${door.is_open ? "open" : "closed"}`);
      rect.style.cursor = "pointer";
      rect.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!canManageBattlemap()) {
          return;
        }
        try {
          if (fogEditMode === "door") {
            await deleteBattlemapFogSegment("door", door);
            setBattlemapStatus("Tuerfeld geloescht.");
            return;
          }
          if (fogEditMode) {
            return;
          }
          const targetState = !door.is_open;
          const doorIds = collectGroupedDoorIds(door);
          for (const doorId of doorIds) {
            await toggleBattlemapDoor(doorId, targetState, false);
          }
          setBattlemapStatus(targetState ? "Tuergruppe geoeffnet." : "Tuergruppe geschlossen.");
        } catch (error) {
          setBattlemapStatus(error.message);
        }
      });
    } else {
      const line = appendLine(door, `battlemap-fog-door ${door.is_open ? "open" : "closed"}`);
      line.style.cursor = "pointer";
      line.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!canManageBattlemap()) {
          return;
        }
        try {
          if (fogEditMode === "door") {
            await deleteBattlemapFogSegment("door", door);
            setBattlemapStatus("Tuer geloescht.");
            return;
          }
          if (fogEditMode) {
            return;
          }
          await toggleBattlemapDoor(door.id, !door.is_open, false);
          setBattlemapStatus(door.is_open ? "Tuer geschlossen." : "Tuer geoeffnet.");
        } catch (error) {
          setBattlemapStatus(error.message);
        }
      });
    }
  }
}

function drawBattlemapFog(canvas) {
  if (!canvas || !currentBattlemap) {
    return;
  }
  const cellSize = battlemapCellSize();
  const width = currentBattlemap.grid_width * cellSize;
  const height = currentBattlemap.grid_height * cellSize;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }
  context.clearRect(0, 0, width, height);
  if (!currentBattlemap.fog_enabled || canManageBattlemap()) {
    return;
  }
  const tokens = battlemapVisibleTokensForFog();
  context.save();
  context.fillStyle = `rgba(5, 8, 10, ${battlemapFogAlpha()})`;
  context.fillRect(0, 0, width, height);
  context.globalCompositeOperation = "destination-out";
  for (const token of tokens) {
    const polygon = getBattlemapVisibilityPolygon(token);
    if (!polygon.points.length) {
      continue;
    }
    context.beginPath();
    context.moveTo(polygon.origin.x * cellSize, polygon.origin.y * cellSize);
    for (const point of polygon.points) {
      context.lineTo(point.x * cellSize, point.y * cellSize);
    }
    context.closePath();
    context.fill();
    context.beginPath();
    context.arc(
      polygon.origin.x * cellSize,
      polygon.origin.y * cellSize,
      Math.max(cellSize * 0.34, 12),
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  context.restore();
}

function renderGrid() {
  battlemapGrid.innerHTML = "";
  battlemapOverlay.innerHTML = "";
  battlemapTokenLayer.innerHTML = "";
  updateFogToolbar();
  if (!currentBattlemap) {
    return;
  }

  applyBoardSize();
  const cellSize = battlemapCellSize();
  const obstacleSet = obstacleCells();
  const reachableSet = new Set(reachableCells.map((cell) => obstacleKey(cell.x, cell.y)));
  const attackSet = new Set(attackCells.map((cell) => obstacleKey(cell.x, cell.y)));

  battlemapBackground.style.backgroundImage = currentBattlemap.background_image_url
    ? `url("${currentBattlemap.background_image_url}")`
    : "none";

  for (let y = 0; y < currentBattlemap.grid_height; y += 1) {
    for (let x = 0; x < currentBattlemap.grid_width; x += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "battlemap-cell";
      cell.style.left = `${x * cellSize}px`;
      cell.style.top = `${y * cellSize}px`;
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      const key = obstacleKey(x, y);
      if (obstacleSet.has(key)) {
        cell.classList.add("is-obstacle");
      }
      if (reachableSet.has(key)) {
        cell.classList.add("is-reachable");
      } else if (attackSet.has(key)) {
        cell.classList.add("is-attack-range");
      }
      cell.addEventListener("click", (event) => {
        handleCellClick(x, y, event).catch((error) => {
          setBattlemapStatus(error.message);
        });
      });
      battlemapGrid.appendChild(cell);
    }
  }

  const overlay = buildBattlemapFogOverlay();
  drawBattlemapFog(overlay.canvas);
  drawBattlemapStructures(overlay.svg);
  const visiblePolygons = currentVisionPolygons();

  for (const token of currentBattlemap.tokens) {
    if (!isEnemyVisible(token, visiblePolygons)) {
      continue;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = `battlemap-token token-${token.type}${token.id === selectedTokenId ? " selected" : ""}${isActiveToken(token) ? " active-turn" : ""}${token.action_used ? " action-used" : ""}`;
    if (token.visibility_layer === "gm") {
      button.classList.add("battlemap-token-gm-layer");
    }
    button.dataset.tokenId = token.id;
    const position = cellCenterPosition(token.x, token.y);
    button.style.left = position.left;
    button.style.top = position.top;
    button.style.background = token.color || (token.type === "enemy" ? "#ff6b6b" : "#58c4ff");
    const tokenLabel = token.name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    button.textContent = token.image_url ? "" : tokenLabel;
    if (token.image_url) {
      button.classList.add("has-image");
      const image = document.createElement("img");
      image.className = "battlemap-token-image";
      image.src = token.image_url;
      image.alt = token.name;
      button.appendChild(image);
    } else {
      button.classList.remove("has-image");
    }
    const assignedLabel = token.assigned_username ? ` | Spieler ${token.assigned_username}` : "";
    button.title = `${token.name} (${tokenTypeLabel(token.type)}) | Ini ${token.initiative} | Schritte ${remainingSteps(token)}/${token.move_range} | Sicht ${clampBattlemapVisionRange(token.vision_range)}${assignedLabel} | Zug ${token.action_used ? "beendet" : "offen"}`;
    button.addEventListener("click", (event) => {
      hideBattlemapLayerMenu();
      event.stopPropagation();
      handleTokenClick(token.id);
    });
    if (canManageBattlemap()) {
      button.addEventListener("mousedown", (event) => {
        if (event.button === 2) {
          event.preventDefault();
          event.stopPropagation();
        }
      });
      button.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        event.stopPropagation();
        selectToken(token.id);
        showBattlemapLayerMenu(token, event);
      });
    }
    battlemapTokenLayer.appendChild(button);
  }

  updateSelectionInfo();
}

function selectToken(tokenId) {
  selectedTokenId = tokenId;
  const token = currentBattlemap?.tokens.find((item) => item.id === tokenId) || null;
  if (!token || !isActiveToken(token)) {
    reachableCells = [];
    attackCells = token ? computeAttackCells(token) : [];
  } else {
    const movement = computeMovementData(token);
    reachableCells = movement.reachable;
    attackCells = computeAttackCells(token);
  }
  renderGrid();
}

function clearSelection() {
  selectedTokenId = "";
  tokenFreeMoveEnabled = false;
  reachableCells = [];
  attackCells = [];
  renderGrid();
}

function handleTokenClick(tokenId) {
  if (isAnimatingMovement) {
    return;
  }
  if (selectedTokenId === tokenId) {
    clearSelection();
    return;
  }
  selectToken(tokenId);
}

async function animateTokenMove(tokenId, path) {
  const tokenElement = battlemapTokenLayer.querySelector(`[data-token-id="${tokenId}"]`);
  if (!tokenElement || !path.length) {
    return;
  }
  for (const step of path) {
    const position = cellCenterPosition(step.x, step.y);
    tokenElement.style.left = position.left;
    tokenElement.style.top = position.top;
    await sleep(115);
  }
}

async function handleCellClick(x, y, event) {
  if (!currentBattlemap || isAnimatingMovement) {
    return;
  }
  if (fogEditMode && canManageBattlemap()) {
    const segment = fogCellShape(x, y);
    const targetEdgeKey = edgeKey(segment);
    if (fogEditMode === "wall") {
      const exists = (currentBattlemap.fog_walls || []).some((wall) => edgeKey(wall) === targetEdgeKey);
      if (exists) {
        await deleteBattlemapFogSegment("wall", segment);
        setBattlemapStatus("Wandfeld geloescht.");
        return;
      }
      await addBattlemapWall(segment);
      setBattlemapStatus("Wandfeld gespeichert.");
      return;
    }
    if (fogEditMode === "door") {
      const existingDoor = (currentBattlemap.fog_doors || []).find((door) => edgeKey(door) === targetEdgeKey);
      if (existingDoor) {
        await deleteBattlemapFogSegment("door", segment);
        setBattlemapStatus("Tuerfeld geloescht.");
        return;
      }
      await addBattlemapDoor(segment);
      setBattlemapStatus("Tuerfeld gespeichert.");
      return;
    }
  }
  if (obstacleEditEnabled) {
    const nextObstacles = currentBattlemap.obstacles.slice();
    const index = nextObstacles.findIndex((item) => item.x === x && item.y === y);
    if (index >= 0) {
      nextObstacles.splice(index, 1);
    } else {
      const occupied = currentBattlemap.tokens.some((item) => item.x === x && item.y === y);
      if (occupied) {
        setBattlemapStatus("Auf einem Token-Feld kann kein Hindernis gesetzt werden.");
        return;
      }
      nextObstacles.push({ x, y });
    }
    await updateObstacles(nextObstacles);
    return;
  }

  if (!selectedTokenId) {
    return;
  }

  const token = currentBattlemap.tokens.find((item) => item.id === selectedTokenId);
  if (!token) {
    clearSelection();
    return;
  }
  if (tokenFreeMoveEnabled) {
    const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/tokens/${selectedTokenId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y, ignore_turn_rules: true }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Token konnte nicht frei verschoben werden.");
    }
    applyBattlemap(data.battlemap);
    selectToken(selectedTokenId);
    setBattlemapStatus("Token frei verschoben.");
    setSelectedTokenStatus("Freie Position gespeichert.");
    return;
  }
  if (!isActiveToken(token)) {
    reachableCells = [];
    renderGrid();
    setBattlemapStatus("Dieser Token ist aktuell nicht am Zug.");
    return;
  }
  if (remainingSteps(token) <= 0) {
    setBattlemapStatus("Dieser Token hat keine Schritte mehr.");
    return;
  }

  const movement = computeMovementData(token);
  const path = pathFromParents(movement.parents, token.x, token.y, x, y);
  if (!path.length) {
    setBattlemapStatus("Zielfeld liegt ausserhalb der Bewegungsreichweite.");
    return;
  }

  isAnimatingMovement = true;
  setBattlemapStatus("Token bewegt sich...");
  try {
    await animateTokenMove(selectedTokenId, path);
    const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/tokens/${selectedTokenId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Token konnte nicht bewegt werden.");
    }
    applyBattlemap(data.battlemap);
    if (currentBattlemap?.active_token_id && currentBattlemap.active_token_id !== selectedTokenId) {
      selectToken(currentBattlemap.active_token_id);
    } else if (currentBattlemap?.tokens.some((item) => item.id === selectedTokenId)) {
      selectToken(selectedTokenId);
    } else {
      clearSelection();
    }
    setBattlemapStatus(currentBattlemap?.active_token_id === selectedTokenId ? "Token bewegt." : "Token bewegt, Zug weitergegeben.");
  } finally {
    isAnimatingMovement = false;
    updateSelectionInfo();
  }
}

function applyBattlemap(battlemap) {
  currentBattlemap = battlemap;
  currentSelectedBattlemapId = battlemap?.id || "";
  if (selectedTokenId && !battlemap?.tokens.some((item) => item.id === selectedTokenId)) {
    selectedTokenId = "";
  }
  fillConfigForm();
  renderBattlemapList();
  renderGrid();
}

async function loadBattlemaps() {
  if (Date.now() < battlemapSuppressRefreshUntil) {
    return;
  }
  const response = await fetch(`/api/battlemaps?ts=${Date.now()}`, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Battlemaps konnten nicht geladen werden.");
  }
  if (followSurfaceState(data.active_surface)) {
    return;
  }
  currentBattlemaps = data.battlemaps || [];
  currentActiveBattlemapId = data.active_battlemap_id || "";
  const selectedChanged = !currentSelectedBattlemapId || !currentBattlemaps.some((item) => item.id === currentSelectedBattlemapId);
  if (!currentSelectedBattlemapId || !currentBattlemaps.some((item) => item.id === currentSelectedBattlemapId)) {
    currentSelectedBattlemapId = currentActiveBattlemapId || currentBattlemaps[0]?.id || "";
  }
  renderBattlemapList();
  if (currentSelectedBattlemapId) {
    await loadSelectedBattlemap({ resetViewport: selectedChanged, preserveSelection: !selectedChanged });
  }
}

async function loadSelectedBattlemap(options = {}) {
  const { resetViewport = false, preserveSelection = false } = options;
  if (Date.now() < battlemapSuppressRefreshUntil) {
    return;
  }
  if (!currentSelectedBattlemapId) {
    applyBattlemap(null);
    return;
  }
  const response = await fetch(`/api/battlemaps/${currentSelectedBattlemapId}?ts=${Date.now()}`, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Battlemap konnte nicht geladen werden.");
  }
  if (!preserveSelection) {
    clearSelection();
  }
  applyBattlemap(data.battlemap);
  if (resetViewport) {
    resetView();
  }
  battlemapListStatus.textContent = data.battlemap.id === currentActiveBattlemapId
    ? "Diese Battlemap ist aktuell aktiv."
    : "Battlemap lokal ausgewaehlt.";
  setBattlemapStatus("Bereit");
}

async function createBattlemap() {
  const formData = new FormData();
  formData.append("name", battlemapCreateName.value.trim() || "Neue Battlemap");
  formData.append("grid_width", battlemapCreateWidth.value || "12");
  formData.append("grid_height", battlemapCreateHeight.value || "8");
  formData.append("cell_size", battlemapCreateCellSize.value || "72");
  formData.append("scale_percent", battlemapCreateScale.value || "100");
  formData.append("obstacle_color", normalizedObstacleColor(battlemapCreateObstacleColor.value));
  const background = battlemapCreateBackground.files?.[0];
  if (background) {
    formData.append("background", background);
  }
  const response = await fetch("/api/battlemaps", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Battlemap konnte nicht angelegt werden.");
  }
  battlemapCreateName.value = "";
  battlemapCreateBackground.value = "";
  battlemapCreateObstacleColor.value = "#7f858c";
  currentSelectedBattlemapId = data.battlemap.id;
  await loadBattlemaps();
}

async function saveBattlemapConfig() {
  if (!currentBattlemap) {
    return;
  }
  const obstacleColor = normalizedObstacleColor(pendingObstacleColor || battlemapObstacleColorInput.value || currentBattlemap.obstacle_color);
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: battlemapNameInput.value.trim() || currentBattlemap.name,
      grid_width: Number(battlemapWidthInput.value || currentBattlemap.grid_width),
      grid_height: Number(battlemapHeightInput.value || currentBattlemap.grid_height),
      cell_size: Number(battlemapCellSizeInput.value || currentBattlemap.cell_size),
      scale_percent: Number(battlemapScaleInput.value || currentBattlemap.scale_percent),
      obstacle_color: obstacleColor,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Battlemap-Konfiguration konnte nicht gespeichert werden.");
  }
  let nextBattlemap = data.battlemap;
  if (battlemapBackgroundInput.files?.[0]) {
    const backgroundData = new FormData();
    backgroundData.append("background", battlemapBackgroundInput.files[0]);
    const backgroundResponse = await fetch(`/api/battlemaps/${currentBattlemap.id}/background`, {
      method: "POST",
      body: backgroundData,
    });
    const backgroundPayload = await backgroundResponse.json();
    if (!backgroundResponse.ok) {
      throw new Error(backgroundPayload.detail || "Hintergrund konnte nicht aktualisiert werden.");
    }
    battlemapBackgroundInput.value = "";
    nextBattlemap = backgroundPayload.battlemap;
  }
  applyBattlemap(nextBattlemap);
  if (battlemapObstacleColorInput) {
    battlemapObstacleColorInput.value = normalizedObstacleColor(nextBattlemap.obstacle_color);
  }
  pendingObstacleColor = normalizedObstacleColor(nextBattlemap.obstacle_color);
  await loadBattlemaps();
}

async function activateBattlemap() {
  if (!currentBattlemap) {
    return;
  }
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/activate`, { method: "PATCH" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Battlemap konnte nicht aktiviert werden.");
  }
  currentActiveBattlemapId = data.battlemap.id;
  await loadBattlemaps();
}

async function updateObstacles(obstacles) {
  if (!currentBattlemap) {
    return;
  }
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/obstacles`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ obstacles }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Hindernisse konnten nicht gespeichert werden.");
  }
  applyBattlemap(data.battlemap);
  setBattlemapStatus("Hindernisse gespeichert.");
}

async function updateBattlemapFogEnabled(enabled) {
  if (!currentBattlemap) {
    return;
  }
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/fog`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Nebelstatus konnte nicht gespeichert werden.");
  }
  applyBattlemap(data.battlemap);
}

async function addBattlemapWall(segment) {
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/fog/walls`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(segment),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Wand konnte nicht gespeichert werden.");
  }
  applyBattlemap(data.battlemap);
}

async function addBattlemapDoor(segment) {
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/fog/doors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(segment),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Tuer konnte nicht gespeichert werden.");
  }
  applyBattlemap(data.battlemap);
}

async function toggleBattlemapDoor(doorId, isOpen, rerender = true) {
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/fog/doors/${doorId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_open: isOpen }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Tuer konnte nicht aktualisiert werden.");
  }
  applyBattlemap(data.battlemap);
  if (rerender) {
    renderGrid();
  }
}

async function deleteLastBattlemapFogElement(elementType) {
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/fog/elements/last?element_type=${encodeURIComponent(elementType || "")}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Element konnte nicht geloescht werden.");
  }
  applyBattlemap(data.battlemap);
}

async function deleteBattlemapFogSegment(elementType, segment) {
  const params = new URLSearchParams({
    x1: String(segment.x1),
    y1: String(segment.y1),
    x2: String(segment.x2),
    y2: String(segment.y2),
  });
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/fog/${encodeURIComponent(elementType)}?${params.toString()}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Fog-Element konnte nicht geloescht werden.");
  }
  applyBattlemap(data.battlemap);
}

async function addToken() {
  if (!currentBattlemap) {
    return;
  }
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: battlemapTokenNameInput.value.trim() || "Token",
      type: battlemapTokenTypeInput.value,
      x: Number(battlemapTokenXInput.value || 0),
      y: Number(battlemapTokenYInput.value || 0),
      color: battlemapTokenColorInput.value,
      initiative: Number(battlemapTokenInitiativeInput.value || 10),
      move_range: Number(battlemapTokenMoveInput.value || 4),
      attack_range: Number(battlemapTokenAttackInput.value || 1),
      vision_range: clampBattlemapVisionRange(battlemapTokenVisionInput?.value || 6),
      assigned_user_id: String(battlemapTokenAssignedUserInput?.value || ""),
      visibility_layer: battlemapTokenLayerInput?.checked ? "gm" : "public",
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Token konnte nicht hinzugefuegt werden.");
  }
  battlemapTokenNameInput.value = "";
  if (battlemapTokenLayerInput) {
    battlemapTokenLayerInput.checked = false;
  }
  if (battlemapTokenAssignedUserInput) {
    battlemapTokenAssignedUserInput.value = "";
  }
  applyBattlemap(data.battlemap);
  setBattlemapStatus("Token hinzugefuegt.");
}

async function saveSelectedToken() {
  if (!currentBattlemap || !selectedTokenId) {
    return;
  }
  suspendBattlemapRefresh();
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/tokens/${selectedTokenId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: battlemapSelectedTokenNameInput.value.trim() || "Token",
      type: battlemapSelectedTokenTypeInput.value,
      color: battlemapSelectedTokenColorInput.value,
      x: Number(battlemapSelectedTokenXInput.value || 0),
      y: Number(battlemapSelectedTokenYInput.value || 0),
      move_range: Number(battlemapSelectedTokenMoveInput.value || 4),
      attack_range: Number(battlemapSelectedTokenAttackInput.value || 1),
      vision_range: clampBattlemapVisionRange(battlemapSelectedTokenVisionInput?.value || 6),
      assigned_user_id: String(battlemapSelectedTokenAssignedUserInput?.value || ""),
      initiative: Number(battlemapSelectedTokenInitiativeInput.value || 10),
      ignore_turn_rules: true,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Token konnte nicht gespeichert werden.");
  }
  applyBattlemap(data.battlemap);
  selectToken(selectedTokenId);
  setBattlemapStatus("Token gespeichert.");
  setSelectedTokenStatus("Token-Daten aktualisiert.");
}

async function updateTokenVisibilityLayer(tokenId, visibilityLayer) {
  if (!currentBattlemap || !tokenId) {
    return;
  }
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/tokens/${tokenId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visibility_layer: visibilityLayer, ignore_turn_rules: true }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Token-Ebene konnte nicht aktualisiert werden.");
  }
  applyBattlemap(data.battlemap);
  if (currentBattlemap?.tokens.some((item) => item.id === tokenId)) {
    selectToken(tokenId);
  } else {
    clearSelection();
  }
}

async function deleteSelectedToken() {
  if (!currentBattlemap || !selectedTokenId) {
    return;
  }
  const tokenId = selectedTokenId;
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/tokens/${tokenId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Token konnte nicht geloescht werden.");
  }
  applyBattlemap(data.battlemap);
  clearSelection();
  setBattlemapStatus("Token geloescht.");
  setSelectedTokenStatus("Token entfernt.");
}

async function uploadSelectedTokenImage() {
  if (!currentBattlemap || !selectedTokenId || !battlemapSelectedTokenImageInput.files?.[0]) {
    return;
  }
  const formData = new FormData();
  formData.append("image", battlemapSelectedTokenImageInput.files[0]);
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/tokens/${selectedTokenId}/image`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Token-Bild konnte nicht gespeichert werden.");
  }
  applyBattlemap(data.battlemap);
  selectToken(selectedTokenId);
  battlemapSelectedTokenImageInput.value = "";
  setBattlemapStatus("Token-Bild gespeichert.");
  setSelectedTokenStatus("Token-Bild aktualisiert.");
}

async function endTurn() {
  if (!currentBattlemap || !selectedTokenId) {
    return;
  }
  const token = currentBattlemap.tokens.find((item) => item.id === selectedTokenId);
  if (!token) {
    clearSelection();
    return;
  }
  if (!isActiveToken(token)) {
    throw new Error("Dieser Token ist aktuell nicht am Zug.");
  }
  const response = await fetch(`/api/battlemaps/${currentBattlemap.id}/tokens/${selectedTokenId}/end-turn`, { method: "POST" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Zug konnte nicht beendet werden.");
  }
  applyBattlemap(data.battlemap);
  if (currentBattlemap?.active_token_id && currentBattlemap.active_token_id !== selectedTokenId) {
    selectToken(currentBattlemap.active_token_id);
  } else if (currentBattlemap?.tokens.some((item) => item.id === selectedTokenId)) {
    selectToken(selectedTokenId);
  } else {
    clearSelection();
  }
  setBattlemapStatus(currentBattlemap?.active_token_id === selectedTokenId ? "Zug beendet." : "Zug beendet, naechster Token ist dran.");
}

battlemapCreateButton.addEventListener("click", async () => {
  battlemapCreateButton.disabled = true;
  battlemapListStatus.textContent = "Battlemap wird angelegt...";
  try {
    await createBattlemap();
    battlemapListStatus.textContent = "Battlemap erstellt.";
  } catch (error) {
    battlemapListStatus.textContent = error.message;
    setBattlemapStatus(error.message);
  } finally {
    battlemapCreateButton.disabled = false;
  }
});

battlemapSaveButton.addEventListener("click", async () => {
  battlemapSaveButton.disabled = true;
  setBattlemapStatus("Battlemap wird gespeichert...");
  try {
    await saveBattlemapConfig();
    setBattlemapStatus("Battlemap gespeichert.");
  } catch (error) {
    setBattlemapStatus(error.message);
  } finally {
    battlemapSaveButton.disabled = false;
  }
});

battlemapActivateButton.addEventListener("click", async () => {
  battlemapActivateButton.disabled = true;
  try {
    await activateBattlemap();
    setBattlemapStatus("Battlemap aktiviert.");
  } catch (error) {
    setBattlemapStatus(error.message);
  } finally {
    battlemapActivateButton.disabled = false;
  }
});

battlemapAddTokenButton.addEventListener("click", async () => {
  battlemapAddTokenButton.disabled = true;
  try {
    await addToken();
    battlemapTokenStatus.textContent = "Token gespeichert.";
  } catch (error) {
    battlemapTokenStatus.textContent = error.message;
    setBattlemapStatus(error.message);
  } finally {
    battlemapAddTokenButton.disabled = false;
  }
});

battlemapSelectedTokenSaveButton.addEventListener("click", async () => {
  battlemapSelectedTokenSaveButton.disabled = true;
  try {
    await saveSelectedToken();
  } catch (error) {
    setBattlemapStatus(error.message);
    setSelectedTokenStatus(error.message);
  } finally {
    battlemapSelectedTokenSaveButton.disabled = false;
    fillSelectedTokenForm();
  }
});

battlemapSelectedTokenDeleteButton.addEventListener("click", async () => {
  battlemapSelectedTokenDeleteButton.disabled = true;
  try {
    await deleteSelectedToken();
  } catch (error) {
    setBattlemapStatus(error.message);
    setSelectedTokenStatus(error.message);
  } finally {
    battlemapSelectedTokenDeleteButton.disabled = false;
    fillSelectedTokenForm();
  }
});

battlemapSelectedTokenMoveToggle.addEventListener("click", () => {
  tokenFreeMoveEnabled = !tokenFreeMoveEnabled;
  battlemapSelectedTokenMoveToggle.textContent = tokenFreeMoveEnabled ? "Freies Verschieben an" : "Freies Verschieben aus";
  updateSelectionInfo();
  setSelectedTokenStatus(tokenFreeMoveEnabled ? "Klicke auf ein freies Feld fuer die neue Position." : "Freies Verschieben beendet.");
});

battlemapSelectedTokenImageInput.addEventListener("change", async () => {
  if (!battlemapSelectedTokenImageInput.files?.length) {
    return;
  }
  try {
    await uploadSelectedTokenImage();
  } catch (error) {
    setBattlemapStatus(error.message);
    setSelectedTokenStatus(error.message);
  } finally {
    fillSelectedTokenForm();
  }
});

battlemapSelectedTokenAssignedUserInput.addEventListener("change", async () => {
  if (!selectedTokenId || !currentBattlemap) {
    return;
  }
  const selectedUserId = String(battlemapSelectedTokenAssignedUserInput.value || "");
  const selectedUser = battlemapAssignableUsers.find((user) => user.id === selectedUserId) || null;
  currentBattlemap = {
    ...currentBattlemap,
    tokens: (currentBattlemap.tokens || []).map((token) => (
      token.id === selectedTokenId
        ? {
            ...token,
            assigned_user_id: selectedUserId,
            assigned_username: selectedUser ? selectedUser.username : "",
          }
        : token
    )),
  };
  fillSelectedTokenForm();
  battlemapSelectedTokenAssignedUserInput.disabled = true;
  setSelectedTokenStatus("Spielerzuordnung wird gespeichert...");
  try {
    await saveSelectedToken();
  } catch (error) {
    setBattlemapStatus(error.message);
    setSelectedTokenStatus(error.message);
  } finally {
    battlemapSelectedTokenAssignedUserInput.disabled = false;
    fillSelectedTokenForm();
  }
});

battlemapFogToggle.addEventListener("click", async () => {
  if (!currentBattlemap) {
    return;
  }
  battlemapFogToggle.disabled = true;
  try {
    await updateBattlemapFogEnabled(!currentBattlemap.fog_enabled);
    setBattlemapStatus(currentBattlemap?.fog_enabled ? "Nebel aktiviert." : "Nebel deaktiviert.");
  } catch (error) {
    setBattlemapStatus(error.message);
  } finally {
    battlemapFogToggle.disabled = false;
    updateFogToolbar();
  }
});

battlemapWallModeToggle.addEventListener("click", () => {
  obstacleEditEnabled = false;
  fogEditMode = fogEditMode === "wall" ? "" : "wall";
  clearSelection();
  updateFogToolbar();
});

battlemapDoorModeToggle.addEventListener("click", () => {
  obstacleEditEnabled = false;
  fogEditMode = fogEditMode === "door" ? "" : "door";
  clearSelection();
  updateFogToolbar();
});

battlemapFogDeleteLastButton.addEventListener("click", async () => {
  if (!currentBattlemap) {
    return;
  }
  battlemapFogDeleteLastButton.disabled = true;
  try {
    await deleteLastBattlemapFogElement(fogEditMode);
    setBattlemapStatus("Letztes Fog-Element geloescht.");
  } catch (error) {
    setBattlemapStatus(error.message);
  } finally {
    battlemapFogDeleteLastButton.disabled = false;
    updateFogToolbar();
  }
});

battlemapObstacleToggle.addEventListener("click", () => {
  fogEditMode = "";
  obstacleEditEnabled = !obstacleEditEnabled;
  battlemapObstacleToggle.textContent = obstacleEditEnabled ? "Hindernis-Modus beenden" : "Hindernisse bearbeiten";
  clearSelection();
  updateFogToolbar();
});

battlemapObstacleClearButton.addEventListener("click", async () => {
  if (!currentBattlemap) {
    return;
  }
  try {
    await updateObstacles([]);
  } catch (error) {
    setBattlemapStatus(error.message);
  }
});

battlemapSelectionClearButton.addEventListener("click", () => {
  clearSelection();
});

battlemapUseActionButton.addEventListener("click", async () => {
  battlemapUseActionButton.disabled = true;
  try {
    await endTurn();
  } catch (error) {
    setBattlemapStatus(error.message);
  } finally {
    updateSelectionInfo();
  }
});

battlemapBackButton.addEventListener("click", () => {
  if (!canManageBattlemap()) {
    return;
  }
  fetch("/api/live-surface/map", { method: "PATCH" })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Kampf konnte nicht beendet werden.");
      }
      window.location.href = battlemapHomePath();
    })
    .catch((error) => {
      setBattlemapStatus(error.message);
    });
});

battlemapTokenTypeInput.addEventListener("change", syncTokenColorWithType);

if (battlemapObstacleColorInput) {
  battlemapObstacleColorInput.addEventListener("input", () => {
    const nextColor = normalizedObstacleColor(battlemapObstacleColorInput.value);
    pendingObstacleColor = nextColor;
    if (currentBattlemap) {
      currentBattlemap.obstacle_color = nextColor;
    }
    applyObstacleColorPreview(nextColor);
  });
  battlemapObstacleColorInput.addEventListener("change", async () => {
    if (!currentBattlemap) {
      return;
    }
    battlemapSaveButton.disabled = true;
    setBattlemapStatus("Hindernisfarbe wird gespeichert...");
    try {
      await saveBattlemapConfig();
      setBattlemapStatus("Hindernisfarbe gespeichert.");
    } catch (error) {
      setBattlemapStatus(error.message);
    } finally {
      battlemapSaveButton.disabled = false;
    }
  });
  battlemapObstacleColorInput.addEventListener("blur", async () => {
    if (!currentBattlemap || !pendingObstacleColor) {
      return;
    }
    const savedColor = normalizedObstacleColor(currentBattlemap.obstacle_color);
    if (pendingObstacleColor === savedColor) {
      battlemapObstacleColorInput.value = pendingObstacleColor;
      return;
    }
    battlemapObstacleColorInput.value = pendingObstacleColor;
    battlemapSaveButton.disabled = true;
    setBattlemapStatus("Hindernisfarbe wird gespeichert...");
    try {
      await saveBattlemapConfig();
      setBattlemapStatus("Hindernisfarbe gespeichert.");
    } catch (error) {
      setBattlemapStatus(error.message);
    } finally {
      battlemapSaveButton.disabled = false;
    }
  });
}

if (battlemapZoomInput) {
  battlemapZoomInput.addEventListener("input", () => {
    setZoom(Number(battlemapZoomInput.value || 100) / 100);
  });
}

battlemapScroller.addEventListener("wheel", (event) => {
  if (!currentBattlemap) {
    return;
  }
  event.preventDefault();
  const delta = event.deltaY < 0 ? 0.1 : -0.1;
  const rect = battlemapScroller.getBoundingClientRect();
  setZoom(zoomScale + delta, {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  });
}, { passive: false });

battlemapScroller.addEventListener("mousedown", (event) => {
  if (!currentBattlemap || event.button !== 2) {
    return;
  }
  event.preventDefault();
  panState = {
    startX: event.clientX,
    startY: event.clientY,
    offsetX: panOffsetX,
    offsetY: panOffsetY,
  };
  battlemapScroller.classList.add("map-panning");
});

battlemapScroller.addEventListener("mousemove", (event) => {
  if (!panState) {
    return;
  }
  event.preventDefault();
  panOffsetX = panState.offsetX + (event.clientX - panState.startX);
  panOffsetY = panState.offsetY + (event.clientY - panState.startY);
  applyViewTransform();
});

function endPan() {
  if (!panState) {
    return;
  }
  panState = null;
  battlemapScroller.classList.remove("map-panning");
}

battlemapScroller.addEventListener("mouseup", endPan);
battlemapScroller.addEventListener("mouseleave", endPan);
battlemapScroller.addEventListener("contextmenu", (event) => {
  if (currentBattlemap) {
    event.preventDefault();
  }
});

initializeAuthUi({ required: false })
  .then(async () => {
    await loadBattlemapAssignableUsers();
    initPanelLayout({
      rootSelector: "#battlemapAppShell",
      storageKey: "eldran_battlemap_panels",
    });
    initCommandChat({
      listElement: battlemapCommandChatMessages,
      formElement: battlemapCommandChatForm,
      inputElement: battlemapCommandChatInput,
      statusElement: battlemapCommandChatStatus,
      clearButton: battlemapCommandChatClearButton,
    });
    initSharedMusicPlayer({
      audioElement: battlemapMusicAudio,
      statusElement: battlemapMusicStatus,
      sourceElement: battlemapMusicSource,
      volumeWrapElement: battlemapMusicVolumeWrap,
      volumeInputElement: battlemapMusicVolumeInput,
      muteButtonElement: battlemapMusicMuteButton,
      managerWrapElement: battlemapMusicManagerWrap,
      playButtonElement: battlemapMusicPlayButton,
      pauseButtonElement: battlemapMusicPauseButton,
      clearButtonElement: battlemapMusicClearButton,
      canManage: canManageBattlemap(),
    });
    initProjectSelector({
      selectElement: projectSelect,
      createInputElement: projectNameInput,
      createButtonElement: projectCreateButton,
      playerListElement: projectPlayerList,
      statusElement: projectStatus,
      onProjectChanged: async () => {
        await loadBattlemaps();
      },
    });
    syncBattlemapAccessMode();
    initializeBattlemapSections();
    syncTokenColorWithType();
    resetView();
    await loadBattlemaps();
    setInterval(() => {
      loadBattlemaps().catch(() => {});
    }, 3000);
  })
  .catch((error) => {
    setBattlemapStatus(error.message);
  });

window.addEventListener("eldran:project-changed", () => {
  loadBattlemaps().catch(() => {});
});
