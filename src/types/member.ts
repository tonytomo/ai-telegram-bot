export interface IMember {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	phone_number: string;
	email: string;
	state: TMemberState;
	plan: EMemberPlan;
	joined_at: number;
	is_active: boolean;
}

export enum EMemberPlan {
	FREE = "free",
	PRO = "pro",
	ENTERPRISE = "enterprise",
}

export type TMemberState = ERegisterState | EQuizState;

export enum ERegisterState {
	START = "register_starting",
	ASK_EMAIL = "ask_email",
	ASK_PHONE = "ask_phone",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
}

export enum EQuizState {
	START = "quiz_starting",
	ASK_QUESTION = "ask_question",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
}
