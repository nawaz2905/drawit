import jwt from 'jsonwebtoken'
import { JWT_PASSCODE } from '@repo/backend-common/config';
import {SignupZodSchema, SigninZodSchema} from '@repo/commonzod/types'


import express from 'express';
const app = express();

app.post("/api/v1/signup", async (req, res) => {
   
    try {
        const parsedData = SignupZodSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(409).json({
                meassgae: "incorrect format"
            })
        }

        const { username, password } = parsedData.data
        const existinUser = await UserModel.findone({ username });
        if (existinUser) {
            return res.status(409).json({
                message: "email are used"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.create({
            username,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Now you are successfully signed up!"
        })
    } catch (e) {
        console.error("signup error");
        return res.status(500).json({
            message: "Server Error"
        });

    }

});

app.post("/api/v1/signin",async (req, res) => {

    
    try {
        const parsedData = SigninZodSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: "Invalid format"
            });
        }
        const { username, password } = parsedData.data;
        const existinUser = await UserModel.findone({ username: username });
        if (!existinUser) {
            return res.status(403).json({
                message: "incorrect Credentials!"
            });
        }
        const passwordMatch = await bcrypt.compare(password, existinUser.password);
        if(passwordMatch){
            const token = jwt.sign({
                userId:existinUser._id
            },JWT_PASSCODE)
            return res.status(200).json({
                message:"UserModel signed on successfully",
                token:token
            });

        }else {
            return res.status(403).json({
                message:"Incorrect Credentials"
            });
        }
        
    }catch(e){
        res.status(500).json({
            message:"Internal server error"
        });
    }

    
});

app.post("/api/v1/room",async(req, res)=>{
    
} )


app.listen(3001);