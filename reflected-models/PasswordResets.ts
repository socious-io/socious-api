import { Column, Entity, Index } from "typeorm";

@Index("password_resets_email_index", ["email"], {})
@Entity("password_resets")
export class PasswordResets {
  @Column("varchar", { name: "email", length: 255 })
  email?: string;

  @Column("varchar", { name: "token", length: 255 })
  token?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;
}
