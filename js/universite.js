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

// Generate random cards for a pack
function generatePackCards() {
    const cards = [];

    for (let i = 0; i < 3; i++) {
        let card;
        const roll = Math.random() * 100;

        if (i === 2) {
            // 3ème carte : 10% legendary, 30% rare, 60% common
            if (roll < 60) {
                const legendaries = cardDatabase.filter(c => c.rarity === 'legendary');
                card = legendaries[Math.floor(Math.random() * legendaries.length)];
            } else if (roll < 90) {
                const rares = cardDatabase.filter(c => c.rarity === 'rare');
                card = rares[Math.floor(Math.random() * rares.length)];
            } else {
                const commons = cardDatabase.filter(c => c.rarity === 'common');
                card = commons[Math.floor(Math.random() * commons.length)];
            }
        } else {
            // 1ère et 2ème carte : 1% legendary, 30% rare, 69% common
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

let packCards = generatePackCards();

// Select booster to open
function selectBooster() {
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }
    startOpening();
}

// Start opening sequence
function startOpening() {
    const openingContainer = document.getElementById('openingContainer');
    if (!openingContainer) return;
    
    openingContainer.classList.add('active');

    const openingPack = document.getElementById('openingPack');
    const packWrapper = document.getElementById('packWrapper');
    const progressBar = document.getElementById('progressBar');

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
}

// Complete opening and show cards
function completeOpening() {
    const instruction = document.getElementById('instruction');
    const cardsContainer = document.getElementById('cardsContainer');
    const openingPack = document.getElementById('openingPack');
    const backButton = document.querySelector('.back-button');
    const infoDisplay = document.querySelector('.info-display');

    // Hide pack and UI elements
    if (openingPack) {
        openingPack.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        openingPack.style.opacity = '0';
        openingPack.style.transform = 'scale(0.8)';
        setTimeout(() => {
            openingPack.style.display = 'none';
        }, 500);
    }
    
    if (backButton) {
        backButton.style.opacity = '0';
        setTimeout(() => {
            backButton.style.display = 'none';
        }, 500);
    }
    
    if (infoDisplay) {
        infoDisplay.style.opacity = '0';
        setTimeout(() => {
            infoDisplay.style.display = 'none';
        }, 500);
    }

    if (instruction) instruction.style.display = 'none';
    if (cardsContainer) cardsContainer.classList.add('active');

    // Show cards one by one
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

            if (cardsContainer) {
                cardsContainer.appendChild(cardElement);
            }

            // Trigger reveal animation
            setTimeout(() => {
                cardElement.classList.add('reveal');
            }, 50);

        }, index * 1500);
    });

    // Show finish button
    setTimeout(() => {
        const finishButton = document.getElementById('finishButton');
        if (finishButton) {
            finishButton.classList.add('active');
        }
    }, packCards.length * 1500 + 1000);
}

// Fonction pour ajouter les cartes à l'inventaire
function addCardsToInventory() {
    try {
        console.log("🎴 Ajout des cartes à l'inventaire...");
        
        // Récupérer l'utilisateur actuel
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

        // Récupérer l'inventaire actuel
        let inventory = [];
        const inventoryData = localStorage.getItem(`inventory_${userId}`);
        
        if (inventoryData) {
            inventory = JSON.parse(inventoryData);
            console.log("📦 Inventaire actuel:", inventory.length, "cartes");
        } else {
            console.log("📦 Création d'un nouvel inventaire");
        }

        // Ajouter chaque carte du pack à l'inventaire
        packCards.forEach(card => {
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

        // Sauvegarder l'inventaire mis à jour
        localStorage.setItem(`inventory_${userId}`, JSON.stringify(inventory));
        
        console.log('✅ Cartes ajoutées à la collection!');
        console.log('📦 Total:', inventory.length, 'cartes différentes');
        
    } catch (err) {
        console.error("❌ Erreur lors de l'ajout des cartes:", err);
        alert("Erreur lors de la sauvegarde: " + err.message);
    }
}

// Finish opening and return
function finishOpening() {
    console.log("🏁 Finalisation de l'ouverture...");
    
    // Ajouter les cartes à l'inventaire avant de rediriger
    addCardsToInventory();
    
    // Petit délai pour que l'utilisateur voie le message de confirmation
    setTimeout(() => {
        window.location.href = 'inventaire.html';
    }, 500);
}

// Go back button
function goBack() {
    window.history.back();
}
