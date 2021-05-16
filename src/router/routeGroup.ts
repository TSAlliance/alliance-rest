import { Endpoint } from "../endpoint/endpoint";
import { RouteRecord } from "./routeRecord";

export interface RouteGroup {
    handler: { new(): Endpoint };
    groupname: string;
    routes: RouteRecord[];
}