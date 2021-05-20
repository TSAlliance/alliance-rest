import { ApiError } from "../error/apiError";

export interface UserDetails {
    uuid: string;
    isAuthenticated: boolean;
    authenticationError?: ApiError;
    roleId: string;

    hasPermission(permission: string): boolean;
    getHierarchy(): number;
}
