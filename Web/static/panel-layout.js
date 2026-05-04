function initPanelLayout({
  rootSelector,
  storageKey,
}) {
  const root = document.querySelector(rootSelector);
  if (!root) {
    return;
  }

  const columns = Array.from(root.querySelectorAll("[data-panel-column]"));
  const panels = Array.from(root.querySelectorAll("[data-panel-id]"));
  const sidebars = Array.from(root.querySelectorAll("[data-panel-sidebar]"));
  const sidebarToggles = Array.from(root.querySelectorAll("[data-sidebar-toggle]"));
  if (!columns.length || !panels.length) {
    return;
  }

  let dragState = null;

  function getPanelContent(panel) {
    return panel.querySelector("[data-panel-content]");
  }

  function getPanelToggle(panel) {
    return panel.querySelector("[data-panel-toggle]");
  }

  function sidebarForColumn(column) {
    return sidebars.find((item) => item.dataset.panelSidebar === column.dataset.panelColumn) || null;
  }

  function isSidebarCollapsed(sidebarId) {
    return root.classList.contains(`sidebar-${sidebarId}-collapsed`);
  }

  function isSidebarEmpty(sidebarId) {
    return root.classList.contains(`sidebar-${sidebarId}-empty`);
  }

  function setSidebarCollapsed(sidebarId, collapsed) {
    root.classList.toggle(`sidebar-${sidebarId}-collapsed`, collapsed);
    const toggle = sidebarToggles.find((item) => item.dataset.sidebarToggle === sidebarId);
    if (toggle) {
      if (sidebarId === "left") {
        toggle.textContent = collapsed ? ">>" : "<<";
      } else {
        toggle.textContent = collapsed ? "<<" : ">>";
      }
      toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
  }

  function updateEmptyColumns() {
    for (const column of columns) {
      const hasPanels = column.querySelector("[data-panel-id]");
      column.classList.toggle("hidden", !hasPanels);
      const sidebar = sidebarForColumn(column);
      if (sidebar) {
        sidebar.classList.remove("hidden");
        root.classList.toggle(`sidebar-${column.dataset.panelColumn}-empty`, !hasPanels);
        root.classList.remove(`sidebar-${column.dataset.panelColumn}-hidden`);
      }
      const toggle = sidebarToggles.find((item) => item.dataset.sidebarToggle === column.dataset.panelColumn);
      if (toggle) {
        toggle.classList.remove("hidden");
      }
    }
  }

  function serializeLayout() {
    const layout = {
      columns: columns.map((column) => ({
        id: column.dataset.panelColumn,
        panels: Array.from(column.querySelectorAll("[data-panel-id]")).map((panel) => panel.dataset.panelId),
      })),
      collapsed: Object.fromEntries(
        panels.map((panel) => [panel.dataset.panelId, panel.classList.contains("collapsed")]),
      ),
      sidebars: Object.fromEntries(
        columns.map((column) => [column.dataset.panelColumn, root.classList.contains(`sidebar-${column.dataset.panelColumn}-collapsed`)]),
      ),
    };
    localStorage.setItem(storageKey, JSON.stringify(layout));
  }

  function setCollapsed(panel, collapsed) {
    const content = getPanelContent(panel);
    const toggle = getPanelToggle(panel);
    panel.classList.toggle("collapsed", collapsed);
    if (content) {
      content.classList.toggle("hidden", collapsed);
    }
    if (toggle) {
      toggle.textContent = collapsed ? "+" : "-";
      toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
  }

  function restoreLayout() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      updateEmptyColumns();
      return;
    }

    try {
      const layout = JSON.parse(raw);
      if (Array.isArray(layout.columns)) {
        for (const columnLayout of layout.columns) {
          const column = columns.find((item) => item.dataset.panelColumn === columnLayout.id);
          if (!column || !Array.isArray(columnLayout.panels)) {
            continue;
          }
          for (const panelId of columnLayout.panels) {
            const panel = panels.find((item) => item.dataset.panelId === panelId);
            if (panel) {
              column.appendChild(panel);
            }
          }
        }
      }
      for (const panel of panels) {
        const collapsed = Boolean(layout.collapsed?.[panel.dataset.panelId]);
        setCollapsed(panel, collapsed);
      }
      for (const column of columns) {
        setSidebarCollapsed(column.dataset.panelColumn, Boolean(layout.sidebars?.[column.dataset.panelColumn]));
      }
    } catch {
      localStorage.removeItem(storageKey);
    }

    updateEmptyColumns();
  }

  function findDropTargetColumn(pointerX) {
    let bestColumn = columns[0];
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const column of columns) {
      const sidebar = sidebarForColumn(column);
      const rect = (sidebar || column).getBoundingClientRect();
      const center = rect.left + (rect.width / 2);
      const distance = Math.abs(pointerX - center);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestColumn = column;
      }
    }
    return bestColumn;
  }

  function findDropBeforeElement(column, pointerY) {
    const siblings = Array.from(column.querySelectorAll("[data-panel-id]")).filter((panel) => panel !== dragState?.panel);
    for (const sibling of siblings) {
      const rect = sibling.getBoundingClientRect();
      if (pointerY < rect.top + (rect.height / 2)) {
        return sibling;
      }
    }
    return null;
  }

  function clearDropIndicators() {
    columns.forEach((column) => column.classList.remove("drop-target"));
    sidebars.forEach((sidebar) => sidebar.classList.remove("drop-target"));
    panels.forEach((panel) => panel.classList.remove("dragging"));
  }

  function beginDrag(panel, event) {
    dragState = {
      panel,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
      sidebarState: Object.fromEntries(
        columns.map((column) => [
          column.dataset.panelColumn,
          {
            collapsed: isSidebarCollapsed(column.dataset.panelColumn),
            empty: isSidebarEmpty(column.dataset.panelColumn),
          },
        ]),
      ),
    };

    function onMove(moveEvent) {
      if (!dragState) {
        return;
      }
      const dx = moveEvent.clientX - dragState.startX;
      const dy = moveEvent.clientY - dragState.startY;
      if (!dragState.dragging && Math.hypot(dx, dy) < 6) {
        return;
      }
      if (!dragState.dragging) {
        dragState.dragging = true;
        panel.classList.add("dragging");
        document.body.classList.add("panel-dragging");
        columns.forEach((column) => {
          const sidebarId = column.dataset.panelColumn;
          const sidebar = sidebarForColumn(column);
          if (sidebar) {
            sidebar.classList.remove("hidden");
          }
          root.classList.remove(`sidebar-${sidebarId}-hidden`);
          root.classList.remove(`sidebar-${sidebarId}-empty`);
          setSidebarCollapsed(sidebarId, false);
        });
      }
      const targetColumn = findDropTargetColumn(moveEvent.clientX);
      columns.forEach((column) => column.classList.toggle("drop-target", column === targetColumn));
      sidebars.forEach((sidebar) => sidebar.classList.toggle("drop-target", sidebar === sidebarForColumn(targetColumn)));
      const beforeElement = findDropBeforeElement(targetColumn, moveEvent.clientY);
      if (beforeElement) {
        targetColumn.insertBefore(panel, beforeElement);
      } else {
        targetColumn.appendChild(panel);
      }
      updateEmptyColumns();
    }

    function endDrag() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", endDrag);
      const wasDragging = dragState?.dragging;
      const sidebarState = dragState?.sidebarState || {};
      document.body.classList.remove("panel-dragging");
      clearDropIndicators();
      if (!wasDragging) {
        setCollapsed(panel, !panel.classList.contains("collapsed"));
      }
      dragState = null;
      updateEmptyColumns();
      for (const column of columns) {
        const sidebarId = column.dataset.panelColumn;
        const state = sidebarState[sidebarId];
        if (!state) {
          continue;
        }
        const hasPanels = Boolean(column.querySelector("[data-panel-id]"));
        if (!hasPanels && state.empty) {
          root.classList.add(`sidebar-${sidebarId}-empty`);
        }
        setSidebarCollapsed(sidebarId, hasPanels ? state.collapsed : state.collapsed || state.empty);
      }
      serializeLayout();
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", endDrag);
    event.preventDefault();
  }

  for (const panel of panels) {
    const handle = panel.querySelector("[data-panel-drag]");
    const toggle = getPanelToggle(panel);
    if (toggle) {
      toggle.addEventListener("click", () => {
        setCollapsed(panel, !panel.classList.contains("collapsed"));
        serializeLayout();
      });
    }
    if (handle) {
      handle.addEventListener("pointerdown", (event) => {
        if (event.target.closest("[data-panel-toggle]")) {
          return;
        }
        beginDrag(panel, event);
      });
    }
  }

  for (const toggle of sidebarToggles) {
    toggle.addEventListener("click", () => {
      const sidebarId = toggle.dataset.sidebarToggle;
      const nextCollapsed = !root.classList.contains(`sidebar-${sidebarId}-collapsed`);
      setSidebarCollapsed(sidebarId, nextCollapsed);
      serializeLayout();
    });
  }

  restoreLayout();
}
