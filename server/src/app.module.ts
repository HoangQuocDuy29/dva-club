//E:\2_NodeJs\DVA_Club\volleyball-club-management\server\src\app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static"; // ✅ THÊM IMPORT NÀY
import { join } from "path"; // ✅ THÊM IMPORT NÀY
import { DatabaseModule } from "./database/database.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

// ✅ Import Auth Module
import { AuthModule } from "./modules/auth/auth.module";

// ✅ Import Users Module
import { UsersModule } from "./modules/users/users.module";

// ✅ ADD: Import DivisionsModule

import { DivisionsModule } from "./modules/divisions/divisions.module";
//import { DivisionsModule } from './divisions/divisions.module';
import { PlayersModule } from "../src/modules/players/players.module";
import { TournamentSquadsModule } from "./modules/tournament-squads/tournament-squads.module";
import { TournamentsModule } from "./modules/tournaments/tournaments.module";
import { TeamsModule } from "./modules/teams/teams.module";
@Module({
  imports: [
    // ✅ THÊM SERVESTATICMODULE VÀO ĐẦU IMPORTS ARRAY
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "storage"),
      serveRoot: "/storage",
      exclude: ["/api*"], // Exclude API routes
      serveStaticOptions: {
        index: false,
        dotfiles: "deny",
        redirect: false,
      },
    }),

    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      cache: true,
    }),

    // Database module with all entities
    DatabaseModule,

    // ✅ Authentication module
    AuthModule,

    // ✅ Users management module
    UsersModule,

    // ✅ ADD: Divisions module
    DivisionsModule,

    // ✅ Players module
    PlayersModule,

    TournamentSquadsModule,

    TournamentsModule,

    TeamsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
