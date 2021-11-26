export const PERMISSION_KEY = "requiredPermission";
export const CANREAD_KEY = "canRead";

/**
 * Define the permission(s) needed to read this value (to send in responses)
 * @param permission Permissions (multiple or single one). If multiple are defined, this will evaluate as "or".
 */
export const CanReadPermission = (...permission: any[]) => {
    return Reflect.metadata(PERMISSION_KEY, permission);
};

/**
 * Decorator to define if this value can never be read (to send in responses).
 * @param value True, if value is readable or false if value is purely for internal use.
 */
export function CanRead(value = true) {
    return Reflect.metadata(CANREAD_KEY, value);
}
/*export const CanRead = (value = true) => {
    return Reflect.metadata(CANREAD_KEY, value);
};*/
