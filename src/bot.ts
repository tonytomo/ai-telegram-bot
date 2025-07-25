export class Bot {
	token: string;

	constructor(token: string) {
		this.token = token;
	}

	async send(chatId: string, text: string): Promise<void> {
		const param = new URLSearchParams({
			chat_id: chatId,
			text: text,
		});

		const url = `https://api.telegram.org/bot${this.token}/sendMessage?`;
		const response = await fetch(url + param.toString());

		if (!response.ok) {
			throw new Error(`Failed to send message: ${response.json()}`);
		}
	}

	async sendWithKeyboard(
		chatId: string,
		text: string,
		keyboard: Array<Array<{ text: string }>>
	): Promise<void> {
		const param = new URLSearchParams({
			chat_id: chatId,
			text: text,
			reply_markup: JSON.stringify({
				keyboard: keyboard,
				one_time_keyboard: true,
				resize_keyboard: true,
			}),
		});

		const url = `https://api.telegram.org/bot${this.token}/sendMessage?`;
		const response = await fetch(url + param.toString());

		if (!response.ok) {
			throw new Error(
				`Failed to send message with keyboard: ${response.json()}`
			);
		}
	}

	async sendPhoto(chatId: string, photoUrl: string): Promise<void> {
		const param = new URLSearchParams({
			chat_id: chatId,
			photo: photoUrl,
		});

		const url = `https://api.telegram.org/bot${this.token}/sendPhoto?`;
		const response = await fetch(url + param.toString());

		if (!response.ok) {
			throw new Error(`Failed to send photo: ${response.json()}`);
		}
	}
}
