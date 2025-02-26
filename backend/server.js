const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// ✅ Connect to MySQL Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mona1025!', // Your MySQL password
  database: 'expense_tracker', // Your database name
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ✅ User Registration Route
app.post("/api/register", async (req, res) => {
  try {
    console.log("📩 Registration Request Received:", req.body);

    const { fullName, email, username, password, phone, dob, gender } = req.body;

    if (!fullName || !email || !username || !password || !phone || !dob || !gender) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Check if user already exists
    db.query("SELECT * FROM register WHERE email = ? OR username = ?", [email, username], async (err, results) => {
      if (err) {
        console.error("❌ Database Query Error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the database
      const sql = `INSERT INTO register (name, email, username, password, phone, dob, gender) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      db.query(sql, [fullName, email, username, hashedPassword, phone, dob, gender], (err, result) => {
        if (err) {
          console.error("❌ Error Inserting User:", err);
          return res.status(500).json({ error: "Error saving user" });
        }

        console.log("✅ User Registered:", result);
        return res.status(201).json({ message: "Registration successful!" });
      });
    });
  } catch (error) {
    console.error("❌ Unexpected Server Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ✅ User Login Route with Login History
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query("SELECT * FROM register WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("❌ Database Query Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token with user.id
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Insert login record
    db.query(
      "INSERT INTO login (user_id) VALUES (?)",
      [user.id],
      (err, result) => {
        if (err) {
          console.error("❌ Failed to store login history:", err);
        } else {
          console.log("✅ Login history recorded:", result);
        }
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone,
        dob: user.dob,
        gender: user.gender
      }
    });
  });
});

// ✅ Logout Route to Store Logout Time
app.post("/api/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from headers

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Update the latest login entry with the logout_time
    db.query(
      "UPDATE login SET logout_time = CURRENT_TIMESTAMP WHERE user_id = ? ORDER BY login_time DESC LIMIT 1",
      [userId],
      (err, result) => {
        if (err) {
          console.error("❌ Failed to update logout time:", err);
          return res.status(500).json({ error: "Failed to log out" });
        }

        console.log("✅ Logout time recorded:", result);
        res.json({ message: "Logout successful" });
      }
    );
  } catch (error) {
    console.error("❌ Invalid Token:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

// ✅ Profile Route
app.get("/api/register/profile", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    db.query(
      "SELECT name, email, username, phone, dob, gender, salary, totalExpenses FROM register WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error("❌ Database Query Error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        res.json(results[0]); // Send user data
      }
    );
  } catch (error) {
    console.error("❌ Token Verification Failed:", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
});

// ✅ Update Profile Route
app.put("/api/register/update", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { name, phone, dob, gender } = req.body;

    db.query(
      "UPDATE register SET name = ?, phone = ?, dob = ?, gender = ? WHERE id = ?",
      [name, phone, dob, gender, userId],
      (err, result) => {
        if (err) {
          console.error("❌ Database Update Error:", err);
          return res.status(500).json({ error: "Failed to update profile" });
        }
        res.json({ message: "Profile updated successfully" });
      }
    );
  } catch (error) {
    console.error("❌ Token Verification Failed:", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));