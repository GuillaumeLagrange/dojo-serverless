import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB, EventBridge } from 'aws-sdk';

import uuid from 'uuid';
import { success } from '@libs/response';

const documentClient = new DynamoDB.DocumentClient();

const eventBridge = new EventBridge();

export const main: APIGatewayProxyHandler = async () => {
  const virusId = uuid();

  await documentClient
    .put({
      TableName: 'dojo-serverless-table',
      Item: { partitionKey: 'Virus', sortKey: virusId },
    })
    .promise();

  await eventBridge
    .putEvents({
      Entries: [
        {
          Source: 'dojo-serverless',
          DetailType: 'SPREAD_REQUESTED',
          Detail: JSON.stringify({}),
          EventBusName: 'dojo-serverless',
        },
      ],
    })
    .promise();

  return success({ id: virusId });
};
