import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  Index
} from 'typeorm';

@Entity('tbl_activity_logs')
@Index(['userId'])                     // ✅ FIXED - Dùng property name
@Index(['entityType', 'entityId'])     // ✅ FIXED - Dùng property name
@Index(['actionType'])                 // ✅ FIXED - Dùng property name
@Index(['createdAt'])                  // ✅ FIXED - Dùng property name
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId?: number; // User thực hiện action, nullable cho system actions

  @Column({ name: 'action_type', type: 'varchar', length: 50 })
  actionType: string; // 'create', 'update', 'delete', 'login', 'logout', 'register', 'approve'

  @Column({ name: 'entity_type', type: 'varchar', length: 50, nullable: true })
  entityType?: string; // 'user', 'team', 'player', 'tournament', 'match', 'application'

  @Column({ name: 'entity_id', type: 'int', nullable: true })
  entityId?: number; // ID của entity bị tác động

  @Column({ name: 'old_values', type: 'jsonb', nullable: true })
  oldValues?: Record<string, any>; // Giá trị cũ trước khi thay đổi

  @Column({ name: 'new_values', type: 'jsonb', nullable: true })
  newValues?: Record<string, any>; // Giá trị mới sau khi thay đổi

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress?: string; // IPv4 hoặc IPv6

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent?: string; // Browser/device info

  @Column({ name: 'session_id', type: 'varchar', length: 255, nullable: true })
  sessionId?: string;

  @Column({ type: 'text', nullable: true })
  description?: string; // Mô tả chi tiết action

  @Column({ name: 'severity_level', type: 'varchar', length: 20, default: 'info' })
  severityLevel: string; // 'info', 'warning', 'error', 'critical'

  @Column({ name: 'is_successful', type: 'boolean', default: true })
  isSuccessful: boolean;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string; // Nếu action failed

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata?: Record<string, any>; // Thông tin bổ sung

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  // Không cần UpdateDateColumn vì activity log không được update
}
