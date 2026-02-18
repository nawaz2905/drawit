"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomSchema = exports.SigninZodSchema = exports.SignupZodSchema = void 0;
const zod_1 = require("zod");
exports.SignupZodSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(20),
    name: zod_1.z.string().min(3).max(20),
    photo: zod_1.z.string().optional()
});
exports.SigninZodSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(20)
});
exports.CreateRoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(10)
});
