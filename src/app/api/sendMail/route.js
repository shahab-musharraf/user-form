import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


export async function POST(req) {
  try {
    
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const usersCollection = db.collection("users");
    
    const { email, name } = await req.json(); // Get user email & name from request body

    await usersCollection?.updateOne(
      {email},
      {$inc: {notified: 1}}
    )

    

    if (!email || !name) {
      return new Response(JSON.stringify({ message: "Email and Name are required" }), {
        status: 400,
      });
    }

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password (or app password)
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform",
      html: `<p>Hello <strong>${name}</strong>,</p>
             <p>Thank you for joining us! We're excited to have you on board.</p>
             <p>Best Regards,</p>
             <p>Your Company Name</p>`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return new Response(JSON.stringify({ message: "Email sent successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ message: "Failed to send email" }), { status: 500 });
  }
}
