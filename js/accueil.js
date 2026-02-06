document.addEventListener('DOMContentLoaded', () => {
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('tcg_user_email');
  const pseudo = localStorage.getItem('pseudo') || userEmail?.split('@')[0] || 'Joueur Invité';

  const statusElement = document.getElementById('status') || document.createElement('p');
  statusElement.id = 'status';
  statusElement.style.color = '#ffcc00';
  statusElement.style.textAlign = 'center';
  statusElement.style.margin = '20px';
  document.body.prepend(statusElement);

  if (!userId && !userEmail) {
    statusElement.textContent = 'Mode invité – pas de sauvegarde persistante';
    statusElement.style.color = '#ffaa00';
    // On continue quand même pour tester
  } else {
    statusElement.textContent = `Connecté en tant que ${pseudo}`;
    statusElement.style.color = '#0f0';
  }

  console.log('Utilisateur :', pseudo, '(ID/email :', userId || userEmail || 'aucun', ')');

  let gameState = {
    pseudo,
    level: 1,
    gems: localStorage.getItem('gems') ? parseInt(localStorage.getItem('gems')) : 100,
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
    localStorage.setItem('gems', gameState.gems);
    // Si connecté, on sauvegarde aussi sous userId
    if (userId) {
      localStorage.setItem('gameState_' + userId, JSON.stringify(gameState));
    }
  }

  const safeGetElement = (id) => document.getElementById(id);

  const openFreeBtn = safeGetElement('openFreeBtn');
  const openPaidBtn = safeGetElement('openPaidBtn');
  const timerText = safeGetElement('timerText');
  const freeBoosters = safeGetElement('freeBoosters');

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
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

  function updateUI() {
    const playerGems = safeGetElement('playerGems');
    if (playerGems) playerGems.textContent = gameState.gems;
    if (freeBoosters) freeBoosters.textContent = gameState.freeBoostersLeft;
    saveGameState();
  }

  const openBooster = (isPaid = false) => {
    if (!isPaid && gameState.freeBoostersLeft <= 0) {
      alert('Plus de boosters gratuits pour le moment ! Attends le timer.');
      return;
    }
    if (isPaid && gameState.gems < 100) {
      alert('Pas assez de gems ! (100 gems requis)');
      return;
    }

    if (!isPaid) {
      gameState.freeBoostersLeft--;
    } else {
      gameState.gems -= 100;
    }

    // Marque la quête "Ouvrir un booster" comme avancée
    const quest2 = gameState.quests.find(q => q.id === 2);
    if (quest2 && !quest2.completed) {
      quest2.progress = (quest2.progress || 0) + 1;
      if (quest2.progress >= quest2.max) quest2.completed = true;
    }

    // Même pour la quête 3
    const quest3 = gameState.quests.find(q => q.id === 3);
    if (quest3 && !quest3.completed) {
      quest3.progress = (quest3.progress || 0) + 1;
      if (quest3.progress >= quest3.max) quest3.completed = true;
    }

    updateUI();

    // Redirection vers la page d'ouverture de pack
    window.location.href = 'universite-multi.html'; // ou manga-multi.html selon ton choix
  };

  if (openFreeBtn) openFreeBtn.addEventListener('click', () => openBooster(false));
  if (openPaidBtn) openPaidBtn.addEventListener('click', () => openBooster(true));

  // Initialisation
  updateTimer();
  updateUI();
});
