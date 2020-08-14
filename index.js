const express = require("express");
const app = express();
const PORT = 5000;

app.use("/", (req, res) => {
  res.send("Welcome to Man's Club");
});

//////////////////////////////////////////////////////////////////////
// const mysql = require("mysql");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "SolaFide22@",
//   database: "database_DOSIIN_dev",
// });
// connection.connect();

// connection.query("SELECT * from Tags", (error, rows, fields) => {
//   if (error) throw error;
//   console.log("User info is: ", rows);
// });

// connection.end();
//////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
