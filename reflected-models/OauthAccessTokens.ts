import { Column, Entity, Index } from "typeorm";

@Index("oauth_access_tokens_user_id_index", ["userId"], {})
@Entity("oauth_access_tokens")
export class OauthAccessTokens {
  @Column("varchar", { primary: true, name: "id", length: 100 })
  id?: string;

  @Column("bigint", { name: "user_id", nullable: true, unsigned: true })
  userId?: string | null;

  @Column("bigint", { name: "client_id", unsigned: true })
  clientId?: string;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name?: string | null;

  @Column("text", { name: "scopes", nullable: true })
  scopes?: string | null;

  @Column("tinyint", { name: "revoked", width: 1 })
  revoked?: boolean;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @Column("datetime", { name: "expires_at", nullable: true })
  expiresAt?: Date | null;
}
