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
// import { spawn } from "child_process";
// import fs from "fs";
// import path from "path";
// import { loadModel } from "@/lib/whisper";

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function PUT(req) {
//   try {
//     // ✅ Parse JSON request body
//     const { _id, name, description, videoUrl } = await req.json();

//     if (!_id || !name || !description) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // ✅ Connect to MongoDB
//     const { db } = await connectToDatabase();
//     if (!db) {
//       return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
//     }

//     const modulesCollection = db.collection("modules");
//     const moduleId = new ObjectId(_id);

//     // ✅ Find the existing module
//     const existingModule = await modulesCollection.findOne({ _id: moduleId });

//     if (!existingModule) {
//       return NextResponse.json({ error: "Module not found" }, { status: 404 });
//     }

//     let updatedVideoUrl = existingModule.videoUrl;
//     let transcript = existingModule.transcript;

//     // ✅ If there's a new video, upload it to Cloudinary
//     if (videoUrl && videoUrl !== existingModule.videoUrl) {
//       try {
//         // Upload new video from direct URL
//         const uploadResponse = await cloudinary.v2.uploader.upload(videoUrl, {
//           resource_type: "video",
//           folder: "learning-modules",
//         });

//         updatedVideoUrl = uploadResponse.secure_url;

//         // ✅ Delete the old video (if exists)
//         if (existingModule.videoUrl) {
//           const oldVideoUrl = existingModule.videoUrl;
//           const publicId = `learning-modules/${oldVideoUrl.split("/").pop().split(".")[0]}`;

//           const cloudinaryResponse = await cloudinary.v2.uploader.destroy(publicId, { resource_type: "video" });

//           if (!["ok", "not found"].includes(cloudinaryResponse.result)) {
//             console.error("Cloudinary Deletion Error:", cloudinaryResponse);
//             return NextResponse.json({ error: "Failed to delete old video from Cloudinary" }, { status: 500 });
//           }
//         }

//         // ✅ Extract and transcribe the new video
//         const audioPath = `/tmp/audio_${Date.now()}.wav`;
//         await extractAudio(updatedVideoUrl, audioPath);
//         transcript = await transcribeAudio(audioPath);
//       } catch (error) {
//         console.warn("⚠️ Error processing video:", error);
//         return NextResponse.json({ error: "Failed to upload or process video" }, { status: 500 });
//       }
//     }

//     // ✅ Update module data in MongoDB
//     await modulesCollection.updateOne(
//       { _id: moduleId },
//       { $set: { name, description, videoUrl: updatedVideoUrl, transcript, updatedAt: new Date() } }
//     );

//     console.log("✅ Module updated successfully:", _id);

//     return NextResponse.json(
//       { message: "Module updated successfully", updatedModule: { _id, name, description, videoUrl: updatedVideoUrl, transcript } },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("❌ Error updating module:", error);
//     return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
//   }
// }

// // **Function to extract audio from video**
// async function extractAudio(videoUrl, audioPath) {
//   return new Promise((resolve, reject) => {
//     const ffmpeg = spawn("ffmpeg", ["-i", videoUrl, "-ab", "160k", "-ar", "44100", "-vn", audioPath]);

//     ffmpeg.on("close", (code) => {
//       if (code === 0) resolve();
//       else reject(new Error("FFmpeg audio extraction failed"));
//     });

//     ffmpeg.on("error", (err) => reject(err));
//   });
// }

// // **Function to transcribe audio using Whisper**
// async function transcribeAudio(audioPath) {
//   try {
//     const model = await loadModel("base");
//     const result = await model.transcribe(audioPath);
//     return result.text;
//   } catch (error) {
//     console.error("Whisper transcription error:", error);
//     return "Transcription failed";
//   }
// }
