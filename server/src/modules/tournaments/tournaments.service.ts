import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tournament } from "../../entities/tournament.entity";
import { TournamentSquad } from "../../entities/tournament-squad.entity";
import { Match } from "../../entities/match.entity";
import { CreateTournamentDto } from "./dto/create-tournament.dto";
import { UpdateTournamentDto } from "./dto/update-tournament.dto";
import { ListTournamentsDto } from "./dto/list-tournaments.dto";

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(TournamentSquad)
    private readonly tournamentSquadRepository: Repository<TournamentSquad>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>
  ) {}

  // =================== CREATE TOURNAMENT ===================
  async create(createDto: CreateTournamentDto): Promise<Tournament> {
    // Check unique code
    const existingCode = await this.tournamentRepository.findOne({
      where: { code: createDto.code },
    });
    if (existingCode) {
      throw new ConflictException(
        `Tournament code "${createDto.code}" already exists`
      );
    }

    // Validate dates
    this.validateTournamentDates(createDto);

    // Create tournament
    const tournament = this.tournamentRepository.create({
      ...createDto,
      startDate: new Date(createDto.startDate),
      endDate: new Date(createDto.endDate),
      registrationStartDate: new Date(createDto.registrationStartDate),
      registrationEndDate: new Date(createDto.registrationEndDate),
      status: createDto.status || "draft",
      isActive: createDto.isActive !== undefined ? createDto.isActive : true,
    });

    return this.tournamentRepository.save(tournament);
  }

  // =================== FIND ALL TOURNAMENTS ===================
  async findAll(
    query: ListTournamentsDto
  ): Promise<{
    tournaments: Tournament[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.tournamentRepository
      .createQueryBuilder("tournament")
      .where("tournament.isActive = :isActive", { isActive: true });

    // Filters
    if (query.type) {
      queryBuilder.andWhere("tournament.type = :type", { type: query.type });
    }

    if (query.level) {
      queryBuilder.andWhere("tournament.level = :level", {
        level: query.level,
      });
    }

    if (query.status) {
      queryBuilder.andWhere("tournament.status = :status", {
        status: query.status,
      });
    }

    // Pagination
    const offset = (query.page - 1) * query.limit;
    const [tournaments, total] = await queryBuilder
      .orderBy("tournament.startDate", "DESC")
      .skip(offset)
      .take(query.limit)
      .getManyAndCount();

    return { tournaments, total, page: query.page, limit: query.limit };
  }

  // =================== FIND ONE TOURNAMENT ===================
  async findOne(id: number): Promise<Tournament> {
    const tournament = await this.tournamentRepository
      .createQueryBuilder("tournament")
      .leftJoinAndSelect("tournament.tournamentSquads", "squads")
      .leftJoinAndSelect("squads.team", "team")
      .leftJoinAndSelect("tournament.matches", "matches")
      .leftJoinAndSelect("matches.homeTeam", "homeTeam")
      .leftJoinAndSelect("matches.awayTeam", "awayTeam")
      .where("tournament.id = :id", { id })
      .andWhere("tournament.isActive = :isActive", { isActive: true })
      .getOne();

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return tournament;
  }

  // =================== UPDATE TOURNAMENT ===================
  async update(
    id: number,
    updateDto: UpdateTournamentDto
  ): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, isActive: true },
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    // Check if can update (not started)
    if (tournament.status === "ongoing" || tournament.status === "completed") {
      throw new BadRequestException(
        "Cannot update tournament that is ongoing or completed"
      );
    }

    // Check unique code if changing
    if (updateDto.code && updateDto.code !== tournament.code) {
      const existingCode = await this.tournamentRepository.findOne({
        where: { code: updateDto.code },
      });
      if (existingCode) {
        throw new ConflictException(
          `Tournament code "${updateDto.code}" already exists`
        );
      }
    }

    // Validate dates if provided
    if (
      updateDto.startDate ||
      updateDto.endDate ||
      updateDto.registrationStartDate ||
      updateDto.registrationEndDate
    ) {
      const updatedDto = { ...tournament, ...updateDto };
      this.validateTournamentDates(updatedDto);
    }

    // Update tournament
    const updateData: any = { ...updateDto };
    if (updateDto.startDate)
      updateData.startDate = new Date(updateDto.startDate);
    if (updateDto.endDate) updateData.endDate = new Date(updateDto.endDate);
    if (updateDto.registrationStartDate)
      updateData.registrationStartDate = new Date(
        updateDto.registrationStartDate
      );
    if (updateDto.registrationEndDate)
      updateData.registrationEndDate = new Date(updateDto.registrationEndDate);

    await this.tournamentRepository.update(id, updateData);
    return this.findOne(id);
  }

  // =================== OPEN REGISTRATION ===================
  async openRegistration(id: number): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, isActive: true },
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    if (tournament.status !== "draft") {
      throw new BadRequestException(
        "Only draft tournaments can open registration"
      );
    }

    await this.tournamentRepository.update(id, { status: "registration_open" });
    return this.findOne(id);
  }

  // =================== START TOURNAMENT ===================
  async startTournament(id: number): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, isActive: true },
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    if (tournament.status !== "registration_open") {
      throw new BadRequestException(
        "Only tournaments with open registration can be started"
      );
    }

    // Check if has enough registered teams
    const registeredTeams = await this.tournamentSquadRepository.count({
      where: { tournamentId: id, status: "confirmed", isActive: true },
    });

    if (registeredTeams < 2) {
      throw new BadRequestException(
        "Tournament needs at least 2 confirmed teams to start"
      );
    }

    await this.tournamentRepository.update(id, { status: "ongoing" });
    return this.findOne(id);
  }

  // =================== COMPLETE TOURNAMENT ===================
  async completeTournament(id: number): Promise<Tournament> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, isActive: true },
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    if (tournament.status !== "ongoing") {
      throw new BadRequestException(
        "Only ongoing tournaments can be completed"
      );
    }

    await this.tournamentRepository.update(id, { status: "completed" });
    return this.findOne(id);
  }

  // =================== GET TOURNAMENT SQUADS ===================
  async getTournamentSquads(id: number): Promise<TournamentSquad[]> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, isActive: true },
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return this.tournamentSquadRepository.find({
      where: { tournamentId: id, isActive: true },
      relations: ["team", "squadMembers"],
      order: { seedNumber: "ASC", registrationDate: "ASC" },
    });
  }

  // =================== GET TOURNAMENT MATCHES ===================
  async getTournamentMatches(id: number): Promise<Match[]> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, isActive: true },
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    return this.matchRepository.find({
      where: { tournamentId: id, isActive: true },
      relations: ["homeTeam", "awayTeam", "winnerTeam", "referee"],
      order: { matchDate: "ASC" },
    });
  }

  // =================== DELETE TOURNAMENT ===================
  async remove(id: number): Promise<void> {
    const tournament = await this.tournamentRepository.findOne({
      where: { id, isActive: true },
    });
    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${id} not found`);
    }

    if (tournament.status === "ongoing") {
      throw new BadRequestException("Cannot delete ongoing tournament");
    }

    // Soft delete
    await this.tournamentRepository.update(id, { isActive: false });
  }

  // =================== HELPER METHODS ===================
  private validateTournamentDates(dto: any): void {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const regStartDate = new Date(dto.registrationStartDate);
    const regEndDate = new Date(dto.registrationEndDate);

    if (startDate >= endDate) {
      throw new BadRequestException(
        "Tournament start date must be before end date"
      );
    }

    if (regStartDate >= regEndDate) {
      throw new BadRequestException(
        "Registration start date must be before end date"
      );
    }

    if (regEndDate >= startDate) {
      throw new BadRequestException(
        "Registration must end before tournament starts"
      );
    }

    if (regStartDate >= startDate) {
      throw new BadRequestException(
        "Registration cannot start after tournament starts"
      );
    }
  }
}
