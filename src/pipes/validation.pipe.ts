import { ValidationPipe } from "@nestjs/common";
import { AllianceError } from "../error/error";

export const RestValidationPipe = new ValidationPipe({
    enableDebugMessages: true,
    disableErrorMessages: false,
    validationError: {
        target: false,
    },
    exceptionFactory: (errors) => {
        const message = errors
            .map((error) => ({ property: error.property, messages: Object.values(error.constraints) }))
            .reduce((result: any, error) => {
                if (result[error.property]) {
                    result.push(...error.messages);
                } else {
                    result[error.property] = [...error.messages];
                }

                return result;
            }, {});
        const error = new AllianceError(message, "VALIDATION_ERROR", 400);
        return error;
    },
});
