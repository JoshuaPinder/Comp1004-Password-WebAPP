// auth.js - Local authentication for the password manager

// 10/03 - Import hashing library for password hashing!!

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const errorMessage = document.getElementById("error-message");

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const email = document.getElementById("email-input").value;
            const password = document.getElementById("password-input").value;
            const firstname = document.getElementById("firstname-input")?.value;
            
            if (firstname) {
                // Signup logic
                const result = signup(firstname, email, password);
                if (result.success) {
                    alert("Signup successful! Please log in.");
                    window.location.href = "login.html";
                } else {
                    errorMessage.innerText = result.message;
                }
            } else {
                // Login logic
                const result = login(email, password);
                if (result.success) {
                    alert("Login successful!");
                    window.location.href = "LoggedIn.html";
                } else {
                    errorMessage.innerText = result.message;
                }
            }
        });
    }
    
    // Ensure only logged-in users can access the dashboard
    if (window.location.pathname.includes("LoggedIn.html")) {
        checkAuth();
    }
});

// Function to handle user signup
function signup(firstname, email, password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    if (users.find(user => user.email === email)) {
        return { success: false, message: "Email already exists" };
    }
    
    const encodedPassword = btoa(password); // Base64 encoding (temporary obfuscation)
    users.push({ firstname, email, password: encodedPassword });
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true, message: "User registered successfully" };
}

// Function to handle user login
function login(email, password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const encodedPassword = btoa(password);
    const user = users.find(user => user.email === email && user.password === encodedPassword);
    
    if (!user) {
        return { success: false, message: "Invalid credentials" };
    }
    
    localStorage.setItem("loggedInUser", JSON.stringify({ email, firstname: user.firstname }));
    return { success: true, firstname: user.firstname };
}

// Function to check if user is logged in
function checkAuth() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("Please log in.");
        window.location.href = "login.html";
    }
}

// Logout function
function logout() {
    localStorage.removeItem("loggedInUser");
    alert("You have been logged out.");
    window.location.href = "index.html";
}

// Function to save a password
function savePassword(website, password) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        alert("You need to be logged in to save passwords.");
        return;
    }
    
    const encodedPassword = btoa(password); // Encode password before storing
    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];
    passwords.push({ email: loggedInUser.email, website, password: encodedPassword });
    localStorage.setItem("passwords", JSON.stringify(passwords));
    alert("Password saved successfully!");
}

// Function to retrieve saved passwords for the logged-in user
function getPasswords() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return [];
    
    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];
    return passwords.filter(p => p.email === loggedInUser.email).map(p => ({
        website: p.website,
        password: atob(p.password) // Decode password before displaying
    }));
}
