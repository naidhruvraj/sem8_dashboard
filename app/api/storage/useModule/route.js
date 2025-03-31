import { connectToDatabase } from "@/lib/mongodb";

import { ObjectId } from "mongodb";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const moduleId = searchParams.get("id"); // Read `id` from URL params

        if (!moduleId) {
            return Response.json({ error: "Module ID is required" }, { status: 400 });
        }

        const db = await connectToDatabase();
        const module = await db.collection("modules").findOne({ _id: new ObjectId(moduleId) });

        if (!module) {
            return Response.json({ error: "Module not found" }, { status: 404 });
        }

        return Response.json(module, { status: 200 });
    } catch (error) {
        console.error("Database fetch error:", error);
        return Response.json({ error: "Failed to fetch module" }, { status: 500 });
    }
}

