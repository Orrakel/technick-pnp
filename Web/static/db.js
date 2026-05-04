const tableList = document.getElementById("tableList");
const sqlInput = document.getElementById("sqlInput");
const runQueryButton = document.getElementById("runQueryButton");
const refreshTablesButton = document.getElementById("refreshTablesButton");
const dbResults = document.getElementById("dbResults");
const dbStatusBadge = document.getElementById("dbStatusBadge");
const userAdminList = document.getElementById("userAdminList");
const userCreateForm = document.getElementById("userCreateForm");
const userCreateUsername = document.getElementById("userCreateUsername");
const userCreatePassword = document.getElementById("userCreatePassword");
const userCreatePasswordConfirm = document.getElementById("userCreatePasswordConfirm");
const userCreateRole = document.getElementById("userCreateRole");

function setDbStatus(text) {
  dbStatusBadge.textContent = text;
}

function escapeCell(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

function renderResults(data) {
  if (!data.columns.length) {
    dbResults.innerHTML = `<div class="empty-state">Die Abfrage hat keine Ergebnisdaten geliefert.</div>`;
    return;
  }

  const table = document.createElement("table");
  table.className = "db-table";

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  for (const column of data.columns) {
    const th = document.createElement("th");
    th.textContent = column;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const row of data.rows) {
    const tr = document.createElement("tr");
    for (const cell of row) {
      const td = document.createElement("td");
      td.textContent = escapeCell(cell);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  dbResults.innerHTML = "";
  dbResults.appendChild(table);
}

async function runQuery(query) {
  setDbStatus("Abfrage laeuft...");
  const response = await fetch("/api/db/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "SQL-Abfrage fehlgeschlagen.");
  }
  renderResults(data);
  setDbStatus(`${data.row_count} Zeilen`);
}

async function loadTables() {
  const response = await fetch("/api/db/tables");
  const data = await response.json();
  tableList.innerHTML = "";

  for (const tableName of data.tables) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "table-button";
    button.textContent = tableName;
    button.addEventListener("click", () => {
      sqlInput.value = `SELECT * FROM ${tableName}`;
      runQuery(sqlInput.value).catch((error) => {
        setDbStatus(error.message);
      });
    });
    tableList.appendChild(button);
  }
}

function renderUsers(users) {
  userAdminList.innerHTML = "";

  for (const user of users) {
    const card = document.createElement("div");
    card.className = "user-admin-card";

    const name = document.createElement("div");
    name.className = "file-name";
    name.textContent = user.username;

    const meta = document.createElement("div");
    meta.className = "file-meta";
    meta.textContent = `Rolle: ${user.role}`;

    const select = document.createElement("select");
    select.className = "sidebar-input role-select";
    for (const role of ["spieler", "spielleiter", "admin"]) {
      const option = document.createElement("option");
      option.value = role;
      option.textContent = role;
      if (role === user.role) {
        option.selected = true;
      }
      select.appendChild(option);
    }

    select.addEventListener("change", async () => {
      try {
        await updateUserRole(user.id, select.value);
        setDbStatus(`Rolle aktualisiert: ${user.username}`);
      } catch (error) {
        setDbStatus(error.message);
        select.value = user.role;
      }
    });

    card.append(name, meta, select);
    userAdminList.appendChild(card);
  }
}

async function loadUsers() {
  const response = await fetch("/api/users", { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Benutzer konnten nicht geladen werden.");
  }
  renderUsers(data.users || []);
}

async function loadAuthContext() {
  const response = await fetch("/api/auth/me", { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Auth-Status konnte nicht geladen werden.");
  }
  userCreateForm?.classList.toggle("hidden", data.user?.role !== "admin");
  return data;
}

async function createUser() {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: userCreateUsername.value,
      password: userCreatePassword.value,
      password_confirm: userCreatePasswordConfirm.value,
      role: userCreateRole.value,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Account konnte nicht angelegt werden.");
  }
  userCreateForm.reset();
  await loadUsers();
  setDbStatus(`Account angelegt: ${data.user.username}`);
}

async function updateUserRole(userId, role) {
  const response = await fetch(`/api/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Rolle konnte nicht aktualisiert werden.");
  }
  await loadUsers();
}

runQueryButton.addEventListener("click", () => {
  runQuery(sqlInput.value).catch((error) => {
    setDbStatus(error.message);
  });
});

refreshTablesButton.addEventListener("click", () => {
  loadTables().catch((error) => {
    setDbStatus(error.message);
  });
});

userCreateForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setDbStatus("Account wird angelegt...");
  try {
    await createUser();
  } catch (error) {
    setDbStatus(error.message);
  }
});

initializeAuthUi({ required: false })
  .then(() => loadAuthContext())
  .then(() => loadTables())
  .then(() => loadUsers())
  .then(() => runQuery(sqlInput.value))
  .catch((error) => {
    setDbStatus(error.message);
  });
