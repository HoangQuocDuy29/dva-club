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

@Entity('tbl_news_articles')
@Index(['title'])
@Index(['authorId'])     // ✅ FIXED - Dùng property name
@Index(['category'])
@Index(['isPublished'])  // ✅ FIXED - Dùng property name
@Index(['publishedAt'])  // ✅ FIXED - Dùng property name
export class NewsArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 500, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  excerpt?: string; // Tóm tắt ngắn

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'featured_image_url', type: 'varchar', length: 500, nullable: true })
  featuredImageUrl?: string;

  @Column({ name: 'author_id', type: 'int' })
  authorId: number;

  @Column({ type: 'varchar', length: 50 })
  category: string; // 'tournament', 'team', 'player', 'general', 'announcement'

  @Column({ type: 'text', array: true, nullable: true })
  tags?: string[]; // Tags để phân loại

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'like_count', type: 'int', default: 0 })
  likeCount: number;

  @Column({ name: 'comment_count', type: 'int', default: 0 })
  commentCount: number;

  @Column({ name: 'is_published', type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean; // Bài viết nổi bật

  @Column({ name: 'is_pinned', type: 'boolean', default: false })
  isPinned: boolean; // Ghim lên đầu

  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @Column({ name: 'scheduled_at', type: 'timestamp', nullable: true })
  scheduledAt?: Date; // Đăng theo lịch

  @Column({ name: 'meta_title', type: 'varchar', length: 255, nullable: true })
  metaTitle?: string; // SEO

  @Column({ name: 'meta_description', type: 'varchar', length: 500, nullable: true })
  metaDescription?: string; // SEO

  @Column({ name: 'entity_type', type: 'varchar', length: 50, nullable: true })
  entityType?: string; // 'tournament', 'team', 'player', 'match'

  @Column({ name: 'entity_id', type: 'int', nullable: true })
  entityId?: number; // ID của entity liên quan

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @ManyToOne('User')
  @JoinColumn({ name: 'author_id' })
  author: any;
}
