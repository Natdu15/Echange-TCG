document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("status");

  status.textContent = "Connexion...";

  try {
    const response = await fetch("https://TON-BACKEND.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      status.style.color = "red";
      status.textContent = data.error;
      return;
    }

    localStorage.setItem("user_id", data.user.id);
    localStorage.setItem("user_email", data.user.email);

    status.style.color = "lime";
    status.textContent = "Connexion réussie !";

    setTimeout(() => {
      window.location.href = "inventaire.html";
    }, 800);

  } catch (err) {
    status.style.color = "red";
    status.textContent = "Erreur : " + err.message;
  }
});
