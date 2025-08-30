// JSON-Daten direkt in JS eingebettet
const albums = [
{
    "Typ": "Platte",
    "Plattenname": "The Wall",
    "Künstler": "Pink Floyd",
    "Erscheinungsjahr": 1979,
    "Groesse": "12\"",
    "CoverBild": "img/placeholder.jpg",
    "Country": "UK",
    "Genre": "Progressive Rock",
    "Speed": "33 RPM",
    "Sides": {
      "Side 1": [
        "In the Flesh?",
        "The Thin Ice",
        "Another Brick in the Wall, Part 1",
        "The Happiest Days of Our Lives",
        "Another Brick in the Wall, Part 2",
        "Mother"
      ],
      "Side 2": [
        "Goodbye Blue Sky",
        "Empty Spaces",
        "Young Lust",
        "One of My Turns",
        "Don't Leave Me Now",
        "Another Brick in the Wall, Part 3",
        "Goodbye Cruel World"
      ],
      "Side 3": [
        "Hey You",
        "Is There Anybody Out There?",
        "Nobody Home",
        "Vera",
        "Bring the Boys Back Home",
        "Comfortably Numb"
      ],
      "Side 4": [
        "The Show Must Go On",
        "In the Flesh",
        "Run Like Hell",
        "Waiting for the Worms",
        "Stop",
        "The Trial",
        "Outside the Wall"
      ]
    }
  },
  {
    "Typ": "Platte",
    "Plattenname": "Metal Rendez-Vous",
    "Künstler": "Krokus",
    "Erscheinungsjahr": 1980,
    "Groesse": "12\"",
    "CoverBild": "img/placeholder.jpg",
    "Country": "Switzerland",
    "Genre": "Hard Rock",
    "Speed": "33 RPM",
    "Sides": {
      "Side 1": [
        "Heatstrokes",
        "Bedside Radio",
        "Come On",
        "Streamer",
        "Shy Kid"
      ],
      "Side 2": [
        "Tokyo Nights",
        "Lady Double Dealer",
        "Fire",
        "No Way",
        "Back-Seat Rock ’n’ Roll"
      ]
    }
  },
  {
    "Typ": "Platte",
    "Plattenname": "Led Zeppelin IV",
    "Künstler": "Led Zeppelin",
    "Erscheinungsjahr": 1971,
    "Groesse": "12\"",
    "CoverBild": "img/placeholder.jpg",
    "Country": "UK",
    "Genre": "Hard Rock",
    "Speed": "33 RPM",
    "Sides": {
      "Side 1": [
        "Black Dog",
        "Rock and Roll",
        "The Battle of Evermore",
        "Stairway to Heaven"
      ],
      "Side 2": [
        "Misty Mountain Hop",
        "Four Sticks",
        "Going to California",
        "When the Levee Breaks"
      ]
    }
  },
  {
    "Typ": "Platte",
    "Plattenname": "Piledriver",
    "Künstler": "Status Quo",
    "Erscheinungsjahr": 1972,
    "Groesse": "12\"",
    "CoverBild": "img/placeholder.jpg",
    "Country": "UK",
    "Genre": "Rock",
    "Speed": "33 RPM",
    "Sides": {
      "Side 1": [
        "Don't Waste My Time",
        "Oh Baby",
        "A Year",
        "Unspoken Words"
      ],
      "Side 2": [
        "Big Fat Mama",
        "Paper Plane",
        "All the Reasons",
        "Roadhouse Blues"
      ]
    }
  },
  {
    "Typ": "Platte",
    "Plattenname": "Strung Up",
    "Künstler": "Sweet",
    "Erscheinungsjahr": 1975,
    "Groesse": "12\"",
    "CoverBild": "img/placeholder.jpg",
    "Country": "UK",
    "Genre": "Glam Rock",
    "Speed": "33 RPM",
    "Sides": {
      "Side 1": [
        "Burn on the Flame",
        "The Lies in Your Eyes",
        "Lady Starlight",
        "Man with the Golden Arm"
      ],
      "Side 2": [
        "Fox on the Run",
        "Set Me Free",
        "Miss Demeanor",
        "Ballroom Blitz"
      ],
      "Side 3": [
        "Action",
        "Solid Gold Brass",
        "Teenage Rampage",
        "Sweet F.A."
      ],
      "Side 4": [
        "Done Me Wrong All Right",
        "You're Not Wrong for Loving Me",
        "Windy City",
        "Hell Raiser"
      ]
    }
  },
  {
    "Typ": "Platte",
    "Plattenname": "Live in Japan",
    "Künstler": "The Runaways",
    "Erscheinungsjahr": 1977,
    "Groesse": "12\"",
    "CoverBild": "img/placeholder.jpg",
    "Country": "USA",
    "Genre": "Hard Rock",
    "Speed": "33 RPM",
    "Sides": {
      "Side 1": [
        "Queens of Noise",
        "California Paradise",
        "All Right You Guys",
        "Wild Thing"
      ],
      "Side 2": [
        "Gettin' Hot",
        "Rock-n-Roll",
        "You Drive Me Wild",
        "Neon Angels on the Road to Ruin"
      ],
      "Side 3": [
        "I Wanna Be Where the Boys Are",
        "Cherry Bomb",
        "American Nights",
        "C'mon"
      ],
      "Side 4": [
        "Blackmail",
        "Secrets",
        "You Drive Me Wild (reprise)"
      ]
    }
  },
  {
    "Typ": "Platte",
    "Plattenname": "Comeblack",
    "Künstler": "Scorpions",
    "Erscheinungsjahr": 2011,
    "Groesse": "12\"",
    "CoverBild": "img/placeholder.jpg",
    "Country": "Germany",
    "Genre": "Hard Rock",
    "Speed": "33 RPM",
    "Sides": {
      "Side 1": [
        "Rhythm of Love",
        "No One Like You",
        "The Zoo",
        "Rock You Like a Hurricane",
        "Blackout",
        "Wind of Change",
        "Still Loving You"
      ],
      "Side 2": [
        "Tainted Love",
        "Children of the Revolution",
        "Across the Universe",
        "Tin Soldier",
        "All Day and All of the Night",
        "Ruby Tuesday"
      ]
    }
  },
  {
    "Typ": "Platte",
    "Plattenname": "Blue for You",
    "Künstler": "Status Quo",
    "Erscheinungsjahr": 1976,
    "Groesse": "12\"",
    "CoverBild": "img/placeholder.jpg",
    "Country": "UK",
    "Genre": "Rock",
    "Speed": "33 RPM",
    "Sides": {
      "Side 1": [
        "Is There a Better Way",
        "Mad About the Boy",
        "Ring of a Change",
        "Blue for You"
      ],
      "Side 2": [
        "Rain",
        "Rolling Home",
        "That's a Fact",
        "Ease Your Mind",
        "Mystery Song"
      ]
    }
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
        "Sides": {
            "Side 1": ["Highway Star", "Maybe I'm a Leo"],
            "Side 2": ["Pictures of Home"]
        }
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
        "Trackliste": ["Welcome to the Jungle", "It's So Easy", "Nightrain"]
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
