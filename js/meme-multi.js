// Card database with images and rarities
const cardDatabase = [
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
];

// Create animated bubbles
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
