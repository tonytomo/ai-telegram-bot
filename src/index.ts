import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { formatMessage, replaceResponse } from "./utils";
import { IMessage } from "./types/message";
import response from "./constants/response.json" assert { type: "json" };
import TelegramBot from "./bot";
import { getAIResponse } from "./ai";

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
	console.log("Event Context:", context);
	console.log("Event Body:", JSON.parse(event.body || "{}"));

	let output: string | undefined;

	const bot = new TelegramBot(process.env.SECRET_TOKEN || "");

	if (!event.body) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "Request body is missing" }),
		};
	}

	const body = JSON.parse(event.body);
	const message: IMessage = body.message;

	const newChatMembers = message.new_chat_members || [];
	if (newChatMembers.length > 0) {
		const reply = response["auto:welcome"]?.output;
		output = replaceResponse(reply, "name", newChatMembers[0].first_name);

		await bot.typing(message.from.id);
		await bot.send(message.from.id, output);

		return {
			statusCode: 200,
			body: JSON.stringify({ message: "Welcome message sent successfully" }),
		};
	}

	if (message.left_chat_member) {
		const reply = response["auto:goodbye"]?.output;
		output = replaceResponse(
			reply,
			"name",
			message.left_chat_member.first_name
		);

		await bot.typing(message.from.id);
		await bot.send(message.from.id, output);

		return {
			statusCode: 200,
			body: JSON.stringify({ message: "Goodbye message sent successfully" }),
		};
	}

	const reply = response[message.text as keyof typeof response]?.output;
	output = replaceResponse(reply, "name", message.from.first_name);

	if (!output && message.chat.type === "private") {
		let prompt = response["auto:ai"].output + ` ${message.text}`;
		prompt = replaceResponse(prompt, "name", message.from.first_name);
		output = await getAIResponse(prompt);
	}

	if (!output) {
		output = response["auto:fail"].output;
	}

	await bot.typing(message.chat.id);
	await bot.send(message.chat.id, formatMessage(output));

	return {
		statusCode: 200,
		body: JSON.stringify({ message: "Message sent successfully" }),
	};
};
