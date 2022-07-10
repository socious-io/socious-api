import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Permissions } from "./Permissions";

@Index(
  "model_has_permissions_model_id_model_type_index",
  ["modelId", "modelType"],
  {}
)
@Entity("model_has_permissions")
export class ModelHasPermissions {
  @Column("bigint", { primary: true, name: "permission_id", unsigned: true })
  permissionId?: string;

  @Column("varchar", { primary: true, name: "model_type", length: 255 })
  modelType?: string;

  @Column("bigint", { primary: true, name: "model_id", unsigned: true })
  modelId?: string;

  @ManyToOne(
    () => Permissions,
    (permissions) => permissions.modelHasPermissions,
    { onDelete: "CASCADE", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "permission_id", referencedColumnName: "id" }])
  permission?: Permissions;
}
