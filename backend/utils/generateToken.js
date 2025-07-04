// Fully implemented real code for backend/utils/generateToken.js
const jwt = require("jsonwebtoken");

const generateToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

module.exports = generateToken;
