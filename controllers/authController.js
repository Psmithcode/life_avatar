//to start, I'm going to bring in everyhting i'll need

let db = require("../src/dbConnection");
let argon = require("argon2");
// const express = require("express");
const jwt = require("jsonwebtoken");
let JWT_SECRET = process.env.JWT_SECRET;
// let mysql = require("mysql");

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

  db.query(sql, params, function (error, results) {
    if (error) {
      console.log("there was an error with the register query", error);
      res.sendStatus(500);
    } else {
      // console.log("user registered succesfully", results);
      res.sendStatus(202);
    }
  });
};

let login = async function (req, res) {
  //   1. get the email and password from the request
  //   2. get the password hash from the db for the email
  //         2a. if no email exists, return 403
  //         2b. if more than 1 email exists, return 500
  //         2c. if exactly 1 email exists, go to #3
  //   3. compare the password to the pasword hash
  //   4. if they matchMedia, return a Token
  //   5. if they do not match, return a 403

  let email = req.body.email;
  let password = req.body.password;

  let sql = "select password_hash from users where email = ?";
  let params = [email];
  db.query(sql, params, async function (err, results) {
    if (err) {
      console.error("could not get login info", err);
      res.sendStatus(500);
      return;
    }
    if (results.length == 0) {
      res.sendStatus(403);
      return;
    }
    if (results.length > 1) {
      res.sendStatus(500);
      return;
    }

    let pwHash = results[0].password_hash;

    let good = await argon.verify(pwHash, password);

    if (good) {
      //return a token

      let token = {};
      token.email = email;

      let signedToken = jwt.sign(token, JWT_SECRET);

      res.json(signedToken);
    } else {
      res.sendStatus(403);
    }
  });
};

module.exports = {
  register,
  login,
};
