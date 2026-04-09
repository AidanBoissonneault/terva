export type AuthUser = {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
};
export type AuthSession = {
    user: AuthUser;
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
    };
};
//# sourceMappingURL=auth.d.ts.map