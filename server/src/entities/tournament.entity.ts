import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany,
  Index
} from 'typeorm';

@Entity('tbl_tournaments')
@Index(['name'])
@Index(['startDate', 'endDate']) // ✅ FIXED - Dùng property names
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20 })
  type: string; // 'league', 'knockout', 'round_robin'

  @Column({ type: 'varchar', length: 20 })
  level: string; // 'local', 'regional', 'national', 'international'

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: string; // 'draft', 'registration_open', 'ongoing', 'completed', 'cancelled'

  @Column({ name: 'max_teams', type: 'int' })
  maxTeams: number;

  @Column({ name: 'registration_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  registrationFee?: number;

  @Column({ name: 'prize_money', type: 'decimal', precision: 12, scale: 2, nullable: true })
  prizeMoney?: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  venue?: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'registration_start_date', type: 'date' })
  registrationStartDate: Date;

  @Column({ name: 'registration_end_date', type: 'date' })
  registrationEndDate: Date;

  @Column({ name: 'contact_email', type: 'varchar', length: 150, nullable: true })
  contactEmail?: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 15, nullable: true })
  contactPhone?: string;

  @Column({ type: 'text', nullable: true })
  rules?: string;

  @Column({ type: 'text', nullable: true })
  requirements?: string;

  @Column({ name: 'banner_image_url', type: 'varchar', length: 500, nullable: true })
  bannerImageUrl?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @OneToMany('Match', 'tournament')
  matches: any[];

  @OneToMany('RegistrationApplication', 'tournament')
  registrationApplications: any[];

  @OneToMany('TournamentSquad', 'tournament')
  tournamentSquads: any[];
}
