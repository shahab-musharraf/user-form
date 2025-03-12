import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Reuse the MongoDB client across multiple requests
const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri);
let db;

const connectToDatabase = async () => {
  if (db) return db; // Return the existing DB connection if it's already established
  await client.connect();
  db = client.db(process.env.DB_NAME); // Store the database connection to be reused
  return db;
};

export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Parse the request body
    const { name, email, mobile, bank, ifsc, branch, amount, binanceWallet, screenshot, referralCode, uniqueCode, qrCode } = await req.json();

    console.log(db, usersCollection, name)
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email or mobile number already in use" },
        { status: 400 }
      );
    }

    // Ensure required fields are provided
    if (!name || !email || !mobile || !amount || !qrCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Handle referral logic
    const referralUser = await usersCollection.findOne({ uniqueCode: referralCode });
    if (referralUser) {
      await usersCollection.updateOne(
        { uniqueCode: referralCode },
        { $inc: { referralCount: 1 } } // Increment referralCount by 1
      );
    }

    // Prepare the new user object
    const newUser = {
      name,
      email,
      mobile,
      bank,
      ifsc,
      branch,
      amount,
      screenshot,
      referralCode,
      uniqueCode,
      referralCount: 0,
      paymentVerified: false,
      notified: 0,
      binanceWallet,
      qrCode,
      createdAt: new Date(),
    };

    // Insert the new user into the database
    const result = await usersCollection.insertOne(newUser);

    // Return success response
    return NextResponse.json({ message: "User added successfully", userId: result.insertedId, success: true }, { status: 201 });

  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
