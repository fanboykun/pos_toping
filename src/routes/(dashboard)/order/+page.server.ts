import { getAllTransaction } from '$lib/server/transaction'
import { redirect } from '@sveltejs/kit';

export const load = async ( { locals } ) => {
    if ( !locals.session || locals.user === null  ) {
        return redirect(302, '/login');
    }

    const transactions = await getAllTransaction()
    return { transactions }
}