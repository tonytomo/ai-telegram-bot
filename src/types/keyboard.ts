export interface IKeyboardButton {
	text: string;
	callback_data?: string;
	url?: string;
}

export type TKeyboards = Array<Array<IKeyboardButton>>;
