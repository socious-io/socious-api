import { Column, Entity } from "typeorm";

@Entity("page_members")
export class PageMembers {
  @Column("int", { primary: true, name: "page_id", unsigned: true })
  pageId?: number;

  @Column("int", { primary: true, name: "user_id", unsigned: true })
  userId?: number;

  @Column("int", { name: "role_id", unsigned: true })
  roleId?: number;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}
