// inventaire.js – 100 % localStorage (sans API, sans base de données)

let inventory = [];
let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';
let selectedCard = null;

// Récupère l'utilisateur (ou mode invité)
function getCurrentUser() {
  const userId = localStorage.getItem('userId') || localStorage.getItem('tcg_user_email') || 'guest';
  const pseudo = localStorage.getItem('pseudo') || localStorage.getItem('tcg_user_pseudo') || 'Joueur Invité';

  // Si pas connecté → mode invité
  if (userId === 'guest') {
    console.log('Mode invité – inventaire temporaire');
    return { id: 'guest', pseudo };
  }

  return { id: userId, pseudo };
}

// Charge l'inventaire depuis localStorage
function loadInventory() {
  const user = getCurrentUser();
  const key = `tcg_inventory_${user.id}`;

  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      inventory = JSON.parse(saved);
      return;
    } catch (e) {
      console.warn('Inventaire corrompu → reset', e);
    }
  }

  // Si rien n'existe → inventaire vide par défaut
  inventory = [];
}

// Sauvegarde l'inventaire dans localStorage
function saveInventory() {
  const user = getCurrentUser();
  const key = `tcg_inventory_${user.id}`;
  localStorage.setItem(key, JSON.stringify(inventory));
}

// Fonction d'ajout de carte (exemple – appelle-la quand tu ouvres un pack)
window.addCard = function(card) {
  // card = { id: '...', name: '...', rarity: '...', image: '...', date: new Date().toISOString() }
  inventory.push(card);
  saveInventory();
  renderCards(); // ou ta fonction d'affichage
  // Optionnel : marque la quête "Ouvrir un booster"
};

// Charge au démarrage
document.addEventListener('DOMContentLoaded', () => {
  loadInventory();

  const cardsGrid = document.getElementById('cardsGrid');
  const emptyState = document.getElementById('emptyState');

  if (!cardsGrid || !emptyState) {
    console.error('Éléments cardsGrid ou emptyState introuvables');
    return;
  }

  if (inventory.length === 0) {
    emptyState.style.display = 'block';
    cardsGrid.innerHTML = '';
  } else {
    emptyState.style.display = 'none';
    renderCards(); // ← ton code renderCards doit exister dans le fichier ou dans le HTML
  }

  // Optionnel : affiche pseudo en haut si tu as un élément
  const pseudoEl = document.getElementById('pseudo-display');
  if (pseudoEl) {
    const user = getCurrentUser();
    pseudoEl.textContent = user.pseudo;
  }
});

// --------------------------------------------------
// Exemple de fonction renderCards (à adapter à ton code existant)
function renderCards() {
  const cardsGrid = document.getElementById('cardsGrid');
  if (!cardsGrid) return;

  cardsGrid.innerHTML = '';

  // Tri et filtre simples (adapte selon tes besoins)
  let filtered = [...inventory];

  if (currentRarity !== 'all') {
    filtered = filtered.filter(c => c.rarity === currentRarity);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c => c.name?.toLowerCase().includes(q));
  }

  // Tri exemple (date, nom, rareté…)
  if (currentSort === 'date') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (currentSort === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === 'rarity') {
    const order = ['Commune', 'Rare', 'Ultra-rare', 'Légendaire'];
    filtered.sort((a, b) => order.indexOf(b.rarity) - order.indexOf(a.rarity));
  }

  if (filtered.length === 0) {
    cardsGrid.innerHTML = '<p>Aucune carte ne correspond à ta recherche.</p>';
    return;
  }

  filtered.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.innerHTML = `
      <img src="${card.image || 'placeholder-card.png'}" alt="${card.name}">
      <h3>${card.name}</h3>
      <p>${card.rarity}</p>
      <small>Obtenue le ${new Date(card.date).toLocaleDateString()}</small>
    `;
    cardEl.onclick = () => {
      selectedCard = card;
      // ouvre ton modal si tu en as un
      console.log('Carte sélectionnée :', card);
    };
    cardsGrid.appendChild(cardEl);
  });
}

// Fonctions de tri / filtre (exemple – à connecter à tes boutons)
window.sortBy = function(type) {
  currentSort = type;
  renderCards();
};

window.filterRarity = function(rarity) {
  currentRarity = rarity;
  renderCards();
};

window.searchCards = function(query) {
  searchQuery = query;
  renderCards();
};
