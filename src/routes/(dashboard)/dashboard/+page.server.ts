import { redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/db"

export const load = async ( { locals } ) => {
    if ( !locals.session || locals.user === null  ) {
        return redirect(302, '/login');
    }

    const [transacionStat, productStat, toppingStat] = await Promise.all([
        prisma.transaction.count(), 
        prisma.product.count(), 
        prisma.toping.count()
    ])
    const stats = [
        {
            main: transacionStat,
            secondary: 'Transaksi',
            description: 'Total Transaksi'
        },
        {
            main: productStat,
            secondary: 'Porduk',
            description: 'Total Item dari Produk'
        },
        {
            main: toppingStat,
            secondary: 'Topping',
            description: 'Total Item dari Topping'
        }
    ]
    return { stats }
}