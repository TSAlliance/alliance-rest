export class RouterOptions {
    public pageDefaults: PageDefaults = {
        size: 30,
        page: 0,
    };
}

export interface PageDefaults {
    size: number;
    page: number;
}
