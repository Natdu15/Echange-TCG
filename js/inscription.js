document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert("❌ Les mots de passe ne correspondent pas.");
    return;
  }

  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!regex.test(password)) {
    alert("❌ Mot de passe trop faible. Ajoute une majuscule, un chiffre et un symbole.");
    return;
  }

  const newUser = {
    username,
    email,
    password, 
    tcgAccount: {
      cards: [],
      level: 1,
      xp: 0,
      gems: 0,
      nextFreeBooster: new Date().toISOString()
    },
    createdAt: new Date().toISOString()
  };

  try {
    const res = await fetch("http://localhost:3000/api/register", { 
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newUser)
    });

    const text = await res.text();
    alert(text);
    if (res.ok) {
      window.location.href = "index.html";
    }

  } catch (err) {
    console.error(err);
    alert("❌ Impossible de créer le compte, réessayez plus tard.");
  }
});
