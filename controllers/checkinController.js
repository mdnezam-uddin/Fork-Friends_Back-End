// Get check-ins per year
export const getCheckInsPerYear = async (req, res) => {
    try {
        const checkInsPerYear = await req.app.locals.db.collection('checkin')
            .aggregate([
                {
                    $project: {
                        dates: {
                            $map: {
                                input: { $split: ["$date", ", "] },
                                as: "date",
                                in: {
                                    $year: { $dateFromString: { dateString: "$$date" } }
                                }
                            }
                        }
                    }
                },
                { $unwind: "$dates" },
                {
                    $group: {
                        _id: "$dates",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } },
                {
                    $project: {
                        _id: 0,
                        year: "$_id",
                        count: 1
                    }
                }
            ]).toArray();
        res.json(checkInsPerYear);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get check-ins per hour
export const getCheckInsPerHour = async (req, res) => {
    try {
        const checkInsPerHour = await req.app.locals.db.collection('checkin')
            .aggregate([
                {
                    $project: {
                        hours: {
                            $map: {
                                input: { $split: ["$date", ", "] },
                                as: "date",
                                in: {
                                    $hour: { $dateFromString: { dateString: "$$date" } }
                                }
                            }
                        }
                    }
                },
                { $unwind: "$hours" },
                {
                    $group: {
                        _id: "$hours",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } },
                {
                    $project: {
                        _id: 0,
                        hour: "$_id",
                        count: 1
                    }
                }
            ]).toArray();
        res.json(checkInsPerHour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get most popular cities for check-ins
export const getPopularCheckInCities = async (req, res) => {
    try {
        const popularCities = await req.app.locals.db.collection('checkin')
            .aggregate([
                {
                    $lookup: {
                        from: "business",
                        localField: "business_id",
                        foreignField: "business_id",
                        as: "business_info"
                    }
                },
                { $unwind: "$business_info" },
                {
                    $project: {
                        city: "$business_info.city",
                        state: "$business_info.state",
                        checkInCount: {
                            $size: { $split: ["$date", ", "] }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            city: "$city",
                            state: "$state"
                        },
                        totalCheckIns: { $sum: "$checkInCount" }
                    }
                },
                { $sort: { totalCheckIns: -1 } },
                { $limit: 10 },
                {
                    $project: {
                        _id: 0,
                        city: "$_id.city",
                        state: "$_id.state",
                        totalCheckIns: 1
                    }
                }
            ]).toArray();
        res.json(popularCities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get businesses ranked by check-ins
export const getBusinessesByCheckIns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const businesses = await req.app.locals.db.collection('checkin')
            .aggregate([
                {
                    $project: {
                        business_id: 1,
                        checkInCount: {
                            $size: { $split: ["$date", ", "] }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "business",
                        localField: "business_id",
                        foreignField: "business_id",
                        as: "business_info"
                    }
                },
                { $unwind: "$business_info" },
                {
                    $project: {
                        _id: 0,
                        business_id: 1,
                        name: "$business_info.name",
                        city: "$business_info.city",
                        state: "$business_info.state",
                        stars: "$business_info.stars",
                        checkInCount: 1
                    }
                },
                { $sort: { checkInCount: -1 } },
                { $skip: skip },
                { $limit: limit }
            ]).toArray();

        // Get total count for pagination
        const totalCount = await req.app.locals.db.collection('checkin').countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
            businesses,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalCount,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
