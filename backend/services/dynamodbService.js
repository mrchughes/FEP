// Fully implemented real code for backend/services/dynamodbService.js
const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.DYNAMO_TABLE_NAME;

const createUser = async (user) => {
    const params = {
        TableName: tableName,
        Item: {
            email: user.email,
            name: user.name,
            password: user.password,
            formData: null,
        },
    };
    await dynamoDb.put(params).promise();
};

const findUserByEmail = async (email) => {
    const params = {
        TableName: tableName,
        Key: { email },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item;
};

const saveFormData = async (email, formData) => {
    const params = {
        TableName: tableName,
        Key: { email },
        UpdateExpression: "set formData = :data",
        ExpressionAttributeValues: {
            ":data": formData,
        },
    };
    await dynamoDb.update(params).promise();
};

const getFormData = async (email) => {
    const user = await findUserByEmail(email);
    return user?.formData || null;
};

module.exports = { createUser, findUserByEmail, saveFormData, getFormData };
