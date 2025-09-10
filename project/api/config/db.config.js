import { MongoClient } from 'mongodb';

export const connectDB = async () => {
    const connectionString = `mongodb://localhost:27017`;
    const client = await MongoClient.connect(connectionString);
    const db = client.db('techradar');
    const technologyCollection = db.collection('technologies');

    return { db, technologyCollection };
};