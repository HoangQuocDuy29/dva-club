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

@Entity('tbl_match_player_stats')
@Unique(['matchId', 'playerId'])
@Index(['matchId'])    // ✅ FIXED - Dùng property name
@Index(['playerId'])   // ✅ FIXED - Dùng property name
export class MatchPlayerStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'match_id', type: 'int' })
  matchId: number;

  @Column({ name: 'player_id', type: 'int' })
  playerId: number;

  @Column({ name: 'jersey_number', type: 'int', nullable: true })
  jerseyNumber?: number;

  @Column({ name: 'position_played', type: 'varchar', length: 30, nullable: true })
  positionPlayed?: string;

  @Column({ name: 'minutes_played', type: 'int', default: 0 })
  minutesPlayed: number;

  // Serving Stats
  @Column({ name: 'serves_attempted', type: 'int', default: 0 })
  servesAttempted: number;

  @Column({ name: 'serves_successful', type: 'int', default: 0 })
  servesSuccessful: number;

  @Column({ name: 'aces', type: 'int', default: 0 })
  aces: number;

  @Column({ name: 'service_errors', type: 'int', default: 0 })
  serviceErrors: number;

  // Attacking Stats
  @Column({ name: 'attacks_attempted', type: 'int', default: 0 })
  attacksAttempted: number;

  @Column({ name: 'attacks_successful', type: 'int', default: 0 })
  attacksSuccessful: number;

  @Column({ name: 'attack_errors', type: 'int', default: 0 })
  attackErrors: number;

  @Column({ name: 'kills', type: 'int', default: 0 })
  kills: number;

  // Blocking Stats
  @Column({ name: 'blocks_attempted', type: 'int', default: 0 })
  blocksAttempted: number;

  @Column({ name: 'blocks_successful', type: 'int', default: 0 })
  blocksSuccessful: number;

  @Column({ name: 'block_assists', type: 'int', default: 0 })
  blockAssists: number;

  // Defensive Stats
  @Column({ name: 'digs', type: 'int', default: 0 })
  digs: number;

  @Column({ name: 'receptions', type: 'int', default: 0 })
  receptions: number;

  @Column({ name: 'reception_errors', type: 'int', default: 0 })
  receptionErrors: number;

  // Setting Stats
  @Column({ name: 'sets', type: 'int', default: 0 })
  sets: number;

  @Column({ name: 'assists', type: 'int', default: 0 })
  assists: number;

  @Column({ name: 'setting_errors', type: 'int', default: 0 })
  settingErrors: number;

  // Other Stats
  @Column({ name: 'total_points', type: 'int', default: 0 })
  totalPoints: number;

  @Column({ name: 'yellow_cards', type: 'int', default: 0 })
  yellowCards: number;

  @Column({ name: 'red_cards', type: 'int', default: 0 })
  redCards: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @ManyToOne('Match', 'playerStats')
  @JoinColumn({ name: 'match_id' })
  match: any;

  @ManyToOne('Player')
  @JoinColumn({ name: 'player_id' })
  player: any;
}
