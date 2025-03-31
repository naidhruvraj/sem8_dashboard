// import { connectToDatabase } from "@/lib/mongodb";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const { userId } = auth();
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Connect to MongoDB
//     const db = await connectToDatabase();
//     const modulesCollection = db.collection("modules");

//     const modules = await modulesCollection.find().sort({ createdAt: -1 }).toArray();

//     return NextResponse.json({ modules }, { status: 200 });

//   } catch (error) {
//     console.error("Error fetching modules:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }



// import { connectToDatabase } from "@/lib/mongodb";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//     try {
//         const { searchParams } = req.nextUrl;
//         const page = parseInt(searchParams.get("page")) || 1;
//         const limit = parseInt(searchParams.get("limit")) || 10;
//         const skip = (page - 1) * limit;

//         const { db } = await connectToDatabase();
//         const modulesCollection = db.collection("modules");

//         const modules = await modulesCollection
//             .find({}, { projection: { name: 1, description: 1, videoUrl: 1, createdAt: 1 } })
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit)
//             .toArray();

//         const totalModules = await modulesCollection.countDocuments();
//         const totalPages = Math.ceil(totalModules / limit);

//         return NextResponse.json({ modules, totalPages, currentPage: page }, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching modules:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }


import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { db } = await connectToDatabase();
    if (!db) throw new Error("Database connection failed");

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const modulesCollection = db.collection("modules");

    const modules = await modulesCollection
      .find({}, { projection: { name: 1, description: 1, videoUrl: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalModules = await modulesCollection.countDocuments();
    const totalPages = Math.ceil(totalModules / limit);

    return NextResponse.json({ modules, totalPages, currentPage: page }, { status: 200 });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
