# AI Gen Bot

This is a bot that generates AI responses based on the input provided. It is designed to be used in various applications where AI-generated content is needed.

## Features

- Generates AI responses based on user input
- Supports multiple input formats
- Configurable response settings

## Installation

To install the AI Gen Bot, clone the repository and install the required dependencies:

```bash
git clone this-repo-url
cd this-repo
npm install
```

## Pre-requisites

Before running the bot, ensure you have the following:

- Node.js installed (version 14.x or higher)
- AWS CLI configured with your credentials if you plan to deploy it to AWS Lambda
- TypeScript installed globally (optional, for development)

## Dependencies

This project uses the following dependencies:

- `dotenv`: For managing environment variables in development.
- `typescript`: For writing the bot in TypeScript.
- `@types/aws-lambda`: Type definitions for AWS Lambda.
- `@types/node`: Type definitions for Node.js.
- `esbuild`: For building the TypeScript code.

## How to Contribute

If you want to contribute to the AI Gen Bot, only edit the files in the `src` directory. The project uses TypeScript, so make sure to write your code in TypeScript. The `src` directory contains all the source files below:

- `index.ts`: The main entry point for the bot.
- `config.ts`: Configuration settings for the bot.
- `utils.ts`: Utility functions used by the bot.
- `tests/`: Contains test files to ensure the bot works correctly.

## Build

To build the project, run the following command:

```bash
npm run build
```

You will get a `dist` folder with the compiled code.

## Testing

After building the project, you can run the tests to ensure everything is working correctly:

```bash
node test.mjs -p test-event.json
```

You can change the `test-event.json` file to test different scenarios.

## AWS Lambda Deployment

To deploy the AI Gen Bot to AWS Lambda, follow these steps:

1. Ensure you have the AWS CLI installed and configured.
2. Package the application:

```bash
zip -r ai-gen-bot.zip dist
```

If you are using **PowerShell**, you can use the following command to create the zip package:

```powershell
Compress-Archive -Path dist\* -DestinationPath ai-gen-bot.zip
```

3. Deploy the package to AWS Lambda:

```bash
aws lambda update-function-code --function-name ai-gen-bot --zip-file fileb://ai-gen-bot.zip
```

You need to replace `ai-gen-bot` with the name of your Lambda function.

4. Optionally, you can set environment variables for the Lambda function using:

```bash
aws lambda update-function-configuration --function-name ai-gen-bot --environment "Variables={KEY=VALUE}"
```

You need to replace `KEY` and `VALUE` with your actual environment variable names and values.

### Happy Coding!
