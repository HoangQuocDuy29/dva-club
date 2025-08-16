import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Player } from "../../entities";
import { PlayersService } from "./players.service";
import { PlayersController } from "./players.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService], // Export for Teams Module integration
})
export class PlayersModule {}
