# 🔦 Beacon

**Fulfillment automation for e-commerce merchants.**

Beacon syncs tracking numbers from dropshippers, 3PLs, and POD platforms directly to Shopify and Amazon. Simple. Fast. Reliable.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

### Quick Start

1. **Clone and install**

```bash
git clone https://github.com/yourusername/beacon.git
cd beacon
pnpm install
```

2. **Start Docker services**

```bash
docker-compose up -d
```

3. **Set up environment variables**

```bash
# Backend
cp apps/api/.env.example apps/api/.env

# Frontend
cp apps/web/.env.example apps/web/.env
```

4. **Run database migrations**

```bash
cd apps/api
pnpm db:push
```

5. **Start development servers**

```bash
pnpm dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Database Studio: `pnpm -F @beacon/api db:studio`

## 🛠 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **ShadCN UI** - Component library
- **Zustand** - State management
- **Socket.io** - Real-time updates

### Backend
- **Node.js 20** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Redis** - Job queue & cache
- **Bull** - Job processor

### DevOps
- **Turborepo** - Monorepo management
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting

## 📁 Project Structure

```
beacon/
├── apps/
│   ├── api/              # Express backend
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── jobs/
│   │   │   └── integrations/
│   │   ├── prisma/
│   │   └── package.json
│   └── web/              # React frontend
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── hooks/
│       │   ├── store/
│       │   └── services/
│       └── package.json
├── packages/
│   └── shared/           # Shared types & utilities
├── .github/
│   └── workflows/        # CI/CD pipelines
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

## 💻 Development

### Commands

```bash
# Start development servers
pnpm dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Run linting
pnpm lint

# Type check
pnpm type-check
```

### Database

```bash
# Create migration
pnpm -F @beacon/api db:migrate

# Push schema changes
pnpm -F @beacon/api db:push

# Open database studio
pnpm -F @beacon/api db:studio

# Seed database (coming soon)
pnpm -F @beacon/api db:seed
```

### API Documentation

- Health check: `GET /health`
- Auth endpoints: `POST /api/auth/register`, `POST /api/auth/login`, etc.

See `apps/api/src/routes/` for complete routes.

## 🚢 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Deploy

```bash
VITE_API_URL=https://api.beacon.so
```

### Backend (Railway)

1. Create Railway project
2. Connect GitHub repo
3. Set environment variables
4. Railway auto-deploys on push

```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
STRIPE_SECRET_KEY=...
# ... see apps/api/.env.example
```

## 📝 License

MIT

## 🤝 Contributing

Coming soon.

## 📧 Contact

Questions? Reach out to hello@beacon.so

---

**Built with ❤️ for e-commerce merchants**
