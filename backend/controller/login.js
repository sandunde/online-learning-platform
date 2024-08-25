const bcrypt = require("bcrypt");
const User = require("../models/User");
const {generateToken} = require("../utils/jwtUtil");

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({email});
        if (!existingUser) {
            throw new error("user not found");
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            throw new error("Incorrect password");
        }
        const token = generateToken(existingUser);
        res.status(200).json({message: "Login successful", token: token, user: existingUser});
    } catch (error) {
        res.status(401).json({message: "Invalid credientials"})
    }
}

module.exports = {login}