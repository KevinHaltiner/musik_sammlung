document.addEventListener("DOMContentLoaded", () => {

let albums = [];
let merged = [];
let currentType = "alle";
let currentSort = "Plattenname";

// DOM
const collectionDiv   = document.getElementById("collection");
const searchInput     = document.getElementById("searchInput");
const autocompleteDiv = document.getElementById("autocomplete");
const clearSearch     = document.getElementById("clearSearch");
const sheetBackdrop   = document.getElementById("sheet-backdrop");
const albumSheet      = document.getElementById("album-sheet");
const sortSheet       = document.getElementById("sort-sheet");
const sortToggle      = document.getElementById("sort-toggle");

const TYPE_LABELS = { Platte: "Vinyl", CD: "CD", Single: "Single", Kassette: "Kassette" };
const TYPE_ORDER  = ["Platte", "CD", "Single", "Kassette"];

// ===============================
// DATEN LADEN + MERGEN
// ===============================
async function ladeDaten() {
  try {
    const [plattenRes, single12Res, single7Res, cdsRes, kassettenRes] =
      await Promise.all([
        fetch("./data/json/platten12.json"),
        fetch("./data/json/single12.json"),
        fetch("./data/json/single7.json"),
        fetch("./data/json/cds.json"),
        fetch("./data/json/kassetten.json")
      ]);

    if (!plattenRes.ok || !single12Res.ok || !single7Res.ok || !cdsRes.ok || !kassettenRes.ok)
      throw new Error("JSON konnte nicht geladen werden");

    const platten   = (await plattenRes.json()  ).map(a => ({ ...a, Kategorie: "Platte"   }));
    const single12  = (await single12Res.json() ).map(a => ({ ...a, Kategorie: "Single"   }));
    const single7   = (await single7Res.json()  ).map(a => ({ ...a, Kategorie: "Single"   }));
    const cds       = (await cdsRes.json()      ).map(a => ({ ...a, Kategorie: "CD"        }));
    const kassetten = (await kassettenRes.json()).map(a => ({ ...a, Kategorie: "Kassette"  }));

    albums = [...platten, ...single12, ...single7, ...cds, ...kassetten];
    merged = mergeAlbums(albums);
    applyFilter();

  } catch (err) {
    console.error("Fehler beim Laden:", err);
    collectionDiv.innerHTML = `<div class="error">Fehler beim Laden der Musikdaten.</div>`;
  }
}

// ===============================
// MERGE
// ===============================
function mergeKey(a) {
  return (a.Plattenname + "|||" + (a.Künstler || "")).toLowerCase().trim();
}

function mergeAlbums(list) {
  const map = new Map();
  list.forEach(a => {
    const key = mergeKey(a);
    if (!map.has(key)) {
      map.set(key, { ...a, Kategorien: [a.Kategorie], Versionen: [a] });
    } else {
      const ex = map.get(key);
      if (!ex.Kategorien.includes(a.Kategorie)) ex.Kategorien.push(a.Kategorie);
      ex.Versionen.push(a);
    }
  });
  return Array.from(map.values());
}

// ===============================
// TABS MIT ZÄHLUNG
// ===============================
function updateTabCounts(rawFiltered) {
  const mergedFiltered = mergeAlbums(rawFiltered);
  const counts = {
    alle:     mergedFiltered.length,
    Platte:   rawFiltered.filter(a => a.Kategorie === "Platte"  ).length,
    CD:       rawFiltered.filter(a => a.Kategorie === "CD"      ).length,
    Single:   rawFiltered.filter(a => a.Kategorie === "Single"  ).length,
    Kassette: rawFiltered.filter(a => a.Kategorie === "Kassette").length
  };
  document.querySelectorAll(".tab").forEach(tab => {
    const countEl = tab.querySelector(".tab-count");
    if (countEl && counts[tab.dataset.type] !== undefined)
      countEl.textContent = counts[tab.dataset.type];
  });
}

// ===============================
// TRACKLISTE NORMALISIEREN
// ===============================
function getPages(album) {
  if (album.Sides && typeof album.Sides === "object")
    return Object.entries(album.Sides).map(([label, tracks]) => ({ label, tracks }));
  if (Array.isArray(album.Trackliste))
    return [{ label: null, tracks: album.Trackliste }];
  if (album.Trackliste && typeof album.Trackliste === "object")
    return Object.entries(album.Trackliste).map(([label, tracks]) => ({ label, tracks }));
  return [];
}

function cleanTrack(t) { return t.replace(/^•\s*/, ""); }

// ===============================
// ALBUM DETAIL SHEET
// ===============================
let activeAlbum     = null;
let activeVersion   = 0;
let activePageIndex = 0;

function openAlbumSheet(album) {
  activeAlbum     = album;
  activeVersion   = 0;
  activePageIndex = 0;
  renderSheetHeader();
  renderFormatTabs();
  renderSidePicker();
  renderTrackPage();
  sheetBackdrop.classList.add("open");
  albumSheet.classList.add("open");
  document.body.style.overflow = "hidden";
}

function renderSheetHeader() {
  const v = activeAlbum.Versionen[activeVersion];
  document.getElementById("sheet-cover").src            = v.CoverBild;
  document.getElementById("sheet-cover").alt            = v.Plattenname;
  document.getElementById("sheet-title").textContent    = v.Plattenname;
  document.getElementById("sheet-artist").textContent   = v.Künstler || "–";
  document.getElementById("sheet-meta").textContent     = `${v.Groesse} · ${v.Erscheinungsjahr}`;
  const tagsDiv = document.getElementById("sheet-tags");
  tagsDiv.innerHTML = "";
  [v.Country, v.Genre, v.Speed && v.Speed !== "n/a" ? v.Speed : null]
    .filter(Boolean)
    .forEach(val => {
      const tag = document.createElement("span");
      tag.className   = "sheet-tag";
      tag.textContent = val;
      tagsDiv.appendChild(tag);
    });
}

function renderFormatTabs() {
  const wrap = document.getElementById("format-tabs-wrap");
  const tabs = document.getElementById("format-tabs");
  tabs.innerHTML = "";
  if (activeAlbum.Versionen.length <= 1) { wrap.style.display = "none"; return; }
  wrap.style.display = "block";
  activeAlbum.Versionen.forEach((v, i) => {
    const btn = document.createElement("div");
    btn.className   = "side-tab" + (i === activeVersion ? " active" : "");
    btn.textContent = TYPE_LABELS[v.Kategorie] || v.Kategorie;
    btn.addEventListener("click", () => {
      activeVersion = i; activePageIndex = 0;
      renderSheetHeader(); renderFormatTabs(); renderSidePicker(); renderTrackPage();
    });
    tabs.appendChild(btn);
  });
}

function renderSidePicker() {
  const v      = activeAlbum.Versionen[activeVersion];
  const pages  = getPages(v);
  const wrap   = document.getElementById("side-tabs-wrap");
  const picker = document.getElementById("side-tabs");
  picker.innerHTML = "";
  if (pages.length <= 1) { wrap.style.display = "none"; return; }
  wrap.style.display = "block";
  pages.forEach((page, i) => {
    const btn = document.createElement("div");
    btn.className   = "side-tab" + (i === activePageIndex ? " active" : "");
    btn.textContent = page.label || `Teil ${i + 1}`;
    btn.addEventListener("click", () => {
      activePageIndex = i; renderSidePicker(); renderTrackPage();
    });
    picker.appendChild(btn);
  });
}

function renderTrackPage() {
  const v    = activeAlbum.Versionen[activeVersion];
  const pages = getPages(v);
  const page  = pages[activePageIndex];
  const list  = document.getElementById("track-list");
  list.innerHTML = "";
  if (!page || !page.tracks || page.tracks.length === 0) {
    list.innerHTML = `<li style="color:var(--text-faint);border-bottom:none;">Keine Trackliste vorhanden.</li>`;
    return;
  }
  page.tracks.forEach((track, i) => {
    const li  = document.createElement("li");
    const num = document.createElement("span");
    num.className   = "track-num";
    num.textContent = (i + 1) + ".";
    const txt = document.createElement("span");
    txt.textContent = cleanTrack(track);
    li.appendChild(num);
    li.appendChild(txt);
    list.appendChild(li);
  });
}

function closeAlbumSheet() {
  sheetBackdrop.classList.remove("open");
  albumSheet.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("sheet-close").addEventListener("click", closeAlbumSheet);
sheetBackdrop.addEventListener("click", () => { closeAlbumSheet(); closeSortSheet(); });

// ===============================
// SORT SHEET
// ===============================
function openSortSheet() {
  sheetBackdrop.classList.add("open");
  sortSheet.classList.add("open");
  document.body.style.overflow = "hidden";
  document.querySelectorAll(".sort-option").forEach(opt =>
    opt.classList.toggle("active", opt.dataset.sort === currentSort));
}

function closeSortSheet() {
  sortSheet.classList.remove("open");
  if (!albumSheet.classList.contains("open")) {
    sheetBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
}

sortToggle.addEventListener("click", openSortSheet);
document.getElementById("sort-sheet-close").addEventListener("click", closeSortSheet);
document.querySelectorAll(".sort-option").forEach(opt =>
  opt.addEventListener("click", () => {
    currentSort = opt.dataset.sort;
    closeSortSheet();
    applyFilter();
  }));

// ===============================
// KARTEN RENDERN
// ===============================
function formatBadgesHTML(album) {
  const kategorien = album.Kategorien
    ? [...album.Kategorien].sort((a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b))
    : [album.Kategorie];
  return kategorien
    .map(k => `<span class="badge badge-${k}">${TYPE_LABELS[k] || k}</span>`)
    .join("");
}

function displayAlbums(list) {
  collectionDiv.innerHTML = "";
  if (list.length === 0) {
    collectionDiv.innerHTML = `
      <div class="empty-state"><div class="icon">♪</div><p>Keine Treffer gefunden.</p></div>`;
    return;
  }

  const sortedList = [...list];
  if      (currentSort === "Plattenname")    sortedList.sort((a, b) => a.Plattenname.localeCompare(b.Plattenname, "de"));
  else if (currentSort === "Künstler")       sortedList.sort((a, b) => (a.Künstler||"").localeCompare(b.Künstler||"", "de") || a.Erscheinungsjahr - b.Erscheinungsjahr);
  else if (currentSort === "Erscheinungsjahr") sortedList.sort((a, b) => a.Erscheinungsjahr - b.Erscheinungsjahr);

  const grouped = {};
  sortedList.forEach(a => {
    let key;
    if      (currentSort === "Plattenname")     key = (a.Plattenname[0] || "#").toUpperCase();
    else if (currentSort === "Künstler")        key = a.Künstler || "–";
    else                                        key = a.Erscheinungsjahr;
    grouped[key] = grouped[key] || [];
    grouped[key].push(a);
  });

  const gridDiv = document.createElement("div");
  gridDiv.className = "album-grid";

  for (const block in grouped) {
    const blockTitle = document.createElement("div");
    blockTitle.className   = "block-title";
    blockTitle.textContent = block;
    gridDiv.appendChild(blockTitle);

    grouped[block].forEach(album => {
      const card      = document.createElement("div");
      card.className  = "album-card";

      const coverWrap = document.createElement("div");
      coverWrap.className = "album-cover-wrap";

      const cover     = document.createElement("img");
      cover.src       = album.CoverBild;
      cover.alt       = album.Plattenname;
      cover.loading   = "lazy";

      const badgeWrap = document.createElement("div");
      badgeWrap.className = "album-badges";
      badgeWrap.innerHTML = formatBadgesHTML(album);

      coverWrap.appendChild(cover);
      coverWrap.appendChild(badgeWrap);

      const info      = document.createElement("div");
      info.className  = "album-info";
      info.innerHTML  = `
        <p class="title">${album.Plattenname}</p>
        <p class="artist">${album.Künstler || "–"}</p>
        <p class="size-year">${album.Groesse} · ${album.Erscheinungsjahr}</p>`;

      card.appendChild(coverWrap);
      card.appendChild(info);
      card.addEventListener("click", () => openAlbumSheet(album));
      gridDiv.appendChild(card);
    });
  }

  collectionDiv.appendChild(gridDiv);
}

// ===============================
// FILTER + SUCHE
// ===============================
function applyFilter() {
  const query = searchInput.value.toLowerCase().trim();

  const rawFiltered = albums.filter(a =>
    (a.Plattenname?.toLowerCase().includes(query)) ||
    (a.Künstler   ?.toLowerCase().includes(query)) ||
    (a.Genre      ?.toLowerCase().includes(query))
  );

  updateTabCounts(rawFiltered);

  let display;
  if (currentType === "alle") {
    display = mergeAlbums(rawFiltered);
  } else {
    display = rawFiltered
      .filter(a => a.Kategorie === currentType)
      .map(a => ({ ...a, Kategorien: [a.Kategorie], Versionen: [a] }));
  }

  displayAlbums(display);
}

// ===============================
// TABS
// ===============================
document.querySelectorAll(".tab").forEach(tab =>
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentType = tab.dataset.type;
    applyFilter();
  }));

// ===============================
// AUTOCOMPLETE
// ===============================
searchInput.addEventListener("input", () => {
  applyFilter();
  autocompleteDiv.innerHTML = "";
  clearSearch.classList.toggle("visible", searchInput.value.length > 0);

  const query = searchInput.value.toLowerCase();
  if (!query) return;

  const seen = new Set();
  albums
    .filter(a =>
      a.Plattenname?.toLowerCase().includes(query) ||
      a.Künstler   ?.toLowerCase().includes(query))
    .filter(a => { const k = mergeKey(a); if (seen.has(k)) return false; seen.add(k); return true; })
    .slice(0, 5)
    .forEach(a => {
      const item      = document.createElement("div");
      item.className  = "autocomplete-item";
      item.textContent = `${a.Plattenname} – ${a.Künstler || "–"}`;
      item.onclick = () => {
        searchInput.value = a.Plattenname;
        autocompleteDiv.innerHTML = "";
        clearSearch.classList.add("visible");
        applyFilter();
      };
      autocompleteDiv.appendChild(item);
    });
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  autocompleteDiv.innerHTML = "";
  clearSearch.classList.remove("visible");
  applyFilter();
});

document.addEventListener("click", e => {
  if (!e.target.closest("#search-container")) autocompleteDiv.innerHTML = "";
});

// ===============================
// URL PARAMETER
// ===============================
const params = new URLSearchParams(window.location.search);
if (params.has("artist")) { searchInput.value = params.get("artist"); clearSearch.classList.add("visible"); }
if (params.has("genre"))  { searchInput.value = params.get("genre");  clearSearch.classList.add("visible"); }

// Daten laden (nach allem Setup)
ladeDaten();

}); // Ende DOMContentLoaded
