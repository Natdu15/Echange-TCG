const API_URL = 'https://tcg-api.onrender.com'; // ← change avec ta vraie URL API quand elle sera déployée

document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const pseudo = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (pseudo.length < 3) {
    showError('Le pseudo doit contenir au moins 3 caractères !');
    return;
  }

  if (!isValidEmail(email)) {
    showError('Veuillez entrer une adresse email valide !');
    return;
  }

  if (password.length < 6) {
    showError('Le mot de passe doit contenir au moins 6 caractères !');
    return;
  }

  if (password !== confirmPassword) {
    showError('Les mots de passe ne correspondent pas !');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo, email, mot_de_passe: password })
    });

    const data = await response.json();

    if (data.success) {
      showSuccess('Compte créé avec succès ! Redirection vers la connexion...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      showError(data.error || 'Erreur lors de l’inscription');
    }
  } catch (err) {
    showError('Impossible de contacter le serveur. Réessaie plus tard.');
  }
});

// Garde tes fonctions showError, showSuccess, isValidEmail, etc. (elles sont déjà dans ton code)
