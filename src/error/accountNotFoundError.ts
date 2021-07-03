import { ApiError } from "alliance-sdk";

export class AccountNotFoundError extends ApiError {
    constructor() {
        super("Your account could not be found.", 404, "ACCOUNT_MISSING");
    }
}
