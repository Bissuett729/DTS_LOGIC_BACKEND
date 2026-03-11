<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center">🔐 USERS Backend - Authentication & Authorization System</h1>

<p align="center">
  Enterprise-grade user management system built with NestJS, GraphQL, and MongoDB
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white" alt="GraphQL" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Documentation](#-documentation)

---

## 🎯 Overview

**USERS Backend** is a comprehensive authentication and authorization system designed for enterprise applications. It provides a robust foundation for managing users, roles, permissions, business units, departments, and tool access control.

### Key Technologies

- **NestJS 10.x** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **GraphQL with Apollo** - Flexible API queries
- **MongoDB with Mongoose** - Document database
- **JWT Authentication** - Secure token-based auth
- **Docker** - Containerized deployment
- **Socket.IO** - Real-time communication

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- User authorization flags
- Password management with change enforcement
- Session management

### 👥 User Management
- Complete CRUD operations
- User profiles with supervisor hierarchy
- Active/inactive status control
- Clock-based identification
- Multi-role assignment per user

### 🏢 Organization Structure
- **Business Units** - Organizational divisions
- **Departments** - Team organization
- **Roles** - Permission groups
- **Shifts** - Work schedule management

### 🛠️ Tool Management
- Tool access control per user
- Tool templates for bulk assignment
- Tool categorization and modes
- Business unit-specific tools

### 📊 Advanced Features
- GraphQL API with type safety
- Real-time updates via WebSocket
- Comprehensive logging with Winston
- Swagger API documentation
- Request caching
- Input validation and sanitization

---

## 🏗️ Architecture

This project follows **Clean Architecture** principles with a clear separation of concerns:

```
┌─────────────────────────────────────────────────┐
│            PRESENTATION LAYER                    │
│  (Controllers, GraphQL Resolvers, DTOs)         │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│           APPLICATION LAYER                      │
│  (Use Cases, Business Logic, Tokens)            │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│              DOMAIN LAYER                        │
│  (Entities, Interfaces, Business Rules)         │
└────────────────┬────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────┐
│         INFRASTRUCTURE LAYER                     │
│  (Database, External Services, Implementations)  │
└─────────────────────────────────────────────────┘
```

### Detailed Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USERS BACKEND STRUCTURE                         │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER (Controllers)                  │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐             │
│  │   Users     │  │  Business    │  │  Department     │ ...         │
│  │  Controller │  │  Unit        │  │  Controller     │             │
│  │             │  │  Controller  │  │                 │             │
│  └──────┬──────┘  └──────┬───────┘  └────────┬────────┘             │
└─────────┼──────────────────┼──────────────────┼─────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│              APPLICATION LAYER (Use Cases & Tokens)                   │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────┐     ┌──────────────────────────┐       │
│  │  USE CASES              │     │  TOKENS (By Domain)      │       │
│  ├─────────────────────────┤     ├──────────────────────────┤       │
│  │ • CreateUserUseCase     │     │ • user/                  │       │
│  │ • GetUserUseCase        │──→  │   - USER_REPO            │       │
│  │ • UpdateUserUseCase     │     │ • business-unit/         │       │
│  │ • ApplyToolUseCase      │     │   - BUSINESS_UNIT_REPO   │       │
│  │                         │     │ • department/            │       │
│  │ • CreateBuUseCase       │     │   - DEPARTMENT_REPO      │       │
│  │ • GetBuUseCase          │     │ • roles/                 │       │
│  │ • UpdateBuUseCase       │     │   - ROLES_REPO           │       │
│  │                         │     │ • shift/                 │       │
│  │ ...                     │     │   - SHIFT_REPO           │       │
│  │                         │     │ • tools/                 │       │
│  │                         │     │   - TOOL_REPO            │       │
│  │                         │     │   - TOOL_TEMPLATE_REPO   │       │
│  └────────────┬────────────┘     └──────────────────────────┘       │
│               │                                                       │
│               │  Inject(USER_REPO)                                   │
│               │  @Inject(BUSINESS_UNIT_REPO)                        │
│               │  etc...                                              │
│               │                                                       │
└───────────────┼───────────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────────┐
│               DOMAIN LAYER (Repository Interfaces)                    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────┐  ┌────────────────────┐  ┌────────────────────┐  │
│  │ IUserRepo    │  │ IBusinessUnitRepo  │  │ IDepartmentRepo    │  │
│  │              │  │                    │  │                    │  │
│  │ • create     │  │ • create           │  │ • create           │  │
│  │ • findAll    │  │ • findAll          │  │ • findAll          │  │
│  │ • findById*  │  │ • findById         │  │ • findById         │  │
│  │ • update     │  │ • update           │  │ • update           │  │
│  │ • disable    │  │ • disable          │  │ • disable          │  │
│  │ • applyTool* │  │                    │  │                    │  │
│  └──────────────┘  └────────────────────┘  └────────────────────┘  │
│                                                                        │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ IRolesRepo     │  │ IShiftRepo   │  │ IToolTemplateRepo       │ │
│  │                │  │              │  │                         │ │
│  │ • create       │  │ • create     │  │ • create                │ │
│  │ • findAll      │  │ • findAll    │  │ • findAll               │ │
│  │ • findById     │  │ • findById   │  │ • findById (w/ tools)   │ │
│  │ • update       │  │ • update     │  │ • update                │ │
│  │ • disable      │  │ • disable    │  │ • disable               │ │
│  └────────────────┘  └──────────────┘  └─────────────────────────┘ │
│                                                                        │
│  • IToolRepo        (Similar to others)                              │
│                                                                        │
└────────────────────────┬─────────────────────────────────────────────┘
                         │
                         │  Implements
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│            INFRASTRUCTURE LAYER (Query Implementations)               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────┐  ┌────────────────────┐  ┌────────────────────┐  │
│  │ UserQuery    │  │ BusinessUnitQuery  │  │ DepartmentQuery    │  │
│  │ implements   │  │ implements         │  │ implements         │  │
│  │ IUserRepo    │  │ IBusinessUnitRepo  │  │ IDepartmentRepo    │  │
│  └──────────────┘  └────────────────────┘  └────────────────────┘  │
│                                                                        │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ RolesQuery     │  │ ShiftQuery   │  │ ToolTemplateQuery       │ │
│  │ implements     │  │ implements   │  │ implements              │ │
│  │ IRolesRepo     │  │ IShiftRepo   │  │ IToolTemplateRepo       │ │
│  └────────────────┘  └──────────────┘  └─────────────────────────┘ │
│                                                                        │
│  • ToolQuery        (implements IToolRepo)                            │
│                                                                        │
│  All use @InjectModel(Entity.name) to access MongoDB                │
│                                                                        │
└────────────────────────┬─────────────────────────────────────────────┘
                         │
                         │  Uses
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER (MongoDB)                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  MongoDB Collections:                                                 │
│  • Users             • Departments      • Tools                       │
│  • BusinessUnits     • Roles            • ToolTemplates              │
│  • Shifts            • UserSecurity     • Notifications              │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

### Design Patterns Implemented

✅ **Repository Pattern** - Data access abstraction  
✅ **Dependency Injection** - Loose coupling via tokens  
✅ **Use Case Pattern** - Single responsibility business logic  
✅ **DTO Pattern** - Data validation and transformation  
✅ **Strategy Pattern** - JWT and authentication strategies  

> 📖 **For detailed architecture documentation**, see [ARCHITECTURE.md](./readme/ARCHITECTURE.md)

---

## 📁 Project Structure

```
src/
├── apps/
│   ├── auth/                      # Authentication module
│   │   ├── Application/           # Auth use cases
│   │   ├── Domain/                # Auth DTOs
│   │   ├── Infrastructure/        # JWT strategy
│   │   └── Presentation/          # Auth controllers
│   │
│   └── users/                     # Users module
│       ├── Application/           # Use cases & tokens
│       │   ├── tokens/            # DI tokens by domain
│       │   └── usecases/          # Business logic
│       │       └── collector/
│       │           ├── users/
│       │           ├── business-unit/
│       │           ├── department/
│       │           ├── roles/
│       │           ├── shift/
│       │           └── tools/
│       │
│       ├── Domain/                # Interfaces & contracts
│       │   ├── dto/               # Data Transfer Objects
│       │   ├── graphql/           # GraphQL types
│       │   └── repository/        # Repository interfaces
│       │
│       ├── Infrastructure/        # Implementations
│       │   └── lib/storage/mongoose/
│       │       ├── queries/       # Repository implementations
│       │       └── schemas/       # MongoDB schemas
│       │
│       └── Presentation/          # Controllers & resolvers
│
├── common/                        # Shared utilities
│   ├── decorators/                # Custom decorators
│   ├── dto/                       # Common DTOs
│   ├── filters/                   # Exception filters
│   └── guards/                    # Auth guards
│
├── configuration/                 # App configuration
├── shared/                        # Shared modules
│   ├── Wiston/                    # Logging service
│   └── socket.io/                 # WebSocket service
│
└── main.ts                        # Application entry point
```

> 📊 **For visual structure diagrams**, see [DIAGRAMA_ESTRUCTURA.md](./readme/DIAGRAMA_ESTRUCTURA.md)

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB >= 6.x
- Docker & Docker Compose (for containerized deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd USERS_BACKEND

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development
PORT=3000
APP_NAME=USERS_BACKEND

# Database
DB_HOST=localhost
DB_PORT=27017
DB_NAME=users_db
DB_USER=admin
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h

# Logging
LOG_LEVEL=debug
LOG_DIR=./log
```

---

## 💻 Development

### Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

### Docker Development

```bash
# Build and start development container
npm run docker:dev:up

# View logs
npm run docker:dev:logs

# Stop container
npm run docker:dev:down

# Access container shell
npm run docker:dev:exec
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📚 API Documentation

### GraphQL Playground

Once the application is running, access the GraphQL playground at:

```
http://localhost:3000/graphql
```

### Swagger Documentation

REST API documentation is available at:

```
http://localhost:3000/api/docs
```

### Example Queries

**Get all users with relations:**
```graphql
query {
  users(filter: { active: true }) {
    id
    username
    email
    clock
    active
    authorized
    businessUnit {
      id
      name
    }
    rolesData {
      id
      name
    }
    toolsData {
      id
      title
      link
    }
  }
}
```

**User login:**
```graphql
mutation {
  login(loginInput: { clock: 12345, password: "your_password" }) {
    accessToken
    user {
      id
      username
      email
    }
  }
}
```

---

## 🐳 Deployment

### Docker Production

```bash
# Build production image
npm run docker:prod:build

# Start production container
npm run docker:prod:up

# View production logs
npm run docker:prod:logs

# Stop production container
npm run docker:prod:down
```

### PM2 Deployment

```bash
# Build the application
npm run build

# Start with PM2
npm run pm2:start:prod
```

---

## 📖 Documentation

Comprehensive documentation is available in the `/readme` folder:

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./readme/ARCHITECTURE.md) | Detailed architecture explanation, design patterns, and best practices |
| [DIAGRAMA_ESTRUCTURA.md](./readme/DIAGRAMA_ESTRUCTURA.md) | Visual structure diagrams and component relationships |

### Key Concepts

#### Repository Pattern
All data access is abstracted through repository interfaces defined in the Domain layer and implemented in the Infrastructure layer.

```typescript
// Domain layer - Interface
export interface IUserRepository {
  create(data: any): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  update(id: string, data: any): Promise<User>;
}

// Infrastructure layer - Implementation
export class UserQuery implements IUserRepository {
  // MongoDB implementation
}

// Application layer - Use Case
export class CreateUserUseCase {
  constructor(@Inject(USER_REPO) private repo: IUserRepository) {}
}
```

#### Dependency Injection Tokens
Each domain entity has its own token for dependency injection:

- `USER_REPO` - User repository
- `BUSINESS_UNIT_REPO` - Business unit repository
- `DEPARTMENT_REPO` - Department repository
- `ROLES_REPO` - Roles repository
- `TOOL_REPO` - Tool repository

---

## 🤝 Contributing

1. Follow the established architecture patterns
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Follow TypeScript and NestJS best practices
5. Update documentation as needed

---

## 📄 License

This project is private and proprietary.

**Author**: Miguel Angel Bissuett Lira  
**Version**: 1.0.0  
**Last Updated**: January 21, 2026

---

## 🔗 Related Projects

- Frontend Application (if applicable)
- Shared Libraries
- Infrastructure Configuration

---

<p align="center">
  Built with ❤️ using NestJS
</p>

