import { lucia } from "$lib/server/auth"
import * as UserFunction from "$lib/server/user"
import { fail, redirect, type Action, type Actions } from "@sveltejs/kit"
import { Validator, type finalValidationResult, type validateType } from "ts-input-validator"
import { Argon2id } from "oslo/password";

export const load = async ( { locals } ) => {
    if ( locals.session && locals.user !== null  ) {
        return redirect(302, '/dashboard');
    }
}

const login: Action = async ( { request, cookies } ) => {
    const form = await request.formData()
    const data = {
        email: String(form.get('email')),
        password: form.get('password')
    }

    // prepare validation rules
    const toValidate: validateType[] = [
        { data: data.email, key: 'email', rules: ['required', 'string', 'email'] },
        { data: data.password, key: 'password', rules: ['required', 'string'] }
    ]

    // begin validation
    const [failed, result]: finalValidationResult = Validator.validate(toValidate)

    // throw if failed
    if(failed) {
        return fail(401, { message: 'Form is invalid', result, data: { ...data }, success: false })
    }

    // find user from db
    const user = await UserFunction.findUserByEmail(data.email, true)
    if(!user) return fail(403, { message: 'User Not Found', result, data: { ...data }, success: false } )

    // compare password
    const validPassword = await new Argon2id().verify(user.password, data.password as unknown as string);
    if(!validPassword){
        return fail(403, { message: 'Password is invalid', result, data: { ...data }, success: false } )
    }

    // set the user session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies.set(sessionCookie.name, sessionCookie.value, {
       path: ".",
       ...sessionCookie.attributes
    });

    return redirect(302, '/dashboard')
}

export const actions: Actions = { login }