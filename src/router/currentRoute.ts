import { RouteRecord } from "./routeRecord";
import { Request, Response } from "express";
import { Pageable, UserDetails } from "alliance-sdk";

export interface CurrentRoute extends RouteRecord {
    request: Request;
    response: Response;
    query: any;
    body: any;
    params: any;
    pageable?: Pageable;
    userDetails?: UserDetails;
}
