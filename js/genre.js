const container = document.getElementById("genreList");

async function ladeGenres() {
  const files = [
    "data/platten12.json",
    "data/single12.json",
    "data/single7.json",
    "data/cds.json"
  ];

  const responses = await Promise.all(files.map(f => fetch(f)));
  const data = await Promise.all(responses.map(r => r.json()));

  const genres = new Set();

  data.flat().forEach(a => {
    if (!a.Genre) return;

    a.Genre.split(",").forEach(g => {
      genres.add(g.trim());
    });
  });

  renderAlphabetisch([...genres].sort());
}

function renderAlphabetisch(list) {
  const grouped = {};

  list.forEach(name => {
    const letter = name[0].toUpperCase();
    grouped[letter] = grouped[letter] || [];
    grouped[letter].push(name);
  });

  Object.keys(grouped).sort().forEach(letter => {
    const title = document.createElement("div");
    title.className = "letter-title";
    title.textContent = letter;
    container.appendChild(title);

    grouped[letter].forEach(name => {
      const item = document.createElement("div");
      item.className = "list-item";
      item.textContent = name;
      item.onclick = () => {
        window.location.href = `index.html?genre=${encodeURIComponent(name)}`;
      };
      container.appendChild(item);
    });
  });
}



ladeGenres();
