export class EndpointPermission {
    public value: string;
    public action: string;

    constructor(value: string, action: string) {
        this.value = value;
        this.action = action;
    }
}
