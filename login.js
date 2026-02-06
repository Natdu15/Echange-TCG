document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const status = document.getElementById("status");

  status.textContent = "Connexion...";
  status.style.color = "yellow";

  const userKey = `tcg_user_${email}`;
  const stored = localStorage.getItem(userKey);

  if (!stored) {
    status.style.color = "red";
    status.textContent = "Email inconnu";
    return;
  }

  const user = JSON.parse(stored);

  if (user.password !== password) {
    status.style.color = "red";
    status.textContent = "Mot de passe incorrect";
    return;
  }

  localStorage.setItem('tcg_user_email', email);
  localStorage.setItem('tcg_user_pseudo', user.pseudo);

  status.style.color = "lime";
  status.textContent = "Connexion réussie !";

  setTimeout(() => {
    window.location.href = "inventaire.html";
  }, 800);
});
