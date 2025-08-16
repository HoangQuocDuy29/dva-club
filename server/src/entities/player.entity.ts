import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from "typeorm";

@Entity("tbl_players")
@Index(["playerCode"])
@Index(["fullName"])
@Index(["userId"])
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id", type: "int", unique: true, nullable: true })
  userId?: number;

  @Column({
    name: "player_code",
    type: "varchar",
    length: 20,
    unique: true,
    nullable: true,
  })
  playerCode?: string;

  @Column({ name: "full_name", type: "varchar", length: 255 })
  fullName: string;

  @Column({ type: "varchar", length: 10 })
  gender: string;

  @Column({ name: "date_of_birth", type: "date", nullable: true })
  dateOfBirth?: Date;

  @Column({ type: "int", nullable: true })
  height?: number;

  @Column({ type: "int", nullable: true })
  weight?: number;

  @Column({
    name: "dominant_hand",
    type: "varchar",
    length: 15,
    nullable: true,
  })
  dominantHand?: string;

  @Column({ name: "jersey_number", type: "int", nullable: true })
  jerseyNumber?: number;

  @Column({
    name: "primary_position",
    type: "varchar",
    length: 30,
    nullable: true,
  })
  primaryPosition?: string;

  @Column({
    name: "secondary_positions",
    type: "text",
    array: true,
    nullable: true,
  })
  secondaryPositions?: string[];

  @Column({
    name: "skill_level",
    type: "varchar",
    length: 20,
    default: "beginner",
  })
  skillLevel: string;

  @Column({ name: "contact_info", type: "jsonb", nullable: true })
  contactInfo?: Record<string, any>;

  @Column({ name: "avatar_url", type: "varchar", length: 500, nullable: true })
  avatarUrl?: string;

  @Column({ name: "action_photos", type: "text", array: true, nullable: true })
  actionPhotos?: string[];

  @Column({ type: "varchar", length: 20, default: "active" })
  status: string;

  @Column({ name: "injury_details", type: "text", nullable: true })
  injuryDetails?: string;

  @Column({ name: "medical_notes", type: "text", nullable: true })
  medicalNotes?: string;

  @Column({ name: "join_date", type: "date", default: () => "CURRENT_DATE" })
  joinDate: Date;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relations - Sử dụng string references để tránh circular dependency
  @OneToOne("User", "player")
  @JoinColumn({ name: "user_id" })
  user?: any;

  @OneToMany("TeamMember", "player")
  teamMembers: any[];

  @OneToMany("PlayerStatistics", "player")
  statistics: any[];
}
