import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';

//Type handling in Hono
export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string
        JWT_secret: string
    }
    Variables:{
        userId: number
    }
}>();


//MiddleWare
blogRouter.use("/*",async (c,next)=>{
    const header = c.req.header("authorization") || "";
    try{
        const user = await verify(header,c.env.JWT_secret);
        if(user){
            c.set("userId",Number(user.id));
            await next();
        }else{
            c.status(401);
            return c.json({
                message:"You are not logged in!"
            });
        }
    }catch(e){
        c.status(403);
        return c.json({
            message:"Unauthorized"
        })
    }
    
  });


//Posting a blog
blogRouter.post('/', async (c) => {
    const userId = c.get("userId");
    const DBUrl = c.env.DATABASE_URL;
  
    const prisma = new PrismaClient({
      datasourceUrl: DBUrl,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();

    try{
        const post = await prisma.post.create({
            data:{
                title:body.title,
                content:body.content,
                authorid: userId
            }
        })

        c.status(200);
        return c.json({
            message:"The post is posted successfully!",
            id:post.id
        })
    }catch(e){
        c.status(403);
        return c.json({
            message:"The post wasn't posted!"
        })
    }    
});
  
//Updating a blog
blogRouter.put('/', async (c) => {
    const DBUrl = c.env.DATABASE_URL;
  
    const prisma = new PrismaClient({
      datasourceUrl: DBUrl,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();

    try{
        await prisma.post.update({
            where:{
                id:body.id
            },
            data:{
                title:body.title,
                content:body.content
            }
        })

        c.status(200);
        return c.json({
            message:"The post is updated successfully!"
        })
    }catch(e){
        c.status(403);
        return c.json({
            message:"The post wasn't updated!"
        })
    }
});

blogRouter.get('/bulk', async (c) => {
    const DBUrl = c.env.DATABASE_URL;
  
    const prisma = new PrismaClient({
      datasourceUrl: DBUrl,
    }).$extends(withAccelerate());

    try{
        //nextup in pagination
        const blogs = await prisma.post.findMany({
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });
        
        c.status(200);
        return c.json({
            blogs
        })
    }catch(e){
        c.status(403);
        return c.json({
            message:"Error in fetching blogs!"
        })
    }
});
  
blogRouter.get('/:id', async (c) => {
    const DBUrl = c.env.DATABASE_URL;
  
    const prisma = new PrismaClient({
      datasourceUrl: DBUrl,
    }).$extends(withAccelerate());
  
    const id = await c.req.param("id");

    try{
        const blog = await prisma.post.findFirst({
            where:{
                id:Number(id)
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });
        
        c.status(200);
        return c.json({
            blog
        })
    }catch(e){
        c.status(403);
        return c.json({
            message:"Error in fetching blogs!"
        })
    }
});