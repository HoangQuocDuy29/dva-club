import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany,
  Index
} from 'typeorm';

@Entity('tbl_divisions')
@Index(['name'])
@Index(['code'])
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 20 })
  level: string; // 'amateur', 'semi_professional', 'professional'

  @Column({ name: 'age_group', type: 'varchar', length: 20, nullable: true })
  ageGroup?: string; // 'youth', 'junior', 'senior', 'veteran'

  @Column({ name: 'gender_category', type: 'varchar', length: 20, nullable: true })
  genderCategory?: string; // 'male', 'female', 'mixed'

  @Column({ name: 'max_teams', type: 'int', nullable: true })
  maxTeams?: number;

  @Column({ name: 'season_start', type: 'date', nullable: true })
  seasonStart?: Date;

  @Column({ name: 'season_end', type: 'date', nullable: true })
  seasonEnd?: Date;

  @Column({ name: 'registration_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  registrationFee?: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @OneToMany('Team', 'division')
  teams: any[];
}
