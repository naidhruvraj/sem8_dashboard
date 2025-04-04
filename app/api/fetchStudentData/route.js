// /app/api/fetchStudentData/route.js

import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const studentsCollection = db.collection("students");

    const students = await studentsCollection.find({}).toArray();

    return NextResponse.json({ students }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
