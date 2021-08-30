import { ValidationRule } from "./validationRule";

export type BetweenDates = { before: Date, after: Date}

export class DateRule extends ValidationRule<string> {

    private betweenDates?: BetweenDates;
    private afterDate?: Date;
    private beforeDate?: Date;

    public after(date: Date | string): this {
        if(typeof date == "string") {
            date = new Date(date)
        }

        this.afterDate = date;
        return this;
    }

    public before(date: Date | string): this {
        if(typeof date == "string") {
            date = new Date(date)
        }

        this.beforeDate = date;
        return this;
    }

    public between(dates: BetweenDates): this {
        this.betweenDates = dates;
        return this;
    }

    protected test(): void {
        let subject: Date;

        try {
            subject = new Date(this.subject);
        } catch (err) {
            this.putFailedTest("date", false, true);
            return;
        }

        if (this.afterDate && subject.getTime() <= this.afterDate.getTime()) {
            this.putFailedTest("after", this.subject, this.afterDate);
        }

        if (this.beforeDate && subject.getTime() >= this.beforeDate.getTime()) {
            this.putFailedTest("before", this.subject, this.beforeDate);
        }

        if (this.betweenDates && (subject.getTime() > this.betweenDates.after.getTime() || subject.getTime() < this.betweenDates.after.getTime())) {
            this.putFailedTest("between", this.subject, this.betweenDates);
        }
    }

}
