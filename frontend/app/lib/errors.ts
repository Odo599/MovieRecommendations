function AuthError(msg: string) {
    const err = Error(msg);
    err.name = "AuthError";
    return err;
}

function OfflineError(msg: string) {
    const err = Error(msg);
    err.name = "AuthError";
    return err;
}

function RateLimitError(msg: string) {
    const err = Error(msg);
    err.name = "RateLimitError";
    return err;
}

export { AuthError, OfflineError, RateLimitError };
