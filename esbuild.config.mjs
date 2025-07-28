import { build } from "esbuild";

build({
	entryPoints: ["src/index.ts"], // Your Lambda entry point
	bundle: true,
	platform: "node",
	target: "es2022", // Match your tsconfig target
	format: "esm", // Crucial for ES modules
	outfile: "dist/index.mjs", // Output as .mjs
	external: ["@google/genai"], // Mark @google/genai as external
	minify: true,
	sourcemap: true,
}).catch(() => process.exit(1));
