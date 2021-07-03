import { ApiError } from "alliance-sdk";

export class ResourceExistsError extends ApiError {
    constructor() {
        super("A resource with these values already exists.", 400, "RESOURCE_EXISTS");
    }
}
