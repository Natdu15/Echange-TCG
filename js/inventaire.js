// inventaire.js – stockage en base + compatibilité avec ton code actuel

const API_URL = 'https://tcg-api-378m.onrender.com'; // ton API

let inventory = [];
let currentSort = 'date';
let currentRarity = 'all';
let searchQuery = '';
let selectedCard = null;
let currentUserId = null;

// Éléments DOM (garde ton code)
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
    alert('Tu dois être connecté');
    window.location.href = 'index.html';
    return null;
  }
  return { id: currentUserId };
}

// Charger l'inventaire depuis la base (priorité)
async function loadInventory() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  try {
    const response = await fetch(`${API_URL}/api/collection?userId=${currentUserId}`);
    const data = await response.json();
    inventory = data;
    console.log('📦 Inventaire chargé depuis la base :', inventory.length, 'cartes');

    if (inventory.length === 0) {
      emptyState.style.display = 'block';
      cardsGrid.innerHTML = '';
    } else {
      emptyState.style.display = 'none';
      renderCards();
    }
  } catch (err) {
    console.error('Erreur chargement base', err);
    // Fallback localStorage si API down
    initInventory();
  }
}

// Sauvegarder une carte dans la base
async function saveCardToDB(carteId) {
  try {
    const response = await fetch(`${API_URL}/api/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId, carteId })
    });
    if (response.ok) {
      console.log('✅ Carte sauvegardée dans la base :', carteId);
    }
  } catch (err) {
    console.error('Erreur sauvegarde base', err);
  }
}

// Remplace ta fonction d'ajout de carte (ex. openPack, addCard, etc.)
async function openPack() {
  const randomId = Math.floor(Math.random() * 200) + 1;
  await saveCardToDB(randomId);
  alert('Nouvelle carte débloquée !');
  loadInventory(); // recharge depuis la base
}

// Ton code d'origine pour renderCards, sortInventory, filterInventory, etc. reste INCHANGÉ
// (tri, modal, favoris, recherche, statistiques – tout fonctionne comme avant)

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  console.log("📄 DOM chargé, démarrage...");
  loadInventory();
});
