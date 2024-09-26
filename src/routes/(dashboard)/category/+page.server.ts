import { findIsRequestFromAdmin } from "$lib/server/auth.js"
import * as CategoryFunction from "$lib/server/category"
import type { Prisma } from "@prisma/client"
import { fail, redirect, type Action, type Actions } from "@sveltejs/kit"
import { Validator, type finalValidationResult, type validateType } from "ts-input-validator"

export const load = async ( { locals } ) => {
    if ( !locals.session || locals.user === null  ) {
        return redirect(302, '/login');
    }

    const categories = CategoryFunction.getAllCategory()
    return { categories }
}

const addCategory: Action = async ( { request, locals } ) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()
    const data: Prisma.CategoryCreateInput = {
        name: String(form.get('name'))
    }

    const toValidate: validateType[] = [
        { data: data.name, key: 'name', rules: 'required|string', message: {
            required: 'mohon input nama kategori',
            string: 'kategori harus berisi huruf'
        } },
    ]

    // begin the validation
    const [ failed, result ]: finalValidationResult = Validator.validate(toValidate)

    // throw if failed
    if(failed) {
        return fail(401, { message: 'Form is invalid', result, data: { ...data }, success: false })
    }

    // insert data to the db
    const category = await CategoryFunction.addNewCategory({
        name: String(data.name),
    })

    // if the topping creation was not success
    if(!category) return fail(400, { message: 'Failed to create category', data: { ...data }, success: false })

    // return the result
    return { category, message: 'Category created successfully', success: true }

}

const editCategory: Action = async ( { request, locals } ) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()
    const data: Prisma.CategoryCreateInput = {
        id: String(form.get('id')),
        name: String(form.get('name'))
    }

    const toValidate: validateType[] = [
        { data: data.id, key: 'id', rules: 'required|string', message: {
            required: 'mohon pilih kategori',
            string: 'kategori harus valid'
        } },
        { data: data.name, key: 'name', rules: 'required|string', message: {
            required: 'mohon input nama kategori',
            string: 'kategori harus berisi huruf'
        } },
    ]

    // begin the validation
    const [ failed, result ]: finalValidationResult = Validator.validate(toValidate)

    // throw if failed
    if(failed) {
        return fail(401, { message: 'Form is invalid', result, data: { ...data }, success: false })
    }

    // insert data to the db
    const category = await CategoryFunction.updateCategory({
        id: String(data.id),
        name: String(data.name)
    })

    // if the topping creation was not success
    if(!category) return fail(400, { message: 'Failed to update category', data: { ...data }, success: false })

    // return the result
    return { category, message: 'Category updated successfully', success: true }
}

const deleteCategory: Action = async ( { request, locals } ) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()
    const cId = form.get('categoryId')
    if(!cId || cId == 'undefined') fail(401, { message: 'Category does not provided', data: { cId }, success: false }) 

    if(!await CategoryFunction.deleteCategory(String(cId))) fail(401, { message: 'Failed to delete Category', data: { cId }, success: false })
    return { message: 'Category deleted successfully', success: true }
}

export const actions: Actions = { addCategory, deleteCategory, editCategory }
