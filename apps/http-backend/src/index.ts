import "dotenv/config";
console.log("DB URL =>", process.env.DATABASE_URL);
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

app.post("/api/v1/signup", async (req, res) => {
    try {
        const parsedData = SignupZodSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: "Invalid input format"
            });
        }
        const { username, password, name } = parsedData.data;
        const existingUser = await prisma.user.findFirst({
            where: {
                email: username
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
                email: username,
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

app.post("/api/v1/signin", async (req, res) => {
    try {
        const parsedData = SigninZodSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: "Invalid input format",
                errors: parsedData.error.issues
            });
        }

        const { username, password } = parsedData.data;

        const user = await prisma.user.findFirst({
            where: {
                email: username
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

app.post("/api/v1/room",middleware, async (req, res) => {
    
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

app.get("/api/v1/chats/:roomId", async (req, res)=>{
    try{
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const message = await prisma.chat.findMany({
            where:{
                roomId: roomId
            },
            orderBy:{
                id:"desc"
            },
            take: 1000
        });
        res.json({
            message
        })

    }catch(e){
        console.log(e);
        res.json({
            messages: []
        })
    }
})

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});