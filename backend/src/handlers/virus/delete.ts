import { failure, success } from '@libs/response';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk/clients/all';

export const main: APIGatewayProxyHandler = async event => {
  let dynamoDbClient = new DynamoDB.DocumentClient();

  if (!event.pathParameters || !event.pathParameters.id) {
    return failure({
      error: 'Incorrect path parameters',
    });
  }

  const params = {
    TableName: 'dojo-serverless-table',
    Key: {
      partitionKey: 'Virus',
      sortKey: event.pathParameters.id,
    },
  };

  try {
    await dynamoDbClient.delete(params).promise();
    return success({ id: event.pathParameters.id });
  } catch (error) {
    console.log(error);
    return failure({
      error: error,
    });
  }
};
