import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Maps authenticated user to the parameters to avoid the need for
 * pulling the user of the entire request object.
 */
export const Auditor = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
