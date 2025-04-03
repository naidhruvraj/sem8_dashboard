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

// export async function POST(req) {
//     try {
//         const { name, description, videoUrl } = await req.json();

//         // Validate input fields
//         if (!name || !description || !videoUrl) {
//             return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//         }

//         // Connect to MongoDB and access the 'modules' collection
//         const db = await connectToDatabase();
//         const modulesCollection = db.collection("modules");

//         // Check if a module with the same name already exists
//         const existingModule = await modulesCollection.findOne({ name });
//         if (existingModule) {
//             return NextResponse.json({ error: "A module with this name already exists" }, { status: 409 });
//         }

//         // Create a new module (no teacher-specific restriction)
//         const newModule = { 
//             name, 
//             description, 
//             videoUrl, 
//             createdAt: new Date() 
//         };

//         await modulesCollection.insertOne(newModule);

//         return NextResponse.json(
//             { message: "Module created successfully", module: newModule }, 
//             { status: 201 }
//         );
//     } catch (error) {
//         console.error("Error creating module:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }