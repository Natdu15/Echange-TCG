// accueil.js – version 100% sûre (vérifie les éléments avant de les utiliser)

document.addEventListener('DOMContentLoaded', () => {
  const userId = localStorage.getItem('userId');
  const pseudo = localStorage.getItem('pseudo') || localStorage.getItem('userEmail') || 'Joueur';

  if (!userId) {
    console.log('Pas connecté – redirige vers connexion');
    window.location.href = 'index.html';
    return;
  }

  console.log('Utilisateur connecté :', pseudo, '(ID:', userId, ')');

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

  function saveGameState() {
    localStorage.setItem('gameState_' + userId, JSON.stringify(gameState));
  }

  // Vérifie que l'élément existe avant de l'utiliser
  const safeGetElement = (id) => document.getElementById(id);

  const profileBtn = safeGetElement('profileBtn');
  const profileDropdown = safeGetElement('profileDropdown');
  const openFreeBtn = safeGetElement('openFreeBtn');
  const openPaidBtn = safeGetElement('openPaidBtn');
  const questsBtn = safeGetElement('questsBtn');
  const questsPanel = safeGetElement('questsPanel');
  const navItems = document.querySelectorAll('.nav-item');

  // Timer – seulement si les éléments existent
  const timerText = safeGetElement('timerText');
  const freeBoosters = safeGetElement('freeBoosters');

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

    if (timerText) timerText.textContent = formatTime(gameState.timeUntilNextBooster);
    if (freeBoosters) freeBoosters.textContent = gameState.freeBoostersLeft;

    saveGameState();
  }

  setInterval(updateTimer, 1000);

  // Update UI
  function updateUI() {
    const playerGems = safeGetElement('playerGems');
    const dropdownGems = safeGetElement('dropdownGems');
    if (playerGems) playerGems.textContent = gameState.gems;
    if (dropdownGems) dropdownGems.textContent = gameState.gems;
    if (freeBoosters) freeBoosters.textContent = gameState.freeBoostersLeft;
    renderQuests();
    saveGameState();
  }

  function renderQuests() {
    const questsList = safeGetElement('questsList');
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
    }
  };

  // Profile Dropdown
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
    });
  }

  document.addEventListener('click', () => {
    if (profileDropdown) profileDropdown.classList.remove('active');
    if (questsPanel) questsPanel.classList.remove('active');
  });

  // Quests
  if (questsBtn && questsPanel) {
    questsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      questsPanel.classList.toggle('active');
    });
  }

  // Ouvrir booster
  if (openFreeBtn || openPaidBtn) {
    const openBooster = (isPaid = false) => {
      if (!isPaid && gameState.freeBoostersLeft <= 0) {
        alert('Plus de boosters gratuits !');
        return;
      }
      if (isPaid && gameState.gems < 100) {
        alert('Pas assez de gems !');
        return;
      }

      if (!isPaid) gameState.freeBoostersLeft--;
      else gameState.gems -= 100;

      updateUI();

      window.location.href = 'universite-multi.html'; // ou manga-multi.html
    };

    if (openFreeBtn) openFreeBtn.addEventListener('click', () => openBooster(false));
    if (openPaidBtn) openPaidBtn.addEventListener('click', () => openBooster(true));
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
