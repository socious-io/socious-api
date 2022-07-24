import { SearchService } from "@app/search";
import { Controller, Get, Query } from "@nestjs/common";

@Controller("search")
export class SearchController {
  constructor(readonly search: SearchService) {}

  // posts
  // people
  // organizations
  // projects
  // @Get("posts|people|organizations|projects")
  @Get("posts")
  public async searchPosts(@Query() query): Promise<any> {
    return await this.search.findAllPosts(query);
  }

  @Get("/people")
  public async searchPeople(@Query() query): Promise<any> {
    return await this.search.findAllPeoples(query);
  }

  @Get("/organization")
  public async searchOrganizations(@Query() query): Promise<any> {
    return await this.search.findAllOrganizations(query);
  }

  @Get("/project")
  public async searchProjects(@Query() query): Promise<any> {
    return await this.search.findAllProjects(query);
  }
}
