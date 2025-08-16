import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TournamentSquad } from "../../entities";
import { Tournament } from "../../entities";
import { Team } from "../../entities";
import { CreateTournamentSquadDto } from "./dto/create-tournament-squad.dto";
import { UpdateTournamentSquadDto } from "./dto/update-tournament-squad.dto";
import { ListTournamentSquadsDto } from "./dto/list-tournament-squads.dto";

@Injectable()
export class TournamentSquadsService {
  constructor(
    @InjectRepository(TournamentSquad)
    private readonly squadRepository: Repository<TournamentSquad>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>
  ) {}

  // =================== CREATE SQUAD ===================
  async create(createDto: CreateTournamentSquadDto): Promise<TournamentSquad> {
    // Validate foreign keys first
    await this.validateForeignKeys(createDto.tournamentId, createDto.teamId);

    // Check unique constraint (tournamentId + teamId)
    const existingSquad = await this.squadRepository.findOne({
      where: {
        tournamentId: createDto.tournamentId,
        teamId: createDto.teamId,
      },
    });

    if (existingSquad) {
      throw new ConflictException(
        "Team already registered for this tournament"
      );
    }

    // Validate seed number uniqueness
    if (createDto.seedNumber) {
      const existingSeed = await this.squadRepository.findOne({
        where: {
          tournamentId: createDto.tournamentId,
          seedNumber: createDto.seedNumber,
        },
      });

      if (existingSeed) {
        throw new ConflictException(
          `Seed number ${createDto.seedNumber} already taken`
        );
      }
    }

    // Create squad
    const squad = this.squadRepository.create({
      tournamentId: createDto.tournamentId,
      teamId: createDto.teamId,
      squadName: createDto.squadName,
      status: createDto.status || "registered",
      seedNumber: createDto.seedNumber,
      groupAssignment: createDto.groupAssignment,
      totalPlayers: 0,
      captainId: createDto.captainId,
      coachId: createDto.coachId,
      notes: createDto.notes,
      isActive: createDto.isActive !== undefined ? createDto.isActive : true,
      registrationDate: new Date(),
    });

    return this.squadRepository.save(squad);
  }

  // =================== FIND ALL SQUADS ===================
  async findAll(query: ListTournamentSquadsDto): Promise<{
    squads: TournamentSquad[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.squadRepository
      .createQueryBuilder("squad")
      .leftJoinAndSelect("squad.tournament", "tournament")
      .leftJoinAndSelect("squad.team", "team")
      .leftJoinAndSelect("squad.squadMembers", "members")
      .where("squad.isActive = :isActive", { isActive: true });

    // Filters
    if (query.tournamentId) {
      queryBuilder.andWhere("squad.tournamentId = :tournamentId", {
        tournamentId: query.tournamentId,
      });
    }

    if (query.teamId) {
      queryBuilder.andWhere("squad.teamId = :teamId", { teamId: query.teamId });
    }

    if (query.status) {
      queryBuilder.andWhere("squad.status = :status", { status: query.status });
    }

    if (query.groupAssignment) {
      queryBuilder.andWhere("squad.groupAssignment = :group", {
        group: query.groupAssignment,
      });
    }

    // Pagination
    const offset = (query.page - 1) * query.limit;
    const [squads, total] = await queryBuilder
      .orderBy("squad.seedNumber", "ASC")
      .addOrderBy("squad.registrationDate", "ASC")
      .skip(offset)
      .take(query.limit)
      .getManyAndCount();

    return { squads, total, page: query.page, limit: query.limit };
  }

  // =================== FIND ONE SQUAD ===================
  async findOne(id: number): Promise<TournamentSquad> {
    const squad = await this.squadRepository
      .createQueryBuilder("squad")
      .leftJoinAndSelect("squad.tournament", "tournament")
      .leftJoinAndSelect("squad.team", "team")
      .leftJoinAndSelect("squad.squadMembers", "members")
      .where("squad.id = :id", { id })
      .andWhere("squad.isActive = :isActive", { isActive: true })
      .getOne();

    if (!squad) {
      throw new NotFoundException(`Squad with ID ${id} not found`);
    }

    return squad;
  }

  // =================== UPDATE SQUAD ===================
  async update(
    id: number,
    updateDto: UpdateTournamentSquadDto
  ): Promise<TournamentSquad> {
    const squad = await this.squadRepository.findOne({
      where: { id, isActive: true },
    });
    if (!squad) {
      throw new NotFoundException(`Squad with ID ${id} not found`);
    }

    // Validate foreign keys if changing
    if (updateDto.tournamentId || updateDto.teamId) {
      await this.validateForeignKeys(
        updateDto.tournamentId || squad.tournamentId,
        updateDto.teamId || squad.teamId
      );
    }

    // Validate seed number if changing
    if (updateDto.seedNumber && updateDto.seedNumber !== squad.seedNumber) {
      const existingSeed = await this.squadRepository.findOne({
        where: {
          tournamentId: squad.tournamentId,
          seedNumber: updateDto.seedNumber,
        },
      });

      if (existingSeed && existingSeed.id !== id) {
        throw new ConflictException(
          `Seed number ${updateDto.seedNumber} already taken`
        );
      }
    }

    await this.squadRepository.update(id, updateDto);
    return this.findOne(id);
  }

  // =================== CONFIRM SQUAD ===================
  async confirmSquad(id: number): Promise<TournamentSquad> {
    const squad = await this.squadRepository.findOne({
      where: { id, isActive: true },
    });
    if (!squad) {
      throw new NotFoundException(`Squad with ID ${id} not found`);
    }

    if (squad.status !== "registered") {
      throw new BadRequestException("Only registered squads can be confirmed");
    }

    await this.squadRepository.update(id, { status: "confirmed" });
    return this.findOne(id);
  }

  // =================== ASSIGN GROUP ===================
  async assignGroup(
    id: number,
    groupAssignment: string,
    seedNumber?: number
  ): Promise<TournamentSquad> {
    const squad = await this.squadRepository.findOne({
      where: { id, isActive: true },
    });
    if (!squad) {
      throw new NotFoundException(`Squad with ID ${id} not found`);
    }

    // Validate seed number if provided
    if (seedNumber) {
      const existingSeed = await this.squadRepository.findOne({
        where: {
          tournamentId: squad.tournamentId,
          seedNumber: seedNumber,
        },
      });

      if (existingSeed && existingSeed.id !== id) {
        throw new ConflictException(`Seed number ${seedNumber} already taken`);
      }
    }

    const updateData: any = { groupAssignment };
    if (seedNumber) updateData.seedNumber = seedNumber;

    await this.squadRepository.update(id, updateData);
    return this.findOne(id);
  }

  // =================== WITHDRAW SQUAD ===================
  async withdrawSquad(id: number): Promise<TournamentSquad> {
    const squad = await this.squadRepository.findOne({
      where: { id, isActive: true },
    });
    if (!squad) {
      throw new NotFoundException(`Squad with ID ${id} not found`);
    }

    if (squad.status === "withdrawn") {
      throw new BadRequestException("Squad is already withdrawn");
    }

    await this.squadRepository.update(id, { status: "withdrawn" });
    return this.findOne(id);
  }

  // =================== DELETE SQUAD ===================
  async remove(id: number): Promise<void> {
    const squad = await this.squadRepository.findOne({
      where: { id, isActive: true },
    });
    if (!squad) {
      throw new NotFoundException(`Squad with ID ${id} not found`);
    }

    // Soft delete
    await this.squadRepository.update(id, { isActive: false });
  }

  // =================== HELPER METHODS ===================
  private async validateForeignKeys(
    tournamentId: number,
    teamId: number
  ): Promise<void> {
    // Validate tournament exists and is active
    const tournament = await this.tournamentRepository.findOne({
      where: { id: tournamentId, isActive: true },
    });
    if (!tournament) {
      throw new BadRequestException(
        `Tournament with ID ${tournamentId} not found or inactive`
      );
    }

    // Check tournament status allows registration
    if (!["draft", "registration_open"].includes(tournament.status)) {
      throw new BadRequestException("Tournament registration is not open");
    }

    // Validate team exists and is active
    const team = await this.teamRepository.findOne({
      where: { id: teamId, isActive: true },
    });
    if (!team) {
      throw new BadRequestException(
        `Team with ID ${teamId} not found or inactive`
      );
    }
  }
}
