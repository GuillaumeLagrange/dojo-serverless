import { failure, success } from '@libs/response';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk/clients/all';
import uuid from 'uuid';

export const main: APIGatewayProxyHandler = async () => {
  let dynamoDbClient = new DynamoDB.DocumentClient();
  let virusId = uuid();

  const params = {
    TableName: 'dojo-serverless-table',
    Item: {
      partitionKey: 'Virus',
      sortKey: virusId,
    },
  };

  console.log(params);

  try {
    await dynamoDbClient.put(params).promise();
    return success({
      id: virusId,
    });
  } catch (error) {
    console.log(error);
    return failure({
      error: error,
    });
  }
};
