import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
	DeleteCommand,
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	ScanCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export async function getItems(tableName: string): Promise<any[]> {
	try {
		const data = await db.send(new ScanCommand({ TableName: tableName }));
		return data.Items || [];
	} catch (err) {
		console.error("🟥 ERROR while scanning items:", err);
		return [];
	}
}

export async function getItem(
	tableName: string,
	key: Record<string, any>
): Promise<any | null> {
	try {
		console.log(`➡️ Getting item from ${tableName} with key:`, key);
		const data = await db.send(
			new GetCommand({ TableName: tableName, Key: key })
		);
		return data.Item || null;
	} catch (err) {
		console.error("🟥 ERROR while getting item:", err);
		return null;
	}
}

export async function getItemByIndex(
	tableName: string,
	indexName: string,
	keyName: string,
	keyValue: any
): Promise<any[]> {
	try {
		console.log(
			`➡️ Querying items from ${tableName} where ${keyName} = ${keyValue} using index ${indexName}`
		);
		const data = await db.send(
			new ScanCommand({
				TableName: tableName,
				FilterExpression: "#key = :value",
				ExpressionAttributeNames: { "#key": keyName },
				ExpressionAttributeValues: { ":value": keyValue },
				IndexName: indexName,
			})
		);
		return data.Items || [];
	} catch (err) {
		console.error("🟥 ERROR while querying items by index:", err);
		return [];
	}
}

export async function getItemsByAttribute(
	tableName: string,
	attributeName: string,
	attributeValue: any,
	limit = 1
): Promise<any[]> {
	try {
		console.log(
			`➡️ Querying items from ${tableName} where ${attributeName} = ${attributeValue} with limit ${limit}`
		);
		const data = await db.send(
			new ScanCommand({
				TableName: tableName,
				FilterExpression: "#attr = :value",
				ExpressionAttributeNames: { "#attr": attributeName },
				ExpressionAttributeValues: { ":value": attributeValue },
				Limit: limit,
			})
		);
		return data.Items || [];
	} catch (err) {
		console.error("🟥 ERROR while querying items by attribute:", err);
		return [];
	}
}

export async function insertItem(
	tableName: string,
	item: Record<string, any>
): Promise<boolean> {
	try {
		console.log(`➡️ Inserting item into ${tableName}:`, item);
		await db.send(new PutCommand({ TableName: tableName, Item: item }));
		return true;
	} catch (err) {
		console.error("🟥 ERROR while putting item:", err);
		return false;
	}
}

export async function updateItem(
	tableName: string,
	key: Record<string, any>,
	newAttr: Record<string, any>
): Promise<boolean> {
	try {
		console.log(`➡️ Updating item in ${tableName} with key:`, key);

		let updateExpression: string = "set ";
		let expressionAttributeNames: Record<string, string> = {};
		let expressionAttributeValues: Record<string, any> = {};

		Object.keys(newAttr).forEach((attr, idx) => {
			if (idx > 0) {
				updateExpression += ", ";
			}
			const attrNameKey = `#${attr}`;
			const attrValueKey = `:${attr}`;
			updateExpression += `${attrNameKey} = ${attrValueKey}`;
			expressionAttributeNames[attrNameKey] = attr;
			expressionAttributeValues[attrValueKey] = newAttr[attr];
		});

		await db.send(
			new UpdateCommand({
				TableName: tableName,
				Key: key,
				UpdateExpression: updateExpression,
				ExpressionAttributeNames: expressionAttributeNames,
				ExpressionAttributeValues: expressionAttributeValues,
			})
		);
		return true;
	} catch (err) {
		console.error("🟥 ERROR while updating item:", err);
		return false;
	}
}

export async function deleteItem(
	tableName: string,
	key: Record<string, any>
): Promise<boolean> {
	try {
		console.log(`Deleting item from ${tableName} with key:`, key);
		await db.send(new DeleteCommand({ TableName: tableName, Key: key }));
		return true;
	} catch (err) {
		console.error("🟥 ERROR while deleting item:", err);
		return false;
	}
}
