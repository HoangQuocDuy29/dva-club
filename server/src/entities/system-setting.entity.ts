import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index
} from 'typeorm';

@Entity('tbl_system_settings')
@Index(['settingKey']) // ✅ FIXED - Dùng property name
@Index(['category'])
export class SystemSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'setting_key', type: 'varchar', length: 100, unique: true })
  settingKey: string;

  @Column({ name: 'setting_value', type: 'text', nullable: true })
  settingValue?: string;

  @Column({ type: 'varchar', length: 50 })
  category: string; // 'general', 'tournament', 'team', 'player', 'notification'

  @Column({ type: 'varchar', length: 100, nullable: true })
  label?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'data_type', type: 'varchar', length: 20, default: 'string' })
  dataType: string; // 'string', 'number', 'boolean', 'json', 'date'

  @Column({ name: 'default_value', type: 'text', nullable: true })
  defaultValue?: string;

  @Column({ name: 'is_editable', type: 'boolean', default: true })
  isEditable: boolean;

  @Column({ name: 'is_system', type: 'boolean', default: false })
  isSystem: boolean; // System settings can't be deleted

  @Column({ name: 'validation_rules', type: 'jsonb', nullable: true })
  validationRules?: Record<string, any>;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
