const path = require("path");
const express = require("express");
const route = express.Router();
const User = require("../database/models/user");

route.get("/", (req, res) => {
  res.sendFile("public/index.html");
});
route.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).send({ error: "Usuário não encontrado" });

  res.json(user);
});

route.get("/register", (req, res) => {
  res.sendFile(path.resolve("public/register.html"));
});
route.post("/register", async (req, res) => {
  const { email, username } = req.body;

  if (await User.findOne({ email })) {
    return res.status(400).json({ Erro: "Email já cadastrado" });
  }

  if (await User.findOne({ username })) {
    return res.status(400).json({ Erro: "Username já cadastrado" });
  }
  const user = await User.create(req.body);

  res.json({ Message: "Usuario criado", User: user });
});

module.exports = route;
