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
zip -r newbot.zip dist
```

If you are using **PowerShell**, you can use the following command to create the zip package:

```powershell
Compress-Archive -Path dist\* -DestinationPath newbot.zip -Force
```

3. Deploy the package to AWS Lambda:

```bash
aws lambda update-function-code --function-name newbot --zip-file fileb://newbot.zip
```

You need to replace `newbot` with the name of your Lambda function.

4. Deploy the layer if you are using any external dependencies:

But first, create a layer zip file:

```powershell
Remove-Item -Recurse -Force lambda_layer -ErrorAction SilentlyContinue;

New-Item -ItemType Directory -Path lambda_layer/nodejs/node_modules/@google -Force;
New-Item -ItemType Directory -Path lambda_layer/nodejs/node_modules/google-auth-library -Force;
New-Item -ItemType Directory -Path lambda_layer/nodejs/node_modules/ws -Force;
New-Item -ItemType Directory -Path lambda_layer/nodejs/node_modules/gaxios -Force;
New-Item -ItemType Directory -Path lambda_layer/nodejs/node_modules/gcp-metadata -Force;
New-Item -ItemType Directory -Path lambda_layer/nodejs/node_modules/google-logging-utils -Force;
New-Item -ItemType Directory -Path lambda_layer/nodejs/node_modules/gtoken -Force;
New-Item -ItemType Directory -Path lambda_layer/nodejs/node_modules/extend -Force;

Copy-Item -Recurse -Path node_modules\@google\* -Destination lambda_layer\nodejs\node_modules\@google\;
Copy-Item -Recurse -Path node_modules\google-auth-library\* -Destination lambda_layer\nodejs\node_modules\google-auth-library\;
Copy-Item -Recurse -Path node_modules\ws\* -Destination lambda_layer\nodejs\node_modules\ws\;
Copy-Item -Recurse -Path node_modules\gaxios\* -Destination lambda_layer\nodejs\node_modules\gaxios\;
Copy-Item -Recurse -Path node_modules\gcp-metadata\* -Destination lambda_layer\nodejs\node_modules\gcp-metadata\;
Copy-Item -Recurse -Path node_modules\google-logging-utils\* -Destination lambda_layer\nodejs\node_modules\google-logging-utils\;
Copy-Item -Recurse -Path node_modules\gtoken\* -Destination lambda_layer\nodejs\node_modules\gtoken\;
Copy-Item -Recurse -Path node_modules\extend\* -Destination lambda_layer\nodejs\node_modules\extend\;

Compress-Archive -Path lambda_layer\* -DestinationPath newlayer.zip -Force;

Remove-Item -Recurse -Force lambda_layer;
```

Then, publish the layer:

```bash
aws lambda publish-layer-version --layer-name newlayer --zip-file fileb://newlayer.zip --compatible-runtimes nodejs22.x
```

Then, update the Lambda function to use the new layer:

```bash
aws lambda update-function-configuration --function-name newbot --layers arn:aws:lambda:your-region:your-account-id:layer:newlayer:version
```
Replace `your-region`, `your-account-id`, and `version` with your actual AWS region, account ID, and the version of the layer you just published.

5. Optionally, you can set environment variables for the Lambda function using:

```bash
aws lambda update-function-configuration --function-name newbot --environment "Variables={KEY=VALUE,ANOTHER_KEY=ANOTHER_VALUE}"
```

You need to replace `KEY` and `VALUE` with your actual environment variable names and values.

### Happy Coding!
