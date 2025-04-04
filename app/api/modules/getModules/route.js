// import { connectToDatabase } from "@/lib/mongodb";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);

//     // ✅ Get and validate pagination parameters
//     let page = parseInt(searchParams.get("page")) || 1;
//     let limit = parseInt(searchParams.get("limit")) || 10;

//     if (page < 1) page = 1;
//     if (limit < 1) limit = 10;

//     const skip = (page - 1) * limit;

//     // ✅ Connect to the database
//     const { db } = await connectToDatabase();
//     if (!db) {
//       return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
//     }

//     const modulesCollection = db.collection("modules");

//     // ✅ Fetch paginated modules, ensuring `createdAt` is always available
//     const modules = await modulesCollection
//       .find({}, { projection: { name: 1, description: 1, videoUrl: 1, createdAt: 1 } })
//       .sort({ createdAt: -1, _id: -1 }) // Sorts by creation date, falls back to `_id`
//       .skip(skip)
//       .limit(limit)
//       .toArray();

//     // ✅ Add fallback for missing `createdAt`
//     modules.forEach(module => {
//       if (!module.createdAt) {
//         module.createdAt = new Date(module._id.getTimestamp());
//       }
//     });

//     // ✅ Get total module count for pagination
//     const totalModules = await modulesCollection.countDocuments();
//     const totalPages = Math.ceil(totalModules / limit);

//     return NextResponse.json(
//       {
//         modules,
//         totalPages,
//         currentPage: page,
//         totalModules,
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("❌ Error fetching modules:", error);
//     return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
//   }
// }


import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    
    // ✅ Get pagination parameters
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // ✅ Connect to the database
    const { db } = await connectToDatabase();
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    const modulesCollection = db.collection("modules");

    // ✅ Fetch paginated modules, sorting by `_id` (ObjectId timestamp)
    const modules = await modulesCollection
      .find({}, { projection: { name: 1, description: 1, videoUrl: 1, createdAt: 1 } })
      .sort({ createdAt: -1, _id: -1 }) // Ensures sorting works even if `createdAt` is missing
      .skip(skip)
      .limit(limit)
      .toArray();

    // ✅ Get total module count for pagination
    const totalModules = await modulesCollection.countDocuments();
    const totalPages = Math.ceil(totalModules / limit);

    return NextResponse.json({ 
      modules, 
      totalPages, 
      currentPage: page, 
      totalModules 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}
