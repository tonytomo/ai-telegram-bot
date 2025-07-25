import "dotenv/config";
import { handler } from "./dist/index.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseArgs } from "node:util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
	const defaultPath = "hello-world.json";

	const { values } = parseArgs({
		args: process.argv.slice(2),
		options: {
			path: {
				type: "string",
				short: "p",
				default: defaultPath,
				description: "Path to the event JSON file",
			},
		},
		strict: true,
	});

	const eventDirectory = path.resolve(__dirname, "src/tests");
	let eventFileName = values.path;

	try {
		const eventPath = path.resolve(__dirname, eventDirectory, eventFileName);
		const event = JSON.parse(fs.readFileSync(eventPath, "utf8"));

		const context = {
			FunctionName: "TelegramBot",
			MemoryLimitInMB: "128",
		};

		console.log("\x1b[1m\x1b[34m--- Invoking Lambda Handler ---\x1b[0m");
		const result = await handler(event, context);
		console.log("\x1b[1m\x1b[32m--- Lambda Handler Result ---\x1b[0m");
		console.log(JSON.stringify(result, null, 2));
	} catch (error) {
		console.error(
			"\x1b[1m\x1b[31m--- Error during Lambda invocation ---\x1b[0m"
		);
		console.error(error);
	}
}

runTest();
