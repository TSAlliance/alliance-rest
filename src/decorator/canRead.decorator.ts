import { IPermission } from "../models/permission.model";

export const PROPERTY_PERMISSION_META_KEY = "requiredPermission";

/**
 * Class-Property decorator to limit access to types of data in entities.
 * Define certain permissions or disable access to properties for every request by setting the value to false.
 * Applying a list of permissions results in allowed access to the property if one or more permissions are a match.
 * @param permission Define a permission, set of permissions or disable access completely by setting this to "false".
 */
export function CanRead(permission: string | string[] | boolean | IPermission | IPermission[] = true) {
    let p: string[] | boolean = undefined;

    if (Array.isArray(permission)) {
        if (typeof permission[0] == "string") p = permission as string[];
        if (typeof permission[0] == "object") p = (permission as IPermission[]).map((v) => v.value);
    } else {
        if (typeof permission == "boolean") p = permission as boolean;
        if (typeof permission == "string") p = [permission as string];
        if (typeof permission == "object") p = [(permission as IPermission).value];
    }

    return Reflect.metadata(PROPERTY_PERMISSION_META_KEY, p);
}
