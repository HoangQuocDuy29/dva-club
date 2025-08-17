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
import { PlayerStatisticsService } from "./player-statistics.service";
import { CreatePlayerStatisticsDto } from "./dto/create-player-statistic.dto";
import { UpdatePlayerStatisticsDto } from "./dto/update-player-statistic.dto";
import { ListPlayerStatisticsDto } from "./dto/list-player-statistics.dto";
import { PlayerPerformanceAnalysisDto } from "./dto/player-performance-analysis.dto";

@ApiTags("Player Statistics")
@Controller("api/v1/player-statistics")
export class PlayerStatisticsController {
  constructor(
    private readonly playerStatisticsService: PlayerStatisticsService
  ) {}

  // =================== CREATE STATISTICS ===================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create player statistics" })
  @ApiResponse({ status: 201, description: "Statistics created successfully" })
  async create(@Body() createDto: CreatePlayerStatisticsDto) {
    const statistics = await this.playerStatisticsService.create(createDto);
    return {
      success: true,
      data: statistics,
      message: "Player statistics created successfully",
    };
  }

  // =================== GET ALL STATISTICS ===================
  @Get()
  @ApiOperation({ summary: "Get player statistics" })
  @ApiResponse({
    status: 200,
    description: "Statistics retrieved successfully",
  })
  async findAll(@Query() query: ListPlayerStatisticsDto) {
    const result = await this.playerStatisticsService.findAll(query);
    return {
      success: true,
      data: result.statistics,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  // =================== GET STATISTICS BY ID ===================
  @Get(":id")
  @ApiOperation({ summary: "Get statistics by ID" })
  @ApiResponse({ status: 200, description: "Statistics found" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const statistics = await this.playerStatisticsService.findOne(id);
    return { success: true, data: statistics };
  }

  // =================== GET PLAYER CAREER STATS ===================
  @Get("player/:playerId/career")
  @ApiOperation({ summary: "Get player career statistics" })
  @ApiResponse({
    status: 200,
    description: "Career stats retrieved successfully",
  })
  async getPlayerCareerStats(
    @Param("playerId", ParseIntPipe) playerId: number
  ) {
    const careerStats = await this.playerStatisticsService.getPlayerCareerStats(
      playerId
    );
    return { success: true, data: careerStats };
  }

  // =================== GET PLAYER PERFORMANCE ANALYSIS ===================
  @Get("player/:playerId/analysis")
  @ApiOperation({ summary: "Get player performance analysis" })
  @ApiResponse({
    status: 200,
    description: "Performance analysis retrieved successfully",
  })
  async getPlayerPerformanceAnalysis(
    @Param("playerId", ParseIntPipe) playerId: number,
    @Query() query: PlayerPerformanceAnalysisDto
  ) {
    const analysis =
      await this.playerStatisticsService.getPlayerPerformanceAnalysis(
        playerId,
        query
      );
    return { success: true, data: analysis };
  }

  // =================== GET POSITION BASED STATS ===================
  @Get("player/:playerId/position-stats")
  @ApiOperation({ summary: "Get player statistics by position" })
  @ApiResponse({
    status: 200,
    description: "Position-based stats retrieved successfully",
  })
  async getPositionBasedStats(
    @Param("playerId", ParseIntPipe) playerId: number,
    @Query("season") season?: string
  ) {
    const positionStats =
      await this.playerStatisticsService.getPositionBasedStats(
        playerId,
        season
      );
    return { success: true, data: positionStats };
  }

  // =================== GET SEASON COMPARISON ===================
  @Get("player/:playerId/season-comparison")
  @ApiOperation({ summary: "Compare player stats across seasons" })
  @ApiResponse({
    status: 200,
    description: "Season comparison retrieved successfully",
  })
  async getSeasonComparison(@Param("playerId", ParseIntPipe) playerId: number) {
    const comparison = await this.playerStatisticsService.getSeasonComparison(
      playerId
    );
    return { success: true, data: comparison };
  }

  // =================== UPDATE STATISTICS ===================
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update player statistics" })
  @ApiResponse({ status: 200, description: "Statistics updated successfully" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdatePlayerStatisticsDto
  ) {
    const statistics = await this.playerStatisticsService.update(id, updateDto);
    return {
      success: true,
      data: statistics,
      message: "Statistics updated successfully",
    };
  }

  // =================== RECALCULATE PERCENTAGES ===================
  @Put(":id/recalculate")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Recalculate statistics percentages" })
  @ApiResponse({
    status: 200,
    description: "Percentages recalculated successfully",
  })
  async recalculatePercentages(@Param("id", ParseIntPipe) id: number) {
    const statistics =
      await this.playerStatisticsService.recalculatePercentages(id);
    return {
      success: true,
      data: statistics,
      message: "Statistics percentages recalculated",
    };
  }

  // =================== DELETE STATISTICS ===================
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete player statistics" })
  @ApiResponse({ status: 200, description: "Statistics deleted successfully" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.playerStatisticsService.remove(id);
    return { success: true, message: "Statistics deleted successfully" };
  }
}
