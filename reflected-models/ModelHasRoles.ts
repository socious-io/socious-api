import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Roles } from "./Roles";

@Index(
  "model_has_roles_model_id_model_type_index",
  ["modelId", "modelType"],
  {}
)
@Entity("model_has_roles")
export class ModelHasRoles {
  @Column("bigint", { primary: true, name: "role_id", unsigned: true })
  roleId?: string;

  @Column("varchar", { primary: true, name: "model_type", length: 255 })
  modelType?: string;

  @Column("bigint", { primary: true, name: "model_id", unsigned: true })
  modelId?: string;

  @ManyToOne(() => Roles, (roles) => roles.modelHasRoles, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role?: Roles;
}
