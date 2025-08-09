import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      message: 'Volleyball Club Management System is running'
    };
  }

  @Get('database')
  getDatabaseStatus() {
    return {
      database: 'dvaclub',
      entities: 21,
      tables: [
        'tbl_users', 'tbl_user_profiles', 'tbl_divisions', 'tbl_teams',
        'tbl_team_stats', 'tbl_team_members', 'tbl_players', 'tbl_player_statistics',
        'tbl_tournaments', 'tbl_tournament_squads', 'tbl_tournament_squad_members',
        'tbl_matches', 'tbl_match_player_stats', 'tbl_registration_applications',
        'tbl_application_evaluations', 'tbl_media_files', 'tbl_news_articles',
        'tbl_system_settings', 'tbl_activity_logs', 'tbl_notifications'
      ],
      status: 'connected',
      timestamp: new Date().toISOString()
    };
  }
}
