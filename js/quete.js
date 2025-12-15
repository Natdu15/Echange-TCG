        // Create animated bubbles
        function createBubbles() {
            const background = document.getElementById('background');
            const bubbleCount = 15;

            for (let i = 0; i < bubbleCount; i++) {
                const bubble = document.createElement('div');
                bubble.classList.add('bubble');
                
                const size = Math.random() * 100 + 50;
                bubble.style.width = `${size}px`;
                bubble.style.height = `${size}px`;
                bubble.style.left = `${Math.random() * 100}%`;
                bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
                bubble.style.animationDelay = `${Math.random() * 5}s`;
                
                const hue = Math.random() * 60 + 240;
                bubble.style.background = `radial-gradient(circle at 30% 30%, hsla(${hue}, 70%, 60%, 0.3), hsla(${hue}, 70%, 50%, 0.1))`;
                
                background.appendChild(bubble);
            }
        }

        createBubbles();

        // Quest data structure
        const questsData = {
            daily: [
                {
                    id: 'daily_login',
                    title: 'Se connecter',
                    description: 'Connectez-vous au jeu',
                    icon: '🌟',
                    progress: 1,
                    total: 1,
                    reward: '1 <img src="logo-monnaie.png" class="reward-gem" alt="Gemme"> Gemme',
                    completed: false
                },
                {
                    id: 'daily_open_booster',
                    title: 'Ouvrir un booster',
                    description: 'Ouvrez un pack de cartes',
                    icon: '🎴',
                    progress: 0,
                    total: 1,
                    reward: '2 <img src="logo-monnaie.png" class="reward-gem" alt="Gemmes"> Gemmes',
                    completed: false
                },
                {
                    id: 'daily_trade',
                    title: 'Faire un trade',
                    description: 'Échangez des cartes avec un autre joueur',
                    icon: '🔄',
                    progress: 0,
                    total: 1,
                    reward: '3 <img src="logo-monnaie.png" class="reward-gem" alt="Gemmes"> Gemmes',
                    completed: false
                },
                {
                    id: 'daily_combat',
                    title: 'Faire un combat',
                    description: 'Participez à un combat',
                    icon: '⚔️',
                    progress: 0,
                    total: 1,
                    reward: '3 <img src="logo-monnaie.png" class="reward-gem" alt="Gemmes"> Gemmes',
                    completed: false
                }
            ],
            collection: [
                {
                    id: 'collect_10',
                    title: 'Collectionneur Débutant',
                    description: 'Collectez 10 cartes de l\'extension',
                    icon: '📦',
                    progress: 0,
                    total: 10,
                    reward: '1 🎴 Booster',
                    completed: false
                },
                {
                    id: 'collect_20',
                    title: 'Collectionneur Confirmé',
                    description: 'Collectez 20 cartes de l\'extension',
                    icon: '📚',
                    progress: 0,
                    total: 20,
                    reward: '2 🎴 Boosters',
                    completed: false
                },
                {
                    id: 'collect_30',
                    title: 'Collectionneur Expert',
                    description: 'Collectez 30 cartes de l\'extension',
                    icon: '🏆',
                    progress: 0,
                    total: 30,
                    reward: '3 🎴 Boosters',
                    completed: false
                },
                {
                    id: 'collect_40',
                    title: 'Collectionneur Maître',
                    description: 'Collectez 40 cartes de l\'extension',
                    icon: '👑',
                    progress: 0,
                    total: 40,
                    reward: '4 🎴 Boosters',
                    completed: false
                },
                {
                    id: 'collect_50',
                    title: 'Collectionneur Légendaire',
                    description: 'Collectez 50 cartes de l\'extension',
                    icon: '💎',
                    progress: 0,
                    total: 50,
                    reward: '5 🎴 Boosters',
                    completed: false
                }
            ],
            monthly: [
                {
                    id: 'monthly_login',
                    title: 'Connexion assidue',
                    description: 'Connectez-vous 10 jours ce mois-ci',
                    icon: '📅',
                    progress: 0,
                    total: 10,
                    reward: '20 <img src="logo-monnaie.png" class="reward-gem" alt="Gemmes"> Gemmes',
                    completed: false
                },
                {
                    id: 'monthly_boosters',
                    title: 'Chasseur de cartes',
                    description: 'Ouvrez 30 boosters ce mois-ci',
                    icon: '🎁',
                    progress: 0,
                    total: 30,
                    reward: '10 🎴 Boosters',
                    completed: false
                },
                {
                    id: 'monthly_trades',
                    title: 'Négociateur',
                    description: 'Effectuez 15 trades ce mois-ci',
                    icon: '💱',
                    progress: 0,
                    total: 15,
                    reward: '⭐ Carte Spéciale',
                    completed: false
                },
                {
                    id: 'monthly_combats',
                    title: 'Guerrier',
                    description: 'Participez à 15 combats ce mois-ci',
                    icon: '🗡️',
                    progress: 0,
                    total: 15,
                    reward: '🏅 Jeton de Profil',
                    completed: false
                }
            ],
            other: []
        };

        let currentCategory = 'daily';

        // Render quests
        function renderQuests() {
            const container = document.getElementById('questsContainer');
            const quests = questsData[currentCategory];
            
            container.innerHTML = '';
            
            if (quests.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📭</div>
                        <div class="empty-text">Aucune quête disponible pour le moment</div>
                    </div>
                `;
                return;
            }
            
            quests.forEach(quest => {
                const progressPercent = (quest.progress / quest.total) * 100;
                const questCard = document.createElement('div');
                questCard.classList.add('quest-card');
                if (quest.completed) {
                    questCard.classList.add('completed');
                }
                
                questCard.innerHTML = `
                    <div class="quest-header">
                        <div class="quest-icon">${quest.icon}</div>
                        <div class="quest-info">
                            <div class="quest-title">${quest.title}</div>
                            <div class="quest-description">${quest.description}</div>
                        </div>
                    </div>
                    <div class="quest-progress">
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="progress-text">${quest.progress} / ${quest.total}</div>
                    </div>
                    <div class="quest-reward">
                        <span class="reward-icon">🎁</span>
                        <span class="reward-text">${quest.reward}</span>
                    </div>
                `;
                
                container.appendChild(questCard);
            });
            
            // Add bonus quest for daily if 3/4 completed
            if (currentCategory === 'daily') {
                const completedCount = quests.filter(q => q.completed).length;
                const bonusQuest = document.createElement('div');
                bonusQuest.classList.add('quest-card');
                bonusQuest.style.border = '2px solid #ffd700';
                bonusQuest.style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(200, 70, 180, 0.1) 100%)';
                
                if (completedCount >= 3) {
                    bonusQuest.classList.add('completed');
                }
                
                bonusQuest.innerHTML = `
                    <div class="quest-header">
                        <div class="quest-icon" style="background: linear-gradient(135deg, #ffd700, #ff8c00);">🌟</div>
                        <div class="quest-info">
                            <div class="quest-title" style="color: #ffd700;">Quête Bonus Quotidienne</div>
                            <div class="quest-description">Complétez 3 quêtes quotidiennes sur 4</div>
                        </div>
                    </div>
                    <div class="quest-progress">
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${(completedCount / 3) * 100}%; background: linear-gradient(90deg, #ffd700, #ff8c00);"></div>
                        </div>
                        <div class="progress-text" style="color: #ffd700;">${completedCount} / 3</div>
                    </div>
                    <div class="quest-reward" style="border-color: rgba(255, 215, 0, 0.5); background: rgba(255, 215, 0, 0.2);">
                        <span class="reward-icon">💰</span>
                        <span class="reward-text" style="color: #ffd700;">5 <img src="logo-monnaie.png" class="reward-gem" alt="Gemmes"> Gemmes Bonus</span>
                    </div>
                `;
                
                container.appendChild(bonusQuest);
            }
        }

        // Change category
        function changeCategory(category) {
            currentCategory = category;
            
            // Update active tab
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Render new quests with animation
            const container = document.getElementById('questsContainer');
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                renderQuests();
                container.style.transition = 'all 0.3s ease';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 150);
        }

        // Go back to home
        function goBack() {
            window.location.href = 'accueil.html';
        }

        // Initial render
        renderQuests();
