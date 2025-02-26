import React, { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import "../styles/amount.css";

const Amount = () => {
    const [income, setIncome] = useState(5000); // Example Income
    const [transactions, setTransactions] = useState([
        { id: 1, name: "Groceries", amount: 200 },
        { id: 2, name: "Electricity Bill", amount: 150 },
        { id: 3, name: "Entertainment", amount: 100 },
    ]);

    // Calculate total expenses and balance
    const totalExpenses = transactions.reduce((total, item) => total + item.amount, 0);
    const balance = income - totalExpenses;

    // Chart Data
    const expenseData = transactions.map(item => ({ name: item.name, value: item.amount }));
    const lineChartData = transactions.map((item, index) => ({ day: `Day ${index + 1}`, amount: item.amount }));

    return (
        <div className="amount-page">
            {/* Balance Overview */}
            <div className="balance-card">
                <h2>Account Balance</h2>
                <h1>${balance.toFixed(2)}</h1>
            </div>

            <div className="data-container">
                {/* Income Container */}
                <div className="income-container">
                    <h3>Total Income</h3>
                    <h2>${income}</h2>
                </div>

                {/* Transaction Container */}
                <div className="transaction-container">
                    <h3>Total Expenses</h3>
                    <h2>${totalExpenses}</h2>
                </div>
            </div>

            {/* Transaction History */}
            <div className="history-container">
                <div className="history-box">
                    <h3>Transaction History</h3>
                    <ul>
                        {transactions.map(txn => (
                            <li key={txn.id}>
                                {txn.name}: <span className="expense-amount">- ${txn.amount}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="history-box">
                    <h3>Income History</h3>
                    <ul>
                        <li>Salary: <span className="income-amount">+ $5000</span></li>
                    </ul>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-container">
                {/* Bar Chart */}
                <div className="chart-box">
                    <h3>Expense Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={transactions}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Bar dataKey="amount" fill="#ff7300" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="chart-box">
                    <h3>Expense Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#0088FE" label />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Line Chart */}
                <div className="chart-box">
                    <h3>Daily Spending</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartData}>
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Line type="monotone" dataKey="amount" stroke="#ff7300" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Amount;
