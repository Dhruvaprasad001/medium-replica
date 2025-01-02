import { Hono } from "hono";
import { Post, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { createBlogPost , updateBlogPost} from "@dhruvaprasad001/medium-common"
import axios from "axios";

export const blogRouter = new  Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string,
		OPENAI_API_KEY:string
    },
	Variables:{
		userId:string
	}
}>()

blogRouter.use('/*' , async (c , next) => {
	
	const header = c.req.header("Authorization") || ""
	try {
		const user = await verify(header , c.env.JWT_SECRET) as { id: string }

		if(user && user.id){
			c.set("userId",user.id)
			return next()
		}else{
			c.status(403)
			return c.json({
				message:"auth failed"
			})
		}
	} catch (e) {
		c.status(403)
		return c.json({
			message:"auth failed"
		})
	}
})

blogRouter.post('/', async (c) => {

    try {
        const body = await c.req.json();
        console.log("Request body:", body); // Log the incoming request body

        const { success } = createBlogPost.safeParse(body);
        if (!success) {
            c.status(411);
            return c.json({
                message: "invalid inputs, zod validation failed",
            });
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const userId = c.get("userId");
        console.log("User ID:", userId); // Log the user ID for debugging

        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId,
                publishedDate: new Date().toISOString(),
            },
        });

        console.log("Post created successfully:", post); // Log the created post
        return c.json({
            id: post.id,
        });
    } catch (e) {
        console.error("Error during post creation:", e); // Log the error details
        c.status(500);
        return c.json({
            message: "Internal Server Error",
            error: e instanceof Error ? e.message : e, // Include the error message in the response
        });
    }
});



blogRouter.put('/', async (c) => {
	const body = await c.req.json()
		const { success } = updateBlogPost.safeParse(body)
	
		if(!success){
			c.status(411)
			return c.json({
				message:"invalid inputs , zod validation failed"
			})
		}
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate())
	
	const post = await prisma.post.update({
		where:{
			id:body.id
		},
		data:{
			title : body.title ,
			content :body.content,
		}
	})
	return c.json({
		id:post.id
	})
})

blogRouter.get('/bulk', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate())

	const posts = await prisma.post.findMany({
		select: {
			content: true,
			title: true,
			id:true,
			author:{
				select:{
					name:true
				}
			}
		}
	})
	return c.json({
		posts
	})
})

blogRouter.get('/:id', async (c) => {
	const id =  c.req.param("id")
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate())
	
	try {
		const post = await prisma.post.findFirst({
			where:{
				id:id
			},
			select:{
				title:true,
				content:true,
				id:true,
				publishedDate:true,
				author:{
					select:{
						name:true
					}
				}
			}
		})
		return c.json({
			post
	})
	} catch (e) {
		console.error(e);
		c.status(411)
		c.json({
			message:'something went wrong'
		})
	}

})

blogRouter.delete("/:id" , async (c)=>{
	const id = c.req.param("id")
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate())

	try {
		const response = await prisma.post.delete({
			where:{
				id:id
			}
		})
	
		return c.json({
			message:"succesfull"
		})
	} catch (e) {
		return c.json({
			message:"error deleting it"
		})
	}
})

blogRouter.get('/summarize/:id' ,async (c)=>{

	try {
		const id = c.req.param("id")
		const OPENAI_API_KEY = c.env.OPENAI_API_KEY
		const prisma = new PrismaClient({
			datasourceUrl: c.env.DATABASE_URL,
		}).$extends(withAccelerate())

		const post = await prisma.post.findUnique({
			where:{
				id:id
			},
			select:{
				content:true
			}
		})

		if(!post){
			return c.json({ message:" post not found "} , 404)
		}

		const content = post.content

		const response = await axios.post(
			"https://api.openai.com/v1/chat/completions" ,
			{
				model: 'gpt-3.5-turbo',
				messages: [
				  { role: 'system', content: 'Summarize the given text.' },
				  { role: 'user', content },
				],
				max_tokens: 100, 
			  },
			  {
				headers: {
				  'Authorization': `Bearer ${OPENAI_API_KEY}`,
				  'Content-Type': 'application/json',
				},
			  }
			);
		
			const summary = response.data.choices[0].message.content.trim();

			await prisma.post.update({
				where:{ id:id },
				data:{ summary }
			})

			return c.json({ summary });
	} 
	catch (error) {
		console.error(error);
		return c.json({ error: 'Internal server error' }, 500);
	}
})