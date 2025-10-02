import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
    if (!MONGO_URI) {
        console.error('Umgebungsvariable MONGO_URI fehlt = Datenbankverbindung nicht möglich.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('DB connection error', err);
        throw err;
    }
};