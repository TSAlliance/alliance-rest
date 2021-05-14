import { HashMap } from "../util/hashMap";

export abstract class ApiError extends Error {

    private readonly _response: HashMap<any> = {};
    private readonly _httpStatusCode: number = 400;

    constructor(message: string, httpStatusCode: number) {
        super(message);

        this._response["timestamp"] = new Date();
        this._response["error"] = this.getErrorCode();
        this._response["message"] = this.message;

        this._httpStatusCode = httpStatusCode;
    }

    protected putDetail(key: string, value: any): void {
        let details: HashMap<any> = this._response["details"] || {};
        details[key] = value;

        this._response["details"] = details;
    }

    protected setDetailsList(details: Array<any>): void {
        this._response["details"] = details;
    }
    protected setDetailsMap(details: HashMap<any>): void {
        this._response["details"] = details;
    }

    protected abstract getErrorCode(): string;

    public get response(): HashMap<any> {
        return this._response
    }

    public get httpStatus(): number {
        return this._httpStatusCode;
    }

}