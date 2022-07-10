import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ModelHasPermissions } from "./ModelHasPermissions";
import { Roles } from "./Roles";

@Entity("permissions")
export class Permissions {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id?: string;

  @Column("varchar", { name: "name", length: 255 })
  name?: string;

  @Column("varchar", { name: "guard_name", length: 255 })
  guardName?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;

  @OneToMany(
    () => ModelHasPermissions,
    (modelHasPermissions) => modelHasPermissions.permission
  )
  modelHasPermissions?: ModelHasPermissions[];

  @ManyToMany(() => Roles, (roles) => roles.permissions)
  @JoinTable({
    name: "role_has_permissions",
    joinColumns: [{ name: "permission_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "role_id", referencedColumnName: "id" }],
    schema: "socious",
  })
  roles?: Roles[];
}
