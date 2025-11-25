async function loadUser() {
  const userId = localStorage.getItem("user_id");
  const status = document.getElementById("status");

  if (!userId) {
    status.textContent = "Pas connecté";
    return;
  }

  try {
    const response = await fetch(
      `https://TON-BACKEND.onrender.com/user/${userId}`
    );

    const data = await response.json();

    document.getElementById("userEmail").textContent = data.email;

  } catch (err) {
    status.textContent = "Erreur : " + err.message;
  }
}

loadUser();
