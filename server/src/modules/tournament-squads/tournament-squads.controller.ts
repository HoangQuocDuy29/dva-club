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
import { TournamentSquadsService } from "./tournament-squads.service";
import { CreateTournamentSquadDto } from "./dto/create-tournament-squad.dto";
import { UpdateTournamentSquadDto } from "./dto/update-tournament-squad.dto";
import { ListTournamentSquadsDto } from "./dto/list-tournament-squads.dto";

@ApiTags("Tournament Squads")
@Controller("api/v1/tournament-squads")
export class TournamentSquadsController {
  constructor(
    private readonly tournamentSquadsService: TournamentSquadsService
  ) {}

  // =================== CREATE SQUAD ===================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Register team for tournament" })
  @ApiResponse({ status: 201, description: "Squad registered successfully" })
  async create(@Body() createDto: CreateTournamentSquadDto) {
    const squad = await this.tournamentSquadsService.create(createDto);
    return {
      success: true,
      data: squad,
      message: "Squad registered successfully",
    };
  }

  // =================== GET ALL SQUADS ===================
  @Get()
  @ApiOperation({ summary: "Get tournament squads" })
  @ApiResponse({ status: 200, description: "Squads retrieved successfully" })
  async findAll(@Query() query: ListTournamentSquadsDto) {
    const result = await this.tournamentSquadsService.findAll(query);
    return {
      success: true,
      data: result.squads,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  // =================== GET SQUAD BY ID ===================
  @Get(":id")
  @ApiOperation({ summary: "Get squad by ID with members" })
  @ApiResponse({ status: 200, description: "Squad found" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const squad = await this.tournamentSquadsService.findOne(id);
    return { success: true, data: squad };
  }

  // =================== UPDATE SQUAD ===================
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update tournament squad" })
  @ApiResponse({ status: 200, description: "Squad updated successfully" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateTournamentSquadDto
  ) {
    const squad = await this.tournamentSquadsService.update(id, updateDto);
    return {
      success: true,
      data: squad,
      message: "Squad updated successfully",
    };
  }

  // =================== CONFIRM SQUAD ===================
  @Put(":id/confirm")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Confirm squad for tournament" })
  @ApiResponse({ status: 200, description: "Squad confirmed successfully" })
  async confirmSquad(@Param("id", ParseIntPipe) id: number) {
    const squad = await this.tournamentSquadsService.confirmSquad(id);
    return {
      success: true,
      data: squad,
      message: "Squad confirmed for tournament",
    };
  }

  // =================== ASSIGN GROUP ===================
  @Put(":id/assign-group")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Assign squad to group" })
  @ApiResponse({ status: 200, description: "Group assigned successfully" })
  async assignGroup(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { groupAssignment: string; seedNumber?: number }
  ) {
    const squad = await this.tournamentSquadsService.assignGroup(
      id,
      body.groupAssignment,
      body.seedNumber
    );
    return {
      success: true,
      data: squad,
      message: "Group assigned successfully",
    };
  }

  // =================== WITHDRAW SQUAD ===================
  @Put(":id/withdraw")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Withdraw squad from tournament" })
  @ApiResponse({ status: 200, description: "Squad withdrawn successfully" })
  async withdrawSquad(@Param("id", ParseIntPipe) id: number) {
    const squad = await this.tournamentSquadsService.withdrawSquad(id);
    return {
      success: true,
      data: squad,
      message: "Squad withdrawn from tournament",
    };
  }

  // =================== DELETE SQUAD ===================
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete tournament squad" })
  @ApiResponse({ status: 200, description: "Squad deleted successfully" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.tournamentSquadsService.remove(id);
    return { success: true, message: "Squad deleted successfully" };
  }
}
