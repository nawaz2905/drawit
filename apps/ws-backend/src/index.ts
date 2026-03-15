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

                let startX = message.startX;
                let startY = message.startY;
                let endX = message.endX;
                let endY = message.endY;

                if (message.type === "pencil" || message.type === "eraser") {
                    if (message.BufferStroke && message.BufferStroke.length > 0) {
                        startX = message.BufferStroke[0][0];
                        startY = message.BufferStroke[0][1];
                        endX = message.BufferStroke[message.BufferStroke.length - 1][0];
                        endY = message.BufferStroke[message.BufferStroke.length - 1][1];
                    }
                } else if (message.type === "rect" || message.type === "diamond") {
                    startX = message.x;
                    startY = message.y;
                    endX = message.x + message.width;
                    endY = message.y + message.height;
                } else if (message.type === "circle") {
                    startX = message.centerX - message.radius;
                    startY = message.centerY - message.radius;
                    endX = message.centerX + message.radius;
                    endY = message.centerY + message.radius;
                } else if (message.type === "text") {
                    startX = message.x;
                    startY = message.y - message.fontSize;
                    endX = message.x + (message.text.length * (message.fontSize * 0.6));
                    endY = message.y;
                }

                const serializedMessage = JSON.stringify(message);

                // Broadcast immediately to reduce latency for other users
                const broadcastPayload = JSON.stringify({
                    type: "chat",
                    message: serializedMessage,
                    roomId,
                });

                users.forEach((user) => {
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(broadcastPayload);
                    }
                });

                // Save to database in the background
                prisma.chat.create({
                    data: {
                        roomId: roomId,
                        type: message.type,
                        startX: startX !== undefined && startX !== null ? Math.floor(startX) : null,
                        startY: startY !== undefined && startY !== null ? Math.floor(startY) : null,
                        endX: endX !== undefined && endX !== null ? Math.floor(endX) : null,
                        endY: endY !== undefined && endY !== null ? Math.floor(endY) : null,
                        message: serializedMessage,
                        userId: userId
                    },
                }).catch(err => {
                    console.error("Background DB write failed:", err);
                });

            } catch (e) {
                console.log("error in sending to users or something, error is " + e);
            }
        }

        if (parsedData.type === "delete") {
            const roomId = parsedData.roomId;
            const id = parsedData.id;
            users.forEach((user) => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "delete",
                        id,
                        roomId
                    }));
                }
            });
        }

        if (parsedData.type === "delete_by_props") {
            const roomId = parsedData.roomId;
            const shape = parsedData.shape;
            users.forEach((user) => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "delete_by_props",
                        shape,
                        roomId
                    }));
                }
            });
        }
    });

});