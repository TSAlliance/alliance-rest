import { AllianceError } from "./error";

export class CredentialsMismatchException extends AllianceError {
    constructor() {
        super("Your credentials don't match.", "CREDENTIALS_MISMATCH", 403);
    }
}

export class SessionExpiredException extends AllianceError {
    constructor() {
        super("Your session is expired.", "SESSION_EXPIRED", 403);
    }
}

export class InsufficientPermissionException extends AllianceError {
    constructor() {
        super("Insufficient permission.", "INSUFFICIENT_PERMISSION", 403);
    }
}

export class AccountNotFoundException extends AllianceError {
    constructor() {
        super("Your account does not exist.", "ACCOUNT_NOT_FOUND", 403);
    }
}
