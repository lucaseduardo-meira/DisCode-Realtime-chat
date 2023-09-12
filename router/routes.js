const path = require("path");
const express = require("express");
const route = express.Router();
const User = require("../database/models/user");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { query } = require("express");

route.get("/", (req, res) => {
  res.render("index");
});
route.post("/", async (req, res) => {
  const { email, password, room } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.render("login_erro", { erro: "User not found" });

  const hash = user.password;

  if (!(await bcrypt.compare(password, hash))) {
    return res.render("login_erro", { erro: "Wrong password" });
  }

  req.session.login = user.username;
  res.redirect(`/chat?username=${user.username}&room=${room}`);
});

route.get("/register", (req, res) => {
  res.sendFile(path.resolve("public/register.html"));
});
route.post("/register", async (req, res) => {
  const { email, username } = req.body;
  var { password } = req.body;

  if (await User.findOne({ email })) {
    return res.status(400).json({ Erro: "Email already registered" });
  }

  if (await User.findOne({ username })) {
    return res.status(400).json({ Erro: "Username already registered" });
  }

  password = await bcrypt.hash(password, 10);
  const user = await User.create({ email, username, password });

  req.session.login = user.username;
  res.redirect(`/chat?username=${user.username}&room=JavaScript`);
});

route.get("/chat", (req, res) => {
  const rooms = [
    "JavaScript",
    "React",
    "Python",
    "PHP",
    "C#",
    "Ruby",
    "Java",
    "Front-End",
    "Back-End",
  ];

  const { username, room } = req.query;
  if (req.session.login === username) {
    if (!rooms.includes(room)) {
      return res.json({ Error: "Room Not Found" });
    }
    return res.render("chat");
  }
  res.json({ Error: "User not logged" });
});

route.get("/logout", async (req, res) => {
  req.session.login = null;
  res.redirect("/");
});

module.exports = route;
