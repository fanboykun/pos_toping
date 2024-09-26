import { findIsRequestFromAdmin } from '$lib/server/auth';
import * as UserFunction from '$lib/server/user';
import * as UserValidation from '$lib/validation/userModelValidation';
import type { Prisma } from '@prisma/client';
import { fail, redirect, type Action, type Actions } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import type { finalValidationResult } from 'ts-input-validator';

export const load = async ( { locals } ) => {
    if ( !locals.session || locals.user === null  ) {
        return redirect(302, '/login');
    }
    if(!locals.user.isAdmin) return redirect(302, '/dashboard')

    const users = UserFunction.getAllUser()
    return { users }
}

const addUser: Action = async ( { request, locals } ) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()
    const data: Prisma.UserCreateInput = {
        name: String(form.get('name')),
        email: String(form.get('email')),
        password: String(form.get('password')),
    }

    // begin the validation
    const [ failed, result ]: finalValidationResult = UserValidation.validateAddNewUser(data)

    // throw if failed
    if(failed) {
        return fail(401, { message: 'Form is invalid', result, data: { ...data }, success: false })
    }

    const existingUser = await UserFunction.findUserByEmail(data.email as unknown as string)
    if(existingUser) return fail(400, { message: 'User with this email already exists', data: { ...data }, success: false })

    // hash password
    const hashed_password = await new Argon2id().hash(data.password as unknown as string)
    data.password = hashed_password

    // insert data to the db
    const user = await UserFunction.addNewUser(data)

    // if the topping creation was not success
    if(!user) return fail(400, { message: 'Failed to create user', data: { ...data }, success: false })

    // return the result
    return { user, message: 'user created successfully', success: true }

}

const editUser: Action = async ( { request, locals } ) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()
    const data = {
        id: String(form.get('id') ?? ''),
        name: String(form.get('name')),
        email: String(form.get('email')),
    }

    // begin the validation
    const [ failed, result ]: finalValidationResult = UserValidation.validateUpdateUser(data)

    // throw if failed
    if(failed) {
        return fail(401, { message: 'Form is invalid', result, data: { ...data }, success: false })
    }

    // check for the user existance from the given id
    const currentUser = await UserFunction.findUserById(data.id as unknown as string)
    if(!currentUser) return fail(400, { message: 'User Does Not Found!', data: { ...data }, success: false })

    // check if the new email is the same as someone's email
    const existingUser = await UserFunction.findUserByEmail(data.email as unknown as string, false, currentUser.email)
    if(existingUser) return fail(400, { message: 'User with this email already exists', data: { ...data }, success: false })

    // insert data to the db
    const user = await UserFunction.updateUser(data)

    // if the topping creation was not success
    if(!user) return fail(400, { message: 'Failed to update user', data: { ...data }, success: false })

    // return the result
    return { user, message: 'user updated successfully', success: true }
    
}

const deleteUser: Action = async ( { request, locals } ) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()
    const uId = form.get('userId')
    if(!uId || uId == 'undefined') fail(401, { message: 'User does not provided', data: { uId }, success: false }) 

    // check for the user existance from the given id
    const currentUser = await UserFunction.findUserById(uId as unknown as string)
    if(!currentUser) return fail(400, { message: 'User Does Not Found!', success: false })

    // cannot delete current loggedin user
    if(currentUser.id === locals.user?.id) return fail(400, { message: 'Cannot delete current loggedin user!', success: false })

    if(!await UserFunction.deleteUser(String(uId))) fail(401, { message: 'Failed to delete User', data: { uId }, success: false })
    return { message: 'User deleted successfully', success: true }
}

const changeUserPassword: Action = async ( { request, locals } ) => {
    if(!findIsRequestFromAdmin(locals)) return fail(302, { message: 'User is unauthorized', success: false })

    const form = await request.formData()
    const data = {
        id: String(form.get('id') ?? ''),
        password: String(form.get('password')),
    }

    // begin the validation
    const [ failed, result ]: finalValidationResult = UserValidation.validateUpdateUserPassword(data)

    // throw if failed
    if(failed) {
        return fail(401, { message: 'Form is invalid', result, data: { ...data }, success: false })
    }

    // check for the user existance from the given id
    const currentUser = await UserFunction.findUserById(data.id as unknown as string)
    if(!currentUser) return fail(400, { message: 'User Does Not Found!', data: { ...data }, success: false })

    // hash password
    const hashed_password = await new Argon2id().hash(data.password as unknown as string)
    data.password = hashed_password

    // insert data to the db
    const user = await UserFunction.updateUserPassword(data)

    // if the topping creation was not success
    if(!user) return fail(400, { message: 'Failed to update user password', data: { ...data }, success: false })

    // return the result
    return { user, message: 'user password updated successfully', success: true }

}

export const actions: Actions = { addUser, editUser, deleteUser, changeUserPassword  }