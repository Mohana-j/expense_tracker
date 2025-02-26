import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const getTransactions = async (userId) => {
    return await axios.get(`${API_URL}/transaction_history/${userId}`);
};

export const addTransaction = async (data) => {
    return await axios.post(`${API_URL}/transaction`, data);
};
