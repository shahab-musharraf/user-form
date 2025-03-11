import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let db;

// Create a singleton connection
async function connectDB() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log("Connected to MongoDB");
    }
    return db;
}

export async function GET(req) {
    try {
        console.log(uri, 'fetchUser MONGODB_URI')
        const db = await connectDB();
        const usersCollection = db.collection("users");

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;
        const orderBy = searchParams.get("orderBy") || "createdAt"; // Default: Sort by createdAt
        const skip = (page - 1) * limit;

        console.log(page, limit, orderBy);

        // Define sorting criteria
        const sortOptions = {};
        if (orderBy === "createdAt") {
            sortOptions.createdAt = -1; // Newest first
        } else if (orderBy === "referralCount") {
            sortOptions.referralCount = -1; // Highest referral first
        } else if (orderBy === "notified") {
            sortOptions.notified = -1;
        }

        const users = await usersCollection.find({})
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalUsers = await usersCollection.countDocuments();

        return NextResponse.json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            totalUsers
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
