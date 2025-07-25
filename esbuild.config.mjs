import { build } from "esbuild";

build({
	entryPoints: ["src/index.ts"], // Your Lambda entry point
	bundle: true,
	platform: "node",
	target: "es2022", // Match your tsconfig target
	format: "esm", // Crucial for ES modules
	outfile: "dist/index.mjs", // Output as .mjs
	external: [], // List any modules you want to keep external (e.g., AWS SDK v3, if you're using layers)
	minify: true,
	sourcemap: true,
}).catch(() => process.exit(1));
