import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('Database Connected');
    } catch (err) {
        console.error('Error to connect DB: ', err);
    }
};

export default connectDB;