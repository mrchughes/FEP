// Fully implemented real code for backend/services/s3Service.js
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const uploadFormToS3 = async (formData, key) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(formData),
        ContentType: "application/json",
    };
    await s3.putObject(params).promise();
};

const getPreSignedUrl = async (key) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Expires: 3600,
    };
    return s3.getSignedUrlPromise("getObject", params);
};

module.exports = { uploadFormToS3, getPreSignedUrl };
