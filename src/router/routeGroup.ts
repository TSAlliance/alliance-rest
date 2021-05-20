import { Controller } from "../controller/controller";
import { RouteRecord } from "./routeRecord";

export interface RouteGroup {
    handler: { new (): Controller };
    groupname: string;
    routes: RouteRecord[];
}
