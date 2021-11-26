import { ValidationRule } from "./rules/validationRule";
import { TextRule } from "./rules/textRule";
import { EmailRule } from "./rules/emailRule";
import { PasswordRule } from "./rules/passwordRule";
import { UrlRule } from "./rules/urlRule";
import { NumberRule } from "./rules/numberRule";

import { Global, Injectable, Module, Scope } from "@nestjs/common";
import { ValidationException } from "../error/errors";
import { DateRule } from "./rules/dateRule";
import { HexColorRule } from "./rules/hexColorRule";

export interface FailedRule {
    name: string;
    expected: any;
    found: any;
}

export interface ValidationError {
    fieldname: string;
    errors: FailedRule[];
}

@Injectable({ scope: Scope.REQUEST })
export class Validator {
    private _rules: Array<ValidationRule<any>> = [];

    public text(fieldname: string, subject: string): TextRule {
        const rule = new TextRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public email(fieldname: string, subject: string): EmailRule {
        const rule = new EmailRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public password(fieldname: string, subject: string): PasswordRule {
        const rule = new PasswordRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public url(fieldname: string, subject: string): UrlRule {
        const rule = new UrlRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public hexColor(fieldname: string, subject: string): HexColorRule {
        const rule = new HexColorRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public number(fieldname: string, subject: number): NumberRule {
        const rule = new NumberRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public date(fieldname: string, subject: string): DateRule {
        const rule = new DateRule(subject, fieldname);
        this._rules.push(rule);
        return rule;
    }

    public throwErrors(): void {
        const errors: Array<ValidationError> = this._rules
            .filter((rule) => rule.failedTests.length > 0)
            .map((rule) => {
                return {
                    fieldname: rule.fieldname,
                    errors: rule.failedTests,
                };
            });

        if (errors.length > 0) {
            throw new ValidationException(errors);
        }
    }
}

@Global()
@Module({
    providers: [Validator],
    exports: [Validator],
})
export class ValidatorModule {}
