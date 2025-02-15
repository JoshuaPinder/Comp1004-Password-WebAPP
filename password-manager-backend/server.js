require("dotenv").config({ path: __dirname + "/.env" });
console.log("✅ Environment variables loaded.");

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

console.log("🚀 Starting server...");

// Middleware
app.use(express.json());  // Parse JSON requests
app.use(cors()); // Allow frontend requests

// **Connect to MongoDB**
console.log("🛠 MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// **User Schema**
const UserSchema = new mongoose.Schema({
  firstname: String,
  email: { type: String, unique: true },
  password: String
});

const PasswordSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  website: String,
  encryptedPassword: String
});

const User = mongoose.model("User", UserSchema);
const Password = mongoose.model("Password", PasswordSchema);

// **User Signup**
app.post("/signup", async (req, res) => {
  const { firstname, email, password } = req.body;

  if (!firstname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ firstname, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "🎉 User registered successfully!" });
  } catch (err) {
    res.status(400).json({ message: "Email already exists" });
  }
});

// **User Login**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, firstname: user.firstname });
});

// **Save User Password**
app.post("/save-password", async (req, res) => {
  const { token, website, password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newPassword = new Password({ userId: decoded.userId, website, encryptedPassword });
    await newPassword.save();
    res.json({ message: "🔐 Password saved successfully!" });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// **Retrieve User Passwords**
app.get("/passwords", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const passwords = await Password.find({ userId: decoded.userId });
    res.json(passwords);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

// **Start Server**
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//Default route
app.get("/", (req, res) => {
  res.send("🚀 Backend is Running!");
});
