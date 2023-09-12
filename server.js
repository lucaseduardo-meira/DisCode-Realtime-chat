require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const session = require("express-session");
const formatMessage = require("./utils/messages");
const { connectDB } = require("./database/config/index");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: "uiodhfiuabfusuoga53da143108fboiad" }));
app.set("view engine", "ejs");

const bot = "DisCode Bot";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage(bot, "Welcome to DisCode"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(bot, `${user.username} has joined the room`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(bot, `${user.username} has left the chat`)
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

app.use("/", require("./router/routes"));
app.use(express.static(path.resolve(__dirname, "public")));

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
