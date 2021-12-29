export class AllianceError extends Error {
    private id: string;
    private info: string | Record<string, string[]>;
    private statusCode: number;
    private timestamp: Date;
    private path: string;

    constructor(
        message: string | Record<string, string[]>,
        id?: string,
        statusCode: number = 400,
        path: string = undefined,
    ) {
        super(message.toString());
        this.id = id || "UNKNOWN_ERROR";
        this.info = message;
        this.statusCode = statusCode;
        this.timestamp = new Date();
        this.path = path;
    }

    public getStatus(): number {
        return this.statusCode;
    }

    public getTimestamp(): Date {
        return this.timestamp;
    }

    public getPath(): string {
        return this.path;
    }

    public getMessage(): string | Record<string, string[]> {
        return this.info;
    }

    public toResponse(): Record<string, unknown> {
        return {
            statusCode: this.statusCode || 500,
            message: this.info,
            timestamp: this.timestamp,
            id: this.id,
        };
    }
}
