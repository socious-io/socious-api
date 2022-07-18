import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "history_searchs_userable_type_userable_id_index",
  ["userableType", "userableId"],
  {}
)
@Index(
  "history_searchs_searchable_type_searchable_id_index",
  ["searchableType", "searchableId"],
  {}
)
@Entity("history_searchs")
export class HistorySearchs {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name?: string | null;

  @Column("varchar", { name: "first_name", nullable: true, length: 255 })
  firstName?: string | null;

  @Column("varchar", { name: "username", nullable: true, length: 255 })
  username?: string | null;

  @Column("varchar", { name: "userable_type", length: 255 })
  userableType?: string;

  @Column("bigint", { name: "userable_id", unsigned: true })
  userableId?: string;

  @Column("varchar", { name: "searchable_type", length: 255 })
  searchableType?: string;

  @Column("bigint", { name: "searchable_id", unsigned: true })
  searchableId?: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt?: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt?: Date | null;
}
