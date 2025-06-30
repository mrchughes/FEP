// Fully implemented real code for frontend/src/pages/ConfirmationPage.js
import React from "react";
import { useLocation } from "react-router-dom";
import CompletedFormLink from "../components/CompletedFormLink";

const ConfirmationPage = () => {
    const location = useLocation();
    const { downloadUrl } = location.state || {};

    return (
        <div>
            <h2>Thank you for submitting your form</h2>
            {downloadUrl && <CompletedFormLink url={downloadUrl} />}
        </div>
    );
};

export default ConfirmationPage;
