function initProjectSelector({
  selectElement,
  createInputElement = null,
  createButtonElement = null,
  statusElement = null,
  playerListElement = null,
  onProjectChanged = null,
}) {
  if (!selectElement) {
    return;
  }

  function canManageProjects() {
    return ["admin", "spielleiter"].includes(globalThis.currentUserRole || "");
  }

  function projectSectionRoot() {
    return selectElement.closest("[data-panel-id='project'], .upload-panel") || null;
  }

  function setStatus(text) {
    if (statusElement) {
      statusElement.textContent = text;
    }
  }

  async function setPlayerAssignment(projectId, userId, assigned) {
    const response = await fetch(`/api/projects/${projectId}/players`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, assigned }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Spielerzuordnung konnte nicht gespeichert werden.");
    }
    return data;
  }

  function renderProjectPlayers(players) {
    if (!playerListElement) {
      return;
    }
    playerListElement.innerHTML = "";
    if (!canManageProjects()) {
      return;
    }
    if (!players.length) {
      playerListElement.innerHTML = '<div class="upload-hint">Keine Spieler vorhanden.</div>';
      return;
    }
    const assignedPlayers = players.filter((player) => Boolean(player.is_assigned));
    const availablePlayers = players.filter((player) => !player.is_assigned);

    const addWrap = document.createElement("div");
    addWrap.className = "draw-control";
    const addLabel = document.createElement("span");
    addLabel.className = "file-meta";
    addLabel.textContent = "Spieler hinzufügen";
    const addRow = document.createElement("div");
    addRow.className = "stack-actions horizontal-actions";
    const addSelect = document.createElement("select");
    addSelect.className = "sidebar-input";
    addSelect.innerHTML = "";
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = availablePlayers.length ? "Spieler auswählen" : "Keine weiteren Spieler";
    addSelect.appendChild(emptyOption);
    for (const player of availablePlayers) {
      const option = document.createElement("option");
      option.value = player.id;
      option.textContent = player.username;
      addSelect.appendChild(option);
    }
    addSelect.disabled = !availablePlayers.length;
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "ghost-button compact-button";
    addButton.textContent = "Hinzufügen";
    addButton.disabled = !availablePlayers.length;
    addButton.addEventListener("click", async () => {
      if (!addSelect.value) {
        setStatus("Bitte zuerst einen Spieler auswählen.");
        return;
      }
      addButton.disabled = true;
      addSelect.disabled = true;
      setStatus("Spieler wird hinzugefügt...");
      try {
        await setPlayerAssignment(selectElement.value, addSelect.value, true);
        await loadProjectPlayers(selectElement.value);
        setStatus("Projekt bereit.");
      } catch (error) {
        setStatus(error.message);
      } finally {
        addButton.disabled = false;
        addSelect.disabled = !availablePlayers.length;
      }
    });
    addRow.append(addSelect, addButton);
    addWrap.append(addLabel, addRow);
    playerListElement.appendChild(addWrap);

    const assignedWrap = document.createElement("div");
    assignedWrap.className = "draw-control";
    const assignedLabel = document.createElement("span");
    assignedLabel.className = "file-meta";
    assignedLabel.textContent = "Projektspieler";
    assignedWrap.appendChild(assignedLabel);
    if (!assignedPlayers.length) {
      const emptyAssigned = document.createElement("div");
      emptyAssigned.className = "upload-hint";
      emptyAssigned.textContent = "Noch keine Spieler zugewiesen.";
      assignedWrap.appendChild(emptyAssigned);
    } else {
      for (const player of assignedPlayers) {
        const row = document.createElement("div");
        row.className = "stack-actions horizontal-actions";
        const name = document.createElement("span");
        name.className = "file-meta";
        name.textContent = player.username;
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "ghost-button compact-button";
        removeButton.textContent = "Entfernen";
        removeButton.addEventListener("click", async () => {
          removeButton.disabled = true;
          setStatus("Spieler wird entfernt...");
          try {
            await setPlayerAssignment(selectElement.value, player.id, false);
            await loadProjectPlayers(selectElement.value);
            setStatus("Projekt bereit.");
          } catch (error) {
            setStatus(error.message);
          } finally {
            removeButton.disabled = false;
          }
        });
        row.append(name, removeButton);
        assignedWrap.appendChild(row);
      }
    }
    playerListElement.appendChild(assignedWrap);
  }

  async function loadProjectPlayers(projectId) {
    if (!playerListElement) {
      return;
    }
    if (!canManageProjects() || !projectId) {
      renderProjectPlayers([]);
      return;
    }
    const response = await fetch(`/api/projects/${projectId}/players`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Projektspieler konnten nicht geladen werden.");
    }
    renderProjectPlayers(data.players || []);
  }

  async function loadProjects() {
    const response = await fetch("/api/projects", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Projekte konnten nicht geladen werden.");
    }
    const projects = data.projects || [];
    const section = projectSectionRoot();
    if (section) {
      section.classList.toggle("hidden", (globalThis.currentUserRole || "") === "spieler");
    }
    selectElement.innerHTML = "";
    for (const project of projects) {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.name;
      selectElement.appendChild(option);
    }
    selectElement.value = data.active_project_id || projects[0]?.id || "";
    selectElement.disabled = !canManageProjects();
    if (createInputElement) {
      createInputElement.disabled = !canManageProjects();
    }
    if (createButtonElement) {
      createButtonElement.hidden = !canManageProjects();
      createButtonElement.disabled = !canManageProjects();
    }
    const activeProject = projects.find((item) => item.id === selectElement.value);
    setStatus(activeProject ? `Aktiv: ${activeProject.name}` : "Kein Projekt aktiv.");
    await loadProjectPlayers(selectElement.value);
    return data;
  }

  async function activateProject(projectId) {
    const response = await fetch("/api/projects/current", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Projekt konnte nicht aktiviert werden.");
    }
    await loadProjects();
    window.dispatchEvent(new CustomEvent("eldran:project-changed", { detail: { projectId } }));
    if (typeof onProjectChanged === "function") {
      await onProjectChanged(projectId);
    }
  }

  async function createProject() {
    const name = createInputElement?.value?.trim() || "";
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    window.location.href = `/projekte/neu${query}`;
  }

  selectElement.addEventListener("change", async () => {
    if (!selectElement.value || !canManageProjects()) {
      return;
    }
    selectElement.disabled = true;
    setStatus("Projekt wird gewechselt...");
    try {
      await activateProject(selectElement.value);
    } catch (error) {
      setStatus(error.message);
      await loadProjects().catch(() => {});
    } finally {
      selectElement.disabled = !canManageProjects();
    }
  });

  createButtonElement?.addEventListener("click", async () => {
    if (!canManageProjects()) {
      return;
    }
    createButtonElement.disabled = true;
    setStatus("Projekt-Wizard wird geoeffnet...");
    try {
      await createProject();
    } catch (error) {
      setStatus(error.message);
    } finally {
      createButtonElement.disabled = false;
    }
  });

  loadProjects().catch((error) => {
    setStatus(error.message);
  });
}
