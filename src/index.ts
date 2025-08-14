import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ICallbackQuery, IMessage } from "./types/message";
import TelegramBot from "./bot";
import { TKeyboards } from "./types/keyboard";

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
	console.log("Event Context:", context);
	console.log("Event Body:", JSON.parse(event.body || "{}"));

	const token = process.env.TELEGRAM_API_TOKEN;
	if (!token) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Telegram API token is not set" }),
		};
	}

	if (!event.body) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "Request body is missing" }),
		};
	}

	const body = JSON.parse(event.body);
	const message: IMessage = body.message;
	const query: ICallbackQuery = body.callback_query;

	const bot = new TelegramBot({ token, message, query });

	await bot.onWelcome();
	await bot.onGoodbye();

	await bot.onQuery("hi", [
		[
			{ text: "Halo", callback_data: "id" },
			{ text: "Hola", callback_data: "sp" },
		],
		[
			{ text: "Hello", callback_data: "en" },
			{ text: "Ping", callback_data: "bb" },
		],
	]);

	await bot.on("/halo", async (msg) => {
		await bot.typing();
		await bot.send("Halo, apa kabar?");
	});

	await bot.on("/start", async (msg) => {
		const keyboard = [
			[
				{ text: "Hi", callback_data: "hi" },
				{ text: "Love", callback_data: "love" },
			],
			[
				{ text: "Hate", callback_data: "hate" },
				{ text: "Bye", callback_data: "bye" },
			],
		] as TKeyboards;

		await bot.typing();
		await bot.sendKey(keyboard);
	});

	// const newChatMembers = message.new_chat_members || [];
	// if (newChatMembers.length > 0) {
	// 	const reply = response["auto:welcome"]?.output;
	// 	output = replaceResponse(reply, "name", newChatMembers[0].first_name);

	// 	await bot.typing();
	// 	await bot.send(output);

	// 	return {
	// 		statusCode: 200,
	// 		body: JSON.stringify({ message: "Welcome message sent successfully" }),
	// 	};
	// }

	// if (message.left_chat_member) {
	// 	const reply = response["auto:goodbye"]?.output;
	// 	output = replaceResponse(
	// 		reply,
	// 		"name",
	// 		message.left_chat_member.first_name
	// 	);

	// 	await bot.typing();
	// 	await bot.send(output);

	// 	return {
	// 		statusCode: 200,
	// 		body: JSON.stringify({ message: "Goodbye message sent successfully" }),
	// 	};
	// }

	// if (message.text === "/keyboard") {
	// 	const keyboard = [
	// 		[{ text: "Google" }, { text: "GitHub" }],
	// 		[{ text: "OpenAI" }, { text: "Telegram" }],
	// 	];

	// 	await bot.typing();
	// 	await bot.sendKey(keyboard);

	// 	return {
	// 		statusCode: 200,
	// 		body: JSON.stringify({ message: "Keyboard sent successfully" }),
	// 	};
	// }

	// const reply = response[message.text as keyof typeof response]?.output;
	// output = replaceResponse(reply, "name", message.from.first_name);

	// if (!output && message.chat.type === "private") {
	// 	let prompt = response["auto:ai"].output + ` ${message.text}`;
	// 	prompt = replaceResponse(prompt, "name", message.from.first_name);
	// 	output = await getAIResponse(prompt);
	// }

	// if (!output) {
	// 	output = response["auto:fail"].output;
	// }

	// await bot.typing();
	// await bot.send(formatMessage(output));

	return {
		statusCode: 200,
		body: JSON.stringify({ message: "Message sent successfully" }),
	};
};
