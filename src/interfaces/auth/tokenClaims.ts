export interface TokenClaims {
    role: UserRoles;
    sub: string;
    exp: number;
    iat: number;
}

export type UserRoles = "CLIENTE" | "ADMIN" | "guest";