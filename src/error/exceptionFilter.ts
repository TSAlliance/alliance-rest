import { HttpException } from "@nestjs/common";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { ApiError } from "@tsalliance/sdk";
import { EntityNotFoundError } from "typeorm";

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

        if (exception.errorId) {
            if (this.options?.debug) console.log("Identified error as instance of ApiError");
            error = exception;
        } else if (exception instanceof EntityNotFoundError) {
            if (this.options?.debug) console.log("Identified error as instance of EntityNotFoundError");
            error = new ApiError("Requested resource not found", "NOT_FOUND", { statusCode: 404, isCritical: false });
        } else if (exception instanceof HttpException) {
            if (this.options?.debug) console.log("Identified error as instance of HttpException");
            error = new ApiError(exception.message, exception.name.toUpperCase(), {
                statusCode: exception.getStatus(),
                isCritical: false,
            });
        } else {
            if (this.options?.debug) console.log("Identified error as internal javascript error");
            error = new ApiError(exception.message, "INTERNAL_ERROR", {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                isCritical: false,
            });
            console.error(exception);
        }

        if (this.options?.debug) console.log("Resulting ApiError object:", error);
        response.status(error.statusCode || 500).json({
            ...error.toResponse(),
            path: request.path,
        });
    }
}
