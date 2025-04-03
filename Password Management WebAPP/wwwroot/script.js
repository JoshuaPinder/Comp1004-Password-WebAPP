(function () {
    // Check if running in Node (backend) or browser
    const isNode = (typeof module !== 'undefined' && module.exports);
  
    /* ===================================
       PASSWORD GENERATOR FUNCTIONS
       =================================== */
    function generatePassword() {
      let dictionary = "";
      if (document.getElementById("lowercaseCb") && document.getElementById("lowercaseCb").checked) {
        dictionary += "qwertyuiopasdfghjklzxcvbnm";
      }
      if (document.getElementById("uppercaseCb") && document.getElementById("uppercaseCb").checked) {
        dictionary += "QWERTYUIOPASDFGHJKLZXCVBNM";
      }
      if (document.getElementById("digitsCb") && document.getElementById("digitsCb").checked) {
        dictionary += "1234567890";
      }
      if (document.getElementById("specialsCb") && document.getElementById("specialsCb").checked) {
        dictionary += "!@#$%^&*()_+-={}[];<>:";
      }
      const rangeInput = document.querySelector('input[type="range"]');
      const length = rangeInput ? rangeInput.value : 8;
      if (length < 1 || dictionary.length === 0) {
        return "";
      }
      let password = "";
      for (let i = 0; i < length; i++) {
        const pos = Math.floor(Math.random() * dictionary.length);
        password += dictionary[pos];
      }
      const pwdField = document.getElementById("generator-password");
      if (pwdField) {
        pwdField.value = password;
      }
      return password;
    }
  
    /* ===================================
       AUTHENTICATION FUNCTIONS
       =================================== */
    function signup(firstname, email, password) {
      let users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.find(user => user.email === email)) {
        return { success: false, message: "Email already exists" };
      }
      const encodedPassword = btoa(password);
      users.push({ firstname, email, password: encodedPassword });
      localStorage.setItem("users", JSON.stringify(users));
      return { success: true, message: "User registered successfully" };
    }
  
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
  
    function checkAuth() {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) {
        alert("Please log in.");
        navigateTo("login");
      }
    }
  
    function logout() {
      localStorage.removeItem("loggedInUser");
      alert("You have been logged out.");
      updateNavOnLogout();
      navigateTo("index");
    }
  
    function updateNavOnLogin() {
      const authActions = document.getElementById("authActions");
      const navMenu = document.getElementById("navMenu");
      if (authActions) authActions.style.display = "none";
      if (navMenu) navMenu.style.display = "flex";
      const userSpan = document.getElementById("user-firstname");
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (userSpan && loggedInUser) {
        userSpan.innerText = loggedInUser.firstname;
      }
    }
  
    function updateNavOnLogout() {
      const authActions = document.getElementById("authActions");
      const navMenu = document.getElementById("navMenu");
      if (authActions) authActions.style.display = "block";
      if (navMenu) navMenu.style.display = "none";
    }
  
    /* ===================================
       PASSWORD SAVER FUNCTIONS
       =================================== */
    function getContrastColor(hex) {
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      return (luminance > 128) ? '#000' : '#fff';
    }
  
    function savePassword(website, username, password, bgColor) {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) {
        alert("You need to be logged in to save passwords.");
        return;
      }
      let passwords = JSON.parse(localStorage.getItem("passwords")) || [];
      const hashedPassword = btoa(password);
      passwords.push({
        email: loggedInUser.email,
        website,
        username,
        password: hashedPassword,
        color: bgColor
      });
      localStorage.setItem("passwords", JSON.stringify(passwords));
      alert("Password saved successfully!");
      loadPasswords();
    }
  
    function loadPasswords() {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!loggedInUser) return;
  
      let passwords = JSON.parse(localStorage.getItem("passwords")) || [];
      // Filter for the current user's passwords
      let userPasswords = passwords.filter(p => p.email === loggedInUser.email);
  
      // Apply search filter if needed
      const searchInput = document.getElementById("search-input");
      const query = searchInput ? searchInput.value.toLowerCase() : "";
      if (query) {
        userPasswords = userPasswords.filter(item =>
          item.website.toLowerCase().includes(query)
        );
      }
  
      const passwordList = document.getElementById("password-list");
      if (passwordList) {
        passwordList.innerHTML = "";
        userPasswords.forEach((item, index) => {
          const div = document.createElement("div");
          div.className = "password-item";
          div.style.backgroundColor = item.color || "#e9e9e9";
          const textColor = getContrastColor(item.color || "#e9e9e9");
          div.innerHTML = `
            <span class="website" style="color:${textColor}; font-weight:600;">${item.website}</span>
            <button class="options-btn" data-index="${index}" style="color:${textColor};">⋮</button>
          `;
          passwordList.appendChild(div);
        });
  
        // Attach event listener for each "⋮" button to show full details
        const optionButtons = document.querySelectorAll(".options-btn");
        optionButtons.forEach(button => {
          button.addEventListener("click", function () {
            let enteredPassword = prompt("Enter your account password to view full details:");
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!loggedInUser) {
              alert("User not logged in");
              return;
            }
            let users = JSON.parse(localStorage.getItem("users")) || [];
            let user = users.find(u => u.email === loggedInUser.email);
            if (!user || btoa(enteredPassword) !== user.password) {
              alert("Incorrect account password.");
              return;
            }
            const idx = this.getAttribute("data-index");
            const item = userPasswords[idx];
            document.getElementById("modal-website").textContent = item.website;
            document.getElementById("modal-username").textContent = item.username;
            document.getElementById("modal-password").textContent = atob(item.password);
            // Set the delete button's data-index so deletion can occur correctly
            document.getElementById("delete-btn").setAttribute("data-index", idx);
            document.getElementById("popup-modal").classList.add("show-modal");
          });
        });
      }
    }
  
    function deletePassword(index) {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      let passwords = JSON.parse(localStorage.getItem("passwords")) || [];
      index = parseInt(index, 10);
      // Find the user's passwords and then determine the full index
      const userPasswords = passwords.filter(p => p.email === loggedInUser.email);
      const passwordToDelete = userPasswords[index];
      const fullIndex = passwords.findIndex(p =>
        p.email === loggedInUser.email &&
        p.website === passwordToDelete.website &&
        p.username === passwordToDelete.username &&
        p.password === passwordToDelete.password &&
        p.color === passwordToDelete.color
      );
      if (fullIndex > -1) {
        passwords.splice(fullIndex, 1);
        localStorage.setItem("passwords", JSON.stringify(passwords));
        loadPasswords();
      }
    }
  
    /* ===================================
       PASSWORD HEALTH CHECK
       =================================== */
    function checkPasswordStrength(password, userName) {
      const messages = [];
      let score = 0;
      if (password.length < 8) {
        messages.push("Password must be at least 8 characters long.");
      } else {
        score++;
      }
      if (!/[a-z]/.test(password)) {
        messages.push("Include at least one lowercase letter.");
      } else {
        score++;
      }
      if (!/[A-Z]/.test(password)) {
        messages.push("Include at least one uppercase letter.");
      } else {
        score++;
      }
      if (!/\d/.test(password)) {
        messages.push("Include at least one number.");
      } else {
        score++;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        messages.push("Include at least one special character.");
      } else {
        score++;
      }
      if (userName && password.toLowerCase().includes(userName.toLowerCase())) {
        messages.push("Password should not contain your name.");
      } else {
        score++;
      }
      return { score, messages };
    }
  
    /* ===================================
       NAVIGATION & MODAL HELPERS
       =================================== */
    function navigateTo(sectionId) {
      const pages = document.querySelectorAll('.page');
      pages.forEach(page => page.classList.remove('active'));
      const target = document.getElementById(sectionId);
      if (target) {
        target.classList.add('active');
      }
      if (sectionId === "passwordSaver") {
        loadPasswords();
      }
    }
  
    function closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove("show-modal");
    }
  
    /* ===================================
       DOMContentLoaded & EVENT LISTENERS
       =================================== */
    document.addEventListener("DOMContentLoaded", () => {
      // PASSWORD GENERATOR EVENTS
      const generatorSection = document.getElementById("passwordGenerator");
      if (generatorSection) {
        const checkboxes = generatorSection.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.addEventListener("click", generatePassword));
        const generateBtn = generatorSection.querySelector("button.generate");
        if (generateBtn) {
          generateBtn.addEventListener("click", generatePassword);
        }
        const rangeInput = generatorSection.querySelector('input[type="range"]');
        const rangeDisplay = generatorSection.querySelector("div.range span");
        if (rangeInput && rangeDisplay) {
          rangeInput.addEventListener("input", (e) => {
            rangeDisplay.innerHTML = e.target.value;
            generatePassword();
          });
        }
        const copyBtn = generatorSection.querySelector("div.password button");
        if (copyBtn) {
          copyBtn.addEventListener("click", () => {
            const pwdField = document.getElementById("generator-password");
            if (pwdField) {
              const pass = pwdField.value;
              navigator.clipboard.writeText(pass).then(() => {
                copyBtn.innerHTML = "copied!";
                setTimeout(() => { copyBtn.innerHTML = "copy"; }, 1000);
              });
            }
          });
        }
        generatePassword();
      }
  
      // AUTHENTICATION FORMS
  
      // Login Form
      const loginForm = document.getElementById("login-form");
      const loginError = document.getElementById("login-error-message");
      if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
          event.preventDefault();
          const email = document.getElementById("login-email").value;
          const password = document.getElementById("login-password").value;
          const result = login(email, password);
          if (result.success) {
            alert("Login successful!");
            navigateTo("dashboard");
            updateNavOnLogin();
          } else {
            loginError.innerText = result.message;
          }
        });
      }
  
      // Signup Form
      const signupForm = document.getElementById("signup-form");
      const signupError = document.getElementById("signup-error-message");
      if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
          event.preventDefault();
          const firstname = document.getElementById("signup-firstname").value;
          const email = document.getElementById("signup-email").value;
          const password = document.getElementById("signup-password").value;
          const repeatPassword = document.getElementById("signup-repeat-password").value;
          if (password !== repeatPassword) {
            signupError.innerText = "Passwords do not match";
            return;
          }
          const result = signup(firstname, email, password);
          if (result.success) {
            alert("Signup successful! Please log in.");
            navigateTo("login");
          } else {
            signupError.innerText = result.message;
          }
        });
      }
  
      // PROTECT DASHBOARD ACCESS
      if (document.getElementById("dashboard")) {
        checkAuth();
      }
  
      // PASSWORD HEALTH CHECK EVENT
      const healthInput = document.getElementById("health-password");
      if (healthInput) {
        healthInput.addEventListener("input", () => {
          const user = JSON.parse(localStorage.getItem("loggedInUser"));
          const userName = user && user.firstname ? user.firstname : "";
          const feedbackDiv = document.getElementById("health-feedback");
          if (feedbackDiv) {
            const result = checkPasswordStrength(healthInput.value, userName);
            feedbackDiv.innerHTML = "";
            if (result.messages.length > 0) {
              result.messages.forEach(msg => {
                const p = document.createElement("p");
                p.textContent = msg;
                p.className = "fail";
                feedbackDiv.appendChild(p);
              });
            } else if (healthInput.value.length > 0) {
              const p = document.createElement("p");
              p.textContent = "Your password meets all requirements!";
              p.className = "pass";
              feedbackDiv.appendChild(p);
            }
          }
        });
      }
  
      // PASSWORD SAVER EVENTS
      const passwordForm = document.getElementById("password-form");
      if (passwordForm) {
        passwordForm.addEventListener("submit", function (e) {
          e.preventDefault();
          const website = document.getElementById("website").value;
          const username = document.getElementById("username").value;
          const password = document.getElementById("password").value;
          // Read the selected color from the dropdown (id="colorDropdown")
          const bgColor = document.getElementById("colorDropdown").value;
          savePassword(website, username, password, bgColor);
          this.reset();
          // Optionally reset the dropdown to its default option
          document.getElementById("colorDropdown").selectedIndex = 0;
        });
      }
  
      // SEARCH BAR: Re-filter passwords as the user types
      const searchInput = document.getElementById("search-input");
      if (searchInput) {
        searchInput.addEventListener("input", loadPasswords);
      }
  
      // Load passwords when the Password Saver page is active
      if (document.getElementById("passwordSaver")) {
        loadPasswords();
      }
  
      // DELETE BUTTON in the password details modal
      const deleteBtn = document.getElementById("delete-btn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this password?")) {
            let enteredPassword = prompt("Enter your account password to confirm deletion:");
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!loggedInUser) {
              alert("User not logged in");
              return;
            }
            let users = JSON.parse(localStorage.getItem("users")) || [];
            let user = users.find(u => u.email === loggedInUser.email);
            if (!user || btoa(enteredPassword) !== user.password) {
              alert("Incorrect account password. Deletion aborted.");
              return;
            }
            const idx = deleteBtn.getAttribute("data-index");
            deletePassword(idx);
            closeModal("popup-modal");
          }
        });
      }
    });
  
    /* ===================================
       BACKEND (NODE.JS) FUNCTIONS (OPTIONAL)
       =================================== */
    if (isNode) {
      const fs = require('fs');
      const bcrypt = require('bcryptjs');
      const USERS_FILE = 'users.json';
      const PASSWORDS_FILE = 'passwords.json';
      function loadUsers() {
        if (!fs.existsSync(USERS_FILE)) return [];
        return JSON.parse(fs.readFileSync(USERS_FILE));
      }
      function saveUsers(users) {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      }
      function loadPasswordsBackend() {
        if (!fs.existsSync(PASSWORDS_FILE)) return [];
        return JSON.parse(fs.readFileSync(PASSWORDS_FILE));
      }
      function savePasswordsBackend(passwords) {
        fs.writeFileSync(PASSWORDS_FILE, JSON.stringify(passwords, null, 2));
      }
      function backendSignup(firstname, email, password) {
        let users = loadUsers();
        if (users.find(user => user.email === email)) {
          return { success: false, message: 'Email already exists' };
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        users.push({ firstname, email, password: hashedPassword });
        saveUsers(users);
        return { success: true, message: 'User registered successfully' };
      }
      function backendLogin(email, password) {
        let users = loadUsers();
        const user = users.find(user => user.email === email);
        if (!user) return { success: false, message: 'User not found' };
        if (!bcrypt.compareSync(password, user.password)) return { success: false, message: 'Invalid credentials' };
        return { success: true, firstname: user.firstname };
      }
      function saveUserPassword(email, website, password) {
        let passwords = loadPasswordsBackend();
        const encryptedPassword = bcrypt.hashSync(password, 10);
        passwords.push({ email, website, encryptedPassword });
        savePasswordsBackend(passwords);
        return { success: true, message: 'Password saved successfully' };
      }
      function getUserPasswords(email) {
        let passwords = loadPasswordsBackend();
        return passwords.filter(entry => entry.email === email);
      }
      module.exports = {
        backendSignup,
        backendLogin,
        saveUserPassword,
        getUserPasswords
      };
    }
  
    // Expose functions to the global scope as needed
    window.navigateTo = navigateTo;
    window.logout = logout;
    window.closeModal = closeModal;
  })();
  