// inventaire.js – stockage en base + visuel 100 % identique

const API_URL = 'https://tcg-api-378m.onrender.com'; // ← TON API

let inventory = [];
let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';
let selectedCard = null;
let currentUserId = null;

// Éléments DOM (TON CODE D'ORIGINE – INCHANGÉ)
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

// Récupère l'utilisateur connecté
function getCurrentUser() {
  currentUserId = localStorage.getItem('userId');
  if (!currentUserId) {
    alert('Tu dois être connecté pour voir ton inventaire');
    window.location.href = 'index.html';
    return null;
  }
  const pseudo = localStorage.getItem('pseudo') || localStorage.getItem('userEmail') || 'Joueur';
  return { id: currentUserId, name: pseudo };
}

// Charger l'inventaire depuis la base de données
async function loadInventoryFromDB() {
  try {
    const response = await fetch(`${API_URL}/api/collection?userId=${currentUserId}`);
    if (!response.ok) throw new Error('Erreur serveur');
    const data = await response.json();
    console.log('📦 Inventaire chargé depuis la base :', data.length, 'cartes');
    return data;
  } catch (err) {
    console.error('Erreur chargement base', err);
    alert('Impossible de charger l’inventaire depuis le serveur. Mode local activé.');
    return initInventory(); // fallback sur localStorage si API down
  }
}

// Sauvegarder une nouvelle carte dans la base
async function unlockCardInDB(carteId) {
  try {
    const response = await fetch(`${API_URL}/api/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId, carteId })
    });
    if (response.ok) {
      console.log('✅ Carte débloquée dans la base :', carteId);
    }
  } catch (err) {
    console.error('Erreur réseau ajout carte', err);
  }
}

// Initialisation – remplace ton initInventory()
async function initInventory() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  console.log('👤 Utilisateur connecté :', currentUser.name);

  // Charge depuis la base
  inventory = await loadInventoryFromDB();

  // Si vide, fallback localStorage (ton code d'origine)
  if (inventory.length === 0) {
    const inventoryData = localStorage.getItem(`inventory_${currentUserId}`);
    if (inventoryData) {
      inventory = JSON.parse(inventoryData);
      console.log('📦 Fallback localStorage :', inventory.length, 'cartes');
    }
  }

  renderCards();
}

// Sauvegarde – garde pour compatibilité avec ton code d'origine
function saveInventory() {
  if (!currentUserId) return;
  localStorage.setItem(`inventory_${currentUserId}`, JSON.stringify(inventory));
  console.log('✅ Inventaire sauvegardé en local (backup)');
}

// Trier l'inventaire (TON CODE D'ORIGINE – INCHANGÉ)
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

// Filtrer l'inventaire (TON CODE D'ORIGINE – INCHANGÉ)
function filterInventory() {
  let filtered = [...inventory];

  if (currentRarity !== 'all') {
    const rarityMap = {
      'legendary': 'legendary',
      'commun': 'common',
      'rare': 'rare',
      'favoris': 'favoris'
    };
    const targetRarity = rarityMap[currentRarity] || currentRarity;

    if (targetRarity === 'favoris') {
      filtered = filtered.filter(card => card.favorite === true);
    } else {
      filtered = filtered.filter(card => card.rarity === targetRarity);
    }
  }

  if (searchQuery) {
    filtered = filtered.filter(card => card.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  return sortInventory(filtered, currentSort);
}

// Calculer les statistiques (TON CODE D'ORIGINE – INCHANGÉ)
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

// Afficher les cartes (TON CODE D'ORIGINE – INCHANGÉ)
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

// Mettre à jour les statistiques (TON CODE D'ORIGINE – INCHANGÉ)
function updateStats() {
  const stat = calculateStats(statSelector.value);
  statValue.textContent = stat;
}

// Basculer favori (TON CODE D'ORIGINE – INCHANGÉ)
function toggleFavorite(cardId) {
  const card = inventory.find(c => c.id === cardId);
  if (card) {
    card.favorite = !card.favorite;
    saveInventory();
    renderCards();
  }
}

// Ouvrir la modal de carte (TON CODE D'ORIGINE – INCHANGÉ)
function openCardModal(card) {
  selectedCard = card;
  const rarityNames = {
    common: 'Commun',
    rare: 'Rare',
    legendary: 'Légendaire'
  };
  modalCard.className = `modal-card card ${card.rarity}`;

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

// Event listeners (TON CODE D'ORIGINE – INCHANGÉ)
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
if (statSelector) {
  statSelector.addEventListener('change', updateStats);
}
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
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCards();
  });
}

// Ouverture de pack – ajoute la carte dans la base + recharge
async function openPack() {
  const randomId = Math.floor(Math.random() * 200) + 1;
  await unlockCardInDB(randomId);
  alert('Nouvelle carte débloquée !');
  loadInventoryFromDB().then(() => renderCards());
}

// Démarrage
document.addEventListener('DOMContentLoaded', () => {
  console.log("📄 DOM chargé, démarrage...");
  initInventory();
});
