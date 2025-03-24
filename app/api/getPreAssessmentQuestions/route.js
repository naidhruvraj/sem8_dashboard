import { generateQuestions } from "@/utils/AItransformermodel";

export async function GET() {
  try {
    const questions = await generateQuestions();

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("Failed to parse questions");
    }

    return new Response(JSON.stringify(questions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch questions" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
