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
			console.error(`Failed to send typing action: ${response.json()}`);
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
			console.error(`Failed to send message: ${response.json()}`);
		}
	}

	async sendWithKeyboard(
		chatId: number,
		text: string,
		keyboard: Array<Array<{ text: string }>>
	): Promise<void> {
		const param = new URLSearchParams({
			chat_id: chatId.toString(),
			text: text,
			parse_mode: "MarkdownV2",
			reply_markup: JSON.stringify({
				keyboard: keyboard,
				one_time_keyboard: true,
				resize_keyboard: true,
			}),
		});

		const url = `https://api.telegram.org/bot${this.token}/sendMessage?`;
		const response = await fetch(url + param.toString());

		if (!response.ok) {
			console.error(`Failed to send message with keyboard: ${response.json()}`);
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
			console.error(`Failed to send photo: ${response.json()}`);
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
			console.error(`Failed to send document: ${response.json()}`);
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
			console.error(`Failed to delete message: ${response.json()}`);
		}
	}
}
