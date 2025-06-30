// Fully implemented real code for frontend/src/components/Navbar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="govuk-navbar">
            <Link to="/" className="govuk-header__link">Funeral Expenses App</Link>
            {user && (
                <>
                    <Link to="/dashboard" className="govuk-header__link">Dashboard</Link>
                    <button onClick={logout} className="govuk-button govuk-button--secondary">Logout</button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
