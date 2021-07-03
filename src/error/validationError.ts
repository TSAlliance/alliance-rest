import { ApiError } from "alliance-sdk";

export class ValidationException extends ApiError {
    constructor(failedTests: Array<any>) {
        super("Failed validating a value.", 400, "VALIDATION_ERROR");
        this.setDetailsList(failedTests);
    }
}
