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

@Entity('tbl_team_members')
@Unique(['teamId', 'playerId'])
@Unique(['teamId', 'jerseyNumber'])
@Index(['teamId'])   // ✅ FIXED - Dùng property name
@Index(['playerId']) // ✅ FIXED - Dùng property name
export class TeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'team_id', type: 'int' })
  teamId: number;

  @Column({ name: 'player_id', type: 'int' })
  playerId: number;

  @Column({ name: 'jersey_number', type: 'int', nullable: true })
  jerseyNumber?: number;

  @Column({ type: 'varchar', length: 30, nullable: true })
  position?: string; // 'setter', 'outside_hitter', 'middle_blocker', 'opposite', 'libero'

  @Column({ name: 'is_captain', type: 'boolean', default: false })
  isCaptain: boolean;

  @Column({ name: 'is_vice_captain', type: 'boolean', default: false })
  isViceCaptain: boolean;

  @Column({ name: 'is_starting_lineup', type: 'boolean', default: false })
  isStartingLineup: boolean;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string; // 'active', 'inactive', 'suspended', 'transferred'

  @Column({ name: 'joined_date', type: 'date', default: () => 'CURRENT_DATE' })
  joinedDate: Date;

  @Column({ name: 'left_date', type: 'date', nullable: true })
  leftDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @ManyToOne('Team', 'members')
  @JoinColumn({ name: 'team_id' })
  team: any;

  @ManyToOne('Player', 'teamMembers')
  @JoinColumn({ name: 'player_id' })
  player: any;
}
