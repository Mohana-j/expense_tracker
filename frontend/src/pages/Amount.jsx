import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
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
                    navigate("/");
                }
                throw new Error("Error fetching data");
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

        const apiEndpoint = editId 
            ? `/api/transaction/${editId}` 
            : entryType === "income" 
            ? "/api/income" 
            : "/api/transaction";
        const method = editId ? "PUT" : "POST";
        const payload = { amount: Number(amount), category };

        try {
            const response = await fetch(`http://localhost:8000${apiEndpoint}`, {
                method,
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add/update data");
            }

            setAmount("");
            setCategory("");
            setEditId(null);
            setEntryType("income");
            await fetchData();
        } catch (error) {
            console.error(`Error adding/updating ${entryType}:`, error);
            alert(error.message);
        }
    };

    const handleEdit = (transaction) => {
        setEditId(transaction.transaction_id); // Changed from transaction.id
        setAmount(transaction.amount);
        setCategory(transaction.category);
        setEntryType("transaction");
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/transaction/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || "Failed to delete transaction");
            }

            await fetchData();
        } catch (error) {
            console.error("Error deleting transaction:", error);
            alert(`Delete failed: ${error.message}`);
        }
    };

    return (
        <div className="amount-page">
            <div className="balance-card">
                <h2>Account Balance</h2>
                <h1>${balance.toFixed(2)}</h1>
            </div>

            <div className="entry-container">
                <h3>{editId ? "Edit Transaction" : "Add New Entry"}</h3>
                <select 
                    value={entryType} 
                    onChange={(e) => setEntryType(e.target.value)}
                    disabled={editId}
                >
                    <option value="income">Salary (Income)</option>
                    <option value="transaction">Expense (Transaction)</option>
                </select>
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="Enter Amount" 
                />
                <input 
                    type="text" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    placeholder={entryType === "income" ? "Income Source" : "Expense Category"} 
                />
                <button onClick={handleSubmit}>
                    {editId ? "Update Transaction" : entryType === "income" ? "Add Income" : "Add Expense"}
                </button>
                {editId && (
                    <button onClick={() => {
                        setEditId(null);
                        setAmount("");
                        setCategory("");
                        setEntryType("income");
                    }}>
                        Cancel Edit
                    </button>
                )}
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
                            <tr key={transaction.transaction_id}> {/* Changed from transaction.id */}
                                <td>${Number(transaction.amount || 0).toFixed(2)}</td>
                                <td>{transaction.category}</td>
                                <td>
                                    <button onClick={() => handleEdit(transaction)}>Edit</button>
                                    <button onClick={() => handleDelete(transaction.transaction_id)}>Delete</button> {/* Changed from transaction.id */}
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