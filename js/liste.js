// Card databases
const cardDatabases = {
    university: [
           // Common cards (60% chance)
    { id: 1, name: "Gourroux du Bios", rarity: "common", image: "cartes-pokémon/bios.png" },
    { id: 2, name: "Chishit", rarity: "common", image: "cartes-pokémon/chishit.png" },
    { id: 3, name: "Cours de Stat", rarity: "common", image: "cartes-pokémon/cours-stat.png" },
    { id: 4, name: "Fdp", rarity: "common", image: "cartes-pokémon/fdp.png" },
    { id: 5, name: "Danse de la forêt", rarity: "common", image: "cartes-pokémon/lagarde.png" },
    { id: 6, name: "Communication à nu", rarity: "common", image: "cartes-pokémon/stephane.png" },
    { id: 7, name: "Terminal", rarity: "common", image: "cartes-pokémon/terminal.png" },
    { id: 8, name: "Yume", rarity: "common", image: "cartes-pokémon/yume.png" },
    { id: 9, name: "Maxime-enfant", rarity: "common", image: "cartes-pokémon/maxime-enfant.png" },
    { id: 10, name: "Chef Etchebest", rarity: "common", image: "cartes-pokémon/chef-etchebest.png" },
    { id: 11, name: "Clash of Clans", rarity: "common", image: "cartes-pokémon/coc.png" },
    { id: 12, name: "Dorine", rarity: "common", image: "cartes-pokémon/dorine.png" },
    { id: 13, name: "Octane TW", rarity: "common", image: "cartes-pokémon/octane.png" },
    { id: 14, name: "Ouerdia", rarity: "common", image: "cartes-pokémon/ouerdia.png" },
    { id: 15, name: "Rocket Nathan", rarity: "common", image: "cartes-pokémon/nathan.png" },
    { id: 16, name: "Maman j'bicrave", rarity: "common", image: "cartes-pokémon/bicrave.png" },
    { id: 17, name: "entuca.fr", rarity: "common", image: "cartes-pokémon/ent.png" },
    { id: 18, name: "Centre Hospitalier", rarity: "common", image: "cartes-pokémon/bourg.png" },
    { id: 19, name: "Garage", rarity: "common", image: "cartes-pokémon/garage.png" },
    { id: 20, name: "Victime", rarity: "common", image: "cartes-pokémon/victime.png" },

    // Rare cards (30% chance)
    { id: 21, name: "Sermonien", rarity: "rare", image: "cartes-pokémon/bergeron.png" },
    { id: 22, name: "Boost de Visibilité", rarity: "rare", image: "cartes-pokémon/ciril.png" },
    { id: 23, name: "Loi Absolue", rarity: "rare", image: "cartes-pokémon/matter.png" },
    { id: 24, name: "Roi-Bios", rarity: "rare", image: "cartes-pokémon/roi-bios.png" },
    { id: 25, name: "Prêtresse du Java (pas jS)", rarity: "rare", image: "cartes-pokémon/vidal.png" },
    { id: 26, name: "Chef de projet... Sans projet", rarity: "rare", image: "cartes-pokémon/lilian.png" },
    { id: 27, name: "Burger King", rarity: "rare", image: "cartes-pokémon/bk.png" },
    { id: 28, name: "Clito 5", rarity: "rare", image: "cartes-pokémon/clito.png" },
    { id: 29, name: "Poignet Nicolas", rarity: "rare", image: "cartes-pokémon/nico.png" },
    { id: 30, name: "Proba", rarity: "rare", image: "cartes-pokémon/proba.png" },
    { id: 31, name: "NordVPN", rarity: "rare", image: "cartes-pokémon/vpn.png" },
    { id: 32, name: "Ciao Kombucha", rarity: "rare", image: "cartes-pokémon/ciao.png" },
    { id: 33, name: "Discord", rarity: "rare", image: "cartes-pokémon/discord.png" },
    { id: 34, name: "France Travail", rarity: "rare", image: "cartes-pokémon/travail.png" },
    { id: 35, name: "Twitter (X)", rarity: "rare", image: "cartes-pokémon/x.png" },

    // Legendary cards (10% chance)
    { id: 36, name: "Dieu Suprême", rarity: "legendary", image: "cartes-pokémon/dieu.png" },
    { id: 37, name: "Grollemund", rarity: "legendary", image: "cartes-pokémon/Grollemund.png" },
    { id: 38, name: "Prêtresse du Python", rarity: "legendary", image: "cartes-pokémon/pretesse-python.png" },
    { id: 39, name: "Tablorien de Génie", rarity: "legendary", image: "cartes-pokémon/roux.png" },
    { id: 40, name: "Tentation à la fête", rarity: "legendary", image: "cartes-pokémon/tentation.png" },
    { id: 41, name: "Je suis Coach", rarity: "legendary", image: "cartes-pokémon/coach.png" },
    { id: 42, name: "Madaaaaaaaaaaaame", rarity: "legendary", image: "cartes-pokémon/madaaaaaaaaaaame.png" },
    { id: 43, name: "ChatGPT", rarity: "legendary", image: "cartes-pokémon/chatgpt.png" },
    { id: 44, name: "Multiprise de 5", rarity: "legendary", image: "cartes-pokémon/multiprise.png" },
    { id: 45, name: "Père Poignet Nicolas", rarity: "legendary", image: "cartes-pokémon/noel.png" },
    { id: 46, name: "Gentle M8", rarity: "legendary", image: "cartes-pokémon/m8.png" },
    { id: 47, name: "L'arabe", rarity: "legendary", image: "cartes-pokémon/arabe.png" }
    ],
    manga: [
        // Common cards
        { id: 1, name: "Ace", rarity: "common", image: "cartes-pokémon/anime/ace.png" },
        { id: 2, name: "Sel", rarity: "common", image: "cartes-pokémon/anime/sel.png" },
        { id: 3, name: "Doma", rarity: "common", image: "cartes-pokémon/anime/doma.png" },

        // Rare cards
        { id: 4, name: "Akaza", rarity: "rare", image: "cartes-pokémon/anime/akaza.png" },
        { id: 5, name: "Titiana", rarity: "rare", image: "cartes-pokémon/anime/titiana.png" },

        // Legendary cards
        { id: 6, name: "Acnologia", rarity: "legendary", image: "cartes-pokémon/anime/acnologia.png" },
    ],
    yume: [
        { id: 1, name: "", rarity: "common", image: "cartes-pokémon/yume/.png" },
        { id: 2, name: "De", rarity: "common", image: "cartes-pokémon/yume/" },
        { id: 3, name: "Contrôle", rarity: "common", image: "cartes-pokémon/yume/" },

        // Rare cards
        { id: 4, name: "Jerki", rarity: "rare", image: "cartes-pokémon/yume/jerki.png" },
        { id: 5, name: "Jerkouille", rarity: "rare", image: "cartes-pokémon/yume/jerkouille.png" },
        { id: 6, name: "Car ", rarity: "rare", image: "cartes-pokémon/yume/" },


        // Legendary cards
        { id: 7, name: "Compte de Monté-Tissot", rarity: "legendary", image: "cartes-pokémon/yume/tissot.png" },
        { id: 8, name: "Les", rarity: "legendary", image: "cartes-pokémon/yume/" },
        { id: 9, name: "Vacances", rarity: "legendary", image: "cartes-pokémon/yume/" },

    ],
    meme: [
        // Common cards (60% chance)
        { id: 1, name: "BigFlop", rarity: "common", image: "cartes-pokémon/même/bigflop.png" },
        { id: 2, name: "Paille de Maxime", rarity: "common", image: "cartes-pokémon/même/paille.png" },
        { id: 3, name: "Bande Organisé 1", rarity: "common", image: "cartes-pokémon/même/bande-organise.png" },
        { id: 4, name: "Trend Mario Kart", rarity: "common", image: "cartes-pokémon/même/mario.png" },

        // Rare cards (30% chance)
        { id: 5, name: "Best querelle", rarity: "rare", image: "cartes-pokémon/même/bescherelle.png" },
        { id: 6, name: "juL", rarity: "rare", image: "cartes-pokémon/même/jul.png" },
        { id: 7, name: "Lapatienceyt", rarity: "rare", image: "cartes-pokémon/même/patience.png" },
        { id: 8, name: "Sch", rarity: "rare", image: "cartes-pokémon/même/sch.png" },

        // Legendary cards (10% chance)
        { id: 9, name: "Chef Etj'tebaize", rarity: "legendary", image: "cartes-pokémon/même/etjtebaize.png" },
        { id: 10, name: "Squeezie", rarity: "legendary", image: "cartes-pokémon/même/squeezie.png" },
        { id: 11, name: "Whippin", rarity: "legendary", image: "cartes-pokémon/même/whippin.png" },
        { id: 12, name: "Naps", rarity: "legendary", image: "cartes-pokémon/même/naps.png" },
        { id: 13, name: "Bande Organisé 2", rarity: "legendary", image: "cartes-pokémon/même/bande-organise2.png" },

    ]
};

let currentExtension = 'university';

// Create animated bubbles
function createBubbles() {
    const bubblesContainer = document.getElementById('bubbles');
    const bubbleCount = 15;

    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');

        const size = Math.random() * 100 + 50;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;

        const hue = Math.random() * 60 + 240;
        bubble.style.background = `radial-gradient(circle at 30% 30%, hsla(${hue}, 70%, 60%, 0.3), hsla(${hue}, 70%, 50%, 0.1))`;

        bubblesContainer.appendChild(bubble);
    }
}

// Select extension
function selectExtension(extension) {
    currentExtension = extension;

    // Update button states
    document.querySelectorAll('.extension-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-extension="${extension}"]`).classList.add('active');

    // Display collection
    displayCollection();
}

// Display collection by rarity
function displayCollection() {
    const container = document.getElementById('collectionContainer');
    container.innerHTML = '';

    const cardDatabase = cardDatabases[currentExtension];

    const rarities = [
        { type: 'legendary', label: '✨ Légendaires', emoji: '🌟' },
        { type: 'rare', label: '💎 Rares', emoji: '💠' },
        { type: 'common', label: '⚪ Communes', emoji: '🔘' }
    ];

    rarities.forEach(rarity => {
        const cards = cardDatabase.filter(card => card.rarity === rarity.type);

        if (cards.length > 0) {
            const section = document.createElement('div');
            section.className = 'rarity-section';

            const header = document.createElement('div');
            header.className = 'rarity-header';
            header.innerHTML = `
                        <h2>${rarity.label}</h2>
                        <span class="rarity-count">${cards.length} carte${cards.length > 1 ? 's' : ''}</span>
                    `;
            section.appendChild(header);

            const grid = document.createElement('div');
            grid.className = 'cards-grid';

            cards.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = `card-item ${card.rarity}`;
                cardElement.onclick = () => openCardModal(card);

                let rarityText = card.rarity === "legendary" ? "Légendaire" :
                    card.rarity === "rare" ? "Rare" : "Commun";

                cardElement.innerHTML = `
                            <img src="${card.image}" alt="${card.name}">
                            <div class="card-badge">${rarityText}</div>
                            <div class="card-name">${card.name}</div>
                        `;

                grid.appendChild(cardElement);
            });

            section.appendChild(grid);
            container.appendChild(section);
        }
    });
}

// Open card modal
function openCardModal(card) {
    const modal = document.getElementById('cardModal');
    const modalCard = document.getElementById('modalCard');
    const modalImage = document.getElementById('modalImage');
    const modalName = document.getElementById('modalName');
    const modalRarity = document.getElementById('modalRarity');

    modalCard.className = `modal-card ${card.rarity}`;
    modalImage.src = card.image;
    modalImage.alt = card.name;
    modalName.textContent = card.name;

    let rarityText = card.rarity === "legendary" ? "Légendaire" :
        card.rarity === "rare" ? "Rare" : "Commun";

    modalRarity.textContent = rarityText;
    modalRarity.style.background =
        card.rarity === "legendary" ? "rgba(255, 215, 0, 0.9)" :
            card.rarity === "rare" ? "rgba(255, 20, 147, 0.9)" :
                "rgba(65, 105, 225, 0.9)";
    modalRarity.style.color = card.rarity === "legendary" ? "#1a1a2e" : "white";

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close card modal
function closeModal(event) {
    if (event && event.target !== document.getElementById('cardModal') &&
        event.target.className !== 'modal-close') {
        return;
    }

    const modal = document.getElementById('cardModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Go back
function goBack() {
    window.history.back();
}

// Initialize
createBubbles();
displayCollection();
