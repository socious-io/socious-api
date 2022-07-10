import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("otps")
export class Otps {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "user_id" })
  userId?: number;

  @Column("varchar", { name: "code", length: 255 })
  code?: string;

  @Column("varchar", { name: "type", length: 255 })
  type?: string;

  @Column("int", { name: "count_request", nullable: true })
  countRequest?: number | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}
