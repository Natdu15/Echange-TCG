document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  try {
    // Lecture du fichier JSON sur GitHub
    const res = await fetch("https://raw.githubusercontent.com/TON_USERNAME/TON_REPO/main/data/users.json");
    const users = await res.json();

    const user = users.find(u => u.email === email);

    if (!user) {
      alert("❌ Email ou mot de passe incorrect.");
      return;
    }

    if (user.password !== password) { // tu peux hasher si besoin
      alert("❌ Email ou mot de passe incorrect.");
      return;
    }

    alert(`✅ Connexion réussie ! Bienvenue, ${user.username} !`);
    // Optionnel : stocker session dans sessionStorage ou localStorage côté client
    sessionStorage.setItem("connectedUser", JSON.stringify(user));
    window.location.href = "accueil.html";

  } catch (err) {
    console.error(err);
    alert("❌ Impossible de se connecter, réessayez plus tard.");
  }
});
