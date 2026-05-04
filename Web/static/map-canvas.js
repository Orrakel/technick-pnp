function initSharedMapCanvas({
  imageElement,
  canvasElement,
  stageElement,
  scrollContainerElement = null,
  overlayLayerElement = null,
  pinLayerElement,
  emptyStateElement,
  statusElement,
  zoomInput = null,
  zoomValueElement = null,
  imageUploadInput = null,
  imageUploadStatusElement = null,
  colorInput = null,
  widthInput = null,
  widthValueElement = null,
  drawingsClearButton = null,
  canManageDrawings = false,
  canManageOverlays = false,
  pinNameInput = null,
  pinDescriptionInput = null,
  pinImageInput = null,
  pinHiddenInput = null,
  pinTargetMapSelect = null,
  pinPlacementButton = null,
  pinStatusElement = null,
  tokenNameInput = null,
  tokenAssignedUserSelect = null,
  tokenImageInput = null,
  tokenVisionInput = null,
  tokenVisionValueElement = null,
  tokenLayerInput = null,
  tokenPlacementButton = null,
  tokenStatusElement = null,
  soundTokenNameInput = null,
  soundTokenFileInput = null,
  soundTokenLayerInput = null,
  soundTokenPlacementButton = null,
  soundTokenStatusElement = null,
  pinDetailCard = null,
  pinDetailHeader = null,
  pinDetailNameElement = null,
  pinDetailDescriptionElement = null,
  pinDetailImageInput = null,
  pinDetailImageInputWrap = null,
  pinDetailShowLabelInput = null,
  pinDetailShowLabelWrap = null,
  pinDetailHiddenInput = null,
  pinDetailHiddenWrap = null,
  pinDetailAssignedUserInput = null,
  pinDetailAssignedUserWrap = null,
  pinDetailVisionInput = null,
  pinDetailVisionWrap = null,
  pinDetailVisionValueElement = null,
  pinDetailLinkedMapInput = null,
  pinDetailLinkedMapWrap = null,
  pinDetailLinkedMapActions = null,
  pinDetailActivateMapButton = null,
  pinDetailLinkedMapStatusElement = null,
  pinDetailSoundInput = null,
  pinDetailSoundInputWrap = null,
  pinDetailSoundWrap = null,
  pinDetailSoundPlayButton = null,
  pinDetailSoundStatusElement = null,
  pinDetailGroupWrap = null,
  pinGroupButton = null,
  pinUngroupButton = null,
  pinGroupStatusElement = null,
  pinDetailImageElement = null,
  pinDetailCloseButton = null,
  pinSaveButton = null,
  pinDeleteButton = null,
  canManagePins = false,
  canManageTokens = false,
  getCurrentMapId = null,
  getCurrentLayerId = null,
  getShowGmLayer = null,
  getCreateOnGmLayer = null,
  fogStatusElement = null,
  fogEnabledInput = null,
  fogWallModeButton = null,
  fogDoorModeButton = null,
  fogDeleteWallButton = null,
  fogClearExploredButton = null,
  getAvailableLinkTargets = null,
  activateLinkedTarget = null,
}) {
  const context = canvasElement.getContext("2d");
  const DRAW_START_THRESHOLD = 0.006;
  let currentImageVersion = "";
  let currentDrawingVersion = "";
  let currentPingVersion = "";
  let currentPinVersion = "";
  let currentOverlayVersion = "";
  let currentFogVersion = "";
  let lastLoadedMapId = "";
  let activeImageUrl = "";
  let currentSurfaceMeta = {
    backgroundColor: "#223044",
    canvasWidth: 0,
    canvasHeight: 0,
  };
  let strokes = [];
  let pings = [];
  let pins = [];
  let overlays = [];
  let fogState = { enabled: false, explored_areas: [], walls: [], doors: [], updated_at: "" };
  let pingTtlSeconds = 3;
  let serverClockOffsetMs = 0;
  let isPointerDown = false;
  let isDrawing = false;
  let pendingPoints = [];
  let pendingPointerId = null;
  let hoverPoint = null;
  let currentDrawColor = colorInput?.value || "#ff6b6b";
  let currentDrawWidth = Number(widthInput?.value || 3);
  let pinPlacementArmed = false;
  let tokenPlacementArmed = false;
  let soundTokenPlacementArmed = false;
  let wallPlacementArmed = false;
  let doorPlacementArmed = false;
  let pendingWall = null;
  let selectedFogElement = null;
  let activePinId = "";
  let selectedTokenIds = new Set();
  let dragState = null;
  let pinMoveState = null;
  let pinMovePersisting = false;
  let lastPinMoveFinishedId = "";
  let suppressPinDetailOpenUntil = 0;
  let overlayMoveState = null;
  let overlayResizeState = null;
  let activeOverlayId = "";
  let zoomScale = 1;
  let panOffsetX = 0;
  let panOffsetY = 0;
  let panState = null;
  let lastMapInteractionAt = 0;
  let hasInitializedView = false;
  let overlayLayerMenu = null;
  let pinLayerMenu = null;

  function ensureOverlayLayerMenu() {
    if (overlayLayerMenu) {
      return overlayLayerMenu;
    }
    overlayLayerMenu = document.createElement("div");
    overlayLayerMenu.className = "layer-context-menu hidden";
    document.body.appendChild(overlayLayerMenu);
    document.addEventListener("pointerdown", (event) => {
      if (!overlayLayerMenu || overlayLayerMenu.classList.contains("hidden")) {
        return;
      }
      if (event.target instanceof Element && overlayLayerMenu.contains(event.target)) {
        return;
      }
      hideOverlayLayerMenu();
    });
    return overlayLayerMenu;
  }

  function hideOverlayLayerMenu() {
    if (overlayLayerMenu) {
      overlayLayerMenu.classList.add("hidden");
      overlayLayerMenu.innerHTML = "";
    }
  }

  function ensurePinLayerMenu() {
    if (pinLayerMenu) {
      return pinLayerMenu;
    }
    pinLayerMenu = document.createElement("div");
    pinLayerMenu.className = "layer-context-menu hidden";
    document.body.appendChild(pinLayerMenu);
    document.addEventListener("pointerdown", (event) => {
      if (!pinLayerMenu || pinLayerMenu.classList.contains("hidden")) {
        return;
      }
      if (event.target instanceof Element && pinLayerMenu.contains(event.target)) {
        return;
      }
      hidePinLayerMenu();
    });
    return pinLayerMenu;
  }

  function hidePinLayerMenu() {
    if (pinLayerMenu) {
      pinLayerMenu.classList.add("hidden");
      pinLayerMenu.innerHTML = "";
    }
  }

  function showPinLayerMenu(pin, event) {
    if (!canManagePins) {
      return;
    }
    const menu = ensurePinLayerMenu();
    menu.innerHTML = "";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "layer-context-menu-item";
    const currentLayer = String(pin.visibility_layer || "public");
    const nextLayer = currentLayer === "gm" ? "public" : "gm";
    button.textContent = currentLayer === "gm" ? "Auf sichtbare Ebene bringen" : "Auf Spielleiter-Ebene verschieben";
    button.addEventListener("click", async () => {
      hidePinLayerMenu();
      try {
        setStatus("Marker-Ebene wird aktualisiert...");
        await persistPinVisibilityLayer(pin.id, nextLayer);
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
      }
    });
    menu.appendChild(button);
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;
    menu.classList.remove("hidden");
  }

  function showOverlayLayerMenu(overlay, event) {
    if (!canManageOverlays) {
      return;
    }
    const menu = ensureOverlayLayerMenu();
    menu.innerHTML = "";
    const makeAction = (label, nextLayer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "layer-context-menu-item";
      button.textContent = label;
      button.addEventListener("click", async () => {
        hideOverlayLayerMenu();
        try {
          setStatus("Overlay-Ebene wird aktualisiert...");
          await persistOverlayVisibilityLayer(overlay.id, nextLayer);
          setStatus("Bereit");
        } catch (error) {
          setStatus(error.message);
        }
      });
      menu.appendChild(button);
    };
    if (String(overlay.visibility_layer || "public") === "gm") {
      makeAction("Auf sichtbare Ebene bringen", "public");
    } else {
      makeAction("Auf Spielleiter-Ebene verschieben", "gm");
    }
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;
    menu.classList.remove("hidden");
  }

  function getDrawColorStorageKey() {
    const username = String(globalThis.currentUsername || "gast").trim().toLocaleLowerCase();
    return `eldran_map_draw_color:${username}`;
  }

  function initializeStoredDrawColor() {
    if (!colorInput) {
      return;
    }
    const storedColor = localStorage.getItem(getDrawColorStorageKey());
    if (!storedColor) {
      return;
    }
    colorInput.value = storedColor;
    currentDrawColor = storedColor;
  }

  function persistDrawColor() {
    if (!colorInput) {
      return;
    }
    localStorage.setItem(getDrawColorStorageKey(), colorInput.value || "#ff6b6b");
  }

  function markMapInteraction() {
    lastMapInteractionAt = Date.now();
  }

  function focusCanvas() {
    if (canvasElement.tabIndex < 0) {
      canvasElement.tabIndex = 0;
    }
    markMapInteraction();
    canvasElement.focus({ preventScroll: true });
  }

  function resetMapScopedState(nextMapId = "") {
    lastLoadedMapId = nextMapId;
    currentImageVersion = "";
    currentDrawingVersion = "";
    currentPingVersion = "";
    currentPinVersion = "";
    currentOverlayVersion = "";
    currentFogVersion = "";
    activeImageUrl = "";
    currentSurfaceMeta = { backgroundColor: "#223044", canvasWidth: 0, canvasHeight: 0 };
    hasInitializedView = false;
    strokes = [];
    pings = [];
    pins = [];
    overlays = [];
    fogState = { enabled: false, explored_areas: [], walls: [], doors: [], updated_at: "" };
    pendingWall = null;
    selectedFogElement = null;
    hoverPoint = null;
    activePinId = "";
    activeOverlayId = "";
    clearSelectedTokens();
    hidePinDetails();
    clearActiveOverlay();
    renderFrame();
    renderPins();
    renderOverlays();
  }

  function ensureCurrentMapScope() {
    const currentMapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
    if (currentMapId === lastLoadedMapId) {
      return currentMapId;
    }
    resetMapScopedState(currentMapId);
    return currentMapId;
  }

  function isEditableElement(element) {
    return Boolean(
      element &&
      (
        element.tagName === "INPUT" ||
        element.tagName === "TEXTAREA" ||
        element.tagName === "SELECT" ||
        element.isContentEditable
      )
    );
  }

  function setStatus(text) {
    if (statusElement) {
      statusElement.textContent = text;
    }
  }

  function setPinStatus(text) {
    if (pinStatusElement) {
      pinStatusElement.textContent = text;
    }
  }

  function setTokenStatus(text) {
    if (tokenStatusElement) {
      tokenStatusElement.textContent = text;
    }
  }

  function setSoundTokenStatus(text) {
    if (soundTokenStatusElement) {
      soundTokenStatusElement.textContent = text;
    }
  }

  function setGroupStatus(text) {
    if (pinGroupStatusElement) {
      pinGroupStatusElement.textContent = text;
    }
  }

  function setLinkedMapStatus(text) {
    if (pinDetailLinkedMapStatusElement) {
      pinDetailLinkedMapStatusElement.textContent = text;
    }
  }

  function renderLinkedMapOptions(selectedTargetValue = "", currentMapId = "") {
    if (!pinDetailLinkedMapInput) {
      return;
    }
    const availableTargets = typeof getAvailableLinkTargets === "function"
      ? getAvailableLinkTargets() || {}
      : {};
    const availableMaps = availableTargets.maps || [];
    const availableBattlemaps = availableTargets.battlemaps || [];
    pinDetailLinkedMapInput.innerHTML = "";
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Keine Verlinkung";
    pinDetailLinkedMapInput.appendChild(emptyOption);
    for (const mapItem of availableMaps) {
      if (!mapItem?.id || mapItem.id === currentMapId) {
        continue;
      }
      const option = document.createElement("option");
      option.value = `map:${mapItem.id}`;
      option.textContent = `Karte: ${mapItem.name || mapItem.id}`;
      pinDetailLinkedMapInput.appendChild(option);
    }
    for (const battlemapItem of availableBattlemaps) {
      if (!battlemapItem?.id) {
        continue;
      }
      const option = document.createElement("option");
      option.value = `battlemap:${battlemapItem.id}`;
      option.textContent = `Battlemap: ${battlemapItem.name || battlemapItem.id}`;
      pinDetailLinkedMapInput.appendChild(option);
    }
    pinDetailLinkedMapInput.value = selectedTargetValue || "";
  }

  function getPinById(pinId) {
    return pins.find((pin) => pin.id === pinId) || null;
  }

  function canCurrentUserMovePin(pin) {
    if (!pin) {
      return false;
    }
    const currentRole = String(globalThis.currentUserRole || "").trim().toLowerCase();
    if (currentRole === "admin" || currentRole === "spielleiter") {
      return true;
    }
    if (String(pin.pin_type || "pin") !== "token") {
      return false;
    }
    if (pin.can_move) {
      return true;
    }
    const currentUserId = String(globalThis.currentUserId || "").trim();
    const currentUsername = String(globalThis.currentUsername || "").trim().toLowerCase();
    const assignedUserId = String(pin.assigned_user_id || "").trim();
    const assignedUsername = String(pin.assigned_username || "").trim().toLowerCase();
    const pinName = String(pin.name || "").trim().toLowerCase();
    const pinOwner = String(pin.username || "").trim().toLowerCase();
    return Boolean(
      (currentUserId && assignedUserId && currentUserId === assignedUserId)
      || (currentUsername && assignedUsername && currentUsername === assignedUsername)
      || (currentUsername && (currentUsername === pinName || currentUsername === pinOwner))
    );
  }

  function isCurrentUserGameMaster() {
    return Boolean(canManagePins || canManageTokens || canManageFog());
  }

  function canCurrentUserSeeTokenVision(pin) {
    if (!pin || String(pin.pin_type || "pin") !== "token") {
      return false;
    }
    if (isCurrentUserGameMaster()) {
      return true;
    }
    return canCurrentUserMovePin(pin);
  }

  function getFogVisibilityTokens() {
    const publicTokens = pins.filter(
      (pin) => pin.pin_type === "token" && String(pin.visibility_layer || "public") === "public"
    );
    if (isCurrentUserGameMaster()) {
      return publicTokens;
    }
    return publicTokens.filter((pin) => canCurrentUserSeeTokenVision(pin));
  }

  function getGroupedPins(groupId) {
    if (!groupId) {
      return [];
    }
    return pins.filter((pin) => pin.group_id === groupId);
  }

  function clearSelectedTokens() {
    selectedTokenIds = new Set();
  }

  function toggleTokenSelection(pinId) {
    if (!pinId) {
      return;
    }
    if (selectedTokenIds.has(pinId)) {
      selectedTokenIds.delete(pinId);
    } else {
      selectedTokenIds.add(pinId);
    }
  }

  function setSelectedTokens(tokenIds) {
    selectedTokenIds = new Set((tokenIds || []).filter(Boolean));
  }

  function syncSelectedTokens() {
    const availableTokenIds = new Set(
      pins.filter((pin) => pin.pin_type === "token").map((pin) => pin.id)
    );
    selectedTokenIds = new Set([...selectedTokenIds].filter((pinId) => availableTokenIds.has(pinId)));
  }

  function isPlacementArmed() {
    return pinPlacementArmed || tokenPlacementArmed || soundTokenPlacementArmed;
  }

  function isAnyToolArmed() {
    return isPlacementArmed() || wallPlacementArmed || doorPlacementArmed;
  }

  async function readApiResponse(response) {
    const rawText = await response.text();
    let data = {};
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { detail: rawText };
      }
    }
    return data;
  }

  function updatePinPlacementUi() {
    if (pinPlacementButton) {
      pinPlacementButton.textContent = pinPlacementArmed ? "Pin-Modus beenden" : "Pin setzen";
    }
    if (tokenPlacementButton) {
      tokenPlacementButton.textContent = tokenPlacementArmed ? "Token-Modus beenden" : "Token setzen";
    }
    if (soundTokenPlacementButton) {
      soundTokenPlacementButton.textContent = soundTokenPlacementArmed ? "Sound-Token-Modus beenden" : "Sound-Token setzen";
    }
    if (!pinPlacementArmed && !activePinId) {
      setPinStatus("Pin-Modus aus.");
    }
    if (!tokenPlacementArmed) {
      setTokenStatus("Token-Modus aus.");
    }
    if (!soundTokenPlacementArmed) {
      setSoundTokenStatus("Sound-Token-Modus aus.");
    }
  }

  function resizeStageToImage() {
    const naturalWidth = imageElement.naturalWidth || 0;
    const naturalHeight = imageElement.naturalHeight || 0;
    if (!naturalWidth || !naturalHeight) {
      return;
    }

    currentSurfaceMeta.canvasWidth = naturalWidth;
    currentSurfaceMeta.canvasHeight = naturalHeight;
    resizeStageSurface(naturalWidth, naturalHeight);
  }

  function resizeStageSurface(width, height) {
    if (!width || !height) {
      return;
    }

    stageElement.style.width = `${width}px`;
    stageElement.style.height = `${height}px`;
    stageElement.style.backgroundColor = currentSurfaceMeta.backgroundColor || "#223044";
    canvasElement.width = width;
    canvasElement.height = height;
    if (!hasInitializedView) {
      resetView();
      hasInitializedView = true;
    }
    renderOverlays();
    renderPins();
    renderFrame();
    applyZoom();
  }

  function hasRenderableSurface() {
    return Boolean(
      activeImageUrl ||
      (Number(currentSurfaceMeta.canvasWidth || 0) > 0 && Number(currentSurfaceMeta.canvasHeight || 0) > 0)
    );
  }

  function updateZoomLabel() {
    if (zoomValueElement) {
      zoomValueElement.textContent = `${Math.round(zoomScale * 100)} %`;
    }
    if (zoomInput) {
      zoomInput.value = String(Math.round(zoomScale * 100));
    }
  }

  function resetView() {
    zoomScale = Number(zoomInput?.value || 100) / 100;
    panOffsetX = 0;
    panOffsetY = 0;
    updateZoomLabel();
  }

  function applyZoom() {
    stageElement.style.transform = `translate(${panOffsetX}px, ${panOffsetY}px) scale(${zoomScale})`;
  }

  function setZoom(nextZoom, anchorPoint = null) {
    const clampedZoom = Math.min(Math.max(nextZoom, 0.5), 3);
    if (anchorPoint && zoomScale > 0) {
      const localX = (anchorPoint.x - panOffsetX) / zoomScale;
      const localY = (anchorPoint.y - panOffsetY) / zoomScale;
      panOffsetX = anchorPoint.x - (localX * clampedZoom);
      panOffsetY = anchorPoint.y - (localY * clampedZoom);
    }
    zoomScale = clampedZoom;
    updateZoomLabel();
    applyZoom();
    clampPinDetailPosition();
  }

  function syncDrawControls() {
    if (colorInput) {
      currentDrawColor = colorInput.value || "#ff6b6b";
      persistDrawColor();
    }
    if (widthInput) {
      currentDrawWidth = Number(widthInput.value || 3);
    }
    if (widthValueElement) {
      widthValueElement.textContent = `${currentDrawWidth} px`;
    }
  }

  function syncVisionLabel(input, valueElement) {
    if (!input || !valueElement) {
      return;
    }
    valueElement.textContent = `${Math.round(Number(input.value || 18))} %`;
  }

  function visionPercentToRadius(value) {
    const numericValue = Number(value || 18);
    return Math.min(Math.max(numericValue / 100, 0.05), 0.6);
  }

  function radiusToVisionPercent(value) {
    return Math.round(Math.min(Math.max(Number(value || 0.18) * 100, 5), 60));
  }

  function canManageFog() {
    return Boolean(fogEnabledInput || fogWallModeButton || fogDeleteWallButton || fogClearExploredButton);
  }

  function getFogScope() {
    const mapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
    const layerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
    return { mapId, layerId };
  }

  function updateFogControls() {
    const wallCount = Array.isArray(fogState.walls) ? fogState.walls.length : 0;
    const doorCount = Array.isArray(fogState.doors) ? fogState.doors.length : 0;
    const selectedLabel = selectedFogElement
      ? selectedFogElement.type === "door" ? "Tuer ausgewaehlt." : "Wand ausgewaehlt."
      : "";
    if (fogStatusElement) {
      if (!fogState.enabled) {
        fogStatusElement.textContent = wallCount || doorCount
          ? `Nebel ist fuer diese Ebene aus. Vorbereitet: ${wallCount} Waende, ${doorCount} Tueren. ${selectedLabel}`.trim()
          : "Nebel ist fuer diese Ebene aus.";
      } else {
        const modeLabel = wallPlacementArmed ? "Wandmodus laeuft." : doorPlacementArmed ? "Tuermodus laeuft." : "";
        fogStatusElement.textContent = `Nebel aktiv. ${modeLabel} Waende: ${wallCount}, Tueren: ${doorCount}. ${selectedLabel}`.replace(/\s+/g, " ").trim();
      }
    }
    if (fogEnabledInput) {
      fogEnabledInput.checked = Boolean(fogState.enabled);
    }
    if (fogWallModeButton) {
      fogWallModeButton.classList.toggle("active", wallPlacementArmed);
      fogWallModeButton.disabled = !canManageFog() || !hasRenderableSurface();
      fogWallModeButton.textContent = wallPlacementArmed ? "Wandmodus beenden" : "Wandmodus";
    }
    if (fogDoorModeButton) {
      fogDoorModeButton.classList.toggle("active", doorPlacementArmed);
      fogDoorModeButton.disabled = !canManageFog() || !hasRenderableSurface();
      fogDoorModeButton.textContent = doorPlacementArmed ? "Tuermodus beenden" : "Tuermodus";
    }
    if (fogDeleteWallButton) {
      fogDeleteWallButton.disabled = !canManageFog() || (!selectedFogElement && !(fogState.walls || []).length && !(fogState.doors || []).length);
      fogDeleteWallButton.textContent = selectedFogElement ? "Auswahl loeschen" : "Letztes Element";
    }
    if (fogClearExploredButton) {
      fogClearExploredButton.disabled = !canManageFog() || !fogState.enabled || !(fogState.explored_areas || []).length;
    }
  }

  function crossProduct(ax, ay, bx, by) {
    return (ax * by) - (ay * bx);
  }

  function getFogWallsWithBounds() {
    const walls = Array.isArray(fogState.walls) ? [...fogState.walls] : [];
    const closedDoors = Array.isArray(fogState.doors)
      ? fogState.doors.filter((door) => !door.is_open)
      : [];
    const blockers = walls.concat(closedDoors);
    return blockers.concat([
      { id: "__bound_top", x1: 0, y1: 0, x2: 1, y2: 0 },
      { id: "__bound_right", x1: 1, y1: 0, x2: 1, y2: 1 },
      { id: "__bound_bottom", x1: 1, y1: 1, x2: 0, y2: 1 },
      { id: "__bound_left", x1: 0, y1: 1, x2: 0, y2: 0 },
    ]);
  }

  function castVisibilityRay(origin, angle, maxDistance, walls) {
    const rayX = Math.cos(angle);
    const rayY = Math.sin(angle);
    let nearestDistance = maxDistance;
    let nearestPoint = {
      x: origin.x + (rayX * maxDistance),
      y: origin.y + (rayY * maxDistance),
    };

    for (const wall of walls) {
      const segX = wall.x2 - wall.x1;
      const segY = wall.y2 - wall.y1;
      const denominator = crossProduct(rayX, rayY, segX, segY);
      if (Math.abs(denominator) < 1e-9) {
        continue;
      }
      const diffX = wall.x1 - origin.x;
      const diffY = wall.y1 - origin.y;
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

    nearestPoint.x = Math.min(Math.max(nearestPoint.x, 0), 1);
    nearestPoint.y = Math.min(Math.max(nearestPoint.y, 0), 1);
    return nearestPoint;
  }

  function getTokenVisibilityPolygon(token) {
    const radius = Math.min(Math.max(Number(token.vision_radius || 0.18), 0.05), 0.6);
    const origin = { x: Number(token.x || 0), y: Number(token.y || 0) };
    const walls = getFogWallsWithBounds();
    const angles = [];
    const baseSteps = 64;
    for (let index = 0; index < baseSteps; index += 1) {
      angles.push((Math.PI * 2 * index) / baseSteps);
    }
    for (const wall of walls) {
      for (const endpoint of [
        { x: wall.x1, y: wall.y1 },
        { x: wall.x2, y: wall.y2 },
      ]) {
        const angle = Math.atan2(endpoint.y - origin.y, endpoint.x - origin.x);
        angles.push(angle - 0.0001, angle, angle + 0.0001);
      }
    }
    const points = angles
      .sort((left, right) => left - right)
      .map((angle) => castVisibilityRay(origin, angle, radius, walls));
    return {
      origin,
      radius,
      points,
    };
  }

  function drawVisibilityPolygon(polygon) {
    const width = canvasElement.width || 0;
    const height = canvasElement.height || 0;
    if (!width || !height || !polygon.points.length) {
      return;
    }
    context.beginPath();
    context.moveTo(polygon.origin.x * width, polygon.origin.y * height);
    for (const point of polygon.points) {
      context.lineTo(point.x * width, point.y * height);
    }
    context.closePath();
    context.fill();
  }

  function drawFogExploredAreas() {
    const width = canvasElement.width || 0;
    const height = canvasElement.height || 0;
    if (!width || !height) {
      return;
    }
    const exploredAreas = Array.isArray(fogState.explored_areas) ? fogState.explored_areas : [];
    if (!exploredAreas.length) {
      return;
    }
    context.save();
    context.globalCompositeOperation = "destination-out";
    for (const area of exploredAreas) {
      context.globalAlpha = 0.35;
      context.beginPath();
      context.arc(area.x * width, area.y * height, area.radius * Math.max(width, height), 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }

  function drawTokenCoreVisibility(tokens) {
    const width = canvasElement.width || 0;
    const height = canvasElement.height || 0;
    if (!width || !height || !tokens.length) {
      return;
    }
    for (const token of tokens) {
      const coreRadius = Math.min(Math.max(Number(token.vision_radius || 0.18) * 0.22, 0.018), 0.05);
      context.beginPath();
      context.arc(Number(token.x || 0) * width, Number(token.y || 0) * height, coreRadius * Math.max(width, height), 0, Math.PI * 2);
      context.fill();
    }
  }

  function drawFogVisibility() {
    const width = canvasElement.width || 0;
    const height = canvasElement.height || 0;
    if (!width || !height || !fogState.enabled) {
      return;
    }
    const visibilityTokens = getFogVisibilityTokens();
    context.save();
    context.fillStyle = isCurrentUserGameMaster() ? "rgba(10, 12, 18, 0.62)" : "#000000";
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = "destination-out";
    context.globalAlpha = 1;
    context.fillStyle = "#000000";
    for (const token of visibilityTokens) {
      drawVisibilityPolygon(getTokenVisibilityPolygon(token));
    }
    drawTokenCoreVisibility(visibilityTokens);
    context.restore();
  }

  function drawFogWalls() {
    if (!canManageFog()) {
      return;
    }
    const width = canvasElement.width || 0;
    const height = canvasElement.height || 0;
    if (!width || !height) {
      return;
    }
    context.save();
    context.strokeStyle = "rgba(170, 210, 255, 0.9)";
    context.lineWidth = 3;
    for (const wall of fogState.walls || []) {
      const selected = selectedFogElement?.type === "wall" && selectedFogElement.id === wall.id;
      context.strokeStyle = selected ? "rgba(255, 236, 132, 1)" : "rgba(170, 210, 255, 0.9)";
      context.lineWidth = selected ? 6 : 3;
      context.beginPath();
      context.moveTo(wall.x1 * width, wall.y1 * height);
      context.lineTo(wall.x2 * width, wall.y2 * height);
      context.stroke();
    }
    for (const door of fogState.doors || []) {
      const selected = selectedFogElement?.type === "door" && selectedFogElement.id === door.id;
      context.strokeStyle = selected
        ? "rgba(255, 236, 132, 1)"
        : door.is_open
          ? "rgba(92, 224, 155, 0.95)"
          : "rgba(255, 165, 92, 0.95)";
      context.lineWidth = selected ? 7 : 4;
      context.setLineDash(door.is_open ? [10, 8] : []);
      context.beginPath();
      context.moveTo(door.x1 * width, door.y1 * height);
      context.lineTo(door.x2 * width, door.y2 * height);
      context.stroke();
      context.setLineDash([]);
    }
    if ((wallPlacementArmed || doorPlacementArmed) && pendingWall && hoverPoint) {
      context.strokeStyle = "rgba(197, 167, 255, 0.95)";
      context.setLineDash([8, 6]);
      context.beginPath();
      context.moveTo(pendingWall.x * width, pendingWall.y * height);
      context.lineTo(hoverPoint.x * width, hoverPoint.y * height);
      context.stroke();
    }
    context.restore();
  }

  function mergeExploredAreas(baseAreas, nextAreas) {
    const mergedAreas = Array.isArray(baseAreas) ? [...baseAreas] : [];
    for (const area of nextAreas) {
      const duplicate = mergedAreas.some((existing) => {
        const dx = existing.x - area.x;
        const dy = existing.y - area.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));
        return distance <= Math.max(existing.radius, area.radius) * 0.35;
      });
      if (!duplicate) {
        mergedAreas.push(area);
      }
    }
    return mergedAreas.slice(-250);
  }

  function getVisibleExplorationAreas() {
    return pins
      .filter((pin) => pin.pin_type === "token")
      .map((pin) => ({
        x: Number(pin.x || 0),
        y: Number(pin.y || 0),
        radius: Math.min(Math.max(Number(pin.vision_radius || 0.18), 0.05), 0.6),
      }));
  }

  function drawStroke(stroke) {
    const points = Array.isArray(stroke.points) ? stroke.points : [];
    if (!points.length) {
      return;
    }

    const width = canvasElement.width || 0;
    const height = canvasElement.height || 0;
    if (!width || !height) {
      return;
    }

    context.save();
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = stroke.color || "#ff6b6b";
    context.lineWidth = Number(stroke.width) || 3;
    const firstPoint = points[0];
    const firstX = firstPoint.x * width;
    const firstY = firstPoint.y * height;
    if (points.length === 1) {
      context.fillStyle = stroke.color || "#ff6b6b";
      context.beginPath();
      context.arc(firstX, firstY, Math.max(context.lineWidth / 2, 1.5), 0, Math.PI * 2);
      context.fill();
      context.restore();
      return;
    }

    context.beginPath();
    context.moveTo(firstX, firstY);
    for (const point of points.slice(1)) {
      context.lineTo(point.x * width, point.y * height);
    }
    context.stroke();
    context.restore();
  }

  function drawPing(ping) {
    const width = canvasElement.width || 0;
    const height = canvasElement.height || 0;
    if (!width || !height) {
      return;
    }

    const createdAt = Date.parse(ping.created_at || "");
    if (!createdAt) {
      return;
    }

    const serverNow = Date.now() - serverClockOffsetMs;
    const ageSeconds = (serverNow - createdAt) / 1000;
    if (ageSeconds < 0 || ageSeconds > pingTtlSeconds) {
      return;
    }

    const progress = ageSeconds / pingTtlSeconds;
    const centerX = ping.x * width;
    const centerY = ping.y * height;
    const baseRadius = 14 + progress * 58;
    const secondRadius = 6 + progress * 42;
    const alpha = 1 - progress;
    const color = ping.color || "#ff6b6b";

    context.save();
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.globalAlpha = alpha * 0.9;
    context.beginPath();
    context.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    context.stroke();
    context.globalAlpha = alpha * 0.6;
    context.beginPath();
    context.arc(centerX, centerY, secondRadius, 0, Math.PI * 2);
    context.stroke();
    context.globalAlpha = alpha;
    context.fillStyle = color;
    context.beginPath();
    context.arc(centerX, centerY, 4, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  function pruneExpiredPings() {
    const cutoff = (Date.now() - serverClockOffsetMs) - pingTtlSeconds * 1000;
    pings = pings.filter((ping) => {
      const createdAt = Date.parse(ping.created_at || "");
      return createdAt && createdAt >= cutoff;
    });
  }

  function renderFrame() {
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
    drawFogVisibility();
    for (const stroke of strokes) {
      drawStroke(stroke);
    }
    if (pendingPoints.length) {
      drawStroke({ color: currentDrawColor, width: currentDrawWidth, points: pendingPoints });
    }
    pruneExpiredPings();
    for (const ping of pings) {
      drawPing(ping);
    }
    drawFogWalls();
  }

  function hidePinDetails() {
    activePinId = "";
    if (pinDetailCard) {
      pinDetailCard.classList.add("hidden");
    }
    setGroupStatus("");
  }

  function clearActiveOverlay() {
    activeOverlayId = "";
    renderOverlays();
  }

  function updateOverlaySelectionUi() {
    if (!overlayLayerElement) {
      return;
    }
    for (const element of overlayLayerElement.querySelectorAll(".map-overlay-item")) {
      element.classList.toggle("active", element.dataset.overlayId === activeOverlayId);
    }
  }

  function resetPinDetailPosition() {
    if (!pinDetailCard) {
      return;
    }
    pinDetailCard.style.left = "24px";
    pinDetailCard.style.top = "24px";
  }

  function clampPinDetailPosition() {
    if (!pinDetailCard) {
      return;
    }
    const parent = pinDetailCard.offsetParent;
    if (!parent) {
      return;
    }

    const maxLeft = Math.max(parent.clientWidth - pinDetailCard.offsetWidth - 12, 12);
    const maxTop = Math.max(parent.clientHeight - pinDetailCard.offsetHeight - 12, 12);
    const nextLeft = Math.min(Math.max(pinDetailCard.offsetLeft, 12), maxLeft);
    const nextTop = Math.min(Math.max(pinDetailCard.offsetTop, 12), maxTop);
    pinDetailCard.style.left = `${nextLeft}px`;
    pinDetailCard.style.top = `${nextTop}px`;
  }

  function updateTokenGroupUi(pin) {
    const isManageableToken = Boolean(
      pin &&
      canManageTokens &&
      pin.pin_type === "token"
    );
    if (pinDetailGroupWrap) {
      pinDetailGroupWrap.classList.toggle("hidden", !isManageableToken);
    }
    if (!isManageableToken) {
      setGroupStatus("");
      return;
    }

    const selectedCount = [...selectedTokenIds]
      .map((tokenId) => getPinById(tokenId))
      .filter((token) => token && token.pin_type === "token").length;
    const groupMembers = pin.group_id ? getGroupedPins(pin.group_id) : [];
    if (pinGroupButton) {
      pinGroupButton.disabled = selectedCount < 2;
    }
    if (pinUngroupButton) {
      pinUngroupButton.disabled = groupMembers.length < 2;
    }
    if (groupMembers.length >= 2) {
      setGroupStatus(`Gruppe mit ${groupMembers.length} Tokens. Auswahl: ${selectedCount}.`);
      return;
    }
    if (selectedCount >= 2) {
      setGroupStatus(`${selectedCount} Tokens ausgewaehlt. Mit Gruppieren zusammenfassen.`);
      return;
    }
    setGroupStatus("Mit Strg-Klick mehrere Tokens auswaehlen.");
  }

  function showPinDetails(pin) {
    activePinId = pin.id;
    clearActiveOverlay();
    if (!pinDetailCard || !pinDetailNameElement || !pinDetailDescriptionElement || !pinDetailImageElement) {
      return;
    }
    pinDetailNameElement.value = pin.name || "";
    pinDetailDescriptionElement.value = pin.description || "";
    pinDetailNameElement.readOnly = !canManagePins;
    pinDetailDescriptionElement.readOnly = !canManagePins;
    if (pinDetailShowLabelInput) {
      pinDetailShowLabelInput.checked = Boolean(pin.show_label);
      pinDetailShowLabelInput.disabled = !canManagePins;
    }
    if (pinDetailShowLabelWrap) {
      pinDetailShowLabelWrap.classList.toggle("hidden", !canManagePins);
    }
    if (pinDetailHiddenInput) {
      pinDetailHiddenInput.checked = String(pin.visibility_layer || "public") === "gm";
      pinDetailHiddenInput.disabled = !canManagePins;
    }
    if (pinDetailHiddenWrap) {
      pinDetailHiddenWrap.classList.toggle("hidden", !canManagePins);
    }
    if (pinDetailAssignedUserInput) {
      pinDetailAssignedUserInput.value = pin.assigned_user_id || "";
      pinDetailAssignedUserInput.disabled = !canManagePins;
    }
    if (pinDetailAssignedUserWrap) {
      pinDetailAssignedUserWrap.classList.toggle("hidden", !canManagePins || pin.pin_type !== "token");
    }
    if (pinDetailVisionInput) {
      pinDetailVisionInput.value = String(radiusToVisionPercent(pin.vision_radius));
      syncVisionLabel(pinDetailVisionInput, pinDetailVisionValueElement);
      pinDetailVisionInput.disabled = !canManagePins || pin.pin_type !== "token";
    }
    if (pinDetailVisionWrap) {
      pinDetailVisionWrap.classList.toggle("hidden", !canManagePins || pin.pin_type !== "token");
    }
    const selectedTargetValue = pin.target_id && pin.target_kind ? `${pin.target_kind}:${pin.target_id}` : "";
    renderLinkedMapOptions(selectedTargetValue, pin.map_id || "");
    if (pinDetailLinkedMapInput) {
      pinDetailLinkedMapInput.disabled = !canManagePins || pin.pin_type === "sound_token";
    }
    if (pinDetailLinkedMapWrap) {
      pinDetailLinkedMapWrap.classList.toggle("hidden", !canManagePins || pin.pin_type === "sound_token");
    }
    if (pinDetailLinkedMapActions) {
      pinDetailLinkedMapActions.classList.toggle("hidden", !canManagePins);
    }
    if (pinDetailActivateMapButton) {
      pinDetailActivateMapButton.disabled = !canManagePins || !pin.target_id;
      pinDetailActivateMapButton.dataset.targetKind = pin.target_kind || "";
      pinDetailActivateMapButton.dataset.targetId = pin.target_id || "";
      pinDetailActivateMapButton.dataset.pinId = pin.id;
    }
    const availableTargets = typeof getAvailableLinkTargets === "function" ? (getAvailableLinkTargets() || {}) : {};
    let linkedTargetLabel = "";
    if (pin.target_kind === "battlemap" && pin.target_id) {
      linkedTargetLabel = (availableTargets.battlemaps || []).find((item) => item.id === pin.target_id)?.name || "Battlemap";
      setLinkedMapStatus(`Verlinkt mit Battlemap: ${linkedTargetLabel}.`);
    } else if (pin.target_kind === "map" && pin.target_id) {
      linkedTargetLabel = (availableTargets.maps || []).find((item) => item.id === pin.target_id)?.name || "Karte";
      setLinkedMapStatus(`Verlinkt mit Karte: ${linkedTargetLabel}.`);
    } else {
      setLinkedMapStatus("Keine Karte oder Battlemap verlinkt.");
    }
    if (pinDetailSoundInputWrap) {
      pinDetailSoundInputWrap.classList.toggle("hidden", !canManagePins || pin.pin_type !== "sound_token");
    }
    if (pinDetailSoundWrap) {
      pinDetailSoundWrap.classList.toggle("hidden", pin.pin_type !== "sound_token");
    }
    if (pinDetailSoundPlayButton) {
      pinDetailSoundPlayButton.classList.toggle("hidden", pin.pin_type !== "sound_token" || !canManagePins);
      pinDetailSoundPlayButton.disabled = !canManagePins || pin.pin_type !== "sound_token";
      pinDetailSoundPlayButton.dataset.pinId = pin.id;
    }
    if (pinDetailSoundStatusElement) {
      pinDetailSoundStatusElement.textContent = pin.sound_title || (pin.sound_name ? "Sound hinterlegt." : "Kein Sound hinterlegt.");
    }
    updateTokenGroupUi(pin);
    if (pinDetailImageInputWrap) {
      pinDetailImageInputWrap.classList.toggle("hidden", !canManagePins || pin.pin_type === "sound_token");
    }
    if (pinSaveButton) {
      pinSaveButton.classList.toggle("hidden", !canManagePins);
      pinSaveButton.dataset.pinId = pin.id;
    }
    if (pin.image_url) {
      pinDetailImageElement.src = pin.image_url;
      pinDetailImageElement.classList.remove("hidden");
    } else {
      pinDetailImageElement.removeAttribute("src");
      pinDetailImageElement.classList.add("hidden");
    }
    if (pinDeleteButton) {
      pinDeleteButton.classList.toggle("hidden", !canManagePins);
      pinDeleteButton.dataset.pinId = pin.id;
    }
    if (pinDetailImageInput) {
      pinDetailImageInput.value = "";
    }
    if (pinDetailSoundInput) {
      pinDetailSoundInput.value = "";
    }
    pinDetailCard.classList.remove("hidden");
    clampPinDetailPosition();
  }

  function clampOverlayGeometry(geometry) {
    const minSize = 0.04;
    const width = Math.min(Math.max(geometry.width, minSize), 1);
    const height = Math.min(Math.max(geometry.height, minSize), 1);
    const x = Math.min(Math.max(geometry.x, 0), 1 - width);
    const y = Math.min(Math.max(geometry.y, 0), 1 - height);
    return { x, y, width, height };
  }

  function resizeOverlayGeometry(startGeometry, handle, dx, dy) {
    let { x, y, width, height } = startGeometry;
    if (handle.includes("e")) {
      width += dx;
    }
    if (handle.includes("s")) {
      height += dy;
    }
    if (handle.includes("w")) {
      x += dx;
      width -= dx;
    }
    if (handle.includes("n")) {
      y += dy;
      height -= dy;
    }
    return { x, y, width, height };
  }

  function applyOverlayGeometry(element, geometry) {
    element.style.left = `${geometry.x * 100}%`;
    element.style.top = `${geometry.y * 100}%`;
    element.style.width = `${geometry.width * 100}%`;
    element.style.height = `${geometry.height * 100}%`;
  }

  function renderOverlays() {
    if (!overlayLayerElement) {
      return;
    }

    overlayLayerElement.innerHTML = "";
    for (const overlay of overlays) {
      const element = document.createElement("div");
      element.className = `map-overlay-item${overlay.id === activeOverlayId ? " active" : ""}`;
      if (overlay.visibility_layer === "gm") {
        element.classList.add("map-overlay-gm-layer");
      }
      if (canManageOverlays) {
        element.classList.add("editable");
      }
      element.style.left = `${overlay.x * 100}%`;
      element.style.top = `${overlay.y * 100}%`;
      element.style.width = `${overlay.width * 100}%`;
      element.style.height = `${overlay.height * 100}%`;
      element.dataset.overlayId = overlay.id;

      const image = document.createElement("img");
      image.className = "map-overlay-image";
      image.src = overlay.image_url;
      image.alt = "Overlay";
      image.draggable = false;
      element.appendChild(image);

      if (canManageOverlays) {
        for (const handleName of ["nw", "n", "ne", "e", "se", "s", "sw", "w"]) {
          const handle = document.createElement("div");
          handle.className = `map-overlay-handle ${handleName}`;
          handle.dataset.handle = handleName;
          element.appendChild(handle);
        }
      }

      element.addEventListener("click", (event) => {
        hideOverlayLayerMenu();
        event.preventDefault();
        event.stopPropagation();
        activeOverlayId = overlay.id;
        hidePinDetails();
        updateOverlaySelectionUi();
      });

      if (canManageOverlays) {
        element.addEventListener("mousedown", (event) => {
          if (event.button === 2) {
            event.preventDefault();
            event.stopPropagation();
          }
        });
        element.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          event.stopPropagation();
          activeOverlayId = overlay.id;
          hidePinDetails();
          updateOverlaySelectionUi();
          showOverlayLayerMenu(overlay, event);
        });
      }

      if (canManageOverlays) {
        element.addEventListener("pointerdown", (event) => {
          if (event.button !== 0 || isAnyToolArmed()) {
            return;
          }

          const point = pointerPoint(event);
          if (!point) {
            return;
          }

          const handle = event.target.closest(".map-overlay-handle");
          activeOverlayId = overlay.id;
          hidePinDetails();
          updateOverlaySelectionUi();
          event.preventDefault();
          event.stopPropagation();
          element.setPointerCapture(event.pointerId);

          if (handle) {
            overlayResizeState = {
              overlayId: overlay.id,
              pointerId: event.pointerId,
              handle: handle.dataset.handle,
              startPoint: point,
              startGeometry: { x: overlay.x, y: overlay.y, width: overlay.width, height: overlay.height },
              latestGeometry: { x: overlay.x, y: overlay.y, width: overlay.width, height: overlay.height },
            };
            return;
          }

          overlayMoveState = {
            overlayId: overlay.id,
            pointerId: event.pointerId,
            startPoint: point,
            startGeometry: { x: overlay.x, y: overlay.y, width: overlay.width, height: overlay.height },
            latestGeometry: { x: overlay.x, y: overlay.y, width: overlay.width, height: overlay.height },
          };
        });

        element.addEventListener("pointermove", (event) => {
          const point = pointerPoint(event);
          if (!point) {
            return;
          }

          if (overlayMoveState && overlayMoveState.overlayId === overlay.id && overlayMoveState.pointerId === event.pointerId) {
            event.preventDefault();
            event.stopPropagation();
            const dx = point.x - overlayMoveState.startPoint.x;
            const dy = point.y - overlayMoveState.startPoint.y;
            overlayMoveState.latestGeometry = clampOverlayGeometry({
              x: overlayMoveState.startGeometry.x + dx,
              y: overlayMoveState.startGeometry.y + dy,
              width: overlayMoveState.startGeometry.width,
              height: overlayMoveState.startGeometry.height,
            });
            applyOverlayGeometry(element, overlayMoveState.latestGeometry);
            return;
          }

          if (overlayResizeState && overlayResizeState.overlayId === overlay.id && overlayResizeState.pointerId === event.pointerId) {
            event.preventDefault();
            event.stopPropagation();
            overlayResizeState.latestGeometry = clampOverlayGeometry(
              resizeOverlayGeometry(overlayResizeState.startGeometry, overlayResizeState.handle, point.x - overlayResizeState.startPoint.x, point.y - overlayResizeState.startPoint.y)
            );
            applyOverlayGeometry(element, overlayResizeState.latestGeometry);
          }
        });

        async function finishOverlayEdit(event) {
          let nextGeometry = null;
          if (overlayMoveState && overlayMoveState.overlayId === overlay.id && overlayMoveState.pointerId === event.pointerId) {
            nextGeometry = overlayMoveState.latestGeometry;
            overlayMoveState = null;
          } else if (overlayResizeState && overlayResizeState.overlayId === overlay.id && overlayResizeState.pointerId === event.pointerId) {
            nextGeometry = overlayResizeState.latestGeometry;
            overlayResizeState = null;
          } else {
            return;
          }

          try {
            element.releasePointerCapture(event.pointerId);
          } catch {}

          try {
            setStatus("Overlay wird aktualisiert...");
            await persistOverlayGeometry(overlay.id, nextGeometry);
            setStatus("Bereit");
          } catch (error) {
            setStatus(error.message);
            renderOverlays();
          }
        }

        element.addEventListener("pointerup", finishOverlayEdit);
        element.addEventListener("pointercancel", finishOverlayEdit);
      }

      overlayLayerElement.appendChild(element);
    }
  }

  function renderPins() {
    if (!pinLayerElement) {
      return;
    }
    pinLayerElement.innerHTML = "";

    for (const pin of pins) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "map-pin";
      button.dataset.pinId = pin.id;
      if (pin.pin_type === "token") {
        button.classList.add("map-token");
      } else if (pin.pin_type === "sound_token") {
        button.classList.add("map-sound-token");
      }
      if (pin.group_id) {
        button.classList.add("grouped");
      }
      if (selectedTokenIds.has(pin.id)) {
        button.classList.add("selected");
      }
      if (pin.hidden_from_players) {
        button.classList.add("map-pin-hidden");
      }
      if (pin.visibility_layer === "gm") {
        button.classList.add("map-pin-gm-layer");
      }
      if (pin.target_id) {
        button.classList.add("map-pin-linked");
        if (pin.target_kind === "battlemap") {
          button.classList.add("map-pin-linked-battlemap");
        }
      }
      button.style.left = `${pin.x * 100}%`;
      button.style.top = `${pin.y * 100}%`;
      button.title = pin.name;
      if (canCurrentUserMovePin(pin)) {
        button.classList.add("movable");
      }
      if (pin.pin_type === "token") {
        const tokenImage = document.createElement("span");
        tokenImage.className = "map-token-image";
        if (pin.image_url) {
          tokenImage.style.backgroundImage = `url("${pin.image_url}")`;
        }
        button.appendChild(tokenImage);
      } else if (pin.pin_type === "sound_token") {
        const soundBadge = document.createElement("span");
        soundBadge.className = "map-sound-token-glyph";
        soundBadge.textContent = "♪";
        button.appendChild(soundBadge);
      }
      button.addEventListener("click", (event) => {
        hidePinLayerMenu();
        if (Date.now() < suppressPinDetailOpenUntil) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (lastPinMoveFinishedId === pin.id) {
          lastPinMoveFinishedId = "";
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (pinMoveState && pinMoveState.pinId === pin.id) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (canManageTokens && pin.pin_type === "token" && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          event.stopPropagation();
          toggleTokenSelection(pin.id);
          renderPins();
          showPinDetails(pin);
          return;
        }
        if (canManageTokens && pin.pin_type === "token") {
          setSelectedTokens([pin.id]);
          renderPins();
        }
        if (canManageTokens && pin.pin_type !== "token" && selectedTokenIds.size) {
          clearSelectedTokens();
          renderPins();
        }
        event.preventDefault();
        event.stopPropagation();
        showPinDetails(pin);
      });

      if (canManagePins) {
        button.addEventListener("mousedown", (event) => {
          if (event.button === 2) {
            event.preventDefault();
            event.stopPropagation();
          }
        });
        button.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          event.stopPropagation();
          showPinDetails(pin);
          showPinLayerMenu(pin, event);
        });
      }

      if (canCurrentUserMovePin(pin)) {
        button.addEventListener("pointerdown", (event) => {
          if (event.button !== 0 || isAnyToolArmed()) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          const point = pointerPoint(event);
          if (!point) {
            return;
          }
          pinMoveState = {
            pinId: pin.id,
            pointerId: event.pointerId,
            startPoint: point,
            latestPoint: point,
            moved: false,
            groupMembers: pin.group_id ? getGroupedPins(pin.group_id).map((member) => ({
              id: member.id,
              x: member.x,
              y: member.y,
            })) : [{ id: pin.id, x: pin.x, y: pin.y }],
          };
          try {
            button.setPointerCapture(event.pointerId);
          } catch {}
        });
      }

      const label = document.createElement("span");
      label.className = "map-pin-label";
      label.textContent = pin.name;
      if (pin.pin_type === "token") {
        label.classList.add("map-token-label");
      } else if (pin.pin_type === "sound_token") {
        label.classList.add("map-sound-token-label");
      }
      label.classList.toggle("hidden", !pin.show_label);
      button.appendChild(label);
      pinLayerElement.appendChild(button);
    }
  }

  function updateDraggedPinPreview(moveState) {
    if (!moveState || !pinLayerElement) {
      return;
    }
    const dx = moveState.latestPoint.x - moveState.startPoint.x;
    const dy = moveState.latestPoint.y - moveState.startPoint.y;
    if (Math.sqrt((dx * dx) + (dy * dy)) < DRAW_START_THRESHOLD) {
      return;
    }
    moveState.moved = true;
    for (const member of moveState.groupMembers) {
      const memberElement = pinLayerElement.querySelector(`[data-pin-id="${member.id}"]`);
      if (!memberElement) {
        continue;
      }
      const nextX = Math.min(Math.max(member.x + dx, 0), 1);
      const nextY = Math.min(Math.max(member.y + dy, 0), 1);
      memberElement.style.left = `${nextX * 100}%`;
      memberElement.style.top = `${nextY * 100}%`;
    }
  }

  async function finishActivePinMove(event) {
    if (!pinMoveState || pinMoveState.pointerId !== event.pointerId) {
      return;
    }
    const activeButton = pinLayerElement?.querySelector(`[data-pin-id="${pinMoveState.pinId}"]`);
    if (activeButton?.releasePointerCapture) {
      try {
        activeButton.releasePointerCapture(event.pointerId);
      } catch {}
    }
    const moveState = pinMoveState;
    pinMoveState = null;
    if (!moveState.moved) {
      return;
    }
    lastPinMoveFinishedId = moveState.pinId;
    suppressPinDetailOpenUntil = Date.now() + 350;
    try {
      setStatus("Pin wird verschoben...");
      await persistPinPosition(moveState.pinId, moveState.latestPoint);
      setStatus("Bereit");
    } catch (error) {
      setStatus(error.message);
      renderPins();
    }
  }

  function showImageState(image) {
    if (!image) {
      currentImageVersion = "";
      activeImageUrl = "";
      currentSurfaceMeta = { backgroundColor: "#223044", canvasWidth: 0, canvasHeight: 0 };
      imageElement.removeAttribute("src");
      imageElement.classList.add("hidden");
      stageElement.classList.add("hidden");
      emptyStateElement.classList.remove("hidden");
      setStatus("Keine Ebene");
      clearActiveOverlay();
      hidePinDetails();
      return;
    }

    currentImageVersion = image.updated_at || "";
    currentSurfaceMeta = {
      backgroundColor: image.background_color || "#223044",
      canvasWidth: Number(image.canvas_width || 0),
      canvasHeight: Number(image.canvas_height || 0),
    };
    activeImageUrl = image.url || "";
    stageElement.style.backgroundColor = currentSurfaceMeta.backgroundColor;
    if (activeImageUrl) {
      imageElement.classList.remove("hidden");
      imageElement.src = activeImageUrl;
    } else {
      imageElement.removeAttribute("src");
      imageElement.classList.add("hidden");
      resizeStageSurface(currentSurfaceMeta.canvasWidth, currentSurfaceMeta.canvasHeight);
      setStatus("Flaechenkarte geladen");
    }
    stageElement.classList.remove("hidden");
    emptyStateElement.classList.add("hidden");
  }

  async function loadImageMeta() {
    const currentMapId = ensureCurrentMapScope();
    const query = new URLSearchParams();
    if (currentMapId) {
      query.set("map_id", currentMapId);
    }
    const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
    if (currentLayerId) {
      query.set("layer_id", currentLayerId);
    }
    const queryString = query.toString() ? `?${query.toString()}` : "";
    const response = await fetch(`/api/map-image/meta${queryString}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Kartenmetadaten konnten nicht geladen werden.");
    }

    if (!data.image) {
      showImageState(null);
      return;
    }

    const nextImage = data.image || null;
    const currentSignature = JSON.stringify({
      updated_at: currentImageVersion,
      url: activeImageUrl,
      background_color: currentSurfaceMeta.backgroundColor,
      canvas_width: currentSurfaceMeta.canvasWidth,
      canvas_height: currentSurfaceMeta.canvasHeight,
    });
    const nextSignature = JSON.stringify({
      updated_at: nextImage?.updated_at || "",
      url: nextImage?.url || "",
      background_color: nextImage?.background_color || "#223044",
      canvas_width: Number(nextImage?.canvas_width || 0),
      canvas_height: Number(nextImage?.canvas_height || 0),
    });
    if (nextSignature !== currentSignature) {
      showImageState(data.image);
    }
  }

  async function loadDrawings() {
    const currentMapId = ensureCurrentMapScope();
    const query = new URLSearchParams({ ts: String(Date.now()) });
    if (currentMapId) {
      query.set("map_id", currentMapId);
    }
    const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
    if (currentLayerId) {
      query.set("layer_id", currentLayerId);
    }
    const response = await fetch(`/api/map-drawings?${query.toString()}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Zeichnungen konnten nicht geladen werden.");
    }

    const nextVersion = data.updated_at || "";
    if (nextVersion === currentDrawingVersion && strokes.length === (data.strokes || []).length) {
      return;
    }

    currentDrawingVersion = nextVersion;
    strokes = data.strokes || [];
    renderFrame();
  }

  async function loadPings() {
    const currentMapId = ensureCurrentMapScope();
    const query = new URLSearchParams({ ts: String(Date.now()) });
    if (currentMapId) {
      query.set("map_id", currentMapId);
    }
    const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
    if (currentLayerId) {
      query.set("layer_id", currentLayerId);
    }
    const response = await fetch(`/api/map-pings?${query.toString()}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Pings konnten nicht geladen werden.");
    }

    pingTtlSeconds = Number(data.ttl_seconds || 3);
    const serverTimeMs = Date.parse(data.server_time || "");
    if (serverTimeMs) {
      serverClockOffsetMs = Date.now() - serverTimeMs;
    }
    const nextVersion = data.updated_at || "";
    if (nextVersion === currentPingVersion && pings.length === (data.pings || []).length) {
      return;
    }

    currentPingVersion = nextVersion;
    pings = data.pings || [];
    renderFrame();
  }

  async function loadPins() {
    const currentMapId = ensureCurrentMapScope();
    const query = new URLSearchParams({ ts: String(Date.now()) });
    if (currentMapId) {
      query.set("map_id", currentMapId);
    }
    const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
    if (currentLayerId) {
      query.set("layer_id", currentLayerId);
    }
    if (typeof getShowGmLayer === "function") {
      query.set("show_gm_layer", getShowGmLayer() ? "1" : "0");
    }
    const response = await fetch(`/api/map-pins?${query.toString()}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Pins konnten nicht geladen werden.");
    }

    const nextVersion = data.updated_at || "";
    if (nextVersion === currentPinVersion && pins.length === (data.pins || []).length) {
      return;
    }

    currentPinVersion = nextVersion;
    pins = data.pins || [];
    syncSelectedTokens();
    renderPins();
    renderFrame();

    if (activePinId) {
      const activePin = pins.find((pin) => pin.id === activePinId);
      if (activePin) {
        showPinDetails(activePin);
      } else {
        hidePinDetails();
      }
    } else if (selectedTokenIds.size) {
      const firstSelected = [...selectedTokenIds].map((pinId) => getPinById(pinId)).find(Boolean);
      if (firstSelected) {
        showPinDetails(firstSelected);
      }
    }
  }

  async function loadOverlays() {
    const currentMapId = ensureCurrentMapScope();
    const query = new URLSearchParams({ ts: String(Date.now()) });
    if (currentMapId) {
      query.set("map_id", currentMapId);
    }
    const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
    if (currentLayerId) {
      query.set("layer_id", currentLayerId);
    }
    if (typeof getShowGmLayer === "function") {
      query.set("show_gm_layer", getShowGmLayer() ? "1" : "0");
    }
    const response = await fetch(`/api/map-overlays?${query.toString()}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Overlays konnten nicht geladen werden.");
    }

    const nextVersion = data.updated_at || "";
    if (nextVersion === currentOverlayVersion && overlays.length === (data.overlays || []).length) {
      return;
    }

    currentOverlayVersion = nextVersion;
    overlays = data.overlays || [];
    if (activeOverlayId && !overlays.some((overlay) => overlay.id === activeOverlayId)) {
      activeOverlayId = "";
    }
    renderOverlays();
  }

  async function loadFogState() {
    const { mapId, layerId } = getFogScope();
    if (!mapId || !layerId) {
      fogState = { enabled: false, explored_areas: [], walls: [], doors: [], updated_at: "" };
      currentFogVersion = "";
      selectedFogElement = null;
      updateFogControls();
      renderFrame();
      return;
    }
    const response = await fetch(`/api/maps/${mapId}/layers/${layerId}/fog`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Nebelstatus konnte nicht geladen werden.");
    }
    const nextVersion = data.updated_at || "";
    const nextWalls = Array.isArray(data.walls) ? data.walls : [];
    const nextDoors = Array.isArray(data.doors) ? data.doors : [];
    const nextExplored = Array.isArray(data.explored_areas) ? data.explored_areas : [];
    if (
      nextVersion === currentFogVersion &&
      fogState.enabled === Boolean(data.enabled) &&
      (fogState.walls || []).length === nextWalls.length &&
      (fogState.doors || []).length === nextDoors.length &&
      (fogState.explored_areas || []).length === nextExplored.length
    ) {
      updateFogControls();
      return;
    }
    currentFogVersion = nextVersion;
    fogState = {
      enabled: Boolean(data.enabled),
      explored_areas: nextExplored,
      walls: nextWalls,
      doors: nextDoors,
      updated_at: nextVersion,
    };
    if (selectedFogElement) {
      const items = selectedFogElement.type === "door" ? nextDoors : nextWalls;
      if (!items.some((item) => item.id === selectedFogElement.id)) {
        selectedFogElement = null;
      }
    }
    updateFogControls();
    renderFrame();
  }

  async function persistFogState(changes) {
    const { mapId, layerId } = getFogScope();
    if (!mapId || !layerId) {
      throw new Error("Keine Karte oder Ebene ausgewaehlt.");
    }
    const response = await fetch(`/api/maps/${mapId}/layers/${layerId}/fog`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Nebelstatus konnte nicht gespeichert werden.");
    }
    currentFogVersion = "";
    await loadFogState();
  }

  async function persistFogEnabled(enabled) {
    await persistFogState({ enabled: Boolean(enabled) });
  }

  async function persistFogExploredAreas(exploredAreas) {
    await persistFogState({ explored_areas: exploredAreas });
  }

  async function addFogWall(startPoint, endPoint) {
    const { mapId, layerId } = getFogScope();
    if (!mapId || !layerId) {
      throw new Error("Keine Karte oder Ebene ausgewaehlt.");
    }
    const response = await fetch(`/api/maps/${mapId}/layers/${layerId}/fog/walls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        x1: startPoint.x,
        y1: startPoint.y,
        x2: endPoint.x,
        y2: endPoint.y,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Sichtblocker konnte nicht erstellt werden.");
    }
    currentFogVersion = "";
    await loadFogState();
  }

  async function addFogDoor(startPoint, endPoint) {
    const { mapId, layerId } = getFogScope();
    if (!mapId || !layerId) {
      throw new Error("Keine Karte oder Ebene ausgewaehlt.");
    }
    const response = await fetch(`/api/maps/${mapId}/layers/${layerId}/fog/doors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        x1: startPoint.x,
        y1: startPoint.y,
        x2: endPoint.x,
        y2: endPoint.y,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Tuer konnte nicht erstellt werden.");
    }
    selectedFogElement = data.door?.id ? { type: "door", id: data.door.id } : null;
    currentFogVersion = "";
    await loadFogState();
  }

  async function updateFogDoor(doorId, isOpen) {
    const { mapId, layerId } = getFogScope();
    if (!mapId || !layerId) {
      throw new Error("Keine Karte oder Ebene ausgewaehlt.");
    }
    const response = await fetch(`/api/maps/${mapId}/layers/${layerId}/fog/doors/${doorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_open: Boolean(isOpen) }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Tuer konnte nicht aktualisiert werden.");
    }
    currentFogVersion = "";
    await loadFogState();
  }

  async function deleteFogElement(element) {
    if (!element?.id || !element?.type) {
      return;
    }
    const { mapId, layerId } = getFogScope();
    if (!mapId || !layerId) {
      throw new Error("Keine Karte oder Ebene ausgewaehlt.");
    }
    const pathType = element.type === "door" ? "doors" : "walls";
    const response = await fetch(`/api/maps/${mapId}/layers/${layerId}/fog/${pathType}/${element.id}`, {
      method: "DELETE",
    });
    const data = await readApiResponse(response);
    if (!response.ok) {
      throw new Error(data.detail || "Sichtblocker konnte nicht geloescht werden.");
    }
    selectedFogElement = null;
    currentFogVersion = "";
    await loadFogState();
  }

  async function deleteSelectedOrLastFogElement() {
    if (selectedFogElement) {
      await deleteFogElement(selectedFogElement);
      return;
    }
    const doors = Array.isArray(fogState.doors) ? fogState.doors : [];
    const walls = Array.isArray(fogState.walls) ? fogState.walls : [];
    const lastDoor = doors[doors.length - 1];
    const lastWall = walls[walls.length - 1];
    if (lastDoor && (!lastWall || String(lastDoor.created_at || "") >= String(lastWall.created_at || ""))) {
      await deleteFogElement({ type: "door", id: lastDoor.id });
      return;
    }
    if (lastWall) {
      await deleteFogElement({ type: "wall", id: lastWall.id });
    }
  }

  async function clearFogExploredAreas() {
    await persistFogExploredAreas([]);
  }

  async function revealCurrentTokenVision() {
    if (!canManageFog() || !fogState.enabled) {
      return;
    }
    const nextAreas = getVisibleExplorationAreas();
    if (!nextAreas.length) {
      return;
    }
    const mergedAreas = mergeExploredAreas(fogState.explored_areas, nextAreas);
    if (mergedAreas.length === (fogState.explored_areas || []).length) {
      return;
    }
    await persistFogExploredAreas(mergedAreas);
  }

  async function persistOverlayVisibilityLayer(overlayId, visibilityLayer) {
    const response = await fetch(`/api/map-overlays/${overlayId}/visibility`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility_layer: visibilityLayer }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Overlay-Ebene konnte nicht aktualisiert werden.");
    }
    currentOverlayVersion = "";
    await loadOverlays();
  }

  async function uploadMapImage(file) {
    if (!imageUploadInput) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
      const currentMapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
      if (currentMapId) {
        formData.append("map_id", currentMapId);
      }
      const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
      if (currentLayerId) {
        formData.append("layer_id", currentLayerId);
      }

    setStatus("Bild wird gespeichert...");
    const response = await fetch("/api/map-image", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Kartenbild konnte nicht gespeichert werden.");
    }

    if (imageUploadStatusElement) {
      imageUploadStatusElement.textContent = `Aktualisiert: ${data.file_name}`;
    }
    currentImageVersion = "";
    await loadImageMeta();
    setStatus("Bereit");
  }

  async function persistCustomStroke(stroke) {
      const currentMapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
      const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
      const query = new URLSearchParams();
      if (currentMapId) {
        query.set("map_id", currentMapId);
      }
      if (currentLayerId) {
        query.set("layer_id", currentLayerId);
      }
      const targetUrl = query.toString() ? `/api/map-drawings?${query.toString()}` : "/api/map-drawings";
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        color: stroke.color,
        width: stroke.width,
        points: stroke.points,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Linie konnte nicht gespeichert werden.");
    }

    currentDrawingVersion = "";
    await loadDrawings();
  }

  async function persistPing(point) {
      const currentMapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
      const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
      const query = new URLSearchParams();
      if (currentMapId) {
        query.set("map_id", currentMapId);
      }
      if (currentLayerId) {
        query.set("layer_id", currentLayerId);
      }
      const targetUrl = query.toString() ? `/api/map-pings?${query.toString()}` : "/api/map-pings";
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        color: currentDrawColor,
        x: point.x,
        y: point.y,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Ping konnte nicht gesetzt werden.");
    }

    currentPingVersion = "";
    await loadPings();
  }

  async function persistPin(point) {
    if (!canManagePins || !pinNameInput) {
      return;
    }

    const name = pinNameInput.value.trim();
    if (!name) {
      throw new Error("Pin-Name fehlt.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", pinDescriptionInput?.value?.trim() || "");
    formData.append("pin_type", "pin");
    const [targetKind, targetId] = String(pinTargetMapSelect?.value || "").split(":", 2);
      formData.append("target_kind", targetKind || "");
      formData.append("target_id", targetId || "");
      formData.append("show_label", "true");
      const createOnGmLayer = typeof getCreateOnGmLayer === "function" ? getCreateOnGmLayer() : false;
      formData.append("hidden_from_players", createOnGmLayer || pinHiddenInput?.checked ? "true" : "false");
      formData.append("visibility_layer", createOnGmLayer || pinHiddenInput?.checked ? "gm" : "public");
      formData.append("x", String(point.x));
      formData.append("y", String(point.y));
      const currentMapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
      if (currentMapId) {
        formData.append("map_id", currentMapId);
      }
      const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
      if (currentLayerId) {
        formData.append("layer_id", currentLayerId);
      }
    const imageFile = pinImageInput?.files?.[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch("/api/map-pins", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Pin konnte nicht gespeichert werden.");
    }

    currentPinVersion = "";
    await loadPins();
    pinPlacementArmed = false;
    pinNameInput.value = "";
    if (pinDescriptionInput) {
      pinDescriptionInput.value = "";
    }
    if (pinImageInput) {
      pinImageInput.value = "";
    }
    if (pinHiddenInput) {
      pinHiddenInput.checked = false;
    }
    if (pinTargetMapSelect) {
      pinTargetMapSelect.value = "";
    }
    setPinStatus("Pin gespeichert.");
    updatePinPlacementUi();
    if (data.pin) {
      showPinDetails(data.pin);
    }
  }

  async function persistToken(point) {
    if (!canManageTokens || !tokenNameInput) {
      return;
    }

    const name = tokenNameInput.value.trim();
    if (!name) {
      throw new Error("Token-Name fehlt.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", "");
    formData.append("pin_type", "token");
      formData.append("assigned_user_id", tokenAssignedUserSelect?.value || "");
      formData.append("show_label", "true");
      formData.append("hidden_from_players", "false");
      const createOnGmLayer = typeof getCreateOnGmLayer === "function" ? getCreateOnGmLayer() : false;
      formData.append("visibility_layer", createOnGmLayer || tokenLayerInput?.checked ? "gm" : "public");
      formData.append("x", String(point.x));
      formData.append("y", String(point.y));
      const currentMapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
      if (currentMapId) {
        formData.append("map_id", currentMapId);
      }
      const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
      if (currentLayerId) {
        formData.append("layer_id", currentLayerId);
      }
    formData.append("vision_radius", String(visionPercentToRadius(tokenVisionInput?.value || 18)));
    const imageFile = tokenImageInput?.files?.[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch("/api/map-pins", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Token konnte nicht gespeichert werden.");
    }

    currentPinVersion = "";
    await loadPins();
    await revealCurrentTokenVision();
    tokenPlacementArmed = false;
    tokenNameInput.value = "";
    if (tokenAssignedUserSelect) {
      tokenAssignedUserSelect.value = "";
    }
    if (tokenImageInput) {
      tokenImageInput.value = "";
    }
    if (tokenLayerInput) {
      tokenLayerInput.checked = false;
    }
    if (tokenVisionInput) {
      tokenVisionInput.value = "18";
      syncVisionLabel(tokenVisionInput, tokenVisionValueElement);
    }
    setTokenStatus("Token gespeichert.");
    updatePinPlacementUi();
    if (data.pin) {
      showPinDetails(data.pin);
    }
  }

  async function persistSoundToken(point) {
    if (!canManagePins || !soundTokenNameInput || !soundTokenFileInput) {
      return;
    }

    const name = soundTokenNameInput.value.trim();
    if (!name) {
      throw new Error("Sound-Token-Name fehlt.");
    }
    const soundFile = soundTokenFileInput.files?.[0];
    if (!soundFile) {
      throw new Error("Sounddatei fehlt.");
    }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", "");
      formData.append("pin_type", "sound_token");
      formData.append("show_label", "true");
      const createOnGmLayer = typeof getCreateOnGmLayer === "function" ? getCreateOnGmLayer() : false;
      const soundOnGm = createOnGmLayer || soundTokenLayerInput?.checked !== false;
      formData.append("hidden_from_players", soundOnGm ? "true" : "false");
      formData.append("visibility_layer", soundOnGm ? "gm" : "public");
      formData.append("x", String(point.x));
      formData.append("y", String(point.y));
      const currentMapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
      if (currentMapId) {
        formData.append("map_id", currentMapId);
      }
      const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
      if (currentLayerId) {
        formData.append("layer_id", currentLayerId);
      }
      formData.append("sound", soundFile);

    const response = await fetch("/api/map-pins", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Sound-Token konnte nicht gespeichert werden.");
    }

    currentPinVersion = "";
    await loadPins();
    soundTokenPlacementArmed = false;
    soundTokenNameInput.value = "";
    soundTokenFileInput.value = "";
    if (soundTokenLayerInput) {
      soundTokenLayerInput.checked = true;
    }
    setSoundTokenStatus("Sound-Token gespeichert.");
    updatePinPlacementUi();
    if (data.pin) {
      showPinDetails(data.pin);
    }
  }

  async function persistPinPosition(pinId, point) {
    pinMovePersisting = true;
    try {
      const response = await fetch(`/api/map-pins/${pinId}/position`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x: point.x,
          y: point.y,
        }),
      });
      const data = await readApiResponse(response);
      if (!response.ok) {
        throw new Error(data.detail || "Pin konnte nicht verschoben werden.");
      }
      if (data.pin) {
        const updatedPin = data.pin;
        pins = pins.map((pin) => (pin.id === updatedPin.id ? { ...pin, ...updatedPin } : pin));
        renderPins();
      }
      currentPinVersion = "";
      activePinId = "";
      await loadPins();
      await revealCurrentTokenVision();
    } finally {
      pinMovePersisting = false;
    }
  }

  async function persistPinDetails(pinId) {
    const name = pinDetailNameElement?.value?.trim() || "";
    if (!name) {
      throw new Error("Pin-Name fehlt.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", pinDetailDescriptionElement?.value?.trim() || "");
    formData.append("pin_type", (pins.find((item) => item.id === pinId)?.pin_type || "pin"));
    formData.append("assigned_user_id", pinDetailAssignedUserInput?.value || "");
    const [targetKind, targetId] = String(pinDetailLinkedMapInput?.value || "").split(":", 2);
    formData.append("target_kind", targetKind || "");
    formData.append("target_id", targetId || "");
    formData.append("show_label", pinDetailShowLabelInput?.checked ? "true" : "false");
    formData.append("hidden_from_players", pinDetailHiddenInput?.checked ? "true" : "false");
    formData.append("visibility_layer", pinDetailHiddenInput?.checked ? "gm" : "public");
    formData.append("vision_radius", String(visionPercentToRadius(pinDetailVisionInput?.value || 18)));
    const imageFile = pinDetailImageInput?.files?.[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const soundFile = pinDetailSoundInput?.files?.[0];
    if (soundFile) {
      formData.append("sound", soundFile);
    }

    const response = await fetch(`/api/map-pins/${pinId}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Pin konnte nicht aktualisiert werden.");
    }
    currentPinVersion = "";
    await loadPins();
    await revealCurrentTokenVision();
    if (data.pin) {
      showPinDetails(data.pin);
    }
  }

  async function persistPinVisibilityLayer(pinId, visibilityLayer) {
    const response = await fetch(`/api/map-pins/${pinId}/visibility`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility_layer: visibilityLayer }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Marker-Ebene konnte nicht aktualisiert werden.");
    }
    currentPinVersion = "";
    await loadPins();
    if (data.pin) {
      showPinDetails(data.pin);
    }
  }

  async function triggerSoundCue(pinId) {
    const response = await fetch(`/api/map-sound-cue/${pinId}`, {
      method: "POST",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Sound konnte nicht gestartet werden.");
    }
    const pin = getPinById(pinId);
    if (pinDetailSoundStatusElement) {
      pinDetailSoundStatusElement.textContent = pin?.sound_title
        ? `${pin.sound_title} gestartet.`
        : "Sound gestartet.";
    }
    return data;
  }

  async function activatePinLinkedMap(pinId) {
    if (typeof activateLinkedTarget !== "function") {
      throw new Error("Kartenumschaltung ist hier nicht verfuegbar.");
    }
    const pin = getPinById(pinId);
    const selectedValue = String(pinDetailLinkedMapInput?.value || "");
    const fallbackValue = pin?.target_id && pin?.target_kind ? `${pin.target_kind}:${pin.target_id}` : "";
    const [targetKind, targetId] = (selectedValue || fallbackValue).split(":", 2);
    if (!targetKind || !targetId) {
      throw new Error("Keine Zielkarte oder Battlemap verlinkt.");
    }
    await activateLinkedTarget(targetKind, targetId);
    const availableTargets = typeof getAvailableLinkTargets === "function" ? (getAvailableLinkTargets() || {}) : {};
    if (targetKind === "battlemap") {
      const targetBattlemap = (availableTargets.battlemaps || []).find((item) => item.id === targetId);
      setLinkedMapStatus(targetBattlemap?.name ? `Battlemap ${targetBattlemap.name} ist jetzt live.` : "Battlemap ist jetzt live.");
      return;
    }
    const targetMap = (availableTargets.maps || []).find((item) => item.id === targetId);
    setLinkedMapStatus(targetMap?.name ? `Karte ${targetMap.name} ist jetzt live.` : "Karte ist jetzt live.");
  }

  async function persistGroupSelection() {
    const tokenIds = [...selectedTokenIds]
      .map((tokenId) => getPinById(tokenId))
      .filter((pin) => pin && pin.pin_type === "token")
      .map((pin) => pin.id);
    if (tokenIds.length < 2) {
      throw new Error("Waehle mindestens zwei Tokens aus.");
    }
    const response = await fetch("/api/map-tokens/group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token_ids: tokenIds }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Tokens konnten nicht gruppiert werden.");
    }
    currentPinVersion = "";
    await loadPins();
    const activePin = activePinId ? getPinById(activePinId) : getPinById(tokenIds[0]);
    if (activePin) {
      showPinDetails(activePin);
    }
  }

  async function persistUngroup(pin) {
    if (!pin || pin.pin_type !== "token" || !pin.group_id) {
      throw new Error("Dieser Token ist keiner Gruppe zugeordnet.");
    }
    const tokenIds = getGroupedPins(pin.group_id).map((member) => member.id);
    if (tokenIds.length < 2) {
      throw new Error("Diese Gruppe kann nicht getrennt werden.");
    }
    const response = await fetch("/api/map-tokens/ungroup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token_ids: tokenIds }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Token-Gruppe konnte nicht getrennt werden.");
    }
    currentPinVersion = "";
    setSelectedTokens(tokenIds);
    await loadPins();
    const activeToken = getPinById(pin.id);
    if (activeToken) {
      showPinDetails(activeToken);
    }
  }

  async function persistOverlay(file, point, size) {
      const currentMapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
      const formData = new FormData();
      formData.append("image", file);
    formData.append("x", String(point.x));
    formData.append("y", String(point.y));
    formData.append("width", String(size.width));
    formData.append("height", String(size.height));
      if (currentMapId) {
        formData.append("map_id", currentMapId);
      }
      const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
      if (currentLayerId) {
        formData.append("layer_id", currentLayerId);
      }
      const createOnGmLayer = typeof getCreateOnGmLayer === "function" ? getCreateOnGmLayer() : false;
      formData.append("visibility_layer", createOnGmLayer ? "gm" : "public");

    const response = await fetch("/api/map-overlays", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Overlay konnte nicht gespeichert werden.");
    }

    currentOverlayVersion = "";
    await loadOverlays();
    if (data.overlay) {
      activeOverlayId = data.overlay.id;
      renderOverlays();
    }
  }

  async function persistOverlayGeometry(overlayId, geometry) {
    const response = await fetch(`/api/map-overlays/${overlayId}/geometry`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geometry),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Overlay konnte nicht aktualisiert werden.");
    }
    currentOverlayVersion = "";
    await loadOverlays();
  }

  async function removeOverlay(overlayId) {
    const response = await fetch(`/api/map-overlays/${overlayId}`, {
      method: "DELETE",
    });
    const data = await readApiResponse(response);
    if (!response.ok) {
      throw new Error(data.detail || "Overlay konnte nicht geloescht werden.");
    }
    currentOverlayVersion = "";
    activeOverlayId = "";
    await loadOverlays();
  }

  async function removePin(pinId) {
    const response = await fetch(`/api/map-pins/${pinId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Pin konnte nicht geloescht werden.");
    }
    currentPinVersion = "";
    await loadPins();
    hidePinDetails();
  }

  async function clearDrawings() {
      const currentMapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
      const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
      const query = new URLSearchParams();
      if (currentMapId) {
        query.set("map_id", currentMapId);
      }
      if (currentLayerId) {
        query.set("layer_id", currentLayerId);
      }
      const targetUrl = query.toString() ? `/api/map-drawings?${query.toString()}` : "/api/map-drawings";
    const response = await fetch(targetUrl, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Linien konnten nicht geloescht werden.");
    }

    currentDrawingVersion = "";
    strokes = [];
    renderFrame();
    await loadDrawings();
  }

  async function undoLastStroke() {
      const currentMapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
      const currentLayerId = typeof getCurrentLayerId === "function" ? getCurrentLayerId() : "";
      const query = new URLSearchParams();
      if (currentMapId) {
        query.set("map_id", currentMapId);
      }
      if (currentLayerId) {
        query.set("layer_id", currentLayerId);
      }
      const targetUrl = query.toString() ? `/api/map-drawings/undo?${query.toString()}` : "/api/map-drawings/undo";
    const response = await fetch(targetUrl, {
      method: "POST",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Letzter Strich konnte nicht rueckgaengig gemacht werden.");
    }

    currentDrawingVersion = "";
    if (!data.undone) {
      return false;
    }
    await loadDrawings();
    return true;
  }

  async function getOverlayDefaultSize(file) {
    const fallback = { width: 0.24, height: 0.24 };
    try {
      const objectUrl = URL.createObjectURL(file);
      const size = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          const aspectRatio = image.naturalWidth && image.naturalHeight
            ? image.naturalWidth / image.naturalHeight
            : 1;
          const width = 0.24;
          const height = Math.min(Math.max(width / Math.max(aspectRatio, 0.1), 0.12), 0.36);
          resolve({ width, height });
          URL.revokeObjectURL(objectUrl);
        };
        image.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Bild konnte nicht gelesen werden."));
        };
        image.src = objectUrl;
      });
      return size;
    } catch {
      return fallback;
    }
  }

  async function uploadOverlayAtPoint(file, point) {
    const size = await getOverlayDefaultSize(file);
    const geometry = clampOverlayGeometry({
      x: point.x - (size.width / 2),
      y: point.y - (size.height / 2),
      width: size.width,
      height: size.height,
    });
    setStatus("Overlay wird gespeichert...");
    await persistOverlay(file, geometry, geometry);
    setStatus("Bereit");
  }

  function pointerPoint(event) {
    const rect = canvasElement.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return null;
    }

    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    return {
      x: Math.min(Math.max(x, 0), 1),
      y: Math.min(Math.max(y, 0), 1),
    };
  }

  function snapWallPoint(point) {
    if (!point) {
      return null;
    }
    const snapDistance = 0.015;
    let nearestPoint = point;
    let nearestDistance = snapDistance;
    const segments = (fogState.walls || []).concat(fogState.doors || []);
    for (const wall of segments) {
      for (const endpoint of [
        { x: Number(wall.x1 || 0), y: Number(wall.y1 || 0) },
        { x: Number(wall.x2 || 0), y: Number(wall.y2 || 0) },
      ]) {
        const dx = endpoint.x - point.x;
        const dy = endpoint.y - point.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));
        if (distance <= nearestDistance) {
          nearestPoint = endpoint;
          nearestDistance = distance;
        }
      }
    }
    return nearestPoint;
  }

  function pointToSegmentDistance(point, segment) {
    const x1 = Number(segment.x1 || 0);
    const y1 = Number(segment.y1 || 0);
    const x2 = Number(segment.x2 || 0);
    const y2 = Number(segment.y2 || 0);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = (dx * dx) + (dy * dy);
    if (lengthSquared <= 1e-9) {
      const px = point.x - x1;
      const py = point.y - y1;
      return Math.sqrt((px * px) + (py * py));
    }
    const t = Math.min(Math.max(((point.x - x1) * dx + (point.y - y1) * dy) / lengthSquared, 0), 1);
    const closestX = x1 + (t * dx);
    const closestY = y1 + (t * dy);
    const px = point.x - closestX;
    const py = point.y - closestY;
    return Math.sqrt((px * px) + (py * py));
  }

  function findFogElementAtPoint(point) {
    if (!point || !canManageFog()) {
      return null;
    }
    const threshold = 0.012;
    let nearest = null;
    let nearestDistance = threshold;
    for (const wall of fogState.walls || []) {
      const distance = pointToSegmentDistance(point, wall);
      if (distance <= nearestDistance) {
        nearest = { type: "wall", id: wall.id };
        nearestDistance = distance;
      }
    }
    for (const door of fogState.doors || []) {
      const distance = pointToSegmentDistance(point, door);
      if (distance <= nearestDistance) {
        nearest = { type: "door", id: door.id };
        nearestDistance = distance;
      }
    }
    return nearest;
  }

  function getSelectedFogDoor() {
    if (selectedFogElement?.type !== "door") {
      return null;
    }
    return (fogState.doors || []).find((door) => door.id === selectedFogElement.id) || null;
  }

  function beginInteraction(event) {
    if (!hasRenderableSurface() || event.button !== 0) {
      return;
    }

    focusCanvas();
    const point = pointerPoint(event);
    if (!point) {
      return;
    }

    hoverPoint = (wallPlacementArmed || doorPlacementArmed) ? snapWallPoint(point) : point;

    if (wallPlacementArmed || doorPlacementArmed) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const fogElement = findFogElementAtPoint(point);
    if (fogElement) {
      event.preventDefault();
      event.stopPropagation();
      selectedFogElement = fogElement;
      const door = getSelectedFogDoor();
      if (door) {
        updateFogDoor(door.id, !door.is_open)
          .then(() => setStatus(door.is_open ? "Tuer geschlossen." : "Tuer geoeffnet."))
          .catch((error) => setStatus(error.message));
      } else {
        setStatus("Wand ausgewaehlt. Mit Auswahl loeschen entfernen.");
      }
      updateFogControls();
      renderFrame();
      return;
    }

    hidePinDetails();
    clearActiveOverlay();
    isPointerDown = true;
    isDrawing = false;
    pendingPointerId = event.pointerId;
    pendingPoints = [point];
    canvasElement.setPointerCapture(event.pointerId);
  }

  function continueInteraction(event) {
    const point = pointerPoint(event);
    if (point) {
      hoverPoint = (wallPlacementArmed || doorPlacementArmed) ? snapWallPoint(point) : point;
      if ((wallPlacementArmed || doorPlacementArmed) && pendingWall) {
        renderFrame();
      }
    }
    if (!isPointerDown || pendingPointerId !== event.pointerId || isAnyToolArmed()) {
      return;
    }

    if (!point) {
      return;
    }

    const firstPoint = pendingPoints[0];
    const dx = point.x - firstPoint.x;
    const dy = point.y - firstPoint.y;
    const distance = Math.sqrt((dx * dx) + (dy * dy));

    if (!isDrawing && distance >= DRAW_START_THRESHOLD) {
      isDrawing = true;
    }

    if (!isDrawing) {
      return;
    }

    const lastPoint = pendingPoints[pendingPoints.length - 1];
    if (lastPoint && Math.abs(lastPoint.x - point.x) < 0.001 && Math.abs(lastPoint.y - point.y) < 0.001) {
      return;
    }

    pendingPoints.push(point);
    renderFrame();
  }

  async function endInteraction(event) {
    const point = pointerPoint(event);
    if (point) {
      hoverPoint = (wallPlacementArmed || doorPlacementArmed) ? snapWallPoint(point) : point;
    }
    if (wallPlacementArmed || doorPlacementArmed) {
      const targetPoint = snapWallPoint(point || pendingPoints[0]);
      const creatingDoor = doorPlacementArmed;
      pendingPoints = [];
      isDrawing = false;
      isPointerDown = false;
      pendingPointerId = null;
      try {
        canvasElement.releasePointerCapture(event.pointerId);
      } catch {}
      if (!targetPoint) {
        return;
      }
      if (!pendingWall) {
        pendingWall = targetPoint;
        renderFrame();
        setStatus(`${creatingDoor ? "Tuer" : "Wand"}start gesetzt. Naechster Klick setzt das Ende.`);
        return;
      }
      const dx = targetPoint.x - pendingWall.x;
      const dy = targetPoint.y - pendingWall.y;
      const distance = Math.sqrt((dx * dx) + (dy * dy));
      if (distance < 0.01) {
        pendingWall = null;
        renderFrame();
        setStatus("Wandstart verworfen.");
        return;
      }
      try {
        setStatus(creatingDoor ? "Tuer wird gespeichert..." : "Sichtblocker wird gespeichert...");
        if (creatingDoor) {
          await addFogDoor(pendingWall, targetPoint);
        } else {
          await addFogWall(pendingWall, targetPoint);
        }
        pendingWall = null;
        renderFrame();
        setStatus(creatingDoor ? "Tuer gespeichert." : "Sichtblocker gespeichert.");
      } catch (error) {
        setStatus(error.message);
      }
      return;
    }
    if (!isPointerDown || pendingPointerId !== event.pointerId) {
      return;
    }

    isPointerDown = false;
    pendingPointerId = null;
    canvasElement.releasePointerCapture(event.pointerId);

    const finalPoints = [...pendingPoints];
    pendingPoints = [];
    renderFrame();

    if (!finalPoints.length) {
      isDrawing = false;
      return;
    }

    try {
      if (pinPlacementArmed) {
        setStatus("Pin wird gespeichert...");
        await persistPin(finalPoints[0]);
        setStatus("Bereit");
      } else if (tokenPlacementArmed) {
        setStatus("Token wird gespeichert...");
        await persistToken(finalPoints[0]);
        setStatus("Bereit");
      } else if (soundTokenPlacementArmed) {
        setStatus("Sound-Token wird gespeichert...");
        await persistSoundToken(finalPoints[0]);
        setStatus("Bereit");
      } else if (isDrawing) {
        setStatus("Linie wird gespeichert...");
        await persistCustomStroke({
          color: currentDrawColor,
          width: currentDrawWidth,
          points: finalPoints,
        });
        setStatus("Bereit");
      } else {
        setStatus("Ping wird gesetzt...");
        await persistPing(finalPoints[0]);
        setStatus("Bereit");
      }
    } catch (error) {
      setStatus(error.message);
        if (isAnyToolArmed()) {
          setPinStatus(error.message);
          setTokenStatus(error.message);
          setSoundTokenStatus(error.message);
      }
    } finally {
      isDrawing = false;
    }
  }

  imageElement.addEventListener("load", () => {
    resizeStageToImage();
    setStatus("Karte geladen");
  });

  imageElement.addEventListener("error", () => {
    setStatus("Bild konnte nicht geladen werden.");
  });

  if (colorInput) {
    colorInput.addEventListener("input", syncDrawControls);
  }

  if (widthInput) {
    widthInput.addEventListener("input", syncDrawControls);
  }

  if (tokenVisionInput) {
    tokenVisionInput.addEventListener("input", () => {
      syncVisionLabel(tokenVisionInput, tokenVisionValueElement);
    });
  }

  if (pinDetailVisionInput) {
    pinDetailVisionInput.addEventListener("input", () => {
      syncVisionLabel(pinDetailVisionInput, pinDetailVisionValueElement);
    });
  }

  if (zoomInput) {
    zoomInput.addEventListener("input", () => {
      const containerRect = scrollContainerElement?.getBoundingClientRect();
      const anchorPoint = containerRect
        ? { x: containerRect.width / 2, y: containerRect.height / 2 }
        : null;
      setZoom(Number(zoomInput.value || 100) / 100, anchorPoint);
    });
  }

  if (pinPlacementButton) {
    pinPlacementButton.classList.toggle("hidden", !canManagePins);
    pinPlacementButton.addEventListener("click", () => {
      if (!canManagePins) {
        return;
      }
      pinPlacementArmed = !pinPlacementArmed;
      if (pinPlacementArmed) {
        tokenPlacementArmed = false;
        soundTokenPlacementArmed = false;
      }
      setPinStatus(pinPlacementArmed ? "Naechster Klick setzt den Pin." : "Pin-Modus aus.");
      updatePinPlacementUi();
    });
  }

  if (tokenPlacementButton) {
    tokenPlacementButton.classList.toggle("hidden", !canManageTokens);
    tokenPlacementButton.addEventListener("click", () => {
      if (!canManageTokens) {
        return;
      }
      tokenPlacementArmed = !tokenPlacementArmed;
      if (tokenPlacementArmed) {
        pinPlacementArmed = false;
        soundTokenPlacementArmed = false;
      }
      setTokenStatus(tokenPlacementArmed ? "Naechster Klick setzt den Token." : "Token-Modus aus.");
      updatePinPlacementUi();
    });
  }

  if (soundTokenPlacementButton) {
    soundTokenPlacementButton.classList.toggle("hidden", !canManagePins);
    soundTokenPlacementButton.addEventListener("click", () => {
      if (!canManagePins) {
        return;
      }
      soundTokenPlacementArmed = !soundTokenPlacementArmed;
      if (soundTokenPlacementArmed) {
        pinPlacementArmed = false;
        tokenPlacementArmed = false;
      }
      setSoundTokenStatus(soundTokenPlacementArmed ? "Naechster Klick setzt den Sound-Token." : "Sound-Token-Modus aus.");
      updatePinPlacementUi();
    });
  }

  if (fogEnabledInput) {
    fogEnabledInput.addEventListener("change", async () => {
      if (!canManageFog()) {
        return;
      }
      fogEnabledInput.disabled = true;
      try {
        setStatus("Nebelstatus wird gespeichert...");
        await persistFogEnabled(fogEnabledInput.checked);
        if (fogEnabledInput.checked) {
          await revealCurrentTokenVision();
        }
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
        await loadFogState().catch(() => {});
      } finally {
        fogEnabledInput.disabled = false;
        updateFogControls();
      }
    });
  }

  if (fogWallModeButton) {
    fogWallModeButton.addEventListener("click", () => {
      if (!canManageFog() || !hasRenderableSurface()) {
        return;
      }
      wallPlacementArmed = !wallPlacementArmed;
      if (wallPlacementArmed) {
        doorPlacementArmed = false;
        selectedFogElement = null;
      }
      pendingWall = null;
      hoverPoint = null;
      updateFogControls();
      renderFrame();
      setStatus(wallPlacementArmed ? "Wandmodus aktiv. Zwei Klicks setzen eine Wand." : "Wandmodus beendet.");
    });
  }

  if (fogDoorModeButton) {
    fogDoorModeButton.addEventListener("click", () => {
      if (!canManageFog() || !hasRenderableSurface()) {
        return;
      }
      doorPlacementArmed = !doorPlacementArmed;
      if (doorPlacementArmed) {
        wallPlacementArmed = false;
        selectedFogElement = null;
      }
      pendingWall = null;
      hoverPoint = null;
      updateFogControls();
      renderFrame();
      setStatus(doorPlacementArmed ? "Tuermodus aktiv. Zwei Klicks setzen eine Tuer." : "Tuermodus beendet.");
    });
  }

  if (fogDeleteWallButton) {
    fogDeleteWallButton.addEventListener("click", async () => {
      fogDeleteWallButton.disabled = true;
      try {
        setStatus(selectedFogElement ? "Auswahl wird geloescht..." : "Letztes Fog-Element wird geloescht...");
        await deleteSelectedOrLastFogElement();
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
      } finally {
        fogDeleteWallButton.disabled = false;
        updateFogControls();
      }
    });
  }

  if (fogClearExploredButton) {
    fogClearExploredButton.addEventListener("click", async () => {
      fogClearExploredButton.disabled = true;
      try {
        setStatus("Aufgedeckte Bereiche werden geloescht...");
        await clearFogExploredAreas();
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
      } finally {
        fogClearExploredButton.disabled = false;
        updateFogControls();
      }
    });
  }

  if (pinDetailCloseButton) {
    pinDetailCloseButton.addEventListener("click", () => {
      hidePinDetails();
    });
  }

  if (pinDeleteButton) {
    pinDeleteButton.classList.toggle("hidden", !canManagePins);
    pinDeleteButton.addEventListener("click", async () => {
      const pinId = pinDeleteButton.dataset.pinId || activePinId;
      if (!pinId) {
        return;
      }
      pinDeleteButton.disabled = true;
      try {
        setStatus("Pin wird geloescht...");
        await removePin(pinId);
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
      } finally {
        pinDeleteButton.disabled = false;
      }
    });
  }

  if (pinDetailSoundPlayButton) {
    pinDetailSoundPlayButton.addEventListener("click", async () => {
      const pinId = pinDetailSoundPlayButton.dataset.pinId || activePinId;
      if (!pinId) {
        return;
      }
      pinDetailSoundPlayButton.disabled = true;
      try {
        setStatus("Sound wird gestartet...");
        await triggerSoundCue(pinId);
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
        if (pinDetailSoundStatusElement) {
          pinDetailSoundStatusElement.textContent = error.message;
        }
      } finally {
        pinDetailSoundPlayButton.disabled = false;
      }
    });
  }

  if (pinDetailActivateMapButton) {
    pinDetailActivateMapButton.addEventListener("click", async () => {
      const pinId = pinDetailActivateMapButton.dataset.pinId || activePinId;
      if (!pinId) {
        return;
      }
      pinDetailActivateMapButton.disabled = true;
      try {
        setStatus("Verlinkte Karte wird live geschaltet...");
        await activatePinLinkedMap(pinId);
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
        setLinkedMapStatus(error.message);
      } finally {
        const activePin = getPinById(pinId);
        pinDetailActivateMapButton.disabled = !canManagePins || !(pinDetailLinkedMapInput?.value || activePin?.target_map_id);
      }
    });
  }

  if (pinDetailLinkedMapInput) {
    pinDetailLinkedMapInput.addEventListener("change", () => {
      const selectedMapId = pinDetailLinkedMapInput.value || "";
      if (pinDetailActivateMapButton) {
        pinDetailActivateMapButton.disabled = !canManagePins || !selectedMapId;
      }
      if (!selectedMapId) {
        setLinkedMapStatus("Keine Karte oder Battlemap verlinkt.");
        return;
      }
      const [targetKind, targetId] = selectedMapId.split(":", 2);
      const availableTargets = typeof getAvailableLinkTargets === "function" ? (getAvailableLinkTargets() || {}) : {};
      if (targetKind === "battlemap") {
        const targetBattlemap = (availableTargets.battlemaps || []).find((item) => item.id === targetId);
        setLinkedMapStatus(targetBattlemap?.name ? `Ausgewaehlt: Battlemap ${targetBattlemap.name}.` : "Battlemap ausgewaehlt.");
        return;
      }
      const targetMap = (availableTargets.maps || []).find((mapItem) => mapItem.id === targetId);
      setLinkedMapStatus(targetMap?.name ? `Ausgewaehlt: Karte ${targetMap.name}.` : "Karte ausgewaehlt.");
    });
  }

  if (pinGroupButton) {
    pinGroupButton.classList.toggle("hidden", !canManageTokens);
    pinGroupButton.addEventListener("click", async () => {
      pinGroupButton.disabled = true;
      try {
        setStatus("Tokens werden gruppiert...");
        await persistGroupSelection();
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
        setGroupStatus(error.message);
      } finally {
        pinGroupButton.disabled = false;
      }
    });
  }

  if (pinUngroupButton) {
    pinUngroupButton.classList.toggle("hidden", !canManageTokens);
    pinUngroupButton.addEventListener("click", async () => {
      const activePin = getPinById(activePinId);
      pinUngroupButton.disabled = true;
      try {
        setStatus("Token-Gruppe wird getrennt...");
        await persistUngroup(activePin);
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
        setGroupStatus(error.message);
      } finally {
        pinUngroupButton.disabled = false;
      }
    });
  }

  if (pinSaveButton) {
    pinSaveButton.classList.toggle("hidden", !canManagePins);
    pinSaveButton.addEventListener("click", async () => {
      const pinId = pinSaveButton.dataset.pinId || activePinId;
      if (!pinId) {
        return;
      }
      pinSaveButton.disabled = true;
      try {
        setStatus("Pin wird gespeichert...");
        await persistPinDetails(pinId);
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
      } finally {
        pinSaveButton.disabled = false;
      }
    });
  }

  if (pinDetailHeader && pinDetailCard) {
    pinDetailHeader.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) {
        return;
      }
      dragState = {
        pointerId: event.pointerId,
        offsetX: event.clientX - pinDetailCard.offsetLeft,
        offsetY: event.clientY - pinDetailCard.offsetTop,
      };
      pinDetailHeader.setPointerCapture(event.pointerId);
    });

    pinDetailHeader.addEventListener("pointermove", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }
      pinDetailCard.style.left = `${event.clientX - dragState.offsetX}px`;
      pinDetailCard.style.top = `${event.clientY - dragState.offsetY}px`;
      clampPinDetailPosition();
    });

    function endPinDrag(event) {
      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }
      pinDetailHeader.releasePointerCapture(event.pointerId);
      dragState = null;
      clampPinDetailPosition();
    }

    pinDetailHeader.addEventListener("pointerup", endPinDrag);
    pinDetailHeader.addEventListener("pointercancel", endPinDrag);
  }

  canvasElement.addEventListener("pointerdown", beginInteraction);
  canvasElement.addEventListener("pointermove", continueInteraction);
  canvasElement.addEventListener("pointerup", endInteraction);
  canvasElement.addEventListener("pointercancel", endInteraction);
  window.addEventListener("pointermove", (event) => {
    if (!pinMoveState || pinMoveState.pointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    const point = pointerPoint(event);
    if (!point) {
      return;
    }
    pinMoveState.latestPoint = point;
    updateDraggedPinPreview(pinMoveState);
  }, { passive: false });
  window.addEventListener("pointerup", (event) => {
    finishActivePinMove(event).catch(() => {});
  });
  window.addEventListener("pointercancel", (event) => {
    finishActivePinMove(event).catch(() => {});
  });
  window.addEventListener("eldran:map-selection-changed", () => {
    const currentMapId = typeof getCurrentMapId === "function" ? getCurrentMapId() : "";
    resetMapScopedState(currentMapId);
    loadImageMeta().catch(() => {});
    loadDrawings().catch(() => {});
    loadPings().catch(() => {});
    loadPins().catch(() => {});
    loadOverlays().catch(() => {});
    loadFogState().catch(() => {});
  });
  window.addEventListener("eldran:map-layer-changed", () => {
      currentImageVersion = "";
      currentDrawingVersion = "";
      currentPingVersion = "";
      currentPinVersion = "";
      currentOverlayVersion = "";
      currentFogVersion = "";
      pendingWall = null;
      selectedFogElement = null;
      hoverPoint = null;
      loadImageMeta().catch(() => {});
      loadDrawings().catch(() => {});
      loadPings().catch(() => {});
      loadPins().catch(() => {});
      loadOverlays().catch(() => {});
      loadFogState().catch(() => {});
    });
  window.addEventListener("eldran:map-gm-layer-changed", () => {
    currentPinVersion = "";
    currentOverlayVersion = "";
    loadPins().catch(() => {});
    loadOverlays().catch(() => {});
  });
  canvasElement.addEventListener("mousedown", () => {
    focusCanvas();
  });
  canvasElement.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  canvasElement.addEventListener("pointerleave", () => {
    hoverPoint = null;
    if ((wallPlacementArmed || doorPlacementArmed) && pendingWall) {
      renderFrame();
    }
  });
  window.addEventListener("resize", () => {
    renderOverlays();
    renderPins();
    renderFrame();
    clampPinDetailPosition();
  });

  document.addEventListener("keydown", async (event) => {
    const activeElement = document.activeElement;
    const interactedRecently = (Date.now() - lastMapInteractionAt) < 15000;
    if (isEditableElement(activeElement) && !interactedRecently) {
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && !event.shiftKey && !event.altKey) {
      if (!hasRenderableSurface() || isPointerDown || isAnyToolArmed()) {
        return;
      }

      event.preventDefault();
      markMapInteraction();
      try {
        setStatus("Letzter Strich wird rueckgaengig gemacht...");
        const undone = await undoLastStroke();
        setStatus(undone ? "Letzter Strich entfernt" : "Kein eigener Strich zum Rueckgaengigmachen");
      } catch (error) {
        setStatus(error.message);
      }
      return;
    }

    if (event.key === "Delete" && selectedFogElement && canManageFog()) {
      event.preventDefault();
      markMapInteraction();
      try {
        setStatus("Auswahl wird geloescht...");
        await deleteFogElement(selectedFogElement);
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
      }
      return;
    }

    if (!canManageOverlays || event.key !== "Delete" || !activeOverlayId) {
      return;
    }

    event.preventDefault();
    markMapInteraction();
    try {
      setStatus("Overlay wird geloescht...");
      await removeOverlay(activeOverlayId);
      setStatus("Bereit");
    } catch (error) {
      setStatus(error.message);
    }
  }, true);

  if (scrollContainerElement) {
    scrollContainerElement.addEventListener("wheel", (event) => {
      if (!hasRenderableSurface()) {
        return;
      }
      markMapInteraction();
      event.preventDefault();
      const delta = event.deltaY < 0 ? 0.1 : -0.1;
      const containerRect = scrollContainerElement.getBoundingClientRect();
      setZoom(zoomScale + delta, {
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top,
      });
    }, { passive: false });

    scrollContainerElement.addEventListener("dragover", (event) => {
      if (!canManageOverlays || !hasRenderableSurface()) {
        return;
      }
      const hasFiles = Array.from(event.dataTransfer?.types || []).includes("Files");
      if (!hasFiles) {
        return;
      }
      event.preventDefault();
      scrollContainerElement.classList.add("map-drop-target");
    });

    scrollContainerElement.addEventListener("dragleave", () => {
      scrollContainerElement.classList.remove("map-drop-target");
    });

    scrollContainerElement.addEventListener("drop", async (event) => {
      scrollContainerElement.classList.remove("map-drop-target");
      if (!canManageOverlays || !hasRenderableSurface()) {
        return;
      }
      const [file] = Array.from(event.dataTransfer?.files || []);
      if (!file) {
        return;
      }
      const point = pointerPoint(event);
      if (!point) {
        return;
      }
      event.preventDefault();
      try {
        await uploadOverlayAtPoint(file, point);
      } catch (error) {
        setStatus(error.message);
      }
    });

    scrollContainerElement.addEventListener("mousedown", (event) => {
      if (!hasRenderableSurface() || event.button !== 2) {
        return;
      }
      focusCanvas();
      event.preventDefault();
      panState = {
        startX: event.clientX,
        startY: event.clientY,
        offsetX: panOffsetX,
        offsetY: panOffsetY,
      };
      scrollContainerElement.classList.add("map-panning");
    });

    scrollContainerElement.addEventListener("mousemove", (event) => {
      if (!panState) {
        return;
      }
      markMapInteraction();
      event.preventDefault();
      const dx = event.clientX - panState.startX;
      const dy = event.clientY - panState.startY;
      panOffsetX = panState.offsetX + dx;
      panOffsetY = panState.offsetY + dy;
      applyZoom();
    });

    function endPan() {
      if (!panState) {
        return;
      }
      panState = null;
      scrollContainerElement.classList.remove("map-panning");
    }

    scrollContainerElement.addEventListener("mouseup", endPan);
    scrollContainerElement.addEventListener("mouseleave", endPan);
    scrollContainerElement.addEventListener("contextmenu", (event) => {
      if (panState) {
        event.preventDefault();
      }
    });
  }

  if (imageUploadInput) {
    imageUploadInput.addEventListener("change", async () => {
      const [file] = imageUploadInput.files;
      if (!file) {
        return;
      }

      try {
        await uploadMapImage(file);
      } catch (error) {
        setStatus(error.message);
      } finally {
        imageUploadInput.value = "";
      }
    });
  }

  if (drawingsClearButton) {
    drawingsClearButton.classList.toggle("hidden", !canManageDrawings);
    drawingsClearButton.addEventListener("click", async () => {
      drawingsClearButton.disabled = true;
      try {
        setStatus("Linien werden geloescht...");
        await clearDrawings();
        setStatus("Bereit");
      } catch (error) {
        setStatus(error.message);
      } finally {
        drawingsClearButton.disabled = false;
      }
    });
  }

  async function refresh() {
    await loadImageMeta();
    await loadFogState();
    await loadOverlays();
    await loadDrawings();
    await loadPings();
    if (!pinMoveState && !pinMovePersisting) {
      await loadPins();
    }
  }

  function animationLoop() {
    renderFrame();
    requestAnimationFrame(animationLoop);
  }

  refresh().catch((error) => {
    setStatus(error.message);
  });

  initializeStoredDrawColor();
  syncDrawControls();
  syncVisionLabel(tokenVisionInput, tokenVisionValueElement);
  syncVisionLabel(pinDetailVisionInput, pinDetailVisionValueElement);
  updatePinPlacementUi();
  updateFogControls();
  resetPinDetailPosition();
  updateZoomLabel();
  applyZoom();
  animationLoop();

  setInterval(() => {
    refresh().catch(() => {});
  }, 1000);
}
