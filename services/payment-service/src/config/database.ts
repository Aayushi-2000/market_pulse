import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Payment Service database');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};
