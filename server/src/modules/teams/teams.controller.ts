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
import { TeamsService } from "./teams.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { ListTeamsDto } from "./dto/list-teams.dto";
import { AddTeamMemberDto } from "./dto/add-team-member.dto";

@ApiTags("Teams")
@Controller("api/v1/teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // =================== CREATE TEAM ===================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create new team" })
  @ApiResponse({ status: 201, description: "Team created successfully" })
  async create(@Body() createDto: CreateTeamDto) {
    const team = await this.teamsService.create(createDto);
    return { success: true, data: team, message: "Team created successfully" };
  }

  // =================== GET ALL TEAMS ===================
  @Get()
  @ApiOperation({ summary: "Get all teams" })
  @ApiResponse({ status: 200, description: "Teams retrieved successfully" })
  async findAll(@Query() query: ListTeamsDto) {
    const result = await this.teamsService.findAll(query);
    return {
      success: true,
      data: result.teams,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  // =================== GET TEAM BY ID ===================
  @Get(":id")
  @ApiOperation({ summary: "Get team by ID with members" })
  @ApiResponse({ status: 200, description: "Team found" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const team = await this.teamsService.findOne(id);
    return { success: true, data: team };
  }

  // =================== UPDATE TEAM ===================
  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update team" })
  @ApiResponse({ status: 200, description: "Team updated successfully" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateTeamDto
  ) {
    const team = await this.teamsService.update(id, updateDto);
    return { success: true, data: team, message: "Team updated successfully" };
  }

  // =================== ADD TEAM MEMBER ===================
  @Post(":id/members")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add player to team" })
  @ApiResponse({
    status: 201,
    description: "Player added to team successfully",
  })
  async addMember(
    @Param("id", ParseIntPipe) id: number,
    @Body() addMemberDto: AddTeamMemberDto
  ) {
    const member = await this.teamsService.addMember(id, addMemberDto);
    return {
      success: true,
      data: member,
      message: "Player added to team successfully",
    };
  }

  // =================== GET TEAM MEMBERS ===================
  @Get(":id/members")
  @ApiOperation({ summary: "Get team roster" })
  @ApiResponse({
    status: 200,
    description: "Team members retrieved successfully",
  })
  async getMembers(@Param("id", ParseIntPipe) id: number) {
    const members = await this.teamsService.getMembers(id);
    return { success: true, data: members };
  }

  // =================== REMOVE TEAM MEMBER ===================
  @Delete(":id/members/:memberId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Remove player from team" })
  @ApiResponse({
    status: 200,
    description: "Player removed from team successfully",
  })
  async removeMember(
    @Param("id", ParseIntPipe) id: number,
    @Param("memberId", ParseIntPipe) memberId: number
  ) {
    await this.teamsService.removeMember(id, memberId);
    return { success: true, message: "Player removed from team successfully" };
  }

  // =================== GET TEAM STATS ===================
  @Get(":id/stats")
  @ApiOperation({ summary: "Get team statistics" })
  @ApiResponse({
    status: 200,
    description: "Team stats retrieved successfully",
  })
  async getTeamStats(
    @Param("id", ParseIntPipe) id: number,
    @Query("season") season?: string
  ) {
    const stats = await this.teamsService.getTeamStats(id, season);
    return { success: true, data: stats };
  }

  // =================== DELETE TEAM ===================
  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete team" })
  @ApiResponse({ status: 200, description: "Team deleted successfully" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.teamsService.remove(id);
    return { success: true, message: "Team deleted successfully" };
  }
}
