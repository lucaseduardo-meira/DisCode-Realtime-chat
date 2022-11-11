const path = require("path");
const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  res.sendFile("public/index.html");
});

route.get("/register", (req, res) => {
  res.sendFile(path.resolve("public/register.html"));
});

module.exports = route;
