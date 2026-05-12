const mapNameInput = document.getElementById("mapNameInput");
const mapCreateImageInput = document.getElementById("mapCreateImageInput");
const mapCreateBackgroundColorInput = document.getElementById("mapCreateBackgroundColorInput");
const mapCreateButton = document.getElementById("mapCreateButton");
const mapRenameInput = document.getElementById("mapRenameInput");
const mapRenameButton = document.getElementById("mapRenameButton");
const mapActivateButton = document.getElementById("mapActivateButton");
const mapDeleteButton = document.getElementById("mapDeleteButton");
const mapList = document.getElementById("mapList");
const mapListStatus = document.getElementById("mapListStatus");
const mapLayerSelect = document.getElementById("mapLayerSelect");
const mapLayerSelectWrap = document.getElementById("mapLayerSelectWrap");
const mapLayerNavigatorWrap = document.getElementById("mapLayerNavigatorWrap");
const mapLayerNavigatorToggle = document.getElementById("mapLayerNavigatorToggle");
const mapLayerNavigatorBody = document.getElementById("mapLayerNavigatorBody");
const mapLayerStack = document.getElementById("mapLayerStack");
const mapLayerUpButton = document.getElementById("mapLayerUpButton");
const mapLayerDownButton = document.getElementById("mapLayerDownButton");
const mapLayerStatus = document.getElementById("mapLayerStatus");
const mapLayerNameInput = document.getElementById("mapLayerNameInput");
const mapLayerImageInput = document.getElementById("mapLayerImageInput");
const mapLayerBackgroundWrap = document.getElementById("mapLayerBackgroundWrap");
const mapLayerBackgroundColorInput = document.getElementById("mapLayerBackgroundColorInput");
const mapLayerCreateButton = document.getElementById("mapLayerCreateButton");
const mapLayerRenameButton = document.getElementById("mapLayerRenameButton");
const mapLayerManagerWrap = document.getElementById("mapLayerManagerWrap");
const mapLayerImageWrap = document.getElementById("mapLayerImageWrap");
const mapLayerRenameWrap = document.getElementById("mapLayerRenameWrap");
const mapLayerGmWrap = document.getElementById("mapLayerGmWrap");
const mapShowGmLayerInput = document.getElementById("mapShowGmLayerInput");
const mapCreateOnGmWrap = document.getElementById("mapCreateOnGmWrap");
const mapCreateOnGmInput = document.getElementById("mapCreateOnGmInput");
const mapFogEnabledWrap = document.getElementById("mapFogEnabledWrap");
const mapFogEnabledInput = document.getElementById("mapFogEnabledInput");
const mapFogManagerWrap = document.getElementById("mapFogManagerWrap");
const mapFogWallModeButton = document.getElementById("mapFogWallModeButton");
const mapFogDoorModeButton = document.getElementById("mapFogDoorModeButton");
const mapFogDeleteWallButton = document.getElementById("mapFogDeleteWallButton");
const mapFogClearExploredButton = document.getElementById("mapFogClearExploredButton");
const mapTitle = document.getElementById("mapTitle");
const mapImageInput = document.getElementById("mapImageInput");
const mapUploadStatus = document.getElementById("mapUploadStatus");
const mapStatusBadge = document.getElementById("mapStatusBadge");
const mapZoomInput = document.getElementById("mapZoomInput");
const mapZoomValue = document.getElementById("mapZoomValue");
const mapPreviewImage = document.getElementById("mapPreviewImage");
const mapFrame = document.getElementById("mapFrame");
const mapDrawingCanvas = document.getElementById("mapDrawingCanvas");
const mapStage = document.getElementById("mapStage");
const mapOverlayLayer = document.getElementById("mapOverlayLayer");
const mapPinLayer = document.getElementById("mapPinLayer");
const mapEmptyState = document.getElementById("mapEmptyState");
const mapDrawColorInput = document.getElementById("mapDrawColorInput");
const mapDrawWidthInput = document.getElementById("mapDrawWidthInput");
const mapDrawWidthValue = document.getElementById("mapDrawWidthValue");
const mapDrawingsClearButton = document.getElementById("mapDrawingsClearButton");
const mapPinNameInput = document.getElementById("mapPinNameInput");
const mapPinDescriptionInput = document.getElementById("mapPinDescriptionInput");
const mapPinImageInput = document.getElementById("mapPinImageInput");
const mapPinHiddenInput = document.getElementById("mapPinHiddenInput");
const mapPinTargetMapSelect = document.getElementById("mapPinTargetMapSelect");
const mapPinPlacementButton = document.getElementById("mapPinPlacementButton");
const mapPinStatus = document.getElementById("mapPinStatus");
const mapTokenNameInput = document.getElementById("mapTokenNameInput");
const mapTokenAssignedUserSelect = document.getElementById("mapTokenAssignedUserSelect");
const mapTokenImageInput = document.getElementById("mapTokenImageInput");
const mapTokenVisionInput = document.getElementById("mapTokenVisionInput");
const mapTokenVisionValue = document.getElementById("mapTokenVisionValue");
const mapTokenLayerInput = document.getElementById("mapTokenLayerInput");
const mapTokenPlacementButton = document.getElementById("mapTokenPlacementButton");
const mapTokenStatus = document.getElementById("mapTokenStatus");
const mapSoundTokenNameInput = document.getElementById("mapSoundTokenNameInput");
const mapSoundTokenFileInput = document.getElementById("mapSoundTokenFileInput");
const mapSoundTokenLayerInput = document.getElementById("mapSoundTokenLayerInput");
const mapSoundTokenPlacementButton = document.getElementById("mapSoundTokenPlacementButton");
const mapSoundTokenStatus = document.getElementById("mapSoundTokenStatus");
const mapPinDetailCard = document.getElementById("mapPinDetailCard");
const mapPinDetailHeader = document.getElementById("mapPinDetailHeader");
const mapPinDetailName = document.getElementById("mapPinDetailName");
const mapPinDetailDescription = document.getElementById("mapPinDetailDescription");
const mapPinDetailImageInput = document.getElementById("mapPinDetailImageInput");
const mapPinDetailImageLabel = document.getElementById("mapPinDetailImageLabel");
const mapPinDetailShowLabel = document.getElementById("mapPinDetailShowLabel");
const mapPinDetailShowLabelWrap = document.getElementById("mapPinDetailShowLabelWrap");
const mapPinDetailHidden = document.getElementById("mapPinDetailHidden");
const mapPinDetailHiddenWrap = document.getElementById("mapPinDetailHiddenWrap");
const mapPinDetailAssignedWrap = document.getElementById("mapPinDetailAssignedWrap");
const mapPinDetailAssignedUser = document.getElementById("mapPinDetailAssignedUser");
const mapPinDetailVisionWrap = document.getElementById("mapPinDetailVisionWrap");
const mapPinDetailVisionInput = document.getElementById("mapPinDetailVisionInput");
const mapPinDetailVisionValue = document.getElementById("mapPinDetailVisionValue");
const mapPinDetailLinkedMapWrap = document.getElementById("mapPinDetailLinkedMapWrap");
const mapPinDetailLinkedMap = document.getElementById("mapPinDetailLinkedMap");
const mapPinDetailLinkedMapActions = document.getElementById("mapPinDetailLinkedMapActions");
const mapPinDetailActivateMapButton = document.getElementById("mapPinDetailActivateMapButton");
const mapPinDetailLinkedMapStatus = document.getElementById("mapPinDetailLinkedMapStatus");
const mapPinDetailSoundLabel = document.getElementById("mapPinDetailSoundLabel");
const mapPinDetailSoundInput = document.getElementById("mapPinDetailSoundInput");
const mapPinDetailSoundWrap = document.getElementById("mapPinDetailSoundWrap");
const mapPinDetailSoundPlayButton = document.getElementById("mapPinDetailSoundPlayButton");
const mapPinDetailSoundStatus = document.getElementById("mapPinDetailSoundStatus");
const mapPinDetailGroupWrap = document.getElementById("mapPinDetailGroupWrap");
const mapPinGroupButton = document.getElementById("mapPinGroupButton");
const mapPinUngroupButton = document.getElementById("mapPinUngroupButton");
const mapPinGroupStatus = document.getElementById("mapPinGroupStatus");
const mapPinDetailImage = document.getElementById("mapPinDetailImage");
const mapPinDetailCloseButton = document.getElementById("mapPinDetailCloseButton");
const mapPinSaveButton = document.getElementById("mapPinSaveButton");
const mapPinDeleteButton = document.getElementById("mapPinDeleteButton");
const mapMusicAudio = document.getElementById("mapMusicAudio");
const mapMusicVolumeWrap = document.getElementById("mapMusicVolumeWrap");
const mapMusicVolumeInput = document.getElementById("mapMusicVolumeInput");
const mapMusicMuteButton = document.getElementById("mapMusicMuteButton");
const mapMusicSource = document.getElementById("mapMusicSource");
const mapMusicStatus = document.getElementById("mapMusicStatus");
const mapMusicManagerWrap = document.getElementById("mapMusicManagerWrap");
const mapMusicTrackSelect = document.getElementById("mapMusicTrackSelect");
const mapMusicFileInput = document.getElementById("mapMusicFileInput");
const mapMusicLoadButton = document.getElementById("mapMusicLoadButton");
const mapMusicPlayButton = document.getElementById("mapMusicPlayButton");
const mapMusicPauseButton = document.getElementById("mapMusicPauseButton");
const mapMusicClearButton = document.getElementById("mapMusicClearButton");
const commandChatMessages = document.getElementById("commandChatMessages");
const commandChatForm = document.getElementById("commandChatForm");
const commandChatInput = document.getElementById("commandChatInput");
const commandChatStatus = document.getElementById("commandChatStatus");
const commandChatClearButton = document.getElementById("commandChatClearButton");
const projectSelect = document.getElementById("projectSelect");
const projectNameInput = document.getElementById("projectNameInput");
const projectCreateButton = document.getElementById("projectCreateButton");
const projectPlayerList = document.getElementById("projectPlayerList");
const projectStatus = document.getElementById("projectStatus");

let currentActiveMapId = "";
let currentSelectedMapId = "";
let currentMaps = [];
let currentBattlemaps = [];
let currentTokenUsers = [];
const selectedMapLayerIds = {};
const liveSurfaceReturnKey = "eldran-live-surface-return";
const mapLayerNavigatorCollapsedKey = "eldran-map-layer-navigator-collapsed";

function canManageOverlays() {
  return ["spielleiter", "admin"].includes(globalThis.currentUserRole || "");
}

function canManageTokens() {
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

function renderTokenUserOptions(selectElement, includeEmpty = true) {
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
  for (const user of currentTokenUsers) {
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

async function loadTokenUsers() {
  if (!canManageTokens()) {
    currentTokenUsers = [];
    renderTokenUserOptions(mapTokenAssignedUserSelect, true);
    renderTokenUserOptions(mapPinDetailAssignedUser, true);
    return;
  }
  const response = await fetch("/api/map-token-users?include_npcs=true", { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Spieler fuer Tokens konnten nicht geladen werden.");
  }
  currentTokenUsers = data.users || [];
  renderTokenUserOptions(mapTokenAssignedUserSelect, true);
  renderTokenUserOptions(mapPinDetailAssignedUser, true);
}

function renderMapTargetOptions(selectElement, currentMapId = "", selectedMapId = "") {
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
  return `eldran_map_layer:admin:${username}:${mapId}`;
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

function renderMapLayerOptions() {
  if (!mapLayerSelect) {
    return;
  }
  const mapItem = selectedMap();
  const layers = Array.isArray(mapItem?.layers) ? mapItem.layers : [];
  const selectedLayerId = mapItem ? getSelectedLayerId(mapItem.id) : "";
  mapLayerSelect.innerHTML = "";
  if (!layers.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Keine Ebene";
    mapLayerSelect.appendChild(option);
    mapLayerSelect.disabled = true;
    mapLayerStatus.textContent = "Diese Karte hat noch keine Ebene.";
    return;
  }
  for (const layer of layers) {
    const option = document.createElement("option");
    option.value = layer.id;
    option.textContent = layer.name || "Ebene";
    mapLayerSelect.appendChild(option);
  }
  mapLayerSelect.value = selectedLayerId;
  mapLayerSelect.disabled = false;
  const activeLayerName = layers.find((layer) => layer.id === selectedLayerId)?.name || "";
  const isEditingLayerName = document.activeElement === mapLayerNameInput;
  if (!isEditingLayerName) {
    mapLayerNameInput.value = activeLayerName;
  }
  const canManage = canManageTokens();
  const showNavigator = !canManage;
  mapLayerSelectWrap?.classList.toggle("hidden", showNavigator);
  mapLayerNavigatorWrap?.classList.toggle("hidden", !showNavigator);
  const isCollapsed = window.localStorage.getItem(mapLayerNavigatorCollapsedKey) === "1";
  mapLayerNavigatorWrap?.classList.toggle("collapsed", showNavigator && isCollapsed);
  mapLayerNavigatorBody?.classList.toggle("hidden", showNavigator && isCollapsed);
  if (mapLayerNavigatorToggle) {
    mapLayerNavigatorToggle.setAttribute("aria-expanded", showNavigator && !isCollapsed ? "true" : "false");
  }
  if (mapLayerStack) {
    mapLayerStack.innerHTML = "";
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
        selectMapLayer(layer.id);
      });
      mapLayerStack.appendChild(button);
    }
  }
  const selectedIndex = layers.findIndex((layer) => layer.id === selectedLayerId);
  if (mapLayerUpButton) {
    mapLayerUpButton.disabled = selectedIndex <= 0;
  }
  if (mapLayerDownButton) {
    mapLayerDownButton.disabled = selectedIndex < 0 || selectedIndex >= layers.length - 1;
  }
  mapLayerRenameWrap?.classList.toggle("hidden", !canManage);
  mapLayerManagerWrap?.classList.toggle("hidden", !canManage);
  mapLayerImageWrap?.classList.toggle("hidden", !canManage);
  mapLayerBackgroundWrap?.classList.toggle("hidden", !canManage);
  mapLayerGmWrap?.classList.toggle("hidden", !canSeeGmLayer());
  mapCreateOnGmWrap?.classList.toggle("hidden", !canManage);
  mapFogEnabledWrap?.classList.toggle("hidden", !canManage);
  mapFogManagerWrap?.classList.toggle("hidden", !canManage);
  mapLayerStatus.textContent = "Die Ebenenauswahl gilt nur fuer diese Ansicht.";
}

function toggleMapLayerNavigator() {
  const isCollapsed = window.localStorage.getItem(mapLayerNavigatorCollapsedKey) === "1";
  if (isCollapsed) {
    window.localStorage.removeItem(mapLayerNavigatorCollapsedKey);
  } else {
    window.localStorage.setItem(mapLayerNavigatorCollapsedKey, "1");
  }
  renderMapLayerOptions();
}

function selectMapLayer(layerId) {
  const mapItem = selectedMap();
  if (!mapItem) {
    return;
  }
  storeLayerId(mapItem.id, layerId);
  renderMapLayerOptions();
  window.dispatchEvent(new CustomEvent("eldran:map-layer-changed", { detail: { mapId: mapItem.id, layerId } }));
}

function syncMapControls() {
  const selected = selectedMap();
  mapRenameInput.value = selected?.name || "";
  mapActivateButton.disabled = !selected || selected.id === currentActiveMapId;
  mapDeleteButton.disabled = !selected;
  setCurrentMapTitle(selected?.name || "");
  renderMapLayerOptions();
}

function setCurrentMapTitle(name) {
  mapTitle.textContent = name ? `Bearbeitete Karte: ${name}` : "Bearbeitete Karte";
}

function selectMap(mapId) {
  currentSelectedMapId = mapId;
  renderMapList(currentMaps, currentActiveMapId);
  window.dispatchEvent(new CustomEvent("eldran:map-selection-changed", { detail: { mapId } }));
}

function renderMapList(maps, activeMapId) {
  currentMaps = maps;
  currentActiveMapId = activeMapId || "";
  if (!currentSelectedMapId || !maps.some((item) => item.id === currentSelectedMapId)) {
    currentSelectedMapId = currentActiveMapId || maps[0]?.id || "";
  }

  mapList.innerHTML = "";
  for (const item of maps) {
    const row = document.createElement("div");
    row.className = "chat-list-row";

    const button = document.createElement("button");
    button.type = "button";
    button.className = `chat-list-item${item.id === currentSelectedMapId ? " active" : ""}`;
    button.textContent = item.name;
    button.addEventListener("click", () => {
      selectMap(item.id);
      mapListStatus.textContent = item.id === currentActiveMapId ? "Diese Karte ist aktuell live." : "Karte nur lokal ausgewaehlt.";
    });

    const badge = document.createElement("div");
    badge.className = "file-meta";
    badge.textContent = item.id === currentActiveMapId ? "Live" : "Lokal";

    row.append(button, badge);
    mapList.appendChild(row);
  }
  syncMapControls();
  renderMapTargetOptions(mapPinTargetMapSelect, currentSelectedMapId, mapPinTargetMapSelect?.value || "");
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
    window.location.href = "/battlemap";
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
    window.location.href = "/battlemap";
    return;
  }
  await activateMap(targetId);
  window.location.href = "/karte";
}

async function renameSelectedMap() {
  const selected = selectedMap();
  if (!selected) {
    throw new Error("Keine Karte ausgewaehlt.");
  }
  const name = mapRenameInput.value.trim();
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
  const name = mapNameInput.value.trim();
  if (!name) {
    throw new Error("Kartenname fehlt.");
  }
  const formData = new FormData();
  formData.append("name", name);
  formData.append("background_color", mapCreateBackgroundColorInput?.value || "#223044");
  formData.append("canvas_width", "4096");
  formData.append("canvas_height", "4096");
  const imageFile = mapCreateImageInput.files?.[0];
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

  mapNameInput.value = "";
  mapCreateImageInput.value = "";
  if (mapCreateBackgroundColorInput) {
    mapCreateBackgroundColorInput.value = "#223044";
  }
  await loadMaps();
  selectMap(data.map.id);
}

async function createMapLayer() {
  const selected = selectedMap();
  if (!selected) {
    throw new Error("Keine Karte ausgewaehlt.");
  }
  const name = mapLayerNameInput.value.trim() || `Ebene ${(selected.layers || []).length + 1}`;
  const formData = new FormData();
  formData.append("name", name);
  formData.append("background_color", mapLayerBackgroundColorInput?.value || "#223044");
  formData.append("canvas_width", "4096");
  formData.append("canvas_height", "4096");
  const imageFile = mapLayerImageInput.files?.[0];
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
  mapLayerNameInput.value = "";
  mapLayerImageInput.value = "";
  if (mapLayerBackgroundColorInput) {
    mapLayerBackgroundColorInput.value = "#223044";
  }
  await loadMaps();
  if (data.layer?.id) {
    storeLayerId(selected.id, data.layer.id);
    renderMapLayerOptions();
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
  const name = mapLayerNameInput.value.trim();
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
  renderMapLayerOptions();
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

mapCreateButton.addEventListener("click", async () => {
  mapCreateButton.disabled = true;
  mapListStatus.textContent = "Karte wird angelegt...";
  try {
    await createMap();
    mapListStatus.textContent = "Bereit";
  } catch (error) {
    mapListStatus.textContent = error.message;
  } finally {
    mapCreateButton.disabled = false;
  }
});

mapRenameButton.addEventListener("click", async () => {
  mapRenameButton.disabled = true;
  mapListStatus.textContent = "Karte wird umbenannt...";
  try {
    await renameSelectedMap();
    mapListStatus.textContent = "Bereit";
  } catch (error) {
    mapListStatus.textContent = error.message;
  } finally {
    mapRenameButton.disabled = false;
  }
});

mapActivateButton.addEventListener("click", async () => {
  const selected = selectedMap();
  if (!selected) {
    return;
  }
  mapActivateButton.disabled = true;
  mapListStatus.textContent = "Karte wird live geschaltet...";
  try {
    await activateMap(selected.id);
    mapListStatus.textContent = "Bereit";
  } catch (error) {
    mapListStatus.textContent = error.message;
  } finally {
    mapActivateButton.disabled = false;
  }
});

mapDeleteButton.addEventListener("click", async () => {
  const selected = selectedMap();
  if (!selected) {
    return;
  }
  if (!window.confirm(`Karte "${selected.name}" wirklich loeschen?`)) {
    return;
  }
  mapDeleteButton.disabled = true;
  mapListStatus.textContent = "Karte wird geloescht...";
  try {
    await deleteSelectedMap();
    mapListStatus.textContent = "Bereit";
  } catch (error) {
    mapListStatus.textContent = error.message;
  } finally {
    mapDeleteButton.disabled = false;
  }
});

mapLayerSelect?.addEventListener("change", () => {
  selectMapLayer(mapLayerSelect.value || "");
});

mapLayerNavigatorToggle?.addEventListener("click", () => {
  toggleMapLayerNavigator();
});

mapLayerUpButton?.addEventListener("click", () => {
  const mapItem = selectedMap();
  const layers = Array.isArray(mapItem?.layers) ? mapItem.layers : [];
  const selectedLayerId = mapItem ? getSelectedLayerId(mapItem.id) : "";
  const index = layers.findIndex((layer) => layer.id === selectedLayerId);
  if (index > 0) {
    selectMapLayer(layers[index - 1].id);
  }
});

mapLayerDownButton?.addEventListener("click", () => {
  const mapItem = selectedMap();
  const layers = Array.isArray(mapItem?.layers) ? mapItem.layers : [];
  const selectedLayerId = mapItem ? getSelectedLayerId(mapItem.id) : "";
  const index = layers.findIndex((layer) => layer.id === selectedLayerId);
  if (index >= 0 && index < layers.length - 1) {
    selectMapLayer(layers[index + 1].id);
  }
});

mapLayerCreateButton?.addEventListener("click", async () => {
  mapLayerCreateButton.disabled = true;
  mapLayerStatus.textContent = "Ebene wird angelegt...";
  try {
    await createMapLayer();
    mapLayerStatus.textContent = "Bereit";
  } catch (error) {
    mapLayerStatus.textContent = error.message;
  } finally {
    mapLayerCreateButton.disabled = false;
  }
});

mapLayerRenameButton?.addEventListener("click", async () => {
  mapLayerRenameButton.disabled = true;
  mapLayerStatus.textContent = "Ebenenname wird gespeichert...";
  try {
    await renameSelectedLayer();
    mapLayerStatus.textContent = "Bereit";
  } catch (error) {
    mapLayerStatus.textContent = error.message;
  } finally {
    mapLayerRenameButton.disabled = false;
  }
});

mapShowGmLayerInput?.addEventListener("change", () => {
  window.dispatchEvent(new CustomEvent("eldran:map-gm-layer-changed", { detail: { enabled: mapShowGmLayerInput.checked } }));
});

mapTokenVisionInput?.addEventListener("input", () => setRangeLabel(mapTokenVisionInput, mapTokenVisionValue));
mapPinDetailVisionInput?.addEventListener("input", () => setRangeLabel(mapPinDetailVisionInput, mapPinDetailVisionValue));

initializeAuthUi({ required: false })
  .then(async () => {
    initPanelLayout({
      rootSelector: "#mapPanelBoard",
      storageKey: "eldran_map_panels_admin",
    });
    initCommandChat({
      listElement: commandChatMessages,
      formElement: commandChatForm,
      inputElement: commandChatInput,
      statusElement: commandChatStatus,
      clearButton: commandChatClearButton,
    });
    initSharedMusicPlayer({
      audioElement: mapMusicAudio,
      statusElement: mapMusicStatus,
      sourceElement: mapMusicSource,
      volumeWrapElement: mapMusicVolumeWrap,
      volumeInputElement: mapMusicVolumeInput,
      muteButtonElement: mapMusicMuteButton,
      managerWrapElement: mapMusicManagerWrap,
      trackSelectElement: mapMusicTrackSelect,
      fileInputElement: mapMusicFileInput,
      loadButtonElement: mapMusicLoadButton,
      playButtonElement: mapMusicPlayButton,
      pauseButtonElement: mapMusicPauseButton,
      clearButtonElement: mapMusicClearButton,
      canManage: canManageTokens(),
    });
    initSharedMapCanvas({
      imageElement: mapPreviewImage,
      canvasElement: mapDrawingCanvas,
      stageElement: mapStage,
      scrollContainerElement: mapFrame,
      overlayLayerElement: mapOverlayLayer,
      pinLayerElement: mapPinLayer,
      emptyStateElement: mapEmptyState,
      statusElement: mapStatusBadge,
      zoomInput: mapZoomInput,
      zoomValueElement: mapZoomValue,
      imageUploadInput: mapImageInput,
      imageUploadStatusElement: mapUploadStatus,
      colorInput: mapDrawColorInput,
      widthInput: mapDrawWidthInput,
      widthValueElement: mapDrawWidthValue,
      drawingsClearButton: mapDrawingsClearButton,
      canManageDrawings: true,
      canManageOverlays: canManageOverlays(),
      pinNameInput: mapPinNameInput,
      pinDescriptionInput: mapPinDescriptionInput,
      pinImageInput: mapPinImageInput,
      pinHiddenInput: mapPinHiddenInput,
      pinTargetMapSelect: mapPinTargetMapSelect,
      pinPlacementButton: mapPinPlacementButton,
      pinStatusElement: mapPinStatus,
      tokenNameInput: mapTokenNameInput,
      tokenAssignedUserSelect: mapTokenAssignedUserSelect,
      tokenImageInput: mapTokenImageInput,
      tokenVisionInput: mapTokenVisionInput,
      tokenVisionValueElement: mapTokenVisionValue,
      tokenLayerInput: mapTokenLayerInput,
      tokenPlacementButton: mapTokenPlacementButton,
      tokenStatusElement: mapTokenStatus,
      soundTokenNameInput: mapSoundTokenNameInput,
      soundTokenFileInput: mapSoundTokenFileInput,
      soundTokenLayerInput: mapSoundTokenLayerInput,
      soundTokenPlacementButton: mapSoundTokenPlacementButton,
      soundTokenStatusElement: mapSoundTokenStatus,
      pinDetailCard: mapPinDetailCard,
      pinDetailHeader: mapPinDetailHeader,
      pinDetailNameElement: mapPinDetailName,
      pinDetailDescriptionElement: mapPinDetailDescription,
      pinDetailImageInput: mapPinDetailImageInput,
      pinDetailImageInputWrap: mapPinDetailImageLabel,
      pinDetailShowLabelInput: mapPinDetailShowLabel,
      pinDetailShowLabelWrap: mapPinDetailShowLabelWrap,
      pinDetailHiddenInput: mapPinDetailHidden,
      pinDetailHiddenWrap: mapPinDetailHiddenWrap,
      pinDetailAssignedUserInput: mapPinDetailAssignedUser,
      pinDetailAssignedUserWrap: mapPinDetailAssignedWrap,
      pinDetailVisionInput: mapPinDetailVisionInput,
      pinDetailVisionWrap: mapPinDetailVisionWrap,
      pinDetailVisionValueElement: mapPinDetailVisionValue,
      pinDetailLinkedMapInput: mapPinDetailLinkedMap,
      pinDetailLinkedMapWrap: mapPinDetailLinkedMapWrap,
      pinDetailLinkedMapActions: mapPinDetailLinkedMapActions,
      pinDetailActivateMapButton: mapPinDetailActivateMapButton,
      pinDetailLinkedMapStatusElement: mapPinDetailLinkedMapStatus,
      pinDetailSoundInput: mapPinDetailSoundInput,
      pinDetailSoundInputWrap: mapPinDetailSoundLabel,
      pinDetailSoundWrap: mapPinDetailSoundWrap,
      pinDetailSoundPlayButton: mapPinDetailSoundPlayButton,
      pinDetailSoundStatusElement: mapPinDetailSoundStatus,
      pinDetailGroupWrap: mapPinDetailGroupWrap,
      pinGroupButton: mapPinGroupButton,
      pinUngroupButton: mapPinUngroupButton,
      pinGroupStatusElement: mapPinGroupStatus,
      pinDetailImageElement: mapPinDetailImage,
      pinDetailCloseButton: mapPinDetailCloseButton,
      pinSaveButton: mapPinSaveButton,
      pinDeleteButton: mapPinDeleteButton,
      canManagePins: true,
      canManageTokens: canManageTokens(),
      getCurrentMapId: () => currentSelectedMapId,
      getCurrentLayerId: () => getSelectedLayerId(currentSelectedMapId),
      getShowGmLayer: () => Boolean(mapShowGmLayerInput?.checked ?? true),
      getCreateOnGmLayer: () => Boolean(mapCreateOnGmInput?.checked ?? false),
      fogStatusElement: mapLayerStatus,
      fogEnabledInput: mapFogEnabledInput,
      fogWallModeButton: mapFogWallModeButton,
      fogDoorModeButton: mapFogDoorModeButton,
      fogDeleteWallButton: mapFogDeleteWallButton,
      fogClearExploredButton: mapFogClearExploredButton,
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
    setRangeLabel(mapTokenVisionInput, mapTokenVisionValue);
    setRangeLabel(mapPinDetailVisionInput, mapPinDetailVisionValue);
    await loadTokenUsers();
    await loadMaps();
    setInterval(() => {
      loadMaps().catch(() => {});
    }, 3000);
  })
  .catch((error) => {
    mapStatusBadge.textContent = error.message;
  });

window.addEventListener("eldran:project-changed", () => {
  loadMaps().catch(() => {});
});
