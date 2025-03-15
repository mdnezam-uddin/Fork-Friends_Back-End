import Review from '../models/Review.js';
import { MongoNetworkTimeoutError } from 'mongodb';
import mongoose from 'mongoose';

export const getReviewsCountByYear = async (req, res) => {
    try {
        const db = req.app.locals.db; // Access the database instance from app.locals

        // Aggregate to count reviews by year
        const reviewsByYear = await db.collection('review').aggregate([
            {
                $addFields: {
                    // Convert the 'date' string to a Date object
                    dateAsDate: { $toDate: "$date" }
                }
            },
            {
                $group: {
                    _id: { $year: "$dateAsDate" }, // Extract year from the converted date
                    count: { $sum: 1 } // Count the number of reviews per year
                }
            },
            {
                $sort: { _id: 1 } // Sort by year in ascending order
            }
        ]).toArray();

        console.log("reviewsByYear", reviewsByYear);

        res.status(200).json(reviewsByYear);
    } catch (error) {
        console.error('Error fetching reviews by year:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const countUsefulFunnyCoolReviews = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const sampleSize = 10000;
const sample = await db.collection('review')
    .aggregate([{ $sample: { size: sampleSize } }])
    .toArray();

const result = await db.collection('review').aggregate([
    { $match: { _id: { $in: sample.map(doc => doc._id) } } },
    { $project: { words: { $split: ["$cleanedText", " "] } } },
    { $unwind: "$words" },
    { $match: { words: { $ne: "", $exists: true } } },
    { $group: { _id: { $toLower: "$words" }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 }
]).toArray();

res.status(200).json(result);

    } catch (error) {
        console.error('Error counting useful, funny, and cool reviews:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const rankUsersByReviewsPerYear = async (req, res) => {
    try {
        const db = req.app.locals.db;

        // Ensure indexes exist for faster querying
        await db.collection('review').createIndex({ date: 1 });
        await db.collection('review').createIndex({ userId: 1 });

        const result = await db.collection('review').aggregate([
            {
                $addFields: {
                    year: { $year: { $toDate: "$date" } } // Extract year from the date field
                }
            },
            {
                $group: {
                    _id: { userId: "$userId", year: "$year" }, // Group by user and year
                    totalReviews: { $sum: 1 } // Count reviews per user per year
                }
            },
            {
                $sort: { "_id.year": 1, totalReviews: -1 } // Sort by year and total reviews (descending)
            },
            {
                $group: {
                    _id: "$_id.year", // Group by year
                    users: { $push: { userId: "$_id.userId", totalReviews: "$totalReviews" } } // Collect all users for each year
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id",
                    topUsers: { $slice: ["$users", 10] } // Extract top 10 users for each year
                }
            },
            {
                $sort: { year: 1 } // Sort the final result by year
            }
        ]).toArray();

        res.status(200).json(result);
    } catch (error) {
        console.error('Error ranking users by reviews per year:', error);
        if (error instanceof MongoNetworkTimeoutError) {
            res.status(503).json({ message: 'Database connection timed out. Please try again later.' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};


// export const extractTop20CommonWords = async (req, res) => {
//     try {
//         const db = req.app.locals.db;
//         const batchSize = 10000;
//         const wordCounts = new Map();
        
//         let processed = 0;
//         const cursor = db.collection('review').find(
//             { text: { $exists: true, $ne: "" } },
//             { projection: { text: 1 } }
//         ).batchSize(batchSize);

//         while (await cursor.hasNext()) {
//             const doc = await cursor.next();
//             const words = doc.text.toLowerCase()
//                 .replace(/[^a-z\s]/g, ' ')
//                 .split(/\s+/)
//                 .filter(word => word.length > 2 && word.length < 15);

//             words.forEach(word => {
//                 wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
//             });

//             processed++;
//             if (processed % batchSize === 0) {
//                 console.log(`Processed ${processed} documents`);
//             }
//         }

//         const top20 = Array.from(wordCounts.entries())
//             .sort((a, b) => b[1] - a[1])
//             .slice(0, 20)
//             .map(([word, count]) => ({ _id: word, count }));

//         res.status(200).json(top20);

//     } catch (error) {
//         console.error('Error extracting top 20 common words:', error);
//         res.status(500).json({ 
//             message: 'Internal server error',
//             error: error.message 
//         });
//     }
// };


export const extractTop20CommonWords = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const batchSize = 100000;
        const wordCounts = new Map();
        
        let processed = 0;
        const cursor = db.collection('review').find(
            { text: { $exists: true, $ne: "" } },
            { projection: { text: 1 } }
        ).batchSize(batchSize);

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            const words = doc.text.toLowerCase()
                .replace(/[^a-z\s]/g, ' ')
                .split(/\s+/)
                .filter(word => word.length > 2 && word.length < 15);

            words.forEach(word => {
                wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
            });

            processed++;
            if (processed % batchSize === 0) {
                console.log(`Processed ${processed} documents`);
            }
            if (processed >= 1000000) {
                break;
            }
        }

        const top20 = Array.from(wordCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([word, count]) => ({ _id: word, count }));

        const response = {
            metadata: {
                sampleSize: 1000000,
                processedAt: new Date(),
                executionTimeMs: Date.now() - req.startTime
            },
            results: top20
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error extracting top 20 common words:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message 
        });
    }
};

export const extractTop10PositiveWords = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const batchSize = 10000;
        const wordCounts = new Map();
        
        let processed = 0;
        // Modified the query to only include positive reviews (stars > 3)
        const cursor = db.collection('review').find(
            { text: { $exists: true, $ne: "" }, stars: { $gt: 3 } },
            { projection: { text: 1 } }
        ).batchSize(batchSize);

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            const words = doc.text.toLowerCase()
                .replace(/[^a-z\s]/g, ' ')
                .split(/\s+/)
                .filter(word => word.length > 2 && word.length < 15);

            words.forEach(word => {
                wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
            });

            processed++;
            if (processed % batchSize === 0) {
                console.log(`Processed ${processed} documents`);
            }
            if (processed >= 10000) {
                break;
            }
        }

        const top10 = Array.from(wordCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, count]) => ({ _id: word, count }));

        res.status(200).json(top10);

    } catch (error) {
        console.error('Error extracting top 10 positive words:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const extractTop10NegativeWords = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const batchSize = 10000;
        const wordCounts = new Map();
        
        let processed = 0;
        // Query for negative reviews with stars less than or equal to 3
        const cursor = db.collection('review').find(
            { text: { $exists: true, $ne: "" }, stars: { $lte: 3 } },
            { projection: { text: 1 } }
        ).batchSize(batchSize);

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            const words = doc.text.toLowerCase()
                .replace(/[^a-z\s]/g, ' ')
                .split(/\s+/)
                .filter(word => word.length > 2 && word.length < 15);

            words.forEach(word => {
                wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
            });

            processed++;
            if (processed % batchSize === 0) {
                console.log(`Processed ${processed} documents`);
            }
            if (processed >= 10000) {
                break;
            }
        }

        const top10 = Array.from(wordCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word, count]) => ({ _id: word, count }));

        const response = {
            metadata: {
                description: "Top 10 words from negative reviews (rating ≤ 3)",
                sampleSize: processed,
                processedAt: new Date(),
                executionTimeMs: Date.now() - req.startTime
            },
            results: top10
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error extracting top 10 negative words:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const performWordCloudAnalysis = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const batchSize = 10000;
        const wordCounts = new Map();
        const stopWords = new Set(['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'were', 'are', 'that', 'this', 'these', 'those', 'it', 'they', 'them', 'their', 'from', 'have', 'had', 'has']);
        
        let processed = 0;
        const cursor = db.collection('review').find(
            { text: { $exists: true, $ne: "" } },
            { projection: { text: 1 } }
        ).limit(100000).batchSize(batchSize);

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            // Simple regex to extract primarily nouns and adjectives (simplified POS tagging)
            // We filter out common verbs, articles, and prepositions through stopWords
            const words = doc.text.toLowerCase()
                .replace(/[^a-z\s]/g, ' ')
                .split(/\s+/)
                .filter(word => 
                    word.length > 2 && 
                    word.length < 15 && 
                    !stopWords.has(word) &&
                    !word.endsWith('ing') && // Filter out many present participles
                    !word.endsWith('ed') && // Filter out many past tense verbs
                    !word.endsWith('ly') // Filter out many adverbs
                );

            words.forEach(word => {
                wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
            });

            processed++;
            if (processed % batchSize === 0) {
                console.log(`Processed ${processed} documents`);
            }
            if (processed >= 10000) {
                break;
            }
        }

        const top100Words = Array.from(wordCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 100)
            .map(([word, count]) => ({ text: word, size: count }));

        const response = {
            metadata: {
                description: "Word cloud analysis with simplified part-of-speech filtering",
                sampleSize: processed,
                processedAt: new Date(),
                executionTimeMs: Date.now() - req.startTime
            },
            results: top100Words
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error performing word cloud analysis:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const constructWordAssociationGraph = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const batchSize = 10000;
        const wordAssociations = new Map(); // To store word associations
        
        let processed = 0;
        const cursor = db.collection('review').find(
            { text: { $exists: true, $ne: "" } },
            { projection: { text: 1 } }
        ).batchSize(batchSize);

        while (await cursor.hasNext()) {
            const doc = await cursor.next();
            const words = doc.text.toLowerCase()
                .replace(/[^a-z\s]/g, ' ') // Remove non-alphabetic characters
                .split(/\s+/)
                .filter(word => word.length > 2 && word.length < 15);

            // Process word associations in each document
            for (let i = 0; i < words.length; i++) {
                const currentWord = words[i];

                // Look at words within a window of 3 words
                for (let j = Math.max(0, i - 3); j < Math.min(words.length, i + 4); j++) {
                    if (i !== j) {
                        const associatedWord = words[j];

                        // Ensure the association is meaningful (e.g., "Chinese" -> "steak")
                        if (!wordAssociations.has(currentWord)) {
                            wordAssociations.set(currentWord, new Map());
                        }

                        const wordMap = wordAssociations.get(currentWord);
                        wordMap.set(associatedWord, (wordMap.get(associatedWord) || 0) + 1);
                    }
                }
            }

            processed++;
            if (processed % batchSize === 0) {
                console.log(`Processed ${processed} documents`);
            }
            if (processed >= 10000) {
                break;
            }
        }

        // Convert the nested maps to a more JSON-friendly format
        const result = Array.from(wordAssociations.entries())
            .map(([word, associations]) => ({
                word,
                associations: Array.from(associations.entries())
                    .sort((a, b) => b[1] - a[1]) // Sort by association strength
                    .slice(0, 10) // Keep only top 10 associations per word
                    .map(([associatedWord, count]) => ({ word: associatedWord, count }))
            }))
            .sort((a, b) => b.associations.length - a.associations.length)
            .slice(0, 100); // Return only top 100 words with strongest associations

        const response = {
            metadata: {
                sampleSize: 100000,
                processedAt: new Date(),
                executionTimeMs: Date.now() - req.startTime
            },
            results: result
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error constructing word association graph:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

