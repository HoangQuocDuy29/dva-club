import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Put,
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
import { RolesGuard } from "../auth/guards";
import { Roles } from "../auth/decorators/";
import { UserRole } from "../auth/enums/auth-status.enum";
import { PlayersService } from "./players.service";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { ListPlayersDto } from "./dto/list-players.dto";

@ApiTags("Players")
@Controller("api/v1/players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  // =================== CREATE ===================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new player" })
  @ApiResponse({ status: 201, description: "Player created successfully" })
  async create(@Body() createDto: CreatePlayerDto) {
    const player = await this.playersService.create(createDto);
    return {
      success: true,
      data: player,
      message: "Player created successfully",
    };
  }
  // =================== READ ALL ===================
  @Get()
  @ApiOperation({ summary: "Get all players" })
  @ApiResponse({ status: 200, description: "Players retrieved successfully" })
  async findAll(@Query() query: ListPlayersDto) {
    const result = await this.playersService.findAll(query);
    return {
      success: true,
      data: result.players,
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
  @ApiOperation({ summary: "Get player by ID" })
  @ApiResponse({ status: 200, description: "Player found" })
  @ApiResponse({ status: 404, description: "Player not found" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const player = await this.playersService.findOne(id);
    return { success: true, data: player };
  }

  // =================== UPDATE ===================
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update player" })
  @ApiResponse({ status: 200, description: "Player updated successfully" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdatePlayerDto
  ) {
    const player = await this.playersService.update(id, updateDto);
    return {
      success: true,
      data: player,
      message: "Player updated successfully",
    };
  }

  // =================== DELETE ===================
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete player" })
  @ApiResponse({ status: 200, description: "Player deleted successfully" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.playersService.remove(id);
    return { success: true, message: "Player deleted successfully" };
  }
}
