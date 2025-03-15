import express from 'express';
import {
    getRatingDistribution,
    getWeeklyDistribution,
    getTopFiveStarBusinesses,
    getRatingStats
} from '../controllers/ratingController.js';

const router = express.Router();

router.get('/distribution', getRatingDistribution);
router.get('/weekly', getWeeklyDistribution);
router.get('/top-five-star', getTopFiveStarBusinesses);
router.get('/stats', getRatingStats);

export default router;
