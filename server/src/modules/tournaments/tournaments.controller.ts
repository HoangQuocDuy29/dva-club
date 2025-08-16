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
import { TournamentsService } from "./tournaments.service";
import { CreateTournamentDto } from "./dto/create-tournament.dto";
import { UpdateTournamentDto } from "./dto/update-tournament.dto";
import { ListTournamentsDto } from "./dto/list-tournaments.dto";

@ApiTags("Tournaments")
@Controller("api/v1/tournaments")
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  // =================== CREATE TOURNAMENT ===================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new tournament" })
  @ApiResponse({ status: 201, description: "Tournament created successfully" })
  async create(@Body() createDto: CreateTournamentDto) {
    const tournament = await this.tournamentsService.create(createDto);
    return {
      success: true,
      data: tournament,
      message: "Tournament created successfully",
    };
  }

  // =================== GET ALL TOURNAMENTS ===================
  @Get()
  @ApiOperation({ summary: "Get all tournaments" })
  @ApiResponse({
    status: 200,
    description: "Tournaments retrieved successfully",
  })
  async findAll(@Query() query: ListTournamentsDto) {
    const result = await this.tournamentsService.findAll(query);
    return {
      success: true,
      data: result.tournaments,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  // =================== GET TOURNAMENT BY ID ===================
  @Get(":id")
  @ApiOperation({ summary: "Get tournament by ID" })
  @ApiResponse({ status: 200, description: "Tournament found" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const tournament = await this.tournamentsService.findOne(id);
    return { success: true, data: tournament };
  }

  // =================== UPDATE TOURNAMENT ===================
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update tournament" })
  @ApiResponse({ status: 200, description: "Tournament updated successfully" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateTournamentDto
  ) {
    const tournament = await this.tournamentsService.update(id, updateDto);
    return {
      success: true,
      data: tournament,
      message: "Tournament updated successfully",
    };
  }

  // =================== OPEN REGISTRATION ===================
  @Put(":id/open-registration")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Open tournament registration" })
  @ApiResponse({ status: 200, description: "Registration opened successfully" })
  async openRegistration(@Param("id", ParseIntPipe) id: number) {
    const tournament = await this.tournamentsService.openRegistration(id);
    return {
      success: true,
      data: tournament,
      message: "Tournament registration opened",
    };
  }

  // =================== START TOURNAMENT ===================
  @Put(":id/start")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Start tournament" })
  @ApiResponse({ status: 200, description: "Tournament started successfully" })
  async startTournament(@Param("id", ParseIntPipe) id: number) {
    const tournament = await this.tournamentsService.startTournament(id);
    return { success: true, data: tournament, message: "Tournament started" };
  }

  // =================== COMPLETE TOURNAMENT ===================
  @Put(":id/complete")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Complete tournament" })
  @ApiResponse({
    status: 200,
    description: "Tournament completed successfully",
  })
  async completeTournament(@Param("id", ParseIntPipe) id: number) {
    const tournament = await this.tournamentsService.completeTournament(id);
    return { success: true, data: tournament, message: "Tournament completed" };
  }

  // =================== GET TOURNAMENT SQUADS ===================
  @Get(":id/squads")
  @ApiOperation({ summary: "Get tournament registered squads" })
  @ApiResponse({ status: 200, description: "Squads retrieved successfully" })
  async getTournamentSquads(@Param("id", ParseIntPipe) id: number) {
    const squads = await this.tournamentsService.getTournamentSquads(id);
    return { success: true, data: squads };
  }

  // =================== GET TOURNAMENT MATCHES ===================
  @Get(":id/matches")
  @ApiOperation({ summary: "Get tournament matches" })
  @ApiResponse({ status: 200, description: "Matches retrieved successfully" })
  async getTournamentMatches(@Param("id", ParseIntPipe) id: number) {
    const matches = await this.tournamentsService.getTournamentMatches(id);
    return { success: true, data: matches };
  }

  // =================== DELETE TOURNAMENT ===================
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete tournament" })
  @ApiResponse({ status: 200, description: "Tournament deleted successfully" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.tournamentsService.remove(id);
    return { success: true, message: "Tournament deleted successfully" };
  }
}
