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
		console.error("Error while scanning items:", err);
		return [];
	}
}

export async function getItem(
	tableName: string,
	key: Record<string, any>
): Promise<any | null> {
	try {
		const data = await db.send(
			new GetCommand({ TableName: tableName, Key: key })
		);
		return data.Item || null;
	} catch (err) {
		console.error("Error while getting item:", err);
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
		console.error("Error while querying items by index:", err);
		return [];
	}
}

export async function getItemByAttribute(
	tableName: string,
	attributeName: string,
	attributeValue: any
): Promise<any[]> {
	try {
		const data = await db.send(
			new ScanCommand({
				TableName: tableName,
				FilterExpression: "#attr = :value",
				ExpressionAttributeNames: { "#attr": attributeName },
				ExpressionAttributeValues: { ":value": attributeValue },
			})
		);
		return data.Items || [];
	} catch (err) {
		console.error("Error while querying items by attribute:", err);
		return [];
	}
}

export async function insertItem(
	tableName: string,
	item: Record<string, any>
): Promise<boolean> {
	try {
		await db.send(new PutCommand({ TableName: tableName, Item: item }));
		return true;
	} catch (err) {
		console.error("Error while putting item:", err);
		return false;
	}
}

export async function updateItem(
	tableName: string,
	key: Record<string, any>,
	updateExpression: string,
	expressionAttributeValues: Record<string, any>
): Promise<boolean> {
	try {
		await db.send(
			new UpdateCommand({
				TableName: tableName,
				Key: key,
				UpdateExpression: updateExpression,
				ExpressionAttributeValues: expressionAttributeValues,
			})
		);
		return true;
	} catch (err) {
		console.error("Error while updating item:", err);
		return false;
	}
}

export async function deleteItem(
	tableName: string,
	key: Record<string, any>
): Promise<boolean> {
	try {
		await db.send(new DeleteCommand({ TableName: tableName, Key: key }));
		return true;
	} catch (err) {
		console.error("Error while deleting item:", err);
		return false;
	}
}
