
// Get rating distribution across all reviews
export const getRatingDistribution = async (req, res) => {
    try {
        const ratingDistribution = await req.app.locals.db.collection('review')
            .aggregate([
                {
                    $group: {
                        _id: "$stars",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ], { maxTimeMS: 130000 }).toArray(); // Increase the timeout to 60 seconds

        res.json(ratingDistribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get weekly rating frequency
export const getWeeklyDistribution = async (req, res) => {
    try {
        const weeklyDistribution = await req.app.locals.db.collection('review')
            .aggregate([
                {
                    $addFields: {
                        dateObj: { $toDate: "$date" },
                    }
                },
                {
                    $group: {
                        _id: { $dayOfWeek: "$dateObj" },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                },
                {
                    $project: {
                        _id: 0,
                        day: {
                            $arrayElemAt: [
                                ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                                { $subtract: ["$_id", 1] }
                            ]
                        },
                        count: 1
                    }
                }
            ], { maxTimeMS: 200000 }).toArray();

        res.json(weeklyDistribution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get top businesses with most 5-star ratings
export const getTopFiveStarBusinesses = async (req, res) => {
    try {
        const topBusinesses = await req.app.locals.db.collection('review')
            .aggregate([
                {
                    $match: { stars: 5 }
                },
                {
                    $group: {
                        _id: "$business_id",
                        fiveStarCount: { $sum: 1 }
                    }
                },
                {
                    $sort: { fiveStarCount: -1 }
                },
                {
                    $limit: 10
                },
                {
                    $lookup: {
                        from: 'business',
                        localField: '_id',
                        foreignField: 'business_id',
                        as: 'businessInfo'
                    }
                },
                {
                    $unwind: "$businessInfo"
                },
                {
                    $project: {
                        _id: 0,
                        businessName: "$businessInfo.name",
                        businessId: "$_id",
                        fiveStarCount: 1,
                        totalStars: "$businessInfo.stars",
                        totalReviews: "$businessInfo.review_count"
                    }
                }
            ], { maxTimeMS: 250000 }).toArray();

        res.json(topBusinesses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get comprehensive rating statistics
export const getRatingStats = async (req, res) => {
    try {
        const [ratingDistribution, weeklyDistribution, topBusinesses] = await Promise.all([
            req.app.locals.db.collection('review').aggregate([
                {
                    $group: {
                        _id: "$stars",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]).toArray(),
            
            req.app.locals.db.collection('review').aggregate([
                {
                    $addFields: {
                        dateObj: { $toDate: "$date" }
                    }
                },
                {
                    $group: {
                        _id: { $dayOfWeek: "$dateObj" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]).toArray(),
            
            req.app.locals.db.collection('review').aggregate([
                { $match: { stars: 5 } },
                {
                    $group: {
                        _id: "$business_id",
                        fiveStarCount: { $sum: 1 }
                    }
                },
                { $sort: { fiveStarCount: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: 'business',
                        localField: '_id',
                        foreignField: 'business_id',
                        as: 'businessInfo'
                    }
                },
                { $unwind: "$businessInfo" },
                {
                    $project: {
                        _id: 0,
                        businessName: "$businessInfo.name",
                        businessId: "$_id",
                        fiveStarCount: 1,
                        totalStars: "$businessInfo.stars",
                        totalReviews: "$businessInfo.review_count"
                    }
                }
            ], { maxTimeMS: 5000000 }).toArray()
        ]);

        const response = {
            ratingDistribution,
            weeklyDistribution: weeklyDistribution.map(item => ({
                ...item,
                day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][item._id - 1]
            })),
            topBusinessesWithFiveStars: topBusinesses
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
