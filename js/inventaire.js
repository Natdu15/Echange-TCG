
function getCurrentUser() {
    try {
        const userData = localStorage.getItem("current_user");
        return userData ? JSON.parse(userData) : null;
    } catch (err) {
        console.error("Erreur récupération utilisateur:", err);
        return null;
    }
}

function initInventory() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error("Pas d'utilisateur connecté");
        return [];
    }

    try {
        const inventoryData = localStorage.getItem(`inventory_${currentUser.id}`);
        console.log("📦 Inventaire chargé:", inventoryData ? JSON.parse(inventoryData).length : 0, "cartes");
        return inventoryData ? JSON.parse(inventoryData) : [];
    } catch (err) {
        console.log("Création d'un nouvel inventaire");
        return [];
    }
}

// Variables globales
let inventory = [];
let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';
let selectedCard = null;
let currentUserId = null;

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

// Sauvegarder l'inventaire
function saveInventory() {
    if (!currentUserId) {
        console.error("Pas d'ID utilisateur pour la sauvegarde");
        return;
    }
    try {
        localStorage.setItem(`inventory_${currentUserId}`, JSON.stringify(inventory));
        console.log("✅ Inventaire sauvegardé:", inventory.length, "cartes");
    } catch (err) {
        console.error("❌ Erreur de sauvegarde:", err);
    }
}

// Trier l'inventaire
function sortInventory(inv, sortBy) {
    const sorted = [...inv];
    switch (sortBy) {
        case 'date':
            return sorted.sort((a, b) => b.date - a.date);
        case 'rarity':
            const rarityOrder = { legendary: 3, rare: 2, common: 1 };
            return sorted.sort((a, b) => (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0));
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
        const rarityMap = {
            'legendary': 'legendary',
            'commun': 'common',
            'rare': 'rare',
            'favoris': 'favoris' // Filtre spécial pour les favoris
        };
        const targetRarity = rarityMap[currentRarity] || currentRarity;
        
        if (targetRarity === 'favoris') {
            filtered = filtered.filter(card => card.favorite === true);
        } else {
            filtered = filtered.filter(card => card.rarity === targetRarity);
        }
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
    switch (statType) {
        case 'total':
            return inventory.reduce((sum, card) => sum + card.count, 0);
        case 'unique':
            return inventory.length;
        case 'common':
            return inventory.filter(c => c.rarity === 'common').reduce((s, c) => s + c.count, 0);
        case 'rare':
            return inventory.filter(c => c.rarity === 'rare').reduce((s, c) => s + c.count, 0);
        case 'legendary':
            return inventory.filter(c => c.rarity === 'legendary').reduce((s, c) => s + c.count, 0);
        default:
            return 0;
    }
}

// Afficher les cartes
function renderCards() {
    const filtered = filterInventory();
    cardsGrid.innerHTML = '';

    console.log("🎴 Affichage de", filtered.length, "cartes");

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
                ${card.image ? `<img src="${card.image}" alt="${card.name}" class="card-image">` : '<div class="card-icon">🃏</div>'}
                <div class="card-name">${card.name}</div>
                <div class="card-rarity">${rarityNames[card.rarity] || card.rarity}</div>
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

// Basculer favori
function toggleFavorite(cardId) {
    const card = inventory.find(c => c.id === cardId);
    if (card) {
        card.favorite = !card.favorite;
        saveInventory();
        renderCards();
    }
}

// Ouvrir la modal de carte
function openCardModal(card) {
    selectedCard = card;

    const rarityNames = {
        common: 'Commun',
        rare: 'Rare',
        legendary: 'Légendaire'
    };

    modalCard.className = `modal-card card ${card.rarity}`;
    
    // Afficher l'image si disponible
    if (card.image) {
        modalCardIcon.innerHTML = `<img src="${card.image}" alt="${card.name}" class="card-image">`;
    } else {
        modalCardIcon.textContent = '🃏';
    }
    
    modalCardName.textContent = card.name;
    modalCardRarity.textContent = rarityNames[card.rarity] || card.rarity;
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

// Event listeners pour la modal
if (modalClose) {
    modalClose.addEventListener('click', () => {
        cardModal.classList.remove('active');
    });
}

if (cardModal) {
    cardModal.addEventListener('click', (e) => {
        if (e.target === cardModal) {
            cardModal.classList.remove('active');
        }
    });
}

if (modalFavoriteBtn) {
    modalFavoriteBtn.addEventListener('click', () => {
        if (selectedCard) {
            toggleFavorite(selectedCard.id);
            openCardModal(selectedCard);
        }
    });
}

// Event listener pour le sélecteur de stats
if (statSelector) {
    statSelector.addEventListener('change', updateStats);
}

// Event listeners pour les boutons de tri
document.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSort = btn.dataset.sort;
        renderCards();
    });
});

// Event listeners pour les boutons de rareté
document.querySelectorAll('[data-rarity]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-rarity]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentRarity = btn.dataset.rarity;
        renderCards();
    });
});

// Event listener pour la recherche
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCards();
    });
}

// Fonction d'initialisation
function initialize() {
    console.log("🚀 Initialisation de l'inventaire...");
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.error("❌ Pas d'utilisateur connecté");
        // Créer un utilisateur par défaut pour les tests
        const defaultUser = { id: 'default_user', name: 'Joueur' };
        localStorage.setItem('current_user', JSON.stringify(defaultUser));
        currentUserId = defaultUser.id;
    } else {
        console.log("👤 Utilisateur:", currentUser);
        currentUserId = currentUser.id;
    }
    
    inventory = initInventory();
    
    console.log("📦 Inventaire chargé:", inventory);
    renderCards();
}

// Démarrer l'application
document.addEventListener('DOMContentLoaded', () => {
    console.log("📄 DOM chargé, démarrage...");
    initialize();
});
