const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.send("merhaba");
});

// SIGN UP

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Fill the inputs" });
  }
  const isEmailExist = await User.findOne({ email: email });
  if (isEmailExist) {
    return res.status(409).json({ error: "This email already exists" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      user: { name: savedUser.name, email: savedUser.email },
      message: "User has been created!",
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// SIGN IN

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Fill the inputs" });
  }
  try {
    const user = await User.findOne({ email: email });

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ error: "Password is incorrect!" });
    } else {
      const token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "24h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: new Date().getTime() + 1000 * 60 * 60 * 24,
        name: user.name,
        userId: user._id,
        email: email,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/getUsers/:id", async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select(
      "_id name email"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
