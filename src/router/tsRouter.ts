import Express, { Request, Response } from "express";

import { RouteGroup } from "./routeGroup";
import { CurrentRoute } from "./currentRoute";

import { UserDetailsService } from "../permissions/userDetailsService";
import { UserDetails } from "../permissions/userDetails";

import { UnauthorizedError } from "../error/unauthorizedError";
import { PermissionDeniedError } from "../error/permissionDeniedError";
import { UnknownEndpointError } from "../error/unknownEndpointError";
import { RouteRecord } from "./routeRecord";
import { RouterOptions } from "./routerOptions";
import { Pageable } from "../pagination/pageable";
import { Controller } from "../controller/controller";
import { ErrorHandler } from "../error/errorHandler";

import { ApiError } from "../error/apiError";
import { NotFoundError } from "../error/notFoundError";

export class TSRouter {
    private static _instance: TSRouter = undefined;

    private _routes: RouteGroup[] = [];
    private _expressApp: Express.Application;
    private _userDetailsService?: UserDetailsService;
    private _routerOptions: RouterOptions = new RouterOptions();
    private _errorHandler?: ErrorHandler;

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
                        let execute = async (request: Request, response: Response) => {
                            let controller: Controller = new group.handler();
                            let actionFn = this.resolveActionFunctionName(route.action);
                            let userDetails: UserDetails = null;

                            // If endpoint requires authentication, authenticate
                            // and authorize request or throw error on fail
                            // Also it is checked if some route parameters contain scopes (e.g.: @me)
                            // that need access to user's details
                            if (
                                controller.isRequiringAuthentication() ||
                                controller.isActionRequiringAuth(route.action) ||
                                this.routeParamsNeedAuth(request.params) ||
                                this._userDetailsService.isAuthorizationPresent(request)
                            ) {
                                let resolvedResult = this._userDetailsService.resolveUserIdFromRequest(request);

                                if (!resolvedResult) {
                                    throw new UnauthorizedError();
                                }

                                userDetails = await this._userDetailsService?.loadUserDetails(resolvedResult);

                                // Check if user was authenticated
                                if (!userDetails.isAuthenticated) {
                                    throw userDetails.authenticationError || new UnauthorizedError();
                                }

                                // Check permissions
                                if (
                                    !userDetails.hasPermission(
                                        controller.getPermissionForAction(route.action)?.value,
                                    ) &&
                                    !this.isOwnResource(request.params)
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
                            if (!controller[actionFn]) {
                                throw new UnknownEndpointError();
                            }

                            controller[actionFn](currentRoute)
                                .then((data: any) => {
                                    // Get returned object from action and create json response from it
                                    let status: number = data?.httpStatusCode || 200;

                                    if (data == null) {
                                        status = 404;
                                        throw new NotFoundError();
                                    } else {
                                        response
                                            .status(status)
                                            .json(data.response || data)
                                            .end();
                                    }
                                })
                                .catch((error: ApiError) => this.throwError(error, request, response));
                        };

                        execute(request, response).catch((error) => this.throwError(error, request, response));
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
     * Throw errors of an error handler is set
     * @param error Error to throw
     * @param request Express' Request object
     * @param response Express' Response
     */
    private throwError(error: ApiError, request: Request, response: Response) {
        if (!this._errorHandler) throw error;
        this._errorHandler.handleError(error, request, response);
    }

    /**
     * Resolve the function name for the specified action
     * @param action Action string
     * @returns Function name as string
     */
    private resolvePageableForRoute(route: RouteRecord, query: any): Pageable {
        if (!query) query = {};

        let pageSize = Number(query["size"]);
        let pageNr = Number(query["page"]);

        if (route.forcePagination) {
            if (isNaN(pageSize)) pageSize = this._routerOptions.pageDefaults.size;
            if (isNaN(pageNr)) pageNr = this._routerOptions.pageDefaults.page;
        } else {
            return null;
        }

        return Pageable.of(pageSize, pageNr);
    }

    /**
     * Check if the requested resource is owned by the user. This is determined wether the params list contains an @me scope or not
     * @param params Parameters of the route
     * @returns {boolean} True or False
     */
    private isOwnResource(params: any): boolean {
        return Object.values(params).includes("@me");
    }

    /**
     * Translate scopes in request parameters to actual values
     * @param route Route for which the translation should be processed
     * @returns {Router.Route} Route containing translated parameters
     */
    private translateScopes(params: any, userDetails: UserDetails): any {
        if (!params) params = {};

        // Translate @me to uuid
        let paramKey = Object.keys(params).find((key) => params[key] == "@me");

        if (paramKey) {
            params[paramKey] = userDetails.uuid;
        }

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
     * Set error handler
     * @param errorHandler Error Handler Implementation
     */
    public setErrorHandler(errorHandler: ErrorHandler): void {
        this._errorHandler = errorHandler;
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
