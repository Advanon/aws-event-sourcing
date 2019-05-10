const { dynamoDb } = require("aws-access-utils");

module.exports = {
  query: async (table, id) => {
    const { Items } = await dynamoDb.doc
      .query({
        TableName: table,
        KeyConditionExpression: "id = :id",
        ScanIndexForward: true,
        ExpressionAttributeValues: {
          ":id": id
        }
      })
      .promise();
    return Items;
  },

  create: async (table, id, event) => {
    await dynamoDb.doc
      .put({
        TableName: table,
        ConditionExpression: "attribute_not_exists(id)",
        Item: {
          id: id,
          ...event
        }
      })
      .promise();
  },

  add: async (table, id, event) => {
    await dynamoDb.doc
      .put({
        TableName: table,
        ConditionExpression: "attribute_not_exists(#eventNumber)",
        ExpressionAttributeNames: {
          "#eventNumber": "number"
        },
        Item: {
          id: id,
          ...event
        }
      })
      .promise();
  }
};
