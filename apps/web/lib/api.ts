import "dotenv/config";
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const api = axios.create({
    baseURL : BASE_URL,
    
})