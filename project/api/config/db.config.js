import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/technologyRadar');
        console.log('MongoDB connected');
    } catch (err) {
        console.error('DB connection error', err);
    }
};