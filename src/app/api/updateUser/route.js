import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function PUT(req) {
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const usersCollection = db.collection("users");
        const { mobile, verify } = await req.json();


        const result = await usersCollection.updateOne(
            { mobile },
            { $set: { paymentVerified: verify } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User payment status updated" }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await client.close();
    }
}
