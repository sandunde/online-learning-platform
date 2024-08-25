const User = require("../models/User");

async function getUser(req, res) {
    try {
        const userId = req.user.id;
        const user = await User.findById({ _id: userId});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

module.exports = {getUser};