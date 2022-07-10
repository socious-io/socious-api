import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("jobs_queue_index", ["queue"], {})
@Entity("jobs")
export class Jobs {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("varchar", { name: "queue", length: 255 })
  queue?: string;

  @Column("longtext", { name: "payload" })
  payload?: string;

  @Column("tinyint", { name: "attempts", unsigned: true })
  attempts?: number;

  @Column("int", { name: "reserved_at", nullable: true, unsigned: true })
  reservedAt?: number | null;

  @Column("int", { name: "available_at", unsigned: true })
  availableAt?: number;

  @Column("int", { name: "created_at", unsigned: true })
  createdAt?: number;
}
