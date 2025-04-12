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

blogRouter.get('/summarize/:id', async (c) => {
	try {
	  const id = c.req.param("id");
	  const OPENAI_API_KEY = c.env.OPENAI_API_KEY;
  
	  const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	  }).$extends(withAccelerate());
  
	  const post = await prisma.post.findUnique({
		where: { id },
		select: {
		  content: true,
		  summary: true
		}
	  });
  
	  if (!post) {
		return c.json({ message: "Post not found" }, 404);
	  }
  
	  if (post.summary) {
		console.log("Returning saved summary");
		return c.json({ summary: post.summary });
	  }
  
	  const content = post.content;
  
	  const response = await axios.post(
		"https://api.openai.com/v1/chat/completions",
		{
		  model: 'gpt-3.5-turbo',
		  messages: [
			{
			  role: 'system',
			  content: 'Summarize the given blog post in around 100 words. End with a conclusive sentence.'
			},
			{
			  role: 'user',
			  content
			}
		  ],
		  max_tokens: 150, // Approx. 100 words
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
		where: { id },
		data: { summary }
	  });
  
	  console.log("Saved generated summary");
	  return c.json({ summary });
	} catch (error) {
	  console.error(error);
	  return c.json({ error: 'Internal server error' }, 500);
	}
  });
  

blogRouter.get("/tts/:id", async (c) => {
	try {
	  const id = c.req.param("id");
	  const OPENAI_API_KEY = c.env.OPENAI_API_KEY;
  
	  const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	  }).$extends(withAccelerate());
  
	  const post = await prisma.post.findUnique({
		where: { id },
		select: { content: true },
	  });
  
	  if (!post || !post.content) {
		return c.json({ message: "Post not found or empty" }, 404);
	  }
  
	  const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
		method: "POST",
		headers: {
		  Authorization: `Bearer ${OPENAI_API_KEY}`,
		  "Content-Type": "application/json",
		},
		body: JSON.stringify({
		  model: "tts-1", // or "tts-1-hd" if you want higher quality
		  voice: "nova", // other options: alloy, echo, fable, onyx, shimmer
		  input: post.content,
		  response_format: "mp3",
		}),
	  });
  
	  if (!ttsResponse.ok) {
		console.error("OpenAI TTS Error:", await ttsResponse.text());
		return c.json({ message: "TTS generation failed" }, 500);
	  }
  
	  const audioBuffer = await ttsResponse.arrayBuffer();
  
	  return new Response(audioBuffer, {
		headers: {
		  "Content-Type": "audio/mpeg",
		  "Content-Disposition": `inline; filename="${id}.mp3"`,
		  "Accept-Ranges": "bytes",
		},
	  });
  
	} catch (e) {
	  console.error("TTS Error:", e);
	  return c.json({ message: "Internal Server Error" }, 500);
	}
  });  

  blogRouter.get("/by-title/:title", async (c) => {
    try {
        const title = c.req.param("title");  // Get the title from the URL parameter
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        // Query the posts based on the title
        const posts = await prisma.post.findMany({
            where: {
                title: {
                    contains: title,  // Match posts with titles that contain the search term
                    mode: "insensitive",  // Case-insensitive search
                },
            },
            select: {
                id: true,
                title: true,
                summary: true,
                publishedDate: true,
                published: true,
            },
            orderBy: {
                publishedDate: "desc",  // Order the results by published date in descending order
            },
        });

        console.log("Searching posts with title:", title);

        if (posts.length === 0) {
            return c.json({ message: "No posts found with the given title" }, 404);
        }

        return c.json({ posts });
    } catch (error) {
        console.error("Search error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});