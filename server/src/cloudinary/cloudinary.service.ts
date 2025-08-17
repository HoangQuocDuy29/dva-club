import { Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import toStream = require("streamifier");

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    options?: any
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        {
          resource_type: "auto", // Auto-detect file type
          folder: options?.folder || "volleyball-club",
          public_id: options?.public_id,
          overwrite: options?.overwrite || true,
          transformation: options?.transformation || [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto" },
          ],
          ...options,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      toStream.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    options?: any
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }

  async deleteFile(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  generateThumbnail(publicId: string, width: number, height: number): string {
    return v2.url(publicId, {
      width,
      height,
      crop: "fill",
      quality: "auto",
      fetch_format: "auto",
    });
  }

  async getFileInfo(publicId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      v2.api.resource(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
