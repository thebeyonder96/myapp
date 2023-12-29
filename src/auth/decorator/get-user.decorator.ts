import {createParamDecorator, ExecutionContext} from '@nestjs/common';

// Custom decorator to get user data
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
