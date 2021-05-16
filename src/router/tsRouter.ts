import Express, { Request, Response } from "express";

import { RouteGroup } from "./routeGroup";
import { CurrentRoute } from "./currentRoute";
import { Endpoint } from "../endpoint/endpoint";

import { UserDetailsService } from "../permissions/userDetailsService";
import { UserDetails } from "../permissions/userDetails";

import { UnauthorizedError } from "../error/unauthorizedError";
import { PermissionDeniedError } from "../error/permissionDeniedError";
import { UnknownEndpointError } from "../error/unknownEndpointError";
import { ApiError } from "../error/apiError";
import { RouteRecord } from "./routeRecord";
import { RouterOptions } from "./routerOptions";
import { Pageable } from "../pagination/pageable";

export class TSRouter {
    private static _instance: TSRouter = undefined;

    private _routes: RouteGroup[] = [];
    private _expressApp: Express.Application;
    private _userDetailsService?: UserDetailsService;
    private _routerOptions: RouterOptions = new RouterOptions();

    constructor(expressApp: Express.Application, routes: RouteGroup[], routerOptions?: RouterOptions) {
        this._routes = routes;
        this._expressApp = expressApp;

        // Set router options
        if (routerOptions) {
            this._routerOptions = routerOptions;
        }

        for (let group of this._routes) {
            for (let route of group.routes) {
                this._expressApp[route.method.toLowerCase()](
                    route.path,
                    async (request: Request, response: Response) => {
                        let endpointHandler: Endpoint = new group.handler();
                        let actionFn = this.resolveActionFunctionName(route.action);
                        let userDetails: UserDetails = null;

                        console.log(request.params);
                        console.log(request.query);

                        // If endpoint requires authentication, authenticate
                        // and authorize request or throw error on fail
                        // Also it is checked if some route parameters contain scopes (e.g.: @me)
                        // that need access to user's details
                        if (
                            endpointHandler.isRequiringAuthentication() ||
                            endpointHandler.isActionRequiringAuth(route.action) ||
                            this.routeParamsNeedAuth(request.params)
                        ) {
                            let userId = this._userDetailsService.resolveUserIdFromRequest(request);
                            userDetails = this._userDetailsService?.loadUserDetails(userId);

                            // Check if user was authenticated
                            if (!userDetails.isAuthenticated) {
                                throw userDetails.authenticationError || new UnauthorizedError();
                            }

                            // Check permissions
                            if (
                                !userDetails.hasPermission(endpointHandler.getPermissionForAction(route.action).value)
                            ) {
                                throw new PermissionDeniedError();
                            }
                        }

                        // Build current route object
                        // Should include request, response, userDetails, route info, parsed params and query args, (optional: Pageable object)
                        let currentRoute: CurrentRoute = {
                            ...route,
                            request,
                            response,
                            userDetails,
                            params: this.translateScopes(request.params, userDetails) || {},
                            query: request.query || {},
                            body: request.body || {},
                            pageable: this.resolvePageableForRoute(route, request.query),
                        };

                        // Execute action on endpoint with current route as parameter
                        if (!endpointHandler[actionFn]) {
                            throw new UnknownEndpointError();
                        }

                        Promise.resolve(endpointHandler[actionFn](currentRoute))
                            .then((data: any) => {
                                // Get returned object from action and create json response from it

                                let status: number = !data ? 404 : 200;
                                let json: string = JSON.stringify(data);

                                response.status(status).json(json);
                            })
                            .catch((error: ApiError) => {
                                throw error;
                            })
                            .finally(() => {
                                response.end();
                            });
                    },
                );
            }
        }
    }

    /**
     * Resolve the function name for the specified action
     * @param action Action string
     * @returns Function name as string
     */
    private resolveActionFunctionName(action: string): string {
        return "action" + action.charAt(0).toUpperCase() + action.slice(1);
    }

    /**
     * Resolve the function name for the specified action
     * @param action Action string
     * @returns Function name as string
     */
    private resolvePageableForRoute(route: RouteRecord, query: any): Pageable {
        let pageSize;
        let pageNr;

        if (route.forcePagination) {
            pageSize = this._routerOptions.pageDefaults.size;
            pageNr = this._routerOptions.pageDefaults.page;
        }

        pageSize = query.find((queryParam) => queryParam === "size");
        pageNr = query.find((queryParam) => queryParam === "page");

        if (!pageSize || !pageNr) {
            return null;
        }

        return Pageable.of(pageSize, pageNr);
    }

    /**
     * Translate scopes in request parameters to actual values
     * @param route Route for which the translation should be processed
     * @returns {Router.Route} Route containing translated parameters
     */
    private translateScopes(params: any, userDetails: UserDetails): any[] {
        let param = params.find((param) => params[param] === "@me");
        params[param] = userDetails.id;

        return params;
    }

    /**
     * Check if a param of the route contains a scope that requires an user's details
     * @param params List of route parameters
     * @returns True or False
     */
    private routeParamsNeedAuth(params: any): boolean {
        let requiresAuth = false;

        for (let param in params) {
            if (params[param] == "@me") {
                requiresAuth = true;
                break;
            }
        }

        return requiresAuth;
    }

    /**
     * Set user details service for authentication
     * @param service Service's implementation
     */
    public setUserDetailsService(service: UserDetailsService): void {
        this._userDetailsService = service;
    }

    /**
     * Create a new global instance of the Router. This overwrites existing instances.
     * @param routes List of routes
     * @returns TSRouter instance
     */
    public static createInstance(
        expressApp: Express.Application,
        routes: RouteGroup[],
        routerOptions?: RouterOptions,
    ): TSRouter {
        this._instance = new TSRouter(expressApp, routes, routerOptions);
        return this._instance;
    }

    /**
     * Get the global instance of the Router. An instance must be created first using createInstance()
     * @returns TSRouter instance
     */
    public static getInstance(): TSRouter {
        return this._instance;
    }
}
