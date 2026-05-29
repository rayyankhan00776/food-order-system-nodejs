import mongoose from 'mongoose';
import config from './config.js';
const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('Client side MongoDB connected successfully 🟢');
    } catch (error) {
        console.error('Client side MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;