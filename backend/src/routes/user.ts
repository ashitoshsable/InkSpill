import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from 'hono/jwt';

export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string
        JWT_secret:string
    }
}>();

//signup route - application
userRouter.post('/signup', async (c) => {
    const DBUrl = c.env.DATABASE_URL;
  
    const prisma = new PrismaClient({
      datasourceUrl: DBUrl,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
  
    try{
      //Creating a user in DB
      const user = await prisma.user.create({
        data:{
          email: body.email,
          name: body.name,
          password: body.password
        }
      })
      //Creating a signed token
      const jwt = await sign({id:user.id},c.env.JWT_secret);
      return c.json({
        message:"Signed up!",
        token:jwt
      })
    }catch(e){
      c.status(403);
      return c.json({
        error:"error in creating a user!"
      })
    }
  });
  
  //signin route - application
userRouter.post('/signin', async (c) => {
    const DBUrl = c.env.DATABASE_URL;
  
    const prisma = new PrismaClient({
      datasourceUrl: DBUrl,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
  
    try{
      const existingUser = await prisma.user.findUnique({
        where:{
          email:body.email,
          password:body.password
        }
      });
    
      if(!existingUser){
        c.status(401);
        return c.json({
          error:"User not found!"
        });
      }
    
      const jwt = await sign({id:existingUser.id},c.env.JWT_secret);
    
      return c.json({
        message:"Sign in successful!",
        token:jwt
      });
    }catch(e){
      c.status(411);
      return c.json({
        message:"Error while signing in!"
      });
    }
  });