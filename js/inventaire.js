// inventaire.js – version finale avec stockage en base de données

const API_URL = 'https://tcg-api-378m.onrender.com'; // ← TON API

let inventory = [];
let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';
let selectedCard = null;
let currentUserId = null;

// Récupère l'utilisateur connecté depuis la connexion (userId mis par login/register)
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
    if (!response.ok) throw new Error('Erreur API');
    const data = await response.json();
    console.log('📦 Inventaire chargé depuis la base :', data.length, 'cartes');
    return data; // [{carte_id, quantite}, ...]
  } catch (err) {
    console.error('Erreur chargement depuis la base', err);
    alert('Impossible de charger l’inventaire depuis le serveur. Mode local activé en fallback.');
    return []; // fallback vide si API down
  }
}

// Sauvegarder une nouvelle carte dans la base
async function addCardToDB(carteId) {
  try {
    const response = await fetch(`${API_URL}/api/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId, carteId })
    });
    if (response.ok) {
      console.log('✅ Carte ajoutée dans la base :', carteId);
    } else {
      console.error('Erreur ajout carte');
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

  // Charge depuis la base au lieu de localStorage
  inventory = await loadInventoryFromDB();

  // Si vide, tu peux ajouter des cartes de départ (optionnel)
  if (inventory.length === 0) {
    console.log('📦 Inventaire vide – ajout de cartes de départ');
    const starterCards = [1, 2, 3, 4, 5]; // exemple
    for (const id of starterCards) {
      await addCardToDB(id);
    }
    inventory = await loadInventoryFromDB();
  }

  renderCards(); // ta fonction d'affichage d'origine
}

// Sauvegarde – plus besoin de localStorage (tout est dans la base)
function saveInventory() {
  console.log('✅ Inventaire déjà synchronisé avec la base de données');
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
    filtered = filtered.filter(card =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
    saveInventory(); // même si on n’utilise plus localStorage, on garde la fonction pour compatibilité
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

// Fonction d'ouverture de pack (exemple – tu peux l’appeler depuis un bouton)
async function openPack() {
  const randomId = Math.floor(Math.random() * 200) + 1;
  await addCardToDB(randomId);
  alert('Nouvelle carte débloquée !');
  loadInventoryFromDB().then(() => renderCards());
}

// Démarrage
document.addEventListener('DOMContentLoaded', () => {
  console.log("📄 DOM chargé, démarrage...");
  initInventory();
});
