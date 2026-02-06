document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const pseudo = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  const message = document.getElementById('message');

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

  const userKey = `tcg_user_${email}`;

  if (localStorage.getItem(userKey)) {
    showError('Cet email existe déjà. Va sur la page connexion.');
    return;
  }

  const newUser = {
    pseudo,
    email,
    password,
    created: new Date().toISOString(),
    cards: []
  };

  localStorage.setItem(userKey, JSON.stringify(newUser));
  localStorage.setItem('tcg_user_email', email);
  localStorage.setItem('tcg_user_pseudo', pseudo);

  showSuccess('Compte créé avec succès ! Tu es connecté.');

  setTimeout(() => {
    window.location.href = 'accueil.html';
  }, 1800);
});

function showError(msg) {
  const message = document.getElementById('message');
  message.style.color = '#ff4444';
  message.textContent = msg;
}

function showSuccess(msg) {
  const message = document.getElementById('message');
  message.style.color = '#0f0';
  message.textContent = msg;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
