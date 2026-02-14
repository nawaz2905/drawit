# DrawIt

DrawIt is a real-time collaborative drawing application inspired by Excalidraw. It allows multiple users to draw, sketch, and brainstorm together on a shared canvas with instant synchronization using WebSockets.

## 🚀 Features

- **Real-time Collaboration**: Multiple users can draw on the same canvas simultaneously.
- **Persistent Rooms**: Draw in private rooms with unique slugs.
- **Rich Drawing Tools**: Pencil, rectangles, and more (extensible).
- **Infinite Canvas**: Plenty of space for your ideas.
- **Secure Authentication**: User signup and signin with JWT.

## 🛠 Tech Stack

- **Monorepo**: managed by [Turborepo](https://turbo.build/repo)
- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **WebSocket Backend**: [ws](https://github.com/websockets/ws)
- **HTTP Backend**: [Express](https://expressjs.com/), [Zod](https://zod.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## 📂 Project Structure

```text
drawit/
├── apps/
│   ├── web/             # Next.js frontend
│   ├── http-backend/    # REST API (Auth, Room management)
│   └── ws-backend/      # WebSocket server (Real-time drawing)
├── packages/
│   ├── db/              # Prisma client and schema
│   ├── commonzod/       # Shared Zod validation schemas
│   ├── backend-common/  # Shared backend configuration/constants
│   └── ui/              # Shared UI components
└── ...
```

## 🚥 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm
- PostgreSQL instance

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd drawit
   ```

2. Install dependencies:
   ```sh
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in `packages/db` and `apps/http-backend`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/drawit"
   JWT_SECRET="your-secret-key"
   ```

4. Run migrations:
   ```sh
   cd packages/db
   pnpm dlx prisma migrate dev
   ```

### Running the Project

From the root directory, run:

```sh
pnpm dev
```

This will start:
- Frontend: `http://localhost:3000`
- HTTP Backend: `http://localhost:3001`
- WebSocket Server: `ws://localhost:8080`

## 📚 Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Database Schema](DATABASE_SCHEMA.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT
