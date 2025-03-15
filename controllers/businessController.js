// controllers/businessController.js

// Get top 20 most common merchants
export const getTopMerchants = async (req, res) => {
    try {
        const merchants = await req.app.locals.db.collection('business')
            .aggregate([
                {
                    $group: {
                        _id: "$name",
                        count: { $sum: 1 },
                        averageRating: { $avg: "$stars" },
                        totalReviews: { $sum: "$review_count" }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 20 },
                {
                    $project: {
                        _id: 0,
                        name: "$_id",
                        count: 1,
                        averageRating: { $round: ["$averageRating", 1] },
                        totalReviews: 1
                    }
                }
            ]).toArray();
        res.json(merchants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get top 10 cities with most merchants
export const getTopCities = async (req, res) => {
    try {
        const cities = await req.app.locals.db.collection('business')
            .aggregate([
                {
                    $group: {
                        _id: { city: "$city", state: "$state" },
                        count: { $sum: 1 },
                        averageRating: { $avg: "$stars" }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 },
                {
                    $project: {
                        _id: 0,
                        city: "$_id.city",
                        state: "$_id.state",
                        count: 1,
                        averageRating: { $round: ["$averageRating", 1] }
                    }
                }
            ]).toArray();
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get top 5 states with most merchants
export const getTopStates = async (req, res) => {
    try {
        const states = await req.app.locals.db.collection('business')
            .aggregate([
                {
                    $group: {
                        _id: "$state",
                        count: { $sum: 1 },
                        averageRating: { $avg: "$stars" }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 5 },
                {
                    $project: {
                        _id: 0,
                        state: "$_id",
                        count: 1,
                        averageRating: { $round: ["$averageRating", 1] }
                    }
                }
            ]).toArray();
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get top 10 cities with highest ratings
export const getTopRatedCities = async (req, res) => {
    try {
        const cities = await req.app.locals.db.collection('business')
            .aggregate([
                {
                    $group: {
                        _id: { city: "$city", state: "$state" },
                        averageRating: { $avg: "$stars" },
                        count: { $sum: 1 }
                    }
                },
                { 
                    $match: { 
                        count: { $gt: 10 }
                    }
                },
                { $sort: { averageRating: -1 } },
                { $limit: 10 },
                {
                    $project: {
                        _id: 0,
                        city: "$_id.city",
                        state: "$_id.state",
                        averageRating: { $round: ["$averageRating", 1] },
                        businessCount: "$count"
                    }
                }
            ]).toArray();
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get category statistics
export const getCategoryStats = async (req, res) => {
    try {
        const categoryStats = await req.app.locals.db.collection('business')
            .aggregate([
                // Split the comma-separated categories into an array
                {
                    $project: {
                        categoriesArray: { 
                            $split: ["$categories", ", "] 
                        }
                    }
                },
                // Unwind to get one document per category
                { $unwind: "$categoriesArray" },
                // Group by category to get unique categories
                {
                    $group: {
                        _id: "$categoriesArray"
                    }
                },
                // Count the number of unique categories
                {
                    $count: "totalUniqueCategories"
                }
            ]).toArray();
        
        // Return the count or 0 if no categories found
        const totalCategories = categoryStats.length > 0 ? categoryStats[0].totalUniqueCategories : 0;
        res.json({ totalUniqueCategories: totalCategories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get top rated merchants
export const getTopRatedMerchants = async (req, res) => {
    try {
        const merchants = await req.app.locals.db.collection('business')
            .find({ stars: 5 })
            .sort({ review_count: -1 })
            .limit(20)
            .toArray();
        res.json(merchants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get restaurant type analysis
export const getRestaurantAnalysis = async (req, res) => {
    try {
        const restaurantTypes = ['Chinese', 'American', 'Mexican'];
        const analysis = await req.app.locals.db.collection('business')
            .aggregate([
                {
                    $match: {
                        categories: {
                            $regex: restaurantTypes.join('|'),
                            $options: 'i'
                        }
                    }
                },
                {
                    $addFields: {
                        categoriesArray: { $split: ["$categories", ", "] }
                    }
                },
                {
                    $group: {
                        _id: {
                            $filter: {
                                input: "$categoriesArray",
                                as: "category",
                                cond: {
                                    $regexMatch: {
                                        input: "$$category",
                                        regex: restaurantTypes.join('|'),
                                        options: "i"
                                    }
                                }
                            }
                        },
                        count: { $sum: 1 },
                        averageRating: { $avg: "$stars" },
                        totalReviews: { $sum: "$review_count" },
                        ratingDistribution: {
                            $push: "$stars"
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        type: { $arrayElemAt: ["$_id", 0] },
                        count: 1,
                        averageRating: { $round: ["$averageRating", 1] },
                        totalReviews: 1,
                        ratingDistribution: 1
                    }
                }
            ]).toArray();
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
