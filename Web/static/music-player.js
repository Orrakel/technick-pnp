function initSharedMusicPlayer({
  audioElement,
  statusElement = null,
  sourceElement = null,
  volumeWrapElement = null,
  volumeInputElement = null,
  muteButtonElement = null,
  managerWrapElement = null,
  trackSelectElement = null,
  fileInputElement = null,
  loadButtonElement = null,
  playButtonElement = null,
  pauseButtonElement = null,
  clearButtonElement = null,
  canManage = false,
}) {
  if (!audioElement) {
    return;
  }

  let currentUpdatedAt = "";
  let currentFileName = "";
  let currentTrackId = "";
  let suppressControlSync = false;
  let pendingSeekSync = null;
  let availableTracks = [];
  let queuedMusicState = null;
  let activeCueId = "";
  let lastHandledCueId = "";
  let isCuePlaying = false;
  let lastNonZeroVolume = 1;
  const cueAudioElement = new Audio();
  const volumeStorageKey = "eldran-player-volume";

  function setStatus(text) {
    if (statusElement) {
      statusElement.textContent = text;
    }
  }

  function setSourceText(text) {
    if (sourceElement) {
      sourceElement.textContent = text;
    }
  }

  function applyLocalVolume(nextVolume) {
    const numeric = Number(nextVolume);
    const fallback = Number.isFinite(audioElement.volume) ? audioElement.volume : 1;
    const clamped = Math.min(Math.max(Number.isFinite(numeric) ? numeric : fallback, 0), 1);
    audioElement.volume = clamped;
    cueAudioElement.volume = clamped;
    audioElement.muted = clamped <= 0;
    cueAudioElement.muted = clamped <= 0;
    if (clamped > 0) {
      lastNonZeroVolume = clamped;
    }
    if (volumeInputElement) {
      volumeInputElement.value = String(Math.round(clamped * 100));
    }
    if (muteButtonElement) {
      muteButtonElement.textContent = clamped <= 0 ? "Ton an" : "Mute";
    }
    try {
      window.localStorage.setItem(volumeStorageKey, String(clamped));
    } catch {}
  }

  function applyVolumeInputFromClientX(clientX) {
    if (!volumeInputElement) {
      return;
    }
    const rect = volumeInputElement.getBoundingClientRect();
    const ratio = rect.width > 0 ? Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1) : 0;
    applyLocalVolume(ratio);
  }

  function clearPlayerUi() {
    audioElement.pause();
    audioElement.removeAttribute("src");
    audioElement.load();
    currentUpdatedAt = "";
    currentFileName = "";
    currentTrackId = "";
    setSourceText("Keine Musik aktiv.");
    setStatus("Kein Track aktiv.");
  }

  function sleep(milliseconds) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, milliseconds);
    });
  }

  function renderTrackOptions(selectedTrackId = "") {
    if (!trackSelectElement) {
      return;
    }
    trackSelectElement.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = availableTracks.length ? "Track auswaehlen" : "Keine Tracks gespeichert";
    trackSelectElement.appendChild(placeholder);
    for (const track of availableTracks) {
      const option = document.createElement("option");
      option.value = track.id;
      option.textContent = track.title || track.file_name;
      option.selected = track.id === selectedTrackId;
      trackSelectElement.appendChild(option);
    }
    if (!selectedTrackId) {
      trackSelectElement.value = "";
    }
  }

  async function loadTrackList(selectedTrackId = "") {
    const response = await fetch(`/api/music-tracks?ts=${Date.now()}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Trackliste konnte nicht geladen werden.");
    }
    availableTracks = Array.isArray(data.tracks) ? data.tracks : [];
    renderTrackOptions(selectedTrackId);
  }

  function computeTargetPosition(state) {
    const base = Number(state.position_seconds || 0);
    if (!state.is_playing || !state.started_at) {
      return base;
    }
    const startedAt = Date.parse(state.started_at || "");
    if (!startedAt) {
      return base;
    }
    return Math.max(base + ((Date.now() - startedAt) / 1000), 0);
  }

  async function setAudioPosition(positionSeconds) {
    if (!Number.isFinite(positionSeconds)) {
      return;
    }
    if (audioElement.readyState >= 1) {
      try {
        audioElement.currentTime = Math.max(positionSeconds, 0);
      } catch {}
      return;
    }
    await new Promise((resolve) => {
      const onLoadedMetadata = () => {
        audioElement.removeEventListener("loadedmetadata", onLoadedMetadata);
        resolve();
      };
      audioElement.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
    });
    try {
      audioElement.currentTime = Math.max(positionSeconds, 0);
    } catch {}
  }

  async function applyMusicState(state) {
    if (isCuePlaying) {
      queuedMusicState = state;
      return;
    }
    if (!state.file_name) {
      if (currentFileName || audioElement.getAttribute("src")) {
        clearPlayerUi();
      }
      return;
    }

    const sourceLabel = state.title || state.file_name;
    setSourceText(sourceLabel);
    currentTrackId = state.track_id || "";
    renderTrackOptions(currentTrackId);

    const nextSource = state.audio_url || `/api/music-file/${encodeURIComponent(state.file_name)}?ts=${state.updated_at || ""}`;
    const fileChanged = state.file_name !== currentFileName || state.updated_at !== currentUpdatedAt;

    suppressControlSync = true;
    try {
      if (fileChanged) {
        currentFileName = state.file_name;
        currentUpdatedAt = state.updated_at || "";
        audioElement.src = nextSource;
        audioElement.load();
      }

      const targetPosition = computeTargetPosition(state);
      const shouldResyncPosition = fileChanged || Math.abs((audioElement.currentTime || 0) - targetPosition) > 1.5;
      if (shouldResyncPosition) {
        await setAudioPosition(targetPosition);
      }

      if (state.is_playing) {
        try {
          await audioElement.play();
          setStatus(state.requested_by ? `Aktiv gesetzt von ${state.requested_by}.` : "Track aktiv.");
        } catch {
          setStatus("Track aktiv. Falls nichts startet, bitte einmal im Player auf Play klicken.");
        }
      } else {
        audioElement.pause();
        setStatus("Track geladen, derzeit pausiert.");
      }
    } finally {
      suppressControlSync = false;
    }
  }

  async function loadSoundCue() {
    const response = await fetch(`/api/map-sound-cue?ts=${Date.now()}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Soundstatus konnte nicht geladen werden.");
    }
    const cueId = data.cue_id || "";
    if (!cueId || cueId === activeCueId || cueId === lastHandledCueId) {
      return;
    }
    await playSoundCue(data);
  }

  async function playSoundCue(cue) {
    if (!cue?.cue_id || !cue?.file_name) {
      return;
    }
    activeCueId = cue.cue_id;
    isCuePlaying = true;
    queuedMusicState = null;
    setStatus(cue.title ? `Sound: ${cue.title}` : "Sound-Cue aktiv.");
    suppressControlSync = true;
    try {
      audioElement.pause();
    } finally {
      suppressControlSync = false;
    }
    await sleep(1000);
    try {
      cueAudioElement.src = cue.audio_url || `/api/map-pin-sound/${encodeURIComponent(cue.file_name)}?ts=${cue.updated_at || ""}`;
      cueAudioElement.load();
      await cueAudioElement.play();
      await new Promise((resolve, reject) => {
        const cleanup = () => {
          cueAudioElement.removeEventListener("ended", onEnded);
          cueAudioElement.removeEventListener("error", onError);
        };
        const onEnded = () => {
          cleanup();
          resolve();
        };
        const onError = () => {
          cleanup();
          reject(new Error("Sound konnte nicht abgespielt werden."));
        };
        cueAudioElement.addEventListener("ended", onEnded, { once: true });
        cueAudioElement.addEventListener("error", onError, { once: true });
      });
    } catch (error) {
      setStatus(error.message || "Sound konnte nicht abgespielt werden.");
    }
    await sleep(1000);
    if (canManage) {
      try {
        const response = await fetch(`/api/map-sound-cue/${cue.cue_id}/complete`, { method: "POST" });
        const data = await response.json();
        if (response.ok && data?.music_state) {
          queuedMusicState = data.music_state;
        }
      } catch {}
    }
    lastHandledCueId = cue.cue_id;
    activeCueId = "";
    isCuePlaying = false;
    cueAudioElement.pause();
    cueAudioElement.removeAttribute("src");
    cueAudioElement.load();
    if (queuedMusicState) {
      const nextState = queuedMusicState;
      queuedMusicState = null;
      await applyMusicState(nextState);
      return;
    }
    await loadMusicState();
  }

  async function loadMusicState() {
    await loadTrackList(currentTrackId);
    const response = await fetch(`/api/music-state?ts=${Date.now()}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Musikstatus konnte nicht geladen werden.");
    }
    await applyMusicState(data);
  }

  async function uploadTrack() {
    const file = fileInputElement?.files?.[0];
    if (!file) {
      throw new Error("Audiodatei fehlt.");
    }
    const fileName = String(file.name || "").toLowerCase();
    if (!(file.type.startsWith("audio/") || file.type === "video/mp4" || fileName.endsWith(".mp4"))) {
      throw new Error("Bitte MP3, OGG, WAV, M4A, AAC, MP4 oder WEBM verwenden.");
    }
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/music-track", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Track konnte nicht hochgeladen werden.");
    }
    if (fileInputElement) {
      fileInputElement.value = "";
    }
    await loadTrackList(data.track_id || "");
    await applyMusicState(data);
  }

  async function loadSelectedTrack() {
    const trackId = trackSelectElement?.value || "";
    if (!trackId) {
      throw new Error("Bitte zuerst einen gespeicherten Track auswaehlen.");
    }
    const response = await fetch("/api/music-track/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ track_id: trackId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Track konnte nicht geladen werden.");
    }
    await applyMusicState(data);
  }

  async function updatePlaybackState(payload) {
    const response = await fetch("/api/music-state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Musikstatus konnte nicht aktualisiert werden.");
    }
    await applyMusicState(data);
  }

  async function clearMusic() {
    const response = await fetch("/api/music-state", { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Musik konnte nicht gestoppt werden.");
    }
    clearPlayerUi();
  }

  if (managerWrapElement) {
    managerWrapElement.classList.toggle("hidden", !canManage);
  }
  if (volumeWrapElement) {
    volumeWrapElement.classList.toggle("hidden", canManage);
  }
  if (!canManage) {
    audioElement.controls = false;
    audioElement.removeAttribute("controls");
    audioElement.classList.add("music-player-audio-passive");
  }
  let initialVolume = 1;
  try {
    initialVolume = Number(window.localStorage.getItem(volumeStorageKey) || "1");
  } catch {}
  applyLocalVolume(initialVolume);
  if (volumeInputElement) {
    volumeInputElement.addEventListener("input", () => {
      applyLocalVolume(Number(volumeInputElement.value || 100) / 100);
    });
    volumeInputElement.addEventListener("change", () => {
      applyLocalVolume(Number(volumeInputElement.value || 100) / 100);
    });
    volumeInputElement.addEventListener("pointerdown", (event) => {
      applyVolumeInputFromClientX(event.clientX);
    });
    volumeInputElement.addEventListener("pointermove", (event) => {
      if ((event.buttons & 1) !== 1) {
        return;
      }
      applyVolumeInputFromClientX(event.clientX);
    });
    volumeInputElement.addEventListener("click", (event) => {
      applyVolumeInputFromClientX(event.clientX);
    });
  }
  if (muteButtonElement) {
    muteButtonElement.classList.toggle("hidden", canManage);
    muteButtonElement.addEventListener("click", () => {
      if ((audioElement.volume || 0) <= 0.001) {
        applyLocalVolume(lastNonZeroVolume > 0 ? lastNonZeroVolume : 1);
        return;
      }
      lastNonZeroVolume = audioElement.volume || lastNonZeroVolume || 1;
      applyLocalVolume(0);
    });
  }

  if (fileInputElement && canManage) {
    fileInputElement.addEventListener("change", async () => {
      if (!fileInputElement.files?.length) {
        return;
      }
      fileInputElement.disabled = true;
      setStatus("Track wird hochgeladen...");
      try {
        await uploadTrack();
      } catch (error) {
        setStatus(error.message);
      } finally {
        fileInputElement.disabled = false;
      }
    });
  }

  if (loadButtonElement) {
    loadButtonElement.classList.toggle("hidden", !canManage);
    loadButtonElement.addEventListener("click", async () => {
      loadButtonElement.disabled = true;
      try {
        setStatus("Track wird geladen...");
        await loadSelectedTrack();
      } catch (error) {
        setStatus(error.message);
      } finally {
        loadButtonElement.disabled = false;
      }
    });
  }

  if (trackSelectElement && canManage) {
    trackSelectElement.addEventListener("change", async () => {
      if (!trackSelectElement.value) {
        return;
      }
      if (currentTrackId && !audioElement.paused) {
        return;
      }
      try {
        setStatus("Track wird geladen...");
        await loadSelectedTrack();
      } catch (error) {
        setStatus(error.message);
      }
    });
  }

  if (playButtonElement) {
    playButtonElement.classList.toggle("hidden", !canManage);
    playButtonElement.addEventListener("click", async () => {
      playButtonElement.disabled = true;
      try {
        await updatePlaybackState({
          is_playing: true,
          position_seconds: audioElement.currentTime || 0,
        });
      } catch (error) {
        setStatus(error.message);
      } finally {
        playButtonElement.disabled = false;
      }
    });
  }

  if (pauseButtonElement) {
    pauseButtonElement.classList.toggle("hidden", !canManage);
    pauseButtonElement.addEventListener("click", async () => {
      pauseButtonElement.disabled = true;
      try {
        await updatePlaybackState({
          is_playing: false,
          position_seconds: audioElement.currentTime || 0,
        });
      } catch (error) {
        setStatus(error.message);
      } finally {
        pauseButtonElement.disabled = false;
      }
    });
  }

  if (clearButtonElement) {
    clearButtonElement.classList.toggle("hidden", !canManage);
    clearButtonElement.addEventListener("click", async () => {
      clearButtonElement.disabled = true;
      try {
        await clearMusic();
      } catch (error) {
        setStatus(error.message);
      } finally {
        clearButtonElement.disabled = false;
      }
    });
  }

  if (canManage) {
    audioElement.addEventListener("play", async () => {
      if (suppressControlSync || !currentFileName) {
        return;
      }
      try {
        await updatePlaybackState({
          is_playing: true,
          position_seconds: audioElement.currentTime || 0,
        });
      } catch (error) {
        setStatus(error.message);
      }
    });

    audioElement.addEventListener("pause", async () => {
      if (suppressControlSync || !currentFileName) {
        return;
      }
      try {
        await updatePlaybackState({
          is_playing: false,
          position_seconds: audioElement.currentTime || 0,
        });
      } catch (error) {
        setStatus(error.message);
      }
    });

    audioElement.addEventListener("seeked", () => {
      if (suppressControlSync || !currentFileName) {
        return;
      }
      if (pendingSeekSync) {
        clearTimeout(pendingSeekSync);
      }
      pendingSeekSync = setTimeout(async () => {
        pendingSeekSync = null;
        try {
          await updatePlaybackState({
            is_playing: !audioElement.paused,
            position_seconds: audioElement.currentTime || 0,
          });
        } catch (error) {
          setStatus(error.message);
        }
      }, 150);
    });
  }

  loadMusicState().catch((error) => {
    setStatus(error.message);
  });
  setInterval(() => {
    loadMusicState().catch(() => {});
  }, 2000);
  setInterval(() => {
    loadSoundCue().catch(() => {});
  }, 1000);
}
