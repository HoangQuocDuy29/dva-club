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
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../auth/enums/auth-status.enum";
import { DivisionsService } from "./divisions.service";
import { CreateDivisionDto } from "./dto/create-division.dto";
import { UpdateDivisionDto } from "./dto/update-division.dto";
import { ListDivisionsDto } from "./dto/list-divisions.dto";

@ApiTags("Divisions")
@Controller("api/v1/divisions")
export class DivisionsController {
  constructor(private readonly divisionsService: DivisionsService) {}

  // =================== CREATE ===================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new division" })
  @ApiResponse({ status: 201, description: "Division created successfully" })
  async create(@Body() createDto: CreateDivisionDto) {
    const division = await this.divisionsService.create(createDto);
    return {
      success: true,
      data: division,
      message: "Division created successfully",
    };
  }

  // =================== READ ALL ===================
  @Get()
  @ApiOperation({ summary: "Get all divisions" })
  @ApiResponse({ status: 200, description: "Divisions retrieved successfully" })
  async findAll(@Query() query: ListDivisionsDto) {
    const result = await this.divisionsService.findAll(query);
    return {
      success: true,
      data: result.divisions,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  // =================== READ ONE ===================
  @Get(":id")
  @ApiOperation({ summary: "Get division by ID" })
  @ApiResponse({ status: 200, description: "Division found" })
  @ApiResponse({ status: 404, description: "Division not found" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const division = await this.divisionsService.findOne(id);
    return { success: true, data: division };
  }

  // =================== UPDATE ===================
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update division" })
  @ApiResponse({ status: 200, description: "Division updated successfully" })
  @ApiResponse({ status: 404, description: "Division not found" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateDivisionDto
  ) {
    const division = await this.divisionsService.update(id, updateDto);
    return {
      success: true,
      data: division,
      message: "Division updated successfully",
    };
  }

  // =================== DELETE ===================
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete division" })
  @ApiResponse({ status: 200, description: "Division deleted successfully" })
  @ApiResponse({ status: 404, description: "Division not found" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.divisionsService.remove(id);
    return { success: true, message: "Division deleted successfully" };
  }
}
