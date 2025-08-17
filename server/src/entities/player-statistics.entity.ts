import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from "typeorm";

@Entity("tbl_player_statistics")
@Unique(["playerId", "season", "tournament"])
@Index(["playerId"])
@Index(["season"])
@Index(["tournament"])
export class PlayerStatistics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "player_id", type: "int" })
  playerId: number;

  @Column({ type: "varchar", length: 20 })
  season: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  tournament?: string;

  @Column({ name: "matches_played", type: "int", default: 0 })
  matchesPlayed: number;

  @Column({ name: "total_points", type: "int", default: 0 })
  totalPoints: number;

  // Serving Statistics
  @Column({ name: "serves_attempted", type: "int", default: 0 })
  servesAttempted: number;

  @Column({ name: "serves_successful", type: "int", default: 0 })
  servesSuccessful: number;

  @Column({ name: "aces", type: "int", default: 0 })
  aces: number;

  @Column({ name: "service_errors", type: "int", default: 0 })
  serviceErrors: number;

  // Attacking Statistics
  @Column({ name: "attacks_attempted", type: "int", default: 0 })
  attacksAttempted: number;

  @Column({ name: "attacks_successful", type: "int", default: 0 })
  attacksSuccessful: number;

  @Column({ name: "kills", type: "int", default: 0 })
  kills: number;

  @Column({ name: "attack_errors", type: "int", default: 0 })
  attackErrors: number;

  // Blocking Statistics
  @Column({ name: "blocks_solo", type: "int", default: 0 })
  blocksSolo: number;

  @Column({ name: "blocks_assisted", type: "int", default: 0 })
  blocksAssisted: number;

  @Column({ name: "block_errors", type: "int", default: 0 })
  blockErrors: number;

  // Defensive Statistics
  @Column({ name: "digs", type: "int", default: 0 })
  digs: number;

  @Column({ name: "receptions", type: "int", default: 0 })
  receptions: number;

  @Column({ name: "reception_errors", type: "int", default: 0 })
  receptionErrors: number;

  // Setting Statistics
  @Column({ name: "sets_attempted", type: "int", default: 0 })
  setsAttempted: number;

  @Column({ name: "assists", type: "int", default: 0 })
  assists: number;

  @Column({ name: "setting_errors", type: "int", default: 0 })
  settingErrors: number;

  // Calculated Percentages
  @Column({
    name: "serve_percentage",
    type: "decimal",
    precision: 5,
    scale: 2,
    default: 0,
  })
  servePercentage: number;

  @Column({
    name: "attack_percentage",
    type: "decimal",
    precision: 5,
    scale: 2,
    default: 0,
  })
  attackPercentage: number;

  @Column({
    name: "reception_percentage",
    type: "decimal",
    precision: 5,
    scale: 2,
    default: 0,
  })
  receptionPercentage: number;

  @Column({ name: "is_current_season", type: "boolean", default: true })
  isCurrentSeason: boolean;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @ManyToOne("Player", "statistics")
  @JoinColumn({ name: "player_id" })
  player: any;
}
