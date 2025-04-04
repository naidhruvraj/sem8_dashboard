import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name, description, videoUrl } = await req.json();

        if (!name || !description || !videoUrl) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        if (!videoUrl.startsWith("https://res.cloudinary.com/")) {
            return NextResponse.json({ error: "Invalid video URL format" }, { status: 400 });
        }

        // ✅ Destructure correctly
        const { db } = await connectToDatabase(); 
        const modulesCollection = db.collection("modules");

        const existingModule = await modulesCollection.findOne({ name });
        if (existingModule) {
            return NextResponse.json({ error: "A module with this name already exists" }, { status: 409 });
        }

        const newModule = { name, description, videoUrl, createdAt: new Date() };

        await modulesCollection.insertOne(newModule);

        return NextResponse.json(
            { message: "Module created successfully", module: newModule },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating module:", error);
        return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
}

// import { connectToDatabase } from "@/lib/mongodb";
// import { NextResponse } from "next/server";
// import { spawn } from "child_process";
// import fs from "fs";
// import path from "path";
// import { loadModel } from "@/lib/whisper"; // Ensure whisper is properly set up

// export async function POST(req) {
//     try {
//         const { name, description, videoUrl } = await req.json();

//         if (!name || !description || !videoUrl) {
//             return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//         }

//         if (!videoUrl.startsWith("https://res.cloudinary.com/")) {
//             return NextResponse.json({ error: "Invalid video URL format" }, { status: 400 });
//         }

//         const { db } = await connectToDatabase();
//         const modulesCollection = db.collection("modules");

//         const existingModule = await modulesCollection.findOne({ name });
//         if (existingModule) {
//             return NextResponse.json({ error: "A module with this name already exists" }, { status: 409 });
//         }

//         // **Step 1: Extract audio from video**
//         const audioPath = `/tmp/audio_${Date.now()}.wav`;
//         await extractAudio(videoUrl, audioPath);

//         // **Step 2: Transcribe audio using Whisper**
//         const transcript = await transcribeAudio(audioPath);

//         // **Step 3: Save module with transcription**
//         const newModule = { name, description, videoUrl, transcript, createdAt: new Date() };
//         await modulesCollection.insertOne(newModule);

//         return NextResponse.json(
//             { message: "Module created successfully", module: newModule },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error("Error creating module:", error);
//         return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
//     }
// }

// // **Function to extract audio from video**
// async function extractAudio(videoUrl, audioPath) {
//     return new Promise((resolve, reject) => {
//         const ffmpeg = spawn("ffmpeg", ["-i", videoUrl, "-ab", "160k", "-ar", "44100", "-vn", audioPath]);

//         ffmpeg.on("close", (code) => {
//             if (code === 0) resolve();
//             else reject(new Error("FFmpeg audio extraction failed"));
//         });

//         ffmpeg.on("error", (err) => reject(err));
//     });
// }

// // **Function to transcribe audio using Whisper**
// async function transcribeAudio(audioPath) {
//     try {
//         const model = await loadModel("base");
//         const result = await model.transcribe(audioPath);
//         return result.text;
//     } catch (error) {
//         console.error("Whisper transcription error:", error);
//         return "Transcription failed";
//     }
// }
