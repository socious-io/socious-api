import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("failed_jobs")
export class FailedJobs {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("text", { name: "connection" })
  connection?: string;

  @Column("text", { name: "queue" })
  queue?: string;

  @Column("longtext", { name: "payload" })
  payload?: string;

  @Column("longtext", { name: "exception" })
  exception?: string;

  @Column("timestamp", {
    name: "failed_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  failedAt?: Date;
}
