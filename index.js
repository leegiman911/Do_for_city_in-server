const express = require("express");
const app = express();
const PORT = 5000;

app.use("/", (req, res) => {
  res.send("Welcome to Man's Club");
});

app.listen(PORT, () => {
  console.log(`server on ${PORT}`)
});
