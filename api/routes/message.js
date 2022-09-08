const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.post("/addMessage", async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = new Message({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    await data.save();
    if (data) {
      return res.json({ msg: "Message added succesfully" });
    } else {
      return res.json({ msg: "failed to add message to the database" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/getAllMessages", async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Message.find({ users: { $all: [from, to] } }).sort({
      updatedAt: 1,
    });

    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
