import { ValidationRule } from "./rules/validationRule";
import { TextRule } from "./rules/textRule";
import { EmailRule } from "./rules/emailRule";
import { PasswordRule } from "./rules/passwordRule";
import { UrlRule } from "./rules/urlRule";
import { NumberRule } from "./rules/numberRule";

import { ValidationException } from "../error/validationError";

import { HashMap } from "alliance-sdk";

export class Validator {
    private _rules: Array<ValidationRule<any>> = [];

    public text(fieldname: string, subject: string): TextRule {
        let rule = new TextRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public email(fieldname: string, subject: string): EmailRule {
        let rule = new EmailRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public password(fieldname: string, subject: string): PasswordRule {
        let rule = new PasswordRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public url(fieldname: string, subject: string): UrlRule {
        let rule = new UrlRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public number(fieldname: string, subject: number): NumberRule {
        let rule = new NumberRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
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
