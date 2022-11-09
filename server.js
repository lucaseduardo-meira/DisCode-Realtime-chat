const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const bot = "DisCode Bot";

io.on("connection", (socket) => {
  socket.emit("message", formatMessage(bot, "Welcome to DisCode"));

  socket.broadcast.emit(
    "message",
    formatMessage(bot, "A user has joined the chat")
  );

  socket.on("disconnect", () => {
    io.emit("message", formatMessage(bot, "A user has left the chat"));
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("user", msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
