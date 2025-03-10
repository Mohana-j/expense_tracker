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
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "Mona1025!", // Secure with .env
    database: process.env.DB_NAME || "expense_tracker",
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err);
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).json({ error: "Access denied - No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(403).json({ error: "Access denied - Invalid token format" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
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
                (err) => {
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

        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({
            message: "Login successful",
            token,
            user: { id: user.user_id, name: user.name, email: user.email },
        });
    });
});

// ✅ Add Income Route
app.post("/api/income", verifyToken, (req, res) => {
    const { amount, source } = req.body;
    if (!amount || !source) {
        return res.status(400).json({ error: "Income amount and source are required!" });
    }

    db.query(
        "INSERT INTO income (user_id, amount, source) VALUES (?, ?, ?)",
        [req.userId, amount, source],
        (err, result) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.status(201).json({ message: "Income added successfully!" });
        }
    );
});

// ✅ Add Transaction Route & Update Balance
app.post("/api/transaction", verifyToken, (req, res) => {
    const { amount, category } = req.body;
    if (!amount || !category) {
        return res.status(400).json({ error: "Transaction amount and category are required!" });
    }

    // Get the user's total income and total expenses
    db.query("SELECT SUM(amount) AS total_income FROM income WHERE user_id = ?", [req.userId], (err, incomeResult) => {
        if (err) return res.status(500).json({ error: "Database error" });

        db.query("SELECT SUM(amount) AS total_expense FROM transaction WHERE user_id = ?", [req.userId], (err, expenseResult) => {
            if (err) return res.status(500).json({ error: "Database error" });

            const totalIncome = incomeResult[0].total_income || 0;
            const totalExpense = expenseResult[0].total_expense || 0;
            const newBalance = totalIncome - totalExpense - amount;

            if (newBalance < 0) {
                return res.status(400).json({ error: "Insufficient funds!" });
            }

            db.query(
                "INSERT INTO transaction (user_id, amount, category) VALUES (?, ?, ?)",
                [req.userId, amount, category],
                (err, result) => {
                    if (err) return res.status(500).json({ error: "Database error" });
                    res.status(201).json({ message: "Transaction added successfully!" });
                }
            );
        });
    });
});

app.put("/api/transaction/:id", verifyToken, (req, res) => {
    const { amount, category } = req.body;
    const transactionId = req.params.id;

    if (!amount || !category) {
        return res.status(400).json({ error: "Amount and category are required!" });
    }

    db.query(
        "SELECT * FROM transaction WHERE transaction_id = ? AND user_id = ?",
        [transactionId, req.userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Database error" });
            if (results.length === 0) return res.status(404).json({ error: "Transaction not found" });

            db.query(
                "UPDATE transaction SET amount = ?, category = ? WHERE transaction_id = ?",
                [amount, category, transactionId],
                (err) => {
                    if (err) return res.status(500).json({ error: "Database error" });
                    res.json({ message: "Transaction updated successfully!" });
                }
            );
        }
    );
});

app.delete("/api/transaction/:id", verifyToken, (req, res) => {
    const transactionId = req.params.id;

    db.query(
        "SELECT * FROM transaction WHERE transaction_id = ? AND user_id = ?",
        [transactionId, req.userId],
        (err, results) => {
            if (err) {
                console.error("Database SELECT Error:", err);
                return res.status(500).json({ error: "Database error", details: err.message });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: "Transaction not found or not authorized" });
            }

            db.query(
                "DELETE FROM transaction WHERE transaction_id = ?",
                [transactionId],
                (err) => {
                    if (err) {
                        console.error("Database DELETE Error:", err);
                        return res.status(500).json({ error: "Database error", details: err.message });
                    }
                    res.json({ message: "Transaction deleted successfully!" });
                }
            );
        }
    );
});


app.get("/api/data", verifyToken, (req, res) => {
    db.query("SELECT SUM(amount) AS income FROM income WHERE user_id = ?", [req.userId], (err, incomeResult) => {
        if (err) return res.status(500).json({ error: "Database error" });

        db.query(
            "SELECT transaction_id, amount, category FROM transaction WHERE user_id = ?",
            [req.userId],
            (err, transactionResults) => {
                if (err) return res.status(500).json({ error: "Database error" });

                const totalIncome = incomeResult[0].income || 0;
                const totalExpenses = transactionResults.reduce((total, item) => total + Number(item.amount || 0), 0);
                const balance = totalIncome - totalExpenses;

                res.json({
                    income: totalIncome,
                    transactions: transactionResults,
                    balance,
                });
            }
        );
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));