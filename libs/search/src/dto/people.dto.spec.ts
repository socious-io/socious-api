import { PeopleDto } from "./people.dto";

describe("PeopleDto", () => {
  it("should be defined", () => {
    expect(new PeopleDto()).toBeDefined();
  });
});
