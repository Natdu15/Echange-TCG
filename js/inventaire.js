// inventaire.js — version sans redirection, mode invité forcé, cartes visibles

let inventory = [];
let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';

// Utilisateur courant (toujours invité si pas de email)
function getCurrentUser() {
  const email = localStorage.getItem('tcg_user_email');
  const pseudo = localStorage.getItem('tcg_user_pseudo') || (email ? email.split('@')[0] : 'Invité');

  return {
    id: email || 'guest_' + Math.random().toString(36).slice(2, 8), // ID unique temporaire pour invité
    pseudo,
    isGuest: !email
  };
}

function loadInventory() {
  const user = getCurrentUser();
  const key = `tcg_inventory_${user.id}`;
  const saved = localStorage.getItem(key);

  inventory = saved ? JSON.parse(saved) : [];

  // Si vide → cartes de test visibles immédiatement
  if (inventory.length === 0) {
    inventory = [
      {
        id: 'demo1',
        name: 'Pikachu VMAX',
        rarity: 'Ultra-rare',
        image: 'https://via.placeholder.com/220x300/FFD700/000000?text=Pikachu+VMAX',
        date: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'demo2',
        name: 'Dracaufeu EX',
        rarity: 'Rare',
        image: 'https://via.placeholder.com/220x300/FF4500/000000?text=Dracaufeu+EX',
        date: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'demo3',
        name: 'Mewtwo GX',
        rarity: 'Légendaire',
        image: 'https://via.placeholder.com/220x300/9370DB/000000?text=Mewtwo+GX',
        date: new Date().toISOString()
      }
    ];
    saveInventory();
  }
}

function saveInventory() {
  const user = getCurrentUser();
  localStorage.setItem(`tcg_inventory_${user.id}`, JSON.stringify(inventory));
}

function renderCards() {
  const grid = document.getElementById('cardsGrid');
  const empty = document.getElementById('emptyState');

  if (!grid || !empty) return;

  grid.innerHTML = '';
  let filtered = inventory.filter(c => {
    if (currentRarity !== 'all' && c.rarity !== currentRarity) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery)) return false;
    return true;
  });

  // Tri basique
  if (currentSort === 'date') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (currentSort === 'rarity') {
    const order = { 'Légendaire': 4, 'Ultra-rare': 3, 'Rare': 2, 'Commun': 1 };
    filtered.sort((a, b) => (order[b.rarity] || 0) - (order[a.rarity] || 0));
  }

  if (filtered.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  filtered.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${card.image}" alt="${card.name}">
      <h3>${card.name}</h3>
      <p class="rarity">${card.rarity}</p>
      <small>${new Date(card.date).toLocaleDateString()}</small>
    `;
    grid.appendChild(div);
  });

  // Mise à jour compteur simple
  const total = document.getElementById('statValue');
  if (total) total.textContent = filtered.length;
}

// Événements filtres
document.addEventListener('DOMContentLoaded', () => {
  loadInventory();

  // Statut
  const status = document.getElementById('status');
  const user = getCurrentUser();
  if (status) {
    status.textContent = user.isGuest ? 'Mode Invité — cartes temporaires' : `Inventaire de ${user.pseudo}`;
    status.style.color = user.isGuest ? '#ffaa00' : '#00ff88';
  }

  renderCards();

  // Tri
  document.querySelectorAll('[data-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSort = btn.dataset.sort;
      renderCards();
    });
  });

  // Rareté
  document.querySelectorAll('[data-rarity]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-rarity]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRarity = btn.dataset.rarity;
      renderCards();
    });
  });

  // Recherche
  const search = document.getElementById('searchInput');
  if (search) {
    search.addEventListener('input', e => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderCards();
    });
  }
});
