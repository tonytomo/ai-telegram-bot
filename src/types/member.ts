export interface IMember {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	phone_number: string;
	email: string;
	status: EStatus;
	on_progress: string;
	plan: EMemberPlan;
	joined_at: number;
	is_active: boolean;
}

export enum EMemberPlan {
	FREE = "free",
	PRO = "pro",
	ENTERPRISE = "enterprise",
}

export enum EStatus {
	EMAIL = "fill_email",
	PHONE = "fill_phone",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
}
