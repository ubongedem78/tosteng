const cloudinary = require("cloudinary").v2;
const DataUri = require("datauri/parser");
const path = require("path");

const {
  BadRequestError,
  InternalServerError,
} = require("../middlewares/errorhandler.middleware");

cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.APIkey,
  api_secret: process.env.APIsecret,
});

const MAX_FILE_SIZE_MB = 5;

const uploadToCloudinary = async (photos) => {
  try {
    const fileSizeMB = photos.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      throw new BadRequestError(
        `File size exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB}MB`
      );
    }

    const urls = [];
    const datauri = new DataUri();

    for (const photo of photos) {
      const dataUri = datauri.format(
        path.extname(photo.originalname),
        photo.buffer
      );

      const final_file = dataUri.content;

      const result = await cloudinary.uploader.upload(final_file, {
        folder: "profile-photos",
        allowed_formats: ["jpg", "jpeg", "png"],
        maxFileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
      });

      urls.push({ url: result.secure_url, publicId: result.public_id });
    }
    console.log("urls", urls);

    return { successful: true, message: "files uploaded successfully", urls };
  } catch (error) {
    throw new InternalServerError("Error uploading photo to Cloudinary");
  }
};

module.exports = { uploadToCloudinary };
