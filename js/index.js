/* ================================================
   Connexion utilisateur
   ================================================ */

document.querySelector("form")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value.trim().toLowerCase();
    const password = document.querySelector('input[type="password"]').value;

    try {
        // Récupération des utilisateurs stockés localement
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Recherche utilisateur
        const user = users.find(u => u.email === email);
        if (!user) {
            alert("❌ Email ou mot de passe incorrect.");
            return;
        }

        // Calcul hash pour comparaison
        const candidateHash = await sha256Hex(user.salt + password);

        if (candidateHash === user.passwordHash) {
            // Connexion réussie
            const token = crypto.getRandomValues(new Uint32Array(4)).join('-');
            localStorage.setItem("authToken", token);
            localStorage.setItem("connectedUser", JSON.stringify({
                email: user.email,
                username: user.username
            }));

            alert(`✅ Connexion réussie ! Bienvenue, ${user.username} !`);
            window.location.href = "accueil.html";
        } else {
            alert("❌ Email ou mot de passe incorrect.");
        }

    } catch (err) {
        console.error("Erreur de connexion :", err);
        alert("⚠️ Une erreur est survenue lors de la connexion.");
    }
});
