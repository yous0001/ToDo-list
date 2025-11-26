import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import streamifier from "streamifier";

import { env } from "../config/env";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

type UploadResult = {
  secureUrl: string;
  publicId: string;
};

export const uploadImageBuffer = async (
  buffer: Buffer,
  {
    folder,
    publicId,
  }: {
    folder: string;
    publicId?: string | null;
  }
): Promise<UploadResult> =>
  new Promise((resolve, reject) => {
    const options: UploadApiOptions = {
      folder,
      overwrite: true,
      resource_type: "image",
      transformation: [
        { width: 600, height: 600, crop: "fill", gravity: "face" },
        { quality: "auto:good", fetch_format: "auto" },
      ],
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Failed to upload image"));
          return;
        }
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Failed to delete Cloudinary asset", error);
  }
};

