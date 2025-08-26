import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { ICallbackQuery, IMessage } from "./types/message";
import TelegramBot from "./bot";
import { isMember, response } from "./utils";

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
	console.log("Event Context:", context);
	console.log("Event Body:", JSON.parse(event.body || "{}"));

	const token = process.env.TELEGRAM_API_TOKEN;
	if (!token) return response(500, { error: "Token is not set" });
	if (!event.body) return response(400, { error: "Body is required" });

	const body = JSON.parse(event.body);
	const message: IMessage = body.message || null;
	const query: ICallbackQuery = body.callback_query || null;
	const user = message ? message.from : query ? query.from : null;
	const member = await isMember(user);
	const bot = new TelegramBot({ token, message, query, member });

	await bot.filter();
	await bot.onStart();

	await bot.onKey(
		"read",
		async () =>
			await bot.edit(
				`Baik.\nApakah anda setuju dengan ketentuan kami?\n[Syarat dan Ketentuan](https://...)\n[Kebijakan Privasi](https://...)`,
				[[{ text: "Saya Setuju", callback_data: "agree" }]]
			)
	);

	await bot.onKey("agree", async () => {
		await bot.register();
		await bot.onStart();
	});
	await bot.onKey("ai", async () => await bot.setProgress("ai"));

	await bot.onAi();

	return response(200, { message: "Telegram bot is successfully running" });
};
