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

@Entity('tbl_teams')
@Index(['name'])
@Index(['divisionId']) // ✅ FIXED - Dùng property name
@Index(['code'])
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'division_id', type: 'int' })
  divisionId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'short_name', type: 'varchar', length: 10, nullable: true })
  shortName?: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'max_members', type: 'int', default: 18 })
  maxMembers: number;

  @Column({ name: 'coach_id', type: 'int', nullable: true })
  coachId?: number;

  @Column({ name: 'assistant_coach_id', type: 'int', nullable: true })
  assistantCoachId?: number;

  @Column({ name: 'team_logo_url', type: 'varchar', length: 500, nullable: true })
  teamLogoUrl?: string;

  @Column({ name: 'team_color', type: 'varchar', length: 7, nullable: true })
  teamColor?: string;

  @Column({ name: 'secondary_color', type: 'varchar', length: 7, nullable: true })
  secondaryColor?: string;

  @Column({ name: 'founded_date', type: 'date', nullable: true })
  foundedDate?: Date;

  @Column({ name: 'home_venue', type: 'varchar', length: 200, nullable: true })
  homeVenue?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @ManyToOne('Division', 'teams')
  @JoinColumn({ name: 'division_id' })
  division: any;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'coach_id' })
  coach?: any;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'assistant_coach_id' })
  assistantCoach?: any;

  @OneToMany('TeamMember', 'team')
  members: any[];

  @OneToMany('TeamStats', 'team')
  teamStats: any[];
}
