        const cardDatabase = [
            // Common cards (60% chance)
            { id: 1, name: "Dragon Bleu", rarity: "common", image: "cartes-pokémon/anime/ace.png" },
            { id: 2, name: "Guerrier", rarity: "common", image: "cartes-pokémon/anime/sel.png" },
            { id: 3, name: "Archer", rarity: "common", image: "cartes-pokémon/anime/doma.png" },
            
            // Rare cards (30% chance)
            { id: 4, name: "Phoenix", rarity: "rare", image: "cartes-pokémon/anime/akaza.png" },
            { id: 5, name: "Sorcier Noir", rarity: "rare", image: "cartes-pokémon/anime/titiana.png" },
            
            // Legendary cards (10% chance)
            { id: 6, name: "Mage de Feu", rarity: "legendary", image: "cartes-pokémon/anime/acnologia.png" },

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

        // Generate random cards for a pack (3 cards per pack)
        function generatePackCards() {
            const cards = [];

            for (let i = 0; i < 3; i++) {
                let card;
                const roll = Math.random() * 100;

                if (i === 2) {
                    // 3ème carte : 15% legendary, 20% rare, 65% common
                    if (roll < 45) {
                        const legendaries = cardDatabase.filter(c => c.rarity === 'legendary');
                        card = legendaries[Math.floor(Math.random() * legendaries.length)];
                    } else if (roll < 80) {
                        const rares = cardDatabase.filter(c => c.rarity === 'rare');
                        card = rares[Math.floor(Math.random() * rares.length)];
                    } else {
                        const commons = cardDatabase.filter(c => c.rarity === 'common');
                        card = commons[Math.floor(Math.random() * commons.length)];
                    }
                } else {
                    // 1ère et 2ème carte : 1% legendary, 30% rare, 69% common
                    if (roll < 1) {
                        const legendaries = cardDatabase.filter(c => c.rarity === 'legendary');
                        card = legendaries[Math.floor(Math.random() * legendaries.length)];
                    } else if (roll < 31) {
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

        // Start opening sequence automatically
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

        document.addEventListener('mouseup', () => { isOpening = false; });

        // Complete opening and show 60 cards (20 packs × 3 cards)
        function completeOpening() {
            const cardsContainer = document.getElementById('cardsContainer');
            const backButton = document.querySelector('.back-button');
            const infoDisplay = document.querySelector('.info-display');

            // Hide pack and UI elements
            openingPack.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            openingPack.style.opacity = '0';
            openingPack.style.transform = 'scale(0.8)';
            backButton.style.opacity = '0';
            infoDisplay.style.opacity = '0';
            setTimeout(() => {
                openingPack.style.display = 'none';
                backButton.style.display = 'none';
                infoDisplay.style.display = 'none';
            }, 500);

            instruction.style.display = 'none';
            cardsContainer.classList.add('active');

            // Generate and show cards pack by pack (20 packs × 3 cards = 60 cards)
            let packIndex = 0;

            function showNextPack() {
                if (packIndex >= 20) {
                    // All packs opened, show finish button
                    setTimeout(() => {
                        document.getElementById('finishButton').classList.add('active');
                    }, 500);
                    return;
                }

                const packCards = generatePackCards();

                // Show the 3 cards of this pack
                packCards.forEach((card, index) => {
                    setTimeout(() => {
                        const cardElement = document.createElement('div');
                        cardElement.classList.add('card', card.rarity);

                        let rarityText = card.rarity === "legendary" ? "Légendaire" :
                            card.rarity === "rare" ? "Rare" : "Commun";

                        cardElement.innerHTML = `
                            <img src="${card.image}" alt="${card.name}" class="card-image">
                            <div class="card-rarity-badge">${rarityText}</div>
                        `;

                        cardsContainer.appendChild(cardElement);

                        // Trigger reveal animation
                        setTimeout(() => {
                            cardElement.classList.add('reveal');
                        }, 50);

                    }, index * 400);
                });

                packIndex++;

                // Wait for 3 cards to be displayed, then show next pack
                setTimeout(() => {
                    showNextPack();
                }, 1200); // 3 cards × 400ms = 1200ms
            }

            // Start showing the first pack
            showNextPack();
        }

        // Finish opening and return
        function finishOpening() {
            window.location.href = 'accueil.html';
        }

        // Go back button
        function goBack() {
            window.history.back();
        }
