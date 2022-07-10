// TODO this belongs somewhere else, mabye the page library

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AsPage = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { asPage } = request.query;
  return isNaN(asPage) ? null : Number(asPage);
});
