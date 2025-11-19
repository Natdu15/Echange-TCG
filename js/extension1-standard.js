// Card database with images and rarities
        const cardDatabase = [
            // Common cards (60% chance)
            { id: 1, name: "Dragon Bleu", rarity: "common", image: "god.jpg" },
            { id: 2, name: "Mage de Feu", rarity: "common", image: "god.jpg" },
            { id: 3, name: "Guerrier", rarity: "common", image: "god.jpg" },
            { id: 4, name: "Archer", rarity: "common", image: "god.jpg" },
            
            // Rare cards (30% chance)
            { id: 5, name: "Phoenix", rarity: "rare", video: "https://cdn.pixabay.com/video/2022/05/13/117227-708525008_tiny.mp4" },
            { id: 6, name: "Sorcier Noir", rarity: "rare", video: "https://cdn.pixabay.com/video/2021/08/03/84303-582754823_tiny.mp4" },
            { id: 7, name: "Paladin", rarity: "rare", video: "https://cdn.pixabay.com/video/2023/04/20/159512-819800729_tiny.mp4" },
            
            // Legendary cards (10% chance)
            { id: 8, name: "Dragon Légendaire", rarity: "legendary", video: "https://cdn.pixabay.com/video/2022/11/28/141244-777499284_tiny.mp4" },
            { id: 9, name: "Roi des Démons", rarity: "legendary", video: "https://cdn.pixabay.com/video/2020/01/18/31437-386395899_tiny.mp4" },
            { id: 10, name: "Ange Céleste", rarity: "legendary", video: "https://cdn.pixabay.com/video/2021/12/04/99573-656336025_tiny.mp4" }
        ];

        // Create animated bubbles
        function createBubbles() {
            const bubblesContainer = document.getElementById('bubbles');
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
                
                bubblesContainer.appendChild(bubble);
            }
        }

        createBubbles();

        // Generate random cards for a pack
        function generatePackCards() {
            const cards = [];
            
            for (let i = 0; i < 3; i++) {
                let card;
                const roll = Math.random() * 100;
                
                if (i === 2) {
                    // 3ème carte: ⚠️ MODIFIER ICI POUR CHANGER LA RARETÉ ⚠️
                    // 50% légendaire, 30% rare, 20% commun (POUR TESTS - Normalement: 10% légendaire, 30% rare, 60% commun)
                    if (roll < 10) {  // ← Changer ce nombre (normalement 10)
                        const legendaries = cardDatabase.filter(c => c.rarity === 'legendary');
                        card = legendaries[Math.floor(Math.random() * legendaries.length)];
                    } else if (roll < 40) {  // ← 50 + 30 = 80 (normalement 40)
                        const rares = cardDatabase.filter(c => c.rarity === 'rare');
                        card = rares[Math.floor(Math.random() * rares.length)];
                    } else {
                        const commons = cardDatabase.filter(c => c.rarity === 'common');
                        card = commons[Math.floor(Math.random() * commons.length)];
                    }
                } else {
                    // 1ère et 2ème carte: ⚠️ MODIFIER ICI POUR CHANGER LA RARETÉ ⚠️
                    // 20% légendaire, 30% rare, 50% commun (POUR TESTS - Normalement: 1% légendaire, 30% rare, 69% commun)
                    if (roll < 1) {  // ← Changer ce nombre (normalement 1)
                        const legendaries = cardDatabase.filter(c => c.rarity === 'legendary');
                        card = legendaries[Math.floor(Math.random() * legendaries.length)];
                    } else if (roll < 31) {  // ← 20 + 30 = 50 (normalement 31)
                        const rares = cardDatabase.filter(c => c.rarity === 'rare');
                        card = rares[Math.floor(Math.random() * rares.length)];
                    } else {
                        const commons = cardDatabase.filter(c => c.rarity === 'common');
                        card = commons[Math.floor(Math.random() * commons.length)];
                    }
                }
                
                cards.push(card);
            }
            
            return cards;
        }

        let packCards = generatePackCards();

        // Select booster to open
        function selectBooster() {
            const mainContainer = document.getElementById('mainContainer');
            mainContainer.style.display = 'none';
            
            startOpening();
        }

        // Start opening sequence
        function startOpening() {
            const openingContainer = document.getElementById('openingContainer');
            openingContainer.classList.add('active');
            
            const openingPack = document.getElementById('openingPack');
            const packWrapper = document.getElementById('packWrapper');
            const progressBar = document.getElementById('progressBar');
            const instruction = document.getElementById('instruction');
            
            let progress = 0;
            let isOpening = false;
            let startOpenX = 0;
            
            openingPack.addEventListener('mousedown', (e) => {
                isOpening = true;
                startOpenX = e.clientX;
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isOpening) return;
                
                const deltaX = e.clientX - startOpenX;
                
                if (deltaX > 0) {
                    progress = Math.min(100, (deltaX / 300) * 100);
                    progressBar.style.width = `${progress}%`;
                    
                    const rotation = (progress / 100) * 20;
                    packWrapper.style.transform = `rotateY(${rotation}deg)`;
                }
                
                if (progress >= 100) {
                    completeOpening();
                    isOpening = false;
                }
            });
            
            document.addEventListener('mouseup', () => {
                isOpening = false;
            });
        }

        // Complete opening and show cards one by one
        function completeOpening() {
            const instruction = document.getElementById('instruction');
            const cardsContainer = document.getElementById('cardsContainer');
            const openingPack = document.getElementById('openingPack');
            const backButton = document.querySelector('.back-button');
            const infoDisplay = document.querySelector('.info-display');
            
            // Hide the booster pack, back button and info display with animation
            openingPack.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            openingPack.style.opacity = '0';
            openingPack.style.transform = 'scale(0.8)';
            
            backButton.style.transition = 'opacity 0.5s ease';
            backButton.style.opacity = '0';
            
            infoDisplay.style.transition = 'opacity 0.5s ease';
            infoDisplay.style.opacity = '0';
            
            setTimeout(() => {
                openingPack.style.display = 'none';
                backButton.style.display = 'none';
                infoDisplay.style.display = 'none';
            }, 500);
            
            instruction.style.display = 'none';
            cardsContainer.classList.add('active');
            
            // Show cards one by one with delay
            packCards.forEach((card, index) => {
                setTimeout(() => {
                    const cardElement = document.createElement('div');
                    cardElement.classList.add('card', card.rarity);
                    
                    if ((card.rarity === 'legendary' || card.rarity === 'rare') && card.video) {
                        cardElement.innerHTML = `
                            <video class="card-video" autoplay loop muted playsinline>
                                <source src="${card.video}" type="video/mp4">
                            </video>
                            <div class="card-rarity-badge">${card.rarity === 'legendary' ? 'Légendaire' : 'Rare'}</div>
                        `;
                    } else {
                        cardElement.innerHTML = `
                            <img src="${card.image}" alt="${card.name}" class="card-image">
                            <div class="card-rarity-badge">Commun</div>
                        `;
                    }
                    
                    cardsContainer.appendChild(cardElement);
                    
                    // Trigger reveal animation
                    setTimeout(() => {
                        cardElement.classList.add('reveal');
                    }, 50);
                    
                }, index * 1500); // 1.5 seconds delay between each card
            });
            
            // Show finish button after all cards are revealed
            setTimeout(() => {
                document.getElementById('finishButton').classList.add('active');
            }, packCards.length * 1500 + 1000);
        }

        // Finish opening and return to home
        function finishOpening() {
            // Simulate adding cards to collection
            console.log('Cards added to collection:', packCards);
            
            // Return to home page
            window.location.href = 'accueil.html';
        }

        // Go back to extension page
        function goBack() {
            window.history.back();
        }
