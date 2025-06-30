// Fully implemented real code for frontend/src/pages/FormPage.js
import React, { useState, useEffect, useContext } from "react";
import { getResumeData, submitForm } from "../api";
import AuthContext from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const FormPage = () => {
    const [formData, setFormData] = useState({});
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getResumeData(user.token);
            setFormData(data || {});
        };
        fetchData();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await submitForm(formData, user.token);
        navigate("/confirmation", { state: { downloadUrl: response.downloadUrl } });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="govuk-form-group">
                <label className="govuk-label">Deceased's Full Name</label>
                <input name="deceasedName" value={formData.deceasedName || ""} onChange={handleChange} className="govuk-input" />
            </div>

            <div className="govuk-form-group">
                <label className="govuk-label">Relationship to Deceased</label>
                <input name="relationship" value={formData.relationship || ""} onChange={handleChange} className="govuk-input" />
            </div>

            <div className="govuk-form-group">
                <label className="govuk-label">Reason for Funeral Payment</label>
                <input name="reason" value={formData.reason || ""} onChange={handleChange} className="govuk-input" />
            </div>

            {/* Example dynamic question */}
            {formData.relationship !== "Friend" && (
                <div className="govuk-form-group">
                    <label className="govuk-label">Do you live at the same address?</label>
                    <input name="sameAddress" value={formData.sameAddress || ""} onChange={handleChange} className="govuk-input" />
                </div>
            )}

            <button className="govuk-button">Submit Form</button>
        </form>
    );
};

export default FormPage;
