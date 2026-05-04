const wikiPageList = document.getElementById("wikiPageList");
const wikiSearchInput = document.getElementById("wikiSearchInput");
const wikiTitle = document.getElementById("wikiTitle");
const wikiMeta = document.getElementById("wikiMeta");
const wikiToc = document.getElementById("wikiToc");
const wikiTocLinks = document.getElementById("wikiTocLinks");
const wikiBody = document.getElementById("wikiBody");
const wikiLinks = document.getElementById("wikiLinks");
const wikiBacklinks = document.getElementById("wikiBacklinks");

let wikiPages = [];
let activeWikiSlug = "";
let activeInlineLinks = [];

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "abschnitt";
}

function rewriteWikiTarget(target) {
  if (!target || target.includes("://")) {
    return target;
  }
  if (target.startsWith("/wiki/")) {
    const parts = target.split("#", 2);
    const slug = parts[0].split("/").filter(Boolean).pop();
    return `/wiki/${slugify(slug)}${parts[1] ? `#${slugify(parts[1])}` : ""}`;
  }
  if (target.startsWith("#")) {
    return target;
  }
  const [pathPart, hashPart] = target.split("#", 2);
  if (pathPart.endsWith(".md")) {
    const stem = pathPart.split("/").pop().replace(/\.md$/i, "");
    return `/wiki/${slugify(stem)}${hashPart ? `#${slugify(hashPart)}` : ""}`;
  }
  return target;
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderLinkedText(target, text) {
  const rawText = String(text || "");
  if (!activeInlineLinks.length) {
    target.appendChild(document.createTextNode(rawText));
    return;
  }
  const candidates = activeInlineLinks
    .filter((item) => item.label && item.url)
    .sort((left, right) => right.label.length - left.label.length);
  let remaining = rawText;

  while (remaining) {
    let bestMatch = null;
    for (const candidate of candidates) {
      const match = new RegExp(`(^|[^\\w])(${escapeRegExp(candidate.label)})(?!\\w)`, "i").exec(remaining);
      if (!match) {
        continue;
      }
      const prefixLength = match.index + match[1].length;
      if (!bestMatch || prefixLength < bestMatch.index) {
        bestMatch = {
          index: prefixLength,
          length: match[2].length,
          text: match[2],
          url: candidate.url,
        };
      }
    }

    if (!bestMatch) {
      target.appendChild(document.createTextNode(remaining));
      break;
    }

    if (bestMatch.index > 0) {
      target.appendChild(document.createTextNode(remaining.slice(0, bestMatch.index)));
    }
    const anchor = document.createElement("a");
    anchor.textContent = bestMatch.text;
    anchor.href = bestMatch.url;
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToWiki(bestMatch.url);
    });
    target.appendChild(anchor);
    remaining = remaining.slice(bestMatch.index + bestMatch.length);
  }
}

function appendInlineMarkdown(target, text) {
  const normalized = String(text || "").replace(/\[\[([^\]]+)\]\]/g, (_, label) => `[${label}](/wiki/${slugify(label)})`);
  const parts = normalized.split(/(\[[^\]]+\]\([^)]+\))/g);
  for (const part of parts) {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const anchor = document.createElement("a");
      anchor.textContent = linkMatch[1];
      anchor.href = rewriteWikiTarget(linkMatch[2]);
      if (anchor.href.includes("/wiki/")) {
        anchor.addEventListener("click", (event) => {
          if (!anchor.getAttribute("href").startsWith("/wiki/")) {
            return;
          }
          event.preventDefault();
          navigateToWiki(anchor.getAttribute("href"));
        });
      } else {
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
      }
      target.appendChild(anchor);
      continue;
    }
    renderLinkedText(target, part);
  }
}

function renderToc() {
  const headings = Array.from(wikiBody.querySelectorAll("h2, h3, h4"));
  wikiTocLinks.innerHTML = "";
  if (!headings.length) {
    wikiToc.classList.add("hidden");
    return;
  }
  for (const heading of headings) {
    const link = document.createElement("a");
    link.className = `wiki-toc-link level-${heading.tagName.toLowerCase()}`;
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent || "";
    link.addEventListener("click", (event) => {
      event.preventDefault();
      heading.scrollIntoView({ block: "start", behavior: "smooth" });
      history.replaceState({}, "", `${window.location.pathname}#${heading.id}`);
    });
    wikiTocLinks.appendChild(link);
  }
  wikiToc.classList.remove("hidden");
}

function createMarkdownFragment(content) {
  const fragment = document.createDocumentFragment();
  const lines = String(content || "").split("\n");
  let listElement = null;
  let paragraphLines = [];
  let tableRows = [];

  function flushParagraph() {
    if (!paragraphLines.length) {
      return;
    }
    const paragraph = document.createElement("p");
    appendInlineMarkdown(paragraph, paragraphLines.join(" "));
    fragment.appendChild(paragraph);
    paragraphLines = [];
  }

  function flushList() {
    if (!listElement) {
      return;
    }
    fragment.appendChild(listElement);
    listElement = null;
  }

  function flushTable() {
    if (!tableRows.length) {
      return;
    }
    const table = document.createElement("table");
    table.className = "db-table wiki-table";
    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");
    for (const cell of tableRows[0]) {
      const th = document.createElement("th");
      appendInlineMarkdown(th, cell);
      headerRow.appendChild(th);
    }
    header.appendChild(headerRow);
    table.appendChild(header);
    if (tableRows.length > 1) {
      const body = document.createElement("tbody");
      for (const row of tableRows.slice(1)) {
        const tr = document.createElement("tr");
        for (const cell of row) {
          const td = document.createElement("td");
          appendInlineMarkdown(td, cell);
          tr.appendChild(td);
        }
        body.appendChild(tr);
      }
      table.appendChild(body);
    }
    fragment.appendChild(table);
    tableRows = [];
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) {
      flushParagraph();
      flushList();
      flushTable();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushTable();
      const level = Math.min(6, headingMatch[1].length + 1);
      const heading = document.createElement(`h${level}`);
      heading.id = slugify(headingMatch[2]);
      appendInlineMarkdown(heading, headingMatch[2]);
      fragment.appendChild(heading);
      continue;
    }

    if (line.includes("|") && index + 1 < lines.length && /^[:|\-\s]+$/.test(lines[index + 1].trim())) {
      flushParagraph();
      flushList();
      tableRows.push(line.split("|").map((cell) => cell.trim()).filter((cell, cellIndex, cells) => !(cell === "" && (cellIndex === 0 || cellIndex === cells.length - 1))));
      index += 1;
      while (index + 1 < lines.length && lines[index + 1].trim().includes("|")) {
        index += 1;
        tableRows.push(lines[index].split("|").map((cell) => cell.trim()).filter((cell, cellIndex, cells) => !(cell === "" && (cellIndex === 0 || cellIndex === cells.length - 1))));
      }
      flushTable();
      continue;
    }

    const listMatch = line.match(/^([-*]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      flushTable();
      if (!listElement) {
        listElement = document.createElement(listMatch[1].endsWith(".") ? "ol" : "ul");
      }
      const li = document.createElement("li");
      appendInlineMarkdown(li, listMatch[2]);
      listElement.appendChild(li);
      continue;
    }

    flushList();
    flushTable();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  flushTable();
  return fragment;
}

function renderRelationList(target, items, emptyLabel) {
  target.innerHTML = "";
  if (!items.length) {
    target.innerHTML = `<div class="file-meta">${emptyLabel}</div>`;
    return;
  }
  for (const item of items) {
    const link = document.createElement("a");
    link.className = "chat-list-item wiki-related-link";
    link.href = item.url;
    link.textContent = item.title;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToWiki(item.url);
    });
    target.appendChild(link);
  }
}

function renderWikiPageList() {
  const filter = wikiSearchInput.value.trim().toLowerCase();
  const filtered = wikiPages.filter((page) => !filter || page.title.toLowerCase().includes(filter));
  wikiPageList.innerHTML = "";
  for (const page of filtered) {
    const button = document.createElement("a");
    button.className = `chat-list-item${page.slug === activeWikiSlug ? " active" : ""}`;
    button.href = page.url;
    button.textContent = page.title;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToWiki(page.url);
    });
    wikiPageList.appendChild(button);
  }
}

async function loadWikiPages() {
  const response = await fetch("/api/wiki/pages", { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Wiki-Seiten konnten nicht geladen werden.");
  }
  wikiPages = data.pages || [];
  renderWikiPageList();
  return wikiPages;
}

async function loadWikiPage(slug) {
  const response = await fetch(`/api/wiki/pages/${encodeURIComponent(slug)}`, { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Wiki-Seite konnte nicht geladen werden.");
  }
  activeWikiSlug = data.slug;
  activeInlineLinks = (data.links || []).map((item) => ({
    label: item.label || item.title,
    url: item.url,
  }));
  history.replaceState({}, "", data.url);
  wikiTitle.textContent = data.title;
  wikiMeta.textContent = new Date(data.updated_at).toLocaleString("de-DE");
  wikiBody.innerHTML = "";
  wikiBody.appendChild(createMarkdownFragment(data.markdown_content));
  renderToc();
  renderRelationList(wikiLinks, data.links || [], "Keine verlinkten Seiten.");
  renderRelationList(wikiBacklinks, data.backlinks || [], "Keine Rueckverweise.");
  renderWikiPageList();
}

function currentWikiSlug() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts[0] === "wiki" && parts[1]) {
    return decodeURIComponent(parts[1]);
  }
  return "";
}

async function navigateToWiki(url) {
  const nextUrl = new URL(url, window.location.origin);
  const parts = nextUrl.pathname.split("/").filter(Boolean);
  const slug = parts[0] === "wiki" ? (parts[1] || "") : "";
  if (!slug) {
    return;
  }
  await loadWikiPage(slug);
  if (nextUrl.hash) {
    const target = document.getElementById(nextUrl.hash.slice(1));
    if (target) {
      target.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }
}

wikiSearchInput.addEventListener("input", () => {
  renderWikiPageList();
});

initializeAuthUi({ required: true })
  .then(() => loadWikiPages())
  .then((pages) => {
    const slug = currentWikiSlug() || (pages[0] ? pages[0].slug : "");
    if (!slug) {
      wikiTitle.textContent = "Keine Wiki-Seiten vorhanden";
      wikiMeta.textContent = "Leer";
      wikiToc.classList.add("hidden");
      wikiBody.innerHTML = `<p>Importiere Markdown-Dateien, um Wiki-Seiten zu erzeugen.</p>`;
      renderRelationList(wikiLinks, [], "Keine verlinkten Seiten.");
      renderRelationList(wikiBacklinks, [], "Keine Rueckverweise.");
      return;
    }
    return loadWikiPage(slug);
  })
  .catch((error) => {
    wikiTitle.textContent = "Wiki nicht verfuegbar";
    wikiMeta.textContent = "Fehler";
    wikiToc.classList.add("hidden");
    wikiBody.innerHTML = `<p>${error.message}</p>`;
  });
