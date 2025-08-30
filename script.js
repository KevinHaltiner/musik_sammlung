// JSON-Daten direkt in JS eingebettet
const albums = [
    {
        "Typ":"Platte",
        "Plattenname":"Slippery When Wet",
        "Künstler":"Bon Jovi",
        "Erscheinungsjahr":1986,
        "Groesse":"12\"",
        "CoverBild":"img/slipperywhenwet.jpg",
        "Country":"USA",
        "Genre":"Rock",
        "Speed":"33 RPM",
        "Trackliste":"1. Let It Rock; 2. You Give Love A Bad Name; 3. Livin' On A Prayer",
        "Barcode":"042283026427",
        "Notizen":"Erstauflage"
    },
    {
        "Typ":"Platte",
        "Plattenname":"Machine Head",
        "Künstler":"Deep Purple",
        "Erscheinungsjahr":1972,
        "Groesse":"12\"",
        "CoverBild":"img/machinehead.jpg",
        "Country":"UK",
        "Genre":"Rock",
        "Speed":"33 RPM",
        "Trackliste":"1. Highway Star; 2. Maybe I'm a Leo; 3. Pictures of Home",
        "Barcode":"1234567890",
        "Notizen":""
    },
    {
        "Typ":"CD",
        "Plattenname":"Appetite for Destruction",
        "Künstler":"Guns N' Roses",
        "Erscheinungsjahr":1987,
        "Groesse":"CD",
        "CoverBild":"img/400221-emp.webp",
        "Country":"USA",
        "Genre":"Rock",
        "Speed":"n/a",
        "Trackliste":"1. Welcome to the Jungle; 2. It's So Easy; 3. Nightrain",
        "Barcode":"987654321",
        "Notizen":""
    }
];

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

            const details=document.createElement('div'); details.className='details';
            const detailLeft=document.createElement('div'); detailLeft.className='detail-left';
            detailLeft.innerHTML=`<p><strong>Country:</strong> ${album.Country}</p>
                                  <p><strong>Genre:</strong> ${album.Genre}</p>
                                  <p><strong>Speed:</strong> ${album.Speed}</p>
                                  <p><strong>Barcode:</strong> ${album.Barcode}</p>
                                  <p><strong>Notizen:</strong> ${album.Notizen}</p>`;
            const trackDiv=document.createElement('div'); trackDiv.className='tracklist';
            trackDiv.innerHTML=`<strong>Trackliste:</strong><br>${album.Trackliste.replace(/;/g,'<br>')}`;
            details.appendChild(detailLeft); details.appendChild(trackDiv); card.appendChild(details);

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
    let filtered=albums.filter(a=> (a.Plattenname.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                                    a.Künstler.toLowerCase().includes(searchInput.value.toLowerCase()) ||
                                    a.Genre.toLowerCase().includes(searchInput.value.toLowerCase())));
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
        let suggestions=albums.filter(a=> a.Plattenname.toLowerCase().includes(query) || a.Künstler.toLowerCase().includes(query) || a.Genre.toLowerCase().includes(query)).slice(0,5);
        suggestions.forEach(s=>{
            const item=document.createElement('div'); item.className='autocomplete-item';
            item.textContent=s.Plattenname+" - "+s.Künstler+" ("+s.Genre+")";
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
