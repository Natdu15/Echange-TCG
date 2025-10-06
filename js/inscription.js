// 🔒 Simulation d’un backend avec stockage JSON
// Pour le moment, cela stocke localement (et tu pourras plus tard remplacer par GitHub API)

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // 🔍 Vérification basique
    if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }

    // 🔐 Vérification du mot de passe fort
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regex.test(password)) {
        alert("Mot de passe trop faible. Ajoute une majuscule, un chiffre et un symbole.");
        return;
    }

    // 🔒 Hachage du mot de passe (SHA-256)
    const hashedPassword = await hashPassword(password);

    // 👤 Création d’un objet utilisateur
    const newUser = {
        username,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };

    // 📦 Stockage local simulé
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert("Compte créé avec succès !");
    e.target.reset();
});

// Fonction de hachage SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
