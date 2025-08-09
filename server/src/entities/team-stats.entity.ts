import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique
} from 'typeorm';

@Entity('tbl_team_stats')
@Unique(['teamId', 'season', 'tournament'])
@Index(['teamId'])  // ✅ FIXED - Dùng property name
@Index(['season'])
export class TeamStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'team_id', type: 'int' })
  teamId: number;

  @Column({ type: 'varchar', length: 20 })
  season: string; // '2023-2024', '2024-2025'

  @Column({ type: 'varchar', length: 50, nullable: true })
  tournament?: string;

  @Column({ name: 'matches_played', type: 'int', default: 0 })
  matchesPlayed: number;

  @Column({ name: 'matches_won', type: 'int', default: 0 })
  matchesWon: number;

  @Column({ name: 'matches_lost', type: 'int', default: 0 })
  matchesLost: number;

  @Column({ name: 'sets_won', type: 'int', default: 0 })
  setsWon: number;

  @Column({ name: 'sets_lost', type: 'int', default: 0 })
  setsLost: number;

  @Column({ name: 'points_for', type: 'int', default: 0 })
  pointsFor: number;

  @Column({ name: 'points_against', type: 'int', default: 0 })
  pointsAgainst: number;

  @Column({ name: 'win_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 })
  winPercentage: number;

  @Column({ name: 'current_streak', type: 'int', default: 0 })
  currentStreak: number; // Positive for win streak, negative for loss streak

  @Column({ name: 'longest_win_streak', type: 'int', default: 0 })
  longestWinStreak: number;

  @Column({ name: 'ranking_position', type: 'int', nullable: true })
  rankingPosition?: number;

  @Column({ name: 'total_aces', type: 'int', default: 0 })
  totalAces: number;

  @Column({ name: 'total_blocks', type: 'int', default: 0 })
  totalBlocks: number;

  @Column({ name: 'total_kills', type: 'int', default: 0 })
  totalKills: number;

  @Column({ name: 'is_current_season', type: 'boolean', default: true })
  isCurrentSeason: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @ManyToOne('Team', 'teamStats')
  @JoinColumn({ name: 'team_id' })
  team: any;
}
