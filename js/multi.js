const cardDatabase = [
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
];

function createBubbles() {
    const bubblesContainer = document.getElementById('bubbles');
    if (!bubblesContainer) return;
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

createBubbles();

let allPackCards = [];

function generatePackCards() {
    const cards = [];
    for (let i = 0; i < 3; i++) {
        let card;
        const roll = Math.random() * 100;
        if (i === 2) {
            if (roll < 45) {
                const legendaries = cardDatabase.filter(c => c.rarity === 'legendary');
                card = legendaries[Math.floor(Math.random() * legendaries.length)];
            } else if (roll < 80) {
                const rares = cardDatabase.filter(c => c.rarity === 'rare');
                card = rares[Math.floor(Math.random() * rares.length)];
            } else {
                const commons = cardDatabase.filter(c => c.rarity === 'common');
                card = commons[Math.floor(Math.random() * commons.length)];
            }
        } else {
            if (roll < 1) {
                const legendaries = cardDatabase.filter(c => c.rarity === 'legendary');
                card = legendaries[Math.floor(Math.random() * legendaries.length)];
            } else if (roll < 31) {
                const rares = cardDatabase.filter(c => c.rarity === 'rare');
                card = rares[Math.floor(Math.random() * rares.length)];
            } else {
                const commons = cardDatabase.filter(c => c.rarity === 'common');
                card = commons[Math.floor(Math.random() * commons.length)];
            }
        }
        cards.push(card);
    }
    return cards;
}

const openingPack = document.getElementById('openingPack');
const packWrapper = document.getElementById('packWrapper');
const progressBar = document.getElementById('progressBar');
const instruction = document.getElementById('instruction');

let progress = 0;
let isOpening = false;
let startOpenX = 0;

if (openingPack) {
    openingPack.addEventListener('mousedown', (e) => {
        isOpening = true;
        startOpenX = e.clientX;
    });
}

document.addEventListener('mousemove', (e) => {
    if (!isOpening) return;
    const deltaX = e.clientX - startOpenX;
    if (deltaX > 0) {
        progress = Math.min(100, (deltaX / 300) * 100);
        if (progressBar) progressBar.style.width = `${progress}%`;
        const rotation = (progress / 100) * 20;
        if (packWrapper) packWrapper.style.transform = `rotateY(${rotation}deg)`;
    }
    if (progress >= 100) {
        completeOpening();
        isOpening = false;
    }
});

document.addEventListener('mouseup', () => { isOpening = false; });

function completeOpening() {
    const cardsContainer = document.getElementById('cardsContainer');
    const backButton = document.querySelector('.back-button');
    const infoDisplay = document.querySelector('.info-display');

    if (openingPack) {
        openingPack.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        openingPack.style.opacity = '0';
        openingPack.style.transform = 'scale(0.8)';
        setTimeout(() => { openingPack.style.display = 'none'; }, 500);
    }
    if (backButton) {
        backButton.style.opacity = '0';
        setTimeout(() => { backButton.style.display = 'none'; }, 500);
    }
    if (infoDisplay) {
        infoDisplay.style.opacity = '0';
        setTimeout(() => { infoDisplay.style.display = 'none'; }, 500);
    }
    if (instruction) instruction.style.display = 'none';
    if (cardsContainer) cardsContainer.classList.add('active');

    let packIndex = 0;

    function showNextPack() {
        if (packIndex >= 20) {
            setTimeout(() => {
                const finishButton = document.getElementById('finishButton');
                if (finishButton) finishButton.classList.add('active');
            }, 500);
            return;
        }

        const packCards = generatePackCards();
        allPackCards = allPackCards.concat(packCards);

        packCards.forEach((card, index) => {
            setTimeout(() => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card', card.rarity);
                let rarityText = card.rarity === "legendary" ? "Légendaire" :
                    card.rarity === "rare" ? "Rare" : "Commun";
                cardElement.innerHTML = `
                    <img src="${card.image}" alt="${card.name}" class="card-image">
                    <div class="card-rarity-badge">${rarityText}</div>
                `;
                if (cardsContainer) cardsContainer.appendChild(cardElement);
                setTimeout(() => { cardElement.classList.add('reveal'); }, 50);
            }, index * 400);
        });

        packIndex++;
        setTimeout(() => { showNextPack(); }, 1200);
    }

    showNextPack();
}

function addCardsToInventory() {
    try {
        console.log("🎴 Ajout des cartes à l'inventaire...");
        let currentUser = null;
        const userData = localStorage.getItem("current_user");
        if (!userData) {
            console.log("Pas d'utilisateur, création d'un utilisateur par défaut");
            currentUser = { id: 'default_user', name: 'Joueur' };
            localStorage.setItem('current_user', JSON.stringify(currentUser));
        } else {
            currentUser = JSON.parse(userData);
        }

        const userId = currentUser.id;
        console.log("👤 Utilisateur:", userId);

        let inventory = [];
        const inventoryData = localStorage.getItem(`inventory_${userId}`);
        if (inventoryData) {
            inventory = JSON.parse(inventoryData);
            console.log("📦 Inventaire actuel:", inventory.length, "cartes");
        } else {
            console.log("📦 Création d'un nouvel inventaire");
        }

        allPackCards.forEach(card => {
            const existing = inventory.find(c => c.name === card.name);
            if (existing) {
                existing.count += 1;
                console.log("➕ Carte existante:", card.name, "→ x" + existing.count);
            } else {
                const newCard = {
                    id: Date.now() + Math.random(),
                    name: card.name,
                    rarity: card.rarity,
                    image: card.image,
                    count: 1,
                    favorite: false,
                    date: Date.now()
                };
                inventory.push(newCard);
                console.log("🆕 Nouvelle carte:", card.name);
            }
        });

        localStorage.setItem(`inventory_${userId}`, JSON.stringify(inventory));
        console.log('✅ Cartes ajoutées à la collection!');
        console.log('📦 Total:', inventory.length, 'cartes différentes');
    } catch (err) {
        console.error("❌ Erreur lors de l'ajout des cartes:", err);
        alert("Erreur lors de la sauvegarde: " + err.message);
    }
}

function finishOpening() {
    console.log("🏁 Finalisation de l'ouverture...");
    addCardsToInventory();
    setTimeout(() => {
        window.location.href = 'inventaire.html';
    }, 1000);
}

function goBack() {
    window.history.back();
}
