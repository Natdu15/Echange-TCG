let friends = [];

// Initialisation
function init() {
    loadFriends();
    displayFriends();
    
    // Event listener pour Enter sur l'input
    document.getElementById('friendUsername').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addFriend();
        }
    });
}

// Charger les amis depuis localStorage
function loadFriends() {
    const storedFriends = localStorage.getItem('friends');
    if (storedFriends) {
        friends = JSON.parse(storedFriends);
        console.log('✅ Amis chargés:', friends.length);
    }
}

// Sauvegarder les amis dans localStorage
function saveFriends() {
    localStorage.setItem('friends', JSON.stringify(friends));
    console.log('💾 Amis sauvegardés');
}

// Ajouter un ami
function addFriend() {
    const input = document.getElementById('friendUsername');
    const username = input.value.trim();
    
    // Validation
    if (!username) {
        showNotification('❌ Veuillez entrer un pseudo', 'error');
        return;
    }
    
    if (username.length < 3) {
        showNotification('❌ Le pseudo doit contenir au moins 3 caractères', 'error');
        return;
    }
    
    // Vérifier si l'ami existe déjà
    if (friends.some(f => f.name.toLowerCase() === username.toLowerCase())) {
        showNotification('⚠️ Cet ami est déjà dans votre liste', 'warning');
        return;
    }
    
    // Ajouter l'ami
    const newFriend = {
        id: Date.now(),
        name: username,
        online: Math.random() > 0.5, // Statut aléatoire pour la démo
        addedAt: Date.now()
    };
    
    friends.push(newFriend);
    saveFriends();
    displayFriends();
    
    // Reset input
    input.value = '';
    
    showNotification(`✅ ${username} a été ajouté à vos amis !`, 'success');
    console.log('➕ Ami ajouté:', newFriend);
}

// Supprimer un ami
function removeFriend(friendId) {
    const friend = friends.find(f => f.id === friendId);
    
    if (!friend) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${friend.name} de vos amis ?`)) {
        friends = friends.filter(f => f.id !== friendId);
        saveFriends();
        displayFriends();
        showNotification(`🗑️ ${friend.name} a été retiré de vos amis`, 'info');
        console.log('🗑️ Ami supprimé:', friend.name);
    }
}

// Afficher les amis
function displayFriends() {
    const list = document.getElementById('friendsList');
    const countEl = document.getElementById('friendCount');
    
    countEl.textContent = friends.length;
    
    if (friends.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👥</div>
                <h3>Aucun ami</h3>
                <p>Ajoutez des amis pour pouvoir échanger des cartes</p>
            </div>
        `;
        return;
    }
    
    // Trier par statut (en ligne d'abord) puis par nom
    const sortedFriends = [...friends].sort((a, b) => {
        if (a.online !== b.online) {
            return b.online ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
    });
    
    list.innerHTML = '';
    
    sortedFriends.forEach(friend => {
        const friendCard = document.createElement('div');
        friendCard.className = `friend-card ${friend.online ? 'online' : 'offline'}`;
        
        const initials = friend.name.substring(0, 2).toUpperCase();
        
        friendCard.innerHTML = `
            <div class="friend-info">
                <div class="friend-avatar">${initials}</div>
                <div class="friend-details">
                    <div class="friend-name">${friend.name}</div>
                    <div class="friend-status">
                        ${friend.online ? '🟢 En ligne' : '⚫ Hors ligne'}
                    </div>
                </div>
            </div>
            <div class="friend-actions">
                ${friend.online ? '<button class="btn-trade" onclick="tradeWithFriend(' + friend.id + ')">💱 Trade</button>' : ''}
                <button class="btn-remove" onclick="removeFriend(${friend.id})">🗑️</button>
            </div>
        `;
        
        list.appendChild(friendCard);
    });
}

// Aller à la page de trade avec cet ami
function tradeWithFriend(friendId) {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
        // Sauvegarder l'ami sélectionné pour la page trade
        localStorage.setItem('selectedFriendForTrade', JSON.stringify(friend));
        window.location.href = 'trade.html';
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Ajouter au body
    document.body.appendChild(notification);
    
    // Afficher
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Masquer et supprimer après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Démarrer l'application
init();
