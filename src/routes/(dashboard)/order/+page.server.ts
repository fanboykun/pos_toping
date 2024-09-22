import { getAllTransaction } from '$lib/server/transaction'

export const load = async () => {
    const transactions = await getAllTransaction()
    return { transactions }
}