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

@Entity('tbl_notifications')
@Index(['recipientId'])      // ✅ FIXED - Dùng property name
@Index(['isRead'])           // ✅ FIXED - Dùng property name
@Index(['notificationType']) // ✅ FIXED - Dùng property name
@Index(['createdAt'])        // ✅ FIXED - Dùng property name
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'recipient_id', type: 'int' })
  recipientId: number; // User ID người nhận

  @Column({ name: 'sender_id', type: 'int', nullable: true })
  senderId?: number; // User ID người gửi

  @Column({ name: 'notification_type', type: 'varchar', length: 50 })
  notificationType: string; // 'tournament_registration', 'match_result', 'team_invitation', 'system_announcement'

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'action_url', type: 'varchar', length: 500, nullable: true })
  actionUrl?: string; // URL để navigate khi click notification

  @Column({ name: 'entity_type', type: 'varchar', length: 50, nullable: true })
  entityType?: string; // 'tournament', 'match', 'team', 'player'

  @Column({ name: 'entity_id', type: 'int', nullable: true })
  entityId?: number; // ID của entity liên quan

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata?: Record<string, any>; // Thông tin bổ sung

  @Column({ name: 'priority', type: 'varchar', length: 20, default: 'normal' })
  priority: string; // 'low', 'normal', 'high', 'urgent'

  @Column({ name: 'is_read', type: 'boolean', default: false })
  isRead: boolean;

  @Column({ name: 'read_at', type: 'timestamp', nullable: true })
  readAt?: Date;

  @Column({ name: 'is_sent', type: 'boolean', default: false })
  isSent: boolean; // Đã gửi email/push notification chưa

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt?: Date; // Notification tự động ẩn sau thời gian này

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @ManyToOne('User')
  @JoinColumn({ name: 'recipient_id' })
  recipient: any;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'sender_id' })
  sender?: any;
}
