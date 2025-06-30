// Fully implemented real code for frontend/src/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const register = async (userData) => {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    return res.data;
};

export const login = async (userData) => {
    const res = await axios.post(`${API_URL}/auth/login`, userData);
    return res.data;
};

export const submitForm = async (formData, token) => {
    const res = await axios.post(`${API_URL}/forms/submit`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const getResumeData = async (token) => {
    const res = await axios.get(`${API_URL}/forms/resume`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
