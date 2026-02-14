# API Documentation

This document specifies the communication protocols for DrawIt.

## 🌐 HTTP Backend

**Base URL**: `http://localhost:3001`

### Authentication

#### POST `/api/v1/signup`
Creates a new user account.
- **Request Body**:
  ```json
  {
    "username": "user@example.com",
    "password": "strong-password",
    "name": "User Name"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "userId": "uuid-string",
    "message": "signed up successfully!"
  }
  ```

#### POST `/api/v1/signin`
Authenticates a user and returns a session token.
- **Request Body**:
  ```json
  {
    "username": "user@example.com",
    "password": "strong-password"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "token": "jwt-token-string",
    "message": "Signed in successfully"
  }
  ```

### Rooms & Chats

#### POST `/api/v1/room` (Authenticated)
Creates a new drawing room.
- **Header**: `Authorization: <token>`
- **Request Body**:
  ```json
  { "name": "room-slug-name" }
  ```
- **Response**:
  ```json
  { "roomId": 1 }
  ```

#### GET `/api/v1/chats/:roomId`
Fetches drawing history for a specific room.
- **Response**:
  ```json
  {
    "message": [
      {
        "id": 1,
        "roomId": 1,
        "message": "{\"type\":\"rect\",\"x\":100,\"y\":100,\"width\":50,\"height\":50}",
        "userId": "uuid",
        "type": "rect",
        "startX": 100,
        "endX": 150,
        "startY": 100,
        "endY": 150
      }
    ]
  }
  ```

---

## 🔌 WebSocket Backend

**URL**: `ws://localhost:8080?token=<jwt-token>`

### Connection
All WebSocket connections require a `token` query parameter for authentication.

### Client Messages (Sending)

#### Join Room
Informs the server that the user wants to join a specific room.
```json
{
  "type": "join_room",
  "roomId": 1
}
```

#### Leave Room
```json
{
  "type": "leave_room",
  "roomId": 1
}
```

#### Drawing (Chat)
Sends drawing data to be broadcasted and persisted.
```json
{
  "type": "chat",
  "roomId": 1,
  "message": "{\"type\":\"pencil\",\"BufferStroke\":[[0,0], [10,10]], \"startX\":0, \"startY\":0}"
}
```

### Server Messages (Receiving)

#### Broadcasted Drawing
Received when another user in the same room draws something.
```json
{
  "type": "chat",
  "roomId": 1,
  "message": "{\"type\":\"pencil\", ...}"
}
```
