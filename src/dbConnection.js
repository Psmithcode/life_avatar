//In this file, i'm going to connect to our mysql databse with the myswl node module
//We'll start by bringing in the module
let mysql = require("mysql");

//then i'm going to make the connection to the database

let connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  root: process.env.root,
  //   port: process.env.dbport
});
// after that, I'm going to query the connection just to make sure we are connected on app startup

connection.query("select now()", function (err, results) {
  if (err) {
    console.log("we had an error connecting to the database", err);
  } else {
    console.log("Connection established succesfully", results);
  }
});

module.exports = { connection };
