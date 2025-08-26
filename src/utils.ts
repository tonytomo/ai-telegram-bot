import { APIGatewayProxyResultV2 } from "aws-lambda";
import swearWords from "./constants/swearword.json";
import { IUser } from "./types/message";
import { EMemberPlan, EStatus, IMember } from "./types/member";

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

export function newMember(member: IUser): IMember {
	return {
		id: member.id,
		username: member.username || "",
		first_name: member.first_name || "",
		last_name: member.last_name || "",
		phone_number: "",
		email: "",
		status: EStatus.EMAIL,
		on_progress: "register",
		plan: EMemberPlan.FREE,
		joined_at: Math.floor(Date.now() / 1000),
		is_active: true,
	};
}

export function isValidEmail(email: string): boolean {
	const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return regex.test(email);
}

export function isValidIDPhone(idPhone: string): boolean {
	const regex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
	return regex.test(idPhone);
}
