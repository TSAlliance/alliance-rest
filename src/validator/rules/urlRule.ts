import { ValidationRule } from "./validationRule";

export class UrlRule extends ValidationRule<string> {
    protected test(): void {
        const urlRegex = /(?:^|[ \t])((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/gm;

        if (!this.subject.match(urlRegex)) {
            this.putFailedTest("url", false, true);
        }
    }
}
