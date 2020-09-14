import { dynamoDb } from '@advanon-ag/aws-access-utils';

import Event from './Event';

export const query = async (TableName: string, id: string): Promise<Array<Event>> => {
  let { Items: items, LastEvaluatedKey: lastEvaluatedKey } = await dynamoDb.doc
    .query({
      TableName,
      KeyConditionExpression: 'id = :id',
      ScanIndexForward: true,
      ExpressionAttributeValues: {
        ':id': id
      }
    })
    .promise();

  while (lastEvaluatedKey) {
    const { Items, LastEvaluatedKey } = await dynamoDb.doc
      .query({
        TableName,
        KeyConditionExpression: 'id = :id',
        ScanIndexForward: true,
        ExpressionAttributeValues: {
          ':id': id
        },
        ExclusiveStartKey: lastEvaluatedKey
      })
      .promise();

    lastEvaluatedKey = LastEvaluatedKey;
    items = (items || []).concat(Items || []);
  }

  return items as Array<Event>;
};

export const create = async (
  TableName: string,
  id: string,
  event: Event
): Promise<void> => {
  await dynamoDb.doc
    .put({
      TableName,
      ConditionExpression: 'attribute_not_exists(id)',
      Item: {
        id: id,
        ...event
      }
    })
    .promise();
};

export const add = async (
  TableName: string,
  id: string,
  event: Event
): Promise<void> => {
  await dynamoDb.doc
    .put({
      TableName,
      ConditionExpression: 'attribute_not_exists(#eventNumber)',
      ExpressionAttributeNames: {
        '#eventNumber': 'number'
      },
      Item: {
        id: id,
        ...event
      }
    })
    .promise();
};
