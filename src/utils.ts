import { APIGatewayProxyResultV2 } from "aws-lambda";

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
