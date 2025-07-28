import { GoogleGenAI } from "@google/genai";
import aiConfig from "./constants/ai.json" assert { type: "json" };

const ai = new GoogleGenAI({});

export async function getAIResponse(message: string) {
	const response = await ai.models.generateContent({
		model: aiConfig.model,
		contents: message,
		config: {
			maxOutputTokens: aiConfig.max_tokens,
			temperature: aiConfig.temperature,
			topP: aiConfig.top_p,
			systemInstruction: aiConfig.system_instruction,
		},
	});

	console.log("Asking AI:", message);
	console.log("AI Response:", response.text);

	return response.text || "Sorry, I didn't understand that.";
}
