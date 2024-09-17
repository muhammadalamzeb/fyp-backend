import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Configure CORS to allow requests from your frontend domain
const corsOptions = {
    origin: ['https://front-end-i-clinic.vercel.app', 'http://localhost:3000'], // Add your frontend URLs here
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Allow cookies and other credentials
    optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log("Received a Request: ", req.method, req.path);
    next();
});

// Simple route for testing
app.get('/', (req, res) => {
    res.send("API is working.");
});

// Database connection
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB database is connected");
    } catch (error) {
        console.error("MongoDB database connection failed", error);
        process.exit(1); // Exit the process if the database connection fails
    }
};

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRoute);

// Start the server and connect to the database
app.listen(port, () => {
    connectDB();
    console.log("Server is running on port:", port);
});

// Global error handler for server errors
app.on('error', (error) => {
    console.error('Server error:', error);
});
