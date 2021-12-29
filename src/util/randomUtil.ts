import { randomBytes } from "crypto";

export class RandomUtil {
    /**
     * Generate a new credential hash for users whith a length of 8.
     * @returns Hex-String
     */
    public static randomCredentialHash(): string {
        return randomBytes(8).toString("hex");
    }

    public static generateClientId(): string {
        return this.randomString(16);
    }

    public static generateClientSecret(): string {
        return this.randomString(32);
    }

    public static randomString(length = 8): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        let str = "";
        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return str;
    }
}
