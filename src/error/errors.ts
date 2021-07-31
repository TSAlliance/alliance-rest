import { ApiError } from "@tsalliance/sdk";

export namespace Errors {
    export class ValidationException extends ApiError {
        constructor(failedTests: Array<any>) {
            super("Failed validating a value.", 400, "VALIDATION_ERROR");
            this.setDetailsList(failedTests);
        }
    }

    export class UnknownEndpointError extends ApiError {
        constructor() {
            super("Unknown endpoint requested.", 400, "UNKNOWN_ENDPOINT_ERROR");
        }
    }

    export class UnauthorizedError extends ApiError {
        constructor() {
            super("You need to authenticate", 403, "UNAUTHORIZED_ERROR");
        }
    }

    export class SessionExpiredError extends ApiError {
        constructor() {
            super("Your session has expired", 403, "SESSION_EXPIRED");
        }
    }

    export class ResourceExistsError extends ApiError {
        constructor() {
            super("A resource with these values already exists.", 400, "RESOURCE_EXISTS");
        }
    }

    export class PermissionDeniedError extends ApiError {
        constructor() {
            super(
                "Permission denied. This means that you are missing some permissions.",
                403,
                "PERMISSION_DENIED_ERROR",
            );
        }
    }

    export class NotFoundError extends ApiError {
        constructor() {
            super("Not found.", 404, "NOT_FOUND");
        }
    }

    export class InternalError extends ApiError {
        constructor() {
            super("Internal server error", 500, "INTERNAL_ERROR");
        }
    }

    export class BadRequestError extends ApiError {
        constructor() {
            super("Bad request", 400, "BAD_REQUEST");
        }
    }

    export class AccountNotFoundError extends ApiError {
        constructor() {
            super("Your account could not be found.", 404, "ACCOUNT_MISSING");
        }
    }
}
