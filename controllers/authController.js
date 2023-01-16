//to start, I'm going to bring in everyhting i'll need

let database = require("../src/dbConnection");
let argon = require("argon2");
const express = require("express");
const jwt = require("jsonwebtoken");
let JWT_SECRET = process.env.JWT_SECRET;

//now i'll make the register function

let register = async function (req, res) {
  //I'll start by declaring the variable i need form the request
  let email = req.body.email;
  let firstName = req.body.first_name;
  let lastName = req.body.last_name;
  let password = req.body.password;
  let password_hash;

  //now let's set up a function to hash their password

  // i'll be using try and catch to accomplish this

  try {
    password_hash = await argon.hash(password);
  } catch (err) {
    console.log("could not hash password on register function", err);
  }

  //after I hash the password, I am going to insert the user data into the usres table

  let sql =
    "insert into users(first_name, last_name, email, password_hash) values(?, ?, ?, ?)";
  let params = [firstName, lastName, email, password_hash];

  database.query(sql, params, function (error, results) {
    if (error) {
      console.log("there was an error with the register query", error);
      res.sendStatus(500);
    } else {
      console.log("user registered succesfully");
      res.sendStatus(202);
    }
  });
};

module.exports = {
  register,
};
