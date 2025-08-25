import { build } from "esbuild";

build({
	entryPoints: ["src/index.ts"], // Your Lambda entry point
	bundle: true,
	platform: "node",
	target: "es2022", // Match your tsconfig target
	format: "esm", // Crucial for ES modules
	outfile: "dist/index.mjs", // Output as .mjs
	minify: true,
	sourcemap: true,
	external: [
		"@google/genai", // Mark @google/genai as external
		"@aws-sdk/*", // AWS SDK is available in the Lambda runtime
	],
}).catch(() => process.exit(1));
