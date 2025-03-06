const fs = require('fs');
const bcrypt = require('bcryptjs');

const USERS_FILE = 'users.json';
const PASSWORDS_FILE = 'passwords.json';

// Load users from the file
function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Save users to the file
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Load saved passwords
function loadPasswords() {
    if (!fs.existsSync(PASSWORDS_FILE)) return [];
    return JSON.parse(fs.readFileSync(PASSWORDS_FILE));
}

// Save passwords to the file
function savePasswords(passwords) {
    fs.writeFileSync(PASSWORDS_FILE, JSON.stringify(passwords, null, 2));
}

// User Signup
function signup(firstname, email, password) {
    let users = loadUsers();
    if (users.find(user => user.email === email)) {
        return { success: false, message: 'Email already exists' };
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ firstname, email, password: hashedPassword });
    saveUsers(users);
    return { success: true, message: 'User registered successfully' };
}

// User Login
function login(email, password) {
    let users = loadUsers();
    const user = users.find(user => user.email === email);
    if (!user) return { success: false, message: 'User not found' };
    if (!bcrypt.compareSync(password, user.password)) return { success: false, message: 'Invalid credentials' };
    return { success: true, firstname: user.firstname };
}

// Save Password
function saveUserPassword(email, website, password) {
    let passwords = loadPasswords();
    const encryptedPassword = bcrypt.hashSync(password, 10);
    passwords.push({ email, website, encryptedPassword });
    savePasswords(passwords);
    return { success: true, message: 'Password saved successfully' };
}

// Retrieve Saved Passwords
function getUserPasswords(email) {
    let passwords = loadPasswords();
    return passwords.filter(entry => entry.email === email);
}

module.exports = { signup, login, saveUserPassword, getUserPasswords };