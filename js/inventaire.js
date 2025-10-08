// Données de test - Simuler des cartes obtenues
let inventory = [
    { id: 1, name: 'Dragon Noir', rarity: 'legendary', count: 1, favorite: false, date: Date.now() - 1000 },
    { id: 2, name: 'Mage de Feu', rarity: 'epic', count: 2, favorite: true, date: Date.now() - 2000 },
    { id: 3, name: 'Chevalier Sacré', rarity: 'rare', count: 3, favorite: false, date: Date.now() - 3000 },
    { id: 4, name: 'Guerrier', rarity: 'common', count: 5, favorite: false, date: Date.now() - 4000 },
    { id: 5, name: 'Archer Elfe', rarity: 'rare', count: 2, favorite: false, date: Date.now() - 5000 },
    { id: 6, name: 'Sorcière', rarity: 'epic', count: 1, favorite: false, date: Date.now() - 6000 },
    { id: 7, name: 'Paladin', rarity: 'rare', count: 2, favorite: false, date: Date.now() - 7000 },
    { id: 8, name: 'Goblin', rarity: 'common', count: 8, favorite: false, date: Date.now() - 8000 },
    { id: 9, name: 'Phénix Doré', rarity: 'legendary', count: 1, favorite: true, date: Date.now() - 9000 },
    { id: 10, name: 'Voleur', rarity: 'common', count: 4, favorite: false, date: Date.now() - 10000 },
];

// État des filtres
let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';
let selectedCard = null;

// Éléments DOM
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

// Fonctions de tri
function sortInventory(inventory, sortBy) {
    const sorted = [...inventory];
    switch(sortBy) {
        case 'date':
            return sorted.sort((a, b) => b.date - a.date);
        case 'rarity':
            const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
            return sorted.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
        case 'count':
            return sorted.sort((a, b) => b.count - a.count);
        default:
            return sorted;
    }
}

// Filtrer l'inventaire
function filterInventory() {
    let filtered = [...inventory];

    // Filtre par rareté
    if (currentRarity !== 'all') {
        filtered = filtered.filter(card => card.rarity === currentRarity);
    }

    // Filtre par recherche
    if (searchQuery) {
        filtered = filtered.filter(card => 
            card.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    return sortInventory(filtered, currentSort);
}

// Calculer les statistiques
function calculateStats(statType) {
    switch(statType) {
        case 'total':
            return inventory.reduce((sum, card) => sum + card.count, 0);
        case 'unique':
            return inventory.length;
        case 'common':
            return inventory.filter(c => c.rarity === 'common').reduce((sum, card) => sum + card.count, 0);
        case 'rare':
            return inventory.filter(c => c.rarity === 'rare').reduce((sum, card) => sum + card.count, 0);
        case 'epic':
            return inventory.filter(c => c.rarity === 'epic').reduce((sum, card) => sum + card.count, 0);
        case 'legendary':
            return inventory.filter(c => c.rarity === 'legendary').reduce((sum, card) => sum + card.count, 0);
        default:
            return 0;
    }
}

// Afficher les cartes
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
        epic: 'Épique',
        legendary: 'Légendaire'
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

// Mettre à jour les statistiques
function updateStats() {
    const stat = calculateStats(statSelector.value);
    statValue.textContent = stat;
}

// Toggle favori
function toggleFavorite(cardId) {
    const card = inventory.find(c => c.id === cardId);
    if (card) {
        card.favorite = !card.favorite;
        renderCards();
    }
}

// Ouvrir modal de détail
function openCardModal(card) {
    selectedCard = card;
    
    const rarityNames = {
        common: 'Commun',
        rare: 'Rare',
        epic: 'Épique',
        legendary: 'Légendaire'
    };

    const rarityClasses = {
        common: 'common',
        rare: 'rare',
        epic: 'epic',
        legendary: 'legendary'
    };

    modalCard.className = `modal-card card ${rarityClasses[card.rarity]}`;
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

// Fermer modal
modalClose.addEventListener('click', () => {
    cardModal.classList.remove('active');
});

cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) {
        cardModal.classList.remove('active');
    }
});

// Toggle favori depuis modal
modalFavoriteBtn.addEventListener('click', () => {
    if (selectedCard) {
        toggleFavorite(selectedCard.id);
        openCardModal(selectedCard); // Recharger le modal
    }
});

// Changement de statistique
statSelector.addEventListener('change', updateStats);

// Filtres de tri
document.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSort = btn.dataset.sort;
        renderCards();
    });
});

// Filtres de rareté
document.querySelectorAll('[data-rarity]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-rarity]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentRarity = btn.dataset.rarity;
        renderCards();
    });
});

// Recherche
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCards();
});

// Navigation - Alertes pour pages non développées
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (!item.classList.contains('active') && !item.hasAttribute('href')) {
            const label = item.querySelector('.nav-label').textContent;
            alert(`La section "${label}" n'est pas encore disponible !`);
        }
    });
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    renderCards();
});
