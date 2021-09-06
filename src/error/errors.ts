import { HttpException, HttpStatus } from "@nestjs/common";
import { ValidationError } from "../validator/validator";

export class ApiError extends HttpException {
    public timestamp: Date = new Date();
    public errorId: string;
    public message: string;
    public statusCode?: number;
    public isCritical: boolean;

    constructor(message?: string, statusCode?: number, errorId?: string, isCritical?: boolean) {
        super(message || "Internal Server Error", statusCode || HttpStatus.INTERNAL_SERVER_ERROR);

        this.message = message || "Internal Server Error";
        this.errorId = errorId || "INTERNAL_ERROR";
        this.statusCode = statusCode;
        this.isCritical = isCritical;
    }

    public toResponse(): Record<string, unknown> {
        return {
            statusCode: this.statusCode || 500,
            message: this.isCritical
                ? "An internal server error occured. Please report to administrator"
                : this.message,
            timestamp: this.timestamp,
            errorId: this.errorId,
        };
    }
}

export class ValidationException extends ApiError {
    private errors?: ValidationError[];

    constructor(errors?: ValidationError[]) {
        super("Failed validating a value.", 400, "VALIDATION_ERROR", false);
        this.errors = errors;
    }

    public toResponse(): Record<string, unknown> {
        const response = super.toResponse();
        response.details = this.errors;
        return response;
    }
}

export class CredentialsMismatchException extends ApiError {
    constructor() {
        super("Your credentials don't match.", 403, "CREDENTIALS_MISMATCH", false);
    }
}

export class SessionExpiredException extends ApiError {
    constructor() {
        super("Your session is expired.", 403, "SESSION_EXPIRED", false);
    }
}

export class InsufficientPermissionException extends ApiError {
    constructor() {
        super("Insufficient permission.", 403, "INSUFFICIENT_PERMISSION", false);
    }
}
