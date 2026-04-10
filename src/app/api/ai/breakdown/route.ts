import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { groqGenerateJSON } from "@/lib/groq";

export interface AITask {
  title: string;
  priority: "high" | "medium" | "low";
  description: string;
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

  const prompt = `Break down this project goal into clear, actionable tasks.

Project Name: ${projectName || "Untitled Project"}
Goal: ${goal}

Respond with JSON in this exact format:
{"tasks": [{"title": "task title", "priority": "high" | "medium" | "low", "description": "one sentence description"}]}

Rules:
- Generate between 4 and 8 tasks
- Each title must be concise and actionable (under 60 characters)
- Each description must be exactly one sentence
- priority must be one of: "high", "medium", "low"
- Order tasks logically (setup/foundation first, then features, then polish)
- Be specific to the project goal, not generic`;

  try {
    const text = await groqGenerateJSON(prompt);
    console.log("[AI Breakdown] Raw response:", text.slice(0, 300));

    const parsed = JSON.parse(text);

    if (!Array.isArray(parsed.tasks)) {
      throw new Error(
        `Invalid response structure. Got: ${JSON.stringify(parsed).slice(0, 200)}`
      );
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
        detail:
          process.env.NODE_ENV === "development" ? String(err) : undefined,
      },
      { status: 500 }
    );
  }
}
