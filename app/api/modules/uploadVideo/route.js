import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Convert file buffer to stream
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { resource_type: "video", folder: "learning-modules" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);
    readableStream.pipe(stream);
  });
};

// ✅ Fix: Export POST method properly
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded!" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadedFile = await streamUpload(fileBuffer);

    return NextResponse.json({ videoUrl: uploadedFile.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Upload failed!" }, { status: 500 });
  }
}
