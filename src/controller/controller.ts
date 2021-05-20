import { EndpointFlag } from "../flags/endpointFlag";
import { EndpointPermission } from "../permissions/endpointPermission";

export abstract class Controller {
    private _flags: EndpointFlag[] = [];
    private _permissions: EndpointPermission[];

    constructor(flags: EndpointFlag[], permissions: EndpointPermission[]) {
        this._flags = flags;
        this._permissions = permissions;
    }

    /**
     * Check wether an endpoint requires authentication or not
     * @returns True or False
     */
    public isRequiringAuthentication(): boolean {
        return this._flags.includes(EndpointFlag.FLAG_AUTHENTICATION_REQUIRED);
    }

    /**
     * Check wether an action on this endpoint requires authentication or not
     * @param action Name of the action on this endpoint
     * @returns True or False
     */
    public isActionRequiringAuth(action: string): boolean {
        return !!this.getPermissionForAction(action);
    }

    /**
     * Get a list of permissions for certain actions on an endpoint
     * @returns EndpointPermissions array
     */
    public getPermissions(): EndpointPermission[] {
        return this._permissions;
    }

    /**
     * Get the permission for an action
     * @param action Action's name
     * @returns EndpointPermission
     */
    public getPermissionForAction(action: string): EndpointPermission {
        let permission = this._permissions.find((endpointPermission) => {
            if (endpointPermission.action.toLowerCase() == action.toLowerCase()) {
                return endpointPermission;
            }
        });

        return permission;
    }
}
