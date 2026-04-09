import {} from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
export async function requireAuth(req, res, next) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // Attach session to res.locals for downstream use
    res.locals.session = session;
    res.locals.user = session.user;
    next();
}
//# sourceMappingURL=requireAuth.js.map