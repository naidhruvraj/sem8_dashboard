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
    // ✅ Parse JSON request body
    const { _id, name, description, videoUrl } = await req.json();

    if (!_id || !name || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Connect to MongoDB
    const { db } = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const modulesCollection = db.collection("modules");
    const moduleId = new ObjectId(_id);

    // ✅ Find the existing module
    const existingModule = await modulesCollection.findOne({ _id: moduleId });

    if (!existingModule) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    let updatedVideoUrl = existingModule.videoUrl;

    // ✅ If there's a new video, upload it to Cloudinary
    if (videoUrl) {
      try {
        // Upload new video from direct URL
        const uploadResponse = await cloudinary.v2.uploader.upload(videoUrl, {
          resource_type: "video",
          folder: "learning-modules",
        });

        updatedVideoUrl = uploadResponse.secure_url;

        // ✅ Delete the old video (if exists)
        if (existingModule.videoUrl) {
          const oldVideoUrl = existingModule.videoUrl;
          const publicId = `learning-modules/${oldVideoUrl.split("/").pop().split(".")[0]}`;

          const cloudinaryResponse = await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });

          if (!["ok", "not found"].includes(cloudinaryResponse.result)) {
            console.error("Cloudinary Deletion Error:", cloudinaryResponse);
            return NextResponse.json({ error: "Failed to delete old video from Cloudinary" }, { status: 500 });
          }
        }
      } catch (error) {
        console.warn("⚠️ Error uploading video:", error);
        return NextResponse.json({ error: "Failed to upload video to Cloudinary" }, { status: 500 });
      }
    }

    // ✅ Update module data in MongoDB
    await modulesCollection.updateOne(
      { _id: moduleId },
      { $set: { name, description, videoUrl: updatedVideoUrl, updatedAt: new Date() } }
    );

    console.log("✅ Module updated successfully:", _id);
    
    return NextResponse.json(
      { message: "Module updated successfully", updatedModule: { _id, name, description, videoUrl: updatedVideoUrl } },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error updating module:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}


// import { connectToDatabase } from "@/lib/mongodb";
// import { NextResponse } from "next/server";
// import cloudinary from "cloudinary";
// import { ObjectId } from "mongodb";

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function PUT(req) {
//   try {
//     const { _id, name, description, newVideo } = await req.json();

//     if (!_id || !name || !description) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // ✅ Connect to the database
//     const { db } = await connectToDatabase();
//     if (!db) {
//       return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
//     }

//     const modulesCollection = db.collection("modules");

//     // ✅ Find existing module
//     const moduleId = new ObjectId(_id);
//     const existingModule = await modulesCollection.findOne({ _id: moduleId });

//     if (!existingModule) {
//       return NextResponse.json({ error: "Module not found" }, { status: 404 });
//     }

//     let updatedVideoUrl = existingModule.videoUrl;

//     // ✅ Handle new video upload
//     if (newVideo) {
//       try {
//         // ✅ Upload new video to Cloudinary
//         const uploadResponse = await cloudinary.v2.uploader.upload(newVideo, {
//           resource_type: "video",
//           folder: "learning-modules",
//         });

//         updatedVideoUrl = uploadResponse.secure_url;

//         // ✅ Delete old video only if it exists
//         if (existingModule.videoUrl) {
//           const videoUrl = existingModule.videoUrl;
//           const parts = videoUrl.split("/");
//           const publicIdWithExtension = parts[parts.length - 1]; // Example: "abcd1234.mp4"
//           const publicId = `learning-modules/${publicIdWithExtension.split(".")[0]}`;

//           const cloudinaryResponse = await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });

//           if (!["ok", "not found"].includes(cloudinaryResponse.result)) {
//             console.error("Cloudinary Deletion Error:", cloudinaryResponse);
//             return NextResponse.json({ error: "Failed to delete old video from Cloudinary" }, { status: 500 });
//           }
//         }
//       } catch (error) {
//         console.warn("⚠️ Error handling Cloudinary upload/deletion:", error);
//       }
//     }

//     // ✅ Update module with the new video URL
//     await modulesCollection.updateOne(
//       { _id: moduleId },
//       { $set: { name, description, videoUrl: updatedVideoUrl, updatedAt: new Date() } }
//     );

//     console.log("✅ Module updated successfully:", _id);
    
//     return NextResponse.json(
//       { message: "Module updated successfully", updatedModule: { _id, name, description, videoUrl: updatedVideoUrl } },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("❌ Error updating module:", error);
//     return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
//   }
// }
