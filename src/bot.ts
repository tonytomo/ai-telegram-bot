import { runAi } from "./ai";
import { getItem, insertItem, updateItem } from "./db";
import { TKeyboards } from "./types/keyboard";
import { EStatus, IMember } from "./types/member";
import { IInit } from "./types/message";
import {
	checkSwears,
	formatText,
	isValidEmail,
	isValidIDPhone,
	newMember,
} from "./utils";

/**
 * TelegramBot class provides methods to interact with the Telegram Bot API.
 * This class is designed to be used in a serverless environment, such as AWS Lambda.
 * @class TelegramBot
 * @constructor
 * @param {IInit} init - Initialization parameters for the bot.
 * * The `init` object should contain the following properties:
 * * - `token`: The Telegram Bot API token.
 * * - `message`: An optional message object if the bot is responding to a message.
 * * - `query`: An optional callback query object if the bot is responding to a callback query.
 * @example
 * const bot = new TelegramBot({ token, message, query });
 * await bot.onWelcome();
 */
export default class TelegramBot {
	init: IInit;
	isRan: boolean = false;

	constructor(init: IInit) {
		this.init = init;
	}

	/**
	 * Registers a user in the database.
	 * This method adds a new user to the database if they are not already registered.
	 * @returns A promise that resolves to the user object if registration is successful, or null if the user is already registered or an error occurs.
	 */
	async register(): Promise<any | null> {
		try {
			if (this.init.query) return null;
			if (!this.init.message) throw new Error("Message is not set");

			const user = this.init.message.from;

			const joinedMember: IMember = await getItem("member", { id: user.id });
			if (joinedMember) return null;

			const newUser: IMember = newMember(user);
			const success = await insertItem("member", newUser);

			if (success) {
				return newUser;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Error when registering member:", error);
			return null;
		}
	}

	/**
	 * Handles swear words detection in messages.
	 * This method checks the message text for swear words and responds if any are found.
	 * @returns A promise that resolves when the swear word check is complete.
	 */
	async filter(): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const text = this.init.message.text;
			const id = this.init.message.from.id.toString();
			if (checkSwears(text)) {
				await this.remove();
				await this.send("Tolong jaga bahasanya, ya!", id);
				this.isRan = true;
			}
		} catch (error) {
			console.error("Error in onSwear method:", error);
		}
	}

	/**
	 * Handles a specific text message event.
	 * This method listens for a specific text message and executes the provided function when the text matches.
	 * @param text The text to listen for.
	 * @param run The function to execute when the text matches.
	 * @returns A promise that resolves when the event is handled.
	 */
	async on(text: string, run: () => Promise<void>): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");
			if (this.init.message.text !== text) return;

			console.log(`Listening for message: ${text}`);
			await run();
			this.isRan = true;
		} catch (error) {
			console.error(`Error handling event "${text}":`, error);
		}
	}

	/**
	 * Handles a specific callback query event sent by the user from an inline keyboard.
	 * This method listens for a specific callback query and executes the provided function when the query matches.
	 * @param query The callback query data to listen for.
	 * @param run The function to execute when the query matches.
	 * @returns A promise that resolves when the event is handled.
	 */
	async onKey(
		query: string,
		keyboard: TKeyboards,
		text: string
	): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.message) return;
			if (!this.init.query) throw new Error("Query is not set");
			if (this.init.query.data !== query) return;

			console.log(`Listening for query: ${query}`);
			console.log("Editing keyboard...");
			await this.editKey(keyboard, text);
			this.isRan = true;
		} catch (error) {
			console.error("Error in onQuery method:", error);
		}
	}

	/**
	 * Handles a specific callback query event sent by the user from an inline keyboard.
	 * This method listens for a specific callback query and executes the provided function when the query matches.
	 * @param query The callback query data to listen for.
	 * @param run The function to execute when the query matches.
	 * @returns A promise that resolves when the event is handled.
	 */
	async onKeyRun(query: string, run: () => Promise<void>): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.message) return;
			if (!this.init.query) throw new Error("Query is not set");
			if (this.init.query.data !== query) return;

			console.log(`Listening for query: ${query}`);
			console.log("Executing associated function...");
			await run();
			this.isRan = true;
		} catch (error) {
			console.error("Error in onQuery method:", error);
		}
	}

	/**
	 * Handles the welcome message when a new user joins the group.
	 * This method sends a welcome message to new users who join the group.
	 * @returns A promise that resolves when the welcome message is sent.
	 */
	async onWelcome(): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const id = this.init.message.from.id.toString();
			const adds = this.init.message.new_chat_members || [];
			if (adds.length === 0) return;

			adds.forEach((user) => {
				if (user.is_bot) return;
				this.send(`Selamat datang ${user.first_name}!`, id);
			});
			this.isRan = true;
		} catch (error) {
			console.error("Error in welcome method:", error);
		}
	}

	/**
	 * Handles the goodbye message when a user leaves the group.
	 * This method sends a goodbye message to users who leave the group.
	 * @returns A promise that resolves when the goodbye message is sent.
	 */
	async onGoodbye(): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const id = this.init.message.from.id.toString();
			const left = this.init.message.left_chat_member;
			if (!left) return;

			if (left.is_bot) return;
			this.send(`Sampai jumpa ${left.first_name}!`, id);
			this.isRan = true;
		} catch (error) {
			console.error("Error in goodbye method:", error);
		}
	}

	/**
	 * Handles AI-related functionality.
	 * This method is a placeholder for AI-related features and can be extended in the future.
	 * @param onlyPrivate If true, the method will only respond to private messages.
	 * @returns A promise that resolves when the AI functionality is executed.
	 */
	async onAi(onlyPrivate: boolean = false): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const id = this.init.message.chat.id.toString();
			const text = this.init.message.text;
			const name = this.init.message.from.first_name;

			if (text.length < 5) return;
			if (onlyPrivate && this.init.message.chat.type !== "private") return;

			console.log(`Listening to prompt: ${text}`);
			const answer = await runAi(text, name);
			await this.send(answer, id);
			this.isRan = true;
		} catch (error) {
			console.error("Error in AI method:", error);
		}
	}

	/**
	 * Handles form submission and processing.
	 * This method is a placeholder for form-related features and can be extended in the future.
	 * @returns A promise that resolves when the form functionality is executed.
	 */
	async onForm(): Promise<void> {
		try {
			if (this.isRan) return;
			if (this.init.query) return;
			if (!this.init.message) throw new Error("Message is not set");

			const user = this.init.message.from;
			const text = this.init.message.text;

			const member: IMember = await getItem("member", { id: user.id });
			if (!member) return;

			if (member.on_progress === "register") {
				const status = member.status;
				if (status === EStatus.EMAIL) {
					if (!isValidEmail(text)) {
						await this.send(
							"Format email tidak valid. Silahkan coba lagi.\n\nContoh:contoh@mail.com"
						);
					} else {
						const id = { id: member.id };
						const expression = "SET #status = :status, #email = :email";
						const names = {
							"#status": "status",
							"#email": "email",
						};
						const values = {
							":status": EStatus.PHONE,
							":email": text,
						};
						await updateItem("member", id, expression, names, values);
						await this.send(
							"Terima kasih! Sekarang, silahkan tulis nomor telepon kamu."
						);
					}
				} else if (status === EStatus.PHONE) {
					if (!isValidIDPhone(text)) {
						await this.send(
							"Format nomor telepon tidak valid. Silahkan coba lagi.\n\nContoh:+6281234567890"
						);
					} else {
						const id = { id: member.id };
						const expression =
							"SET #status = :status, #phone = :phone, #progress = :progress";
						const names = {
							"#status": "status",
							"#phone": "phone_number",
							"#progress": "on_progress",
						};
						const values = {
							":status": EStatus.COMPLETED,
							":phone": text,
							":progress": "",
						};
						await updateItem("member", id, expression, names, values);
						await this.send("Terima kasih! Pendaftaran kamu sudah lengkap.");
					}
				}
			}

			this.isRan = true;
		} catch (error) {
			console.error("Error in onForm method:", error);
		}
	}

	/**
	 * Sends a typing action to the chat.
	 * This method simulates the bot typing in the chat.
	 * @returns A promise that resolves when the typing action is sent.
	 */
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
					`Failed to show typing: ${(await response.json()).description}`
				);
			}
			this.isRan = true;
		} catch (error) {
			console.error("Error in typing method:", error);
		}
	}

	/**
	 * Sends a text message to the chat.
	 * This method sends a text message to the specified chat.
	 * @param text The text message to send.
	 * @param id The chat ID to send the message to. If not provided, it uses the chat ID from the message.
	 * @returns A promise that resolves when the message is sent.
	 */
	async send(text: string, id: string = ""): Promise<void> {
		try {
			const query = this.init.query;
			const message = this.init.message;

			let fromId = "";
			if (id) {
				fromId = id;
			} else if (query) {
				fromId = query.from.id.toString();
			} else if (message) {
				fromId = message.from.id.toString();
			}

			console.log("Preparing to send message:", text);

			await this.typing();
			const formattedText = formatText(text);

			const param = new URLSearchParams({
				chat_id: fromId,
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

	/**
	 * Sends a message with an inline keyboard.
	 * This method sends a message with an inline keyboard to the chat.
	 * @param keyboard The inline keyboard to send.
	 * @param text Optional text to include with the keyboard.
	 * @returns A promise that resolves when the message with the keyboard is sent.
	 */
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

	/**
	 * Edits the inline keyboard of an existing message.
	 * This method updates the inline keyboard of a message based on the provided keyboard layout.
	 * @param keyboard The new inline keyboard to set for the message.
	 * @returns A promise that resolves when the keyboard is edited.
	 */
	async editKey(keyboard: TKeyboards, text: string): Promise<void> {
		try {
			if (!this.init.query) throw new Error("Query is not set");
			if (!this.init.query.message) throw new Error("Message is not set");

			const formattedText = formatText(text);

			const param = new URLSearchParams({
				chat_id: this.init.query.message.chat.id.toString(),
				message_id: this.init.query.message.message_id.toString(),
				text: formattedText,
				parse_mode: "MarkdownV2",
				reply_markup: JSON.stringify({ inline_keyboard: keyboard }),
			});

			const url = `https://api.telegram.org/bot${this.init.token}/editMessageText?`;
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

	/**
	 * Sends a photo to the chat.
	 * This method sends a photo to the specified chat.
	 * @param photoUrl The URL of the photo to send.
	 * @returns A promise that resolves when the photo is sent.
	 */
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

	/**
	 * Sends a document to the chat.
	 * This method sends a document to the specified chat.
	 * @param documentUrl The URL of the document to send.
	 * @returns A promise that resolves when the document is sent.
	 */
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

	/**
	 * Removes a message from the chat.
	 * This method deletes a message from the chat based on the message ID.
	 * @returns A promise that resolves when the message is removed.
	 */
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
