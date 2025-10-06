document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Vérifications simples
    if (password !== confirmPassword) {
        alert("❌ Les mots de passe ne correspondent pas.");
        return;
    }

    // Mot de passe fort : majuscule, chiffre, symbole, 8 caractères minimum
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regex.test(password)) {
        alert("❌ Mot de passe trop faible. Ajoute une majuscule, un chiffre et un symbole.");
        return;
    }

    // Création du salt et hash du mot de passe
    const salt = generateSalt();
    const passwordHash = await sha256Hex(salt + password);

    // Nouvel utilisateur
    const newUser = {
        username,
        email,
        salt,
        passwordHash,
        createdAt: new Date().toISOString()
    };

    // Stockage local pour simuler base GitHub
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Vérification si l’email existe déjà
    if(users.some(u => u.email === email)) {
        alert("❌ Cet email est déjà utilisé !");
        return;
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert("✅ Compte créé avec succès !");
    e.target.reset();
});
