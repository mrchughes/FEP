// Fully implemented real code for backend/controllers/formController.js
const asyncHandler = require("express-async-handler");
const { uploadFormToS3, getPreSignedUrl } = require("../services/s3Service");
const { saveFormData, getFormData } = require("../services/dynamodbService");

const submitForm = asyncHandler(async (req, res) => {
    const userEmail = req.user.email;
    const formData = req.body;

    await saveFormData(userEmail, formData);

    const key = `forms/${userEmail}-final.json`;
    await uploadFormToS3(formData, key);

    const url = await getPreSignedUrl(key);

    res.json({ message: "Form submitted successfully", downloadUrl: url });
});

const getResumeData = asyncHandler(async (req, res) => {
    const userEmail = req.user.email;
    const data = await getFormData(userEmail);

    if (!data) {
        res.status(404);
        throw new Error("No saved form data found");
    }

    res.json(data);
});

module.exports = { submitForm, getResumeData };
