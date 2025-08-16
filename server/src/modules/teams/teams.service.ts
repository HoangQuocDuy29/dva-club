import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Team } from "../../entities/team.entity";
import { TeamMember } from "../../entities/team-member.entity";
import { TeamStats } from "../../entities/team-stats.entity";
import { Division } from "../../entities/division.entity";
import { User } from "../../entities/user.entity";
import { Player } from "../../entities/player.entity";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { ListTeamsDto } from "./dto/list-teams.dto";
import { AddTeamMemberDto } from "./dto/add-team-member.dto";

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private readonly teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(TeamStats)
    private readonly teamStatsRepository: Repository<TeamStats>,
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>
  ) {}

  // =================== CREATE TEAM ===================
  async create(createDto: CreateTeamDto): Promise<Team> {
    // Validate foreign keys
    await this.validateForeignKeys(
      createDto.divisionId,
      createDto.coachId,
      createDto.assistantCoachId
    );

    // Check unique code
    const existingCode = await this.teamRepository.findOne({
      where: { code: createDto.code },
    });
    if (existingCode) {
      throw new ConflictException(
        `Team code "${createDto.code}" already exists`
      );
    }

    // Check unique name
    const existingName = await this.teamRepository.findOne({
      where: { name: createDto.name },
    });
    if (existingName) {
      throw new ConflictException(
        `Team name "${createDto.name}" already exists`
      );
    }

    // Create team
    const team = this.teamRepository.create({
      ...createDto,
      foundedDate: createDto.foundedDate
        ? new Date(createDto.foundedDate)
        : null,
      maxMembers: createDto.maxMembers || 18,
      isActive: createDto.isActive !== undefined ? createDto.isActive : true,
    });

    return this.teamRepository.save(team);
  }

  // =================== FIND ALL TEAMS ===================
  async findAll(
    query: ListTeamsDto
  ): Promise<{ teams: Team[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.teamRepository
      .createQueryBuilder("team")
      .leftJoinAndSelect("team.division", "division")
      .leftJoinAndSelect("team.coach", "coach")
      .leftJoinAndSelect("team.assistantCoach", "assistantCoach")
      .where("team.isActive = :isActive", { isActive: true });

    // Search filter
    if (query.search) {
      queryBuilder.andWhere(
        "(team.name ILIKE :search OR team.code ILIKE :search)",
        { search: `%${query.search}%` }
      );
    }

    // Division filter
    if (query.divisionId) {
      queryBuilder.andWhere("team.divisionId = :divisionId", {
        divisionId: query.divisionId,
      });
    }

    // Level filter
    if (query.level) {
      queryBuilder.andWhere("team.level = :level", { level: query.level });
    }

    // Pagination
    const offset = (query.page - 1) * query.limit;
    const [teams, total] = await queryBuilder
      .orderBy("team.name", "ASC")
      .skip(offset)
      .take(query.limit)
      .getManyAndCount();

    return { teams, total, page: query.page, limit: query.limit };
  }

  // =================== FIND ONE TEAM ===================
  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository
      .createQueryBuilder("team")
      .leftJoinAndSelect("team.division", "division")
      .leftJoinAndSelect("team.coach", "coach")
      .leftJoinAndSelect("team.assistantCoach", "assistantCoach")
      .leftJoinAndSelect(
        "team.members",
        "members",
        "members.status = :status",
        { status: "active" }
      )
      .leftJoinAndSelect("members.player", "player")
      .where("team.id = :id", { id })
      .andWhere("team.isActive = :isActive", { isActive: true })
      .getOne();

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return team;
  }

  // =================== UPDATE TEAM ===================
  async update(id: number, updateDto: UpdateTeamDto): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id, isActive: true },
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    // Validate foreign keys if changing
    if (
      updateDto.divisionId ||
      updateDto.coachId ||
      updateDto.assistantCoachId
    ) {
      await this.validateForeignKeys(
        updateDto.divisionId || team.divisionId,
        updateDto.coachId || team.coachId,
        updateDto.assistantCoachId || team.assistantCoachId
      );
    }

    // Check unique constraints if changing
    if (updateDto.code && updateDto.code !== team.code) {
      const existingCode = await this.teamRepository.findOne({
        where: { code: updateDto.code },
      });
      if (existingCode) {
        throw new ConflictException(
          `Team code "${updateDto.code}" already exists`
        );
      }
    }

    if (updateDto.name && updateDto.name !== team.name) {
      const existingName = await this.teamRepository.findOne({
        where: { name: updateDto.name },
      });
      if (existingName) {
        throw new ConflictException(
          `Team name "${updateDto.name}" already exists`
        );
      }
    }

    // Update team
    const updateData: any = { ...updateDto };
    if (updateDto.foundedDate)
      updateData.foundedDate = new Date(updateDto.foundedDate);

    await this.teamRepository.update(id, updateData);
    return this.findOne(id);
  }

  // =================== ADD TEAM MEMBER ===================
  async addMember(
    teamId: number,
    addMemberDto: AddTeamMemberDto
  ): Promise<TeamMember> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, isActive: true },
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    // Validate player exists
    const player = await this.playerRepository.findOne({
      where: { id: addMemberDto.playerId, status: "active" },
    });
    if (!player) {
      throw new NotFoundException(
        `Player with ID ${addMemberDto.playerId} not found`
      );
    }

    // Check if player already in team
    const existingMember = await this.teamMemberRepository.findOne({
      where: { teamId, playerId: addMemberDto.playerId, status: "active" },
    });
    if (existingMember) {
      throw new ConflictException("Player is already in this team");
    }

    // Check jersey number uniqueness
    if (addMemberDto.jerseyNumber) {
      const existingJersey = await this.teamMemberRepository.findOne({
        where: {
          teamId,
          jerseyNumber: addMemberDto.jerseyNumber,
          status: "active",
        },
      });
      if (existingJersey) {
        throw new ConflictException(
          `Jersey number ${addMemberDto.jerseyNumber} is already taken`
        );
      }
    }

    // Check team capacity
    const currentMembers = await this.teamMemberRepository.count({
      where: { teamId, status: "active" },
    });
    if (currentMembers >= team.maxMembers) {
      throw new BadRequestException(
        `Team has reached maximum capacity of ${team.maxMembers} members`
      );
    }

    // Create team member
    const member = this.teamMemberRepository.create({
      teamId,
      playerId: addMemberDto.playerId,
      jerseyNumber: addMemberDto.jerseyNumber,
      position: addMemberDto.position,
      isCaptain: addMemberDto.isCaptain || false,
      isViceCaptain: addMemberDto.isViceCaptain || false,
      isStartingLineup: addMemberDto.isStartingLineup || false,
      status: addMemberDto.status || "active",
      joinedDate: addMemberDto.joinedDate
        ? new Date(addMemberDto.joinedDate)
        : new Date(),
      notes: addMemberDto.notes,
    });

    return this.teamMemberRepository.save(member);
  }

  // =================== GET TEAM MEMBERS ===================
  async getMembers(teamId: number): Promise<TeamMember[]> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, isActive: true },
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    return this.teamMemberRepository.find({
      where: { teamId, status: "active" },
      relations: ["player"],
      order: { jerseyNumber: "ASC", joinedDate: "ASC" },
    });
  }

  // =================== REMOVE TEAM MEMBER ===================
  async removeMember(teamId: number, memberId: number): Promise<void> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, isActive: true },
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const member = await this.teamMemberRepository.findOne({
      where: { id: memberId, teamId },
    });
    if (!member) {
      throw new NotFoundException(`Team member with ID ${memberId} not found`);
    }

    // Soft delete
    await this.teamMemberRepository.update(memberId, {
      status: "transferred",
      leftDate: new Date(),
    });
  }

  // =================== GET TEAM STATS ===================
  async getTeamStats(teamId: number, season?: string): Promise<TeamStats[]> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, isActive: true },
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const whereCondition: any = { teamId };
    if (season) {
      whereCondition.season = season;
    }

    return this.teamStatsRepository.find({
      where: whereCondition,
      order: { season: "DESC", tournament: "ASC" },
    });
  }

  // =================== DELETE TEAM ===================
  async remove(id: number): Promise<void> {
    const team = await this.teamRepository.findOne({
      where: { id, isActive: true },
    });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    // Check if team has active members
    const activeMembers = await this.teamMemberRepository.count({
      where: { teamId: id, status: "active" },
    });
    if (activeMembers > 0) {
      throw new BadRequestException(
        "Cannot delete team with active members. Remove all members first."
      );
    }

    // Soft delete
    await this.teamRepository.update(id, { isActive: false });
  }

  // =================== HELPER METHODS ===================
  private async validateForeignKeys(
    divisionId: number,
    coachId?: number,
    assistantCoachId?: number
  ): Promise<void> {
    // Validate division
    const division = await this.divisionRepository.findOne({
      where: { id: divisionId, isActive: true },
    });
    if (!division) {
      throw new BadRequestException(`Division with ID ${divisionId} not found`);
    }

    // Validate coach
    if (coachId) {
      const coach = await this.userRepository.findOne({
        where: { id: coachId, isActive: true },
      });
      if (!coach) {
        throw new BadRequestException(`Coach with ID ${coachId} not found`);
      }
    }

    // Validate assistant coach
    if (assistantCoachId) {
      const assistantCoach = await this.userRepository.findOne({
        where: { id: assistantCoachId, isActive: true },
      });
      if (!assistantCoach) {
        throw new BadRequestException(
          `Assistant coach with ID ${assistantCoachId} not found`
        );
      }
    }
  }
}
