import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "skill_taxonomies_skillable_type_skillable_id_index",
  ["skillableType", "skillableId"],
  {}
)
@Entity("skill_taxonomies")
export class SkillTaxonomies {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id?: number;

  @Column("int", { name: "skill_id" })
  skillId?: number;

  @Column("varchar", { name: "skillable_type", length: 255 })
  skillableType?: string;

  @Column("bigint", { name: "skillable_id", unsigned: true })
  skillableId?: string;
}
