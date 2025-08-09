import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { Team } from './team.entity';
import { TournamentSquadMember } from './tournament-squad-member.entity';

@Entity('tbl_tournament_squads')
@Unique(['tournamentId', 'teamId'])
@Index(['tournamentId'])
@Index(['teamId'])
export class TournamentSquad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tournament_id', type: 'int' })
  tournamentId: number;

  @Column({ name: 'team_id', type: 'int' })
  teamId: number;

  @Column({ name: 'squad_name', type: 'varchar', length: 100, nullable: true })
  squadName?: string;

  @Column({ name: 'registration_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registrationDate: Date;

  @Column({ type: 'varchar', length: 20, default: 'registered' })
  status: string; // 'registered', 'confirmed', 'withdrawn', 'disqualified'

  @Column({ name: 'seed_number', type: 'int', nullable: true })
  seedNumber?: number;

  @Column({ name: 'group_assignment', type: 'varchar', length: 10, nullable: true })
  groupAssignment?: string; // 'A', 'B', 'C', etc.

  @Column({ name: 'total_players', type: 'int', default: 0 })
  totalPlayers: number;

  @Column({ name: 'captain_id', type: 'int', nullable: true })
  captainId?: number;

  @Column({ name: 'coach_id', type: 'int', nullable: true })
  coachId?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Tournament, tournament => tournament.tournamentSquads)
  @JoinColumn({ name: 'tournament_id' })
  tournament: Tournament;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @OneToMany(() => TournamentSquadMember, member => member.tournamentSquad)
  squadMembers: TournamentSquadMember[];
}
