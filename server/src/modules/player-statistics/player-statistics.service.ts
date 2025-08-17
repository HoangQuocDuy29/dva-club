import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlayerStatistics } from "../../entities/player-statistics.entity";
import { Player } from "../../entities/player.entity";
import { CreatePlayerStatisticsDto } from "./dto/create-player-statistic.dto";
import { UpdatePlayerStatisticsDto } from "./dto/update-player-statistic.dto";
import { ListPlayerStatisticsDto } from "./dto/list-player-statistics.dto";
import { PlayerPerformanceAnalysisDto } from "./dto/player-performance-analysis.dto";

@Injectable()
export class PlayerStatisticsService {
  constructor(
    @InjectRepository(PlayerStatistics)
    private readonly statisticsRepository: Repository<PlayerStatistics>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>
  ) {}

  // =================== CREATE STATISTICS ===================
  async create(
    createDto: CreatePlayerStatisticsDto
  ): Promise<PlayerStatistics> {
    // Validate player exists
    const player = await this.playerRepository.findOne({
      where: { id: createDto.playerId, status: "active" },
    });
    if (!player) {
      throw new NotFoundException(
        `Player with ID ${createDto.playerId} not found`
      );
    }

    // Check unique constraint (playerId + season + tournament)
    const existing = await this.statisticsRepository.findOne({
      where: {
        playerId: createDto.playerId,
        season: createDto.season,
        tournament: createDto.tournament || null,
      },
    });

    if (existing) {
      throw new ConflictException(
        "Statistics already exist for this player, season, and tournament combination"
      );
    }

    // Create statistics
    const statistics = this.statisticsRepository.create({
      ...createDto,
      matchesPlayed: createDto.matchesPlayed || 0,
      totalPoints: createDto.totalPoints || 0,
      servesAttempted: createDto.servesAttempted || 0,
      servesSuccessful: createDto.servesSuccessful || 0,
      aces: createDto.aces || 0,
      serviceErrors: createDto.serviceErrors || 0,
      attacksAttempted: createDto.attacksAttempted || 0,
      attacksSuccessful: createDto.attacksSuccessful || 0,
      kills: createDto.kills || 0,
      attackErrors: createDto.attackErrors || 0,
      blocksSolo: createDto.blocksSolo || 0,
      blocksAssisted: createDto.blocksAssisted || 0,
      blockErrors: createDto.blockErrors || 0,
      digs: createDto.digs || 0,
      receptions: createDto.receptions || 0,
      receptionErrors: createDto.receptionErrors || 0,
      setsAttempted: createDto.setsAttempted || 0,
      assists: createDto.assists || 0,
      settingErrors: createDto.settingErrors || 0,
      isCurrentSeason:
        createDto.isCurrentSeason !== undefined
          ? createDto.isCurrentSeason
          : true,
    });

    const savedStatistics = await this.statisticsRepository.save(statistics);

    // Calculate percentages
    await this.recalculatePercentages(savedStatistics.id);

    return this.findOne(savedStatistics.id);
  }

  // =================== FIND ALL STATISTICS ===================
  async findAll(query: ListPlayerStatisticsDto): Promise<{
    statistics: PlayerStatistics[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.statisticsRepository
      .createQueryBuilder("stats")
      .leftJoinAndSelect("stats.player", "player");

    // Filters
    if (query.playerId) {
      queryBuilder.andWhere("stats.playerId = :playerId", {
        playerId: query.playerId,
      });
    }

    if (query.season) {
      queryBuilder.andWhere("stats.season = :season", { season: query.season });
    }

    if (query.tournament) {
      queryBuilder.andWhere("stats.tournament = :tournament", {
        tournament: query.tournament,
      });
    }

    if (query.isCurrentSeason !== undefined) {
      queryBuilder.andWhere("stats.isCurrentSeason = :isCurrentSeason", {
        isCurrentSeason: query.isCurrentSeason,
      });
    }

    // Pagination
    const offset = (query.page - 1) * query.limit;
    const [statistics, total] = await queryBuilder
      .orderBy("stats.season", "DESC")
      .addOrderBy("stats.totalPoints", "DESC")
      .skip(offset)
      .take(query.limit)
      .getManyAndCount();

    return { statistics, total, page: query.page, limit: query.limit };
  }

  // =================== FIND ONE STATISTICS ===================
  async findOne(id: number): Promise<PlayerStatistics> {
    const statistics = await this.statisticsRepository
      .createQueryBuilder("stats")
      .leftJoinAndSelect("stats.player", "player")
      .where("stats.id = :id", { id })
      .getOne();

    if (!statistics) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }

    return statistics;
  }

  // =================== GET PLAYER CAREER STATS ===================
  async getPlayerCareerStats(playerId: number): Promise<any> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });
    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    const careerStats = await this.statisticsRepository
      .createQueryBuilder("stats")
      .select([
        "SUM(stats.matchesPlayed) as totalMatches",
        "SUM(stats.totalPoints) as totalPoints",
        "SUM(stats.aces) as totalAces",
        "SUM(stats.kills) as totalKills",
        "SUM(stats.blocksSolo + stats.blocksAssisted) as totalBlocks",
        "SUM(stats.digs) as totalDigs",
        "SUM(stats.assists) as totalAssists",
        "AVG(stats.servePercentage) as avgServePercentage",
        "AVG(stats.attackPercentage) as avgAttackPercentage",
        "AVG(stats.receptionPercentage) as avgReceptionPercentage",
        "COUNT(*) as totalSeasons",
      ])
      .where("stats.playerId = :playerId", { playerId })
      .getRawOne();

    return {
      player,
      careerStats,
    };
  }

  // =================== GET PLAYER PERFORMANCE ANALYSIS ===================
  async getPlayerPerformanceAnalysis(
    playerId: number,
    query: PlayerPerformanceAnalysisDto
  ): Promise<any> {
    const queryBuilder = this.statisticsRepository
      .createQueryBuilder("stats")
      .leftJoinAndSelect("stats.player", "player")
      .where("stats.playerId = :playerId", { playerId });

    if (query.season) {
      queryBuilder.andWhere("stats.season = :season", { season: query.season });
    }

    if (query.tournament) {
      queryBuilder.andWhere("stats.tournament = :tournament", {
        tournament: query.tournament,
      });
    }

    const statistics = await queryBuilder.getMany();

    if (!statistics.length) {
      throw new NotFoundException(
        "No statistics found for this player with given criteria"
      );
    }

    // Analyze performance by metrics
    const analysis = {
      serving: {
        totalAttempts: statistics.reduce(
          (sum, s) => sum + s.servesAttempted,
          0
        ),
        totalSuccessful: statistics.reduce(
          (sum, s) => sum + s.servesSuccessful,
          0
        ),
        totalAces: statistics.reduce((sum, s) => sum + s.aces, 0),
        totalErrors: statistics.reduce((sum, s) => sum + s.serviceErrors, 0),
        successRate: 0,
        aceRate: 0,
        errorRate: 0,
      },
      attacking: {
        totalAttempts: statistics.reduce(
          (sum, s) => sum + s.attacksAttempted,
          0
        ),
        totalSuccessful: statistics.reduce(
          (sum, s) => sum + s.attacksSuccessful,
          0
        ),
        totalKills: statistics.reduce((sum, s) => sum + s.kills, 0),
        totalErrors: statistics.reduce((sum, s) => sum + s.attackErrors, 0),
        successRate: 0,
        killRate: 0,
        errorRate: 0,
      },
      blocking: {
        totalSolo: statistics.reduce((sum, s) => sum + s.blocksSolo, 0),
        totalAssisted: statistics.reduce((sum, s) => sum + s.blocksAssisted, 0),
        totalErrors: statistics.reduce((sum, s) => sum + s.blockErrors, 0),
        efficiency: 0,
      },
      defense: {
        totalDigs: statistics.reduce((sum, s) => sum + s.digs, 0),
        totalReceptions: statistics.reduce((sum, s) => sum + s.receptions, 0),
        totalReceptionErrors: statistics.reduce(
          (sum, s) => sum + s.receptionErrors,
          0
        ),
        digsPerMatch: 0,
        receptionSuccessRate: 0,
      },
      setting: {
        totalAttempts: statistics.reduce((sum, s) => sum + s.setsAttempted, 0),
        totalAssists: statistics.reduce((sum, s) => sum + s.assists, 0),
        totalErrors: statistics.reduce((sum, s) => sum + s.settingErrors, 0),
        assistRate: 0,
        errorRate: 0,
      },
    };

    // Calculate rates and percentages
    const totalMatches = statistics.reduce(
      (sum, s) => sum + s.matchesPlayed,
      0
    );

    // Serving rates
    if (analysis.serving.totalAttempts > 0) {
      analysis.serving.successRate =
        (analysis.serving.totalSuccessful / analysis.serving.totalAttempts) *
        100;
      analysis.serving.aceRate =
        (analysis.serving.totalAces / analysis.serving.totalAttempts) * 100;
      analysis.serving.errorRate =
        (analysis.serving.totalErrors / analysis.serving.totalAttempts) * 100;
    }

    // Attacking rates
    if (analysis.attacking.totalAttempts > 0) {
      analysis.attacking.successRate =
        (analysis.attacking.totalSuccessful /
          analysis.attacking.totalAttempts) *
        100;
      analysis.attacking.killRate =
        (analysis.attacking.totalKills / analysis.attacking.totalAttempts) *
        100;
      analysis.attacking.errorRate =
        (analysis.attacking.totalErrors / analysis.attacking.totalAttempts) *
        100;
    }

    // Blocking efficiency
    const totalBlockAttempts =
      analysis.blocking.totalSolo +
      analysis.blocking.totalAssisted +
      analysis.blocking.totalErrors;
    if (totalBlockAttempts > 0) {
      analysis.blocking.efficiency =
        ((analysis.blocking.totalSolo + analysis.blocking.totalAssisted) /
          totalBlockAttempts) *
        100;
    }

    // Defense stats
    if (totalMatches > 0) {
      analysis.defense.digsPerMatch = analysis.defense.totalDigs / totalMatches;
    }
    if (
      analysis.defense.totalReceptions + analysis.defense.totalReceptionErrors >
      0
    ) {
      analysis.defense.receptionSuccessRate =
        (analysis.defense.totalReceptions /
          (analysis.defense.totalReceptions +
            analysis.defense.totalReceptionErrors)) *
        100;
    }

    // Setting rates
    if (analysis.setting.totalAttempts > 0) {
      analysis.setting.assistRate =
        (analysis.setting.totalAssists / analysis.setting.totalAttempts) * 100;
      analysis.setting.errorRate =
        (analysis.setting.totalErrors / analysis.setting.totalAttempts) * 100;
    }

    return {
      player: statistics[0].player,
      totalMatches,
      analysis,
      detailedStats: statistics,
    };
  }

  // =================== GET POSITION BASED STATS ===================
  async getPositionBasedStats(playerId: number, season?: string): Promise<any> {
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
      relations: ["teamMembers"],
    });
    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    const queryBuilder = this.statisticsRepository
      .createQueryBuilder("stats")
      .where("stats.playerId = :playerId", { playerId });

    if (season) {
      queryBuilder.andWhere("stats.season = :season", { season });
    }

    const statistics = await queryBuilder.getMany();

    // Group stats by position (from player's primary/secondary positions)
    const positionStats = {
      primaryPosition: player.primaryPosition,
      secondaryPositions: player.secondaryPositions || [],
      statsBreakdown: {
        [player.primaryPosition || "Unknown"]: {
          matches: statistics.length,
          totalPoints: statistics.reduce((sum, s) => sum + s.totalPoints, 0),
          specialtyMetrics: this.getPositionSpecialtyMetrics(
            player.primaryPosition,
            statistics
          ),
        },
      },
    };

    // Add secondary positions stats
    if (player.secondaryPositions) {
      player.secondaryPositions.forEach((position) => {
        positionStats.statsBreakdown[position] = {
          matches: Math.floor(statistics.length * 0.3), // Estimate
          totalPoints: Math.floor(
            statistics.reduce((sum, s) => sum + s.totalPoints, 0) * 0.3
          ),
          specialtyMetrics: this.getPositionSpecialtyMetrics(
            position,
            statistics
          ),
        };
      });
    }

    return positionStats;
  }

  // =================== GET SEASON COMPARISON ===================
  async getSeasonComparison(playerId: number): Promise<any> {
    const statistics = await this.statisticsRepository.find({
      where: { playerId },
      order: { season: "ASC" },
    });

    if (!statistics.length) {
      throw new NotFoundException("No statistics found for this player");
    }

    const seasonComparison = statistics.map((stat) => ({
      season: stat.season,
      tournament: stat.tournament,
      matches: stat.matchesPlayed,
      totalPoints: stat.totalPoints,
      aces: stat.aces,
      kills: stat.kills,
      blocks: stat.blocksSolo + stat.blocksAssisted,
      digs: stat.digs,
      assists: stat.assists,
      servePercentage: stat.servePercentage,
      attackPercentage: stat.attackPercentage,
      receptionPercentage: stat.receptionPercentage,
    }));

    return {
      playerName: statistics[0].player?.fullName,
      totalSeasons: statistics.length,
      seasonComparison,
    };
  }

  // =================== UPDATE STATISTICS ===================
  async update(
    id: number,
    updateDto: UpdatePlayerStatisticsDto
  ): Promise<PlayerStatistics> {
    const statistics = await this.statisticsRepository.findOne({
      where: { id },
    });
    if (!statistics) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }

    // Validate player if changing
    if (updateDto.playerId && updateDto.playerId !== statistics.playerId) {
      const player = await this.playerRepository.findOne({
        where: { id: updateDto.playerId, status: "active" },
      });
      if (!player) {
        throw new NotFoundException(
          `Player with ID ${updateDto.playerId} not found`
        );
      }
    }

    await this.statisticsRepository.update(id, updateDto);
    await this.recalculatePercentages(id);

    return this.findOne(id);
  }

  // =================== RECALCULATE PERCENTAGES ===================
  async recalculatePercentages(id: number): Promise<PlayerStatistics> {
    const statistics = await this.statisticsRepository.findOne({
      where: { id },
    });
    if (!statistics) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }

    // Calculate serve percentage
    let servePercentage = 0;
    if (statistics.servesAttempted > 0) {
      servePercentage =
        (statistics.servesSuccessful / statistics.servesAttempted) * 100;
    }

    // Calculate attack percentage
    let attackPercentage = 0;
    if (statistics.attacksAttempted > 0) {
      attackPercentage =
        (statistics.attacksSuccessful / statistics.attacksAttempted) * 100;
    }

    // Calculate reception percentage
    let receptionPercentage = 0;
    if (statistics.receptions + statistics.receptionErrors > 0) {
      receptionPercentage =
        (statistics.receptions /
          (statistics.receptions + statistics.receptionErrors)) *
        100;
    }

    await this.statisticsRepository.update(id, {
      servePercentage: Math.round(servePercentage * 100) / 100,
      attackPercentage: Math.round(attackPercentage * 100) / 100,
      receptionPercentage: Math.round(receptionPercentage * 100) / 100,
    });

    return this.findOne(id);
  }

  // =================== DELETE STATISTICS ===================
  async remove(id: number): Promise<void> {
    const statistics = await this.statisticsRepository.findOne({
      where: { id },
    });
    if (!statistics) {
      throw new NotFoundException(`Statistics with ID ${id} not found`);
    }

    await this.statisticsRepository.delete(id);
  }

  // =================== HELPER METHODS ===================
  private getPositionSpecialtyMetrics(
    position: string,
    statistics: PlayerStatistics[]
  ): any {
    const totalStats = statistics.reduce(
      (acc, stat) => ({
        aces: acc.aces + stat.aces,
        kills: acc.kills + stat.kills,
        blocks: acc.blocks + stat.blocksSolo + stat.blocksAssisted,
        digs: acc.digs + stat.digs,
        assists: acc.assists + stat.assists,
      }),
      { aces: 0, kills: 0, blocks: 0, digs: 0, assists: 0 }
    );

    switch (position) {
      case "Setter":
        return {
          assists: totalStats.assists,
          assistsPerMatch:
            statistics.length > 0 ? totalStats.assists / statistics.length : 0,
          settingAccuracy:
            statistics.reduce((sum, s) => sum + s.servePercentage, 0) /
            statistics.length,
        };
      case "Libero":
        return {
          digs: totalStats.digs,
          digsPerMatch:
            statistics.length > 0 ? totalStats.digs / statistics.length : 0,
          receptionAccuracy:
            statistics.reduce((sum, s) => sum + s.receptionPercentage, 0) /
            statistics.length,
        };
      case "Outside Hitter":
      case "Opposite":
        return {
          kills: totalStats.kills,
          killsPerMatch:
            statistics.length > 0 ? totalStats.kills / statistics.length : 0,
          attackEfficiency:
            statistics.reduce((sum, s) => sum + s.attackPercentage, 0) /
            statistics.length,
        };
      case "Middle Blocker":
        return {
          blocks: totalStats.blocks,
          blocksPerMatch:
            statistics.length > 0 ? totalStats.blocks / statistics.length : 0,
          kills: totalStats.kills,
        };
      default:
        return {
          allRoundPerformance: {
            aces: totalStats.aces,
            kills: totalStats.kills,
            blocks: totalStats.blocks,
            digs: totalStats.digs,
            assists: totalStats.assists,
          },
        };
    }
  }
}
