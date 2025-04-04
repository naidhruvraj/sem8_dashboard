// import { connectToDatabase } from "@/lib/mongodb";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { studentEmail, moduleName, score } = await req.json();

//     if (!studentEmail || !moduleName || typeof score !== "number") {
//       return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//     }

//     const { db } = await connectToDatabase();
//     const studentsCollection = db.collection("students");

//     const student = await studentsCollection.findOne({ email: studentEmail });

//     if (!student) {
//       return NextResponse.json({ error: "Student not found" }, { status: 404 });
//     }

//     // Add result to existing results array or create it if it doesn't exist
//     await studentsCollection.updateOne(
//       { email: studentEmail },
//       {
//         $push: {
//           postAssessmentResults: {
//             moduleName,
//             score,
//             date: new Date()
//           }
//         }
//       }
//     );

//     return NextResponse.json({ message: "Post-assessment result saved successfully" }, { status: 200 });
//   } catch (error) {
//     console.error("Error saving post-assessment result:", error);
//     return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
//   }
// }

import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, moduleName, score } = await req.json();

    if (!email || !moduleName || score === undefined) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const studentsCollection = db.collection("students");

    // Check if student exists
    const existingStudent = await studentsCollection.findOne({ email });

    if (!existingStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Push the new result into postAssessmentResults array
    await studentsCollection.updateOne(
      { email },
      {
        $push: {
          postAssessmentResults: {
            moduleName,
            score,
            submittedAt: new Date()
          }
        }
      }
    );

    return NextResponse.json({ message: "Post-assessment result saved successfully." }, { status: 200 });

  } catch (error) {
    console.error("Error saving post-assessment result:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
