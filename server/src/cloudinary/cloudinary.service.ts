//E:\2_NodeJs\DVA_Club\volleyball-club-management\server\src\cloudinary\cloudinary.service.ts
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
      // ✅ Validate file buffer exists
      if (!file || !file.buffer) {
        return reject(new Error('File buffer is required'));
      }

      console.log('📤 Starting Cloudinary upload:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        bufferLength: file.buffer.length
      });

      const uploadStream = v2.uploader.upload_stream(
        {
          resource_type: "auto",
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
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            return reject(error);
          }
          console.log('✅ Cloudinary upload success:', result?.public_id);
          resolve(result);
        }
      );

      // ✅ Create readable stream from buffer with error handling
      try {
        toStream.createReadStream(file.buffer).pipe(uploadStream);
      } catch (streamError) {
        console.error('❌ Stream creation error:', streamError);
        reject(streamError);
      }
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
