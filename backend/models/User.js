const mongoose = require("../configuration/dbConfig");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {type: String, enum: ["admin", "student"], default: "student"}
});

module.exports = mongoose.model("User", userSchema);