export function extractToken(req) {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return req.cookies?.client_token || null;
}

export default {
    extractToken,
}