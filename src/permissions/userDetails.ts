import { ApiError } from "../error/apiError";

export abstract class UserDetails {
    public readonly id: string;
    private readonly _permissions: string[] = [];
    private readonly _hierarchy: number = 0;
    public isAuthenticated: boolean = false;
    public authenticationError?: ApiError;

    constructor(id: string, permissions: string[], hierarchy: number, isAuthenticated: boolean) {
        this.id = id;
        this._permissions = permissions;
        this._hierarchy = hierarchy;
        this.isAuthenticated = isAuthenticated;
    }

    public abstract hasPermission(permission: string): boolean;
}
