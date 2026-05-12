const remoteMapImage = document.getElementById("remoteMapImage");
const remoteMapFrame = document.getElementById("remoteMapFrame");
const remoteMapDrawingCanvas = document.getElementById("remoteMapDrawingCanvas");
const remoteMapStage = document.getElementById("remoteMapStage");
const remoteMapOverlayLayer = document.getElementById("remoteMapOverlayLayer");
const remoteMapPinLayer = document.getElementById("remoteMapPinLayer");
const remoteMapEmptyState = document.getElementById("remoteMapEmptyState");
const remoteMapImageInput = document.getElementById("remoteMapImageInput");
const remoteMapUploadStatus = document.getElementById("remoteMapUploadStatus");
const remoteMapControls = document.getElementById("remoteMapControls");
const remoteMapManageControls = document.getElementById("remoteMapManageControls");
const remoteMapStatusText = document.getElementById("remoteMapStatusText");
const remoteMapZoomInput = document.getElementById("remoteMapZoomInput");
const remoteMapZoomValue = document.getElementById("remoteMapZoomValue");
const remoteMapNameInput = document.getElementById("remoteMapNameInput");
const remoteMapCreateImageInput = document.getElementById("remoteMapCreateImageInput");
const remoteMapCreateBackgroundColorInput = document.getElementById("remoteMapCreateBackgroundColorInput");
const remoteMapCreateButton = document.getElementById("remoteMapCreateButton");
const remoteMapRenameInput = document.getElementById("remoteMapRenameInput");
const remoteMapRenameButton = document.getElementById("remoteMapRenameButton");
const remoteMapActivateButton = document.getElementById("remoteMapActivateButton");
const remoteMapDeleteButton = document.getElementById("remoteMapDeleteButton");
const remoteMapListStatus = document.getElementById("remoteMapListStatus");
const remoteMapList = document.getElementById("remoteMapList");
const remoteMapLayerSelect = document.getElementById("remoteMapLayerSelect");
const remoteMapLayerSelectWrap = document.getElementById("remoteMapLayerSelectWrap");
const remoteMapLayerNavigatorWrap = document.getElementById("remoteMapLayerNavigatorWrap");
const remoteMapLayerNavigatorToggle = document.getElementById("remoteMapLayerNavigatorToggle");
const remoteMapLayerNavigatorBody = document.getElementById("remoteMapLayerNavigatorBody");
const remoteMapLayerStack = document.getElementById("remoteMapLayerStack");
const remoteMapLayerUpButton = document.getElementById("remoteMapLayerUpButton");
const remoteMapLayerDownButton = document.getElementById("remoteMapLayerDownButton");
const remoteMapLayerStatus = document.getElementById("remoteMapLayerStatus");
const remoteMapLayerNameInput = document.getElementById("remoteMapLayerNameInput");
const remoteMapLayerImageInput = document.getElementById("remoteMapLayerImageInput");
const remoteMapLayerBackgroundWrap = document.getElementById("remoteMapLayerBackgroundWrap");
const remoteMapLayerBackgroundColorInput = document.getElementById("remoteMapLayerBackgroundColorInput");
const remoteMapLayerCreateButton = document.getElementById("remoteMapLayerCreateButton");
const remoteMapLayerRenameButton = document.getElementById("remoteMapLayerRenameButton");
const remoteMapLayerManagerWrap = document.getElementById("remoteMapLayerManagerWrap");
const remoteMapLayerImageWrap = document.getElementById("remoteMapLayerImageWrap");
const remoteMapLayerRenameWrap = document.getElementById("remoteMapLayerRenameWrap");
const remoteMapLayerGmWrap = document.getElementById("remoteMapLayerGmWrap");
const remoteMapShowGmLayerInput = document.getElementById("remoteMapShowGmLayerInput");
const remoteMapCreateOnGmWrap = document.getElementById("remoteMapCreateOnGmWrap");
const remoteMapCreateOnGmInput = document.getElementById("remoteMapCreateOnGmInput");
const remoteMapFogEnabledWrap = document.getElementById("remoteMapFogEnabledWrap");
const remoteMapFogEnabledInput = document.getElementById("remoteMapFogEnabledInput");
const remoteMapFogManagerWrap = document.getElementById("remoteMapFogManagerWrap");
const remoteMapFogWallModeButton = document.getElementById("remoteMapFogWallModeButton");
const remoteMapFogDoorModeButton = document.getElementById("remoteMapFogDoorModeButton");
const remoteMapFogDeleteWallButton = document.getElementById("remoteMapFogDeleteWallButton");
const remoteMapFogClearExploredButton = document.getElementById("remoteMapFogClearExploredButton");
const remoteMapTitle = document.getElementById("remoteMapTitle");
const remoteMapPinNameInput = document.getElementById("remoteMapPinNameInput");
const remoteMapPinDescriptionInput = document.getElementById("remoteMapPinDescriptionInput");
const remoteMapPinImageInput = document.getElementById("remoteMapPinImageInput");
const remoteMapPinHiddenInput = document.getElementById("remoteMapPinHiddenInput");
const remoteMapPinTargetMapSelect = document.getElementById("remoteMapPinTargetMapSelect");
const remoteMapPinPlacementButton = document.getElementById("remoteMapPinPlacementButton");
const remoteMapPinStatus = document.getElementById("remoteMapPinStatus");
const remoteMapTokenNameInput = document.getElementById("remoteMapTokenNameInput");
const remoteMapTokenAssignedUserSelect = document.getElementById("remoteMapTokenAssignedUserSelect");
const remoteMapTokenImageInput = document.getElementById("remoteMapTokenImageInput");
const remoteMapTokenVisionInput = document.getElementById("remoteMapTokenVisionInput");
const remoteMapTokenVisionValue = document.getElementById("remoteMapTokenVisionValue");
const remoteMapTokenLayerInput = document.getElementById("remoteMapTokenLayerInput");
const remoteMapTokenPlacementButton = document.getElementById("remoteMapTokenPlacementButton");
const remoteMapTokenStatus = document.getElementById("remoteMapTokenStatus");
const remoteMapSoundTokenNameInput = document.getElementById("remoteMapSoundTokenNameInput");
const remoteMapSoundTokenFileInput = document.getElementById("remoteMapSoundTokenFileInput");
const remoteMapSoundTokenLayerInput = document.getElementById("remoteMapSoundTokenLayerInput");
const remoteMapSoundTokenPlacementButton = document.getElementById("remoteMapSoundTokenPlacementButton");
const remoteMapSoundTokenStatus = document.getElementById("remoteMapSoundTokenStatus");
const remoteMapDrawColorInput = document.getElementById("remoteMapDrawColorInput");
const remoteMapDrawWidthInput = document.getElementById("remoteMapDrawWidthInput");
const remoteMapDrawWidthValue = document.getElementById("remoteMapDrawWidthValue");
const remoteMapDrawingsClearButton = document.getElementById("remoteMapDrawingsClearButton");
const remoteMapPinDetailCard = document.getElementById("remoteMapPinDetailCard");
const remoteMapPinDetailHeader = document.getElementById("remoteMapPinDetailHeader");
const remoteMapPinDetailName = document.getElementById("remoteMapPinDetailName");
const remoteMapPinDetailDescription = document.getElementById("remoteMapPinDetailDescription");
const remoteMapPinDetailImageInput = document.getElementById("remoteMapPinDetailImageInput");
const remoteMapPinDetailImageLabel = document.getElementById("remoteMapPinDetailImageLabel");
const remoteMapPinDetailShowLabel = document.getElementById("remoteMapPinDetailShowLabel");
const remoteMapPinDetailShowLabelWrap = document.getElementById("remoteMapPinDetailShowLabelWrap");
const remoteMapPinDetailHidden = document.getElementById("remoteMapPinDetailHidden");
const remoteMapPinDetailHiddenWrap = document.getElementById("remoteMapPinDetailHiddenWrap");
const remoteMapPinDetailAssignedWrap = document.getElementById("remoteMapPinDetailAssignedWrap");
const remoteMapPinDetailAssignedUser = document.getElementById("remoteMapPinDetailAssignedUser");
const remoteMapPinDetailVisionWrap = document.getElementById("remoteMapPinDetailVisionWrap");
const remoteMapPinDetailVisionInput = document.getElementById("remoteMapPinDetailVisionInput");
const remoteMapPinDetailVisionValue = document.getElementById("remoteMapPinDetailVisionValue");
const remoteMapPinDetailLinkedMapWrap = document.getElementById("remoteMapPinDetailLinkedMapWrap");
const remoteMapPinDetailLinkedMap = document.getElementById("remoteMapPinDetailLinkedMap");
const remoteMapPinDetailLinkedMapActions = document.getElementById("remoteMapPinDetailLinkedMapActions");
const remoteMapPinDetailActivateMapButton = document.getElementById("remoteMapPinDetailActivateMapButton");
const remoteMapPinDetailLinkedMapStatus = document.getElementById("remoteMapPinDetailLinkedMapStatus");
const remoteMapPinDetailSoundLabel = document.getElementById("remoteMapPinDetailSoundLabel");
const remoteMapPinDetailSoundInput = document.getElementById("remoteMapPinDetailSoundInput");
const remoteMapPinDetailSoundWrap = document.getElementById("remoteMapPinDetailSoundWrap");
const remoteMapPinDetailSoundPlayButton = document.getElementById("remoteMapPinDetailSoundPlayButton");
const remoteMapPinDetailSoundStatus = document.getElementById("remoteMapPinDetailSoundStatus");
const remoteMapPinDetailGroupWrap = document.getElementById("remoteMapPinDetailGroupWrap");
const remoteMapPinGroupButton = document.getElementById("remoteMapPinGroupButton");
const remoteMapPinUngroupButton = document.getElementById("remoteMapPinUngroupButton");
const remoteMapPinGroupStatus = document.getElementById("remoteMapPinGroupStatus");
const remoteMapPinDetailImage = document.getElementById("remoteMapPinDetailImage");
const remoteMapPinDetailCloseButton = document.getElementById("remoteMapPinDetailCloseButton");
const remoteMapPinSaveButton = document.getElementById("remoteMapPinSaveButton");
const remoteMapPinDeleteButton = document.getElementById("remoteMapPinDeleteButton");
const remoteMapMusicAudio = document.getElementById("remoteMapMusicAudio");
const remoteMapMusicVolumeWrap = document.getElementById("remoteMapMusicVolumeWrap");
const remoteMapMusicVolumeInput = document.getElementById("remoteMapMusicVolumeInput");
const remoteMapMusicMuteButton = document.getElementById("remoteMapMusicMuteButton");
const remoteMapMusicSource = document.getElementById("remoteMapMusicSource");
const remoteMapMusicStatus = document.getElementById("remoteMapMusicStatus");
const remoteMapMusicManagerWrap = document.getElementById("remoteMapMusicManagerWrap");
const remoteMapMusicTrackSelect = document.getElementById("remoteMapMusicTrackSelect");
const remoteMapMusicFileInput = document.getElementById("remoteMapMusicFileInput");
const remoteMapMusicLoadButton = document.getElementById("remoteMapMusicLoadButton");
const remoteMapMusicPlayButton = document.getElementById("remoteMapMusicPlayButton");
const remoteMapMusicPauseButton = document.getElementById("remoteMapMusicPauseButton");
const remoteMapMusicClearButton = document.getElementById("remoteMapMusicClearButton");
const remoteCommandChatMessages = document.getElementById("remoteCommandChatMessages");
const remoteCommandChatForm = document.getElementById("remoteCommandChatForm");
const remoteCommandChatInput = document.getElementById("remoteCommandChatInput");
const remoteCommandChatStatus = document.getElementById("remoteCommandChatStatus");
const remoteCommandChatClearButton = document.getElementById("remoteCommandChatClearButton");
const projectSelect = document.getElementById("projectSelect");
const projectNameInput = document.getElementById("projectNameInput");
const projectCreateButton = document.getElementById("projectCreateButton");
const projectPlayerList = document.getElementById("projectPlayerList");
const projectStatus = document.getElementById("projectStatus");

let currentActiveMapId = "";
let currentSelectedMapId = "";
let currentMaps = [];
let currentBattlemaps = [];
let remoteTokenUsers = [];
let lastRenderedActiveMapId = "";
const selectedMapLayerIds = {};
const liveSurfaceReturnKey = "eldran-live-surface-return";
const remoteMapLayerNavigatorCollapsedKey = "eldran-remote-map-layer-navigator-collapsed";

function canManageMap() {
  return ["spielleiter", "admin"].includes(globalThis.currentUserRole || "");
}

function canManageOverlays() {
  return ["spielleiter", "admin"].includes(globalThis.currentUserRole || "");
}

function canSeeGmLayer() {
  return ["spielleiter", "admin"].includes(globalThis.currentUserRole || "");
}

function setRangeLabel(element, valueElement) {
  if (!element || !valueElement) {
    return;
  }
  valueElement.textContent = `${element.value} %`;
}

function renderRemoteTokenUserOptions(selectElement, includeEmpty = true) {
  if (!selectElement) {
    return;
  }
  selectElement.innerHTML = "";
  if (includeEmpty) {
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Nicht zugewiesen";
    selectElement.appendChild(emptyOption);
  }
  for (const user of remoteTokenUsers) {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.role === "npc"
      ? `${user.username} (NPC)`
      : user.role === "gegner"
        ? `${user.username} (Gegner)`
        : user.username;
    selectElement.appendChild(option);
  }
}

async function loadRemoteTokenUsers() {
  if (!canManageMap()) {
    remoteTokenUsers = [];
    renderRemoteTokenUserOptions(remoteMapTokenAssignedUserSelect, true);
    renderRemoteTokenUserOptions(remoteMapPinDetailAssignedUser, true);
    return;
  }
  const response = await fetch("/api/map-token-users?include_npcs=true", { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Spieler fuer Tokens konnten nicht geladen werden.");
  }
  remoteTokenUsers = data.users || [];
  renderRemoteTokenUserOptions(remoteMapTokenAssignedUserSelect, true);
  renderRemoteTokenUserOptions(remoteMapPinDetailAssignedUser, true);
}

function renderRemoteMapTargetOptions(selectElement, currentMapId = "", selectedMapId = "") {
  if (!selectElement) {
    return;
  }
  selectElement.innerHTML = "";
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Keine Verlinkung";
  selectElement.appendChild(emptyOption);
  for (const mapItem of currentMaps) {
    if (!mapItem?.id || mapItem.id === currentMapId) {
      continue;
    }
    const option = document.createElement("option");
    option.value = `map:${mapItem.id}`;
    option.textContent = `Karte: ${mapItem.name || mapItem.id}`;
    selectElement.appendChild(option);
  }
  for (const battlemapItem of currentBattlemaps) {
    if (!battlemapItem?.id) {
      continue;
    }
    const option = document.createElement("option");
    option.value = `battlemap:${battlemapItem.id}`;
    option.textContent = `Battlemap: ${battlemapItem.name || battlemapItem.id}`;
    selectElement.appendChild(option);
  }
  selectElement.value = selectedMapId || "";
}

function selectedMap() {
  return currentMaps.find((item) => item.id === currentSelectedMapId) || null;
}

function getLayerStorageKey(mapId) {
  const username = String(globalThis.currentUsername || "gast").trim().toLocaleLowerCase() || "gast";
  return `eldran_map_layer:remote:${username}:${mapId}`;
}

function getStoredLayerId(mapId) {
  if (!mapId) {
    return "";
  }
  if (selectedMapLayerIds[mapId]) {
    return selectedMapLayerIds[mapId];
  }
  const stored = window.localStorage.getItem(getLayerStorageKey(mapId)) || "";
  if (stored) {
    selectedMapLayerIds[mapId] = stored;
  }
  return stored;
}

function storeLayerId(mapId, layerId) {
  if (!mapId) {
    return;
  }
  selectedMapLayerIds[mapId] = layerId || "";
  window.localStorage.setItem(getLayerStorageKey(mapId), layerId || "");
}

function getMapViewId(manageMap = canManageMap()) {
  return manageMap ? currentSelectedMapId : currentActiveMapId;
}

function getSelectedLayerId(mapId) {
  const mapItem = currentMaps.find((item) => item.id === mapId);
  if (!mapItem) {
    return "";
  }
  const availableLayers = Array.isArray(mapItem.layers) ? mapItem.layers : [];
  const preferredLayerId = getStoredLayerId(mapId);
  if (preferredLayerId && availableLayers.some((layer) => layer.id === preferredLayerId)) {
    return preferredLayerId;
  }
  const fallbackLayerId = mapItem.default_layer_id || availableLayers[0]?.id || "";
  storeLayerId(mapId, fallbackLayerId);
  return fallbackLayerId;
}

function renderRemoteLayerOptions(manageMap = canManageMap()) {
  if (!remoteMapLayerSelect) {
    return;
  }
  const mapId = getMapViewId(manageMap);
  const mapItem = currentMaps.find((item) => item.id === mapId);
  const layers = Array.isArray(mapItem?.layers) ? mapItem.layers : [];
  const selectedLayerId = mapItem ? getSelectedLayerId(mapId) : "";
  remoteMapLayerSelect.innerHTML = "";
  if (!layers.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Keine Ebene";
    remoteMapLayerSelect.appendChild(option);
    remoteMapLayerSelect.disabled = true;
    remoteMapLayerStatus.textContent = "Diese Karte hat noch keine Ebene.";
    return;
  }
  for (const layer of layers) {
    const option = document.createElement("option");
    option.value = layer.id;
    option.textContent = layer.name || "Ebene";
    remoteMapLayerSelect.appendChild(option);
  }
  remoteMapLayerSelect.value = selectedLayerId;
  remoteMapLayerSelect.disabled = false;
  const activeLayerName = layers.find((layer) => layer.id === selectedLayerId)?.name || "";
  const isEditingLayerName = document.activeElement === remoteMapLayerNameInput;
  if (!isEditingLayerName) {
    remoteMapLayerNameInput.value = activeLayerName;
  }
  const showNavigator = !manageMap;
  remoteMapLayerSelectWrap?.classList.toggle("hidden", showNavigator);
  remoteMapLayerNavigatorWrap?.classList.toggle("hidden", !showNavigator);
  const isCollapsed = window.localStorage.getItem(remoteMapLayerNavigatorCollapsedKey) === "1";
  remoteMapLayerNavigatorWrap?.classList.toggle("collapsed", showNavigator && isCollapsed);
  remoteMapLayerNavigatorBody?.classList.toggle("hidden", showNavigator && isCollapsed);
  if (remoteMapLayerNavigatorToggle) {
    remoteMapLayerNavigatorToggle.setAttribute("aria-expanded", showNavigator && !isCollapsed ? "true" : "false");
  }
  if (remoteMapLayerStack) {
    remoteMapLayerStack.innerHTML = "";
    for (const layer of layers) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `map-layer-stack-item${layer.id === selectedLayerId ? " active" : ""}`;
      button.title = layer.name || "Ebene";
      button.setAttribute("aria-label", layer.name || "Ebene");
      const label = document.createElement("span");
      label.className = "map-layer-stack-label";
      label.textContent = layer.name || "Ebene";
      button.appendChild(label);
      button.addEventListener("click", () => {
        selectRemoteMapLayer(layer.id, manageMap);
      });
      remoteMapLayerStack.appendChild(button);
    }
  }
  const selectedIndex = layers.findIndex((layer) => layer.id === selectedLayerId);
  if (remoteMapLayerUpButton) {
    remoteMapLayerUpButton.disabled = selectedIndex <= 0;
  }
  if (remoteMapLayerDownButton) {
    remoteMapLayerDownButton.disabled = selectedIndex < 0 || selectedIndex >= layers.length - 1;
  }
  remoteMapLayerRenameWrap?.classList.toggle("hidden", !manageMap);
  remoteMapLayerManagerWrap?.classList.toggle("hidden", !manageMap);
  remoteMapLayerImageWrap?.classList.toggle("hidden", !manageMap);
  remoteMapLayerBackgroundWrap?.classList.toggle("hidden", !manageMap);
  remoteMapLayerGmWrap?.classList.toggle("hidden", !canSeeGmLayer());
  remoteMapCreateOnGmWrap?.classList.toggle("hidden", !manageMap);
  remoteMapFogEnabledWrap?.classList.toggle("hidden", !manageMap);
  remoteMapFogManagerWrap?.classList.toggle("hidden", !manageMap);
  remoteMapLayerStatus.textContent = "Die Ebenenauswahl gilt nur fuer diese Ansicht.";
}

function toggleRemoteMapLayerNavigator(manageMap = canManageMap()) {
  if (manageMap) {
    return;
  }
  const isCollapsed = window.localStorage.getItem(remoteMapLayerNavigatorCollapsedKey) === "1";
  if (isCollapsed) {
    window.localStorage.removeItem(remoteMapLayerNavigatorCollapsedKey);
  } else {
    window.localStorage.setItem(remoteMapLayerNavigatorCollapsedKey, "1");
  }
  renderRemoteLayerOptions(manageMap);
}

function selectRemoteMapLayer(layerId, manageMap = canManageMap()) {
  const mapId = getMapViewId(manageMap);
  if (!mapId) {
    return;
  }
  storeLayerId(mapId, layerId);
  renderRemoteLayerOptions(manageMap);
  window.dispatchEvent(new CustomEvent("eldran:map-layer-changed", { detail: { mapId, layerId } }));
}

function setCurrentMapTitle(name) {
  remoteMapTitle.textContent = name ? `Bearbeitete Karte: ${name}` : "Bearbeitete Karte";
}

function syncMapControls() {
  const selected = selectedMap();
  remoteMapRenameInput.value = selected?.name || "";
  remoteMapActivateButton.disabled = !selected || selected.id === currentActiveMapId;
  remoteMapDeleteButton.disabled = !selected;
  setCurrentMapTitle(selected?.name || "");
  renderRemoteLayerOptions();
}

function selectMap(mapId) {
  currentSelectedMapId = mapId;
  renderMapList(currentMaps, currentActiveMapId);
  window.dispatchEvent(new CustomEvent("eldran:map-selection-changed", { detail: { mapId } }));
}

function renderMapList(maps, activeMapId) {
  const previousActiveMapId = lastRenderedActiveMapId;
  currentMaps = maps;
  currentActiveMapId = activeMapId || "";
  const activeMapChanged = Boolean(currentActiveMapId && previousActiveMapId && previousActiveMapId !== currentActiveMapId);
  if (activeMapChanged && canManageMap()) {
    currentSelectedMapId = currentActiveMapId;
  }
  if (!currentSelectedMapId || !maps.some((item) => item.id === currentSelectedMapId)) {
    currentSelectedMapId = currentActiveMapId || maps[0]?.id || "";
  }

  remoteMapList.innerHTML = "";
  for (const item of maps) {
    const row = document.createElement("div");
    row.className = "chat-list-row";

    const button = document.createElement("button");
    button.type = "button";
    button.className = `chat-list-item${item.id === currentSelectedMapId ? " active" : ""}`;
    button.textContent = item.name;
    button.disabled = !canManageMap();
    button.addEventListener("click", () => {
      if (!canManageMap()) {
        return;
      }
      selectMap(item.id);
      remoteMapListStatus.textContent = item.id === currentActiveMapId ? "Diese Karte ist aktuell live." : "Karte nur lokal ausgewaehlt.";
    });

    const badge = document.createElement("div");
    badge.className = "file-meta";
    badge.textContent = item.id === currentActiveMapId ? "Live" : "Lokal";

    row.append(button, badge);
    remoteMapList.appendChild(row);
  }
  syncMapControls();
  renderRemoteMapTargetOptions(remoteMapPinTargetMapSelect, currentSelectedMapId, remoteMapPinTargetMapSelect?.value || "");
  lastRenderedActiveMapId = currentActiveMapId;
  if (activeMapChanged && canManageMap()) {
    remoteMapListStatus.textContent = "Live-Karte gewechselt. Spielleiteransicht folgt der aktiven Karte.";
    window.dispatchEvent(new CustomEvent("eldran:map-selection-changed", { detail: { mapId: currentActiveMapId } }));
  }
  if (!canManageMap()) {
    renderRemoteLayerOptions(false);
  }
}

async function loadMaps() {
  const timestamp = Date.now();
  const [mapsResponse, battlemapsResponse] = await Promise.all([
    fetch(`/api/maps?ts=${timestamp}`, { cache: "no-store" }),
    fetch(`/api/battlemaps?ts=${timestamp}`, { cache: "no-store" }),
  ]);
  const mapsData = await mapsResponse.json();
  const battlemapsData = await battlemapsResponse.json();
  if (!mapsResponse.ok) {
    throw new Error(mapsData.detail || "Karten konnten nicht geladen werden.");
  }
  if (!battlemapsResponse.ok) {
    throw new Error(battlemapsData.detail || "Battlemaps konnten nicht geladen werden.");
  }
  currentBattlemaps = battlemapsData.battlemaps || [];
  const activeSurface = battlemapsData.active_surface || mapsData.active_surface || { kind: "map", id: mapsData.active_map_id || "" };
  if (activeSurface.kind === "battlemap") {
    window.sessionStorage.setItem(liveSurfaceReturnKey, window.location.pathname);
    window.location.href = "/Battlemap";
    return;
  }
  renderMapList(mapsData.maps || [], mapsData.active_map_id || "");
}

async function activateMap(mapId) {
  const response = await fetch(`/api/maps/${mapId}/activate`, { method: "PATCH" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Karte konnte nicht aktiviert werden.");
  }
  currentSelectedMapId = mapId;
  await loadMaps();
  window.dispatchEvent(new CustomEvent("eldran:map-selection-changed", { detail: { mapId } }));
}

async function activateLinkedTarget(targetKind, targetId) {
  if (targetKind === "battlemap") {
    const response = await fetch(`/api/battlemaps/${targetId}/activate`, { method: "PATCH" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Battlemap konnte nicht aktiviert werden.");
    }
    await loadMaps();
    window.sessionStorage.setItem(liveSurfaceReturnKey, window.location.pathname);
    window.location.href = "/Battlemap";
    return;
  }
  await activateMap(targetId);
  window.location.href = "/Karte";
}

async function renameSelectedMap() {
  const selected = selectedMap();
  if (!selected) {
    throw new Error("Keine Karte ausgewaehlt.");
  }
  const name = remoteMapRenameInput.value.trim();
  if (!name) {
    throw new Error("Kartenname fehlt.");
  }
  const response = await fetch(`/api/maps/${selected.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Karte konnte nicht umbenannt werden.");
  }
  await loadMaps();
}

async function createMap() {
  const name = remoteMapNameInput.value.trim();
  if (!name) {
    throw new Error("Kartenname fehlt.");
  }
  const formData = new FormData();
  formData.append("name", name);
  formData.append("background_color", remoteMapCreateBackgroundColorInput?.value || "#223044");
  formData.append("canvas_width", "4096");
  formData.append("canvas_height", "4096");
  const imageFile = remoteMapCreateImageInput.files?.[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch("/api/maps", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Karte konnte nicht angelegt werden.");
  }

  remoteMapNameInput.value = "";
  remoteMapCreateImageInput.value = "";
  if (remoteMapCreateBackgroundColorInput) {
    remoteMapCreateBackgroundColorInput.value = "#223044";
  }
  await loadMaps();
  selectMap(data.map.id);
}

async function createMapLayer() {
  const selected = selectedMap();
  if (!selected) {
    throw new Error("Keine Karte ausgewaehlt.");
  }
  const name = remoteMapLayerNameInput.value.trim() || `Ebene ${(selected.layers || []).length + 1}`;
  const formData = new FormData();
  formData.append("name", name);
  formData.append("background_color", remoteMapLayerBackgroundColorInput?.value || "#223044");
  formData.append("canvas_width", "4096");
  formData.append("canvas_height", "4096");
  const imageFile = remoteMapLayerImageInput.files?.[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const response = await fetch(`/api/maps/${selected.id}/layers`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Ebene konnte nicht angelegt werden.");
  }
  remoteMapLayerNameInput.value = "";
  remoteMapLayerImageInput.value = "";
  if (remoteMapLayerBackgroundColorInput) {
    remoteMapLayerBackgroundColorInput.value = "#223044";
  }
  await loadMaps();
  if (data.layer?.id) {
    storeLayerId(selected.id, data.layer.id);
    renderRemoteLayerOptions(true);
    window.dispatchEvent(new CustomEvent("eldran:map-layer-changed", { detail: { mapId: selected.id, layerId: data.layer.id } }));
  }
}

async function renameSelectedLayer() {
  const selected = selectedMap();
  if (!selected) {
    throw new Error("Keine Karte ausgewaehlt.");
  }
  const layerId = getSelectedLayerId(selected.id);
  if (!layerId) {
    throw new Error("Keine Ebene ausgewaehlt.");
  }
  const name = remoteMapLayerNameInput.value.trim();
  if (!name) {
    throw new Error("Ebenenname fehlt.");
  }
  const response = await fetch(`/api/maps/${selected.id}/layers/${layerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Ebene konnte nicht umbenannt werden.");
  }
  await loadMaps();
  storeLayerId(selected.id, layerId);
  renderRemoteLayerOptions(true);
}

async function deleteSelectedMap() {
  const selected = selectedMap();
  if (!selected) {
    throw new Error("Keine Karte ausgewaehlt.");
  }
  const response = await fetch(`/api/maps/${selected.id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Karte konnte nicht geloescht werden.");
  }
  await loadMaps();
}

remoteMapCreateButton.addEventListener("click", async () => {
  remoteMapCreateButton.disabled = true;
  remoteMapListStatus.textContent = "Karte wird angelegt...";
  try {
    await createMap();
    remoteMapListStatus.textContent = "Bereit";
  } catch (error) {
    remoteMapListStatus.textContent = error.message;
  } finally {
    remoteMapCreateButton.disabled = false;
  }
});

remoteMapRenameButton.addEventListener("click", async () => {
  remoteMapRenameButton.disabled = true;
  remoteMapListStatus.textContent = "Karte wird umbenannt...";
  try {
    await renameSelectedMap();
    remoteMapListStatus.textContent = "Bereit";
  } catch (error) {
    remoteMapListStatus.textContent = error.message;
  } finally {
    remoteMapRenameButton.disabled = false;
  }
});

remoteMapActivateButton.addEventListener("click", async () => {
  const selected = selectedMap();
  if (!selected) {
    return;
  }
  remoteMapActivateButton.disabled = true;
  remoteMapListStatus.textContent = "Karte wird live geschaltet...";
  try {
    await activateMap(selected.id);
    remoteMapListStatus.textContent = "Bereit";
  } catch (error) {
    remoteMapListStatus.textContent = error.message;
  } finally {
    remoteMapActivateButton.disabled = false;
  }
});

remoteMapDeleteButton.addEventListener("click", async () => {
  const selected = selectedMap();
  if (!selected) {
    return;
  }
  if (!window.confirm(`Karte "${selected.name}" wirklich loeschen?`)) {
    return;
  }
  remoteMapDeleteButton.disabled = true;
  remoteMapListStatus.textContent = "Karte wird geloescht...";
  try {
    await deleteSelectedMap();
    remoteMapListStatus.textContent = "Bereit";
  } catch (error) {
    remoteMapListStatus.textContent = error.message;
  } finally {
    remoteMapDeleteButton.disabled = false;
  }
});

remoteMapLayerSelect?.addEventListener("change", () => {
  selectRemoteMapLayer(remoteMapLayerSelect.value || "", canManageMap());
});

remoteMapLayerNavigatorToggle?.addEventListener("click", () => {
  toggleRemoteMapLayerNavigator(false);
});

remoteMapLayerUpButton?.addEventListener("click", () => {
  const mapId = getMapViewId(canManageMap());
  const mapItem = currentMaps.find((item) => item.id === mapId);
  const layers = Array.isArray(mapItem?.layers) ? mapItem.layers : [];
  const selectedLayerId = mapItem ? getSelectedLayerId(mapId) : "";
  const index = layers.findIndex((layer) => layer.id === selectedLayerId);
  if (index > 0) {
    selectRemoteMapLayer(layers[index - 1].id, canManageMap());
  }
});

remoteMapLayerDownButton?.addEventListener("click", () => {
  const mapId = getMapViewId(canManageMap());
  const mapItem = currentMaps.find((item) => item.id === mapId);
  const layers = Array.isArray(mapItem?.layers) ? mapItem.layers : [];
  const selectedLayerId = mapItem ? getSelectedLayerId(mapId) : "";
  const index = layers.findIndex((layer) => layer.id === selectedLayerId);
  if (index >= 0 && index < layers.length - 1) {
    selectRemoteMapLayer(layers[index + 1].id, canManageMap());
  }
});

remoteMapLayerCreateButton?.addEventListener("click", async () => {
  remoteMapLayerCreateButton.disabled = true;
  remoteMapLayerStatus.textContent = "Ebene wird angelegt...";
  try {
    await createMapLayer();
    remoteMapLayerStatus.textContent = "Bereit";
  } catch (error) {
    remoteMapLayerStatus.textContent = error.message;
  } finally {
    remoteMapLayerCreateButton.disabled = false;
  }
});

remoteMapLayerRenameButton?.addEventListener("click", async () => {
  remoteMapLayerRenameButton.disabled = true;
  remoteMapLayerStatus.textContent = "Ebenenname wird gespeichert...";
  try {
    await renameSelectedLayer();
    remoteMapLayerStatus.textContent = "Bereit";
  } catch (error) {
    remoteMapLayerStatus.textContent = error.message;
  } finally {
    remoteMapLayerRenameButton.disabled = false;
  }
});

remoteMapShowGmLayerInput?.addEventListener("change", () => {
  window.dispatchEvent(new CustomEvent("eldran:map-gm-layer-changed", { detail: { enabled: remoteMapShowGmLayerInput.checked } }));
});

remoteMapTokenVisionInput?.addEventListener("input", () => setRangeLabel(remoteMapTokenVisionInput, remoteMapTokenVisionValue));
remoteMapPinDetailVisionInput?.addEventListener("input", () => setRangeLabel(remoteMapPinDetailVisionInput, remoteMapPinDetailVisionValue));

initializeAuthUi()
  .then(async () => {
    initPanelLayout({
      rootSelector: "#remoteMapPanelBoard",
      storageKey: "eldran_map_panels_remote",
    });
    const manageMap = canManageMap();
    if (manageMap) {
      remoteMapManageControls.classList.remove("hidden");
      remoteCommandChatClearButton.classList.remove("hidden");
      remoteMapStatusText.textContent = "Zeichnen fuer alle. Kartenwechsel und globales Loeschen fuer Spielleiter/Admin.";
    }

    initCommandChat({
      listElement: remoteCommandChatMessages,
      formElement: remoteCommandChatForm,
      inputElement: remoteCommandChatInput,
      statusElement: remoteCommandChatStatus,
      clearButton: manageMap ? remoteCommandChatClearButton : null,
    });
    initSharedMusicPlayer({
      audioElement: remoteMapMusicAudio,
      statusElement: remoteMapMusicStatus,
      sourceElement: remoteMapMusicSource,
      volumeWrapElement: remoteMapMusicVolumeWrap,
      volumeInputElement: remoteMapMusicVolumeInput,
      muteButtonElement: remoteMapMusicMuteButton,
      managerWrapElement: remoteMapMusicManagerWrap,
      trackSelectElement: remoteMapMusicTrackSelect,
      fileInputElement: remoteMapMusicFileInput,
      loadButtonElement: remoteMapMusicLoadButton,
      playButtonElement: remoteMapMusicPlayButton,
      pauseButtonElement: remoteMapMusicPauseButton,
      clearButtonElement: remoteMapMusicClearButton,
      canManage: manageMap,
    });

    initSharedMapCanvas({
      imageElement: remoteMapImage,
      canvasElement: remoteMapDrawingCanvas,
      stageElement: remoteMapStage,
      scrollContainerElement: remoteMapFrame,
      overlayLayerElement: remoteMapOverlayLayer,
      pinLayerElement: remoteMapPinLayer,
      emptyStateElement: remoteMapEmptyState,
      statusElement: remoteMapStatusText,
      zoomInput: remoteMapZoomInput,
      zoomValueElement: remoteMapZoomValue,
      imageUploadInput: manageMap ? remoteMapImageInput : null,
      imageUploadStatusElement: remoteMapUploadStatus,
      colorInput: remoteMapDrawColorInput,
      widthInput: remoteMapDrawWidthInput,
      widthValueElement: remoteMapDrawWidthValue,
      drawingsClearButton: manageMap ? remoteMapDrawingsClearButton : null,
      canManageDrawings: manageMap,
      canManageOverlays: canManageOverlays(),
      pinNameInput: manageMap ? remoteMapPinNameInput : null,
      pinDescriptionInput: manageMap ? remoteMapPinDescriptionInput : null,
      pinImageInput: manageMap ? remoteMapPinImageInput : null,
      pinHiddenInput: manageMap ? remoteMapPinHiddenInput : null,
      pinTargetMapSelect: manageMap ? remoteMapPinTargetMapSelect : null,
      pinPlacementButton: manageMap ? remoteMapPinPlacementButton : null,
      pinStatusElement: manageMap ? remoteMapPinStatus : null,
      tokenNameInput: manageMap ? remoteMapTokenNameInput : null,
      tokenAssignedUserSelect: manageMap ? remoteMapTokenAssignedUserSelect : null,
      tokenImageInput: manageMap ? remoteMapTokenImageInput : null,
      tokenVisionInput: manageMap ? remoteMapTokenVisionInput : null,
      tokenVisionValueElement: manageMap ? remoteMapTokenVisionValue : null,
      tokenLayerInput: manageMap ? remoteMapTokenLayerInput : null,
      tokenPlacementButton: manageMap ? remoteMapTokenPlacementButton : null,
      tokenStatusElement: manageMap ? remoteMapTokenStatus : null,
      soundTokenNameInput: manageMap ? remoteMapSoundTokenNameInput : null,
      soundTokenFileInput: manageMap ? remoteMapSoundTokenFileInput : null,
      soundTokenLayerInput: manageMap ? remoteMapSoundTokenLayerInput : null,
      soundTokenPlacementButton: manageMap ? remoteMapSoundTokenPlacementButton : null,
      soundTokenStatusElement: manageMap ? remoteMapSoundTokenStatus : null,
      pinDetailCard: remoteMapPinDetailCard,
      pinDetailHeader: remoteMapPinDetailHeader,
      pinDetailNameElement: remoteMapPinDetailName,
      pinDetailDescriptionElement: remoteMapPinDetailDescription,
      pinDetailImageInput: remoteMapPinDetailImageInput,
      pinDetailImageInputWrap: remoteMapPinDetailImageLabel,
      pinDetailShowLabelInput: remoteMapPinDetailShowLabel,
      pinDetailShowLabelWrap: remoteMapPinDetailShowLabelWrap,
      pinDetailHiddenInput: remoteMapPinDetailHidden,
      pinDetailHiddenWrap: remoteMapPinDetailHiddenWrap,
      pinDetailAssignedUserInput: remoteMapPinDetailAssignedUser,
      pinDetailAssignedUserWrap: remoteMapPinDetailAssignedWrap,
      pinDetailVisionInput: remoteMapPinDetailVisionInput,
      pinDetailVisionWrap: remoteMapPinDetailVisionWrap,
      pinDetailVisionValueElement: remoteMapPinDetailVisionValue,
      pinDetailLinkedMapInput: remoteMapPinDetailLinkedMap,
      pinDetailLinkedMapWrap: remoteMapPinDetailLinkedMapWrap,
      pinDetailLinkedMapActions: remoteMapPinDetailLinkedMapActions,
      pinDetailActivateMapButton: remoteMapPinDetailActivateMapButton,
      pinDetailLinkedMapStatusElement: remoteMapPinDetailLinkedMapStatus,
      pinDetailSoundInput: remoteMapPinDetailSoundInput,
      pinDetailSoundInputWrap: remoteMapPinDetailSoundLabel,
      pinDetailSoundWrap: remoteMapPinDetailSoundWrap,
      pinDetailSoundPlayButton: remoteMapPinDetailSoundPlayButton,
      pinDetailSoundStatusElement: remoteMapPinDetailSoundStatus,
      pinDetailGroupWrap: remoteMapPinDetailGroupWrap,
      pinGroupButton: remoteMapPinGroupButton,
      pinUngroupButton: remoteMapPinUngroupButton,
      pinGroupStatusElement: remoteMapPinGroupStatus,
      pinDetailImageElement: remoteMapPinDetailImage,
      pinDetailCloseButton: remoteMapPinDetailCloseButton,
      pinSaveButton: manageMap ? remoteMapPinSaveButton : null,
      pinDeleteButton: manageMap ? remoteMapPinDeleteButton : null,
      canManagePins: manageMap,
      canManageTokens: manageMap,
      getCurrentMapId: () => getMapViewId(manageMap),
      getCurrentLayerId: () => getSelectedLayerId(getMapViewId(manageMap)),
      getShowGmLayer: () => Boolean(remoteMapShowGmLayerInput?.checked ?? true),
      getCreateOnGmLayer: () => Boolean(remoteMapCreateOnGmInput?.checked ?? false),
      fogStatusElement: remoteMapLayerStatus,
      fogEnabledInput: manageMap ? remoteMapFogEnabledInput : null,
      fogWallModeButton: manageMap ? remoteMapFogWallModeButton : null,
      fogDoorModeButton: manageMap ? remoteMapFogDoorModeButton : null,
      fogDeleteWallButton: manageMap ? remoteMapFogDeleteWallButton : null,
      fogClearExploredButton: manageMap ? remoteMapFogClearExploredButton : null,
      getAvailableLinkTargets: () => ({ maps: currentMaps, battlemaps: currentBattlemaps }),
      activateLinkedTarget,
    });
    initProjectSelector({
      selectElement: projectSelect,
      createInputElement: projectNameInput,
      createButtonElement: projectCreateButton,
      playerListElement: projectPlayerList,
      statusElement: projectStatus,
      onProjectChanged: async () => {
        await loadMaps();
      },
    });
    setRangeLabel(remoteMapTokenVisionInput, remoteMapTokenVisionValue);
    setRangeLabel(remoteMapPinDetailVisionInput, remoteMapPinDetailVisionValue);

    await loadRemoteTokenUsers();
    await loadMaps();
    setInterval(() => {
      loadMaps().catch(() => {});
    }, 3000);
  })
  .catch(() => {});

window.addEventListener("eldran:project-changed", () => {
  loadMaps().catch(() => {});
});
