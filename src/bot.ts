import { runAi } from "./ai";
import { getItem, insertItem, updateItem } from "./db";
import { TKeyboards } from "./types/keyboard";
import { IMember } from "./types/member";
import { IInit, IUser } from "./types/message";
import { checkSwears, formatText, getNewMember } from "./utils";

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
	isRan: boolean;
	isKey: boolean;
	isText: boolean;
	isPrivate: boolean;
	news: IUser[] | undefined;
	left: IUser | undefined;
	text: string | undefined;
	data: string | undefined;
	member: IMember | null;
	user: IUser | undefined;

	constructor(init: IInit) {
		this.init = init;
		this.isRan = false;
		this.isKey = init.query ? true : false;
		this.isText = init.message ? true : false;
		this.isPrivate = init.message
			? init.message.chat.type === "private"
			: false;
		this.news = init.message ? init.message.new_chat_members : undefined;
		this.left = init.message ? init.message.left_chat_member : undefined;
		this.text = init.message ? init.message.text : undefined;
		this.data = init.query ? init.query.data : undefined;
		this.member = init.member;
		this.user = init.message
			? init.message.from
			: init.query
			? init.query.from
			: undefined;
	}

	/**
	 * Handles a specific text message event.
	 * This method listens for a specific text message and executes the provided function when the text matches.
	 * @param text The text to listen for.
	 * @param run The function to execute when the text matches.
	 * @returns A promise that resolves when the event is handled.
	 */
	async on(text: string, run: () => Promise<void>) {
		try {
			if (this.isRan || !this.isText) return;
			console.log(`➡️ on "${text}"`);
			await run();
			this.isRan = true;
		} catch (error) {
			console.error(`🟥 ERROR on "${text}":`, error);
		}
	}

	/**
	 * Handles the /start command.
	 * This method listens for the /start command and sends a welcome message.
	 * @returns A promise that resolves when the welcome message is sent.
	 */
	async onStart(): Promise<void> {
		try {
			if (this.isRan || !this.text || !this.user) return;
			if (!["/start", "/mulai"].includes(this.text)) return;
			console.log('➡️ on "/start"');
			const name = this.user.first_name;
			if (!this.member) {
				await this.send(
					`Halo ${name}! Selamat datang, ${name}!\nSebelum memulai, silahkan membaca ketentuan kami di bawah ini:\n[Syarat dan Ketentuan](https://...)\n[Kebijakan Privasi](https://...)`,
					[[{ text: "Saya sudah membaca", callback_data: "read" }]]
				);
			} else {
				await this.send(
					`Halo ${name}!\nApa yang ingin kamu lakukan hari ini?`,
					[
						[
							{ text: "Tanya AI", callback_data: "ai" },
							{ text: "Buka Profil", callback_data: "profile" },
						],
						[
							{ text: "Gabung Kelas", callback_data: "join" },
							{ text: "Kelasmu", callback_data: "classes" },
						],
					]
				);
			}

			this.isRan = true;
		} catch (error) {
			console.error(`🟥 ERROR on "/start":`, error);
		}
	}

	/**
	 * Handles a specific callback query event sent by the user from an inline keyboard.
	 * This method listens for a specific callback query and executes the provided function when the query matches.
	 * @param query The callback query data to listen for.
	 * @param run The function to execute when the query matches.
	 * @returns A promise that resolves when the event is handled.
	 */
	async onKey(query: string, run: () => Promise<void>): Promise<void> {
		try {
			if (this.isRan || !this.isKey) return;

			console.log(`➡️ in onKey "${query}"`);
			await run();
			this.isRan = true;
		} catch (error) {
			console.error("🟥 ERROR in onKey:", error);
		}
	}

	/**
	 * Handles the welcome message when a new user joins the group.
	 * This method sends a welcome message to new users who join the group.
	 * @returns A promise that resolves when the welcome message is sent.
	 */
	async onWelcome(): Promise<void> {
		try {
			if (this.isRan || !this.news) return;
			if (this.news.length === 0) return;
			console.log("➡️ in onWelcome");
			this.news.forEach(async (user) => {
				if (user.is_bot) return;
				// Placeholder for future welcome message
			});
			this.isRan = true;
		} catch (error) {
			console.error("🟥 ERROR in onWelcome:", error);
		}
	}

	/**
	 * Handles the goodbye message when a user leaves the group.
	 * This method sends a goodbye message to users who leave the group.
	 * @returns A promise that resolves when the goodbye message is sent.
	 */
	async onGoodbye(): Promise<void> {
		try {
			if (this.isRan || !this.left) return;
			console.log("➡️ in onGoodbye");
			if (this.left.is_bot) return;
			// Placeholder for future goodbye message
			this.isRan = true;
		} catch (error) {
			console.error("🟥 ERROR in onGoodbye:", error);
		}
	}

	/**
	 * Handles AI-related functionality.
	 * This method is a placeholder for AI-related features and can be extended in the future.
	 * @param onlyPrivate If true, the method will only respond to private messages.
	 * @returns A promise that resolves when the AI functionality is executed.
	 */
	async onAi(): Promise<void> {
		try {
			if (this.isRan || !this.isText || !this.text || !this.user) return;
			if (!this.isPrivate || !this.member) return;
			if (this.member.on_progress !== "ask_ai") return;
			if (this.member.credits < 1) {
				return await this.send(
					"Maaf, kredit kamu tidak mencukupi untuk menggunakan layanan AI. Silahkan top up kredit kamu terlebih dahulu."
				);
			}

			console.log(`➡️ in onAi "${this.text}"`);
			const answer = await runAi(this.text, this.user.first_name);
			if (!answer) return;
			const newCredits = this.member.credits - 1;
			const key = { id: this.user.id };
			await updateItem("member", key, { credits: newCredits });
			await this.send(answer);
			this.isRan = true;
		} catch (error) {
			console.error(`🟥 ERROR in onAi:"${this.text}"`, error);
		}
	}

	/**
	 * Handles form submission and processing.
	 * This method is a placeholder for form-related features and can be extended in the future.
	 * @returns A promise that resolves when the form functionality is executed.
	 */
	async onForm(form: string, run: () => Promise<void>): Promise<void> {
		try {
			if (this.isRan || !this.isText || !this.text || !this.user) return;
			if (!this.member) return;
			if (this.member.on_progress !== form) return;

			// Placeholder for form processing logic
			console.log(`➡️ in onForm "${form}"`);
			await run();
			this.isRan = true;
		} catch (error) {
			console.error("🟥 ERROR in onForm:", error);
		}
	}

	/**
	 * Sends a typing action to the chat.
	 * This method simulates the bot typing in the chat.
	 * @returns A promise that resolves when the typing action is sent.
	 */
	async typing(): Promise<void> {
		try {
			if (!this.isText) return;
			console.log("➡️ in typing");

			const param = new URLSearchParams({
				chat_id: this.user ? this.user.id.toString() : "",
				action: "typing",
			});
			const url = `https://api.telegram.org/bot${this.init.token}/sendChatAction?`;
			const response = await fetch(url + param.toString());

			if (!response.ok) {
				const error = await response.json();
				throw new Error(`Failed to show typing: ${error.description}`);
			}
		} catch (error) {
			console.error("🟥 ERROR in typing:", error);
		}
	}

	/**
	 * Sends a text message to the chat.
	 * This method sends a text message to the specified chat.
	 * @param text The text message to send.
	 * @param id The chat ID to send the message to. If not provided, it uses the chat ID from the message.
	 * @returns A promise that resolves when the message is sent.
	 */
	async send(text: string, keyboard: TKeyboards = []): Promise<void> {
		try {
			const query = this.init.query;
			const message = this.init.message;

			let id: string = "";
			if (query) id = query.from.id.toString();
			else if (message) id = message.from.id.toString();
			else throw new Error("Neither query nor message is set");

			await this.typing();
			const formattedText = formatText(text);

			console.log("➡️ in send:", { id, text: formattedText, keyboard });
			const param = new URLSearchParams({
				chat_id: id,
				text: formattedText,
				parse_mode: "MarkdownV2",
				reply_markup: JSON.stringify({ inline_keyboard: keyboard }),
			});

			const url = `https://api.telegram.org/bot${this.init.token}/sendMessage?`;
			const response = await fetch(url + param.toString());

			if (!response.ok) {
				const error = await response.json();
				throw new Error(`Failed to send message: ${error.description}`);
			}
		} catch (error) {
			console.error("🟥 ERROR in send:", error);
		}
	}

	/**
	 * Edits the inline keyboard of an existing message.
	 * This method updates the inline keyboard of a message based on the provided keyboard layout.
	 * @param keyboard The new inline keyboard to set for the message.
	 * @returns A promise that resolves when the keyboard is edited.
	 */
	async edit(text: string, keyboard: TKeyboards = []): Promise<void> {
		try {
			const query = this.init.query;
			const message = this.init.message;

			let id: string = "";
			let msgId: string = "";
			if (query) {
				id = query.from.id.toString();
				msgId = query.message ? query.message.message_id.toString() : "";
			} else if (message) {
				id = message.from.id.toString();
				msgId = message.message_id.toString();
			} else {
				throw new Error("Neither query nor message is set");
			}

			const formattedText = formatText(text);

			console.log("➡️ in edit:", { id, msgId, text: formattedText, keyboard });
			const param = new URLSearchParams({
				chat_id: id,
				message_id: msgId,
				text: formattedText,
				parse_mode: "MarkdownV2",
				reply_markup: JSON.stringify({ inline_keyboard: keyboard }),
			});

			const url = `https://api.telegram.org/bot${this.init.token}/editMessageText?`;
			const response = await fetch(url + param.toString());

			if (!response.ok) {
				const error = await response.json();
				throw new Error(`Failed to edit message: ${error.description}`);
			}
		} catch (error) {
			console.error("🟥 ERROR in edit:", error);
		}
	}

	/**
	 * Removes a message from the chat.
	 * This method deletes a message from the chat based on the message ID.
	 * @returns A promise that resolves when the message is removed.
	 */
	async remove(): Promise<void> {
		try {
			const query = this.init.query;
			const message = this.init.message;

			let id: string = "";
			let msgId: string = "";
			if (query) {
				id = query.from.id.toString();
				msgId = query.message ? query.message.message_id.toString() : "";
			} else if (message) {
				id = message.from.id.toString();
				msgId = message.message_id.toString();
			} else {
				throw new Error("Neither query nor message is set");
			}

			console.log("➡️ in remove:", { id, msgId });
			const param = new URLSearchParams({
				chat_id: id,
				message_id: msgId,
			});

			const url = `https://api.telegram.org/bot${this.init.token}/deleteMessage?`;
			const response = await fetch(url + param.toString());

			if (!response.ok) {
				const error = await response.json();
				throw new Error(`Failed to delete message: ${error.description}`);
			}
		} catch (error) {
			console.error("🟥 ERROR in remove:", error);
		}
	}

	/**
	 * Registers a user in the database.
	 * This method adds a new user to the database if they are not already registered.
	 * @returns A promise that resolves to the user object if registration is successful, or null if the user is already registered or an error occurs.
	 */
	async register(): Promise<void> {
		try {
			const query = this.init.query;
			const message = this.init.message;

			let id: number | null = null;
			let user: IUser | null = null;
			if (query) {
				id = query.from.id;
				user = query.from;
			} else if (message) {
				id = message.from.id;
				user = message.from;
			} else throw new Error("Neither query nor message is set");

			if (this.member) return;

			console.log("➡️ in register:", { id, user });
			const newMember = getNewMember(user);
			await insertItem("member", newMember);
		} catch (error) {
			console.error("🟥 ERROR in register:", error);
		}
	}

	/**
	 * Handles swear words detection in messages.
	 * This method checks the message text for swear words and responds if any are found.
	 * @returns A promise that resolves when the swear word check is complete.
	 */
	async filter(): Promise<void> {
		try {
			if (this.isRan || !this.isText || !this.text) return;

			const text = this.text;
			console.log(`➡️ in onSwear "${text}"`);
			if (checkSwears(text)) await this.remove();
		} catch (error) {
			console.error("🟥 ERROR in onSwear:", error);
		}
	}

	/**
	 * Updates the progress status of a member in the database.
	 * This method updates the 'on_progress' field of a member's record in the database.
	 * @param progress The new progress status to set for the member.
	 * @param id The ID of the member whose progress status is to be updated.
	 * @returns A promise that resolves when the progress status is updated.
	 */
	async setProgress(progress: string): Promise<void> {
		try {
			let id: number;
			if (this.init.query) {
				id = this.init.query.from.id;
			} else if (this.init.message) {
				id = this.init.message.from.id;
			} else {
				throw new Error("Neither query nor message is set");
			}

			if (!this.member) return;

			console.log("➡️ in setProgress:", { id, progress });
			await updateItem("member", { id }, { on_progress: progress });
		} catch (error) {
			console.error("🟥 ERROR in setProgress:", error);
		}
	}
}
