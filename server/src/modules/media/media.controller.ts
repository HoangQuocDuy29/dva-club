import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../auth/enums/auth-status.enum";
import { MediaService } from "./media.service";
import { CreateMediaDto } from "./dto/create-media.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";
import { ListMediaDto } from "./dto/list-media.dto";
import { UploadMediaDto } from "./dto/upload-media.dto";

@ApiTags("Media")
@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // =================== UPLOAD SINGLE FILE ===================
  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload single media file" })
  @ApiBody({
    description: "File upload with metadata",
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "File to upload",
        },
        entityType: {
          type: "string",
          enum: ["player", "team", "tournament", "match", "user", "news"],
          description: "Entity type",
        },
        entityId: {
          type: "integer",
          description: "Entity ID",
        },
        mediaCategory: {
          type: "string",
          enum: [
            "profile",
            "action",
            "team_photo",
            "logo",
            "banner",
            "document",
          ],
          description: "Media category (optional)",
        },
        description: {
          type: "string",
          description: "File description (optional)",
        },
        altText: {
          type: "string",
          description: "Alternative text for accessibility (optional)",
        },
      },
      required: ["file", "entityType", "entityId"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "File uploaded successfully",
    example: {
      success: true,
      data: {
        id: 1,
        filename: "player-profile.jpg",
        originalName: "my-photo.jpg",
        fileUrl:
          "https://res.cloudinary.com/dsezvx7xf/image/upload/v1692259200/volleyball-club/player/1/player-profile.jpg",
        mimeType: "image/jpeg",
        fileSize: 245760,
        entityType: "player",
        entityId: 1,
        mediaType: "image",
        mediaCategory: "profile",
        isPrimary: false,
        isPublic: true,
        metadata: {
          width: 800,
          height: 600,
          format: "jpg",
        },
        createdAt: "2025-08-17T04:00:00.000Z",
      },
      message: "File uploaded successfully",
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    example: {
      success: false,
      statusCode: 400,
      message: "No file provided",
      error: "BAD_REQUEST",
    },
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    example: {
      success: false,
      statusCode: 401,
      message: "Unauthorized",
      error: "UNAUTHORIZED",
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadMediaDto,
    @CurrentUser() user: any
  ) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    const mediaFile = await this.mediaService.uploadFile(
      file,
      uploadDto,
      user.id
    );
    return {
      success: true,
      data: mediaFile,
      message: "File uploaded successfully",
    };
  }

  // =================== UPLOAD MULTIPLE FILES ===================
  @Post("upload-multiple")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor("files", 10))
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Upload multiple media files" })
  @ApiBody({
    description: "Multiple files upload with metadata",
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
          description: "Multiple files to upload",
        },
        entityType: {
          type: "string",
          enum: ["player", "team", "tournament", "match", "user", "news"],
        },
        entityId: {
          type: "integer",
        },
        mediaCategory: {
          type: "string",
          enum: [
            "profile",
            "action",
            "team_photo",
            "logo",
            "banner",
            "document",
          ],
        },
        description: { type: "string" },
        altText: { type: "string" },
      },
      required: ["files", "entityType", "entityId"],
    },
  })
  @ApiResponse({
    status: 201,
    description: "Files uploaded successfully",
    example: {
      success: true,
      data: [
        {
          id: 1,
          filename: "photo-1.jpg",
          fileUrl:
            "https://res.cloudinary.com/club/image/upload/v123/photo-1.jpg",
          mediaType: "image",
          entityType: "player",
          entityId: 1,
        },
        {
          id: 2,
          filename: "photo-2.jpg",
          fileUrl:
            "https://res.cloudinary.com/club/image/upload/v124/photo-2.jpg",
          mediaType: "image",
          entityType: "player",
          entityId: 1,
        },
      ],
      message: "2 files uploaded successfully",
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad request - No files provided",
  })
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadDto: UploadMediaDto,
    @CurrentUser() user: any
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException("No files provided");
    }

    const mediaFiles = await this.mediaService.uploadMultipleFiles(
      files,
      uploadDto,
      user.id
    );
    return {
      success: true,
      data: mediaFiles,
      message: `${files.length} files uploaded successfully`,
    };
  }

  // =================== CREATE MEDIA RECORD ===================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create media record (Admin)" })
  @ApiResponse({
    status: 201,
    description: "Media record created successfully",
    example: {
      success: true,
      data: {
        id: 1,
        filename: "manual-upload.jpg",
        fileUrl: "https://example.com/manual-upload.jpg",
        entityType: "player",
        entityId: 1,
        createdAt: "2025-08-17T04:00:00.000Z",
      },
      message: "Media record created successfully",
    },
  })
  async create(@Body() createDto: CreateMediaDto) {
    const mediaFile = await this.mediaService.create(createDto);
    return {
      success: true,
      data: mediaFile,
      message: "Media record created successfully",
    };
  }

  // =================== GET ALL MEDIA ===================
  @Get()
  @ApiOperation({ summary: "Get all media files" })
  @ApiResponse({
    status: 200,
    description: "Media files retrieved successfully",
    example: {
      success: true,
      data: [
        {
          id: 1,
          filename: "player-1-profile.jpg",
          fileUrl:
            "https://res.cloudinary.com/club/image/upload/v123/player-1-profile.jpg",
          mediaType: "image",
          mediaCategory: "profile",
          entityType: "player",
          entityId: 1,
          isPrimary: true,
          isPublic: true,
          createdAt: "2025-08-17T04:00:00.000Z",
        },
        {
          id: 2,
          filename: "team-logo.png",
          fileUrl:
            "https://res.cloudinary.com/club/image/upload/v124/team-logo.png",
          mediaType: "image",
          mediaCategory: "logo",
          entityType: "team",
          entityId: 1,
          isPrimary: true,
          isPublic: true,
          createdAt: "2025-08-17T05:00:00.000Z",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    },
  })
  async findAll(@Query() query: ListMediaDto) {
    const result = await this.mediaService.findAll(query);
    return {
      success: true,
      data: result.mediaFiles,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  // =================== GET ENTITY MEDIA ===================
  @Get("entity/:entityType/:entityId")
  @ApiOperation({ summary: "Get media files for specific entity" })
  @ApiResponse({
    status: 200,
    description: "Entity media retrieved successfully",
    example: {
      success: true,
      data: [
        {
          id: 1,
          filename: "player-profile.jpg",
          fileUrl:
            "https://res.cloudinary.com/club/image/upload/v123/player-profile.jpg",
          mediaCategory: "profile",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
    },
  })
  async getEntityMedia(
    @Param("entityType") entityType: string,
    @Param("entityId", ParseIntPipe) entityId: number,
    @Query("isPublic") isPublic?: boolean
  ) {
    const mediaFiles = await this.mediaService.getEntityMedia(
      entityType,
      entityId,
      isPublic
    );
    return { success: true, data: mediaFiles };
  }

  // =================== GET MEDIA BY ID ===================
  @Get(":id")
  @ApiOperation({ summary: "Get media file by ID" })
  @ApiResponse({
    status: 200,
    description: "Media file found",
    example: {
      success: true,
      data: {
        id: 1,
        filename: "player-profile.jpg",
        fileUrl:
          "https://res.cloudinary.com/club/image/upload/v123/player-profile.jpg",
        mediaType: "image",
        entityType: "player",
        entityId: 1,
        uploader: {
          id: 1,
          firstName: "Admin",
          lastName: "User",
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Media file not found",
  })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const mediaFile = await this.mediaService.findOne(id);
    return { success: true, data: mediaFile };
  }

  // =================== UPDATE MEDIA ===================
  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update media file" })
  @ApiResponse({
    status: 200,
    description: "Media file updated successfully",
    example: {
      success: true,
      data: {
        id: 1,
        filename: "updated-filename.jpg",
        description: "Updated description",
        altText: "Updated alt text",
      },
      message: "Media file updated successfully",
    },
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateMediaDto,
    @CurrentUser() user: any
  ) {
    const mediaFile = await this.mediaService.update(id, updateDto);
    return {
      success: true,
      data: mediaFile,
      message: "Media file updated successfully",
    };
  }

  // =================== SET PRIMARY MEDIA ===================
  @Put(":id/set-primary")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Set media as primary for entity" })
  @ApiResponse({
    status: 200,
    description: "Media set as primary successfully",
    example: {
      success: true,
      data: {
        id: 1,
        filename: "player-profile.jpg",
        isPrimary: true,
        entityType: "player",
        entityId: 1,
      },
      message: "Media set as primary successfully",
    },
  })
  async setPrimary(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { entityType: string; entityId: number }
  ) {
    const mediaFile = await this.mediaService.setPrimary(
      id,
      body.entityType,
      body.entityId
    );
    return {
      success: true,
      data: mediaFile,
      message: "Media set as primary successfully",
    };
  }

  // =================== DELETE MEDIA ===================
  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete media file" })
  @ApiResponse({
    status: 200,
    description: "Media file deleted successfully",
    example: {
      success: true,
      message: "Media file deleted successfully",
    },
  })
  @ApiResponse({
    status: 404,
    description: "Media file not found",
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Can only delete own files",
  })
  async remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: any
  ) {
    await this.mediaService.remove(id, user.id);
    return { success: true, message: "Media file deleted successfully" };
  }
}
