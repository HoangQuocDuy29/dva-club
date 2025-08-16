import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TournamentSquad } from "../../entities/tournament-squad.entity";
import { Tournament } from "../../entities/tournament.entity";
import { Team } from "../../entities";
import { TournamentSquadsService } from "./tournament-squads.service";
import { TournamentSquadsController } from "./tournament-squads.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TournamentSquad,
      Tournament, // For FK validation
      Team, // For FK validation
    ]),
  ],
  controllers: [TournamentSquadsController],
  providers: [TournamentSquadsService],
  exports: [TournamentSquadsService],
})
export class TournamentSquadsModule {}
