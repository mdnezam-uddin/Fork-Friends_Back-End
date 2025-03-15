import express from 'express';
import {
    getYearlyUserStats,
    getTopReviewers,
    getMostPopularUsers,
    getEliteToRegularRatio,
    getSilentAndActiveUserProportions,
} from '../controllers/userController.js';

const router = express.Router();


router.get('/yearly-joins', getYearlyUserStats);
router.get('/top-reviewers', getTopReviewers);
router.get('/most-popular', getMostPopularUsers);
router.get('/elite-to-regular-ratio', getEliteToRegularRatio);
router.get('/silent-active-proportions', getSilentAndActiveUserProportions);

export default router;
