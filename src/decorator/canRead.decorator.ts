export const PERMISSION_KEY = "requiredPermission";
export const CANREAD_KEY = "canRead";

export const CanReadPermission = (...permission: any[]) => {
    return Reflect.metadata(PERMISSION_KEY, permission);
};

export const CanRead = (value = true) => {
    return Reflect.metadata(CANREAD_KEY, value);
};
