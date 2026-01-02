let albums = [];
let currentlyOpen = null;
let currentType = "alle";

// DOM
const collectionDiv = document.getElementById("collection");
const searchInput = document.getElementById("searchInput");
const autocompleteDiv = document.getElementById("autocomplete");
const clearSearch = document.getElementById("clearSearch");
const sortSelect = document.getElementById("sortSelect");

// ===============================
// DATEN LADEN
// ===============================
async function ladeDaten() {
  try {
    const [plattenRes, single12Res, single7Res, cdsRes] = await Promise.all([
      fetch("data/platten12.json"),
      fetch("data/single12.json"),
      fetch("data/single7.json"),
      fetch("data/cds.json")
    ]);

    if (!plattenRes.ok || !single12Res.ok || !single7Res.ok || !cdsRes.ok) {
      throw new Error("JSON konnte nicht geladen werden");
    }

    const platten = (await plattenRes.json()).map(a => ({
      ...a,
      Kategorie: "Platte"
    }));

    const single12 = (await single12Res.json()).map(a => ({
      ...a,
      Kategorie: "Single"
    }));

    const single7 = (await single7Res.json()).map(a => ({
      ...a,
      Kategorie: "Single"
    }));

    const cds = (await cdsRes.json()).map(a => ({
      ...a,
      Kategorie: "CD"
    }));

    albums = [...platten, ...single12, ...single7, ...cds];
    applyFilter();
  } catch (err) {
    console.error("Fehler beim Laden:", err);
  }
}

ladeDaten();

// ===============================
// COUNTER
// ===============================
function updateCounter(list) {
  document.getElementById("count-alle").textContent = list.length;

  document.getElementById("count-platten").textContent =
    list.filter(a => a.Kategorie === "Platte").length;

  document.getElementById("count-cds").textContent =
    list.filter(a => a.Kategorie === "CD").length;

  document.getElementById("count-singles").textContent =
    list.filter(a => a.Kategorie === "Single").length;
}

// ===============================
// TRACKLISTE
// ===============================
function renderTracklist(album) {
  const trackDiv = document.createElement("div");
  trackDiv.className = "tracklist";

  // Platte mit Sides
  if (album.Typ === "Platte" && album.Sides) {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.gap = "20px";

    for (const [side, tracks] of Object.entries(album.Sides)) {
      const col = document.createElement("div");
      col.innerHTML = `<strong>${side}</strong><br>${tracks.join("<br>")}`;
      container.appendChild(col);
    }

    trackDiv.appendChild(container);
    return trackDiv;
  }

  // CD – eine Disc
  if (Array.isArray(album.Trackliste)) {
    trackDiv.innerHTML =
      `<strong>Trackliste:</strong><br>` +
      album.Trackliste.join("<br>");
    return trackDiv;
  }

  // CD – mehrere Discs
  if (album.Trackliste && typeof album.Trackliste === "object") {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.gap = "20px";

    for (const [disk, tracks] of Object.entries(album.Trackliste)) {
      const col = document.createElement("div");
      col.innerHTML = `<strong>${disk}</strong><br>${tracks.join("<br>")}`;
      container.appendChild(col);
    }

    trackDiv.appendChild(container);
  }

  return trackDiv;
}

// ===============================
// ALBEN ANZEIGEN
// ===============================
function displayAlbums(list) {
  collectionDiv.innerHTML = "";

  const sortField = sortSelect.value;
  let grouped = {};

  if (sortField === "Plattenname") {
    list.sort((a, b) => a.Plattenname.localeCompare(b.Plattenname));
    list.forEach(a => {
      const key = a.Plattenname[0].toUpperCase();
      grouped[key] = grouped[key] || [];
      grouped[key].push(a);
    });
  }

  if (sortField === "Künstler") {
    list.sort((a, b) =>
      a.Künstler.localeCompare(b.Künstler) ||
      a.Erscheinungsjahr - b.Erscheinungsjahr
    );
    list.forEach(a => {
      grouped[a.Künstler] = grouped[a.Künstler] || [];
      grouped[a.Künstler].push(a);
    });
  }

  if (sortField === "Erscheinungsjahr") {
    list.sort((a, b) => a.Erscheinungsjahr - b.Erscheinungsjahr);
    list.forEach(a => {
      grouped[a.Erscheinungsjahr] = grouped[a.Erscheinungsjahr] || [];
      grouped[a.Erscheinungsjahr].push(a);
    });
  }

  for (const block in grouped) {
    const blockDiv = document.createElement("div");
    blockDiv.className = "album-block";

    const blockTitle = document.createElement("div");
    blockTitle.className = "block-title";
    blockTitle.textContent = block;
    blockDiv.appendChild(blockTitle);

    grouped[block].forEach(album => {
      const card = document.createElement("div");
      card.className = "album-card";

      const header = document.createElement("div");
      header.className = "album-header";

      const cover = document.createElement("img");
      cover.src = album.CoverBild;
      cover.alt = album.Plattenname;

      const info = document.createElement("div");
      info.className = "album-info";
      info.innerHTML = `
        <p class="title">${album.Plattenname}</p>
        <p class="size-year">${album.Groesse}, ${album.Erscheinungsjahr}</p>
        <p class="artist">${album.Künstler}</p>
      `;

      header.appendChild(cover);
      header.appendChild(info);
      card.appendChild(header);

      const details = document.createElement("div");
      details.className = "details";

      const left = document.createElement("div");
      left.className = "detail-left";
      left.innerHTML = `
        <p><strong>Country:</strong> ${album.Country}</p>
        <p><strong>Genre:</strong> ${album.Genre}</p>
        <p><strong>Speed:</strong> ${album.Speed}</p>
      `;

      details.appendChild(left);
      details.appendChild(renderTracklist(album));
      card.appendChild(details);

      header.addEventListener("click", () => {
        if (currentlyOpen && currentlyOpen !== details) {
          currentlyOpen.classList.remove("open");
        }
        details.classList.toggle("open");
        currentlyOpen = details.classList.contains("open") ? details : null;
      });

      blockDiv.appendChild(card);
    });

    collectionDiv.appendChild(blockDiv);
  }
}

// ===============================
// FILTER + SUCHE
// ===============================
function applyFilter() {
  const query = searchInput.value.toLowerCase();

  let filtered = albums.filter(a =>
    a.Plattenname.toLowerCase().includes(query) ||
    a.Künstler.toLowerCase().includes(query) ||
    (a.Genre && a.Genre.toLowerCase().includes(query))
  );

  if (currentType !== "alle") {
    filtered = filtered.filter(a => a.Kategorie === currentType);
  }

  displayAlbums(filtered);
  updateCounter(filtered);
}

// ===============================
// TABS
// ===============================
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentType = tab.dataset.type;
    applyFilter();
  });
});

// ===============================
// AUTOCOMPLETE
// ===============================
searchInput.addEventListener("input", () => {
  applyFilter();
  autocompleteDiv.innerHTML = "";

  const query = searchInput.value.toLowerCase();
  if (!query) return;

  albums
    .filter(a =>
      a.Plattenname.toLowerCase().includes(query) ||
      a.Künstler.toLowerCase().includes(query)
    )
    .slice(0, 5)
    .forEach(a => {
      const item = document.createElement("div");
      item.className = "autocomplete-item";
      item.textContent = `${a.Plattenname} – ${a.Künstler}`;
      item.onclick = () => {
        searchInput.value = a.Plattenname;
        autocompleteDiv.innerHTML = "";
        applyFilter();
      };
      autocompleteDiv.appendChild(item);
    });
});

// CLEAR
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  autocompleteDiv.innerHTML = "";
  applyFilter();
});

// SORT
sortSelect.addEventListener("change", applyFilter);

// ===============================
// URL-PARAMETER (Künstler / Genre)
// ===============================
const params = new URLSearchParams(window.location.search);

if (params.has("artist")) {
  searchInput.value = params.get("artist");
  applyFilter();
}

if (params.has("genre")) {
  searchInput.value = params.get("genre");
  applyFilter();
}

// ===============================
// MOBILE NAV DROPDOWN
// ===============================
const mobileNav = document.getElementById("mobile-nav");

if (mobileNav) {

  // Initialzustand
  mobileNav.value = "alle";

  mobileNav.addEventListener("change", e => {
    const value = e.target.value;

    // Seitenwechsel
    if (value.endsWith(".html")) {
      window.location.href = value;
      return;
    }

    // Filter setzen
    currentType = value;

    // Tabs synchronisieren
    document.querySelectorAll(".tab").forEach(tab => {
      tab.classList.toggle("active", tab.dataset.type === value);
    });

    applyFilter();
  });
}
