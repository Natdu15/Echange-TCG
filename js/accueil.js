// accueil.js – version corrigée (plus d'erreur getCurrentUser)

document.addEventListener('DOMContentLoaded', () => {
  // Récupère l'utilisateur depuis localStorage (comme dans tes autres fichiers)
  const userId = localStorage.getItem('userId');
  const pseudo = localStorage.getItem('pseudo') || localStorage.getItem('userEmail') || 'Joueur';

  if (!userId) {
    console.log('Pas connecté – redirige vers connexion');
    window.location.href = 'index.html';
    return;
  }

  console.log('Utilisateur connecté sur accueil :', pseudo, '(ID:', userId, ')');

  let gameState = {
    pseudo: pseudo,
    level: 1,
    gems: 100,
    avatar: '🎮',
    freeBoostersLeft: 2,
    timeUntilNextBooster: 12 * 60 * 60,
    quests: [
      { id: 1, title: 'Connexion au jeu', reward: 50, completed: true, progress: 1, max: 1 },
      { id: 2, title: 'Ouvrir un booster', reward: 100, completed: false, progress: 0, max: 1 },
      { id: 3, title: 'Ouvrir 2 boosters', reward: 200, completed: false, progress: 0, max: 2 },
      { id: 4, title: 'Faire un combat', reward: 150, completed: false, progress: 0, max: 1 }
    ]
  };

  // Sauvegarder l'état (dans localStorage pour l'instant)
  function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }

  // Éléments DOM
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  const boosterPacks = document.querySelectorAll('.booster-pack');
  const openFreeBtn = document.getElementById('openFreeBtn');
  const openPaidBtn = document.getElementById('openPaidBtn');
  const cardsReveal = document.getElementById('cardsReveal');
  const cardsGrid = document.getElementById('cardsGrid');
  const closeCards = document.getElementById('closeCards');
  const questsBtn = document.getElementById('questsBtn');
  const questsPanel = document.getElementById('questsPanel');
  const navItems = document.querySelectorAll('.nav-item');

  // Timer
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  }

  function updateTimer() {
    if (gameState.timeUntilNextBooster > 0) {
      gameState.timeUntilNextBooster--;
    } else if (gameState.freeBoostersLeft < 2) {
      gameState.freeBoostersLeft++;
      gameState.timeUntilNextBooster = 12 * 60 * 60;
    }

    document.getElementById('timerText').textContent = formatTime(gameState.timeUntilNextBooster);
    document.getElementById('freeBoosters').textContent = gameState.freeBoostersLeft;

    saveGameState();
  }

  setInterval(updateTimer, 1000);

  // Update UI
  function updateUI() {
    document.getElementById('playerGems').textContent = gameState.gems;
    document.getElementById('dropdownGems').textContent = gameState.gems;
    document.getElementById('freeBoosters').textContent = gameState.freeBoostersLeft;
    renderQuests();
    saveGameState();
  }

  // Profile Dropdown
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });
  }

  document.addEventListener('click', () => {
    profileDropdown.classList.remove('active');
    questsPanel.classList.remove('active');
  });

  if (profileDropdown) profileDropdown.addEventListener('click', (e) => e.stopPropagation());

  // Quests
  if (questsBtn) {
    questsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      questsPanel.classList.toggle('active');
    });
  }

  if (questsPanel) questsPanel.addEventListener('click', (e) => e.stopPropagation());

  function renderQuests() {
    const questsList = document.getElementById('questsList');
    if (!questsList) return;
    questsList.innerHTML = '';

    gameState.quests.forEach(quest => {
      const questItem = document.createElement('div');
      questItem.className = `quest-item ${quest.completed ? 'completed' : ''}`;

      const progressPercent = (quest.progress / quest.max) * 100;

      questItem.innerHTML = `
        <div class="quest-title">${quest.title}</div>
        <div class="quest-progress">
          <span>${quest.progress}/${quest.max}</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <span class="quest-reward">+${quest.reward} 💎</span>
        </div>
        <button class="claim-btn" ${!quest.completed ? 'disabled' : ''} onclick="claimQuest(${quest.id})">
          ${quest.completed ? 'Réclamer' : 'En cours...'}
        </button>
      `;

      questsList.appendChild(questItem);
    });
  }

  window.claimQuest = function(questId) {
    const quest = gameState.quests.find(q => q.id === questId);
    if (quest && quest.completed) {
      gameState.gems += quest.reward;
      quest.completed = false;
      quest.progress = 0;
      updateUI();

      const gemsDisplay = document.getElementById('playerGems');
      if (gemsDisplay) {
        gemsDisplay.style.transform = 'scale(1.3)';
        gemsDisplay.style.color = '#fbbf24';
        setTimeout(() => {
          gemsDisplay.style.transform = 'scale(1)';
          gemsDisplay.style.color = '';
        }, 300);
      }
    }
  };

  // Ouvrir booster (redirection vers le pack)
  function openBooster(isPaid = false) {
    if (!isPaid && gameState.freeBoostersLeft <= 0) {
      alert('Plus de boosters gratuits ! Revenez dans ' + formatTime(gameState.timeUntilNextBooster));
      return;
    }
    if (isPaid && gameState.gems < 100) {
      alert('Pas assez de Gems ! (100 Gems requis)');
      return;
    }

    if (!isPaid) gameState.freeBoostersLeft--;
    else gameState.gems -= 100;

    updateQuestProgress(2, 1);
    updateQuestProgress(3, 1);
    updateUI();

    // Redirection vers le pack (manga-multi ou universite-multi)
    window.location.href = 'manga-multi.html'; // ou 'universite-multi.html'
  }

  function updateQuestProgress(questId, amount) {
    const quest = gameState.quests.find(q => q.id === questId);
    if (quest && !quest.completed && quest.progress < quest.max) {
      quest.progress = Math.min(quest.progress + amount, quest.max);
      if (quest.progress >= quest.max) quest.completed = true;
    }
  }

  // Boutons
  if (openFreeBtn) openFreeBtn.addEventListener('click', () => openBooster(false));
  if (openPaidBtn) openPaidBtn.addEventListener('click', () => openBooster(true));

  // Fermer les cartes révélées
  if (closeCards) {
    closeCards.addEventListener('click', () => {
      cardsReveal.classList.remove('active');
      document.body.classList.remove('legendary-bg', 'epic-bg');
    });
  }

  // Navigation
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Initialisation
  renderQuests();
  updateTimer();
  updateUI();
});
