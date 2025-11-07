import axios from "axios";

setInterval(async () => {
  const heartRate = 65 + Math.random() * 40;  // bpm
  const spo2 = 94 + Math.random() * 5;        // %
  const temperature = 36 + Math.random();     // °C

  const data = {
    patientId: "P001",
    heartRate: Math.round(heartRate),
    spo2: Math.round(spo2),
    temperature: parseFloat(temperature.toFixed(1)),
    timestamp: Date.now()
  };

  try {
    await axios.post("http://localhost:5000/api/reading", data);
    console.log("📡 Sent Reading:", data);
  } catch (error) {
    console.error("Error sending reading:", error.message);
  }
}, 2000);
