const express = require("express");
const app = express();

const connect = require("./connection/connection");

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World!!!</h1>");
});

connect()
  .catch((err) => {
    throw err;
  })
  .then(() => {
    app.listen(port, () => console.log(`Listen on port ${port}`));
  });
