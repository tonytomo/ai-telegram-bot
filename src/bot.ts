export default class TelegramBot {
	token: string;

	constructor(token: string) {
		this.token = token;
	}

	async typing(chatId: number): Promise<void> {
		const param = new URLSearchParams({
			chat_id: chatId.toString(),
			action: "typing",
		});

		const url = `https://api.telegram.org/bot${this.token}/sendChatAction?`;
		const response = await fetch(url + param.toString());

		if (!response.ok) {
			throw new Error(
				`Failed to send typing action: ${(await response.json()).description}`
			);
		}
	}

	async send(chatId: number, text: string): Promise<void> {
		const param = new URLSearchParams({
			chat_id: chatId.toString(),
			text: text,
			parse_mode: "MarkdownV2",
		});

		const url = `https://api.telegram.org/bot${this.token}/sendMessage?`;
		const response = await fetch(url + param.toString());

		if (!response.ok) {
			throw new Error(
				`Failed to send message: ${(await response.json()).description}`
			);
		}
	}

	async sendWithKeyboard(
		chatId: number,
		text: string,
		keyboard: Array<Array<{ text: string; url: string }>>
	): Promise<void> {
		const param = new URLSearchParams({
			chat_id: chatId.toString(),
			text: text,
			parse_mode: "MarkdownV2",
			reply_markup: JSON.stringify({
				inline_keyboard: keyboard,
			}),
		});

		const url = `https://api.telegram.org/bot${this.token}/sendMessage?`;
		const response = await fetch(url + param.toString());

		if (!response.ok) {
			throw new Error(
				`Failed to send message with keyboard: ${JSON.stringify(
					await response.json()
				)}`
			);
		}
	}

	async sendPhoto(chatId: number, photoUrl: string): Promise<void> {
		const param = new URLSearchParams({
			chat_id: chatId.toString(),
			photo: photoUrl,
		});

		const url = `https://api.telegram.org/bot${this.token}/sendPhoto?`;
		const response = await fetch(url + param.toString());

		if (!response.ok) {
			throw new Error(
				`Failed to send photo: ${(await response.json()).description}`
			);
		}
	}

	async sendDocument(chatId: number, documentUrl: string): Promise<void> {
		const param = new URLSearchParams({
			chat_id: chatId.toString(),
			document: documentUrl,
		});

		const url = `https://api.telegram.org/bot${this.token}/sendDocument?`;
		const response = await fetch(url + param.toString());

		if (!response.ok) {
			throw new Error(
				`Failed to send document: ${(await response.json()).description}`
			);
		}
	}

	async deleteMessage(chatId: number, messageId: number): Promise<void> {
		const param = new URLSearchParams({
			chat_id: chatId.toString(),
			message_id: messageId.toString(),
		});

		const url = `https://api.telegram.org/bot${this.token}/deleteMessage?`;
		const response = await fetch(url + param.toString());

		if (!response.ok) {
			throw new Error(
				`Failed to delete message: ${(await response.json()).description}`
			);
		}
	}
}
