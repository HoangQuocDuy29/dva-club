import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { CreatePlayerDto } from "./dto/create-player.dto";
import { UpdatePlayerDto } from "./dto/update-player.dto";
import { ListPlayersDto } from "./dto/list-players.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Player } from "../../entities";
import { Repository } from "typeorm";
@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>
  ) {}
  // =================== CREATE ===================
  async create(createDto: CreatePlayerDto): Promise<Player> {
    //Check unique constraints
    if (createDto.userId) {
      const existingUserId = await this.playerRepository.findOne({
        where: { userId: createDto.userId },
      });
      if (existingUserId)
        throw new ConflictException("User already has a player profile");
    }
    if (createDto.playerCode) {
      const existingCode = await this.playerRepository.findOne({
        where: { playerCode: createDto.playerCode },
      });
      if (existingCode)
        throw new ConflictException("Player code already exists");
    }
    // Validate business rules
    if (createDto.dateOfBirth) {
      const birthDate = new Date(createDto.dateOfBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 10 || age > 60)
        throw new BadRequestException(
          "Player must be between 10 and 60 years old"
        );
    }
    // Auto-generate player code if not provided
    if (!createDto.playerCode) {
      createDto.playerCode = await this.generatePlayerCode();
    }
    // Create player
    const player = this.playerRepository.create({
      ...createDto,
      dateOfBirth: createDto.dateOfBirth
        ? new Date(createDto.dateOfBirth)
        : null,
      joinDate: createDto.joinDate ? new Date(createDto.joinDate) : null,
      skillLevel: createDto.skillLevel || "beginner",
      status: createDto.status || "active",
    });
    return this.playerRepository.save(player);
  }
  // generatePlayerCode
  private async generatePlayerCode(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.playerRepository.count();
    const sequence = (count + 1).toString().padStart(3, "0");
    return `PL-${year}-${sequence}`;
  }
  // =================== READ ALL ===================
  async findAll(query: ListPlayersDto): Promise<{
    players: Player[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.playerRepository
      .createQueryBuilder("player")
      .where("player.status != :status", { status: "deleted" });

    // Search by full name or player code
    if (query.search) {
      queryBuilder.andWhere(
        "(player.fullName ILIKE :search OR player.playerCode ILIKE :search)",
        { search: `%${query.search}%` }
      );
    }

    // Filters
    if (query.gender) {
      queryBuilder.andWhere("player.gender = :gender", {
        gender: query.gender,
      });
    }

    if (query.position) {
      queryBuilder.andWhere("player.primaryPosition = :position", {
        position: query.position,
      });
    }

    if (query.skillLevel) {
      queryBuilder.andWhere("player.skillLevel = :skillLevel", {
        skillLevel: query.skillLevel,
      });
    }

    if (query.status) {
      queryBuilder.andWhere("player.status = :status", {
        status: query.status,
      });
    }

    // Pagination
    const offset = (query.page - 1) * query.limit;
    const [players, total] = await queryBuilder
      .orderBy("player.fullName", "ASC")
      .skip(offset)
      .take(query.limit)
      .getManyAndCount();

    return { players, total, page: query.page, limit: query.limit };
  }

  // =================== READ ONE ===================
  async findOne(id: number): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id },
      relations: ["user"], // Load user relationship if needed
    });

    if (!player || player.status === "deleted") {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return player;
  }

  // =================== UPDATE ===================
  async update(id: number, updateDto: UpdatePlayerDto): Promise<Player> {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player || player.status === "deleted") {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    // Check unique constraints if changing
    if (updateDto.userId && updateDto.userId !== player.userId) {
      const existingUserId = await this.playerRepository.findOne({
        where: { userId: updateDto.userId },
      });
      if (existingUserId)
        throw new ConflictException("User already has a player profile");
    }

    if (updateDto.playerCode && updateDto.playerCode !== player.playerCode) {
      const existingCode = await this.playerRepository.findOne({
        where: { playerCode: updateDto.playerCode },
      });
      if (existingCode)
        throw new ConflictException("Player code already exists");
    }

    // Update player
    const updateData: any = { ...updateDto };
    if (updateDto.dateOfBirth)
      updateData.dateOfBirth = new Date(updateDto.dateOfBirth);
    if (updateDto.joinDate) updateData.joinDate = new Date(updateDto.joinDate);

    await this.playerRepository.update(id, updateData);
    return this.playerRepository.findOne({ where: { id } });
  }

  // =================== DELETE ===================
  async remove(id: number): Promise<void> {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player || player.status === "deleted") {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    // Soft delete - change status instead of hard delete
    await this.playerRepository.update(id, { status: "deleted" });
  }
}
