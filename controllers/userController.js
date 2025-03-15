// controllers/userController.js

// Get yearly user statistics
export const getYearlyUserStats = async (req, res) => {
    try {
        const yearlyStats = await req.app.locals.db.collection('user')
            .aggregate([
                {
                    $addFields: {
                        // Convert elite string to array if it's not empty
                        eliteArray: {
                            $cond: {
                                if: { $eq: ["$elite", ""] },
                                then: [],
                                else: {
                                    $cond: {
                                        if: { $eq: [{ $type: "$elite" }, "string"] },
                                        then: [{ $toString: "$elite" }],
                                        else: "$elite"
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: { $year: { $toDate: "$yelping_since" } },
                        totalUsers: { $sum: 1 },
                        totalReviews: { $sum: "$review_count" },
                        eliteUsers: {
                            $sum: {
                                $cond: [
                                    { $ne: ["$elite", ""] }, // Check if elite field is not empty
                                    1,
                                    0
                                ]
                            }
                        },
                        silentUsers: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$review_count", 0] },
                                    1,
                                    0
                                ]
                            }
                        },
                        totalFans: { $sum: "$fans" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        year: "$_id",
                        totalUsers: 1,
                        totalReviews: 1,
                        eliteUsers: 1,
                        regularUsers: { $subtract: ["$totalUsers", "$eliteUsers"] },
                        silentUsers: 1,
                        activeUsers: { $subtract: ["$totalUsers", "$silentUsers"] },
                        totalFans: 1
                    }
                },
                { $sort: { year: 1 } }
            ], { maxTimeMS: 250000 }).toArray();

        res.json(yearlyStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get top reviewers based on review_count
export const getTopReviewers = async (req, res) => {
    try {
        const topReviewers = await req.app.locals.db.collection('user')
            .find({})
            .sort({ review_count: -1 })
            .limit(10)
            .project({ _id: 0, name: 1, review_count: 1 })
            .toArray();

        res.json(topReviewers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get most popular users based on fans
export const getMostPopularUsers = async (req, res) => {
    try {
        const popularUsers = await req.app.locals.db.collection('user')
            .find({})
            .sort({ fans: -1 })
            .limit(10)
            .project({ _id: 0, name: 1, fans: 1 })
            .toArray();

        res.json(popularUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Calculate the ratio of elite users to regular users each year
export const getEliteToRegularRatio = async (req, res) => {
    try {
        const eliteToRegularRatio = await req.app.locals.db.collection('user')
            .aggregate([
                {
                    $group: {
                        _id: { $year: { $toDate: "$yelping_since" } }, // Updated field name
                        eliteUsers: { $sum: { $cond: [{ $gt: [{ $size: { $ifNull: ["$eliteArray", []] } }, 0] }, 1, 0] } },
                        totalUsers: { $sum: 1 },
                    }
                },
                {
                    $project: {
                        _id: 0,
                        year: "$_id",
                        eliteUsers: 1,
                        regularUsers: { $subtract: ["$totalUsers", "$eliteUsers"] },
                        eliteToRegularRatio: {
                            $cond: [
                                { $eq: [{ $subtract: ["$totalUsers", "$eliteUsers"] }, 0] },
                                0,
                                { $divide: ["$eliteUsers", { $subtract: ["$totalUsers", "$eliteUsers"] }] }
                            ]
                        }
                    }
                },
                { $sort: { year: 1 } }
            ], { maxTimeMS: 250000 }).toArray();

        res.json(eliteToRegularRatio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Display the proportion of total users and silent users (users who haven't written reviews) each year
export const getSilentAndActiveUserProportions = async (req, res) => {
    try {
        const proportions = await req.app.locals.db.collection('user')
            .aggregate([
                {
                    $group: {
                        _id: { $year: { $toDate: "$yelping_since" } }, // Updated field name
                        totalUsers: { $sum: 1 },
                        silentUsers: { $sum: { $cond: [{ $eq: ["$review_count", 0] }, 1, 0] } }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        year: "$_id",
                        totalUsers: 1,
                        silentUsers: 1,
                        activeUsers: { $subtract: ["$totalUsers", "$silentUsers"] },
                        silentUserProportion: { $divide: ["$silentUsers", "$totalUsers"] },
                        activeUserProportion: { $divide: [{ $subtract: ["$totalUsers", "$silentUsers"] }, "$totalUsers"] }
                    }
                },
                { $sort: { year: 1 } }
            ], { maxTimeMS: 250000 }).toArray();

        res.json(proportions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
