import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { UserRole } from "../../auth/enums/auth-status.enum";
import { CreateDivisionDto } from "../dto/create-division.dto";
import { CreateDivisionService } from "../services/create-division.service";

@ApiTags("Divisions - Admin")
@ApiBearerAuth()
@Controller("api/v1/admin/divisions")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.MANAGER)
export class CreateDivisionController {
  constructor(private readonly createDivisionService: CreateDivisionService) {}

  @Post()
  @ApiOperation({ summary: "Create new division" })
  async create(@Body() createDto: CreateDivisionDto, @CurrentUser() user: any) {
    const division = await this.createDivisionService.execute(createDto);

    return {
      success: true,
      data: division,
      message: "Division created successfully",
    };
  }
}
