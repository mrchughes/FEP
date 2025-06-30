// Fully implemented real code for frontend/src/pages/RegisterPage.js
import React, { useState, useContext } from "react";
import AuthContext from "../auth/AuthContext";
import { register } from "../api";

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const { login: loginUser } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await register(formData);
        loginUser(data);
    };

    return (
        <form onSubmit={handleSubmit} className="govuk-form">
            <h2>Register</h2>
            <div className="govuk-form-group">
                <label className="govuk-label">Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="govuk-input" />
            </div>
            <div className="govuk-form-group">
                <label className="govuk-label">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} className="govuk-input" />
            </div>
            <div className="govuk-form-group">
                <label className="govuk-label">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="govuk-input" />
            </div>
            <button className="govuk-button">Register</button>
        </form>
    );
};

export default RegisterPage;
