require("dotenv").config();
const express = require("express");
let app = express();
app.use(express.json());

let port = process.env.port || 3306;

let authRouter = require("../routes/authRoutes");

app.use(authRouter);

app.listen(port, function () {
  console.log("app started on port:", port);
});
