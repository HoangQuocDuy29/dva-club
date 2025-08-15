import {
  Injectable,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Division } from "../../../entities/division.entity";
import { CreateDivisionDto } from "../dto/create-division.dto";

@Injectable()
export class CreateDivisionService {
  constructor(
    @InjectRepository(Division)
    private readonly divisionRepository: Repository<Division>
  ) {}

  async execute(createDto: CreateDivisionDto): Promise<Division> {
    // Validate unique constraints
    await this.validateUnique(createDto);

    // Validate business rules
    this.validateDates(createDto);

    // Process and save
    const divisionData = this.processData(createDto);
    return this.divisionRepository.save(divisionData);
  }

  private async validateUnique(createDto: CreateDivisionDto): Promise<void> {
    const existingCode = await this.divisionRepository.findOne({
      where: { code: createDto.code },
    });
    if (existingCode) {
      throw new ConflictException(
        `Division code "${createDto.code}" already exists`
      );
    }

    const existingName = await this.divisionRepository.findOne({
      where: { name: createDto.name },
    });
    if (existingName) {
      throw new ConflictException(
        `Division name "${createDto.name}" already exists`
      );
    }
  }

  private validateDates(createDto: CreateDivisionDto): void {
    if (createDto.seasonStart && createDto.seasonEnd) {
      const startDate = new Date(createDto.seasonStart);
      const endDate = new Date(createDto.seasonEnd);

      if (startDate >= endDate) {
        throw new BadRequestException(
          "Season start date must be before end date"
        );
      }
    }
  }

  private processData(createDto: CreateDivisionDto): Partial<Division> {
    // ✅ FIX: Create object với đúng types cho Entity
    const data: Partial<Division> = {
      name: createDto.name,
      code: createDto.code,
      description: createDto.description,
      level: createDto.level,
      ageGroup: createDto.ageGroup,
      genderCategory: createDto.genderCategory,
      maxTeams: createDto.maxTeams,
      registrationFee: createDto.registrationFee,
      isActive: createDto.isActive ?? true,
      displayOrder: createDto.displayOrder ?? 0,
    };

    // ✅ FIX: Convert date strings to Date objects RIÊNG BIỆT
    if (createDto.seasonStart) {
      data.seasonStart = new Date(createDto.seasonStart);
    }
    if (createDto.seasonEnd) {
      data.seasonEnd = new Date(createDto.seasonEnd);
    }

    return data;
  }
}
