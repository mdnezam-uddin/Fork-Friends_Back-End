import express from "express";
import { getReviewsCountByYear,
    countUsefulFunnyCoolReviews,
    rankUsersByReviewsPerYear,
    extractTop20CommonWords,
    extractTop10PositiveWords,
    extractTop10NegativeWords,
    performWordCloudAnalysis,
    constructWordAssociationGraph } from "../controllers/reviewController.js";
import rateLimit from 'express-rate-limit';

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

// Route to count reviews by year
router.get("/count-by-year", getReviewsCountByYear);
router.get("/count-useful-funny-cool", countUsefulFunnyCoolReviews);
router.get("/rank-users-by-reviews", rankUsersByReviewsPerYear);
router.get("/top-20-common-words",limiter, extractTop20CommonWords);
router.get("/top-10-positive-words", extractTop10PositiveWords);
router.get("/top-10-negative-words", extractTop10NegativeWords);
router.get("/word-cloud-analysis", performWordCloudAnalysis);
router.get("/word-association-graph", constructWordAssociationGraph);

export default router;
