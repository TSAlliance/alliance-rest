import { ApiError } from "@tsalliance/sdk";
import { ValidationError } from "../validator/validator";

// TODO: Rework error system

export class ValidationException extends ApiError {
    private errors?: ValidationError[];

    constructor(errors?: ValidationError[]) {
        super("Failed validating a value.", "VALIDATION_ERROR", { statusCode: 400, isCritical: false });
        this.errors = errors;
        this.details = this.errors;
    }
}

export class CredentialsMismatchException extends ApiError {
    constructor() {
        super("Your credentials don't match.", "CREDENTIALS_MISMATCH", { statusCode: 403, isCritical: false });
    }
}

export class SessionExpiredException extends ApiError {
    constructor() {
        super("Your session is expired.", "SESSION_EXPIRED", { statusCode: 403, isCritical: false });
    }
}

export class InsufficientPermissionException extends ApiError {
    constructor() {
        super("Insufficient permission.", "INSUFFICIENT_PERMISSION", { statusCode: 403, isCritical: false });
    }
}

export class AccountNotFoundException extends ApiError {
    constructor() {
        super("Your account does not exist.", "ACCOUNT_NOT_FOUND", { statusCode: 403, isCritical: false });
    }
}
