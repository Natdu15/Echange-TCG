// inventaire.js – version 100% localStorage, sans API, sans redirection forcée

let inventory = [];
let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';
let selectedCard = null;

// Récupère l'utilisateur (fallback invité si pas connecté)
function getCurrentUser() {
  const email = localStorage.getItem('tcg_user_email');
  const pseudo = localStorage.getItem('tcg_user_pseudo') || (email ? email.split('@')[0] : 'Invité');

  return {
    id: email || 'guest',
    pseudo: pseudo,
    isGuest: !email
  };
}

// Charge l'inventaire depuis localStorage
function loadInventory() {
  const user = getCurrentUser();
  const key = `tcg_inventory_${user.id}`;
  const saved = localStorage.getItem(key);

  if (saved) {
    try {
      inventory = JSON.parse(saved);
    } catch (e) {
      console.warn('Inventaire corrompu, reset');
      inventory = [];
    }
  } else {
    inventory = [];
  }

  // Si vide ET mode invité → ajoute 2 cartes de test pour voir quelque chose
  if (inventory.length === 0 && user.isGuest) {
    inventory = [
      { id: 'test1', name: 'Pikachu VMAX', rarity: 'Ultra-rare', image: 'https://via.placeholder.com/200x280/FFD700/000?text=Pikachu', date: new Date().toISOString() },
      { id: 'test2', name: 'Dracaufeu EX', rarity: 'Rare', image: 'https://via.placeholder.com/200x280/FF4500/000?text=Dracaufeu', date: new Date().toISOString() }
    ];
    saveInventory();
  }
}

// Sauvegarde
function saveInventory() {
  const user = getCurrentUser();
  const key = `tcg_inventory_${user.id}`;
  localStorage.setItem(key, JSON.stringify(inventory));
}

// Ajout de carte (appelable depuis les pages d'ouverture de pack)
window.addCard = function(card) {
  if (!card || !card.name) return;
  card.id = card.id || 'card_' + Date.now();
  card.date = card.date || new Date().toISOString();
  inventory.push(card);
  saveInventory();
  renderCards();  // ton renderCards doit exister
};

// DOM elements (avec checks)
const cardsGrid = document.getElementById('cardsGrid');
const emptyState = document.getElementById('emptyState');

// Affichage pseudo si présent
const pseudoDisplay = document.getElementById('pseudo-display') || document.getElementById('player-name');
if (pseudoDisplay) {
  const user = getCurrentUser();
  pseudoDisplay.textContent = user.pseudo;
}

// Message mode invité
const statusEl = document.getElementById('status') || document.createElement('p');
if (!document.getElementById('status')) {
  statusEl.id = 'status';
  statusEl.style.color = '#ffcc00';
  statusEl.style.textAlign = 'center';
  statusEl.style.margin = '20px 0';
  document.body.insertBefore(statusEl, document.body.firstChild);
}
const user = getCurrentUser();
statusEl.textContent = user.isGuest ? 'Mode Invité – cartes temporaires (effacées au refresh)' : `Inventaire de ${user.pseudo}`;

// Chargement initial
document.addEventListener('DOMContentLoaded', () => {
  loadInventory();

  if (!cardsGrid || !emptyState) {
    console.error('Éléments cardsGrid ou emptyState manquants dans le HTML');
    return;
  }

  if (inventory.length === 0) {
    emptyState.style.display = 'block';
    cardsGrid.innerHTML = '';
  } else {
    emptyState.style.display = 'none';
    renderCards();  // ← assure-toi que cette fonction existe dans ton code
  }
});

// --------------------------------------------------
// Exemple minimal de renderCards (à FUSIONNER avec ton code existant)
function renderCards() {
  if (!cardsGrid) return;
  cardsGrid.innerHTML = '';

  let filtered = inventory.slice();

  if (currentRarity !== 'all') {
    filtered = filtered.filter(c => c.rarity === currentRarity);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c => c.name?.toLowerCase().includes(q));
  }

  // Tri
  if (currentSort === 'date') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (currentSort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === 'rarity') {
    const order = ['Commune', 'Rare', 'Ultra-rare', 'Légendaire'];
    filtered.sort((a, b) => order.indexOf(b.rarity || 'Commune') - order.indexOf(a.rarity || 'Commune'));
  }

  if (filtered.length === 0) {
    cardsGrid.innerHTML = '<p>Aucune carte trouvée.</p>';
    return;
  }

  filtered.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card-item';
    div.innerHTML = `
      <img src="${card.image || 'https://via.placeholder.com/200x280?text=Carte'}" alt="${card.name}">
      <h4>${card.name}</h4>
      <p>${card.rarity || 'Inconnue'}</p>
      <small>${new Date(card.date).toLocaleDateString()}</small>
    `;
    div.onclick = () => {
      selectedCard = card;
      // ouvre modal si tu en as un
      console.log('Carte cliquée :', card);
    };
    cardsGrid.appendChild(div);
  });
}

// Fonctions de contrôle (connecte-les à tes boutons HTML)
window.sortInventory = function(type) {
  currentSort = type;
  renderCards();
};

window.filterByRarity = function(rarity) {
  currentRarity = rarity;
  renderCards();
};

window.search = function(query) {
  searchQuery = query;
  renderCards();
};
