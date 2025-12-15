// Vérification utilisateur connecté
const currentUser = getCurrentUser();
if (!currentUser) {
    window.location.href = 'index.html';
}

const theme = localStorage.getItem('theme') || 'dark';

// Remplir le profil
document.getElementById('profileName').textContent = currentUser.username;
document.getElementById('playerGems').textContent = currentUser.gems || 0;
document.getElementById('avatarPreview').textContent = currentUser.avatar || '🎮';

// Appliquer le thème sauvegardé
if (theme === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('themeSwitch').checked = true;
}

// Thème clair/sombre
document.getElementById('themeSwitch').addEventListener('change', (e) => {
    const isLight = e.target.checked;
    document.body.classList.toggle('light-mode', isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Modifier pseudo et avatar
document.getElementById('saveProfileBtn').addEventListener('click', () => {
    const newPseudo = document.getElementById('newPseudo').value.trim();
    const newAvatar = document.getElementById('newAvatar').value;

    if (newPseudo) currentUser.username = newPseudo;
    if (newAvatar) currentUser.avatar = newAvatar;

    saveCurrentUser(currentUser);
    alert('Profil mis à jour !');
    location.reload();
});

// Son
const soundToggle = document.getElementById('soundToggle');
soundToggle.addEventListener('change', (e) => {
    localStorage.setItem('soundEnabled', e.target.checked);
});

// Déconnexion
document.getElementById('logoutBtn').addEventListener('click', () => {
    logout();
});

// Générateur d'ID/pseudo aléatoire
function generateRandomID() {
    const adjectives = ["Super", "Mega", "Ultra", "Cool", "Dark", "Fire", "Ice"];
    const nouns = ["Dragon", "Knight", "Wizard", "Ninja", "Samurai", "Phoenix", "Warrior"];
    const number = Math.floor(Math.random() * 1000);

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adj}${noun}${number}`;
}

// Générer un ID
const generateBtn = document.getElementById('generateIDBtn');
const generatedField = document.getElementById('generatedIDField');
generateBtn.addEventListener('click', () => {
    generatedField.value = generateRandomID();
});

// Copier l'ID
const copyBtn = document.getElementById('copyIDBtn');
copyBtn.addEventListener('click', () => {
    if (!generatedField.value) return alert("Générez d'abord un ID !");
    generatedField.select();
    generatedField.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(generatedField.value)
        .then(() => {
            const original = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ Copié !';
            setTimeout(() => copyBtn.innerHTML = original, 1500);
        })
        .catch(() => alert('Impossible de copier l\'ID.'));
});
