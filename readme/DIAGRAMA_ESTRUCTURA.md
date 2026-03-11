# 🗂️ Estructura Visual del Proyecto - USERS BACKEND

> **Guía Completa de Arquitectura, Componentes y Flujos de Comunicación**

---

## 📑 Tabla de Contenidos

1. [Diagrama de Arquitectura General](#-diagrama-de-arquitectura-general)
2. [Flujo de Comunicación Completo](#-flujo-de-comunicación-completo)
3. [Estructura de Capas Detallada](#-estructura-de-capas-detallada)
4. [Flujo de Inyección de Dependencias](#-flujo-de-inyección-de-dependencias)
5. [Estructura de Carpetas](#-estructura-de-carpetas-detallada)
6. [Relaciones entre Capas](#-relaciones-entre-capas)
7. [Flujos de Datos por Caso de Uso](#-flujos-de-datos-por-caso-de-uso)
8. [Patrón de Inyección por Entidad](#-patrón-de-inyección-por-entidad)
9. [Comunicación entre Módulos](#-comunicación-entre-módulos)

---

## 🏗️ Diagrama de Arquitectura General

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
│  • Shifts                                                              │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

## Flujo de Inyección de Dependencias

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DEPENDENCY INJECTION FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

1. CONTROLADOR
   ↓
   CreateUserController 
   constructor: CreateUserUseCase

2. USE CASE
   ↓
   CreateUserUseCase
   constructor: @Inject(USER_REPO) private readonly userRepo

3. TOKEN (Symbol)
   ↓
   USER_REPO = Symbol('USER_REPO')

4. INFRASTRUCTURE MODULE
   ↓
   { provide: USER_REPO, useClass: UserQuery }

5. IMPLEMENTACIÓN
   ↓
   UserQuery implements IUserRepository
   constructor: @InjectModel(User.name) private model: Model<User>

6. MONGODB
   ↓
   MongoDB Connection → User Collection
```

## Estructura de Carpetas Detallada

```
src/apps/users/
│
├── Application/
│   ├── application.module.ts
│   │
│   ├── tokens/                         ✨ NUEVO: Tokens por dominio
│   │   ├── business-unit/
│   │   │   ├── business-unit.tokens.ts
│   │   │   └── index.ts
│   │   ├── department/
│   │   │   ├── department.tokens.ts
│   │   │   └── index.ts
│   │   ├── roles/
│   │   │   ├── roles.tokens.ts
│   │   │   └── index.ts
│   │   ├── shift/
│   │   │   ├── shift.tokens.ts
│   │   │   └── index.ts
│   │   ├── tools/
│   │   │   ├── tools.tokens.ts
│   │   │   └── index.ts
│   │   ├── user/
│   │   │   ├── user.tokens.ts
│   │   │   └── index.ts
│   │   └── index.ts                  (re-exports all)
│   │
│   └── usecases/
│       └── collector/
│           ├── users/
│           │   ├── apply-tool-template.usecase.ts
│           │   ├── create-user.usecase.ts
│           │   ├── get-user.usecase.ts
│           │   ├── update-user.usecase.ts
│           │   ├── users.collector.module.ts
│           │   ├── user-security.query.ts
│           │   ├── user-session.query.ts
│           │   └── index.ts               (NO module export ✓)
│           │
│           └── bussines-unit/
│               ├── create-bu.usecase.ts
│               ├── get-bu.usecase.ts
│               ├── update-bu.usecase.ts
│               ├── bussines-unit.collector.module.ts
│               └── index.ts
│
├── Domain/
│   ├── repository/                     ✨ NUEVO: Interfaces por dominio
│   │   ├── business-unit/
│   │   │   ├── business-unit.repository.ts
│   │   │   └── index.ts
│   │   ├── department/
│   │   │   ├── department.repository.ts
│   │   │   └── index.ts
│   │   ├── roles/
│   │   │   ├── roles.repository.ts
│   │   │   └── index.ts
│   │   ├── shift/
│   │   │   ├── shift.repository.ts
│   │   │   └── index.ts
│   │   ├── tools/
│   │   │   ├── tool.repository.ts
│   │   │   ├── tool-template.repository.ts
│   │   │   └── index.ts
│   │   ├── users/
│   │   │   ├── user.repository.ts      (legacy)
│   │   │   ├── user-extended.repository.ts  (✨ NEW: IUserRepository)
│   │   │   └── index.ts
│   │   ├── common-query/
│   │   │   └── common-query.repository.ts
│   │   └── index.ts                   (exports all)
│   │
│   ├── graphql/
│   └── index.ts                       (exports repository)
│
├── Infrastructure/
│   ├── Infrastructure.module.ts
│   │
│   ├── lib/
│   │   └── storage/
│   │       └── mongoose/
│   │           ├── database.module.ts
│   │           │
│   │           ├── queries/
│   │           │   ├── users/
│   │           │   │   ├── user.query.ts        (✅ implements IUserRepository)
│   │           │   │   ├── user-security.query.ts
│   │           │   │   ├── user-session.query.ts
│   │           │   │   └── index.ts
│   │           │   ├── bussines-unit/
│   │           │   │   ├── bu.query.ts
│   │           │   │   └── index.ts
│   │           │   ├── department/
│   │           │   │   ├── department.query.ts
│   │           │   │   └── index.ts
│   │           │   ├── roles/
│   │           │   │   ├── roles.query.ts
│   │           │   │   └── index.ts
│   │           │   ├── shift/
│   │           │   │   ├── shift.query.ts
│   │           │   │   └── index.ts
│   │           │   ├── tools/
│   │           │   │   ├── tool.query.ts
│   │           │   │   ├── tool-template.query.ts  (✅ implements IToolTemplateRepository)
│   │           │   │   └── index.ts
│   │           │   ├── common/
│   │           │   │   ├── base.query.ts
│   │           │   │   └── index.ts
│   │           │   └── index.ts
│   │           │
│   │           └── schemas/
│   │               ├── user.schema.ts
│   │               ├── business-unit.schema.ts
│   │               └── ... (other schemas)
│   │
│   └── dto/ (si existe)
│
├── Presentation/
│   └── ... (Controllers and views)
│
└── users.module.ts (Root module)
```

## Relaciones entre Capas

```
┌──────────────┐
│ Presentation │  (HTTP Requests)
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Application     │  (Use Cases + Tokens)
│  Layer           │
│                  │
│  ┌────────────┐  │
│  │ Use Cases  │  │
│  └──────┬─────┘  │
│         │        │
│  ┌──────▼─────┐  │
│  │ Tokens     │  │
│  │ (Symbols)  │  │
│  └────────────┘  │
└────────┬─────────┘
         │
         │ Depends on
         │ (Interfaces)
         ▼
┌──────────────────┐
│ Domain Layer     │  (Interfaces/Contracts)
│                  │
│ ┌──────────────┐ │
│ │ Interfaces   │ │
│ │ (I*Repo)     │ │
│ └──────────────┘ │
└────────┬─────────┘
         │
         │ Implemented by
         │
         ▼
┌──────────────────┐
│ Infrastructure   │  (Implementations)
│ Layer            │
│                  │
│ ┌──────────────┐ │
│ │ Queries      │ │
│ │ (*Query)     │ │
│ └──────┬───────┘ │
└────────┼─────────┘
         │
         │ Uses
         │
         ▼
┌──────────────────┐
│ Data Layer       │  (MongoDB)
│                  │
│ ┌──────────────┐ │
│ │ MongoDB      │ │
│ │ Collections  │ │
│ └──────────────┘ │
└──────────────────┘
```

---

## 🔄 Flujo de Comunicación Completo

### Request → Response Flow (GraphQL Example)

```
┌────────────────────────────────────────────────────────────────────┐
│  1. CLIENT REQUEST                                                  │
└────────────────────────────────────────────────────────────────────┘
   │
   │  POST /graphql
   │  query { users { id username email } }
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│  2. NEST.JS MIDDLEWARE & GUARDS                                     │
├────────────────────────────────────────────────────────────────────┤
│  • DeveloperBypassJwtGuard (validates JWT token)                   │
│  • ValidationPipe (validates request data)                          │
│  • ExceptionFilter (handles errors)                                 │
└────────────────────────────────────────────────────────────────────┘
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│  3. PRESENTATION LAYER                                              │
├────────────────────────────────────────────────────────────────────┤
│  UsersResolver.getUsers()                                           │
│  • Receives request                                                 │
│  • Extracts parameters/filters                                      │
│  • Calls appropriate use case                                       │
└────────────────────────────────────────────────────────────────────┘
   │
   │  resolver.getUsers(filter)
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│  4. APPLICATION LAYER                                               │
├────────────────────────────────────────────────────────────────────┤
│  GetUserUseCase.execute(filter)                                     │
│  • Business logic validation                                        │
│  • Inject USER_REPO                                                 │
│  • Call repository methods                                          │
└────────────────────────────────────────────────────────────────────┘
   │
   │  @Inject(USER_REPO) userRepo.findAll(filter)
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│  5. DOMAIN LAYER                                                    │
├────────────────────────────────────────────────────────────────────┤
│  IUserRepository (Interface/Contract)                               │
│  • Defines findAll() method signature                               │
│  • Type safety guarantee                                            │
└────────────────────────────────────────────────────────────────────┘
   │
   │  Implemented by →
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│  6. INFRASTRUCTURE LAYER                                            │
├────────────────────────────────────────────────────────────────────┤
│  UserQuery.findAll(filter)                                          │
│  • Implements IUserRepository                                       │
│  • Uses @InjectModel(User.name)                                     │
│  • Builds MongoDB query                                             │
│  • Executes database operation                                      │
└────────────────────────────────────────────────────────────────────┘
   │
   │  this.userModel.find(filter).populate('businessUnitId')...
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│  7. DATABASE LAYER                                                  │
├────────────────────────────────────────────────────────────────────┤
│  MongoDB                                                            │
│  • users collection query                                           │
│  • Population of references                                         │
│  • Returns document array                                           │
└────────────────────────────────────────────────────────────────────┘
   │
   │  [{ _id, username, email, ... }]
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│  8. RESPONSE TRANSFORMATION                                         │
├────────────────────────────────────────────────────────────────────┤
│  Data flows back through layers:                                    │
│  Infrastructure → Domain → Application → Presentation               │
│  • Each layer transforms data as needed                             │
│  • GraphQL resolver returns typed response                          │
└────────────────────────────────────────────────────────────────────┘
   │
   │  { data: { users: [...] } }
   │
   ▼
┌────────────────────────────────────────────────────────────────────┐
│  9. CLIENT RESPONSE                                                 │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                      LOGIN/AUTHENTICATION FLOW                      │
└────────────────────────────────────────────────────────────────────┘

1. CLIENT SENDS CREDENTIALS
   │
   │  POST /auth/login
   │  { clock: 12345, password: "****" }
   │
   ▼
2. AuthController.login(dto)
   │
   ├─→ Validates DTO (class-validator)
   │
   ▼
3. AuthService.login(dto)
   │
   ├─→ validateUser(clock, password)
   │   │
   │   ├─→ UserRepo.findByClock(clock)
   │   │   └─→ MongoDB: users.findOne({ clock })
   │   │
   │   ├─→ Check user.active === true
   │   │
   │   ├─→ Check user.authorized === true  ⭐ NEW
   │   │   └─→ If false: throw UnauthorizedException
   │   │
   │   └─→ UserSecurityRepo.validatePassword(userId, password)
   │       └─→ MongoDB: user_security.findOne({ userId })
   │       └─→ bcrypt.compare(password, hashedPassword)
   │
   ▼
4. IF VALID:
   │
   ├─→ Generate JWT payload:
   │   {
   │     sub: user.id,
   │     clock: user.clock,
   │     roleIds: [...]
   │   }
   │
   ├─→ JwtService.sign(payload)
   │
   └─→ Return {
         accessToken: "eyJhbGc...",
         user: { id, username, email, ... }
       }
   
5. CLIENT RECEIVES TOKEN
   │
   └─→ Stores token (localStorage/cookie)
   └─→ Includes in subsequent requests:
       Authorization: Bearer eyJhbGc...

6. PROTECTED REQUESTS
   │
   ├─→ DeveloperBypassJwtGuard intercepts
   │
   ├─→ JwtStrategy.validate(payload)
   │   └─→ Extracts user info from token
   │   └─→ Attaches to request: req.user
   │
   └─→ Controller receives authenticated request
```

---

## 📊 Flujos de Datos por Caso de Uso

### 🆕 Create User Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                        CREATE USER FLOW                             │
└────────────────────────────────────────────────────────────────────┘

Client Request
   │
   │  mutation createUser($input: CreateUserInput!)
   │
   ▼
UsersResolver.createUser(createUserDto)
   │
   ├─→ Validates DTO (email format, clock number, etc.)
   │
   ▼
CreateUserUseCase.execute(dto)
   │
   ├─→ Transform username to TitleCase
   ├─→ Add default password
   ├─→ Set requiresPasswordChange: true
   ├─→ Set authorized: true (by default from schema)
   │
   ▼
UserRepository.create(userData)
   │
   ├─→ UserQuery.create(userData)
   │   │
   │   ├─→ new User(userData)
   │   ├─→ user.save()
   │   │
   │   └─→ MongoDB: Insert document into 'users' collection
   │
   ▼
Returns created user
   │
   └─→ { id, username, email, clock, active, authorized, ... }
```

### 🔄 Update User Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                        UPDATE USER FLOW                             │
└────────────────────────────────────────────────────────────────────┘

Client Request
   │
   │  mutation updateUser($id: ID!, $input: UpdateUserInput!)
   │
   ▼
UsersResolver.updateUser(id, updateUserDto)
   │
   ▼
UpdateUserUseCase.execute(id, dto)
   │
   ├─→ Validates user exists
   │
   ▼
UserRepository.update(id, data)
   │
   ├─→ UserQuery.update(id, data)
   │   │
   │   ├─→ this.userModel.findByIdAndUpdate(id, data, { new: true })
   │   │
   │   └─→ MongoDB: Update document in 'users' collection
   │
   ▼
Returns updated user
   │
   └─→ { id, username, email, ...(updated fields) }
```

### 🛠️ Apply Tool Template Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                    APPLY TOOL TEMPLATE FLOW                         │
└────────────────────────────────────────────────────────────────────┘

Client Request
   │
   │  mutation applyToolTemplate($userId: ID!, $templateId: ID!)
   │
   ▼
UsersResolver.applyToolTemplate(userId, templateId)
   │
   ▼
ApplyToolTemplateUseCase.execute(userId, templateId)
   │
   ├─→ ToolTemplateRepo.findById(templateId)
   │   └─→ MongoDB: tool_templates.findById(templateId).populate('tools')
   │
   ├─→ Extract tool IDs from template
   │
   ├─→ UserRepo.applyToolTemplate(userId, toolIds)
   │   │
   │   └─→ UserQuery.applyToolTemplate(userId, toolIds)
   │       │
   │       ├─→ this.userModel.findById(userId)
   │       ├─→ user.tools = toolIds
   │       ├─→ user.save()
   │       │
   │       └─→ MongoDB: Update user.tools array
   │
   ▼
Returns updated user with tools
   │
   └─→ { id, username, tools: [toolId1, toolId2, ...] }
```

---

## 🔌 Comunicación entre Módulos

### Módulos y sus Interacciones

```
┌────────────────────────────────────────────────────────────────────┐
│                     MODULE INTERACTION MAP                          │
└────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   AppModule     │  (Root Module)
└────────┬────────┘
         │
         ├─→ imports: [
         │     AuthModule,
         │     UsersModule,
         │     ConfigModule,
         │     MongooseModule,
         │     GraphQLModule
         │   ]
         │
         ▼
    ┌────────────────────────────────────────┐
    │                                        │
    ▼                                        ▼
┌─────────────┐                    ┌─────────────────┐
│ AuthModule  │                    │  UsersModule    │
└─────────────┘                    └─────────────────┘
    │                                      │
    ├─→ InfrastructureModule              ├─→ ApplicationModule
    ├─→ ApplicationModule                 │   └─→ UsersCollectorModule
    └─→ PresentationModule                │   └─→ BuCollectorModule
        └─→ AuthController                │   └─→ DepartmentCollectorModule
                                          │   └─→ ... (other collectors)
                                          │
                                          ├─→ InfrastructureModule
                                          │   └─→ DatabaseModule
                                          │       └─→ provides: repositories
                                          │
                                          └─→ PresentationModule
                                              └─→ UsersResolver
                                              └─→ BusinessUnitResolver
                                              └─→ ... (other resolvers)

┌──────────────────────────────────────────────────────────────────┐
│  CROSS-MODULE DEPENDENCIES                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  AuthService                                                      │
│    └─→ @Inject(USER_REPO) from UsersModule                      │
│    └─→ @Inject(USER_SECURITY_REPO) from UsersModule             │
│                                                                   │
│  UsersResolver                                                    │
│    └─→ CreateUserUseCase                                         │
│    └─→ GetUserUseCase                                            │
│    └─→ UpdateUserUseCase                                         │
│    └─→ ApplyToolTemplateUseCase                                  │
│                                                                   │
│  Use Cases                                                        │
│    └─→ @Inject(ENTITY_REPO) from InfrastructureModule           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Shared Services

```
┌────────────────────────────────────────────────────────────────────┐
│                       SHARED SERVICES                               │
└────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│ WinstonService   │  (Logging Service)
└────────┬─────────┘
         │
         └─→ Used by:
             • All Use Cases
             • All Controllers
             • Auth Service
             • Middleware
             
             Example:
             this.logger.log(`[CreateUser] Creating user...`)
             this.logger.error(`[CreateUser] Error: ${error}`)

┌──────────────────┐
│ SocketIOService  │  (Real-time Communication)
└────────┬─────────┘
         │
         └─→ Used by:
             • Notification system
             • Real-time updates
             • Client connections
             
             Example:
             this.socketService.emit('user:created', userData)

┌──────────────────┐
│ ConfigService    │  (Environment Configuration)
└────────┬─────────┘
         │
         └─→ Used by:
             • Database connection
             • JWT configuration
             • API endpoints
             • Feature flags
             
             Example:
             this.config.get('DB_HOST')
             this.config.get('JWT_SECRET')
```

---

## 🎯 Data Flow Examples

### Example 1: User Login with Authorization Check

```
[CLIENT] 
   │ POST /auth/login { clock: 12345, password: "pass" }
   ▼
[AuthController]
   │ → AuthService.login(dto)
   ▼
[AuthService]
   │ → validateUser(clock, password)
   │
   ├─→ UserRepo.findByClock(12345)
   │   └─→ [MongoDB] SELECT * FROM users WHERE clock = 12345
   │   └─→ Returns: { id: "abc", clock: 12345, authorized: true, ... }
   │
   ├─→ CHECK: user.active === true ✓
   │
   ├─→ CHECK: user.authorized === true ✓  ⭐ Authorization Gate
   │   └─→ If false: throw UnauthorizedException
   │
   └─→ UserSecurityRepo.validatePassword(userId, password)
       └─→ [MongoDB] SELECT * FROM user_security WHERE userId = "abc"
       └─→ bcrypt.compare(password, hash) ✓
   
[AuthService]
   │ → JwtService.sign({ sub: "abc", clock: 12345, roleIds: [...] })
   │ → Returns: { accessToken: "eyJ...", user: {...} }
   ▼
[CLIENT]
   │ ← 200 OK { accessToken: "eyJ...", user: {...} }
   │ → Stores token
   └─→ Uses token in future requests
```

### Example 2: Get User with Relations

```
[CLIENT]
   │ query { 
   │   user(id: "abc") { 
   │     username 
   │     businessUnit { name } 
   │     rolesData { name }
   │   }
   │ }
   ▼
[UsersResolver]
   │ → GetUserUseCase.execute("abc")
   ▼
[GetUserUseCase]
   │ → @Inject(USER_REPO) userRepo.findByIdWithRelations("abc")
   ▼
[UserQuery]
   │ → this.userModel
   │     .findById("abc")
   │     .populate('businessUnitId')
   │     .populate('roleIds')
   │     .populate('departmentId')
   │     .populate('tools')
   │     .populate('supervisor')
   ▼
[MongoDB]
   │ → Executes aggregation with $lookup for relations
   │ → Returns populated document
   │ ← {
   │     _id: "abc",
   │     username: "John Doe",
   │     businessUnitId: { _id: "bu1", name: "Engineering" },
   │     roleIds: [
   │       { _id: "r1", name: "Developer" },
   │       { _id: "r2", name: "Team Lead" }
   │     ],
   │     ...
   │   }
   ▼
[UserQuery]
   │ → Transforms MongoDB document to Domain entity
   ▼
[GetUserUseCase]
   │ → Returns transformed user
   ▼
[UsersResolver]
   │ → Maps to GraphQL UserDetailType
   ▼
[CLIENT]
   │ ← {
   │     data: {
   │       user: {
   │         username: "John Doe",
   │         businessUnit: { name: "Engineering" },
   │         rolesData: [
   │           { name: "Developer" },
   │           { name: "Team Lead" }
   │         ]
   │       }
   │     }
   │   }
```

---

## 🔧 WebSocket Communication

```
┌────────────────────────────────────────────────────────────────────┐
│                    WEBSOCKET REAL-TIME FLOW                         │
└────────────────────────────────────────────────────────────────────┘

1. Client Connection
   │
   │  io.connect('ws://localhost:3000')
   │  { auth: { token: "JWT_TOKEN" } }
   │
   ▼
2. SocketIOService.handleConnection(client)
   │
   ├─→ Extract JWT from handshake
   ├─→ Validate token with JwtService
   ├─→ Store client connection
   │
   └─→ client.emit('connected', { message: 'Connected' })

3. Server Events (Broadcasting)
   │
   │  Example: User Created
   │  
   ├─→ CreateUserUseCase.execute()
   │   └─→ After user creation:
   │       └─→ this.socketService.emit('user:created', userData)
   │
   └─→ All connected clients receive:
       { event: 'user:created', data: { id, username, ... } }

4. Client Events (Listening)
   │
   │  socket.on('user:created', (data) => {
   │    console.log('New user created:', data);
   │    updateUI(data);
   │  });
```

---

## Patrón de Inyección para Cada Entidad

```
┌─────────────────────────────────────────────────────────────┐
│          Entity: User                                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  TOKEN                                                        │
│  └─ USER_REPO = Symbol('USER_REPO')                         │
│                                                               │
│  INTERFACE                                                    │
│  └─ interface IUserRepository { ... }                        │
│                                                               │
│  IMPLEMENTATION                                               │
│  └─ class UserQuery implements IUserRepository { ... }       │
│                                                               │
│  USE CASE INJECTION                                           │
│  └─ @Inject(USER_REPO) private userRepo: IUserRepository    │
│                                                               │
│  INFRASTRUCTURE REGISTRATION                                  │
│  └─ { provide: USER_REPO, useClass: UserQuery }             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Resumen de Convenciones

### Naming Conventions

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| **Token** | `{ENTITY}_REPO` | `USER_REPO`, `BUSINESS_UNIT_REPO` |
| **Interface** | `I{Entity}Repository` | `IUserRepository`, `IToolRepository` |
| **Implementation** | `{Entity}Query` | `UserQuery`, `ToolQuery` |
| **Use Case** | `{Action}{Entity}UseCase` | `CreateUserUseCase`, `GetToolUseCase` |
| **DTO** | `{Action}{Entity}Dto` | `CreateUserDto`, `UpdateRoleDto` |
| **Schema** | `{Entity}` (Mongoose) | `User`, `BusinessUnit` |
| **GraphQL Type** | `{Entity}Type` | `UserType`, `RoleType` |

### File Structure Conventions

```
{domain}/
├── {domain}.tokens.ts          # Dependency injection tokens
├── {domain}.repository.ts      # Interface/contract
├── {entity}.query.ts           # Implementation
├── {entity}.schema.ts          # Mongoose schema
├── create-{entity}.usecase.ts  # Use case
├── create-{entity}.dto.ts      # DTO
└── {entity}.type.ts            # GraphQL type
```

---

## 🚀 Quick Start Guide for Developers

### 1. Adding a New Entity

**Example: Adding "Team" entity**

#### Step 1: Create Token
```typescript
// Application/tokens/team/team.tokens.ts
export const TEAM_REPO = Symbol('TEAM_REPO');
```

#### Step 2: Create Interface
```typescript
// Domain/repository/team/team.repository.ts
export interface ITeamRepository {
  create(data: any): Promise<Team>;
  findAll(): Promise<Team[]>;
  findById(id: string): Promise<Team>;
  update(id: string, data: any): Promise<Team>;
  disable(id: string): Promise<boolean>;
}
```

#### Step 3: Create Schema
```typescript
// Infrastructure/lib/storage/mongoose/schemas/team.schema.ts
@Schema({ collection: 'teams', timestamps: true })
export class Team extends Document {
  @Prop({ required: true })
  name: string;
  
  @Prop({ default: true })
  active: boolean;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
```

#### Step 4: Create Implementation
```typescript
// Infrastructure/lib/storage/mongoose/queries/team/team.query.ts
@Injectable()
export class TeamQuery implements ITeamRepository {
  constructor(@InjectModel(Team.name) private model: Model<Team>) {}
  
  async create(data: any): Promise<Team> {
    return this.model.create(data);
  }
  // ... implement other methods
}
```

#### Step 5: Register in Infrastructure Module
```typescript
// Infrastructure/Infrastructure.module.ts
providers: [
  { provide: TEAM_REPO, useClass: TeamQuery }
]
```

#### Step 6: Create Use Cases
```typescript
// Application/usecases/collector/team/create-team.usecase.ts
@Injectable()
export class CreateTeamUseCase {
  constructor(@Inject(TEAM_REPO) private repo: ITeamRepository) {}
  
  async execute(dto: CreateTeamDto) {
    return this.repo.create(dto);
  }
}
```

#### Step 7: Create Resolver/Controller
```typescript
// Presentation/resolvers/team.resolver.ts
@Resolver()
export class TeamResolver {
  constructor(private createTeamUseCase: CreateTeamUseCase) {}
  
  @Mutation(() => TeamType)
  createTeam(@Args('input') dto: CreateTeamDto) {
    return this.createTeamUseCase.execute(dto);
  }
}
```

---

## 🎓 Best Practices

### ✅ DO

- **Use dependency injection** for all dependencies
- **Write interfaces** for all repositories
- **Use DTOs** for input validation
- **Implement use cases** for business logic
- **Follow naming conventions** consistently
- **Log important operations** with WinstonService
- **Handle errors** gracefully with appropriate HTTP codes
- **Write tests** for use cases and repositories
- **Document complex logic** with comments

### ❌ DON'T

- **Don't mix layers** - respect architectural boundaries
- **Don't bypass repositories** - always use interfaces
- **Don't put business logic in controllers**
- **Don't use direct Mongoose queries in use cases**
- **Don't expose internal errors** to clients
- **Don't hardcode values** - use configuration
- **Don't skip validation** on user inputs
- **Don't ignore TypeScript types**

---

## 🐛 Common Issues & Solutions

### Issue 1: Circular Dependency

**Problem**: Module A imports Module B which imports Module A

**Solution**:
```typescript
// Use forwardRef
constructor(
  @Inject(forwardRef(() => OtherService))
  private otherService: OtherService
) {}
```

### Issue 2: Token Not Found

**Problem**: `Nest can't resolve dependencies of the UseCase (?)`

**Solution**:
- Ensure token is exported in `tokens/index.ts`
- Verify provider is registered in `Infrastructure.module.ts`
- Check import path is correct

### Issue 3: GraphQL Schema Issues

**Problem**: GraphQL types not resolving correctly

**Solution**:
- Ensure all types are decorated with `@ObjectType()`
- All fields need `@Field()` decorator
- Import types in module `imports: [GraphQLModule]`

---

**Fecha**: 21 de Enero, 2026
**Estado**: ✅ Completado y Actualizado
**Diagrama Version**: 2.0
**Autor**: Miguel Angel Bissuett Lira
