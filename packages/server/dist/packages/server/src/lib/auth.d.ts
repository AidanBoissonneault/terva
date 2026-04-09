export declare const auth: import("better-auth").Auth<{
    database: import("mysql2/promise").Pool;
    emailAndPassword: {
        enabled: true;
        requireEmailVerification: false;
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