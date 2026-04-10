import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

export async function groqGenerateJSON(prompt: string, model = DEFAULT_GROQ_MODEL) {
  const completion = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are a precise assistant that always responds with valid raw JSON only. Never include markdown, code fences, or any explanation — only the JSON object.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content ?? "";
}

export default groq;
