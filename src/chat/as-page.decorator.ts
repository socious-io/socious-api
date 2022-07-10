// TODO: this belongs somewhere else, mabye the page library
// TODO: optionally return a Page entity
// TODO: this should verify that the authenticated user is a member of this page

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AsPage = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { asPage } = request.query;
  return isNaN(asPage) ? null : Number(asPage);
});
