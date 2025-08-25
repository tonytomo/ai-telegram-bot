export interface IMember {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	phone_number: string;
	email: string;
	status: TMemberStatus;
	plan: EMemberPlan;
	joined_at: number;
	is_active: boolean;
}

export enum EMemberPlan {
	FREE = "free",
	PRO = "pro",
	ENTERPRISE = "enterprise",
}

export type TMemberStatus = ERegisterStatus | EQuizStatus;

export enum ERegisterStatus {
	START = "register_starting",
	EMAIL = "email_filled",
	PHONE = "phone_filled",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
}

export enum EQuizStatus {
	START = "quiz_starting",
	ASK_QUESTION = "ask_question",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
}
