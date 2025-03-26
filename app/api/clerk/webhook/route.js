import { Webhook } from "svix"; 
import { headers } from "next/headers";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret is not configured", { status: 500 });
  }

  try {
    const payload = await req.text();
    const headerList = headers();
    const svixHeaders = {
      "svix-id": headerList.get("svix-id"),
      "svix-timestamp": headerList.get("svix-timestamp"),
      "svix-signature": headerList.get("svix-signature"),
    };

    const wh = new Webhook(WEBHOOK_SECRET);
    const event = wh.verify(payload, svixHeaders);

    console.log("🔔 Clerk Webhook Event:", event);

    // Check if event type is "user.created"
    if (event.type === "user.created") {
      const userId = event.data.id;

      // Assign "student" role to the new user
      const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY}`
        },
        body: JSON.stringify({
          public_metadata: { role: "student" }
        })
      });

      if (!response.ok) {
        console.error("❌ Failed to update user role:", await response.text());
        return new Response("Failed to assign role", { status: 500 });
      }

      console.log("✅ Successfully assigned 'student' role");
    }

    return new Response("Webhook received!", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Invalid webhook", { status: 400 });
  }
}
