import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

async function listModels() {
  try {
    const models = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; // Just accessing the client, but listing models via a different method if available or just testing a known one.
    // Actually the SDK doesn't have a direct 'listModels' helper easily accessible without raw fetch sometimes, but let's try a direct test of a standard model.
    // A better approach with the raw API key to see WHAT IS available.
    
    // Using fetch for direct API call to list models
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("Available Models:");
    if (data.models) {
        data.models.forEach((m: any) => {
            if (m.name.includes("gemini")) {
                console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods})`);
            }
        });
    } else {
        console.log("No models found or error:", data);
    }

  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
