import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import { ApiResponse } from "./ApiResponse.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("File has beenn successfully uploaded on ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (fileUrl) => {
  if (!fileUrl) {
    throw new ApiError(400, "File URL cannot be null or undefined");
  }

  // console.log("File URL while deletion is:", fileUrl);

  try {
    // Extract the public_id from the fileUrl
    const urlParts = fileUrl.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1]; // Extract last part (e.g., s2yxfcrfiigmk2m1aywi.png)
    const publicId = fileNameWithExtension.split('.')[0]; // Remove the file extension

    // console.log("Extracted public_id is:", publicId);

    // Call Cloudinary's destroy method
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image", // Use the correct resource type
    });

    console.log("Deletion response:", res);

    return res;
  } catch (error) {
    console.error("Error during deletion:", error);
    throw new ApiError(400, "File cannot be deleted");
  }
};


export { uploadOnCloudinary, deleteFromCloudinary };
