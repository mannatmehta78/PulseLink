import mongoose from "mongoose";

const readingSchema = new mongoose.Schema({
  timestamp: Number,
  patientId: String,
  heartRate: Number,
  spo2: Number,
  temperature: Number
});

export const Reading = mongoose.model("Reading", readingSchema);
