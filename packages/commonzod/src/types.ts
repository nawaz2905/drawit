import { z } from 'zod'


export const SignupZodSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6).max(12),
    name: z.string().min(3).max(20),
    photo: z.string().optional()
});
export const SigninZodSchema = z.object({
    username: z.string().email(),
    password: z.string().min(6).max(12)
});

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(10)
})