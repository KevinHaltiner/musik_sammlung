const container = document.getElementById("artistList");

async function ladeKuenstler() {
  const files = [
    "data/platten12.json",
    "data/single12.json",
    "data/single7.json",
    "data/cds.json"
  ];

  const responses = await Promise.all(files.map(f => fetch(f)));
  const data = await Promise.all(responses.map(r => r.json()));

  const artists = new Set();

  data.flat().forEach(a => {
    if (!a.Künstler) return;
    const name = a.Künstler.trim();
      if (name === "-" || name === "") return; 
    artists.add(name);
  });

  renderAlphabetisch([...artists].sort());
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
        window.location.href = `index.html?artist=${encodeURIComponent(name)}`;
      };
      container.appendChild(item);
    });
  });
}


ladeKuenstler();
