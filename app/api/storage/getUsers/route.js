import { connectToDatabase } from "@/lib/mongodb";


export async function GET() {
    try {
        const db = await connectToDatabase();
        const users = await db.collection("users").find().toArray();
        return Response.json(users, { status: 200 });
    } catch (error) {
        console.error("Database fetch error:", error);
        return Response.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
