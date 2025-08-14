import { TKeyboards } from "./types/keyboard";
import { IInit, IMessage } from "./types/message";
import { formatMessage } from "./utils";

export default class TelegramBot {
	init: IInit;
	isRan: boolean = false;

	constructor(init: IInit) {
		this.init = init;
	}

	async on(text: string, run: (msg: IMessage) => Promise<void>): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");
			if (this.init.message.text !== text) return;

			console.log(`Listening for message: ${text}`);
			await run(this.init.message);
			this.isRan = true;
		} catch (error) {
			console.error(`Error handling event "${text}":`, error);
		}
	}

	async onQuery(query: string, keyboard: TKeyboards): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.message) return;
			if (!this.init.query) throw new Error("Query is not set");
			if (this.init.query.data !== query) return;

			console.log(`Listening for query: ${query}`);
			await this.editKey(keyboard);
			this.isRan = true;
		} catch (error) {
			console.error("Error in onQuery method:", error);
		}
	}

	async onWelcome(): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const adds = this.init.message.new_chat_members || [];
			if (adds.length === 0) return;

			adds.forEach((user) => {
				this.typing();
				this.send(`Welcome ${user.first_name}!`);
			});
			this.isRan = true;
		} catch (error) {
			console.error("Error in welcome method:", error);
		}
	}

	async onGoodbye(): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const left = this.init.message.left_chat_member;
			if (!left) return;

			this.typing();
			this.send(`Goodbye ${left.first_name}!`);
			this.isRan = true;
		} catch (error) {
			console.error("Error in goodbye method:", error);
		}
	}

	async typing(): Promise<void> {
		try {
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const param = new URLSearchParams({
				chat_id: this.init.message.chat.id.toString(),
				action: "typing",
			});

			const url = `https://api.telegram.org/bot${this.init.token}/sendChatAction?`;
			const response = await fetch(url + param.toString());

			if (!response.ok) {
				throw new Error(
					`Failed to send typing action: ${(await response.json()).description}`
				);
			}
			this.isRan = true;
		} catch (error) {
			console.error("Error in typing method:", error);
		}
	}

	async send(text: string): Promise<void> {
		try {
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const formattedText = formatMessage(text);

			const param = new URLSearchParams({
				chat_id: this.init.message.chat.id.toString(),
				text: formattedText,
				parse_mode: "MarkdownV2",
			});

			const url = `https://api.telegram.org/bot${this.init.token}/sendMessage?`;
			const response = await fetch(url + param.toString());

			if (!response.ok) {
				throw new Error(
					`Failed to send message: ${(await response.json()).description}`
				);
			}

			this.isRan = true;
		} catch (error) {
			console.error("Error in send method:", error);
		}
	}

	async sendKey(keyboard: TKeyboards, text?: string): Promise<void> {
		try {
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const param = new URLSearchParams({
				chat_id: this.init.message.chat.id.toString(),
				text: text || "Pilih pilihan di bawah ini:",
				parse_mode: "MarkdownV2",
				reply_markup: JSON.stringify({ inline_keyboard: keyboard }),
			});

			const url = `https://api.telegram.org/bot${this.init.token}/sendMessage?`;
			const response = await fetch(url + param.toString());

			if (!response.ok) {
				throw new Error(
					`Failed to send message with keyboard: ${JSON.stringify(
						await response.json()
					)}`
				);
			}

			this.isRan = true;
		} catch (error) {
			console.error("Error in sendKey method:", error);
		}
	}

	async editKey(keyboard: TKeyboards): Promise<void> {
		try {
			if (!this.init.query) throw new Error("Query is not set");
			if (!this.init.query.message) throw new Error("Message is not set");
			if (!this.init.query.data) throw new Error("Query data is not set");

			const param = new URLSearchParams({
				chat_id: this.init.query.message.chat.id.toString(),
				message_id: this.init.query.message.message_id.toString(),
				reply_markup: JSON.stringify({ inline_keyboard: keyboard }),
			});

			const url = `https://api.telegram.org/bot${this.init.token}/editMessageReplyMarkup?`;
			const response = await fetch(url + param.toString());

			if (!response.ok) {
				throw new Error(
					`Failed to edit message with keyboard: ${
						(await response.json()).description
					}`
				);
			}

			this.isRan = true;
		} catch (error) {
			console.error("Error in editKey method:", error);
		}
	}

	async sendPic(photoUrl: string): Promise<void> {
		try {
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const param = new URLSearchParams({
				chat_id: this.init.message.chat.id.toString(),
				photo: photoUrl,
			});

			const url = `https://api.telegram.org/bot${this.init.token}/sendPhoto?`;
			const response = await fetch(url + param.toString());

			if (!response.ok) {
				throw new Error(
					`Failed to send photo: ${(await response.json()).description}`
				);
			}

			this.isRan = true;
		} catch (error) {
			console.error("Error in sendPic method:", error);
		}
	}

	async sendDoc(documentUrl: string): Promise<void> {
		try {
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const param = new URLSearchParams({
				chat_id: this.init.message.chat.id.toString(),
				document: documentUrl,
			});

			const url = `https://api.telegram.org/bot${this.init.token}/sendDocument?`;
			const response = await fetch(url + param.toString());

			if (!response.ok) {
				throw new Error(
					`Failed to send document: ${(await response.json()).description}`
				);
			}

			this.isRan = true;
		} catch (error) {
			console.error("Error in sendDoc method:", error);
		}
	}

	async remove(): Promise<void> {
		try {
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const param = new URLSearchParams({
				chat_id: this.init.message.chat.id.toString(),
				message_id: this.init.message.message_id.toString(),
			});

			const url = `https://api.telegram.org/bot${this.init.token}/deleteMessage?`;
			const response = await fetch(url + param.toString());

			if (!response.ok) {
				throw new Error(
					`Failed to delete message: ${(await response.json()).description}`
				);
			}

			this.isRan = true;
		} catch (error) {
			console.error("Error in remove method:", error);
		}
	}
}
