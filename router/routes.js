const path = require("path");
const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  res.sendFile("public/index.html");
});
route.post("/", (req, res) => {
  res.send(req.body);
  // const { email, password } = req.body;

  // const user = User.findOne({ email }.select("+password"));

  // if (!user) return res.status(400).send({ error: "Usuário não encontrado" });
  // console.log(user);
});

route.get("/register", (req, res) => {
  res.sendFile(path.resolve("public/register.html"));
});

module.exports = route;
