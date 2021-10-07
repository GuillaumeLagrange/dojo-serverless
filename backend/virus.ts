import { success } from '@libs/response';
import { APIGatewayProxyHandler } from 'aws-lambda';

const viruses = [
  {
    id: 0,
    positionX: 12,
    positionY: 23,
    srcIndex: 0,
  },
  {
    id: 1,
    positionX: 22,
    positionY: 33,
    srcIndex: 1,
  },
  {
    id: 2,
    positionX: 32,
    positionY: 43,
    srcIndex: 2,
  },
  {
    id: 3,
    positionX: 42,
    positionY: 53,
    srcIndex: 3,
  },
  {
    id: 4,
    positionX: 52,
    positionY: 63,
    srcIndex: 4,
  },
  {
    id: 5,
    positionX: 62,
    positionY: 73,
    srcIndex: 5,
  },
];

export const main: APIGatewayProxyHandler = async event => {
  console.log('Hello world');
  console.log(event);
  let virusResponse = viruses;
  if (event.queryStringParameters && event.queryStringParameters.id) {
    virusResponse = [viruses[Number(event.queryStringParameters.id)]];
  }
  return success({
    message: 'Hello from virus',
    viruses: virusResponse,
    input: event,
  });
};
