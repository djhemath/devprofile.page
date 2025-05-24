import mongoose from "mongoose";

import { Env } from "./env";

export async function connectMongo() {
    return new Promise(async (resolve, reject) => {
        const uri = Env.mongoUri!;

        try {
            await mongoose.connect(uri);
            resolve(true);
            console.log("Connected to MongoDB");
        } catch (err) {
            reject(err);
            console.error("MongoDB connection error:", err);
            process.exit(1);
        }
    
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });
    
        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected");
        });
    });
}
