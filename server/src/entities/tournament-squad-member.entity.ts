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
import { TournamentSquad } from './tournament-squad.entity';
import { Player } from './player.entity';

@Entity('tbl_tournament_squad_members')
@Unique(['tournamentSquadId', 'playerId'])
@Unique(['tournamentSquadId', 'jerseyNumber'])
@Index(['tournamentSquadId'])
@Index(['playerId'])
export class TournamentSquadMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tournament_squad_id', type: 'int' })
  tournamentSquadId: number;

  @Column({ name: 'player_id', type: 'int' })
  playerId: number;

  @Column({ name: 'jersey_number', type: 'int' })
  jerseyNumber: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  position?: string; // 'setter', 'outside_hitter', 'middle_blocker', 'opposite', 'libero'

  @Column({ name: 'is_captain', type: 'boolean', default: false })
  isCaptain: boolean;

  @Column({ name: 'is_vice_captain', type: 'boolean', default: false })
  isViceCaptain: boolean;

  @Column({ name: 'is_starting_lineup', type: 'boolean', default: false })
  isStartingLineup: boolean;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string; // 'active', 'inactive', 'injured', 'suspended'

  @Column({ name: 'registration_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registrationDate: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => TournamentSquad, squad => squad.squadMembers)
  @JoinColumn({ name: 'tournament_squad_id' })
  tournamentSquad: TournamentSquad;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  player: Player;
}
