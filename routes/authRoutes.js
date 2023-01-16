const express = require("express");

let router = new express.Router();

let controller = require("../controllers/authController");

//POST /register

router.post("/register", controller.register);

module.exports = router;
