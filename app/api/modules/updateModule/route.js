// import { connectToDatabase } from "@/lib/mongodb";
// import { NextResponse } from "next/server";
// import cloudinary from "cloudinary";
// import { ObjectId } from "mongodb";
// import { currentUser } from "@clerk/nextjs/server";

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function PUT(req) {
//   try {
//     // Get authenticated user
//     const user = await currentUser();
//     if (!user || user.publicMetadata?.role !== "teacher") {
//       return NextResponse.json({ error: "Unauthorized - Teacher role required" }, { status: 401 });
//     }

//     // Parse request data
//     const { _id, name, description, videoUrl, newVideo } = await req.json();

//     if (!_id || !ObjectId.isValid(_id)) {
//       return NextResponse.json({ error: "Invalid Module ID" }, { status: 400 });
//     }

//     const db = await connectToDatabase();
//     const modulesCollection = db.collection("modules");
//     const moduleId = new ObjectId(_id);

//     const existingModule = await modulesCollection.findOne({ _id: moduleId });
//     if (!existingModule) {
//       return NextResponse.json({ error: "Module not found" }, { status: 404 });
//     }

//     let updatedVideoUrl = videoUrl;

//     // If new video is uploaded, replace old one
//     if (newVideo) {
//       const uploadResponse = await cloudinary.v2.uploader.upload(newVideo, {
//         resource_type: "video",
//         folder: "learning-modules",
//       });

//       updatedVideoUrl = uploadResponse.secure_url;

//       // Delete old video if exists
//       if (existingModule.videoUrl) {
//         try {
//           const oldPublicId = existingModule.videoUrl.split("/").pop().split(".")[0];
//           await cloudinary.v2.uploader.destroy(`learning-modules/${oldPublicId}`, { resource_type: "video" });
//         } catch (err) {
//           console.warn("Error deleting old video:", err);
//         }
//       }
//     }

//     // Update module in MongoDB
//     await modulesCollection.updateOne(
//       { _id: moduleId },
//       { $set: { name, description, videoUrl: updatedVideoUrl } }
//     );

//     return NextResponse.json({ message: "Module updated successfully" }, { status: 200 });

//   } catch (error) {
//     console.error("Error updating module:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { ObjectId } from "mongodb";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req) {
  try {
    const { _id, name, description, videoUrl, newVideo } = await req.json();

    if (!_id) {
      return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const modulesCollection = db.collection("modules");

    // Convert _id to ObjectId
    const moduleId = new ObjectId(_id);

    // Find the existing module
    const existingModule = await modulesCollection.findOne({ _id: moduleId });

    if (!existingModule) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    let updatedVideoUrl = videoUrl; // Keep existing video by default

    // If a new video is uploaded, replace the old one
    if (newVideo) {
      // Upload new video to Cloudinary
      const uploadResponse = await cloudinary.v2.uploader.upload(newVideo, {
        resource_type: "video",
        folder: "learning-modules",
      });

      updatedVideoUrl = uploadResponse.secure_url;

      // Delete the old video from Cloudinary if it exists
      if (existingModule.videoUrl) {
        try {
          const oldPublicId = existingModule.videoUrl.split("/").slice(-1)[0].split(".")[0]; // Extract correct public_id
          await cloudinary.v2.uploader.destroy(`learning-modules/${oldPublicId}`, { resource_type: "video" });
        } catch (err) {
          console.warn("Error deleting old video:", err);
        }
      }
    }

    // Update module in MongoDB
    await modulesCollection.updateOne(
      { _id: moduleId },
      { $set: { name, description, videoUrl: updatedVideoUrl } }
    );

    return NextResponse.json({ message: "Module updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating module:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}