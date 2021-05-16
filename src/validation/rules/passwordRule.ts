import { ValidationRule } from "./validationRule";

export class PasswordRule extends ValidationRule<string> {
    public test(): void {
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+,~.<>|]).{6,254}$/gm;

        if (!this.subject.match(passwordRegex)) {
            this.putFailedTest("password", true, false);
        }
    }
}
