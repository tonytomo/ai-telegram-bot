import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import response from "./constants/response.json" assert { type: "json" };
import { replaceResponse } from "./utils";
import { Bot } from "./bot";

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
	console.log("Event Context:", context);
	console.log("Event Body:", JSON.parse(event.body || "{}"));

	if (!event.body) {
		return {
			statusCode: 400,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ error: "No body provided in the request" }),
		};
	}

	const body = JSON.parse(event.body);
	const messageText = body.message?.text;
	const senderName = body.message?.from?.first_name;
	const reply = response[messageText as keyof typeof response]?.output;
	const output = replaceResponse(reply, "name", senderName);

	if (!output) {
		return {
			ok: false,
			error: "No matching guide found",
		};
	}

	const bot = new Bot(process.env.SECRET_TOKEN || "");

	try {
		await bot.send(body.message.chat.id, output);
	} catch (error) {
		return {
			ok: false,
			error: `Failed to send message: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		};
	}

	return {
		ok: true,
		data: { message: output },
	};
};
