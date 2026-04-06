import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGeminiModel } from "@/lib/gemini";

function extractJSON(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`No JSON found in response: ${text.slice(0, 200)}`);
  return match[0];
}

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

  const model = getGeminiModel();

  const prompt = `You are a task management assistant. Based on the task title and description, suggest the appropriate priority level.

Task Title: ${title}
Task Description: ${description || "No description provided"}

You MUST respond with ONLY a raw JSON object. No markdown, no code fences, no explanation. Just the JSON:
{"priority": "medium", "reason": "one sentence explanation"}

Priority guidelines:
- high: urgent, blocking other work, critical deadlines, production/security issues
- medium: important but not urgent, standard feature or improvement work
- low: nice-to-have, minor changes, non-blocking tasks`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    console.log("[AI Priority] Raw response:", text.slice(0, 200));

    const jsonStr = extractJSON(text);
    const parsed = JSON.parse(jsonStr);

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
        detail: process.env.NODE_ENV === "development"
          ? String(err)
          : undefined,
      },
      { status: 500 }
    );
  }
}
