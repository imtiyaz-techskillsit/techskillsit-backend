const express = require('express');
const app = express();
const courseRoutes = require('./routes/course'); // Import the course routes
const videoRoutes = require('./routes/video'); // Import the course routes
const axios = require("axios");
const userRoutes = require('./routes/user'); 
 
app.use(express.json()); // Parse JSON body

const bodyParser = require('body-parser');
const { dbConnect } = require('./config/db');
dbConnect();

app.use(bodyParser.json()); // Middleware to parse JSON requests
const cors = require("cors");

app.use(cors());
app.options("*", cors()); // Handle preflight requests


app.get('/', (req, res) => {
    res.send('Hello, World!');
}); 

const API_SECRET_KEY = "DJqUdCcTvILjOPhYSDHHE8WrY71IHSTzKpah8RK2q6qWGnSMXgLrN7Gm9BJ4yDRP";
 
app.post("/api/video/vdocipher/otp", async (req, res, next) => {
    const { code } = req.body;
    console.log("Incoming request with code:", code);
  
    if (!code) {
      console.error("Error: Missing video code");
      return res.status(400).json({ error: "Video code is required" });
    }
  
    try {
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${code}/otp`,
        { ttl: 300 },
        {
          headers: {
            Authorization: `Apisecret ${API_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("OTP Response:", response.data);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching OTP:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to fetch OTP from VdoCipher" });
    }
  });

  
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(500).send({ error: "Something went wrong!" });
  });
  
// Use the course routes
app.use('/api/courses', courseRoutes);
app.use('/api/user', userRoutes);
//app.use('/api/video', videoRoutes);

const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
