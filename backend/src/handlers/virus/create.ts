import { success } from '@libs/response';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import uuid from 'uuid';
// import { sendMessageToEachConnection } from '../real-time/sendMessageToClient';

const documentClient = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async () => {
  const virusId = uuid();

  await documentClient
    .put({
      TableName: 'dojo-serverless-table',
      Item: { partitionKey: 'Virus', sortKey: virusId },
    })
    .promise();

  // sendMessageToEachConnection({ id: virusId });

  return success({ id: virusId });
};
