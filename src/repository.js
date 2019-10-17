const { dynamoDb } = require('aws-access-utils');

const query = async (TableName, id) => {
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
    items = items.concat(Items);
  }

  return items;
};

const create = async (TableName, id, event) => {
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

const add = async (TableName, id, event) => {
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

module.exports = { query, create, add };
