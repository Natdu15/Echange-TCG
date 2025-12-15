let friends = [];
let myCards = [];
let selectedFriend = null;
let selectedCard = null;

// Initialisation
function init() {
    loadFriends();
    loadCardsFromInventory();
    displayFriends();
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    startTimer();
}

function loadFriends() {
    const storedFriends = localStorage.getItem('friends');
    if (storedFriends) {
        friends = JSON.parse(storedFriends);
    }
}

function loadCardsFromInventory() {
    try {
        // Récupérer l'utilisateur actuel
        let currentUser = null;
        const userData = localStorage.getItem("current_user");
        
        if (!userData) {
            console.log("Pas d'utilisateur connecté");
            currentUser = { id: 'default_user', name: 'Joueur' };
        } else {
            currentUser = JSON.parse(userData);
        }

        const userId = currentUser.id;
        console.log("👤 Chargement des cartes pour:", userId);

        // Récupérer l'inventaire
        const inventoryData = localStorage.getItem(`inventory_${userId}`);
        
        if (inventoryData) {
            const inventory = JSON.parse(inventoryData);
            console.log("📦 Inventaire chargé:", inventory.length, "cartes différentes");
            
            // Convertir l'inventaire en format de cartes pour le trade
            myCards = inventory.map(card => ({
                id: card.id,
                name: card.name,
                rarity: card.rarity,
                image: card.image,
                count: card.count,
                favorite: card.favorite
            }));
            
            console.log("✅ Cartes disponibles pour le trade:", myCards.length);
        } else {
            console.log("📦 Aucune carte dans l'inventaire");
            myCards = [];
        }
    } catch (err) {
        console.error("❌ Erreur lors du chargement des cartes:", err);
        myCards = [];
    }
}

function displayFriends(filter = '') {
    const list = document.getElementById('friendList');
    list.innerHTML = '';

    const filteredFriends = friends.filter(f =>
        f.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (friends.length === 0) {
        list.innerHTML = `
            <div class="no-friends">
                <div class="no-friends-icon">👥</div>
                <h2 style="margin-bottom: 15px;">Aucun ami</h2>
                <p style="font-size: 1.2rem; color: #9ca3af;">Veuillez ajouter des amis avant de trader</p>
            </div>
        `;
        return;
    }

    if (filteredFriends.length === 0) {
        list.innerHTML = `
            <div class="no-friends">
                <div class="no-friends-icon">🔍</div>
                <h2>Aucun résultat</h2>
                <p style="color: #9ca3af;">Aucun ami ne correspond à votre recherche</p>
            </div>
        `;
        return;
    }

    filteredFriends.forEach(friend => {
        const card = document.createElement('div');
        card.className = `friend-card ${!friend.online ? 'offline' : ''}`;
        card.onclick = () => friend.online && selectFriend(friend);

        const initials = friend.name.substring(0, 2).toUpperCase();

        card.innerHTML = `
            <div class="friend-info">
                <div class="friend-avatar">${initials}</div>
                <div>
                    <div class="card-name">${friend.name}</div>
                    <div class="friend-status ${friend.online ? 'online' : 'offline-text'}">
                        ${friend.online ? '🟢 En ligne' : '⚫ Hors ligne'}
                    </div>
                </div>
            </div>
            ${friend.online ? '<div style="font-size: 1.5rem;">→</div>' : ''}
        `;

        list.appendChild(card);
    });
}

function handleSearch(e) {
    displayFriends(e.target.value);
}

function selectFriend(friend) {
    selectedFriend = friend;
    document.getElementById('friendName').textContent = friend.name;
    displayMyCards();
    showPage('cardsPage');
}

function displayMyCards() {
    const list = document.getElementById('myCardsList');
    list.innerHTML = '';

    if (myCards.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🃏</div>
                <p>Aucune carte disponible</p>
                <p style="font-size: 0.9rem; margin-top: 10px; color: #9ca3af;">Ouvrez des boosters pour obtenir des cartes à échanger</p>
            </div>
        `;
        return;
    }

    myCards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = `card-item ${selectedCard?.id === card.id ? 'selected' : ''}`;
        cardEl.onclick = () => openConfirmModal(card);

        // Utiliser l'image de la carte ou une icône par défaut
        const cardImageHTML = card.image 
            ? `<img src="${card.image}" alt="${card.name}" class="card-image">`
            : `<div class="card-icon">🃏</div>`;

        cardEl.innerHTML = `
            ${cardImageHTML}
            <div class="card-name">${card.name}</div>
            <span class="card-rarity ${card.rarity}">${getRarityLabel(card.rarity)}</span>
            <div class="card-stats">📦 Quantité: ${card.count}</div>
        `;

        list.appendChild(cardEl);
    });
}

function getRarityLabel(rarity) {
    const labels = {
        common: '⚪ Commun',
        rare: '🔵 Rare',
        legendary: '🟡 Légendaire'
    };
    return labels[rarity] || rarity;
}

function openConfirmModal(card) {
    selectedCard = card;

    const modalImage = document.getElementById('modalCardImage');
    if (card.image) {
        modalImage.src = card.image;
        modalImage.style.display = 'block';
    } else {
        modalImage.style.display = 'none';
    }

    document.getElementById('modalCardName').textContent = card.name;
    const rarityEl = document.getElementById('modalCardRarity');
    rarityEl.textContent = getRarityLabel(card.rarity);
    rarityEl.className = `card-rarity ${card.rarity}`;

    document.getElementById('confirmModal').classList.add('show');
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('show');
}

function confirmTrade() {
    closeModal();
    document.getElementById('waitingFriendName').textContent = selectedFriend.name;
    
    const waitingImage = document.getElementById('waitingCardImage');
    if (selectedCard.image) {
        waitingImage.src = selectedCard.image;
        waitingImage.style.display = 'block';
    } else {
        waitingImage.style.display = 'none';
    }
    
    showPage('waitingPage');
}

function cancelTrade() {
    selectedCard = null;
    goToSearch();
}

function goToSearch() {
    selectedFriend = null;
    selectedCard = null;
    showPage('searchPage');
}

function showPage(pageId) {
    const pages = ['searchPage', 'cardsPage', 'waitingPage'];
    pages.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
}

// Timer fictif de 24h
let timeRemaining = 24 * 60 * 60 - 15; // 23:59:45

function startTimer() {
    setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const timerEl = document.getElementById('timer');
    if (timerEl) {
        timerEl.textContent = display;
    }
}

// Démarrage
init();
