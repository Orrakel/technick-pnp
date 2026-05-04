const AUTH_TOKEN_STORAGE_KEY = "eldran-auth-token";

function getStoredAuthToken() {
  return window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
}

function clearStoredAuthToken() {
  window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

const originalFetch = window.fetch.bind(window);
window.fetch = (resource, options = {}) => {
  const token = getStoredAuthToken();
  if (!token) {
    return originalFetch(resource, options);
  }
  const headers = new Headers(options.headers || {});
  if (!headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return originalFetch(resource, { ...options, headers });
};

async function initializeAuthUi(options = {}) {
  const { required = true } = options;
  const response = await fetch("/api/auth/me", { cache: "no-store" });
  if (response.status === 401) {
    clearStoredAuthToken();
    if (required) {
      window.location.href = "/login";
      return null;
    }

    document.querySelectorAll("[data-current-user]").forEach((element) => {
      element.textContent = "Gast";
    });

    document.querySelectorAll("[data-logout-button]").forEach((button) => {
      button.textContent = "Login";
      button.addEventListener("click", () => {
        window.location.href = "/login";
      });
    });
    return null;
  }
  const data = await response.json();
  const user = data.user;
  globalThis.currentUserId = user.id;
  globalThis.currentUsername = user.username;
  globalThis.currentUserRole = user.role;
  const storedRouteMode = window.sessionStorage.getItem("eldran-route-mode");
  const currentPath = window.location.pathname;
  let routeMode = document.body?.dataset?.routeMode || "";
  if (!routeMode) {
    if (["/Karte", "/Battlemap", "/Eldran", "/Charakterbogen", "/Charakter-Builder"].includes(currentPath)) {
      routeMode = "remote";
    } else if (["/karte", "/battlemap", "/chat", "/db", "/charakterbogen", "/charakter-builder", "/projekte/neu"].includes(currentPath)) {
      routeMode = "local";
    } else if (storedRouteMode) {
      routeMode = storedRouteMode;
    } else {
      routeMode = (user.role === "admin" || user.role === "spielleiter") ? "local" : "remote";
    }
  }
  window.sessionStorage.setItem("eldran-route-mode", routeMode);
  const preferredMapPath = routeMode === "remote" ? "/Karte" : "/karte";
  const preferredBattlemapPath = routeMode === "remote" ? "/Battlemap" : "/battlemap";
  const preferredChatPath = routeMode === "remote" ? "/Eldran" : "/chat";
  const preferredSheetPath = routeMode === "remote" ? "/Charakterbogen" : "/charakterbogen";
  const preferredBuilderPath = routeMode === "remote" ? "/Charakter-Builder" : "/charakter-builder";

  document.querySelectorAll("[data-current-user]").forEach((element) => {
    element.textContent = user.username;
  });

  document.querySelectorAll("[data-gm-only]").forEach((element) => {
    element.classList.toggle("hidden", !(user.role === "admin" || user.role === "spielleiter"));
  });
  document.querySelectorAll("[data-admin-only]").forEach((element) => {
    element.classList.toggle("hidden", user.role !== "admin");
  });

  document.querySelectorAll('[data-surface-link="map"]').forEach((element) => {
    element.setAttribute("href", preferredMapPath);
    if (element.dataset.surfaceLinkBound !== "true") {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = preferredMapPath;
      });
      element.dataset.surfaceLinkBound = "true";
    }
  });
  document.querySelectorAll('[data-surface-link="battlemap"]').forEach((element) => {
    element.setAttribute("href", preferredBattlemapPath);
    if (element.dataset.surfaceLinkBound !== "true") {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = preferredBattlemapPath;
      });
      element.dataset.surfaceLinkBound = "true";
    }
  });
  document.querySelectorAll('[data-nav-link="chat"]').forEach((element) => {
    element.setAttribute("href", preferredChatPath);
    if (element.dataset.navLinkBound !== "true") {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = preferredChatPath;
      });
      element.dataset.navLinkBound = "true";
    }
  });
  document.querySelectorAll('[data-nav-link="sheet"]').forEach((element) => {
    element.setAttribute("href", preferredSheetPath);
    if (element.dataset.navLinkBound !== "true") {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = preferredSheetPath;
      });
      element.dataset.navLinkBound = "true";
    }
  });
  document.querySelectorAll('[data-nav-link="builder"]').forEach((element) => {
    element.setAttribute("href", preferredBuilderPath);
    if (element.dataset.navLinkBound !== "true") {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = preferredBuilderPath;
      });
      element.dataset.navLinkBound = "true";
    }
  });

  document.querySelectorAll("[data-logout-button]").forEach((button) => {
    button.addEventListener("click", async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      clearStoredAuthToken();
      window.location.href = "/login";
    });
  });

  return user;
}
