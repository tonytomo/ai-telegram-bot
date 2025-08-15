import { GoogleGenAI } from "@google/genai";
import aiConfig from "./constants/ai.json";

export async function runAi(text: string, name: string): Promise<string> {
	const ai = new GoogleGenAI({});

	const contents = `User name: ${name}\nUser prompt: ${text}`;

	const response = await ai.models.generateContent({
		...aiConfig,
		contents,
	});

	console.log("Prompt:", text);
	console.log("Generated:", response.text);

	return response.text || "";
}
