import { Prisma } from "@prisma/client"
import { prisma } from "$lib/server/db"

const commonUserSelect: Prisma.UserSelect = {
    email: true,
    name: true,
    id: true,
    isAdmin: true,
    createdAt: true,
    updatedAt: true
} as const

export const findUserByEmail = async ( userEmail: string, includePassword: boolean = false, emailException?: string ) => {
    try {
        type WhereQuery = {
            email: string,
            NOT?: {
                email: string
            } 
        }
        
        let whereQuery: WhereQuery = {
            email: userEmail
        }

        if(emailException) {
            whereQuery = { 
                email: userEmail,
                NOT: {
                    email: emailException
                }
            }
        }
        const user = await prisma.user.findUnique({
           where: whereQuery,
            select: {
                ...commonUserSelect,
                password: includePassword
            }
        })
        return user
    } catch(err) {
        console.log(err)
        return null
    }
}

export const findUserById = async ( userId: string, includePassword: boolean = false ) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                ...commonUserSelect,
                password: includePassword
            }
        })
        return user
    } catch(err) {
        console.log(err)
        return null
    }
}

export const getAllUser = async ( includePassword: boolean = false ) => {
    try {
        const user = await prisma.user.findMany({
            select: {
                ...commonUserSelect,
                password: includePassword
            },
        })
        return user
    } catch(err) {
        console.log(err)
        return null
    }
}

export const addNewUser = async ( data: Prisma.UserCreateInput, includePassword: boolean = false ) => {
    try {
        const user = await prisma.user.create({
            data: data,
            select: {
                ...commonUserSelect,
                password: includePassword
            }
        })
        return user
    } catch(err) {
        console.log(err)
        return null
    }
}

export const updateUser = async ( data: Omit<Prisma.UserCreateInput, 'password'>, includePassword: boolean = false ) => {
    try {
        const user = await prisma.user.update({
            data: {
                email: data.email,
                name: data.name
            },
            where: {
                id: data.id
            },
            select: {
                ...commonUserSelect,
                password: includePassword
            }
        })
        return user
    } catch(err) {
        console.log(err)
        return null
    }
}

export const updateUserPassword = async ( data: { id: string, password: string }, includePassword: boolean = false ) => {
    try {
        const user = await prisma.user.update({
            data: {
                password: data.password
            },
            where: {
                id: data.id
            },
            select: {
                ...commonUserSelect,
                password: includePassword
            }
        })
        return user
    } catch(err) {
        console.log(err)
        return null
    }
}

export const deleteUser = async ( userId: string ) => {
    try {
        await prisma.user.delete({
            where: {
                id: userId
            }
        })
        return true
    } catch(err) {
        console.log(err)
        return false
    }
}

