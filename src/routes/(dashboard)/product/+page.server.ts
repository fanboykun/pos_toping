import { findIsRequestFromAdmin } from "$lib/server/auth.js"
import { getAllCategory } from "$lib/server/category"
import { addNewProduct, deleteProduct as deletePRoductFormDb, getAllProductWithCategory, updateProduct } from "$lib/server/product"
import { fail, redirect, type Action, type Actions } from "@sveltejs/kit"
import { Validator } from "ts-input-validator"
import type { validateType, finalValidationResult } from "ts-input-validator"

// type ActionReturn = Record<string, unknown> & { message: string, success: boolean }

export const load = async ( { locals } ) => {
    if ( !locals.session || locals.user === null  ) {
        return redirect(302, '/login');
    }

    const [products, categories] = [getAllProductWithCategory(), getAllCategory()]
    return { products, categories }
}

const addProduct: Action = async ({ request, locals }) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()

    // get the data from the form
    const data = {
        name: form.get('name'),
        price: Number(form.get('price')),  // force cast the input to number since the form input value is always string
        categoryId: form.get('categoryId')
    }

    // prepare validation rules
    const toValidate: validateType[] = [
        { data: data.name, key: 'name', rules: 'required|string', message: {
            required: 'mohon input nama produk',
            string: 'nama produk harus berisi kata'
        } },
        { data: data.price, key: 'price', rules: 'required|number|minDigit:3|min:1' ,message: {
            required: 'mohon input harga produk',
            number: 'harga produk harus berupa anga',
            minDigit: 'harga harus berisi minimum 3 digit',
            min: 'harga tidak boleh 0'
        } },
        { data: data.categoryId, key: 'categoryId', rules: ['required', 'string', 'notEqualTo:undefined'] },
    ]
    // begin to validate
    let [ failed, result ]: finalValidationResult = Validator.validate(toValidate)

    // prepare if the categoryId value is 'undefined'
    if(data.categoryId == 'undefined') {
        failed = true
        if(result) {
            result['categoryId'] = {
                valid: false,
                message: {
                    required: 'mohon input kategori'
                }
            }
        } else {
            result = {
                categoryId: {
                    valid: false,
                    message: 'category id must be filled'
                }
            }
        }
    }

    // throw if failed
    if(failed) {
        return fail(401, { message: 'Form is invalid', result, data: { ...data }, success: false })
    }

    // insert data to the db
    const product = await addNewProduct({
        name: String(data.name),
        price: Number(data.price),
        categoryId: String(data.categoryId)
    })

    // if the product creation was not success
    if(!product) return fail(400, { message: 'Failed to create product', data: { ...data }, success: false })

    // return the result
    return { product, message: 'Product created successfully', success: true }
}

const deleteProduct: Action = async ({ request, locals }) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()
    const pId = form.get('productId')
    if(!pId || pId == 'undefined') fail(401, { message: 'Product does not provided', data: { pId }, success: false }) 

    if(!await deletePRoductFormDb(String(pId))) fail(401, { message: 'Failed to delete product', data: { pId }, success: false })
    return { message: 'Product deleted successfully', success: true }
}

const editProduct: Action = async ({ request, locals }) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()

    // get the data from the form
    const data = {
        id: form.get('id'),
        name: form.get('name'),
        price: Number(form.get('price')),  // force cast the input to number since the form input value is always string
        categoryId: form.get('categoryId')
    }

    // prepare validation rules
    const toValidate: validateType[] = [
        { data: data.id, key: 'id', rules: 'required|string', message: {
            required: 'mohon input produk',
            string: 'produk harus valid'
        } },
        { data: data.name, key: 'name', rules: 'required|string', message: {
            required: 'mohon input nama produk',
            string: 'nama produk harus berisi kata'
        } },
        { data: data.price, key: 'price', rules: 'required|number|minDigit:3|min:1' ,message: {
            required: 'mohon input harga produk',
            number: 'harga produk harus berupa anga',
            minDigit: 'harga harus berisi minimum 3 digit',
            min: 'harga tidak boleh 0'
        } },
        { data: data.categoryId, key: 'categoryId', rules: ['required', 'string', 'notEqualTo:undefined'] },
    ]
    // begin to validate
    let [ failed, result ]: finalValidationResult = Validator.validate(toValidate)

    // prepare if the categoryId value is 'undefined'
    if(data.categoryId == 'undefined') {
        failed = true
        if(result) {
            result['categoryId'] = {
                valid: false,
                message: {
                    required: 'mohon input kategori'
                }
            }
        } else {
            result = {
                categoryId: {
                    valid: false,
                    message: 'category id must be filled'
                }
            }
        }
    }

    // throw if failed
    if(failed) {
        return fail(401, { message: 'Form is invalid', result, data: { ...data }, success: false })
    }

    // insert data to the db
    const product = await updateProduct({
        id: String(data.id),
        name: String(data.name),
        price: Number(data.price),
        categoryId: String(data.categoryId)
    })

    // if the product creation was not success
    if(!product) return fail(400, { message: 'Failed to update product', data: { ...data }, success: false })

    // return the result
    return { product, message: 'Product updated successfully', success: true }
}

export const actions: Actions = { addProduct, deleteProduct, editProduct }