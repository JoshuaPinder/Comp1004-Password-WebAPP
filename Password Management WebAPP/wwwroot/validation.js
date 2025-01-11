const form = document.getElementById('form');
const firstname_input = document.getElementById('firstname-input');
const email_input = document.getElementById('email-input');
const password_input = document.getElementById('password-input');
const repeat_password_input = document.getElementById('repeat-password-input');
const error_message = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
    let errors = [];

    if (firstname_input) {
        // Signup Form
        errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, repeat_password_input.value);
        if (errors.length === 0) {
            // Save user data
            saveUser(firstname_input.value, email_input.value, password_input.value);
            alert("Account created successfully! Please log in.");
            window.location.href = "login.html"; // Redirect to login
        }
    } else {
        // Login Form
        errors = getLoginFormErrors(email_input.value, password_input.value);
        if (errors.length === 0) {
            if (authenticateUser(email_input.value, password_input.value)) {
                localStorage.setItem("isLoggedIn", "true");
                alert("Login successful!");
                window.location.href = "LoggedIn.html"; // Redirect to dashboard
            } else {
                errors.push("Invalid email or password.");
            }
        }
    }

    if (errors.length > 0) {
        e.preventDefault();
        error_message.innerText = errors.join(". ");
    }
});

function getSignupFormErrors(firstname, email, password, repeatPassword) {
    let errors = [];
    if (firstname === '' || firstname == null) errors.push('Firstname is required');
    if (email === '' || email == null) errors.push('Email is required');
    if (password === '' || password == null) errors.push('Password is required');
    if (password.length < 8) errors.push('Password must have at least 8 characters');
    if (password !== repeatPassword) errors.push('Passwords do not match');
    return errors;
}

function getLoginFormErrors(email, password) {
    let errors = [];
    if (email === '' || email == null) errors.push('Email is required');
    if (password === '' || password == null) errors.push('Password is required');
    return errors;
}

function saveUser(firstname, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ firstname, email, password });
    localStorage.setItem('users', JSON.stringify(users));
}

function authenticateUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.email === email && user.password === password);
}

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    let errors = [];

    if (firstname_input) {
        // Signup Form
        errors = getSignupFormErrors(firstname_input.value, email_input.value, password_input.value, repeat_password_input.value);
        if (errors.length === 0) {
            // Save user data
            saveUser(firstname_input.value, email_input.value, password_input.value);
            alert("Account created successfully! Please log in.");
            window.location.href = "login.html"; // Redirect to login
        }
    } else {
        // Login Form
        errors = getLoginFormErrors(email_input.value, password_input.value);
        if (errors.length === 0) {
            if (authenticateUser(email_input.value, password_input.value)) {
                localStorage.setItem("isLoggedIn", "true");
                alert("Login successful!");
                window.location.href = "LoggedIn.html"; // Redirect to the dashboard
            } else {
                errors.push("Invalid email or password.");
            }
        }
    }

    if (errors.length > 0) {
        error_message.innerText = errors.join(". ");
    }
});
