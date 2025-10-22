
// Vérifie si l'utilisateur est connecté
(function () {
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  const user = JSON.parse(localStorage.getItem('connectedUser') || '{}');
  const gems = user.gems || 0;
  const theme = localStorage.getItem('theme') || 'dark';

  // Remplit le profil
  document.getElementById('profileName').textContent = user.prenom + ' ' + (user.nom || '');
  document.getElementById('playerGems').textContent = gems;
  document.getElementById('avatarPreview').textContent = user.avatar || '🎮';

  // Applique le thème sauvegardé
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('themeSwitch').checked = true;
  }

  // === Gestion des paramètres ===

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

    if (newPseudo) user.prenom = newPseudo;
    if (newAvatar) user.avatar = newAvatar;

    localStorage.setItem('connectedUser', JSON.stringify(user));
    alert('Profil mis à jour !');
    location.reload();
  });

  // Son (juste simulation ici)
  const soundToggle = document.getElementById('soundToggle');
  soundToggle.addEventListener('change', (e) => {
    localStorage.setItem('soundEnabled', e.target.checked);
  });

  // Déconnexion
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('connectedUser');
    window.location.href = 'index.html';
  });
})();
