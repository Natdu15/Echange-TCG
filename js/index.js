document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) {
        alert("❌ Email ou mot de passe incorrect.");
        return;
    }
    
    const candidateHash = await sha256Hex(user.salt + password);
    
    if (candidateHash === user.passwordHash) {
        const token = crypto.getRandomValues(new Uint32Array(4)).join('-');
        localStorage.setItem("authToken", token);
        localStorage.setItem("connectedUser", JSON.stringify({
            email: user.email,
            username: user.username
        }));
        
        alert(`✅ Connexion réussie ! Bienvenue, ${user.username} !`);
        window.location.href = "accueil.html";
    } 
    else {
        alert("❌ Email ou mot de passe incorrect.");
    }
});
