import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MediaFile } from "../../entities/media-file.entity";
import { User } from "../../entities/user.entity";
import { CreateMediaDto } from "./dto/create-media.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";
import { ListMediaDto } from "./dto/list-media.dto";
import { UploadMediaDto } from "./dto/upload-media.dto";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaFile)
    private readonly mediaRepository: Repository<MediaFile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  // =================== CREATE MEDIA RECORD ===================
  async create(createDto: CreateMediaDto): Promise<MediaFile> {
    // Validate uploader exists
    const uploader = await this.userRepository.findOne({
      where: { id: createDto.uploadedBy, isActive: true },
    });
    if (!uploader) {
      throw new NotFoundException(
        `User with ID ${createDto.uploadedBy} not found`
      );
    }

    // Create media record
    const mediaFile = this.mediaRepository.create({
      ...createDto,
      isPrimary: createDto.isPrimary || false,
      isPublic: createDto.isPublic !== undefined ? createDto.isPublic : true,
      displayOrder: createDto.displayOrder || 0,
      isActive: createDto.isActive !== undefined ? createDto.isActive : true,
    });

    return this.mediaRepository.save(mediaFile);
  }

  // =================== UPLOAD FILES ===================
  async uploadFile(
    file: Express.Multer.File,
    uploadDto: UploadMediaDto,
    userId: number
  ): Promise<MediaFile> {
    try {
      // Upload to Cloudinary
      const cloudinaryResult = await this.cloudinaryService.uploadFile(file, {
        folder: `volleyball-club/${uploadDto.entityType}/${uploadDto.entityId}`,
        public_id: `${uploadDto.entityType}_${
          uploadDto.entityId
        }_${Date.now()}`,
      });

      // Determine media type from mime type
      const mediaType = this.getMediaTypeFromMime(file.mimetype);

      // Create media record in database
      const mediaData: CreateMediaDto = {
        filename: file.originalname,
        originalName: file.originalname,
        filePath: cloudinaryResult.public_id,
        fileUrl: cloudinaryResult.secure_url,
        mimeType: file.mimetype,
        fileSize: file.size,
        entityType: uploadDto.entityType,
        entityId: uploadDto.entityId,
        mediaType,
        mediaCategory: uploadDto.mediaCategory,
        uploadedBy: userId,
        description: uploadDto.description,
        altText: uploadDto.altText,
        metadata: {
          width: cloudinaryResult.width,
          height: cloudinaryResult.height,
          format: cloudinaryResult.format,
          resourceType: cloudinaryResult.resource_type,
          publicId: cloudinaryResult.public_id,
        },
      };

      return this.create(mediaData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(`Upload failed: ${error.message}`);
      } else {
        throw new BadRequestException("Upload failed: Unexpected error");
      }
    }
  }

  // =================== UPLOAD MULTIPLE FILES ===================
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    uploadDto: UploadMediaDto,
    userId: number
  ): Promise<MediaFile[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, uploadDto, userId)
    );
    return Promise.all(uploadPromises);
  }

  // =================== FIND ALL MEDIA ===================
  async findAll(query: ListMediaDto): Promise<{
    mediaFiles: MediaFile[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.mediaRepository
      .createQueryBuilder("media")
      .leftJoinAndSelect("media.uploader", "uploader")
      .where("media.isActive = :isActive", {
        isActive: query.isActive !== undefined ? query.isActive : true,
      });

    // Search filter
    if (query.search) {
      queryBuilder.andWhere(
        "(media.filename ILIKE :search OR media.originalName ILIKE :search OR media.description ILIKE :search)",
        { search: `%${query.search}%` }
      );
    }

    // Entity filters
    if (query.entityType) {
      queryBuilder.andWhere("media.entityType = :entityType", {
        entityType: query.entityType,
      });
    }

    if (query.entityId) {
      queryBuilder.andWhere("media.entityId = :entityId", {
        entityId: query.entityId,
      });
    }

    // Type filters
    if (query.mediaType) {
      queryBuilder.andWhere("media.mediaType = :mediaType", {
        mediaType: query.mediaType,
      });
    }

    if (query.mediaCategory) {
      queryBuilder.andWhere("media.mediaCategory = :mediaCategory", {
        mediaCategory: query.mediaCategory,
      });
    }

    // User filter
    if (query.uploadedBy) {
      queryBuilder.andWhere("media.uploadedBy = :uploadedBy", {
        uploadedBy: query.uploadedBy,
      });
    }

    // Primary filter
    if (query.isPrimary !== undefined) {
      queryBuilder.andWhere("media.isPrimary = :isPrimary", {
        isPrimary: query.isPrimary,
      });
    }

    // Public filter
    if (query.isPublic !== undefined) {
      queryBuilder.andWhere("media.isPublic = :isPublic", {
        isPublic: query.isPublic,
      });
    }

    // Pagination
    const offset = (query.page - 1) * query.limit;
    const [mediaFiles, total] = await queryBuilder
      .orderBy("media.displayOrder", "ASC")
      .addOrderBy("media.createdAt", "DESC")
      .skip(offset)
      .take(query.limit)
      .getManyAndCount();

    return { mediaFiles, total, page: query.page, limit: query.limit };
  }

  // =================== FIND ONE MEDIA ===================
  async findOne(id: number): Promise<MediaFile> {
    const mediaFile = await this.mediaRepository.findOne({
      where: { id, isActive: true },
      relations: ["uploader"],
    });

    if (!mediaFile) {
      throw new NotFoundException(`Media file with ID ${id} not found`);
    }

    return mediaFile;
  }

  // =================== UPDATE MEDIA ===================
  async update(id: number, updateDto: UpdateMediaDto): Promise<MediaFile> {
    const mediaFile = await this.mediaRepository.findOne({
      where: { id, isActive: true },
    });
    if (!mediaFile) {
      throw new NotFoundException(`Media file with ID ${id} not found`);
    }

    await this.mediaRepository.update(id, updateDto);
    return this.findOne(id);
  }

  // =================== DELETE MEDIA ===================
  async remove(id: number, userId?: number): Promise<void> {
    const mediaFile = await this.mediaRepository.findOne({
      where: { id, isActive: true },
    });
    if (!mediaFile) {
      throw new NotFoundException(`Media file with ID ${id} not found`);
    }

    // Check ownership if userId provided
    if (userId && mediaFile.uploadedBy !== userId) {
      throw new BadRequestException(
        "You can only delete your own uploaded files"
      );
    }

    // Delete from Cloudinary
    try {
      await this.cloudinaryService.deleteFile(mediaFile.filePath);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(`Upload failed: ${error.message}`);
      } else {
        throw new BadRequestException("Upload failed: Unexpected error");
      }
    }

    // Soft delete from database
    await this.mediaRepository.update(id, { isActive: false });
  }

  // =================== SET PRIMARY MEDIA ===================
  async setPrimary(
    id: number,
    entityType: string,
    entityId: number
  ): Promise<MediaFile> {
    // Remove primary flag from other media of same entity
    await this.mediaRepository.update(
      { entityType, entityId, isPrimary: true },
      { isPrimary: false }
    );

    // Set this media as primary
    await this.mediaRepository.update(id, { isPrimary: true });

    return this.findOne(id);
  }

  // =================== GET ENTITY MEDIA ===================
  async getEntityMedia(
    entityType: string,
    entityId: number,
    isPublic = true
  ): Promise<MediaFile[]> {
    return this.mediaRepository.find({
      where: {
        entityType,
        entityId,
        isPublic,
        isActive: true,
      },
      relations: ["uploader"],
      order: {
        isPrimary: "DESC",
        displayOrder: "ASC",
        createdAt: "DESC",
      },
    });
  }

  // =================== HELPER METHODS ===================
  private getMediaTypeFromMime(mimeType: string): string {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    return "document";
  }
}
