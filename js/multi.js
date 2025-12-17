// multi.js – ajout de cartes dans la base de données avec IDs uniques

const API_URL = 'https://tcg-api-378m.onrender.com'; // ton API

const cardDatabase = [
  { id: 1, name: "Gourroux du Bios", rarity: "common", image: "cartes-pokémon/bios.png" },
  { id: 2, name: "Chishit", rarity: "common", image: "cartes-pokémon/chishit.png" },
  { id: 3, name: "Cours de Stat", rarity: "common", image: "cartes-pokémon/cours-stat.png" },
  { id: 4, name: "Fdp", rarity: "common", image: "cartes-pokémon/fdp.png" },
  { id: 5, name: "Danse de la forêt", rarity: "common", image: "cartes-pokémon/lagarde.png" },
  { id: 6, name: "Communication à nu", rarity: "common", image: "cartes-pokémon/stephane.png" },
  { id: 7, name: "Terminal", rarity: "common", image: "cartes-pokémon/terminal.png" },
  { id: 8, name: "Yume", rarity: "common", image: "cartes-pokémon/yume.png" },
  { id: 9, name: "Maxime-enfant", rarity: "common", image: "cartes-pokémon/maxime-enfant.png" },
  { id: 10, name: "Chef Etchebest", rarity: "common", image: "cartes-pokémon/chef-etchebest.png" },
  { id: 11, name: "Clash of Clans", rarity: "common", image: "cartes-pokémon/coc.png" },
  { id: 12, name: "Dorine", rarity: "common", image: "cartes-pokémon/dorine.png" },
  { id: 13, name: "Octane TW", rarity: "common", image: "cartes-pokémon/octane.png" },
  { id: 14, name: "Ouerdia", rarity: "common", image: "cartes-pokémon/ouerdia.png" },
  { id: 15, name: "Rocket Nathan", rarity: "common", image: "cartes-pokémon/nathan.png" },
  { id: 16, name: "Maman j'bicrave", rarity: "common", image: "cartes-pokémon/bicrave.png" },
  { id: 17, name: "entuca.fr", rarity: "common", image: "cartes-pokémon/ent.png" },
  { id: 18, name: "Centre Hospitalier", rarity: "common", image: "cartes-pokémon/bourg.png" },
  { id: 19, name: "Garage", rarity: "common", image: "cartes-pokémon/garage.png" },
  { id: 20, name: "Victime", rarity: "common", image: "cartes-pokémon/victime.png" },
  { id: 21, name: "Sermonien", rarity: "rare", image: "cartes-pokémon/bergeron.png" },
  { id: 22, name: "Boost de Visibilité", rarity: "rare", image: "cartes-pokémon/ciril.png" },
  { id: 23, name: "Loi Absolue", rarity: "rare", image: "cartes-pokémon/matter.png" },
  { id: 24, name: "Roi-Bios", rarity: "rare", image: "cartes-pokémon/roi-bios.png" },
  { id: 25, name: "Prêtresse du Java (pas jS)", rarity: "rare", image: "cartes-pokémon/vidal.png" },
  { id: 26, name: "Chef de projet... Sans projet", rarity: "rare", image: "cartes-pokémon/lilian.png" },
  { id: 27, name: "Burger King", rarity: "rare", image: "cartes-pokémon/bk.png" },
  { id: 28, name: "Clito 5", rarity: "rare", image: "cartes-pokémon/clito.png" },
  { id: 29, name: "Poignet Nicolas", rarity: "rare", image: "cartes-pokémon/nico.png" },
  { id: 30, name: "Proba", rarity: "rare", image: "cartes-pokémon/proba.png" },
  { id: 31, name: "NordVPN", rarity: "rare", image: "cartes-pokémon/vpn.png" },
  { id: 32, name: "Ciao Kombucha", rarity: "rare", image: "cartes-pokémon/ciao.png" },
  { id: 33, name: "Discord", rarity: "rare", image: "cartes-pokémon/discord.png" },
  { id: 34, name: "France Travail", rarity: "rare", image: "cartes-pokémon/travail.png" },
  { id: 35, name: "Twitter (X)", rarity: "rare", image: "cartes-pokémon/x.png" },
  { id: 36, name: "Dieu Suprême", rarity: "legendary", image: "cartes-pokémon/dieu.png" },
  { id: 37, name: "Grollemund", rarity: "legendary", image: "cartes-pokémon/Grollemund.png" },
  { id: 38, name: "Prêtresse du Python", rarity: "legendary", image: "cartes-pokémon/pretesse-python.png" },
  { id: 39, name: "Tablorien de Génie", rarity: "legendary", image: "cartes-pokémon/roux.png" },
  { id: 40, name: "Tentation à la fête", rarity: "legendary", image: "cartes-pokémon/tentation.png" },
  { id: 41, name: "Je suis Coach", rarity: "legendary", image: "cartes-pokémon/coach.png" },
  { id: 42, name: "Madaaaaaaaaaaaame", rarity: "legendary", image: "cartes-pokémon/madaaaaaaaaaaame.png" },
  { id: 43, name: "ChatGPT", rarity: "legendary", image: "cartes-pokémon/chatgpt.png" },
  { id: 44, name: "Multiprise de 5", rarity: "legendary", image: "cartes-pokémon/multiprise.png" },
  { id: 45, name: "Père Poignet Nicolas", rarity: "legendary", image: "cartes-pokémon/noel.png" },
  { id: 46, name: "Gentle M8", rarity: "legendary", image: "cartes-pokémon/m8.png" },
  { id: 47, name: "L'arabe", rarity: "legendary", image: "cartes-pokémon/arabe.png" }
];

// Ton code d'animation (bubbles, ouverture pack, etc.) reste IDENTIQUE – ne touche à rien ici

let allPackCards = [];

// ... ton code generatePackCards(), completeOpening(), showNextPack(), etc. reste exactement le même ...

// Ajout des cartes dans la base
async function addCardsToDB() {
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
        body: JSON.stringify({ userId, carteId: card.id }) // on envoie l'ID unique
      });
      if (response.ok) {
        console.log('✅ Carte ajoutée dans la base :', card.name, '(ID:', card.id, ')');
      }
    } catch (err) {
      console.error('Erreur ajout carte', err);
    }
  }
}

// Ton addCardsToInventory() (garde ton localStorage pour affichage immédiat)
async function addCardsToInventory() {
  console.log("🎴 Ajout des cartes à l'inventaire...");

  let currentUser = null;
  const userData = localStorage.getItem("current_user");
  if (!userData) {
    console.log("Pas d'utilisateur, création d'un utilisateur par défaut");
    currentUser = { id: 'default_user', name: 'Joueur' };
    localStorage.setItem('current_user', JSON.stringify(currentUser));
  } else {
    currentUser = JSON.parse(userData);
  }

  const userId = currentUser.id;
  console.log("👤 Utilisateur:", userId);

  let inventory = [];
  const inventoryData = localStorage.getItem(`inventory_${userId}`);
  if (inventoryData) {
    inventory = JSON.parse(inventoryData);
    console.log("📦 Inventaire actuel:", inventory.length, "cartes");
  } else {
    console.log("📦 Création d'un nouvel inventaire");
  }

  allPackCards.forEach(card => {
    const existing = inventory.find(c => c.name === card.name);
    if (existing) {
      existing.count += 1;
      console.log("➕ Carte existante:", card.name, "→ x" + existing.count);
    } else {
      const newCard = {
        id: Date.now() + Math.random(),
        name: card.name,
        rarity: card.rarity,
        image: card.image,
        count: 1,
        favorite: false,
        date: Date.now()
      };
      inventory.push(newCard);
      console.log("🆕 Nouvelle carte:", card.name);
    }
  });

  localStorage.setItem(`inventory_${userId}`, JSON.stringify(inventory));
  console.log('✅ Cartes ajoutées à la collection locale !');
  console.log('📦 Total:', inventory.length, 'cartes différentes');

  // Ajout dans la base
  await addCardsToDB();

  setTimeout(() => {
    window.location.href = 'inventaire.html';
  }, 1000);
}

function finishOpening() {
  console.log("🏁 Finalisation de l'ouverture...");
  addCardsToInventory();
}

function goBack() {
  window.history.back();
}
