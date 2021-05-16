import { ApiError } from "./apiError";

export class ValidationException extends ApiError {
    constructor(failedTests: Array<any>) {
        super("Failed validating a value.", 400);
        this.setDetailsList(failedTests);
    }

    protected getErrorCode(): string {
        return "VALIDATION_ERROR";
    }
}
