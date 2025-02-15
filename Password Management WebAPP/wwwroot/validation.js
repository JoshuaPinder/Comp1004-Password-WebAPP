const API_URL = "https://comp1004-password-webapp.onrender.com";  // Your backend URL

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('form');
    const error_message = document.getElementById('error-message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email-input').value;
            const password = document.getElementById('password-input').value;
            const firstname = document.getElementById('firstname-input')?.value;

            if (firstname) {
                // Signup Request
                const res = await fetch(`${API_URL}/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ firstname, email, password })
                });

                const data = await res.json();
                if (res.ok) {
                    alert("Signup successful! Please log in.");
                    window.location.href = "login.html";
                } else {
                    error_message.innerText = data.message;
                }
            } else {
                // Login Request
                const res = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("firstname", data.firstname);
                    window.location.href = "LoggedIn.html";
                } else {
                    error_message.innerText = data.message;
                }
            }
        });
    }

    // Protect the logged-in page
    if (window.location.pathname.includes("LoggedIn.html")) {
        checkAuth();
    }
});

async function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("firstname");
        window.location.href = "index.html";
    });

    // Fetch user-specific passwords
    const res = await fetch(`${API_URL}/passwords`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    const passwords = await res.json();
    console.log("User passwords:", passwords);
}

// Function to save a password
async function savePassword(website, password) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/save-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ website, password })
    });

    const data = await res.json();
    if (res.ok) {
        alert("Password saved successfully!");
    } else {
        alert(data.message);
    }
}
