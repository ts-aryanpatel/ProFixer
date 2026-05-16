import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
    throw new Error("PORT is not defined in environment variable");
}

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variable");
}

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
};

export default config;