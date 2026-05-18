class OfflineError extends Error {
    message: string;

    constructor(message: string) {
        super(message);
        this.name = "OfflineError";
        this.message = message;
    }
}

class RateLimitError extends Error {
    message: string;

    constructor(message: string) {
        super(message);
        this.name = "RateLimitError";
        this.message = message;
    }
}

class AuthError extends Error {
    message: string;

    constructor(message: string) {
        super(message);
        this.name = "AuthError";
        this.message = message;
    }
}

class UserConflictError extends Error {
    message: string;

    constructor(message: string) {
        super(message);
        this.name = "UserConflictError";
        this.message = message;
    }
}

class ServerError extends Error {
    message: string;

    constructor(message: string) {
        super(message);
        this.name = "ServerError";
        this.message = message;
    }
}

export {
    AuthError,
    OfflineError,
    RateLimitError,
    UserConflictError,
    ServerError,
};
