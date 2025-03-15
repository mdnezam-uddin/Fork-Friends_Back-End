import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    business_id: String,
    name: String,
    address: String,
    city: String,
    state: String,
    postal_code: String,
    latitude: Number,
    longitude: Number,
    stars: Number,
    review_count: Number,
    is_open: Number,
    attributes: Object,
    categories: String,
    hours: mongoose.Schema.Types.Mixed
}, { 
    collection: 'businesses',  // Explicitly set collection name
    strict: false  // Allow flexible schema
});

const Business = mongoose.model('Business', businessSchema);

export default Business;
