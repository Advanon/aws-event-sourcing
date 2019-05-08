const { dynamoDb } = require("aws-access-utils");

class Repository {
  static async query(table, id) {
    const { Items } = await dynamoDb.doc
      .query({
        TableName: this.table,
        KeyConditionExpression: "id = :id",
        ScanIndexForward: true,
        ExpressionAttributeValues: {
          ":id": id
        }
      })
      .promise();
    return Items;
  }

  static async create(table, id, event) {
    await dynamoDb
      .put({
        TableName: this.table,
        ConditionExpression: "attribute_not_exists(id)",
        Item: {
          id: this.id,
          ...event
        }
      })
      .promise();
    return;
  }

  static async add(table, id, event) {
    await dynamoDb
      .put({
        TableName: this.table,
        ConditionExpression: "attribute_not_exists(#eventNumber)",
        ExpressionAttributeNames: {
          "#eventNumber": "number"
        },
        Item: {
          id: this.id,
          ...event
        }
      })
      .promise();
    return;
  }
}

module.exports = Repository;
