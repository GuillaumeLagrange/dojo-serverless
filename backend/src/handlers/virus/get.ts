import { failure, success } from '@libs/response';
import { Item } from '@libs/types';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk/clients/all';

const params = {
  TableName: 'dojo-serverless-table',
  KeyConditionExpression: 'partitionKey = :Virus',
  ExpressionAttributeValues: {
    ':Virus': 'Virus',
  },
};

export const main: APIGatewayProxyHandler = async () => {
  let dynamoDbClient = new DynamoDB.DocumentClient();

  try {
    const { Items = [] } = await dynamoDbClient.query(params).promise();
    console.log('Success');
    console.log(Items);
    return success({
      viruses: (Items as Item[]).map(item => {
        return {
          id: item.sortKey,
        };
      }),
    });
  } catch (error) {
    console.log(error);
    return failure({
      error: error,
    });
  }
};
