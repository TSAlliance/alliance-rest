import CryptUtil from "./util/cryptUtil";
import { MailUtil } from "./util/mailSender";
import { RandomUtil } from "./util/randomUtil";
export { RandomUtil, MailUtil, CryptUtil };

import { ApiError, ValidationException } from "./error/errors";
import { ApiExceptionFilter } from "./error/exceptionFilter";
export { ApiExceptionFilter, ApiError, ValidationException };

import { ValidatorModule, Validator } from "./validator/validator";
import { ValidationRule } from "./validator/rules/validationRule";
export { ValidatorModule, Validator, ValidationRule };

import { RestRepository } from "./repository/restRepository";
export { RestRepository };

const validator = new Validator();
console.log("Valid? >> ", validator.text("test", null).check()); // False, but does not throw error
console.log("Valid? >> ", validator.text("test", "hello").check()); // True
console.log("Valid? >> ", validator.text("test", undefined).required().check()); // False and collects an error to throw below

try {
    validator.throwErrors();
} catch (err) {
    console.log(err);
}
