import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Reading } from "./models/readingModel.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/healthDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Store readings from loadgen or client
app.post("/api/reading", async (req, res) => {
  const reading = new Reading(req.body);
  await reading.save();

  io.emit("newReading", reading); // broadcast to frontend
  res.status(201).json({ success: true });
});

// Get average vitals for dashboard
app.get("/api/average", async (req, res) => {
  const readings = await Reading.find().sort({ timestamp: -1 }).limit(60);
  if (readings.length === 0) return res.json({ heartRate: 0, spo2: 0, temperature: 0 });

  const avg = {
    heartRate: readings.reduce((s, r) => s + r.heartRate, 0) / readings.length,
    spo2: readings.reduce((s, r) => s + r.spo2, 0) / readings.length,
    temperature: readings.reduce((s, r) => s + r.temperature, 0) / readings.length
  };
  res.json(avg);
});

// WebSocket for live updates
io.on("connection", (socket) => {
  console.log("🩷 Dashboard connected");
  socket.on("disconnect", () => console.log("❌ Dashboard disconnected"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
