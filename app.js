"use strict";
const express = require("express");

const Member = require("./models/members");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const connect = async () => {
  const URL = "mongodb://localhost";
  mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on("error", (err) => error("Connection error: " + err));
  db.once("open", () => app.listen(PORT, () => console.log(`Server is running on ${PORT}`)));
};

const getMemberById = async (req, res, next) => {
  try {
    res.member = await Member.findById(req.params.id);
    if (!res.member) {
      res.status(404).json({ message: "Cannot find member." });
      return;
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
    return;
  }
  next();
};

const getMembersByName = async (req, res, next) => {
  try {
    res.member = await Member.findOne({ name: req.params.name }).exec();
    if (!res.member) {
      res.status(404).json({ message: "Cannot find member." });
      return;
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
    return;
  }
  next();
};

app.post("/api/", async (req, res) => {
  const member = new Member({ ...req.body });

  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.get("/api/", async (req, res) => {
  try {
    const member = await Member.find();
    res.json(member);
  } catch (e) {
    res.status(500).json({ messeage: e.message });
  }
});

app.get("/api/:name", getMembersByName, (req, res) => {
  res.json(res.member);
});

app.patch("/api/:id", getMemberById, async (req, res) => {
  for (const key in req.body) {
    res.member[key] = req.body[key];
  }
  try {
    const updatedMember = await res.member.save();
    res.json(updatedMember);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

app.delete("/api/:id", getMemberById, async (req, res) => {
  try {
    await res.member.remove();
    res.json({ message: "Deleted member." });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

connect();
