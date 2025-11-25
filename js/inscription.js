// inscription.js - Page de création de compte

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validations
    if (username.length < 3) {
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
    
    // Récupérer les utilisateurs existants
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Vérifier si l'email existe déjà
    if (users.some(u => u.email === email)) {
        showError('Un compte existe déjà avec cet email !');
        return;
    }
    
    // Vérifier si le pseudo existe déjà
    if (users.some(u => u.username === username)) {
        showError('Ce pseudo est déjà pris !');
        return;
    }
    
    // Créer le nouvel utilisateur
    const newUser = {
        id: generateUserId(),
        username: username,
        email: email,
        password: hashPassword(password),
        createdAt: new Date().toISOString(),
        avatar: '🎮',
        level: 1,
        gems: 100,
        friends: [],
        cards: [],
        freeBoostersLeft: 2,
        timeUntilNextBooster: 12 * 60 * 60
    };
    
    // Ajouter l'utilisateur
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Message de succès
    showSuccess('Compte créé avec succès ! Redirection vers la connexion...');
    
    // Rediriger vers la page de connexion après 2 secondes
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
});

function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(message) {
    removeMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        margin-top: 20px;
        text-align: center;
        font-weight: bold;
        animation: shake 0.5s;
        border: 2px solid #fca5a5;
    `;
    
    document.querySelector('.container').appendChild(errorDiv);
    addShakeAnimation();
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

function showSuccess(message) {
    removeMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        margin-top: 20px;
        text-align: center;
        font-weight: bold;
        border: 2px solid #6ee7b7;
    `;
    
    document.querySelector('.container').appendChild(successDiv);
}

function removeMessages() {
    const oldMessages = document.querySelectorAll('.error-message, .success-message');
    oldMessages.forEach(msg => msg.remove());
}

function addShakeAnimation() {
    if (!document.getElementById('shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}
