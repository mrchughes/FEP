// Fully implemented real code for frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FormPage from "./pages/FormPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./auth/PrivateRoute";

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/form" element={<PrivateRoute><FormPage /></PrivateRoute>} />
                <Route path="/confirmation" element={<PrivateRoute><ConfirmationPage /></PrivateRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
