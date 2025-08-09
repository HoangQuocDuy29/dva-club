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

@Entity('tbl_media_files')
@Index(['entityType', 'entityId']) // ✅ FIXED - Dùng property name
@Index(['uploadedBy'])             // ✅ FIXED - Dùng property name
@Index(['mediaType'])              // ✅ FIXED - Dùng property name
@Index(['isPrimary'])              // ✅ FIXED - Dùng property name
export class MediaFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ name: 'original_name', type: 'varchar', length: 255 })
  originalName: string;

  @Column({ name: 'file_path', type: 'varchar', length: 500 })
  filePath: string;

  @Column({ name: 'file_url', type: 'varchar', length: 500 })
  fileUrl: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ name: 'file_size', type: 'bigint' })
  fileSize: number; // Bytes

  @Column({ name: 'entity_type', type: 'varchar', length: 50 })
  entityType: string; // 'player', 'team', 'tournament', 'match', 'user', 'news'

  @Column({ name: 'entity_id', type: 'int' })
  entityId: number;

  @Column({ name: 'media_type', type: 'varchar', length: 20 })
  mediaType: string; // 'image', 'video', 'document'

  @Column({ name: 'media_category', type: 'varchar', length: 50, nullable: true })
  mediaCategory?: string; // 'profile', 'action', 'team_photo', 'logo', 'banner', 'document'

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ name: 'uploaded_by', type: 'int' })
  uploadedBy: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>; // Width, height, duration, etc.

  @Column({ name: 'alt_text', type: 'varchar', length: 255, nullable: true })
  altText?: string; // Accessibility

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @ManyToOne('User')
  @JoinColumn({ name: 'uploaded_by' })
  uploader: any;
}
