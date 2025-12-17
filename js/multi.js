// multi.js – ajout en localStorage + base de données

const API_URL = 'https://tcg-api-378m.onrender.com';

const cardDatabase = [
  { id: 1, name: "Gourroux du Bios", rarity: "common", image: "cartes-pokémon/bios.png" },
  { id: 2, name: "Chishit", rarity: "common", image: "cartes-pokémon/chishit.png" },
  // ... toutes tes cartes avec id unique jusqu'à 47 ...
  { id: 47, name: "L'arabe", rarity: "legendary", image: "cartes-pokémon/arabe.png" }
];

// Ton code d'animation (bubbles, generatePackCards, completeOpening, showNextPack, etc.) reste IDENTIQUE

let allPackCards = [];

// Ajout dans la base
async function addCardsToDatabase() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.log('Pas connecté – cartes ajoutées seulement en local');
    return;
  }

  for (const card of allPackCards) {
    try {
      const response = await fetch(`${API_URL}/api/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, carteId: card.id })
      });
      if (response.ok) {
        console.log('✅ Carte ajoutée dans la base :', card.name, '(ID:', card.id, ')');
      }
    } catch (err) {
      console.error('Erreur ajout en ligne', err);
    }
  }
}

// Ton addCardsToInventory() – garde ton localStorage + appel base
async function addCardsToInventory() {
  console.log("🎴 Ajout des cartes à l'inventaire...");

  let currentUser = null;
  const userData = localStorage.getItem("current_user");
  if (!userData) {
    currentUser = { id: 'default_user', name: 'Joueur' };
    localStorage.setItem('current_user', JSON.stringify(currentUser));
  } else {
    currentUser = JSON.parse(userData);
  }

  const userId = currentUser.id;

  let inventory = [];
  const inventoryData = localStorage.getItem(`inventory_${userId}`);
  if (inventoryData) {
    inventory = JSON.parse(inventoryData);
  }

  allPackCards.forEach(card => {
    const existing = inventory.find(c => c.name === card.name);
    if (existing) {
      existing.count += 1;
    } else {
      inventory.push({
        id: Date.now() + Math.random(),
        name: card.name,
        rarity: card.rarity,
        image: card.image,
        count: 1,
        favorite: false,
        date: Date.now()
      });
    }
  });

  localStorage.setItem(`inventory_${userId}`, JSON.stringify(inventory));

  // Ajout dans la base
  await addCardsToDatabase();

  setTimeout(() => {
    window.location.href = 'inventaire.html';
  }, 1000);
}

function finishOpening() {
  addCardsToInventory();
}

function goBack() {
  window.history.back();
}
