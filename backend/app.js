// Fully implemented real code for backend/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const formRoutes = require("./routes/formRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

module.exports = app;
