import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Division } from "../../entities/division.entity";
import { CreateDivisionController } from "./controllers/create-division.controller";
import { CreateDivisionService } from "./services/create-division.service";

@Module({
  imports: [TypeOrmModule.forFeature([Division])],
  controllers: [CreateDivisionController],
  providers: [CreateDivisionService],
})
export class DivisionsModule {}
