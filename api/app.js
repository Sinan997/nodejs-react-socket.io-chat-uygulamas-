const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const userRoute = require("./routes/user");
const messageRoute = require("./routes/message");
const dotenv = require("dotenv");
const socket = require("socket.io");
dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

mongoose.connect("mongodb://0.0.0.0:27017/Lunicate").then(() => {
  console.log("Database connected");
});

const server = app.listen(8800, () => {
  console.log("server is running at: http://localhost:8800");
});

const io = socket(server, {
  cors: { origin: "http://localhost:3000" },
  credentials: true,
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  console.log(global.onlineUsers);
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-message", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("message-receive", data.message);
    }
  });
});
