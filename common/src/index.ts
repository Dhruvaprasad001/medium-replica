import { z } from 'zod'

export const signupzod = z.object({
    email : z.string().email(),
    password : z.string().min(5),
    name :z.string()
})

export type SignupInput = z.infer<typeof signupzod>


export const signinzod = z.object({
    email : z.string().email(),
    password : z.string().min(5)
})

export type SigninInput = z.infer<typeof signinzod>

export const createBlogPost = z.object({
    title : z.string() ,
    content : z.string() 
})

export type CreateBlogpost = z.infer<typeof createBlogPost>

export const updateBlogPost = z.object({
    title : z.string() ,
    content : z.string() ,
    id : z.string().uuid()
})

export type UpdateBlogpost = z.infer<typeof updateBlogPost>