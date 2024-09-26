import { findIsRequestFromAdmin } from "$lib/server/auth.js";
import * as ToppingFunction from "$lib/server/topping"
import { fail, redirect, type Action, type Actions } from "@sveltejs/kit"
import { Validator, type finalValidationResult, type validateType } from "ts-input-validator"

export const load = async ( { locals } ) => {
    if ( !locals.session || locals.user === null  ) {
        return redirect(302, '/login');
    }

    const toppings = ToppingFunction.getAllTopping()
    return { toppings }
}

const addTopping: Action = async ({ request, locals }) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()

    // get the data from the form
    const data = {
        name: form.get('name'),
        price: Number(form.get('price'))
    }

    // prepare validation rules
    const toValidate: validateType[] = [
        { data: data.name, key: 'name', rules: ['required', 'string'], message: {
            required: 'mohon input nama topping',
            string: 'nama topping harus berisi kata'
        } },
        { data: data.price, key: 'price', rules: ['required', 'number', 'minDigit:3', 'min:1'], message: {
            required: 'mohon input harga topping',
            number: 'harga topping harus berupa anga',
            minDigit: 'harga harus berisi minimum 3 digit',
            min: 'harga tidak boleh 0'
        } },
    ]

    // begin the validation
    const [ failed, result ]: finalValidationResult = Validator.validate(toValidate)

    // throw if failed
    if(failed) {
        return fail(401, { message: 'Form is invalid', result, data: { ...data }, success: false })
    }

    // insert data to the db
    const topping = await ToppingFunction.addNewTopping({
        name: String(data.name),
        price: Number(data.price),
    })

    // if the topping creation was not success
    if(!topping) return fail(400, { message: 'Failed to create topping', data: { ...data }, success: false })

    // return the result
    return { topping, message: 'Topping created successfully', success: true }

}

const deleteTopping: Action = async ( { request, locals } ) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()
    const tId = form.get('toppingId')
    if(!tId || tId == 'undefined') fail(401, { message: 'Topping does not provided', data: { tId }, success: false }) 

    if(!await ToppingFunction.deleteTopping(String(tId))) fail(401, { message: 'Failed to delete Topping', data: { tId }, success: false })
    return { message: 'Topping deleted successfully', success: true }
}

const editTopping: Action = async ( { request, locals } ) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()

    // get the data from the form
    const data = {
        id: form.get('id'),
        name: form.get('name'),
        price: Number(form.get('price'))
    }

    // prepare validation rules
    const toValidate: validateType[] = [
        { data: data.id, key: 'id', rules: 'required|string', message: {
            required: 'mohon pilih topping',
            string: 'topping harus valid'
        } },
        { data: data.name, key: 'name', rules: ['required', 'string'], message: {
            required: 'mohon input nama topping',
            string: 'nama topping harus berisi kata'
        } },
        { data: data.price, key: 'price', rules: ['required', 'number', 'minDigit:3', 'min:1'], message: {
            required: 'mohon input harga topping',
            number: 'harga topping harus berupa anga',
            minDigit: 'harga harus berisi minimum 3 digit',
            min: 'harga tidak boleh 0'
        } },
    ]

    // begin the validation
    const [ failed, result ]: finalValidationResult = Validator.validate(toValidate)

    // throw if failed
    if(failed) {
        return fail(401, { message: 'Form is invalid', result, data: { ...data }, success: false })
    }

    // insert data to the db
    const topping = await ToppingFunction.updateTopping({
        id: String(data.id),
        name: String(data.name),
        price: Number(data.price),
    })

    // if the topping creation was not success
    if(!topping) return fail(400, { message: 'Failed to create topping', data: { ...data }, success: false })

    // return the result
    return { topping, message: 'Topping created successfully', success: true }
}

export const actions: Actions = { addTopping, deleteTopping, editTopping }
