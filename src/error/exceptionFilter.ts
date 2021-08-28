import { HttpException } from "@nestjs/common";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm";
import { ApiError } from "./errors";

type FilterOptions = {
    debug: boolean;
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
    private options: FilterOptions = { debug: false };

    constructor(options?: FilterOptions) {
        if (options) this.options = options;
    }

    public catch(exception: any, host: ArgumentsHost) {
        if (this.options?.debug) console.log(exception);
        if (this.options?.debug) console.log("Caught error in ApiExceptionFilter. Handling...");

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let error: ApiError;

        if (exception instanceof ApiError) {
            if (this.options?.debug) console.log("Identified error as instance of ApiError");
            error = exception;
        } else if (exception instanceof EntityNotFoundError) {
            if (this.options?.debug) console.log("Identified error as instance of EntityNotFoundError");
            error = new ApiError("Requested resource not found", 404, "NOT_FOUND", false);
        } else if (exception instanceof HttpException) {
            if (this.options?.debug) console.log("Identified error as instance of HttpException");
            error = new ApiError(exception.message, exception.getStatus(), exception.name.toUpperCase(), false);
        } else {
            if (this.options?.debug) console.log("Identified error as internal javascript error");
            error = new ApiError(exception.message, HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", true);
            console.error(exception);
        }

        if (this.options?.debug) console.log("Resulting ApiError object:", error);
        response.status(error.getStatus()).json({
            ...error.toResponse(),
            path: request.path,
        });
    }
}
