export interface IMember {
	id: number;
	username: string;
	name: string;
	level: ELevel;
	score: number;
	credits: number;
	on_progress: string;
	joined_at: number;
	is_active: boolean;
}

export enum ELevel {
	IRON = "iron",
	BRONZE = "bronze",
	SILVER = "silver",
	GOLD = "gold",
	PLATINUM = "platinum",
	DIAMOND = "diamond",
}
