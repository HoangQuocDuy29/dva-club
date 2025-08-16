import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tournament } from "../../entities/tournament.entity";
import { TournamentSquad } from "../../entities/tournament-squad.entity";
import { Match } from "../../entities/match.entity";
import { TournamentsService } from "./tournaments.service";
import { TournamentsController } from "./tournaments.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tournament,
      TournamentSquad, // For squad counting
      Match, // For match management
    ]),
  ],
  controllers: [TournamentsController],
  providers: [TournamentsService],
  exports: [TournamentsService], // Export for other modules
})
export class TournamentsModule {}
