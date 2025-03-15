// routes/businessRoutes.js
import express from 'express';
import {
    getTopMerchants,
    getTopCities,
    getTopStates,
    getTopRatedCities,
    getCategoryStats,
    getTopRatedMerchants,
    getRestaurantAnalysis
} from '../controllers/businessController.js';

const router = express.Router();

// Analytics routes with simplified paths
router.get('/top-merchants', getTopMerchants);
router.get('/top-cities', getTopCities);
router.get('/top-states', getTopStates);
router.get('/top-rated-cities', getTopRatedCities);
router.get('/category-stats', getCategoryStats);
router.get('/top-rated-merchants', getTopRatedMerchants);
router.get('/restaurant-analysis', getRestaurantAnalysis);

export default router;
