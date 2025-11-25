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
                
                const hue = Math.random() * 60 + 240; // 240-300 (blue to violet)
                bubble.style.background = `radial-gradient(circle at 30% 30%, hsla(${hue}, 70%, 60%, 0.3), hsla(${hue}, 70%, 50%, 0.1))`;
                
                bubblesContainer.appendChild(bubble);
            }
        }

        createBubbles();

        // Carousel functionality
        let currentIndex = 0;
        const packs = document.querySelectorAll('.pack-card');
        const totalPacks = packs.length;

        function updateCarousel() {
            packs.forEach((pack, index) => {
                pack.classList.remove('active', 'left', 'right', 'hidden');
                
                if (index === currentIndex) {
                    pack.classList.add('active');
                } else if (index === (currentIndex - 1 + totalPacks) % totalPacks) {
                    pack.classList.add('left');
                } else if (index === (currentIndex + 1) % totalPacks) {
                    pack.classList.add('right');
                } else {
                    pack.classList.add('hidden');
                }
            });
        }

        function nextPack() {
            currentIndex = (currentIndex + 1) % totalPacks;
            updateCarousel();
        }

        function prevPack() {
            currentIndex = (currentIndex - 1 + totalPacks) % totalPacks;
            updateCarousel();
        }

        function openPack() {
            const activePack = packs[currentIndex].querySelector('.pack-name').textContent;
            alert(`Ouverture du ${activePack}...`);
        }

        // Click on pack to activate it
        packs.forEach((pack, index) => {
            pack.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
