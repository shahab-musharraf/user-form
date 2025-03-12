import { NextResponse } from 'next/server';
import { v2 as cloudinaryV2 } from 'cloudinary';
import { Readable } from 'stream';  // Import Readable from 'stream'

// Configure Cloudinary (replace these values with your own)
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file'); // `file` is the name attribute of the uploaded file in the form

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check if the uploaded file is an image based on the MIME type
    const mimeType = file.type;
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json({ error: 'Uploaded file is not an image' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a readable stream from the buffer
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);  // End the stream

    // Upload image to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinaryV2.uploader.upload_stream(
        { resource_type: 'image' }, // Specify resource type as image
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Pipe the readable stream to Cloudinary's upload_stream method
      readableStream.pipe(uploadStream);
    });

    const imageUrl = uploadResult.secure_url;  // The secure URL of the uploaded image

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
