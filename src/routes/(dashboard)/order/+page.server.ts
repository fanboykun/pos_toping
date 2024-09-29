import { Pagination } from '$lib/pagination';
import * as TransactionFunction from '$lib/server/transaction'
import { fail, redirect, type Action, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load:PageServerLoad = async ( { locals, url } ) => {
    if ( !locals.session || locals.user === null  ) {
        return redirect(302, '/login');
    }

    const transactionCount = await TransactionFunction.getTransactionsCount()
    const paginate = new Pagination(transactionCount, 10, url.pathname)
    let currentPageFromParam = Number(url.searchParams.get('page'))
    if(isNaN(currentPageFromParam) || currentPageFromParam == 0) { currentPageFromParam = 1 }
    paginate.move(Number(currentPageFromParam))

    const transactions = TransactionFunction.getAllTransaction(paginate.pagination.skip, paginate.pagination.take)
    return {
        transactions: transactions,
        transactionCount: transactionCount,
        pagination: paginate.pagination
    }
}

const deleteOrder: Action = async ({ request }) => {
    const form = await request.formData()

    const tId = form.get('transactionId')
    if(!tId || tId == 'undefined') fail(401, { message: 'Order does not provided', data: { tId }, success: false }) 

    if(!await TransactionFunction.deleteTransaction(String(tId))) return fail(401, { message: 'Failed to delete Order', data: { tId }, success: false })
    return { message: 'Order deleted successfully', success: true }
}

export const actions: Actions = { deleteOrder }
