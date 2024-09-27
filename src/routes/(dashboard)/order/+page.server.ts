import * as TransactionFunction from '$lib/server/transaction'
import { fail, redirect, type Action, type Actions } from '@sveltejs/kit';

export const load = async ( { locals } ) => {
    if ( !locals.session || locals.user === null  ) {
        return redirect(302, '/login');
    }

    const transactions = await TransactionFunction.getAllTransaction()
    return { transactions }
}

const deleteOrder: Action = async ({ request }) => {
    const form = await request.formData()

    const tId = form.get('transactionId')
    if(!tId || tId == 'undefined') fail(401, { message: 'Order does not provided', data: { tId }, success: false }) 

    if(!await TransactionFunction.deleteTransaction(String(tId))) return fail(401, { message: 'Failed to delete Order', data: { tId }, success: false })
    return { message: 'Order deleted successfully', success: true }
}

export const actions: Actions = { deleteOrder }
