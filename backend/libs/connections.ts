// @ts-nocheck
import { DynamoDB } from 'aws-sdk';
import { Item } from './types';

interface Connection extends Item {
  partitionKey: 'Connection';
  endpoint: string;
}

const documentClient = new DynamoDB.DocumentClient();

export const createConnection = async (
  connectionId: string,
  endpoint: string,
): Promise<void> => {
  return documentClient
    .put({
      TableName: 'dojo-serverless-table',
      Item: {
        partitionKey: 'Connection',
        sortKey: connectionId,
        endpoint: endpoint,
      },
    })
    .promise();
};

export const deleteConnection = async (connectionId: string): Promise<void> => {
  return documentClient
    .delete({
      TableName: 'dojo-serverless-table',
      Key: { partitionKey: 'Connection', sortKey: connectionId },
    })
    .promise();
};

export const getAllConnections = async (): Promise<
  { connectionId: string; endpoint: string }[]
> => {
  const { Items = [] } = await documentClient
    .query({
      TableName: 'dojo-serverless-table',
      KeyConditionExpression: 'partitionKey = :partitionKey',
      ExpressionAttributeValues: { ':partitionKey': 'Connection' },
    })
    .promise();

  return (Items as Connection[]).map(({ sortKey, endpoint }) => ({
    connectionId: sortKey,
    endpoint,
  }));
};
