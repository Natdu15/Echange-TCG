// inventaire.js – version complète sans API, sans backend, 100% localStorage

let inventory = [];
let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';

// Récupère l'utilisateur (mode invité si pas connecté)
function getCurrentUser() {
  const email = localStorage.getItem('tcg_user_email');
  const pseudo = localStorage.getItem('tcg_user_pseudo') || (email ? email.split('@')[0] : 'Invité');

  return {
    id: email || 'guest_' + Date.now().toString(36).slice(-6),
    pseudo,
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
      inventory = [];
    }
  } else {
    inventory = [];
  }

  // Mode invité : ajoute des cartes visibles pour tester
  if (inventory.length === 0) {
    inventory = [
      { id: 'demo1', name: 'Pikachu VMAX', rarity: 'Ultra-rare', image: 'https://via.placeholder.com/220x300/FFD700/000?text=Pikachu+VMAX', date: new Date().toISOString() },
      { id: 'demo2', name: 'Dracaufeu EX', rarity: 'Rare', image: 'https://via.placeholder.com/220x300/FF4500/000?text=Dracaufeu+EX', date: new Date().toISOString() },
      { id: 'demo3', name: 'Mewtwo GX', rarity: 'Légendaire', image: 'https://via.placeholder.com/220x300/9370DB/000?text=Mewtwo+GX', date: new Date().toISOString() }
    ];
    saveInventory();
  }
}

// Sauvegarde dans localStorage
function saveInventory() {
  const user = getCurrentUser();
  localStorage.setItem(`tcg_inventory_${user.id}`, JSON.stringify(inventory));
}

// Fonction d'ajout (appelable depuis ouverture de pack)
window.addCard = function(card) {
  if (!card || !card.name) return;
  card.id = card.id || 'card_' + Date.now();
  card.date = new Date().toISOString();
  inventory.push(card);
  saveInventory();
  renderCards();
};

// Affichage des cartes
function renderCards() {
  const grid = document.getElementById('cardsGrid');
  const empty = document.getElementById('emptyState');

  if (!grid || !empty) {
    console.error('cardsGrid ou emptyState introuvable');
    return;
  }

  grid.innerHTML = '';

  let filtered = inventory.filter(c => {
    if (currentRarity !== 'all' && c.rarity !== currentRarity) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery)) return false;
    return true;
  });

  // Tri
  if (currentSort === 'date') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (currentSort === 'rarity') {
    const order = { 'Légendaire': 4, 'Ultra-rare': 3, 'Rare': 2, 'Commun': 1 };
    filtered.sort((a, b) => (order[b.rarity] || 0) - (order[a.rarity] || 0));
  } else if (currentSort === 'count') {
    // Si tu as un champ count plus tard
  }

  if (filtered.length === 0) {
    empty.style.display = 'block';
    grid.innerHTML = '';
    return;
  }

  empty.style.display = 'none';

  filtered.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${card.image || 'https://via.placeholder.com/220x300?text=' + encodeURIComponent(card.name)}" alt="${card.name}">
      <h3>${card.name}</h3>
      <p class="rarity">${card.rarity}</p>
      <small>${new Date(card.date).toLocaleDateString()}</small>
    `;
    div.onclick = () => {
      // Ouvre modal si tu veux
      console.log('Carte cliquée:', card);
      // Exemple modal basique :
      // document.getElementById('modalCardName').textContent = card.name;
      // document.getElementById('cardModal').style.display = 'flex';
    };
    grid.appendChild(div);
  });

  // Mise à jour compteur total (simple)
  const totalEl = document.getElementById('statValue');
  if (totalEl) totalEl.textContent = filtered.length;
}

// Chargement initial
document.addEventListener('DOMContentLoaded', () => {
  loadInventory();

  const status = document.getElementById('status');
  const user = getCurrentUser();
  if (status) {
    status.textContent = user.isGuest 
      ? 'Mode Invité – cartes temporaires (perdues au refresh)' 
      : `Inventaire de ${user.pseudo}`;
    status.style.color = user.isGuest ? '#ffaa00' : '#00ff88';
  }

  renderCards();

  // Événements filtres
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

  const search = document.getElementById('searchInput');
  if (search) {
    search.addEventListener('input', e => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderCards();
    });
  }
});
