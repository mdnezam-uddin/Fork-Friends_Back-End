import express from 'express';
import {
    getCityTopMerchants
} from '../controllers/comprehensiveController.js';

const router = express.Router();

router.get('/city-top-merchants',getCityTopMerchants);

export default router;