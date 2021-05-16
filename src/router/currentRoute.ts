import { RouteRecord } from "./routeRecord";
import { Request, Response } from "express";
import { UserDetails } from "../permissions/userDetails";
import { Pageable } from "../pagination/pageable";

export interface CurrentRoute extends RouteRecord {
    request: Request;
    response: Response;
    query: any;
    body: any;
    params: any;
    pageable?: Pageable;
    userDetails?: UserDetails;
}
