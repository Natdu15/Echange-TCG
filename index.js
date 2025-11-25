// METS ICI TON EXTERNAL URL DE TA BASE RENDER (copie-colle depuis Render → ta DB → External URL)
const POSTGRES_URL = "postgresql://TON_USER:TON_MDP@TON_HOST:5432/TA_DB";

// Exemple (remplace par la tienne) :
// const POSTGRES_URL = "postgresql://tcg_user:abc123xyz@dpg-cklmnopq-a.frankfurt-postgres.render.com/tcg_1234";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const status = document.getElementById("status");

  status.textContent = "Connexion à la base...";

  const { Client } = pg;
  const client = new Client(POSTGRES_URL);

  try {
    await client.connect();
    status.textContent = "Connecté à la base ! Vérification...";

    // On cherche l'utilisateur par email
    const res = await client.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (res.rows.length === 0) {
      status.style.color = "red";
      status.textContent = "Email inconnu";
      return;
    }

    const user = res.rows[0];

    // Pour l'instant on accepte n'importe quel mot de passe (tu pourras hacher plus tard)
    if (password.length < 3) {
      status.style.color = "red";
      status.textContent = "Mot de passe trop court";
      return;
    }

    // Connexion réussie → on stocke l'user_id dans localStorage
    localStorage.setItem("user_id", user.id);
    localStorage.setItem("user_email", user.email);

    status.style.color = "lime";
    status.textContent = "Connexion réussie ! Redirection...";

    // Redirige vers la page principale
    setTimeout(() => {
      window.location.href = "inventaire.html"; // ou accueil.html, echange.html, etc.
    }, 1000);

  } catch (err) {
    console.error(err);
    status.style.color = "red";
    status.textContent = "Erreur base : " + err.message;
  } finally {
    await client.end();
  }
});
