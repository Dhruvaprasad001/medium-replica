import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign , verify } from 'hono/jwt'
import { signupzod , signinzod } from "@dhruvaprasad001/medium-common"


export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    }
}>()

userRouter.post('/signup', async (c) => {
    const body = await c.req.json()
    const { success } = signupzod.safeParse(body)

    if(!success){
        c.status(411)
        return c.json({
            message:"invalid inputs , zod validation failed"
        })
    }

	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate())

	try{        
        const user = await prisma.user.create({
            data:{
                email:body.email,
                password:body.password,
                name:body.name
            }
        })

        const token = await sign({id:user.id} , c.env.JWT_SECRET)

        return c.json({
            jwt:token
        })
    }
    catch(e){
        console.log(e)
        c.status(411)
        return c.json({
            message:"Invalid"
        })
    }
})

userRouter.post('/signin' , async (c)=>{

    const body = await c.req.json()
    const { success } = signinzod.safeParse(body)

    if(!success){
        c.status(411)
        return c.json({
            message:"invalid inputs , zod validation failed"
        })
    }

	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate())

	try {
        const user = await prisma.user.findUnique({
            where:{
                email: body.email,
                password: body.password
            }
        })

        if(!user){
            c.status(409)
            return(c.json({
                message:"user not found "
            }))
        }

        const token = await sign({id:user.id} , c.env.JWT_SECRET)
        return c.json({
            jwt:token
        })
    } catch (e) {
        return c.json({
            message:"Invalid"
        })
    }
}) 

userRouter.get("/name" , async(c)=>{

    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate())

    const header = c.req.header("Authorization") || " "
    if(!header){
        c.status(403);
        return c.json({
            message: "Authorization header is missing , no token found"
        })
    }

    try {
        const payload = await verify(header , c.env.JWT_SECRET) as {id:string}

        if(!payload){
            return c.json({
                message:"Failed to verify token"
            })
        }
        
        const user = await prisma.user.findUnique({
            where:{
                id:payload.id
            },
            select:{
                name :true
            }
        })

        return c.json({ name: user?.name || "Anonymus" });

    } catch (error) {
        return c.json({
            message:"username not found"
        })
    }
})



