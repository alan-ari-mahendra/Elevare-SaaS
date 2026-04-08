import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { groqGenerateJSON } from "@/lib/groq";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description } = await req.json();

  if (!title?.trim()) {
    return NextResponse.json(
      { error: "Task title is required" },
      { status: 400 }
    );
  }

  const prompt = `Based on this task, suggest the appropriate priority level.

Task Title: ${title}
Task Description: ${description || "No description provided"}

Respond with JSON in this exact format:
{"priority": "high" | "medium" | "low", "reason": "one sentence explanation"}

Priority guidelines:
- high: urgent, blocking other work, critical deadlines, production/security issues
- medium: important but not urgent, standard feature or improvement work
- low: nice-to-have, minor changes, non-blocking tasks`;

  try {
    const text = await groqGenerateJSON(prompt);
    console.log("[AI Priority] Raw response:", text.slice(0, 200));

    const parsed = JSON.parse(text);

    if (!["high", "medium", "low"].includes(parsed.priority)) {
      throw new Error(`Invalid priority value: ${parsed.priority}`);
    }

    return NextResponse.json({
      priority: parsed.priority as "high" | "medium" | "low",
      reason: parsed.reason as string,
    });
  } catch (err) {
    console.error("[AI Priority] Error:", err);
    return NextResponse.json(
      {
        error: "Failed to generate suggestion",
        detail:
          process.env.NODE_ENV === "development" ? String(err) : undefined,
      },
      { status: 500 }
    );
  }
}
