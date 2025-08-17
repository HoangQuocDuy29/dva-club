import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerStatistics } from "../../entities/player-statistics.entity";
import { Player } from "../../entities/player.entity";
import { PlayerStatisticsService } from "./player-statistics.service";
import { PlayerStatisticsController } from "./player-statistics.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlayerStatistics,
      Player, // For FK validation
    ]),
  ],
  controllers: [PlayerStatisticsController],
  providers: [PlayerStatisticsService],
  exports: [PlayerStatisticsService], // Export for match modules
})
export class PlayerStatisticsModule {}
