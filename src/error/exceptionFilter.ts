import { HttpException, Inject, Logger } from "@nestjs/common";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm";
import { REST_CONFIG_OPTIONS } from "../constants";
import { AllianceRestOptions } from "../rest.module";
import { AllianceError } from "./error";

@Catch()
export class AllianceExceptionFilter implements ExceptionFilter {
    private logger: Logger = new Logger("REST Exception");

    constructor(@Inject(REST_CONFIG_OPTIONS) private options: AllianceRestOptions) {}

    public catch(exception: any, host: ArgumentsHost) {
        if (this.options.logging) console.log(exception);
        if (this.options.logging) this.logger.warn("Caught error in ApiExceptionFilter. Handling...");

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let error: AllianceError;

        if (exception.id) {
            if (this.options.logging) this.logger.log("Identified error as instance of ApiError");
            error = exception;
        } else if (exception instanceof EntityNotFoundError) {
            if (this.options.logging) this.logger.log("Identified error as instance of EntityNotFoundError");
            error = new AllianceError("Requested resource not found", "NOT_FOUND", 404);
        } else if (exception instanceof HttpException) {
            if (this.options.logging) this.logger.log("Identified error as instance of HttpException");
            error = new AllianceError(exception.message, exception.name.toUpperCase(), exception.getStatus());
        } else {
            if (this.options.logging) this.logger.log("Identified error as internal javascript error");
            if (this.options.logging) this.logger.error(exception);
            error = new AllianceError(exception.message, "INTERNAL_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (this.options.logging) this.logger.error("Resulting ApiError object:", error);
        response.status(error.getStatus() || 500).json({
            ...error.toResponse(),
            path: request.path,
        });
    }
}
