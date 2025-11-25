async function loadUser() {
    const userId = localStorage.getItem("user_id");
    const status = document.getElementById("status");

    if (!userId) {
        status.textContent = "Pas connecté";
        return;
    }

    try {
        const response = await fetch(`https://TON-BACKEND.onrender.com/user/${userId}`);
        const data = await response.json();
        document.getElementById("userEmail").textContent = data.email;
    } catch (err) {
        status.textContent = "Erreur : " + err.message;
    }
}

loadUser();

const currentUser = getCurrentUser();
if (!currentUser) {
    window.location.href = 'index.html';
}

let inventory = currentUser.cards || [];

let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';
let selectedCard = null;

const cardsGrid = document.getElementById('cardsGrid');
const emptyState = document.getElementById('emptyState');
const statSelector = document.getElementById('statSelector');
const statValue = document.getElementById('statValue');
const searchInput = document.getElementById('searchInput');
const cardModal = document.getElementById('cardModal');
const modalClose = document.getElementById('modalClose');
const modalCard = document.getElementById('modalCard');
const modalCardIcon = document.getElementById('modalCardIcon');
const modalCardName = document.getElementById('modalCardName');
const modalCardRarity = document.getElementById('modalCardRarity');
const modalCardCount = document.getElementById('modalCardCount');
const modalFavoriteBtn = document.getElementById('modalFavoriteBtn');

function saveInventory() {
    currentUser.cards = inventory;
    saveCurrentUser(currentUser);
}

function sortInventory(inventory, sortBy) {
    const sorted = [...inventory];
    switch (sortBy) {
        case 'date':
            return sorted.sort((a, b) => b.date - a.date);
        case 'rarity':
            const rarityOrder = { unique: 3, rare: 2, common: 1 };
            return sorted.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
        case 'count':
            return sorted.sort((a, b) => b.count - a.count);
        default:
            return sorted;
    }
}

function filterInventory() {
    let filtered = [...inventory];
    if (currentRarity !== 'all') {
        filtered = filtered.filter(card => card.rarity === currentRarity);
    }
    if (searchQuery) {
        filtered = filtered.filter(card =>
            card.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    return sortInventory(filtered, currentSort);
}

function calculateStats(statType) {
    switch (statType) {
        case 'total':
            return inventory.reduce((sum, card) => sum + card.count, 0);
        case 'unique':
            return inventory.length;
        case 'common':
            return inventory.filter(c => c.rarity === 'common').reduce((s, c) => s + c.count, 0);
        case 'rare':
            return inventory.filter(c => c.rarity === 'rare').reduce((s, c) => s + c.count, 0);
        case 'uniqueRarity':
            return inventory.filter(c => c.rarity === 'unique').reduce((s, c) => s + c.count, 0);
        default:
            return 0;
    }
}

function renderCards() {
    const filtered = filterInventory();
    cardsGrid.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        cardsGrid.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    cardsGrid.style.display = 'grid';

    const rarityNames = {
        common: 'Commun',
        rare: 'Rare',
        unique: 'Unique'
    };

    filtered.forEach(card => {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'card-wrapper';

        cardWrapper.innerHTML = `
            <div class="card ${card.rarity}">
                <button class="favorite-btn ${card.favorite ? 'active' : ''}" data-id="${card.id}">
                    <i class="fas fa-star"></i>
                </button>
                <div class="card-count">x${card.count}</div>
                <div class="card-icon">🃏</div>
                <div class="card-name">${card.name}</div>
                <div class="card-rarity">${rarityNames[card.rarity]}</div>
            </div>
        `;

        cardWrapper.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                openCardModal(card);
            }
        });

        const favoriteBtn = cardWrapper.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(card.id);
        });

        cardsGrid.appendChild(cardWrapper);
    });

    updateStats();
}

function updateStats() {
    const stat = calculateStats(statSelector.value);
    statValue.textContent = stat;
}

function toggleFavorite(cardId) {
    const card = inventory.find(c => c.id === cardId);
    if (card) {
        card.favorite = !card.favorite;
        saveInventory();
        renderCards();
    }
}

function openCardModal(card) {
    selectedCard = card;

    const rarityNames = {
        common: 'Commun',
        rare: 'Rare',
        unique: 'Unique'
    };

    modalCard.className = `modal-card card ${card.rarity}`;
    modalCardIcon.textContent = '🃏';
    modalCardName.textContent = card.name;
    modalCardRarity.textContent = rarityNames[card.rarity];
    modalCardCount.textContent = `Possédé: x${card.count}`;

    if (card.favorite) {
        modalFavoriteBtn.classList.add('active');
        modalFavoriteBtn.innerHTML = '<i class="fas fa-star"></i> Retirer des favoris';
    } else {
        modalFavoriteBtn.classList.remove('active');
        modalFavoriteBtn.innerHTML = '<i class="fas fa-star"></i> Ajouter aux favoris';
    }

    cardModal.classList.add('active');
}

modalClose.addEventListener('click', () => {
    cardModal.classList.remove('active');
});

cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) {
        cardModal.classList.remove('active');
    }
});

modalFavoriteBtn.addEventListener('click', () => {
    if (selectedCard) {
        toggleFavorite(selectedCard.id);
        openCardModal(selectedCard);
    }
});

statSelector.addEventListener('change', updateStats);

document.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSort = btn.dataset.sort;
        renderCards();
    });
});

document.querySelectorAll('[data-rarity]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-rarity]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentRarity = btn.dataset.rarity;
        renderCards();
    });
});

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCards();
});

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        if (!item.classList.contains('active') && !item.hasAttribute('href')) {
            const label = item.querySelector('.nav-label').textContent;
            alert(`La section "${label}" n'est pas encore disponible !`);
        }
    });
});

function addCard(card) {
    const existing = inventory.find(c => c.name === card.name);
    if (existing) {
        existing.count += card.count || 1;
    } else {
        inventory.push({
            id: Date.now(),
            name: card.name,
            rarity: card.rarity,
            count: card.count || 1,
            favorite: false,
            date: Date.now()
        });
    }
    saveInventory();
    renderCards();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCards();
});
