const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  res.sendFile("public/index.html");
});

module.exports = route;
