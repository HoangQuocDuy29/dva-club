import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index
} from 'typeorm';

@Entity('tbl_matches')
@Index(['tournamentId'])               // ✅ FIXED - Dùng property name
@Index(['homeTeamId', 'awayTeamId'])   // ✅ FIXED - Dùng property name
@Index(['matchDate'])                  // ✅ FIXED - Dùng property name
@Index(['status'])
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tournament_id', type: 'int' })
  tournamentId: number;

  @Column({ name: 'home_team_id', type: 'int' })
  homeTeamId: number;

  @Column({ name: 'away_team_id', type: 'int' })
  awayTeamId: number;

  @Column({ name: 'match_code', type: 'varchar', length: 20, unique: true })
  matchCode: string;

  @Column({ name: 'match_date', type: 'timestamp' })
  matchDate: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  venue?: string;

  @Column({ type: 'varchar', length: 20, default: 'scheduled' })
  status: string; // 'scheduled', 'ongoing', 'completed', 'cancelled', 'postponed'

  @Column({ name: 'home_team_score', type: 'int', default: 0 })
  homeTeamScore: number; // Số set thắng

  @Column({ name: 'away_team_score', type: 'int', default: 0 })
  awayTeamScore: number; // Số set thắng

  @Column({ name: 'total_sets', type: 'int', default: 0 })
  totalSets: number;

  @Column({ name: 'winner_team_id', type: 'int', nullable: true })
  winnerTeamId?: number;

  @Column({ name: 'match_duration', type: 'int', nullable: true })
  matchDuration?: number; // Thời gian thi đấu (phút)

  @Column({ name: 'referee_id', type: 'int', nullable: true })
  refereeId?: number;

  @Column({ name: 'assistant_referee_id', type: 'int', nullable: true })
  assistantRefereeId?: number;

  @Column({ name: 'match_notes', type: 'text', nullable: true })
  matchNotes?: string;

  @Column({ name: 'weather_condition', type: 'varchar', length: 50, nullable: true })
  weatherCondition?: string;

  @Column({ name: 'attendance', type: 'int', nullable: true })
  attendance?: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @ManyToOne('Tournament', 'matches')
  @JoinColumn({ name: 'tournament_id' })
  tournament: any;

  @ManyToOne('Team')
  @JoinColumn({ name: 'home_team_id' })
  homeTeam: any;

  @ManyToOne('Team')
  @JoinColumn({ name: 'away_team_id' })
  awayTeam: any;

  @ManyToOne('Team', { nullable: true })
  @JoinColumn({ name: 'winner_team_id' })
  winnerTeam?: any;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'referee_id' })
  referee?: any;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'assistant_referee_id' })
  assistantReferee?: any;

  @OneToMany('MatchPlayerStats', 'match')
  playerStats: any[];
}
