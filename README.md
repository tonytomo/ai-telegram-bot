# AI Gen Bot

This is a bot that generates AI responses based on the input provided. It is designed to be used in various applications where AI-generated content is needed.

## Features

- Generates AI responses based on user input
- Supports multiple input formats
- Configurable response settings

## Installation

To install the AI Gen Bot, clone the repository and install the required dependencies:

```powershell
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
- `@google/genai`: Google GenAI client library for generating AI responses.

## How to Contribute

If you want to contribute to the AI Gen Bot, only edit the files in the `src` directory. The project uses TypeScript, so make sure to write your code in TypeScript. The `src` directory contains all the source files below:

- `index.ts`: The main entry point for the bot.
- `bot.ts`: Contains the core logic of the bot.
- `utils.ts`: Utility functions used by the bot.
- `ai.ts`: Contains the AI generation logic.
- `tests/`: Contains test files to ensure the bot works correctly.
- `constants/`: Contains constant values used throughout the bot.
- `types/`: Contains TypeScript type definitions for the bot.

## Build

To build the project, run the following command:

```powershell
npm run build
```

You will get a `dist` folder with the compiled code.

## Testing

After building the project, you can run the tests to ensure everything is working correctly:

```powershell
node test.mjs -p test-event.json
```

You can change the `test-event.json` file to test different scenarios. If you want to add more tests, create new files in the `tests` directory and follow the existing test structure.

## AWS Lambda Deployment

To deploy the AI Gen Bot to AWS Lambda, follow these steps:

### Before Starting

Ensure you already these prerequisites:

- AWS CLI installed and configured with your credentials.
- You have created a Lambda function named `newbot` (or any name you prefer).

### Code Packaging

First, you need to package your code into a zip file that AWS Lambda can use. This includes the compiled code from the `dist` directory and any necessary dependencies.

I assume that you are using **PowerShell**, but if you are using a different shell, the command might differ slightly. In PowerShell, you can use the following command to create a zip package:

```powershell
Compress-Archive -Path dist\* -DestinationPath newbot.zip -Force
```

### Code Deployment

Deploy the package to AWS Lambda:

```powershell
aws lambda update-function-code --function-name newbot --zip-file fileb://newbot.zip
```

You need to replace `newbot` with the name of your Lambda function.

### Layers Deployment

You need layers to include the `@google/genai` package in your Lambda function. Layers allow you to manage your dependencies separately from your function code, making it easier to update and maintain.

To create a layer, first, create new project outside this repository, for example, `newlayer`:

```powershell
# Back to the root directory
cd ..

# Make a new directory for the layer
New-Item -ItemType Directory -Name newlayer
cd newlayer

# Initialize a new Node.js project
npm init -y

# Install the dependencies you need for the layer
npm install @google/genai
```

After installing the dependencies, you just need to package them into a zip file.

```powershell
Compress-Archive -Path .\* -DestinationPath newlayer.zip -Force;
```

Then, publish the layer:

```powershell
aws lambda publish-layer-version --layer-name newlayer --zip-file fileb://newlayer.zip --compatible-runtimes nodejs22.x
```

Then, update the Lambda function to use the new layer:

```powershell
aws lambda update-function-configuration --function-name newbot --layers arn:aws:lambda:your-region:your-account-id:layer:newlayer:version
```

Replace `your-region`, `your-account-id`, and `version` with your actual AWS region, account ID, and the version of the layer you just published.

If you want to update the layer later, you can create a new version of the layer by running the `publish-layer-version` command again with the updated code. Just remember to update the Lambda function configuration to use the new layer `version`.

### Configuration

You can set environment variables for the Lambda function using:

```powershell
aws lambda update-function-configuration --function-name newbot --environment "Variables={KEY=VALUE,ANOTHER_KEY=ANOTHER_VALUE}"
```

You need to replace `KEY` and `VALUE` with your actual environment variable names and values.

### Happy Coding! ¯\\_(ツ)_/¯
