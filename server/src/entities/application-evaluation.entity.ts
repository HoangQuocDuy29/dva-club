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

@Entity('tbl_application_evaluations')
@Index(['applicationId'])    // ✅ FIXED - Dùng property name
@Index(['evaluatorId'])      // ✅ FIXED - Dùng property name
@Index(['evaluationDate'])   // ✅ FIXED - Dùng property name
export class ApplicationEvaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'application_id', type: 'int' })
  applicationId: number;

  @Column({ name: 'evaluator_id', type: 'int' })
  evaluatorId: number; // User ID của người đánh giá

  @Column({ name: 'evaluation_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  evaluationScore?: number; // Điểm đánh giá (0-100)

  @Column({ name: 'criteria_scores', type: 'jsonb', nullable: true })
  criteriaScores?: Record<string, any>; // Điểm từng tiêu chí

  @Column({ type: 'text', nullable: true })
  comments?: string;

  @Column({ name: 'strengths', type: 'text', nullable: true })
  strengths?: string;

  @Column({ name: 'weaknesses', type: 'text', nullable: true })
  weaknesses?: string;

  @Column({ type: 'varchar', length: 20 })
  recommendation: string; // 'approve', 'reject', 'conditional_approve', 'need_more_info'

  @Column({ name: 'conditional_requirements', type: 'text', nullable: true })
  conditionalRequirements?: string; // Yêu cầu bổ sung nếu conditional_approve

  @Column({ name: 'evaluation_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  evaluationDate: Date;

  @Column({ name: 'is_final', type: 'boolean', default: false })
  isFinal: boolean; // Đánh giá cuối cùng hay chỉ là preliminary

  @Column({ name: 'evaluation_weight', type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  evaluationWeight: number; // Trọng số của evaluator này

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @ManyToOne('RegistrationApplication')
  @JoinColumn({ name: 'application_id' })
  application: any;

  @ManyToOne('User')
  @JoinColumn({ name: 'evaluator_id' })
  evaluator: any;
}
