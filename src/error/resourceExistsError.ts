import { ApiError } from "./apiError";

export class ResourceExistsError extends ApiError {
    constructor() {
        super("A resource with these values already exists.", 400, "RESOURCE_EXISTS");
    }
}
