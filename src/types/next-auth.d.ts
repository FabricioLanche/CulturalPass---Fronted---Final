import { UserRoles } from "@src/interfaces/auth/tokenClaims"
import "next-auth"

declare module "next-auth" {
    interface Session {
        accessToken?: string
        user: {
            id: string
            email: string
            firstName: string
            lastName: string
            role: UserRoles
        }
    }

    interface User {
        id: string
        email: string
        accessToken: string
        firstName: string
        lastName: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        accessToken: string
    }
}