const mongoose = require("../configuration/dbConfig");

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: String, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model("Course", courseSchema);
