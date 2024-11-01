const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');

cloudinary.config({ 
    cloud_name: 'web-backend', 
    api_key: '179477373698935', 
    api_secret: 'v7I_u0NY2EmJyDhsbsuktGiovr8'
});

const uploadOnCloudinary = async (localFilePath, publicId = null) => {
    try {
        if (!localFilePath) return null;

        // Options for Cloudinary upload
        const uploadOptions = {
            resource_type: "auto" // Detect file type automatically
        };

        // If a public_id is provided, add it to the options
        if (publicId) {
            uploadOptions.public_id = publicId;
        }

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);

        // File has been uploaded successfully
        console.log("File is uploaded on Cloudinary:", response.url);
        return response;

    } catch (error) {
        // Remove the locally saved temporary file if the upload fails
        fs.unlinkSync(localFilePath);
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};

module.exports = uploadOnCloudinary;
