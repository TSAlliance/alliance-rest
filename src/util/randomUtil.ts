import { randomBytes } from "crypto";

export class RandomUtil {

    /**
     * Generate a new credential hash for users
     * @returns Hex-String
     */
    public static randomCredentialHash(): string {
        return randomBytes(8).toString("hex");
    }

}