import { ValidationRule } from "./validationRule";

export class HexColorRule extends ValidationRule<string> {
    protected test(): void {
        const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/gm;

        if (!this.subject.match(hexRegex)) {
            this.putFailedTest("hexColor", false, true);
        }
    }
}
