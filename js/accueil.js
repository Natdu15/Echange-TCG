const currentUser = getCurrentUser();
if (!currentUser) {
    window.location.href = 'index.html';
}
// État du jeu basé sur l'utilisateur connecté
let gameState = {
    pseudo: currentUser.username,
    level: currentUser.level || 1,
    gems: currentUser.gems || 100,
    avatar: currentUser.avatar || '🎮',
    freeBoostersLeft: currentUser.freeBoostersLeft || 2,
    timeUntilNextBooster: currentUser.timeUntilNextBooster || 12 * 60 * 60,
    quests: currentUser.quests || [
        { id: 1, title: 'Connexion au jeu', reward: 50, completed: true, progress: 1, max: 1 },
        { id: 2, title: 'Ouvrir un booster', reward: 100, completed: false, progress: 0, max: 1 },
        { id: 3, title: 'Ouvrir 2 boosters', reward: 200, completed: false, progress: 0, max: 2 },
        { id: 4, title: 'Faire un combat', reward: 150, completed: false, progress: 0, max: 1 }
    ]
};

// Sauvegarder l'état
function saveGameState() {
    currentUser.level = gameState.level;
    currentUser.gems = gameState.gems;
    currentUser.avatar = gameState.avatar;
    currentUser.freeBoostersLeft = gameState.freeBoostersLeft;
    currentUser.timeUntilNextBooster = gameState.timeUntilNextBooster;
    currentUser.quests = gameState.quests;
    saveCurrentUser(currentUser);
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
profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
});

document.addEventListener('click', () => {
    profileDropdown.classList.remove('active');
    questsPanel.classList.remove('active');
});

profileDropdown.addEventListener('click', (e) => e.stopPropagation());

// Quests
questsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    questsPanel.classList.toggle('active');
});

questsPanel.addEventListener('click', (e) => e.stopPropagation());

function renderQuests() {
    const questsList = document.getElementById('questsList');
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

function claimQuest(questId) {
    const quest = gameState.quests.find(q => q.id === questId);
    if (quest && quest.completed) {
        gameState.gems += quest.reward;
        quest.completed = false;
        quest.progress = 0;
        updateUI();
        
        const gemsDisplay = document.getElementById('playerGems');
        gemsDisplay.style.transform = 'scale(1.3)';
        gemsDisplay.style.color = '#fbbf24';
        setTimeout(() => {
            gemsDisplay.style.transform = 'scale(1)';
            gemsDisplay.style.color = '';
        }, 300);
    }
}

// Ouvrir booster
function getRandomRarity() {
    const rand = Math.random();
    if (rand < 0.6) return 'common';
    if (rand < 0.85) return 'rare';
    if (rand < 0.97) return 'epic';
    return 'legendary';
}

function openBooster(isPaid = false) {
    if (!isPaid && gameState.freeBoostersLeft <= 0) {
        alert('Plus de boosters gratuits ! Revenez dans ' + formatTime(gameState.timeUntilNextBooster));
        return;
    }

    if (isPaid && gameState.gems < 100) {
        alert('Pas assez de Gems ! (100 Gems requis)');
        return;
    }

    const pack = boosterPacks[0];
    pack.classList.add('opening');

    setTimeout(() => {
        const cards = [];
        const numCards = isPaid ? 50 : 5;
        
        for (let i = 0; i < numCards; i++) {
            const rarity = getRandomRarity();
            cards.push({
                id: Date.now() + i,
                name: `Carte ${i + 1}`,
                rarity: rarity,
                icon: '🃏'
            });
        }

        pack.classList.remove('opening');
        displayCards(cards);

        if (!isPaid) gameState.freeBoostersLeft--;
        else gameState.gems -= 100;

        updateQuestProgress(2, 1);
        updateQuestProgress(3, 1);

        updateUI();
    }, 2000);
}

function updateQuestProgress(questId, amount) {
    const quest = gameState.quests.find(q => q.id === questId);
    if (quest && !quest.completed && quest.progress < quest.max) {
        quest.progress = Math.min(quest.progress + amount, quest.max);
        if (quest.progress >= quest.max) quest.completed = true;
    }
}

function displayCards(cards) {
    cardsGrid.innerHTML = '';
    
    const hasLegendary = cards.some(c => c.rarity === 'legendary');
    const hasEpic = cards.some(c => c.rarity === 'epic');
    
    if (hasLegendary) document.body.classList.add('legendary-bg');
    else if (hasEpic) document.body.classList.add('epic-bg');

    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${card.rarity}`;
        cardEl.style.animationDelay = `${index * 0.1}s`;
        const rarityNames = { common: 'Commun', rare: 'Rare', epic: 'Épique', legendary: 'Légendaire' };
        cardEl.innerHTML = `
            <div class="card-icon">${card.icon}</div>
            <div class="card-name">${card.name}</div>
            <div class="card-rarity">${rarityNames[card.rarity]}</div>
        `;
        cardsGrid.appendChild(cardEl);
    });

    cardsReveal.classList.add('active');
}

closeCards.addEventListener('click', () => {
    cardsReveal.classList.remove('active');
    document.body.classList.remove('legendary-bg', 'epic-bg');
});

openFreeBtn.addEventListener('click', () => openBooster(false));
openPaidBtn.addEventListener('click', () => openBooster(true));

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Système de drag des boosters
const track = document.getElementById('boosterTrack');
let isDragging = false;
let startX;
let currentTranslate = 0;
let prevTranslate = 0;

track.addEventListener('mousedown', startDrag);
track.addEventListener('touchstart', startDrag);
track.addEventListener('mousemove', drag);
track.addEventListener('touchmove', drag);
track.addEventListener('mouseup', endDrag);
track.addEventListener('mouseleave', endDrag);
track.addEventListener('touchend', endDrag);

function startDrag(e) {
    isDragging = true;
    startX = getX(e) - prevTranslate;
    track.classList.add('dragging');
}

function drag(e) {
    if (!isDragging) return;
    const x = getX(e);
    currentTranslate = x - startX;
    track.style.transform = `translateX(${currentTranslate}px)`;
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');

    const throwThreshold = 150;
    if (currentTranslate < -throwThreshold) {
        const firstPack = track.querySelector('.booster-pack');
        if (firstPack) {
            firstPack.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            firstPack.style.transform = 'translateX(-500px) rotate(-15deg)';
            firstPack.style.opacity = '0';
            setTimeout(() => {
                window.location.href = firstPack.dataset.page;
            }, 500);
        }
    } else if (currentTranslate > throwThreshold) {
        const lastPack = track.querySelector('.booster-pack:last-child');
        if (lastPack) {
            lastPack.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            lastPack.style.transform = 'translateX(500px) rotate(15deg)';
            lastPack.style.opacity = '0';
            setTimeout(() => {
                window.location.href = lastPack.dataset.page;
            }, 500);
        }
    } else {
        currentTranslate = 0;
        track.style.transition = 'transform 0.3s ease';
        track.style.transform = `translateX(${currentTranslate}px)`;
        prevTranslate = currentTranslate;
        setTimeout(() => {
            track.style.transition = '';
        }, 300);
    }
}

function getX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

// Redirection vers les quêtes
document.getElementById('trophy-btn').addEventListener('click', () => {
    window.location.href = 'quete.html';
});

// Initialisation
renderQuests();
updateTimer();
