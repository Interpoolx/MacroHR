# Universal React Project to Modular Monorepo Migration Prompt

## Context
I have an existing React project (with or without a backend) that I want to migrate to a **modular monolithic repository structure**. The goal is to organize the codebase into a scalable, maintainable architecture where:

1. **Shared infrastructure** (auth, UI components, utilities) lives in dedicated packages
2. **Backend** is separated from frontend with clear API contracts
3. **Frontend** is organized as a shell application
4. **Modules** are self-contained vertical slices that can work independently or integrate with other modules

## Current Project Structure
[Provide your current structure, for example:]

```
my-project/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── utils/
├── public/
├── package.json
└── [other config files]
```

OR if you have a backend:

```
my-project/
├── frontend/
│   └── src/
├── backend/
│   └── src/
└── package.json
```

## Target Technology Stack

### Backend
- **Framework**: [Specify: Hono, Express, Fastify, tRPC, etc.]
- **Runtime**: [Specify: Cloudflare Workers, Node.js, Bun, Deno, etc.]
- **Database**: [Specify: Cloudflare D1, PostgreSQL, MySQL, MongoDB, Supabase, etc.]
- **ORM**: [Specify: Drizzle, Prisma, TypeORM, Kysely, etc.]
- **Auth**: [Specify: Supabase Auth, Clerk, Auth.js, Custom JWT, etc.]
- **Storage**: [Specify: Cloudflare R2, AWS S3, Supabase Storage, etc.]

### Frontend
- **Framework**: React
- **Build Tool**: [Specify: Vite, Webpack, Turbopack, etc.]
- **Router**: [Specify: TanStack Router, React Router v6, Next.js App Router, etc.]
- **State Management**: [Specify: TanStack Query, Redux Toolkit, Zustand, Jotai, etc.]
- **UI Library**: [Specify: shadcn/ui, Material-UI, Chakra UI, Ant Design, Custom, etc.]
- **Styling**: [Specify: Tailwind CSS, CSS Modules, Styled Components, Emotion, etc.]

### Monorepo Tools
- **Package Manager**: [Specify: pnpm, npm workspaces, yarn workspaces, Bun]
- **Build Orchestration**: [Specify: Turbo, Nx, Lerna, Rush, or None]
- **Version Control**: Git

## My Application Domain

### Core Business Domains
List the main business domains/features in your application:
1. [Example: User Management]
2. [Example: Content Management]
3. [Example: Analytics Dashboard]
4. [Example: Payment Processing]
5. [Add more...]

### Existing Modules/Features to Extract
Identify features that should become independent modules:
- Module 1: [Name] - [Brief description]
- Module 2: [Name] - [Brief description]
- Module 3: [Name] - [Brief description]
- [Add more...]

## Requirements

### 1. Folder Structure
Create a comprehensive folder structure that includes:

```
project-root/
├── packages/
│   ├── shared/
│   │   ├── core/          # Config, utilities, common types
│   │   ├── ui/            # Shared UI components
│   │   ├── auth/          # Authentication module
│   │   └── [other shared packages]
│   │
│   ├── modules/           # Business domain modules
│   │   ├── [module-1]/
│   │   ├── [module-2]/
│   │   └── [module-n]/
│   │
│   ├── backend/           # Backend orchestrator
│   │   └── src/
│   │       ├── index.ts
│   │       ├── registry.ts
│   │       └── [middleware, types, etc.]
│   │
│   └── web/               # Frontend shell
│       └── src/
│           ├── routes/
│           ├── components/
│           └── [main app structure]
│
├── scripts/               # Automation scripts
├── docs/                  # Documentation
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # Workspace definition
├── turbo.json            # Build orchestration
└── [other root configs]
```

**Please provide:**
- Detailed structure for EACH level
- What files go where and WHY
- Naming conventions for modules, packages, and files
- How to organize feature-specific vs shared code

### 2. Module Template Structure
Define a standardized template that every module must follow:

```
module-name/
├── backend/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── [what else?]
├── frontend/
│   ├── routes/
│   ├── components/
│   ├── hooks/
│   └── [what else?]
├── db/
│   ├── schema/
│   └── [migrations, seeds?]
├── shared/
│   ├── types/
│   └── [constants, utils?]
├── tests/
├── README.md
├── package.json
└── module.config.ts
```

**Please provide:**
- Complete module template structure
- What goes in each folder
- How modules communicate with each other
- How modules register with the backend/frontend
- Dependency management between modules

### 3. Configuration Files
Provide complete, production-ready configuration files:

#### Root Level
- `package.json` - Root workspace configuration
- `pnpm-workspace.yaml` or equivalent - Workspace definition
- `turbo.json` - Build orchestration config (if using Turbo)
- `tsconfig.json` - Base TypeScript configuration
- `.gitignore` - What to exclude
- `.env.example` - Environment variables template

#### Backend Package
- `package.json` - Backend dependencies
- `tsconfig.json` - Backend TypeScript config
- `[backend-framework].config.ts` - Framework-specific config (e.g., wrangler.toml for Cloudflare)
- `drizzle.config.ts` or equivalent - Database config

#### Frontend Package
- `package.json` - Frontend dependencies
- `vite.config.ts` or equivalent - Build tool config
- `tsconfig.json` - Frontend TypeScript config
- `tailwind.config.ts` or equivalent - Styling config

#### Shared Packages
- Individual `package.json` for each shared package
- Build configs (e.g., `tsup.config.ts`)

#### Module Package
- `package.json` - Module dependencies
- `module.config.ts` - Module metadata and configuration

**For each config file, provide:**
- Complete working example
- Explanation of key settings
- Environment-specific variations (dev/prod)
- How configs extend/inherit from each other

### 4. Module Registry System
Design a system for:

**Backend Module Registry:**
- How modules register their API routes
- Dynamic route mounting
- Module discovery endpoint
- Module enable/disable mechanism
- Module dependency resolution
- Health checks per module

**Frontend Module Registry:**
- How modules register their routes
- Dynamic navigation generation
- Module lazy loading
- Module-specific state management
- Inter-module communication

**Configuration:**
```typescript
// What should module.config.ts contain?
export const moduleConfig = {
  name: '',
  displayName: '',
  version: '',
  description: '',
  // What else?
};
```

**Please provide:**
- Complete registry implementation for backend
- Complete registry implementation for frontend
- How to register a new module
- How to handle module dependencies
- How to enable/disable modules at runtime
- Module lifecycle hooks (onLoad, onUnload, etc.)

### 5. Database Strategy
Define how to handle database concerns:

**Schema Organization:**
- Where do shared schemas live? (users, auth, etc.)
- Where do module-specific schemas live?
- How to handle cross-module foreign keys
- Naming conventions for tables

**Migrations:**
- Where do migrations live?
- How to run migrations for all modules
- How to run migrations for one module
- Migration naming and ordering strategy

**Seeding:**
- Where do seed files live?
- How to seed all modules
- How to seed one module
- Development vs production seed data

**ORM Configuration:**
```typescript
// How to setup ORM for modular structure?
// How to generate types?
// How to handle module-specific database clients?
```

**Please provide:**
- Complete schema organization strategy
- Migration management approach
- Seed data approach
- Code examples for schema definition
- Code examples for database client setup

### 6. API Layer & Data Fetching

**Backend API:**
- RESTful endpoint structure per module
- How to organize routes (nested vs flat)
- Request/response typing strategy
- Error handling patterns
- Middleware chaining
- CORS and security

**Frontend API Client:**
- How to create module-specific API clients
- How to share API client logic
- Type-safe API calls (using tRPC, Zodios, or manual typing)
- Error handling on frontend
- Loading states management
- Optimistic updates

**Please provide:**
- Example backend route implementation
- Example frontend API client
- Type sharing between backend/frontend
- Authentication flow (token management, refresh, etc.)
- Error handling examples
- Complete CRUD example for a resource

### 7. Authentication & Authorization

**Implementation:**
- Where does auth logic live? (shared/auth package?)
- How do modules check authentication?
- How to implement role-based access control (RBAC)
- How to implement permission-based access control
- Where do auth components live? (login, signup, etc.)

**Integration:**
- Auth middleware for backend
- Auth context for frontend
- Protected routes
- Module-level permissions
- Resource-level permissions

**Please provide:**
- Complete auth module structure
- Backend auth middleware implementation
- Frontend auth context/provider
- Protected route examples
- RBAC/permission checking examples

### 8. Shared Packages

**Shared Core Package:**
- What belongs here? (config, utils, constants, types)
- How to export from this package?
- How to version and publish internally?

**Shared UI Package:**
- How to organize components (atoms, molecules, organisms)?
- How to handle component variants and theming?
- How to build and publish the UI package?
- Component documentation strategy (Storybook?)

**Other Shared Packages:**
- When to create a new shared package?
- How to manage dependencies between shared packages?
- Build strategy for shared packages

**Please provide:**
- Structure for each shared package
- Build configuration for shared packages
- How to consume shared packages in modules
- Versioning strategy
- Development workflow (link, watch mode, etc.)

### 9. Development Workflow

**Daily Development:**
```bash
# How to start the entire application?
pnpm dev

# How to start only backend?
# How to start only frontend?
# How to start only one module?
# How to add a new module?
# How to remove a module?
```

**Code Generation:**
- Script to create new module
- Script to create new shared package
- Database migration generation
- Type generation from database schema

**Testing:**
- How to test a module in isolation?
- How to run all tests?
- How to test module integration?
- Testing shared packages

**Building:**
- How to build everything?
- How to build only changed packages?
- Build optimization strategies

**Please provide:**
- Complete npm/pnpm scripts for root package.json
- Complete scripts for backend package.json
- Complete scripts for frontend package.json
- Shell scripts for automation (create-module.sh, etc.)
- Development best practices

### 10. Migration Strategy

**Step-by-Step Migration Plan:**
Provide a phased approach to migrate from current structure to new structure without breaking existing functionality.

**Phase 1: Setup**
- [ ] What to do first?
- [ ] How to setup the monorepo structure?
- [ ] How to migrate package.json dependencies?

**Phase 2: Shared Packages**
- [ ] How to extract shared UI components?
- [ ] How to extract shared utilities?
- [ ] How to test shared packages work?

**Phase 3: Backend Separation**
- [ ] How to separate backend code?
- [ ] How to setup the backend orchestrator?
- [ ] How to migrate existing API routes?

**Phase 4: Frontend Shell**
- [ ] How to setup the frontend shell?
- [ ] How to migrate routing?
- [ ] How to integrate with new backend?

**Phase 5: Module Extraction**
- [ ] How to identify module boundaries?
- [ ] How to extract the first module?
- [ ] How to test the module works standalone?
- [ ] How to extract remaining modules?

**Phase 6: Integration & Testing**
- [ ] How to ensure all modules work together?
- [ ] How to test the entire system?
- [ ] Performance testing

**Phase 7: Deployment**
- [ ] How to deploy the new structure?
- [ ] CI/CD setup
- [ ] Rollback strategy

**For each phase, provide:**
- Detailed checklist
- Commands to run
- Code examples
- Gotchas and troubleshooting
- How to verify success

### 11. Inter-Module Communication

**Scenarios:**
1. Module A needs data from Module B
2. Module A wants to trigger action in Module B
3. Module A wants to extend Module B's UI
4. Shared state between modules

**Please provide:**
- Recommended patterns for each scenario
- Code examples for module-to-module communication
- Event system (if applicable)
- Shared state management between modules
- When to use tight coupling vs loose coupling

### 12. Deployment Strategy

**Backend Deployment:**
- How to deploy the backend? (single or multiple deployments)
- Environment variables management
- Database migration in production
- Module-specific deployment (can modules be deployed separately?)

**Frontend Deployment:**
- How to deploy the frontend?
- Environment variables
- Build optimization
- CDN configuration

**CI/CD:**
- GitHub Actions workflow (or equivalent)
- What triggers builds/deployments?
- How to deploy only changed modules?
- Testing in CI

**Please provide:**
- Complete deployment guide
- CI/CD workflow files
- Environment setup instructions
- Deployment scripts

### 13. Documentation Structure

**Project Documentation:**
- README.md - Project overview
- ARCHITECTURE.md - Architecture decisions
- CONTRIBUTING.md - How to contribute
- MODULE_GUIDE.md - How to create modules

**Module Documentation:**
- What should each module's README contain?
- API documentation strategy
- How to document inter-module dependencies?

**Please provide:**
- Template for each documentation file
- Documentation best practices
- Where docs should live

### 14. Code Examples

**Please provide complete, working code examples for:**

1. **A complete minimal module** including:
   - Backend routes
   - Frontend components
   - Database schema
   - Module config
   - Tests

2. **Module integration example** showing:
   - How Module A calls Module B's API
   - How Module A uses Module B's types
   - How to handle optional dependencies

3. **CRUD implementation** showing:
   - Backend service layer
   - Backend routes
   - Frontend API client
   - Frontend components (list, detail, create, edit)
   - Form validation
   - Error handling

4. **Authentication flow** showing:
   - Login/signup components
   - Backend auth routes
   - Auth middleware
   - Protected routes (backend & frontend)
   - Token refresh

### 15. Best Practices & Patterns

**Please provide guidance on:**

1. **Code Organization:**
   - File naming conventions
   - Folder naming conventions
   - Import/export patterns
   - Barrel exports vs direct imports

2. **Type Safety:**
   - Shared types strategy
   - API contract types
   - Database types
   - When to use `any` or `unknown`

3. **Error Handling:**
   - Backend error patterns
   - Frontend error boundaries
   - User-facing error messages
   - Error logging

4. **Performance:**
   - Code splitting strategies
   - Lazy loading modules
   - Bundle optimization
   - Database query optimization

5. **Security:**
   - Environment variables handling
   - API security best practices
   - XSS prevention
   - CSRF protection
   - Rate limiting

6. **Testing:**
   - Unit testing patterns
   - Integration testing patterns
   - E2E testing setup
   - Mocking strategies

### 16. Troubleshooting Guide

**Common Issues:**
- Module not found errors
- TypeScript path resolution issues
- Build failures
- Circular dependencies
- Database connection issues
- Auth token issues

**For each issue, provide:**
- Symptoms
- Root cause
- Solution
- How to prevent

## Output Format

Please provide your response in the following format:

### 1. Complete Folder Structure
[Detailed tree structure with explanations]

### 2. Module Template
[Complete module structure with all files]

### 3. Configuration Files
[All config files with explanations]

### 4. Registry Implementation
[Backend and frontend registry code]

### 5. Database Strategy
[Schema organization, migrations, seeding]

### 6. API & Data Fetching
[Complete examples]

### 7. Authentication
[Complete auth implementation]

### 8. Shared Packages
[Structure and implementation]

### 9. Development Workflow
[Scripts and commands]

### 10. Migration Plan
[Detailed step-by-step with commands]

### 11. Inter-Module Communication
[Patterns and examples]

### 12. Deployment
[Complete deployment guide]

### 13. Documentation Templates
[All documentation templates]

### 14. Code Examples
[Complete working examples]

### 15. Best Practices
[Guidelines and patterns]

### 16. Troubleshooting
[Common issues and solutions]

## Additional Notes

- Prioritize **simplicity** and **maintainability** over cleverness
- All code examples should be **production-ready**, not just POCs
- Assume I'm migrating a **real production application** with users
- Focus on **gradual migration** - I can't rewrite everything at once
- Provide **actual working code**, not pseudo-code or comments
- Include **TypeScript types** for everything
- Consider **performance** and **scalability** from the start
- Make it easy to **onboard new developers**

## Success Criteria

After following your guidance, I should have:
1. ✅ A well-organized modular monorepo
2. ✅ Separated backend and frontend with clear contracts
3. ✅ Self-contained modules that can work independently
4. ✅ Shared infrastructure packages
5. ✅ A module creation script to quickly scaffold new modules
6. ✅ Complete development workflow
7. ✅ Deployment strategy
8. ✅ Comprehensive documentation
9. ✅ All existing functionality preserved
10. ✅ Ability to scale to 20+ modules without issues

---

**Now, please provide a comprehensive, detailed response covering all sections above. Take your time to make it thorough, practical, and production-ready.**