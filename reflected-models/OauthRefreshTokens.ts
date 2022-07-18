import { Column, Entity } from "typeorm";

@Entity("oauth_refresh_tokens")
export class OauthRefreshTokens {
  @Column("varchar", { primary: true, name: "id", length: 100 })
  id?: string;

  @Column("varchar", { name: "access_token_id", length: 100 })
  accessTokenId?: string;

  @Column("tinyint", { name: "revoked", width: 1 })
  revoked?: boolean;

  @Column("datetime", { name: "expires_at", nullable: true })
  expiresAt?: Date | null;
}
