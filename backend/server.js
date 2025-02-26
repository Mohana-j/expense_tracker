const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// ✅ Connect to MySQL Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mona1025!", // Your MySQL password
  database: "expense_tracker",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ✅ Middleware to Verify Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error("🚨 No authorization header!");
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("🚨 Token missing!");
    return res.status(401).json({ error: "Unauthorized - Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("🚨 Invalid Token:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

// ✅ User Registration Route
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, username, password, phone, dob, gender } = req.body;
    if (!fullName || !email || !username || !password || !phone || !dob || !gender) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    db.query("SELECT * FROM register WHERE email = ? OR username = ?", [email, username], async (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (results.length > 0) return res.status(400).json({ error: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        "INSERT INTO register (name, email, username, password, phone, dob, gender) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [fullName, email, username, hashedPassword, phone, dob, gender],
        (err, result) => {
          if (err) return res.status(500).json({ error: "Error saving user" });
          res.status(201).json({ message: "Registration successful!" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ✅ User Login Route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "All fields are required" });

  db.query("SELECT * FROM register WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(400).json({ error: "Invalid email or password" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
});

// ✅ Profile Route (Fixes Unauthorized Issue)
app.get("/api/register/profile", verifyToken, (req, res) => {
  console.log("✅ User ID from Token:", req.userId);

  db.query(
    "SELECT id, name, email, username, phone, dob, gender, salary, totalExpenses FROM register WHERE id = ?",
    [req.userId],
    (err, results) => {
      if (err) {
        console.error("❌ Database Query Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        console.error("❌ User Not Found");
        return res.status(404).json({ error: "User not found" });
      }

      console.log("✅ Sending User Data:", results[0]);
      res.json(results[0]); // Send user data
    }
  );
});

// ✅ Update Profile Route (Protected)
app.put("/api/register/update", verifyToken, (req, res) => {
  const { name, phone, dob, gender } = req.body;
  db.query(
    "UPDATE register SET name = ?, phone = ?, dob = ?, gender = ? WHERE id = ?",
    [name, phone, dob, gender, req.userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to update profile" });
      res.json({ message: "Profile updated successfully" });
    }
  );
});

// ✅ Logout Route
app.post("/api/logout", verifyToken, (req, res) => {
  db.query(
    "UPDATE login SET logout_time = CURRENT_TIMESTAMP WHERE user_id = ? ORDER BY login_time DESC LIMIT 1",
    [req.userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to log out" });
      res.json({ message: "Logout successful" });
    }
  );
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
