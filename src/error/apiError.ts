import { HashMap } from "../util/hashMap";
import { Response } from "../response";

export abstract class ApiError extends Error implements Response {
    public response: HashMap<any> = {};
    public httpStatusCode: number = 400;

    constructor(message: string, httpStatusCode: number, errorCode?: string) {
        super(message);

        this.response["timestamp"] = new Date();
        this.response["error"] = errorCode || "UNKNOWN_ERROR";
        this.response["message"] = this.message;

        this.httpStatusCode = httpStatusCode;
    }

    protected putDetail(key: string, value: any): void {
        let details: HashMap<any> = this.response["details"] || {};
        details[key] = value;

        this.response["details"] = details;
    }

    protected setDetailsList(details: Array<any>): void {
        this.response["details"] = details;
    }
    protected setDetailsMap(details: HashMap<any>): void {
        this.response["details"] = details;
    }
}
