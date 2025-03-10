import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this
import "../styles/amount.css";

const Amount = () => {
    const [income, setIncome] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [entryType, setEntryType] = useState("income");
    const [editId, setEditId] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate(); // Add this

    useEffect(() => {
        if (!token) {
            navigate("/"); // Redirect to login if no token
            return;
        }
        fetchData();
    }, [token, navigate]);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/data", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/"); // Redirect to login if unauthorized
                }
                console.error("Error fetching data:", response.status);
                return;
            }

            const data = await response.json();
            const totalIncome = Number(data.income || 0);
            const transactionList = Array.isArray(data.transactions) ? data.transactions : [];
            const totalExpenses = transactionList.reduce((total, item) => total + Number(item.amount || 0), 0);

            setIncome(totalIncome);
            setTransactions(transactionList);
            setBalance(totalIncome - totalExpenses);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSubmit = async () => {
        if (!amount || !category) {
            alert("Please enter amount and category!");
            return;
        }

        const apiEndpoint = editId ? `/api/transaction/${editId}` : entryType === "income" ? "/api/income" : "/api/transaction";
        const method = editId ? "PUT" : "POST";
        const payload = { amount: Number(amount), category };

        try {
            const response = await fetch(`http://localhost:8000${apiEndpoint}`, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error("Failed to add/update data");
                return;
            }

            setAmount("");
            setCategory("");
            setEditId(null);
            await fetchData();
        } catch (error) {
            console.error(`Error adding/updating ${entryType}:`, error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/transaction/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to delete");
            await fetchData();
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    return (
        <div className="amount-page">
            <div className="balance-card">
                <h2>Account Balance</h2>
                <h1>${balance.toFixed(2)}</h1>
            </div>

            <div className="entry-container">
                <h3>{editId ? "Edit Entry" : "Add New Entry"}</h3>
                <select value={entryType} onChange={(e) => setEntryType(e.target.value)}>
                    <option value="income">Salary (Income)</option>
                    <option value="transaction">Expense (Transaction)</option>
                </select>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter Amount" />
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder={entryType === "income" ? "Income Source" : "Expense Category"} />
                <button onClick={handleSubmit}>{editId ? "Update" : entryType === "income" ? "Add Income" : "Add Expense"}</button>
            </div>

            <div className="data-container">
                <h3>Transaction History</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>${Number(transaction.amount || 0).toFixed(2)}</td>
                                <td>{transaction.category}</td>
                                <td>
                                    <button onClick={() => { setEditId(transaction.id); setAmount(transaction.amount); setCategory(transaction.category); setEntryType("transaction"); }}>Edit</button>
                                    <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Amount;