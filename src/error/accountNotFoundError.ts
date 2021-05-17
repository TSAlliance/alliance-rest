import { ApiError } from "./apiError";

export class AccountNotFoundError extends ApiError {
    constructor() {
        super("Your account could not be found.", 404, "ACCOUNT_MISSING");
    }
}
