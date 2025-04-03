// import { connectToDatabase } from "@/lib/mongodb";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { db } = await connectToDatabase();
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     // ✅ Only update `preAssessmentCompleted` to `true` when this API is called
//     await db.collection("students").updateOne(
//       { email },
//       { $set: { preAssessmentCompleted: true } }
//     );

//     return NextResponse.json({ message: "Pre-Assessment marked as completed" }, { status: 200 });
//   } catch (error) {
//     console.error("Error updating pre-assessment status:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { db } = await connectToDatabase();
    const { email, category } = await req.json(); // ✅ Extract category

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    // ✅ Update both `preAssessmentCompleted` and `category`
    const result = await db.collection("students").updateOne(
      { email },
      { $set: { preAssessmentCompleted: true, category: category } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Pre-Assessment marked as completed and category updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating pre-assessment status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
