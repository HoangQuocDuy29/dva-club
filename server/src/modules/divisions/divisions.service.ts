import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Division } from "../../entities/division.entity";
import { CreateDivisionDto } from "./dto/create-division.dto";
import { UpdateDivisionDto } from "./dto/update-division.dto";
import { ListDivisionsDto } from "./dto/list-divisions.dto";

@Injectable()
export class DivisionsService {
  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>
  ) {}

  // =================== CREATE ===================
  async create(createDto: CreateDivisionDto): Promise<Division> {
    // Check unique
    const existingCode = await this.divisionRepository.findOne({
      where: { code: createDto.code },
    });
    if (existingCode) throw new ConflictException("Code already exists");

    const existingName = await this.divisionRepository.findOne({
      where: { name: createDto.name },
    });
    if (existingName) throw new ConflictException("Name already exists");

    // Validate dates
    if (createDto.seasonStart && createDto.seasonEnd) {
      const start = new Date(createDto.seasonStart);
      const end = new Date(createDto.seasonEnd);
      if (start >= end) throw new BadRequestException("Invalid season dates");
    }

    // Create
    const division = this.divisionRepository.create({
      ...createDto,
      seasonStart: createDto.seasonStart
        ? new Date(createDto.seasonStart)
        : null,
      seasonEnd: createDto.seasonEnd ? new Date(createDto.seasonEnd) : null,
      isActive: createDto.isActive ?? true,
      displayOrder: createDto.displayOrder ?? 0,
    });

    return this.divisionRepository.save(division);
  }

  // =================== READ ALL ===================
  async findAll(
    query: ListDivisionsDto
  ): Promise<{
    divisions: Division[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.divisionRepository
      .createQueryBuilder("division")
      .where("division.isActive = :isActive", { isActive: true });

    // Search
    if (query.search) {
      queryBuilder.andWhere(
        "(division.name ILIKE :search OR division.code ILIKE :search)",
        { search: `%${query.search}%` }
      );
    }

    // Level filter
    if (query.level) {
      queryBuilder.andWhere("division.level = :level", { level: query.level });
    }

    // Pagination
    const offset = (query.page - 1) * query.limit;
    const [divisions, total] = await queryBuilder
      .orderBy("division.displayOrder", "ASC")
      .skip(offset)
      .take(query.limit)
      .getManyAndCount();

    return { divisions, total, page: query.page, limit: query.limit };
  }

  // =================== READ ONE ===================
  async findOne(id: number): Promise<Division> {
    const division = await this.divisionRepository.findOne({
      where: { id, isActive: true },
    });

    if (!division) {
      throw new NotFoundException(`Division with ID ${id} not found`);
    }

    return division;
  }

  // =================== UPDATE ===================
  async update(id: number, updateDto: UpdateDivisionDto): Promise<Division> {
    const division = await this.divisionRepository.findOne({ where: { id } });
    if (!division) {
      throw new NotFoundException(`Division with ID ${id} not found`);
    }

    // Check unique if changing
    if (updateDto.code && updateDto.code !== division.code) {
      const existingCode = await this.divisionRepository.findOne({
        where: { code: updateDto.code },
      });
      if (existingCode) throw new ConflictException("Code already exists");
    }

    if (updateDto.name && updateDto.name !== division.name) {
      const existingName = await this.divisionRepository.findOne({
        where: { name: updateDto.name },
      });
      if (existingName) throw new ConflictException("Name already exists");
    }

    // Validate dates
    if (updateDto.seasonStart && updateDto.seasonEnd) {
      const start = new Date(updateDto.seasonStart);
      const end = new Date(updateDto.seasonEnd);
      if (start >= end) throw new BadRequestException("Invalid season dates");
    }

    // Update
    const updateData: any = { ...updateDto };
    if (updateDto.seasonStart)
      updateData.seasonStart = new Date(updateDto.seasonStart);
    if (updateDto.seasonEnd)
      updateData.seasonEnd = new Date(updateDto.seasonEnd);

    await this.divisionRepository.update(id, updateData);
    return this.divisionRepository.findOne({ where: { id } });
  }

  // =================== DELETE ===================
  async remove(id: number): Promise<void> {
    const division = await this.divisionRepository.findOne({ where: { id } });
    if (!division) {
      throw new NotFoundException(`Division with ID ${id} not found`);
    }

    // Soft delete
    await this.divisionRepository.update(id, { isActive: false });
  }
}
