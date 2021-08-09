import { HttpException } from "@nestjs/common";
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { ApiError } from "./errors";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {

    public catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let error: ApiError;

        if(exception instanceof ApiError) {
            error = exception;
        } else if(exception instanceof HttpException) {
            error = new ApiError(exception.message, exception.getStatus(), exception.name.toUpperCase(), false);
        } else {
            error = new ApiError(exception.message, HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", true);
            console.error(exception)
        }

        response.status(error.getStatus()).json({
            ...error.toResponse,
            path: request.path
        });
    }

}