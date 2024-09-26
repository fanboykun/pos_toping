import { PrismaClient } from '@prisma/client'
import type { Actions } from '@sveltejs/kit'
import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";

export const load = async () => {
    const prisma = new PrismaClient()
    const products = await prisma.product.findMany({
        include: { category: true }
    })
    const topings = await prisma.toping.findMany()
    return { products, topings }
}

export const actions: Actions = {
    logout: async (event) => {
        console.log('here')
        if (!event.locals.session) {
            return fail(401);
        }
        await lucia.invalidateSession(event.locals.session.id);
        const sessionCookie = lucia.createBlankSessionCookie();
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
        });
        redirect(302, "/login");
    }
};
