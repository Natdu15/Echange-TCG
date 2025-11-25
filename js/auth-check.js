(function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || !currentUser) {
        window.location.href = 'index.html';
        return;
    }
})();

// Fonction pour récupérer l'utilisateur actuel
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Fonction pour sauvegarder l'utilisateur mis à jour
function saveCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Mettre à jour aussi dans la liste des utilisateurs
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
        users[index] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Fonction de déconnexion
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
