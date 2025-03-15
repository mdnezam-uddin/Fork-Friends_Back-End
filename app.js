
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import NodeCache from 'node-cache';

import businessRoutes from './routes/businessRoutes.js';
import checkinRoutes from './routes/checkinRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import comprehensiveRoutes from './routes/comprehensiveRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware for tracking request time
app.use((req, res, next) => {
    req.startTime = Date.now();
    next();
});

// Basic test route
app.get("/", (_, res) => {
    res.send("Yelp API is running!");
});

// Routes
app.use('/api/business', businessRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/user', userRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/comprehensive', comprehensiveRoutes);



const port = process.env.PORT || 5001;

// Initialize database connection before starting the server
const initializeServer = async () => {
    try {
        const db = await connectDB();
        app.locals.db = db; // Store db instance in app.locals

        app.listen(port, () => {
            console.log(`Yelp API server listening on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
};

initializeServer();
