import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file'); // `file` is the name attribute of the uploaded file in the form

    console.log(file, 'file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', file.name);

    // Ensure the 'uploads' folder exists
    if (!fs.existsSync(path.join(process.cwd(), 'public', 'uploads'))) {
      fs.mkdirSync(path.join(process.cwd(), 'public', 'uploads'), { recursive: true });
    }

    fs.writeFileSync(uploadPath, buffer);

    const fileUrl = `/uploads/${file.name}`;

    return NextResponse.json({ success: true, imageUrl: fileUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
