import { NextResponse } from 'next/server';
import { v2 as cloudinaryV2 } from 'cloudinary';

// Configure Cloudinary (replace with your own credentials)
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file'); // `file` is the name attribute of the uploaded file in the form

    console.log(file, 'file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check if the file is an image
    const mimeType = file.type;
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json({ error: 'Uploaded file is not an image' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload the image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinaryV2.uploader.upload_stream(
        { resource_type: 'image' },  // Specify resource type as image
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);  // Pass the buffer directly to the upload stream
    });

    const imageUrl = uploadResult.secure_url;  // Get the URL of the uploaded image

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
