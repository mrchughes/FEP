// Fully implemented real code for frontend/src/auth/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    const login = (userData) => {
        setUser(userData);
        navigate("/dashboard");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
