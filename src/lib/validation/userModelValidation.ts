import type { Prisma } from "@prisma/client";
import { Validator, type validateType } from "ts-input-validator";

type UserWithId = Required<Pick<Prisma.UserCreateInput, 'id'>> & Omit<Prisma.UserCreateInput, 'id'>
type UserWithIdWithoutPassword = Omit<UserWithId, 'password'>

export const validateAddNewUser = ( data: Prisma.UserCreateInput, customValidationRules?: validateType ) => {
    const toValidate: validateType[] = [
        { 
            data: data.name, key: 'name', rules: 'required|string', message: {
                required: 'mohon input nama user',
                string: 'nama user harus berisi huruf'
            } 
        },
        { 
            data: data.email, key: 'email', rules: 'required|string|email', message: {
                required: 'mohon input email',
                string: 'email harus berisi huruf',
                email: 'email tidak valid'
            } 
        },
        { 
            data: data.password, key: 'password', rules: 'required|string', message: {
                required: 'mohon input password',
                string: 'password harus berisi huruf'
            } 
        }
    ]

    if(customValidationRules) {
        toValidate.push(customValidationRules)
    }

    // begin the validation
    return Validator.validate(toValidate)
}

export const validateUpdateUser = (data: UserWithIdWithoutPassword) => {
    const updateValidationRules: validateType = {
        data: data.id,
        key: 'id',
        rules: ['required', 'string'],
        message: {
            required: 'mohon beri user yang valid',
            string: 'user tidak valid'
        }
    } 

    const toValidate: validateType[] = [
        { 
            data: data.name, key: 'name', rules: 'required|string', message: {
                required: 'mohon input nama user',
                string: 'nama user harus berisi huruf'
            } 
        },
        { 
            data: data.email, key: 'email', rules: 'required|string|email', message: {
                required: 'mohon input email',
                string: 'email harus berisi huruf',
                email: 'email tidak valid'
            } 
        },
    ]

    toValidate.push(updateValidationRules)
    return Validator.validate(toValidate)
}

export const validateUpdateUserPassword = (data: { id: string, password: string }) => {
    const toValidate: validateType[] = [
        {
            data: data.id,
            key: 'id',
            rules: ['required', 'string'],
            message: {
                required: 'mohon beri user yang valid',
                string: 'user tidak valid'
            }
        },
        { 
            data: data.password, 
            key: 'password', 
            rules: 'required|string', 
            message: {
                required: 'mohon input password',
                string: 'password harus berisi huruf'
            } 
        }
    ]

    return Validator.validate(toValidate)
}
