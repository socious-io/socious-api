import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { OrganizationEntity } from "./models/organization.entity";
import { PeopleEntity } from "./models/people.entity";
import { PostEntity } from "./models/post.entity";
import { ProjectEntity } from "./models/project.entity";
import { SearchService } from "./service/search.service";

@Module({
  imports: [TypeOrmModule.forFeature([PeopleEntity, ProjectEntity, OrganizationEntity, PostEntity])],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
