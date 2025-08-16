import { PartialType } from "@nestjs/swagger";
import { CreateTournamentSquadDto } from "./create-tournament-squad.dto";

export class UpdateTournamentSquadDto extends PartialType(
  CreateTournamentSquadDto
) {}
