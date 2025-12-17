// inventaire.js – charge depuis la base + fallback local

const API_URL = 'https://tcg-api-378m.onrender.com';

let inventory = [];
let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';
let selectedCard = null;
let currentUserId = null;

// Ton code DOM (inchangé)
const cardsGrid = document.getElementById('cardsGrid');
const emptyState = document.getElementById('emptyState');
// ... tous tes const ...

function getCurrentUser() {
  currentUserId = localStorage.getItem('userId');
  if (!currentUserId) {
    alert('Tu dois être connecté');
    window.location.href = 'index.html';
    return null;
  }
  return { id: currentUserId };
}

async function loadInventoryFromDB() {
  try {
    const response = await fetch(`${API_URL}/api/collection?userId=${currentUserId}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Erreur chargement base', err);
    return [];
  }
}

async function initInventory() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  inventory = await loadInventoryFromDB();

  if (inventory.length === 0) {
    emptyState.style.display = 'block';
    cardsGrid.innerHTML = '';
  } else {
    emptyState.style.display = 'none';
    renderCards();
  }
}

// Ton code renderCards, sortInventory, filterInventory, modal, etc. reste INCHANGÉ

document.addEventListener('DOMContentLoaded', () => {
  initInventory();
});
