// Redirection sur clic pour chaque booster
        document.querySelectorAll('.booster-pack').forEach(pack => {
            pack.addEventListener('click', () => {
                const page = pack.getAttribute('data-page');
                if (page) window.location.href = page;
            });
        });

        const track = document.getElementById('boosterTrack');
let isDragging = false;
let startX;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;

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
    cancelAnimationFrame(animationID);
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

    // Seuil pour lancer un booster
    const throwThreshold = 150; // distance minimale pour déclencher la page
    if (currentTranslate < -throwThreshold) {
        // Lancer vers la gauche : ouvre le premier booster
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
        // Lancer vers la droite : ouvre le dernier booster
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
        // Si pas assez tiré, retour en place
        currentTranslate = 0;
        track.style.transition = 'transform 0.3s ease';
        track.style.transform = `translateX(${currentTranslate}px)`;
        prevTranslate = currentTranslate;
        setTimeout(() => {
            track.style.transition = ''; // supprime la transition pour le prochain drag
        }, 300);
    }
}

function getX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}
document.getElementById('questsBtn').addEventListener('click', () => {
    window.location.href = 'quete.html';
});
