export interface IMessage {
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
