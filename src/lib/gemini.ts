import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getGeminiModel = (model = "gemini-2.0-flash") =>
  gemini.getGenerativeModel({ model });
