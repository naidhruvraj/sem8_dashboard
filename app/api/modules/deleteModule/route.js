import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Backend-specific variable
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

    // Connect to MongoDB
    const { db } = await connectToDatabase(); // Ensure correct destructuring
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const moduleCollection = db.collection("modules");

    // Fetch module to get the video URL
    const module = await moduleCollection.findOne({ _id: new ObjectId(id) });
    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const videoUrl = module.videoUrl;

    // Extract the public ID from Cloudinary URL
    const parts = videoUrl.split("/");
    const publicIdWithExtension = parts[parts.length - 1]; // Example: "abcd1234.mp4"
    const publicId = `learning-modules/${publicIdWithExtension.split(".")[0]}`; // Include folder path

    // Delete video from Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });

    if (!["ok", "not found"].includes(cloudinaryResponse.result)) {
      console.error("Cloudinary Deletion Error:", cloudinaryResponse);
      return NextResponse.json({ error: "Failed to delete video from Cloudinary" }, { status: 500 });
    }

    // Delete module from MongoDB
    await moduleCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Module and video deleted successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting module:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}


// import { connectToDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";
// import { NextResponse } from "next/server";
// import cloudinary from "cloudinary";

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function DELETE(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
//     }

//     // ✅ Connect to MongoDB
//     const { db } = await connectToDatabase();
//     if (!db) {
//       return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
//     }

//     const modulesCollection = db.collection("modules");

//     // ✅ Find the module to get the video URL
//     const module = await modulesCollection.findOne({ _id: new ObjectId(id) });
//     if (!module) {
//       return NextResponse.json({ error: "Module not found" }, { status: 404 });
//     }

//     const videoUrl = module.videoUrl;
//     let cloudinaryDeleted = false;

//     if (videoUrl && videoUrl.startsWith("https://res.cloudinary.com/")) {
//       // ✅ Extract the public ID from Cloudinary URL
//       const urlParts = videoUrl.split("/");
//       const publicIdWithExtension = urlParts[urlParts.length - 1]; // Example: "abcd1234.mp4"
//       const publicId = `learning-modules/${publicIdWithExtension.split(".")[0]}`; // Include folder path

//       // ✅ Attempt to delete the video from Cloudinary
//       try {
//         const cloudinaryResponse = await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });

//         if (["ok", "not found"].includes(cloudinaryResponse.result)) {
//           cloudinaryDeleted = true;
//         } else {
//           console.warn("⚠️ Cloudinary Deletion Warning:", cloudinaryResponse);
//         }
//       } catch (cloudError) {
//         console.error("❌ Cloudinary API Error:", cloudError);
//       }
//     }

//     // ✅ Delete module from MongoDB
//     await modulesCollection.deleteOne({ _id: new ObjectId(id) });

//     return NextResponse.json(
//       { 
//         message: "Module deleted successfully", 
//         cloudinaryStatus: cloudinaryDeleted ? "Video deleted from Cloudinary" : "No video or deletion failed" 
//       }, 
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("❌ Error deleting module:", error);
//     return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
//   }
// }
