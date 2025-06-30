// Fully implemented real code for frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import "./styles/govuk.css";
import "./styles/main.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
