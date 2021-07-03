import { ApiError } from "alliance-sdk";

export class SessionExpiredError extends ApiError {
    constructor() {
        super("Your session has expired", 403, "SESSION_EXPIRED");
    }
}
