async function ladeDaten() {
  try {
    const [plattenRes, cdsRes] = await Promise.all([
      fetch("data/platten12.json"),
      fetch("data/cds.json")
    ]);

    if (!plattenRes.ok || !cdsRes.ok) {
      throw new Error("JSON konnte nicht geladen werden");
    }

    const platten = await plattenRes.json();
    const cds = await cdsRes.json();

    albums = [...platten, ...cds];

    applyFilter(); // 🔴 WICHTIG: erst JETZT anzeigen
  } catch (err) {
    console.error("Fehler beim Laden:", err);
  }
}


ladeDaten();


let currentlyOpen = null;
let currentType = "alle";

const collectionDiv = document.getElementById('collection');
const searchInput = document.getElementById('searchInput');
const autocompleteDiv = document.getElementById('autocomplete');
const clearSearch = document.getElementById('clearSearch');
const sortSelect = document.getElementById('sortSelect');

// Anzeige Funktion mit Blöcken
function displayAlbums(list){
    collectionDiv.innerHTML = '';
    const sortField = sortSelect.value;
    let grouped = {};

    // Sortierung und Gruppierung
    if(sortField === 'Plattenname'){
        list.sort((a,b)=>a.Plattenname.localeCompare(b.Plattenname));
        list.forEach(a=>{
            const key = a.Plattenname[0].toUpperCase();
            if(!grouped[key]) grouped[key]=[];
            grouped[key].push(a);
        });
    } else if(sortField==='Künstler'){
        list.sort((a,b)=>{
            if(a.Künstler!==b.Künstler) return a.Künstler.localeCompare(b.Künstler);
            return a.Erscheinungsjahr-b.Erscheinungsjahr;
        });
        list.forEach(a=>{
            if(!grouped[a.Künstler]) grouped[a.Künstler]=[];
            grouped[a.Künstler].push(a);
        });
    } else if(sortField==='Erscheinungsjahr'){
        list.sort((a,b)=>{
            if(a.Erscheinungsjahr!==b.Erscheinungsjahr) return a.Erscheinungsjahr-b.Erscheinungsjahr;
            return a.Plattenname.localeCompare(b.Plattenname);
        });
        list.forEach(a=>{
            const key = a.Erscheinungsjahr;
            if(!grouped[key]) grouped[key]=[];
            grouped[key].push(a);
        });
    }

    // Anzeige der Blöcke
    for(let block in grouped){
        const blockDiv = document.createElement('div');
        blockDiv.className='album-block';
        const blockTitle = document.createElement('div');
        blockTitle.className='block-title';
        blockTitle.textContent=block;
        blockDiv.appendChild(blockTitle);

        grouped[block].forEach(album=>{
            const card = document.createElement('div'); card.className='album-card';
            const header = document.createElement('div'); header.className='album-header';
            const cover = document.createElement('img'); cover.src=album.CoverBild; cover.alt=album.Plattenname;
            const infoDiv=document.createElement('div'); infoDiv.className='album-info';
            infoDiv.innerHTML=`<p class="title">${album.Plattenname}</p>
                               <p class="size-year">${album.Groesse}, ${album.Erscheinungsjahr}</p>
                               <p class="artist">${album.Künstler}</p>`;
            header.appendChild(cover); header.appendChild(infoDiv); card.appendChild(header);

            // Details
            const details=document.createElement('div'); details.className='details';
            const detailLeft=document.createElement('div'); detailLeft.className='detail-left';
            detailLeft.innerHTML=`<p><strong>Country:</strong> ${album.Country}</p>
                                  <p><strong>Genre:</strong> ${album.Genre}</p>
                                  <p><strong>Speed:</strong> ${album.Speed}</p>`;

            const trackDiv=document.createElement('div'); trackDiv.className='tracklist';

            if(album.Typ === 'Platte' && album.Sides){
                const sideContainer = document.createElement('div');
                sideContainer.style.display = 'flex';
                sideContainer.style.gap = '20px';

                for(const [sideName, tracks] of Object.entries(album.Sides)){
                    const sideDiv = document.createElement('div');
                    sideDiv.innerHTML = `<strong>${sideName}</strong><br>${tracks.join('<br>')}`;
                    sideContainer.appendChild(sideDiv);
                }

                trackDiv.appendChild(sideContainer);
            } else {
                // CD oder Platte ohne Sides
                const tracks = album.Trackliste || [];
                trackDiv.innerHTML = `<strong>Trackliste:</strong><br>${tracks.join('<br>')}`;
            }

            details.appendChild(detailLeft); details.appendChild(trackDiv); card.appendChild(details);

            // Toggle Details
            header.addEventListener('click', ()=>{
                if(currentlyOpen && currentlyOpen!==details) currentlyOpen.classList.remove('open');
                details.classList.toggle('open');
                currentlyOpen=details.classList.contains('open')?details:null;
            });

            blockDiv.appendChild(card);
        });
        collectionDiv.appendChild(blockDiv);
    }
}

// Filter & Anzeige
function applyFilter(){
    let filtered=albums.filter(a=> 
        (a.Plattenname.toLowerCase().includes(searchInput.value.toLowerCase()) ||
         a.Künstler.toLowerCase().includes(searchInput.value.toLowerCase()) ||
         (a.Genre && a.Genre.toLowerCase().includes(searchInput.value.toLowerCase())))
    );
    if(currentType!=='alle') filtered=filtered.filter(a=>a.Typ===currentType);
    displayAlbums(filtered);
}

// Tabs
const tabs=document.querySelectorAll('.tab');
tabs.forEach(tab=>{ tab.addEventListener('click', ()=>{
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    currentType=tab.dataset.type;
    applyFilter();
})});

// Suche + Autocomplete
searchInput.addEventListener('input', ()=>{
    applyFilter();
    autocompleteDiv.innerHTML='';
    const query=searchInput.value.toLowerCase();
    if(query){
        let suggestions=albums.filter(a=> 
            a.Plattenname.toLowerCase().includes(query) || 
            a.Künstler.toLowerCase().includes(query) || 
            (a.Genre && a.Genre.toLowerCase().includes(query))
        ).slice(0,5);
        suggestions.forEach(s=>{
            const item=document.createElement('div'); item.className='autocomplete-item';
            item.textContent=s.Plattenname+" - "+s.Künstler+" ("+(s.Genre||'')+")";
            item.addEventListener('click', ()=>{ searchInput.value=s.Plattenname; autocompleteDiv.innerHTML=''; applyFilter(); });
            autocompleteDiv.appendChild(item);
        });
    }
});

// X Button
clearSearch.addEventListener('click', ()=>{ searchInput.value=''; applyFilter(); autocompleteDiv.innerHTML=''; });

// Sortierung
sortSelect.addEventListener('change', applyFilter);

// initial
applyFilter();
