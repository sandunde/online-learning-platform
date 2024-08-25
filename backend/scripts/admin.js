const User = require("../models/User");
const bcrypt = require("bcrypt");

async function createAdminAccount() {
    try {
        const existingAdmin = await User.findOne({email: "admin@gmail.com"});
        if (!existingAdmin) {
            const newAdmin = new User({
                email: "admin@gmail.com",
                name: "Admin",
                role: "admin",
                password: await bcrypt.hash("admin", 10)
            })
            await newAdmin.save();
            console.log("Admin created successfully");
        } else {
            console.log("Admin account already exist");
        }
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports = {createAdminAccount};