// models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    review_id: String,
    user_id: String,
    business_id: String,
    stars: Number,
    date: Date,
    text: {
        type: String,
        required: true
    },
    useful: Number,
    funny: Number,
    cool: Number
});

export default mongoose.model('Review', reviewSchema);