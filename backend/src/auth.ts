import argon2 from "argon2";

export async function hashPassword(plainPassword: string) {
    const hash = await argon2.hash(plainPassword);
    return hash;
}

export async function verifyPassword(
    storedHash: string,
    loginAttemptPassword: string
) {
    try {
        const isMatch = await argon2.verify(storedHash, loginAttemptPassword);
        return isMatch;
    } catch {
        return false;
    }
}
