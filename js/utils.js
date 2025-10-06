// 🔹 Fonctions utilitaires communes

/**
 * SHA-256 en hexadécimal
 * @param {string} str 
 * @returns {Promise<string>}
 */
async function sha256Hex(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Génère un salt aléatoire
 * @param {number} length 
 * @returns {string}
 */
function generateSalt(length = 16) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2,'0')).join('');
}
