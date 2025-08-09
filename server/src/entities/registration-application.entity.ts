import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';

@Entity('tbl_registration_applications')
@Index(['tournamentId']) // ✅ FIXED - Dùng property name
@Index(['teamId'])       // ✅ FIXED - Dùng property name
@Index(['applicantId'])  // ✅ FIXED - Dùng property name
@Index(['status'])
export class RegistrationApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tournament_id', type: 'int' })
  tournamentId: number;

  @Column({ name: 'team_id', type: 'int' })
  teamId: number;

  @Column({ name: 'applicant_id', type: 'int' })
  applicantId: number; // User ID của người đăng ký

  @Column({ name: 'application_code', type: 'varchar', length: 20, unique: true })
  applicationCode: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string; // 'pending', 'approved', 'rejected', 'cancelled'

  @Column({ name: 'application_fee', type: 'decimal', precision: 10, scale: 2, nullable: true })
  applicationFee?: number;

  @Column({ name: 'payment_status', type: 'varchar', length: 20, default: 'unpaid' })
  paymentStatus: string; // 'unpaid', 'paid', 'refunded'

  @Column({ name: 'payment_date', type: 'timestamp', nullable: true })
  paymentDate?: Date;

  @Column({ name: 'payment_method', type: 'varchar', length: 50, nullable: true })
  paymentMethod?: string;

  @Column({ name: 'payment_reference', type: 'varchar', length: 100, nullable: true })
  paymentReference?: string;

  @Column({ name: 'team_roster', type: 'jsonb', nullable: true })
  teamRoster?: Record<string, any>; // Danh sách cầu thủ đăng ký

  @Column({ name: 'additional_info', type: 'text', nullable: true })
  additionalInfo?: string;

  @Column({ name: 'reviewed_by', type: 'int', nullable: true })
  reviewedBy?: number; // User ID của người review

  @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
  reviewedAt?: Date;

  @Column({ name: 'review_notes', type: 'text', nullable: true })
  reviewNotes?: string;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @ManyToOne('Tournament', 'registrationApplications')
  @JoinColumn({ name: 'tournament_id' })
  tournament: any;

  @ManyToOne('Team')
  @JoinColumn({ name: 'team_id' })
  team: any;

  @ManyToOne('User')
  @JoinColumn({ name: 'applicant_id' })
  applicant: any;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer?: any;
}
