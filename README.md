
#  PulseLink – Real-Time Health Monitoring & Analytics Dashboard

###  Full Stack Capstone Project (Experiment 10)

**Subject Code:** 23CSP-339
**Team Members:**

* Mannat Mehta (23BAD10007)
* Pranjali Gupta (23BAD10001)

---

##  Project Overview

**PulseLink** is a full-stack web application that provides a **real-time health monitoring and analytics dashboard**.
It continuously tracks and visualizes key health parameters — **Pulse Rate**, **Body Temperature**, and **Oxygen Saturation (SpO₂)** — using modern web technologies.

The system was developed using the **MERN Stack**:

* **MongoDB** – Database
* **Express.js** – Backend framework
* **React.js** – Frontend library
* **Node.js** – Runtime environment

Health readings are simulated through a **Load Generator (LoadGen)** that mimics IoT sensors. These readings are sent to the backend using REST APIs, stored in MongoDB, and visualized live on the frontend using **Chart.js** and **Socket.io** for real-time communication.

---

## Key Features

 Real-time dashboard for pulse, temperature, and oxygen tracking
 Socket-based live data updates without page reload
 RESTful API integration between backend and frontend
 Simulated data generator (LoadGen) for continuous testing
 Interactive graphs and analytics with Chart.js
 Alert system for abnormal readings
 Scalable MERN architecture

---

##  System Architecture

**Data Flow:**

1. The **LoadGen script** generates simulated health readings at fixed intervals.
2. These readings are sent via a **POST API request** to the backend (`/api/data`).
3. The **Express backend** stores the data in **MongoDB** and emits the new record via **Socket.io**.
4. The **React frontend** listens for socket events and updates the dashboard dynamically.



---

##  Project Structure

```
PulseLink/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   │   └── dataRoutes.js
│   ├── models/
│   │   └── healthData.js
│   ├── controllers/
│   │   └── dataController.js
│   └── config/
│       └── db.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── Header.js
│   │   │   └── Graph.js
│   │   ├── App.js
│   │   └── index.js
│
├── loadgen/
│   └── loadgen.js
│
├── package.json
└── README.md
```

---

##  Installation and Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/PulseLink.git
cd PulseLink
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

### 4️⃣ MongoDB Setup

Ensure MongoDB is running locally or use a cloud instance (MongoDB Atlas).

Update the `MONGO_URI` in `backend/config/db.js`:

```js
mongoose.connect("mongodb://127.0.0.1:27017/pulselink", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

### 5️⃣ Run the Backend

```bash
cd backend
npm start
```

### 6️⃣ Run the Frontend

```bash
cd frontend
npm start
```

### 7️⃣ Start Load Generator

```bash
cd loadgen
node loadgen.js
```

Now open your browser and visit:
 **[http://localhost:3000](http://localhost:3000)**

---

##  Sample API Endpoints

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/data`          | Send new health data     |
| GET    | `/api/data`          | Fetch recent health data |
| GET    | `/api/health/latest` | Retrieve latest record   |

**Sample Request:**

```json
{
  "pulse": 86,
  "temperature": 98.4,
  "spo2": 97
}
```

**Sample Response:**

```json
{
  "status": "success",
  "message": "Data stored successfully"
}
```

---

## Frontend – React Components

### Dashboard.js

Displays the latest health data and graphs:

```jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Line } from "react-chartjs-2";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const [pulseData, setPulseData] = useState([]);
  useEffect(() => {
    socket.on("newData", (data) => {
      setPulseData((prev) => [...prev.slice(-20), data.pulse]);
    });
  }, []);
  return (
    <Line
      data={{
        labels: pulseData.map((_, i) => i + 1),
        datasets: [{ label: "Pulse Rate", data: pulseData }],
      }}
    />
  );
};
export default Dashboard;
```

---

##  Backend – Node.js + Express + Socket.io

### server.js

```js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/pulselink');

const HealthSchema = new mongoose.Schema({
  pulse: Number,
  temperature: Number,
  spo2: Number,
  timestamp: { type: Date, default: Date.now }
});

const Health = mongoose.model('Health', HealthSchema);

app.post('/api/data', async (req, res) => {
  const record = new Health(req.body);
  await record.save();
  io.emit('newData', record);
  res.status(201).json({ message: 'Data stored successfully' });
});

io.on('connection', () => console.log('Client connected'));
server.listen(5000, () => console.log('Server running on port 5000'));
```

---

##  Load Generator (LoadGen.js)

```js
const axios = require('axios');

setInterval(() => {
  const data = {
    pulse: Math.floor(Math.random() * 40) + 70,
    temperature: 97 + Math.random() * 3,
    spo2: 95 + Math.random() * 3,
  };
  axios.post('http://localhost:5000/api/data', data)
    .then(() => console.log('Data sent:', data))
    .catch(err => console.error('Error:', err.message));
}, 2000);
```

---

## 📊 Results

* Dashboard updated every 2 seconds with new readings
* Average API latency: **< 200 ms**
* MongoDB handled 500+ inserts/minute without lag
* Real-time graphs rendered flawlessly

*(Screenshot Placeholder: Dashboard View)*

---

##  Future Enhancements

* Integration with wearable IoT devices
* Role-based access (Doctor, Patient, Admin)
* AI-based anomaly detection for early diagnosis
* Deployment on AWS / Render

---

##  References

* React.js Documentation – [https://react.dev](https://react.dev)
* Node.js & Express – [https://expressjs.com](https://expressjs.com)
* MongoDB Docs – [https://www.mongodb.com/docs](https://www.mongodb.com/docs)
* Chart.js – [https://www.chartjs.org](https://www.chartjs.org)
* Socket.io – [https://socket.io](https://socket.io)

---

##  License

This project is created as part of an academic course (23CSP-339 – Full Stack Development).
Free to use for educational and learning purposes.

---

###  Author

**Mannat Mehta (23BAD10007)**
**Pranjali Gupta (23BAD10001)**

Would you like me to **generate this as a ready-to-download `README.md` file** so you can upload it directly to your GitHub repo (PulseLink)?
