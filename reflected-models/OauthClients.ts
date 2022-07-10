import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("oauth_clients_user_id_index", ["userId"], {})
@Entity("oauth_clients")
export class OauthClients {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("bigint", { name: "user_id", nullable: true, unsigned: true })
  userId?: string | null;

  @Column("varchar", { name: "name", length: 255 })
  name?: string;

  @Column("varchar", { name: "secret", nullable: true, length: 100 })
  secret?: string | null;

  @Column("text", { name: "redirect" })
  redirect?: string;

  @Column("tinyint", { name: "personal_access_client", width: 1 })
  personalAccessClient?: boolean;

  @Column("tinyint", { name: "password_client", width: 1 })
  passwordClient?: boolean;

  @Column("tinyint", { name: "revoked", width: 1 })
  revoked?: boolean;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}
