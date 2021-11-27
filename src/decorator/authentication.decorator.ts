import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

export const AUTH_REQUIRED_META_KEY = "auth_required";

/**
 * Controller route decorator to make a controller route required authentication.
 * Anonymous requests will not be able to call these endpoints
 */
export function IsAuthenticated() {
    return applyDecorators(SetMetadata(AUTH_REQUIRED_META_KEY, true), ApiBearerAuth());
}

/**
 * Controller route parameter decorator to access the authentication (session) object
 * connected with the current request.
 */
export const Authentication = createParamDecorator<unknown, ExecutionContext>(
    (data: unknown, ctx: ExecutionContext) => {
        return ctx.switchToHttp().getRequest().authentication;
    },
);
