// routes/businessRoutes.js
import express from 'express';
import {
    // ... existing imports ...
    getCheckInsPerYear,
    getCheckInsPerHour,
    getPopularCheckInCities,
    getBusinessesByCheckIns
} from '../controllers/checkinController.js';

const router = express.Router();

// ... existing routes ...

// Check-in related routes
router.get('/checkins-per-year', getCheckInsPerYear);
router.get('/checkins-per-hour', getCheckInsPerHour);
router.get('/popular-checkin-cities', getPopularCheckInCities);
router.get('/businesses-by-checkins', getBusinessesByCheckIns);

export default router;
