import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

export const AUTH_REQUIRED_KEY = "auth_required";
export const RequireAuth = () => {
    return applyDecorators(SetMetadata(AUTH_REQUIRED_KEY, true), ApiBearerAuth());
};

export const Authentication = createParamDecorator<unknown, ExecutionContext>(
    (data: unknown, ctx: ExecutionContext) => {
        return ctx.switchToHttp().getRequest().authentication;
    },
);
