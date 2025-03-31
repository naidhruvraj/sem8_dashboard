// import { connectToDatabase } from "@/lib/mongodb";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     // Get the authenticated user
//     const user = await currentUser();
//     if (!user || user.publicMetadata?.role !== "teacher") {
//       return NextResponse.json({ error: "Unauthorized - Teacher role required" }, { status: 401 });
//     }

//     // Parse request data
//     const { name, description, videoUrl } = await req.json();
//     if (!name || !description || !videoUrl) {
//       return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//     }

//     // Connect to MongoDB
//     const db = await connectToDatabase();
//     const modulesCollection = db.collection("modules");

//     // Check if module already exists
//     const existingModule = await modulesCollection.findOne({ name });
//     if (existingModule) {
//       return NextResponse.json({ error: "A module with this name already exists" }, { status: 409 });
//     }

//     // Create module
//     const newModule = { name, description, videoUrl, createdAt: new Date() };
//     await modulesCollection.insertOne(newModule);

//     return NextResponse.json({ message: "Module created successfully", module: newModule }, { status: 201 });

//   } catch (error) {
//     console.error("Error creating module:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name, description, videoUrl } = await req.json();

        // Validate input fields
        if (!name || !description || !videoUrl) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Connect to MongoDB and access the 'modules' collection
        const db = await connectToDatabase();
        const modulesCollection = db.collection("modules");

        // Check if a module with the same name already exists
        const existingModule = await modulesCollection.findOne({ name });
        if (existingModule) {
            return NextResponse.json({ error: "A module with this name already exists" }, { status: 409 });
        }

        // Create a new module (no teacher-specific restriction)
        const newModule = { 
            name, 
            description, 
            videoUrl, 
            createdAt: new Date() 
        };

        await modulesCollection.insertOne(newModule);

        return NextResponse.json(
            { message: "Module created successfully", module: newModule }, 
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating module:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}