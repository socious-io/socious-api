import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("page_roles")
export class PageRoles {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "role_name", length: 255 })
  roleName?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}
