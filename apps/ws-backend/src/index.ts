import { WebSocketServer, WebSocket } from 'ws';
import { JWT_PASSCODE } from "@repo/backend-common/config";
import jwt from 'jsonwebtoken'
import { prisma } from '@repo/db/client'

import http from "http";


const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end("WebSocket server running");
});

const wss = new WebSocketServer({ server });

server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`WebSocket running on ${PORT}`);
});

interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string
}
const users: User[] = [];

function checkUser(token: string): string | null {
    if (!token) {
        console.log("No token provided");
        return null;
    }
    try {
        const decoded = jwt.verify(token, JWT_PASSCODE);
        if (typeof decoded == "string") {
            return null;
        }
        if (!decoded || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    } catch (e) {
        console.log("jwt verification failed:", e);
        return null;
    }
}

wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if (userId == null) {
        ws.close();
        return null;
    }
    users.push({
        userId,
        rooms: [],
        ws
    });

    ws.on('message', async function message(data) {
        let parsedData;
        if (typeof data !== "string") {
            parsedData = JSON.parse(data.toString());
        } else {
            parsedData = JSON.parse(data); //{type: "join-room", roomId:1}
        }
        if (parsedData.type === "join_room") {
            const user = users.find(x => x.ws === ws);
            user?.rooms.push(parsedData.roomId);
        }
        if (parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }
            user.rooms = user?.rooms.filter(x => x !== parsedData.room);
        }
        console.log("message received")
        console.log(parsedData);

        if (parsedData.type === "chat") {
            try {
                const roomId = parsedData.roomId;
                const messageString = parsedData.message;
                const message = typeof messageString === "string" ? JSON.parse(messageString) : messageString;

                if (message.type === "pencil") {
                    if (!message.BufferStroke || message.BufferStroke.length === 0) {
                        console.error("Invalid pencil message: BufferStroke is empty/missing");
                        return;
                    }
                    message.endX = message.BufferStroke[message.BufferStroke.length - 1][0];
                    message.endY = message.BufferStroke[message.BufferStroke.length - 1][1];
                }

                const serializedMessage = JSON.stringify(message);

                if (message.type === "pencil") {
                    await prisma.chat.create({
                        data: {
                            roomId: roomId,
                            type: message.type,
                            startX: message.startX,
                            startY: message.startY,
                            endX: message.endX,
                            endY: message.endY,
                            message: serializedMessage,
                            userId: userId
                        },
                    });
                } else {
                    await prisma.chat.create({
                        data: {
                            roomId: roomId,
                            message: serializedMessage,
                            userId: userId,
                        },
                    });
                }

                users.forEach((user) => {
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(
                            JSON.stringify({
                                type: "chat",
                                message: serializedMessage,
                                roomId,
                            })
                        )
                    }
                })

            } catch (e) {
                console.log("error in sending to users or something, error is " + e);
            }
        }
    });

});