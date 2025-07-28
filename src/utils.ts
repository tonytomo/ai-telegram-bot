export function replaceResponse(
	str: string | undefined,
	key: string,
	value: string | undefined
): string {
	if (!str || !key || !value) return str || "";

	const regex = new RegExp(`%${key}%`, "g");
	return str.replace(regex, value);
}

export function formatMessage(str: string) {
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
