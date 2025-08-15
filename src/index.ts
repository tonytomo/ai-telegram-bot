import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ICallbackQuery, IMessage } from "./types/message";
import TelegramBot from "./bot";
import { TKeyboards } from "./types/keyboard";
import { response } from "./utils";

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
	console.log("Event Context:", context);
	console.log("Event Body:", JSON.parse(event.body || "{}"));

	const token = process.env.TELEGRAM_API_TOKEN;
	if (!token) return response(500, { error: "Token is not set" });
	if (!event.body) return response(400, { error: "Body is required" });

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

	await bot.on("/halo", async () => {
		await bot.typing();
		await bot.send("Halo, apa kabar?");
	});

	await bot.on("/start", async () => {
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

	return response(200, { message: "Telegram bot is running" });
};
