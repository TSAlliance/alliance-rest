import { HashMap } from "alliance-sdk";
import { RouteMethod } from "./routeMethod";

export interface RouteRecord {
    name: string;
    path: string;
    action: string;
    method: RouteMethod;
    meta?: HashMap<any>;
    forcePagination?: boolean;
}
