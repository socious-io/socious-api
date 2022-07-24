import { OrganizationDto } from "./organization.dto";

describe("OrganizationDto", () => {
  it("should be defined", () => {
    expect(new OrganizationDto()).toBeDefined();
  });
});
