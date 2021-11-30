import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { RestAccount } from "../models/account.model";
import { PROPERTY_PERMISSION_META_KEY } from "../decorator/canRead.decorator";
import { IPermission } from "..";

import "reflect-metadata";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((response) => {
                if (!response) return;

                const isPage = !!response["elements"];
                const account: any = ctx.switchToHttp().getRequest().authentication;

                if (isPage) {
                    this.eraseNotPermittedProperties(response["elements"], account);
                } else {
                    this.eraseNotPermittedProperties(response, account);
                }

                return response;
            }),
        );
    }

    private eraseNotPermittedProperties(
        obj: Record<string, any> | Array<Record<string, any>>,
        account: RestAccount,
    ): any {
        if (Array.isArray(obj)) {
            for (const element of obj) {
                this.eraseProperties(element, account);
            }
        } else {
            this.eraseProperties(obj, account);
        }
    }

    private eraseProperties(obj: Record<string, any>, account: RestAccount) {
        for (const key in obj) {
            if (typeof obj[key] === "undefined" || obj[key] === null) {
                obj[key] = undefined;
                continue;
            }

            // If no permission is set
            // ==> Property is allowed to be read.
            if (this.needsPermission(obj, key) || !this.canRead(obj, key)) {
                this.eraseProperty(obj, key, account);
            }

            // If obj[key] exists and is nested object
            // ==> check if that object's properties need
            //     special permissions
            if (obj[key] && typeof obj[key] === "object") {
                this.eraseNotPermittedProperties(obj[key], account);
            }
        }
    }

    /**
     * Erase the value of a property of an object
     * @param target Target object
     * @param propertyKey Target property
     * @param account Account data to check for permission
     * @returns True if property was erased
     */
    private eraseProperty(target: any, propertyKey: string, account: RestAccount) {
        const canRead = this.canRead(target, propertyKey);

        if (!canRead) {
            target[propertyKey] = undefined;
        } else {
            if (!this.needsPermission(target, propertyKey) && canRead) return;

            const permissionGranted = !!this.getRequiredPermissions(target, propertyKey).find((permission) =>
                account?.hasPermission(permission),
            );
            if (!permissionGranted) {
                target[propertyKey] = undefined;
            }
        }
    }

    /**
     * Check if property requires special permission to be read.
     * @param target Target object
     * @param propertyKey Target property of object
     * @returns True or False
     */
    private needsPermission(target: any, propertyKey: string) {
        const value = Reflect.getMetadata(PROPERTY_PERMISSION_META_KEY, target, propertyKey);
        if (typeof value == "undefined" || value == null) return false;
        if (typeof value == "boolean") return !value;

        return !!value;
    }

    /**
     * Check if a value is allowed to be read.
     * @param target Target object
     * @param propertyKey Target property of object
     * @returns True or False
     */
    private canRead(target: any, propertyKey: string): boolean {
        const value = Reflect.getMetadata(PROPERTY_PERMISSION_META_KEY, target, propertyKey);

        if (typeof value == "undefined" || value == null) return true;
        if (typeof value == "boolean") return !value;

        return !!value;
    }

    private getRequiredPermissions(target: any, propertyKey: string): string[] {
        const value = Reflect.getMetadata(PROPERTY_PERMISSION_META_KEY, target, propertyKey);
        if (typeof value == "undefined" || value == null) return [];

        if (Array.isArray(value)) {
            if (typeof value[0] == "string") return value as string[];
            if (typeof value[0] == "object") return (value as IPermission[]).map((v) => v.value);
            return [];
        } else {
            if (typeof value == "boolean") return [];
            if (typeof value == "string") return [value];
            if (typeof value == "object") return [(value as IPermission).value];
        }

        return Reflect.getMetadata(PROPERTY_PERMISSION_META_KEY, target, propertyKey) as string[];
    }
}
