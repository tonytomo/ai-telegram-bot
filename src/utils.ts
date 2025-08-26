import { APIGatewayProxyResultV2 } from "aws-lambda";
import swearWords from "./constants/swearword.json";
import { IUser } from "./types/message";
import { ELevel, IMember } from "./types/member";
import { getItem } from "./db";

export function replaceText(
	str: string | undefined,
	key: string,
	value: string | undefined
): string {
	if (!str || !key || !value) return str || "";

	const regex = new RegExp(`%${key}%`, "g");
	return str.replace(regex, value);
}

export function formatText(str: string) {
	console.log("\x1b[1m\x1b[34mFormatting message:\x1b[0m");
	console.log("Original message:", str);

	const specialChars = ["~", "#", "+", "-", "=", "(", ")", "{", "}", ".", "!"];

	const escapedChars = specialChars
		.map((char) => {
			if ([".", "+", "?", "^", "$", "{", "}", "(", ")", "\\"].includes(char)) {
				return "\\" + char;
			}
			return char;
		})
		.join("|");

	const regex = new RegExp(`(${escapedChars})`, "g");
	const result = str.replace(regex, "\\$1");

	console.log("Formatted message:", result);

	return result;
}

export function checkSwears(text: string): boolean {
	for (const word of swearWords.list) {
		const regex = new RegExp(`\\b${word}\\b`, "i");
		if (regex.test(text)) {
			console.log(`\x1b[31mSwear word detected:\x1b[0m ${word}`);
			return true;
		}
	}
	return false;
}

export function response(
	statusCode: number,
	body: Record<string, any>
): APIGatewayProxyResultV2 {
	return {
		headers: { "Content-Type": "application/json" },
		statusCode,
		body: JSON.stringify(body),
	};
}

export function getNewMember(user: IUser): IMember {
	return {
		id: user.id,
		username: user.username || "",
		name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
		level: ELevel.IRON,
		score: 0,
		credits: 1000,
		on_progress: "starting",
		joined_at: Math.floor(Date.now() / 1000),
		is_active: false,
	};
}

export async function isMember(user: IUser | null): Promise<IMember | null> {
	if (!user) return null;
	const joinedMember: IMember = await getItem("member", { id: user.id });
	if (!joinedMember) return null;
	return joinedMember;
}
