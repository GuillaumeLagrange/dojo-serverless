// @ts-nocheck
import { DynamoDBStreamEvent } from 'aws-lambda';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { getAllConnections } from '@libs/connections';
import { sendMessageToConnection } from '@libs/websocket';
import { Item } from '@libs/types';
import { Virus } from '../virus/types';

export const sendMessageToEachConnection = async (
  message: any,
): Promise<void> => {
  const connections = await getAllConnections();
  await Promise.all(
    connections.map(({ connectionId, endpoint }) => {
      return sendMessageToConnection({ connectionId, endpoint, message });
    }),
  );
};

const isVirus = (item: Item): item is Virus => item.partitionKey === 'Virus';

export const main = async (event: DynamoDBStreamEvent): Promise<void> => {
  console.log(event);

  await Promise.all(
    event.Records.map(record => {
      if (record.eventName === 'INSERT') {
        const Item = Converter.unmarshall(record.dynamodb.NewImage);
        if (Item.partitionKey === 'Virus') {
          return sendMessageToEachConnection({ addId: Item.sortKey });
        }
      } else if (record.eventName === 'REMOVE') {
        const Item = Converter.unmarshall(record.dynamodb.OldImage);
        if (Item.partitionKey === 'Virus') {
          return sendMessageToEachConnection({ removeId: Item.sortKey });
        }
      }
    }),
  );
};
