// controllers/comprehensiveController.js

// Get top 5 merchants in each city based on multiple metrics
export const getCityTopMerchants = async (req, res) => {
    try {
        const cityTopMerchants = await req.app.locals.db.collection('business')
            .aggregate([
                // First group by city and business to get business metrics
                {
                    $lookup: {
                        from: 'reviews',
                        localField: 'business_id',
                        foreignField: 'business_id',
                        as: 'reviews'
                    }
                },
                {
                    $project: {
                        name: 1,
                        city: 1,
                        state: 1,
                        stars: 1,
                        review_count: 1,
                        business_id: 1,
                        reviewMetrics: {
                            averageRating: { $avg: "$reviews.stars" },
                            reviewCount: { $size: "$reviews" }
                        }
                    }
                },
                // Group by city to get top merchants in each city
                {
                    $group: {
                        _id: { city: "$city", state: "$state" },
                        merchants: {
                            $push: {
                                business_id: "$business_id",
                                name: "$name",
                                overallRating: "$stars",
                                reviewCount: "$review_count",
                                reviewMetrics: "$reviewMetrics",
                                // Calculate a composite score for ranking
                                score: {
                                    $add: [
                                        "$stars",
                                        { $multiply: [{ $log10: { $add: ["$review_count", 1] } }, 2] }
                                    ]
                                }
                            }
                        }
                    }
                },
                // Sort merchants within each city group
                {
                    $project: {
                        _id: 0,
                        city: "$_id.city",
                        state: "$_id.state",
                        topMerchants: {
                            $slice: [
                                {
                                    $sortArray: {
                                        input: "$merchants",
                                        sortBy: { score: -1 }
                                    }
                                },
                                5
                            ]
                        }
                    }
                },
                // Final formatting
                {
                    $project: {
                        city: 1,
                        state: 1,
                        topMerchants: {
                            $map: {
                                input: "$topMerchants",
                                as: "merchant",
                                in: {
                                    name: "$$merchant.name",
                                    business_id: "$$merchant.business_id",
                                    overallRating: "$$merchant.overallRating",
                                    totalReviews: "$$merchant.reviewCount",
                                    averageReviewRating: {
                                        $round: ["$$merchant.reviewMetrics.averageRating", 1]
                                    }
                                }
                            }
                        }
                    }
                },
                // Sort by city name
                {
                    $sort: {
                        "city": 1
                    }
                }
            ], { maxTimeMS: 5000000 }).toArray();

        res.json(cityTopMerchants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
