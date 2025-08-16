import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Team } from "../../entities/team.entity";
import { TeamMember } from "../../entities/team-member.entity";
import { TeamStats } from "../../entities/team-stats.entity";
import { Division } from "../../entities/division.entity";
import { User } from "../../entities/user.entity";
import { Player } from "../../entities/player.entity";
import { TeamsService } from "./teams.service";
import { TeamsController } from "./teams.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Team,
      TeamMember,
      TeamStats,
      Division, // For FK validation
      User, // For coach validation
      Player, // For member validation
    ]),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService], // Export for other modules
})
export class TeamsModule {}
