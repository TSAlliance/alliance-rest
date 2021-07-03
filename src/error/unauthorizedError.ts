import { ApiError } from "alliance-sdk";

export class UnauthorizedError extends ApiError {
    constructor() {
        super("You need to authenticate", 403, "UNAUTHORIZED_ERROR");
    }
}
