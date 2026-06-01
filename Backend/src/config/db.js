import mongoose from "mongoose";
import config from "./config.js";
import Logger from "../utils/logger.js";

const logger = new Logger('Database');

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            socketTimeoutMS: 60000,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 30000,
            retryWrites: true,
            maxPoolSize: 10,
            minPoolSize: 2,
            maxIdleTimeMS: 30000,
            retryWrites: true,
            w: "majority",
        });
        
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected, attempting to reconnect');
        });

        logger.success('Database Connected Successfully');
    } catch (err) {
        logger.error('Error connecting to DB', err);
        process.exit(1);
    }
};

export default connectDB;