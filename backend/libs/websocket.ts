// @ts-nocheck
import { APIGatewayEventRequestContext } from 'aws-lambda';
import { ApiGatewayManagementApi } from 'aws-sdk';
import { deleteConnection } from '@libs/connections';

interface WebSocketRequestContext<MessageRouteKey>
  extends APIGatewayEventRequestContext {
  connectionId: string;
  domainName: string;
  routeKey: MessageRouteKey;
}

export interface WebSocketConnectRequestEvent {
  requestContext: WebSocketRequestContext<'$connect'>;
}

export interface WebSocketDisconnectRequestEvent {
  requestContext: WebSocketRequestContext<'$disconnect'>;
}

export const extractEndpointFromEvent = (
  event: WebSocketConnectRequestEvent,
): string => `${event.requestContext.domainName}/${event.requestContext.stage}`;

export const sendMessageToConnection = async ({
  connectionId,
  endpoint,
  message,
}: {
  connectionId: string;
  endpoint: string;
  message: any;
}): Promise<void> => {
  const apigatewaymanagementapi = new ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: endpoint,
  });
  try {
    const data = await apigatewaymanagementapi
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(message),
      })
      .promise();
    console.log('Sent message to connection');
  } catch (error) {
    if (error.statusCode !== 410) {
      throw error;
    }
    console.log(`Found stale connection, deleting ${connectionId}`);
    await deleteConnection(connectionId);
  }
};
