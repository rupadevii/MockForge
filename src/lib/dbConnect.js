import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    throw new Error("Please add MONGO_URI to your .env.local file");
}

let cache = global.mongooseCache;

if (!cache) {
    cache = global.mongooseCache = { conn: null, promise: null };
}

export default async function dbConnect() {
    if (cache.conn) {
        return cache.conn;
    }

    if (!cache.promise) {
        cache.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    }

    cache.conn = await cache.promise;
    return cache.conn;
}