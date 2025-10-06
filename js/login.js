document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  try {
    // Charger users.json (utilisateurs du dépôt)
    const res = await fetch('/users.json');
    const remoteUsers = res.ok ? await res.json() : [];

    // Charger utilisateurs locaux (inscription sans backend)
    const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');

    // Fusion des deux sources
    const users = [...remoteUsers, ...localUsers];

    // Trouver l'utilisateur correspondant
    const user = users.find(u => u.email.toLowerCase() === email);
    if (!user) {
      alert('❌ Email ou mot de passe incorrect.');
      return;
    }

    // Calcul du hash du mot de passe saisi
    const candidateHash = await sha256Hex(user.salt + password);

    if (candidateHash === user.passwordHash) {
      // ✅ Authentification réussie
      const token = crypto.getRandomValues(new Uint32Array(4)).join('-');
      localStorage.setItem('authToken', token);
      localStorage.setItem('connectedUser', JSON.stringify({
        email: user.email,
        prenom: user.prenom,
        nom: user.nom
      }));

      alert(`✅ Connexion réussie ! Bienvenue, ${user.prenom} !`);
      window.location.href = 'accueil.html';
    } else {
      alert('❌ Email ou mot de passe incorrect.');
    }

  } catch (error) {
    console.error(error);
    alert('Erreur de connexion. Impossible de charger la base des utilisateurs.');
  }
});
