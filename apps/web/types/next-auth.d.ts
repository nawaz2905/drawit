import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            provider?: string;
        } & DefaultSession["user"]
    }

    interface User {
        provider?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        provider?: string;
    }
}
