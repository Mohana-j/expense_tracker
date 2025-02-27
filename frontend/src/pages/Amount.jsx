import React, { useState, useEffect } from "react";
import "../styles/amount.css";

const Amount = () => {
    const [income, setIncome] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [entryType, setEntryType] = useState("income"); // "income" or "transaction"
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/data", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                console.error("Error fetching data");
                return;
            }

            const data = await response.json();
            console.log("Fetched Data:", data);

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

        const apiEndpoint = entryType === "income" ? "/api/income" : "/api/transaction";
        const payload =
            entryType === "income"
                ? { amount: Number(amount), source: category }
                : { amount: Number(amount), category };

        try {
            const response = await fetch(`http://localhost:8000${apiEndpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error("Failed to add data");
                return;
            }

            setAmount("");
            setCategory("");
            await fetchData(); // ✅ Refresh Data after every entry
        } catch (error) {
            console.error(`Error adding ${entryType}:`, error);
        }
    };

    return (
        <div className="amount-page">
            <div className="balance-card">
                <h2>Account Balance</h2>
                <h1>${balance.toFixed(2)}</h1>
            </div>

            {/* Selection & Input Form */}
            <div className="entry-container">
                <h3>Add New Entry</h3>
                <select value={entryType} onChange={(e) => setEntryType(e.target.value)}>
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
                    {entryType === "income" ? "Add Income" : "Add Expense"}
                </button>
            </div>

            {/* Income & Expense Summary */}
            <div className="data-container">
                <div className="income-container">
                    <h3>Total Income</h3>
                    <h2>${income.toFixed(2)}</h2>
                </div>

                <div className="transaction-container">
                    <h3>Total Expenses</h3>
                    <h2>${transactions.reduce((total, item) => total + Number(item.amount), 0).toFixed(2)}</h2>
                </div>
            </div>
        </div>
    );
};

export default Amount;
