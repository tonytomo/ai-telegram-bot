import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ICallbackQuery, IMessage } from "./types/message";
import TelegramBot from "./bot";
import { response } from "./utils";
import keys from "./constants/keyboard.json";

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
	await bot.filter();

	await bot.onKey("hi", keys.love, "Hello!");
	await bot.onKeyRun(
		"i_love_you",
		async () => await bot.send("I love you too!")
	);

	await bot.on("/halo", async () => await bot.send("Halo, apa kabar?"));
	await bot.on("/start", async () => await bot.sendKey(keys.intro));

	await bot.on("/register", async () => await bot.register());

	await bot.onAi(true);

	return response(200, { message: "Telegram bot is successfully running" });
};
