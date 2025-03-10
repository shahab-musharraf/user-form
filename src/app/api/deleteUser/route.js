import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function DELETE(req) {
    try {
        const { mobile } = await req.json();

        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({ mobile });

        console.log(result)

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User Deleted Successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await client.close();
    }
}
