import { Column, Entity, Index } from "typeorm";

@Index("oauth_auth_codes_user_id_index", ["userId"], {})
@Entity("oauth_auth_codes")
export class OauthAuthCodes {
  @Column("varchar", { primary: true, name: "id", length: 100 })
  id?: string;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId?: string;

  @Column("bigint", { name: "client_id", unsigned: true })
  clientId?: string;

  @Column("text", { name: "scopes", nullable: true })
  scopes?: string | null;

  @Column("tinyint", { name: "revoked", width: 1 })
  revoked?: boolean;

  @Column("datetime", { name: "expires_at", nullable: true })
  expiresAt?: Date | null;
}
