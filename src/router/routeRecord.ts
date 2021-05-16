import { RouteMethod } from "./routeMethod";
import { HashMap } from "../util/hashMap";

export interface RouteRecord {
    name: string;
    path: string;
    action: string;
    method: RouteMethod;
    meta?: HashMap<any>;
    forcePagination: boolean;
}
