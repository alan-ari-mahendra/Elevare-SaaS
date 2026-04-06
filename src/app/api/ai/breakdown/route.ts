import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGeminiModel } from "@/lib/gemini";

export interface AITask {
  title: string;
  priority: "high" | "medium" | "low";
  description: string;
}

function extractJSON(text: string): string {
  // Try to find a JSON object anywhere in the response
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error(`No JSON found in response: ${text.slice(0, 200)}`);
  return match[0];
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectName, goal } = await req.json();

  if (!goal?.trim()) {
    return NextResponse.json(
      { error: "Project goal is required" },
      { status: 400 }
    );
  }

  const model = getGeminiModel();

  const prompt = `You are a project management assistant. Break down the following project goal into clear, actionable tasks.

Project Name: ${projectName || "Untitled Project"}
Goal: ${goal}

You MUST respond with ONLY a raw JSON object. No markdown, no code fences, no explanation. Just the JSON:
{"tasks": [{"title": "task title", "priority": "high", "description": "one sentence description"}]}

Rules:
- Generate between 4 and 8 tasks
- Each title must be concise and actionable (under 60 characters)
- Each description must be exactly one sentence
- priority must be one of: "high", "medium", "low"
- Order tasks logically (setup/foundation first, then features, then polish)
- Be specific to the project goal, not generic`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    console.log("[AI Breakdown] Raw response:", text.slice(0, 300));

    const jsonStr = extractJSON(text);
    const parsed = JSON.parse(jsonStr);

    if (!Array.isArray(parsed.tasks)) {
      throw new Error(`Invalid response structure. Got: ${JSON.stringify(parsed).slice(0, 200)}`);
    }

    const tasks: AITask[] = parsed.tasks.map((t: AITask) => ({
      title: String(t.title).slice(0, 100),
      priority: ["high", "medium", "low"].includes(t.priority)
        ? t.priority
        : "medium",
      description: String(t.description),
    }));

    return NextResponse.json({ tasks });
  } catch (err) {
    console.error("[AI Breakdown] Error:", err);
    return NextResponse.json(
      {
        error: "Failed to generate tasks",
        detail: process.env.NODE_ENV === "development"
          ? String(err)
          : undefined,
      },
      { status: 500 }
    );
  }
}
