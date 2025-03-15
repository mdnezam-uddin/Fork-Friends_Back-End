// models/Checkin.js
import mongoose from 'mongoose';

const checkinSchema = new mongoose.Schema({
    business_id: String,
    date: String  // Stores comma-separated dates
});

export default mongoose.model('Checkin', checkinSchema);
