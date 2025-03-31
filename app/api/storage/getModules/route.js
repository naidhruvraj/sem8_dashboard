import { connectToDatabase } from "@/lib/mongodb";


export async function GET() {
    try {
        const db = await connectToDatabase();
        const modules = await db.collection("modules").find().toArray();
        return Response.json(modules, { status: 200 });
    } catch (error) {
        console.error("Database fetch error:", error);
        return Response.json({ error: "Failed to fetch modules" }, { status: 500 });
    }
}

