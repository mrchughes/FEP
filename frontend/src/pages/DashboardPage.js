// Fully implemented real code for frontend/src/pages/DashboardPage.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth/AuthContext";

const DashboardPage = () => {
    const { user } = useContext(AuthContext);

    return (
        <div>
            <h2>Welcome, {user?.name}</h2>
            <Link to="/form" className="govuk-button">Start or Resume Form</Link>
        </div>
    );
};

export default DashboardPage;
