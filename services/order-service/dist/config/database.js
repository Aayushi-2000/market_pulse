import mongoose from "mongoose";
import { env } from "./env.js";
export const connectDatabase = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("Auth Service MongoDB connected");
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};
