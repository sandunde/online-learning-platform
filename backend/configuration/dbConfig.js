const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/auth", {
    serverSelectionTimeoutMS: 5001,
});

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (error) => {
    console.log("MongoDB connection error: ", error);
});

module.exports = mongoose;
