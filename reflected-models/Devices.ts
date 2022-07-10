import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("devices")
export class Devices {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "user_id" })
  userId?: number;

  @Column("varchar", { name: "uuid_token", length: 255 })
  uuidToken?: string;

  @Column("text", { name: "language", nullable: true })
  language?: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}
