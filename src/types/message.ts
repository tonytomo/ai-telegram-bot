import { IMember } from "./member";

export interface IInit {
	token: string;
	message: IMessage | null;
	query: ICallbackQuery | null;
	member: IMember | null;
}

export interface ICallbackQuery {
	id: string;
	message?: IMessage;
	from: IUser;
	data?: string;
}

export interface IMessage {
	message_id: number;
	text: string;
	from: IUser;
	date: number;
	chat: IChat;
	reply_to_message?: IMessage;
	new_chat_members?: IUser[];
	left_chat_member?: IUser;
}

export interface IUser {
	id: number;
	is_bot: boolean;
	first_name: string;
	last_name?: string;
	username?: string;
}

export interface IChat {
	id: number;
	type: string;
	title?: string;
	username?: string;
	first_name?: string;
	last_name?: string;
}
