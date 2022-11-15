const path = require("path");
const express = require("express");
const route = express.Router();
const User = require("../database/models/user");
const session = require("express-session");
const bcrypt = require("bcrypt");

route.get("/", (req, res) => {
  res.sendFile("public/index.html");
});
route.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).send({ error: "Usuário não encontrado" });

  const hash = user.password;

  if (!(await bcrypt.compare(password, hash))) {
    return res.json({ Erro: "Senha incorreta" });
  }

  req.session.login = user.username;
  res.redirect(`/chat?username=${user.username}&room=JavaScript`);
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

  res.redirect(`/chat?username=${user.username}&room=JavaScript`);
});

route.get("/chat", (req, res) => {
  res.sendFile(path.resolve("public/chat.html"));
});

module.exports = route;
