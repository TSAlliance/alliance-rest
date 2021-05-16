import { ValidationRule } from "./rules/validationRule";
import { TextRule } from "./rules/textRule";
import { EmailRule } from "./rules/emailRule";
import { PasswordRule } from "./rules/passwordRule";
import { UrlRule } from "./rules/urlRule";
import { NumberRule } from "./rules/numberRule";

import { HashMap } from "../util/hashMap";
import { ValidationException } from "../error/validationError";

export class Validator {
    private _rules: Array<ValidationRule<any>> = [];

    public text(fieldname: string, subject: string): TextRule {
        return new TextRule(subject, fieldname);
    }

    public email(fieldname: string, subject: string): EmailRule {
        return new EmailRule(subject, fieldname);
    }

    public password(fieldname: string, subject: string): PasswordRule {
        return new PasswordRule(subject, fieldname);
    }

    public url(fieldname: string, subject: string): UrlRule {
        return new UrlRule(subject, fieldname);
    }

    public number(fieldname: string, subject: number): NumberRule {
        return new NumberRule(subject, fieldname);
    }

    public throwErrors(): void {
        let errors: Array<HashMap<any>> = this._rules
            .filter((rule) => rule.failedTests.length > 0)
            .map((rule) => {
                let details: HashMap<any> = {};

                details["fieldname"] = rule.fieldname;
                details["failedTests"] = rule.failedTests;

                return details;
            });

        if (errors.length > 0) {
            throw new ValidationException(errors);
        }
    }
}
