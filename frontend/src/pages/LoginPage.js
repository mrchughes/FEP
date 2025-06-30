// Fully implemented real code for frontend/src/pages/LoginPage.js
import React, { useState, useContext } from "react";
import AuthContext from "../auth/AuthContext";
import { login } from "../api";

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login: loginUser } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await login(formData);
        loginUser(data);
    };

    return (
        <form onSubmit={handleSubmit} className="govuk-form">
            <h2>Login</h2>
            <div className="govuk-form-group">
                <label className="govuk-label">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} className="govuk-input" />
            </div>
            <div className="govuk-form-group">
                <label className="govuk-label">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="govuk-input" />
            </div>
            <button className="govuk-button">Login</button>
        </form>
    );
};

export default LoginPage;
