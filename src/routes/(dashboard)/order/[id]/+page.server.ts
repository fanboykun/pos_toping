import * as TransactionFunction from '$lib/server/transaction.js';
import { redirect } from '@sveltejs/kit';

export const load = async ( { locals, params } ) => {
    if ( !locals.session || locals.user === null  ) {
        return redirect(302, '/login');
    }

    const transactionId = params.id
    if(!transactionId) return redirect(300, '/order')
        
    const transaction = await TransactionFunction.findTransactionWithProductAndToping(transactionId)
    if(!transaction) return redirect(300, '/order')
    
    return { transaction }
}