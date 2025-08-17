import { PartialType } from "@nestjs/swagger";
import { CreatePlayerStatisticsDto } from "../dto/create-player-statistic.dto";

export class UpdatePlayerStatisticsDto extends PartialType(
  CreatePlayerStatisticsDto
) {}
