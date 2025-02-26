import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const getIncome = async (userId) => {
    return await axios.get(`${API_URL}/income/${userId}`);
};

export const addIncome = async (data) => {
    return await axios.post(`${API_URL}/income`, data);
};
