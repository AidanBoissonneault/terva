export declare const auth: import("better-auth").Auth<{
    database: import("mysql2/promise").Pool;
    advanced: {
        cookiePrefix: string;
        defaultCookieAttributes: {
            domain: string;
            sameSite: "lax";
            secure: boolean;
        };
    };
    emailAndPassword: {
        enabled: true;
        requireEmailVerification: false;
        sendResetPassword: ({ user, url }: {
            user: import("better-auth").User;
            url: string;
            token: string;
        }) => Promise<void>;
    };
    trustedOrigins: string[];
    session: {
        cookieCache: {
            enabled: true;
            maxAge: number;
        };
    };
}>;
//# sourceMappingURL=auth.d.ts.map