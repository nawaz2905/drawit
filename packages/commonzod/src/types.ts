import {z} from 'zod'


export const SignupZodSchema = z.object({
    username: z.string().email(),
    password:z.string().min(6).max(12)
});
export const SigninZodSchema = z.object({
    username:z.string().email(),
    password:z.string().min(6).max(12)
});

export const CreateRoomShcema = z.object({
    name:z.string().min(3).max(15)
})