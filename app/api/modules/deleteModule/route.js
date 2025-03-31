// import { connectToDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { NextResponse } from "next/server";
// import cloudinary from "cloudinary";
// import { currentUser } from "@clerk/nextjs/server";

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function DELETE(req) {
//   try {
//     // Get authenticated user
//     const user = await currentUser();
//     if (!user || user.publicMetadata?.role !== "teacher") {
//       return NextResponse.json({ error: "Unauthorized - Teacher role required" }, { status: 401 });
//     }

//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id || !ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid or missing Module ID" }, { status: 400 });
//     }

//     const db = await connectToDatabase();
//     const moduleCollection = db.collection("modules");

//     const module = await moduleCollection.findOne({ _id: new ObjectId(id) });
//     if (!module) {
//       return NextResponse.json({ error: "Module not found" }, { status: 404 });
//     }

//     const videoUrl = module.videoUrl;

//     if (videoUrl) {
//       try {
//         const publicId = videoUrl.split("/").pop().split(".")[0];
//         await cloudinary.v2.uploader.destroy(`learning-modules/${publicId}`, { resource_type: "video" });
//       } catch (err) {
//         console.warn("Cloudinary deletion failed:", err);
//       }
//     }

//     await moduleCollection.deleteOne({ _id: new ObjectId(id) });

//     return NextResponse.json({ message: "Module deleted successfully!" }, { status: 200 });

//   } catch (error) {
//     console.error("Error deleting module:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const moduleCollection = db.collection("modules");

    // Fetch module to get the video URL
    const module = await moduleCollection.findOne({ _id: new ObjectId(id) });
    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const videoUrl = module.videoUrl;

    // Extract the public ID from Cloudinary URL
    const parts = videoUrl.split("/");
    const publicIdWithExtension = parts[parts.length - 1]; // e.g., "abcd1234.mp4"
    const publicId = `learning-modules/${publicIdWithExtension.split(".")[0]}`; // Include folder path

    // Delete video from Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });

    if (cloudinaryResponse.result !== "ok") {
      return NextResponse.json({ error: "Failed to delete video from Cloudinary" }, { status: 500 });
    }

    // Delete module from MongoDB
    await moduleCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Module and video deleted successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting module:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}