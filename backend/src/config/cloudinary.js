const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload buffer to Cloudinary as an image (PNG).
 * @param {Buffer} buffer - Image buffer
 * @param {string} filename - File name without extension
 * @returns {Promise<string>} - Secure URL
 */
async function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "idcards",
          public_id: filename,
          resource_type: "image",
          format: "png",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

module.exports = { uploadToCloudinary };
