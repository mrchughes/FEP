// Fully implemented real code for backend/controllers/authController.js
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { createUser, findUserByEmail } = require("../services/dynamodbService");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await findUserByEmail(email);
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await createUser({ name, email, password: hashedPassword });

    res.status(201).json({
        name,
        email,
        token: generateToken(email),
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    res.json({
        name: user.name,
        email: user.email,
        token: generateToken(user.email),
    });
});

module.exports = { registerUser, loginUser };
