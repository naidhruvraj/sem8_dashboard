// import { connectToDatabase } from "@/lib/mongodb";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get("email");

//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     const { db } = await connectToDatabase();
//     const student = await db.collection("students").findOne({ email });

//     if (!student) {
//       return NextResponse.json({ message: "Student not found" }, { status: 404 });
//     }

//     return NextResponse.json(student, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching student data:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const { db } = await connectToDatabase();
//     const { name, age, address, mobile, bloodGroup, motorSkills, communicationSkills, socialSkills, email } = await req.json();

//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     const updateData = { name, age, address, mobile, bloodGroup, motorSkills, communicationSkills, socialSkills };

//     await db.collection("students").updateOne(
//       { email },
//       { $set: updateData },
//       { upsert: true }
//     );

//     // Return updated student data immediately
//     const updatedStudent = await db.collection("students").findOne({ email });
//     return NextResponse.json(updatedStudent, { status: 200 });

//   } catch (error) {
//     console.error("Error saving student data:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const student = await db.collection("students").findOne({ email });

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { db } = await connectToDatabase();
    const { name, age, address, mobile, bloodGroup, motorSkills, communicationSkills, socialSkills, email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if the student exists
    const student = await db.collection("students").findOne({ email });

    if (!student) {
      // If student does not exist, insert new student with default preAssessmentCompleted = false
      const newStudent = {
        email,
        name,
        age,
        address,
        mobile,
        bloodGroup,
        motorSkills,
        communicationSkills,
        socialSkills,
        preAssessmentCompleted: false, // Default for new students
      };

      await db.collection("students").insertOne(newStudent);
      return NextResponse.json(newStudent, { status: 201 }); // Created
    } else {
      // Preserve `preAssessmentCompleted` while updating student details
      const { preAssessmentCompleted = false } = student;

      await db.collection("students").updateOne(
        { email },
        {
          $set: {
            name,
            age,
            address,
            mobile,
            bloodGroup,
            motorSkills,
            communicationSkills,
            socialSkills,
            preAssessmentCompleted, // Keep existing value
          },
        }
      );

      // Fetch updated student data
      const updatedStudent = await db.collection("students").findOne({ email });

      return NextResponse.json(updatedStudent, { status: 200 });
    }
  } catch (error) {
    console.error("Error saving student data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
