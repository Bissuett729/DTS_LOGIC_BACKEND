# USERS Backend - Architecture & Structure Improvements

## Overview
This document outlines the improved architecture and structure of the USERS backend application, including the repository pattern implementation, dependency injection tokens, and domain-driven design principles.

## Architecture Improvements

### 1. **Repository Pattern Implementation**
We've implemented a comprehensive repository pattern with clear contracts (interfaces) for each domain entity.

#### Repository Interfaces (Domain Layer)
Located in `src/apps/users/Domain/repository/`:

- **IUserRepository** - User data operations
  - `create()` - Create a new user
  - `findAll()` - Retrieve all active users
  - `findByIdWithRelations()` - Retrieve user with populated relations
  - `update()` - Update user data
  - `disable()` - Soft delete user
  - `applyToolTemplate()` - Apply tool template to user

- **IBusinessUnitRepository** - Business unit operations
- **IDepartmentRepository** - Department operations
- **IRolesRepository** - Role operations
- **IShiftRepository** - Shift operations
- **IToolRepository** - Tool operations
- **IToolTemplateRepository** - Tool template operations

#### Repository Implementations (Infrastructure Layer)
Located in `src/apps/users/Infrastructure/lib/storage/mongoose/queries/`:

- **UserQuery** - Implements `IUserRepository`
- **BusinessUnitQuery** - Extends `BaseService<BusinessUnit>`, implements `IBusinessUnitRepository`
- **DepartmentQuery** - Extends `BaseService<Department>`, implements `IDepartmentRepository`
- **RolesQuery** - Extends `BaseService<Role>`, implements `IRolesRepository`
- **ShiftQuery** - Extends `BaseService<Shift>`, implements `IShiftRepository`
- **ToolQuery** - Extends `BaseService<Tool>`, implements `IToolRepository`
- **ToolTemplateQuery** - Implements `IToolTemplateRepository`

### 2. **Dependency Injection Tokens**
Organized by domain with clear separation of concerns.

#### Token Organization
Located in `src/apps/users/Application/tokens/`:

```
tokens/
├── business-unit/
│   ├── business-unit.tokens.ts
│   └── index.ts
├── department/
│   ├── department.tokens.ts
│   └── index.ts
├── roles/
│   ├── roles.tokens.ts
│   └── index.ts
├── shift/
│   ├── shift.tokens.ts
│   └── index.ts
├── tools/
│   ├── tools.tokens.ts
│   └── index.ts
├── user/
│   ├── user.tokens.ts
│   └── index.ts
└── index.ts (main entry point)
```

#### Token Naming Convention
All tokens follow the pattern: `{ENTITY}_REPO`

Examples:
- `BUSINESS_UNIT_REPO`
- `USER_REPO`
- `DEPARTMENT_REPO`
- `ROLES_REPO`
- `SHIFT_REPO`
- `TOOL_REPO`
- `TOOL_TEMPLATE_REPO`

### 3. **Use Cases Structure**
Located in `src/apps/users/Application/usecases/collector/`:

Each use case:
- Injects the appropriate repository interface
- Uses the dependency injection token
- Implements a single business operation
- Follows the Single Responsibility Principle (SRP)

Example:
```typescript
@Injectable()
export class CreateUserUseCase {
    constructor(@Inject(USER_REPO) private readonly userRepo: IUserRepository) { }
    
    execute(dto: any) {
        return this.userRepo.create(dto);
    }
}
```

### 4. **Module Structure**
```
Application/
├── application.module.ts (imports UsersCollectorModule)
├── tokens/ (DI tokens)
└── usecases/
    └── collector/
        ├── users/ (UsersCollectorModule)
        └── bussines-unit/ (BuCollectorModule)

Infrastructure/
├── Infrastructure.module.ts (provides implementations)
└── lib/storage/mongoose/queries/ (repository implementations)

Domain/
├── repository/ (interfaces/contracts)
└── index.ts (exports all interfaces)
```

## Dependency Injection Setup

### Infrastructure Module
The `Infrastructure.module.ts` provides all repository implementations:

```typescript
const sharedProviders = [
    { provide: BUSINESS_UNIT_REPO, useClass: BusinessUnitQuery },
    { provide: USER_REPO, useClass: UserQuery },
    { provide: DEPARTMENT_REPO, useClass: DepartmentQuery },
    { provide: ROLES_REPO, useClass: RolesQuery },
    { provide: SHIFT_REPO, useClass: ShiftQuery },
    { provide: TOOL_REPO, useClass: ToolQuery },
    { provide: TOOL_TEMPLATE_REPO, useClass: ToolTemplateQuery }
];
```

## Circular Dependency Resolution

### Issue Fixed
The circular dependency in `UsersCollectorModule` was caused by:
```typescript
// BAD: users.collector.module.ts
import * as useCases from '.'; // Index exports the module itself
export class UsersCollectorModule { }

// BAD: index.ts
export * from './users.collector.module'; // Creates circular import
```

### Solution
Removed module export from the index file:
```typescript
// GOOD: index.ts
export * from './apply-tool-template.usecase';
export * from './create-user.usecase';
export * from './get-user.usecase';
export * from './update-user.usecase';
// ✓ No module export - breaks the circular dependency
```

## Best Practices Applied

1. **Dependency Inversion Principle (DIP)**
   - High-level modules (use cases) depend on abstractions (interfaces)
   - Low-level modules (queries) implement those abstractions

2. **Single Responsibility Principle (SRP)**
   - Each use case has one reason to change
   - Each repository interface has a clear contract

3. **Separation of Concerns**
   - Domain: Interfaces/Contracts
   - Application: Use cases and orchestration
   - Infrastructure: Implementations (Mongoose queries)

4. **Clear Naming Conventions**
   - Tokens: `{ENTITY}_REPO`
   - Interfaces: `I{Entity}Repository`
   - Implementations: `{Entity}Query`
   - Use cases: `{Action}{Entity}UseCase`

5. **Deprecation Path**
   - Old tokens maintained with `@deprecated` markers
   - Easy migration path for existing code
   - Backward compatibility preserved

## File Structure Summary

```
src/apps/users/
├── Application/
│   ├── application.module.ts
│   ├── tokens/ (Organized by domain)
│   │   ├── business-unit/
│   │   ├── department/
│   │   ├── roles/
│   │   ├── shift/
│   │   ├── tools/
│   │   ├── user/
│   │   └── index.ts
│   └── usecases/
│       └── collector/
│           ├── users/ (UsersCollectorModule)
│           └── bussines-unit/ (BuCollectorModule)
│
├── Domain/
│   ├── repository/ (Interfaces)
│   │   ├── business-unit/
│   │   ├── department/
│   │   ├── roles/
│   │   ├── shift/
│   │   ├── tools/
│   │   ├── users/
│   │   ├── common-query/
│   │   └── index.ts
│   └── index.ts
│
├── Infrastructure/
│   ├── Infrastructure.module.ts
│   └── lib/storage/mongoose/
│       ├── queries/ (Implementations)
│       │   ├── users/
│       │   ├── bussines-unit/
│       │   ├── department/
│       │   ├── roles/
│       │   ├── shift/
│       │   ├── tools/
│       │   ├── common/
│       │   └── index.ts
│       └── schemas/
│
├── Presentation/
│   └── ... (Controllers and DTOs)
│
└── users.module.ts (Root module)
```

## Migration Guide

If you have existing code using old interfaces:

### Before
```typescript
import { IUserRepo } from 'src/apps/users/Domain';
import { USER_QUERY_REPO } from '../../../tokens';

constructor(@Inject(USER_QUERY_REPO) private readonly userQueryRepo: IUserRepo) { }
```

### After
```typescript
import { IUserRepository } from 'src/apps/users/Domain';
import { USER_REPO } from '../../../tokens';

constructor(@Inject(USER_REPO) private readonly userRepo: IUserRepository) { }
```

## Future Improvements

1. **Query Object Pattern** - Implement for complex filtering
2. **Specification Pattern** - For business rule encapsulation
3. **Events/Aggregates** - For domain-driven design events
4. **CQRS** - Separate read and write models if needed
5. **Soft Delete Wrapper** - Create a decorator for soft delete logic

---

**Last Updated**: January 20, 2026
**Architecture Version**: 2.0
