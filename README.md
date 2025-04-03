Password Management SPA
Overview
This project is a single-page application (SPA) designed for password management. The app allows users to sign up, log in, generate secure passwords, save passwords for later use, and check the health of their passwords. Since building a separate backend was not allowed, all data is stored in the browser's localStorage in JSON format.

Features
User Authentication

    Signup: Create a new account by providing your first name, email, and password. The password is encoded using Base64 and stored as a JSON object in localStorage.

    Login: Access your account by entering your registered email and password. If the credentials match those stored in localStorage, you are granted access to your dashboard.

Password Generator

    Generate a random password based on configurable options such as lowercase letters, uppercase letters, digits, and special characters.

    Adjust the length of the password using a slider.

    Easily copy the generated password to your clipboard.

Password Saver

    Save passwords along with the website and username/email associated with them.

    Choose a background color for each saved password entry for easy identification.

    Search through your saved passwords and view details in a modal, which also provides an option to delete an entry after confirming your account password.

Password Health Check

    Check the strength of a password by testing for various criteria such as length, inclusion of different character types, and ensuring it does not contain your name.

    Receive real-time feedback on how to improve your password.

Implementation Details
Frontend-Only SPA:

    Built using plain HTML, CSS, and JavaScript.

    Uses multiple sections in a single HTML file (index.html) that are shown or hidden via JavaScript to simulate different pages (e.g., login, signup, dashboard, etc.).

Data Storage with JSON:

    User credentials and saved passwords are stored in the browser's localStorage in JSON format.

    Since no external backend was allowed, JSON was the chosen method to simulate a database within the browser.

JavaScript Structure:

Authentication Functions:
    Handles signup (storing user data) and login (validating credentials) by using Base64 encoding for passwords.

Password Generator:
    Generates random passwords based on selected criteria from checkboxes and a range slider.

Password Saver:
    Saves password details (website, username, encoded password, and background color) and allows searching, viewing, and deleting saved passwords.

Password Health Check:
    Provides immediate feedback on password strength by checking for various conditions.

Navigation & UI Updates:
    Uses helper functions to navigate between sections, update the navigation bar based on authentication status, and manage modals for displaying password details.

Node.js Backend Functions (Optional):

    The code also includes backend functions (using Node.js and bcrypt) that could be used for file-based persistence if needed, though these are not active in the browser version.

How to Use the App
Open the App:
    Simply open index.html in your preferred web browser. All the functionality will run locally without any server requirements.

Authentication:

    Signup:
        Navigate to the Signup page using the provided link. Fill in your first name, email, password, and confirm your password. Upon successful signup, you'll be prompted to log in.

    Login:
        Enter your email and password on the Login page. If your credentials are correct, you'll be taken to the dashboard.

    Exploring Features:

Dashboard:
    After logging in, access the dashboard where you can use the navigation bar to explore other features.

    Password Generator:
        Use the Password Generator to create secure passwords by selecting your desired criteria and adjusting the password length.

    Password Saver:
        Save new passwords by entering the website, username/email, and password. You can also assign a background color for easy visual identification. Use the search bar to filter through your saved entries.

    Password Health Check:
        Test the strength of any password by typing it into the Password Health Check section and review the feedback provided.

Conclusion
    This Password Management SPA is a lightweight, fully functional application built without a separate backend. All data is stored using JSON in the browser's localStorage, making it simple to deploy and test locally. Enjoy managing your passwords with an intuitive interface and a host of useful features!