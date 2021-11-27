import { applyDecorators, SetMetadata } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { IPermission } from "../models/permission.model";
import { PROPERTY_PERMISSION_META_KEY } from "./canRead.decorator";

/**
 * Controller route decorator to limit access to routes.
 * Define certain permissions or disable access to routes for every request by setting the value to false.
 * Applying a list of permissions results in allowed access to the route if one or more permissions are a match.
 * @param permission Define a permission, set of permissions or disable access completely by setting this to "false".
 */
export function CanAccess(permission: string | string[] | boolean | IPermission | IPermission[]) {
    return applyDecorators(
        SetMetadata(PROPERTY_PERMISSION_META_KEY, permission),
        ApiBearerAuth ? ApiBearerAuth() : undefined,
    );
}
