import "dotenv/config";
// console.log("DB URL =>", process.env.DATABASE_URL);
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { JWT_PASSCODE } from '@repo/backend-common/config';
import { SignupZodSchema, SigninZodSchema, CreateRoomSchema } from '@repo/commonzod/types';
import { prisma } from '@repo/db/client';
import express from 'express';
import { middleware } from "./middleware";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors())

app.post("/signup", async (req, res) => {
    try {
        const parsedData = SignupZodSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: "Invalid input format"
            });
        }
        const { email, password, name } = parsedData.data;
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                name: name
            }
        });
        
        return res.status(201).json({
            userId: user.id,
            message: "signed up successfully!"
        });

    } catch (e) {
        console.error("Signup Error:", e);
        return res.status(500).json({
            message: "Server Error"
        });
    }
});

app.post("/signin", async (req, res) => {
    try {
        const parsedData = SigninZodSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: "Invalid input format",
                errors: parsedData.error.issues
            });
        }

        const { email, password } = parsedData.data;

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(403).json({
                message: "Incorrect credentials!"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = jwt.sign({
                userId: user.id
            }, JWT_PASSCODE);

            return res.status(200).json({
                message: "Signed in successfully",
                token: token
            });
        } else {
            return res.status(403).json({
                message: "Incorrect credentials!"
            });
        }

    } catch (e) {
        console.error("Signin error:", e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

app.post("/room",middleware, async (req, res) => {
    
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        res.json({
            message:"Incorrect inputs"
        })
        return;
    }
    
    const userId = (req as any).userId;
    try{
        const room = await prisma.room.create({
            data:{
                slug:parsedData.data.name,
                adminId: userId
            }
        });
        res.json({
            roomId: room.id
        });

    }catch(e){
        res.status(501).json({
            message:"Not implemented yet"
        });
    }
});

app.get("/roomchats/:roomId", async (req, res)=>{
    try{
        const roomId = Number(req.params.roomId);
        const room = await prisma.room.findFirst({
            where:{
                id: roomId,
            }
        });
        res.json({
            slug: room?.slug,
        })

    }catch(e){
        res.json({
            messages: "Issue in fetching",
        })
    }
});

app.get("/chats/:slug", async (req, res) =>{
    const slug = req.params.slug;
    const room = await prisma.room.findFirst({
        where:{
            slug: slug
        },
        include:{
            chats: true,
        }
    });
    const roomArray = room?.chats ?? [];

    const messages = [];
    for(const chat of roomArray){
        try{
            if(typeof chat.message === "string"){
            } else{
                //@ts-ignore
                messages.push(...chat.message);
            }
        } catch (e){
            res.json({
                message:"some issue"
            });
        }
    }
    res.json({
        messages,
    });
});

app.post("/savemessage", (req,res)=>{
    const chat = req.body.chat;
    const slug = req.body.slug;

    const room = prisma.room.findFirst({
        where:{
            slug: slug,
        },
    });
})
//@ts-ignore
app.post("/deletechat/:slug", async (req, res)=>{
    try{
        const slug = req.params.slug;
        const type = req.body.type;
        const startX = req.body.startX;
        const startY = req.body.startY;
        const endX = req.body.endX;
        const endY = req.body.endY;

        const roomResponse = await prisma.room.findFirst({
            where:{
                slug:slug
            }
        });
        const roomId = roomResponse?.id;

        if (!roomId){
            return res.status(400).json({
                message: "Room not found"
            });
        }
        const shape = await prisma.chat.findFirst({
            where:{
                roomId: roomId,
                type: type,
                startX: startX,
                startY: startY,
                endX:endX,
                endY:endY
            }
        });
        if(!shape){
            return res.status(404).json({
                message:"Shape not Found"
            });
        }
        const response = await prisma.chat.delete({
            where:{
                roomId: roomId,
                id:shape.id
            }
        });
        if(response){
            res.json({
                "message" :"Deletion successfull"
            });
        } else {
            res.json({
                "message" : "Deletion unsuccessfull"
            })
        }
                    
    } catch (e){
        res.status(500).json({
            message: "Error deleting shape",
            error: e
        })
    }

})

app.post("/deleteshape/:roomId", async(req, res)=>{
    try{
        const roomId = Number(req.params.roomId);
        const {type, startX, startY, endY, endX } = req.body;

        const room = await prisma.room.findFirst({
            where:{
                id: roomId
            }
        });
        if(!room){
            return res.status(404).json({
                message:"Room not Found!"
            });
        }
        const chat = await prisma.chat.findFirst({
            where:{
                roomId: roomId,
                type: type,
                startX:startX,
                startY:startY,
                endX:endX,
                endY:endY
            }
        });
        if(!chat){
            return res.status(404).json({
                message:"Shape not Found"
            });
        }
        await prisma.chat.delete({
            where:{
                id:chat.id
            }
        });
        res.json({
            message:"Deletion Successfull"
        });

    } catch(e){
        res.status(500).json({
            message:"Deletion unsuccessfull",
            error: e
        });
    }
});

app.get("/room/slug/:slug", async(req, res)=>{
    const slug = req.params.slug;
    try{
        const room = await prisma.room.findFirst({
            where:{
                slug: slug
            },
        });
        if(!room){
            return res.status(404).json({
                error:"Room not Found"
            });
        }
        res.json({
            id:room?.id,
        });
    }catch(e){
        res.status(500).json({
            error:"database error"
        });
    }

})

app.get("/room/id/:roomId", async(req, res)=>{
    const roomId = Number(req.params.roomId);
    const room = await prisma.room.findFirst({
        where:{
            id: roomId
        }
    });
    const slug = room?.slug;
    res.json({
        slug: slug
    })
});


app.post("/createroom/:slug", async(req, res)=>{
    const slug = req.params.slug;
    try{
        const room = await prisma.room.create({
            data:{
                adminId: req.body.adminId,
                slug: slug,
            },
        });
        res.json({
            roomId: room.id,
        })
    }catch(e){
        res.json({
            error: e as Error,
            //@ts-ignore
            message:`Issue in creating:${e.message}`,
        })
    }
})


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});