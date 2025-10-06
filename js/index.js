/* ================================================
   FICHIER : js/index.js
   Rôle : Gérer la connexion utilisateur
   ================================================ */

/**
 * Calcule le hash SHA-256 en hexadécimal
 * @param {string} str - Chaîne à hasher
 * @returns {Promise<string>} hash hexadécimal
 */
async function sha256Hex(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Événement de soumission du formulaire de connexion
 */
document.querySelector("form")?.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value.trim().toLowerCase();
    const password = document.querySelector('input[type="password"]').value;

    try {
        // Charger la base des utilisateurs (users.json)
        const res = await fetch("users.json");
        if (!res.ok) throw new Error("Impossible de charger users.json");

        const users = await res.json();

        // Recherche de l'utilisateur par email
        const user = users.find(u => u.email.toLowerCase() === email);
        if (!user) {
            alert("❌ Identifiants incorrects. Vérifie ton email ou ton mot de passe.");
            return;
        }

        // Calcul du hash pour comparaison : SHA-256(salt + password)
        const candidateHash = await sha256Hex(user.salt + password);

        if (candidateHash === user.passwordHash) {
            // ✅ Connexion réussie
            const token = crypto.getRandomValues(new Uint32Array(4)).join('-');

            localStorage.setItem("authToken", token);
            localStorage.setItem("connectedUser", JSON.stringify({
                email: user.email,
                prenom: user.prenom,
                nom: user.nom
            }));

            alert("✅ Connexion réussie ! Bienvenue, " + user.prenom + " 👋");
            window.location.href = "accueil.html";
        } else {
            alert("❌ Identifiants incorrects. Vérifie ton email ou ton mot de passe.");
        }
    } catch (err) {
        console.error("Erreur de connexion :", err);
        alert("⚠️ Erreur lors de la connexion. Vérifie ta connexion internet ou réessaie plus tard.");
    }
});
