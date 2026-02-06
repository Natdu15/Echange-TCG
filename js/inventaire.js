// inventaire.js – 100% localStorage – affiche exactement les cartes ajoutées depuis l'ouverture de booster

let inventory = [];
let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';

// Récupère l'utilisateur (priorité à tcg_user_email, fallback default_user pour matcher universite.js)
function getCurrentUser() {
  let userId = localStorage.getItem('tcg_user_email') ||
               localStorage.getItem('userId') ||
               localStorage.getItem('pseudo') ||
               'default_user';  // ← correspond à ton log "Utilisateur: default_user"

  const pseudo = localStorage.getItem('tcg_user_pseudo') ||
                 (userId.includes('@') ? userId.split('@')[0] : 'Invité');

  return {
    id: userId,
    pseudo,
    isGuest: userId === 'default_user' || !localStorage.getItem('tcg_user_email')
  };
}

// Charge l'inventaire depuis localStorage (même clé que universite.js)
function loadInventory() {
  const user = getCurrentUser();
  const key = `tcg_inventory_${user.id}`;
  const saved = localStorage.getItem(key);

  if (saved) {
    try {
      inventory = JSON.parse(saved);
      console.log(`Inventaire chargé depuis clé "${key}" – ${inventory.length} cartes`);
    } catch (e) {
      console.warn('Inventaire corrompu → reset');
      inventory = [];
    }
  } else {
    inventory = [];
    console.log(`Aucun inventaire trouvé pour clé "${key}" – démarrage vide`);
  }
}

// Sauvegarde (appelée après ajout si besoin)
function saveInventory() {
  const user = getCurrentUser();
  const key = `tcg_inventory_${user.id}`;
  localStorage.setItem(key, JSON.stringify(inventory));
  console.log(`Inventaire sauvegardé (${inventory.length} cartes) clé: ${key}`);
}

// Fonction d'ajout (appelable depuis universite.js si besoin)
window.addCard = function(card) {
  if (!card || !card.name) return;
  card.id = card.id || 'card_' + Date.now();
  card.date = card.date || new Date().toISOString();

  // Vérifie si déjà possédée (optionnel – pour gérer les quantités si tu veux)
  const existing = inventory.find(c => c.name === card.name && c.rarity === card.rarity);
  if (existing) {
    existing.count = (existing.count || 1) + 1;
  } else {
    card.count = 1;
    inventory.push(card);
  }

  saveInventory();
  renderCards();
};

// Affichage des cartes
function renderCards() {
  const grid = document.getElementById('cardsGrid');
  const empty = document.getElementById('emptyState');
  const totalEl = document.getElementById('statValue');

  if (!grid || !empty) {
    console.error('cardsGrid ou emptyState introuvable dans le HTML');
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
    filtered.sort((a, b) => (b.count || 1) - (a.count || 1));
  }

  if (filtered.length === 0) {
    empty.style.display = 'block';
    if (totalEl) totalEl.textContent = '0';
    return;
  }

  empty.style.display = 'none';

  filtered.forEach(card => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${card.image || 'https://picsum.photos/220/300?random=' + Math.floor(Math.random()*100)}" alt="${card.name}">
      <h3>${card.name}</h3>
      <p class="rarity">${card.rarity || 'Inconnue'}</p>
      <small>Obtenue le ${new Date(card.date).toLocaleDateString()}</small>
      ${card.count > 1 ? `<span class="count">x${card.count}</span>` : ''}
    `;
    div.onclick = () => console.log('Carte cliquée:', card); // remplace par ton modal si besoin
    grid.appendChild(div);
  });

  // Compteur total
  if (totalEl) totalEl.textContent = filtered.length;
}

// Chargement initial
document.addEventListener('DOMContentLoaded', () => {
  loadInventory();

  const status = document.getElementById('status');
  const user = getCurrentUser();
  if (status) {
    status.textContent = user.isGuest 
      ? 'Mode Invité – cartes temporaires' 
      : `Inventaire de ${user.pseudo}`;
    status.style.color = user.isGuest ? '#ffaa00' : '#00ff88';
  }

  renderCards();

  // Événements filtres / tri / recherche (déjà dans ton HTML)
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
