require('dotenv').config();
const express = require("express");
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const authenticatedRoute = require("./routes/authenticated");
const studentRoute = require("./routes/student");
const courseRoute = require("./routes/course");
const enrollmentRoute = require("./routes/enrollment");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createAdminAccount } = require("./scripts/admin");

const app = express();
const PORT = process.env.port || 5001;

app.use(bodyParser.json());
app.use(cors());

createAdminAccount();

app.use("/user", signupRoute);
app.use("/auth", loginRoute);
app.use("/api", authenticatedRoute);
app.use("/api", studentRoute);
app.use("/api", courseRoute);
app.use('/api/enrollments', enrollmentRoute);


app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
