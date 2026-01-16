import { type NextFunction, type Request, type Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import {JWT_PASSCODE} from "@repo/backend-common/config"

export const userMiddleware = (req:Request, res:Response, next:NextFunction)=>{
   const header = req.headers["authorization"];

   if(!header || !header.startsWith("Bearer")){
    return res.status(401).json({
        message:"Access Denied"
    })
   }
   const token = header?.split(" ")[1];
   try{
    const decode = jwt.verify(token as string,JWT_PASSCODE)
    req.userId = (decode as JwtPayload).userId
    next();
   }catch(eror){
    console.log(error)
    return res.status(401).json({
        message:"Access denied!"
    })
   }
}