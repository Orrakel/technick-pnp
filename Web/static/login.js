const loginForm = document.getElementById("loginForm");
const authStatus = document.getElementById("authStatus");
const AUTH_TOKEN_STORAGE_KEY = "eldran-auth-token";

function getStoredAuthToken() {
  return window.sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
}

function setStoredAuthToken(token) {
  window.sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

function clearStoredAuthToken() {
  window.sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

function requestedTarget() {
  const target = new URLSearchParams(window.location.search).get("next") || "";
  if (!target.startsWith("/") || target.startsWith("//")) {
    return "";
  }
  return target;
}

function isLocalHost() {
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function defaultTargetForUser(user) {
  return isLocalHost() && user?.role === "admin" ? "/karte" : "/Karte";
}

async function postJson(url, body) {
  const headers = new Headers({ "Content-Type": "application/json" });
  const token = getStoredAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Anfrage fehlgeschlagen.");
  }
  return data;
}

async function redirectIfAlreadyLoggedIn() {
  const token = getStoredAuthToken();
  if (!token) {
    return;
  }
  const response = await fetch("/api/auth/me", {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    clearStoredAuthToken();
    return;
  }
  const data = await response.json();
  const fallbackTarget = defaultTargetForUser(data.user);
  window.location.href = requestedTarget() || data.redirect_to || fallbackTarget;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authStatus.textContent = "Login...";
  try {
    const data = await postJson("/api/auth/login", {
      username: document.getElementById("loginUsername").value,
      password: document.getElementById("loginPassword").value,
    });
    if (data.token) {
      setStoredAuthToken(data.token);
    }
    const fallbackTarget = defaultTargetForUser(data.user);
    window.location.href = requestedTarget() || data.redirect_to || fallbackTarget;
  } catch (error) {
    authStatus.textContent = error.message;
  }
});

redirectIfAlreadyLoggedIn().catch(() => {});
