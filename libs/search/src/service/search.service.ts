import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { OrganizationEntity } from "../models/organization.entity";
import { PeopleEntity } from "../models/people.entity";
import { PostEntity } from "../models/post.entity";
import { ProjectEntity } from "../models/project.entity";

Injectable();
export class SearchService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(PostEntity) readonly postRepository: Repository<PostEntity>,
    @InjectRepository(PeopleEntity) readonly peopleRepository: Repository<PeopleEntity>,
    @InjectRepository(OrganizationEntity) readonly organizationRepository: Repository<OrganizationEntity>,
    @InjectRepository(ProjectEntity) readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async findAllPosts(query) {
    console.log(query);
    const take = query.take || 10;
    const skip = query.skip || 0;
    const [data, total] = await this.postRepository.findAndCount({
      where: {},
      relations: {},
      take: take,
      skip: skip,
    });
    return { data, total };
  }
  async findAllPeoples(query) {
    const take = query.take || 10;
    const skip = query.skip || 0;
    console.log(query);
    const [data, total] = await this.peopleRepository.findAndCount({
      where: {},
      relations: {},
      take: take,
      skip: skip,
    });
    return { data, total };
  }
  async findAllOrganizations(query) {
    const take = query.take || 10;
    const skip = query.skip || 0;
    const [data, total] = await this.organizationRepository.findAndCount({
      where: {},
      relations: {},
      take: take,
      skip: skip,
    });
    return { data, total };
  }
  async findAllProjects(query) {
    const take = query.take || 10;
    const skip = query.skip || 0;
    const [data, total] = await this.projectRepository.findAndCount({
      where: {},
      relations: {},
      take: take,
      skip: skip,
    });
    return { data, total };
  }
}
