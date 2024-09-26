import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const adapter = new PrismaAdapter(prisma.session, prisma.user);


export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
        // set to `true` when using HTTPS
        secure: !dev
        }
    },
    getUserAttributes: (attributes) => {
        return {
            email: attributes.email,
            name: attributes.name,
            isAdmin: attributes.isAdmin
        }
    }
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes
    }
}

interface DatabaseUserAttributes {
    email: string,
    name: string,
    isAdmin: boolean
}

export const findIsRequestFromAdmin = ( locals: App.Locals ) => {
    if ( locals.session && locals.user !== null && locals.user.isAdmin ) {
        return true
    }
    return false
}


