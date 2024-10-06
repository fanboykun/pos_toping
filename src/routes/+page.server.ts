import type { Actions } from '@sveltejs/kit'
import { lucia } from "$lib/server/auth";
import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/db"

export const load = async () => {
    const products = await prisma.product.findMany({
        include: { category: true }
    })
    const topings = await prisma.toping.findMany()
    return { products, topings }
}

export const actions: Actions = {
    logout: async (event) => {
        if (!event.locals.session) {
            return fail(403, { message: 'Unauthenticated User', success: false });
        }
        await lucia.invalidateSession(event.locals.session.id);
        const sessionCookie = lucia.createBlankSessionCookie();
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
        });
        redirect(302, "/");
    }
};
