# Addendum: Complete Implementation Guide with Examples

## Table of Contents
1. [Module Configuration System](#module-configuration-system)
2. [Service Layer Pattern](#service-layer-pattern)
3. [Environment-Driven Storage](#environment-driven-storage)
4. [Role-Based Access Control](#role-based-access-control)
5. [Module Management System](#module-management-system)
6. [Security Best Practices](#security-best-practices)
7. [Flat Architecture Principles](#flat-architecture-principles)
8. [Complete Code Examples](#complete-code-examples)

---

## 1. Module Configuration System

### Config-Driven Approach

#### `packages/shared/core/config/module.schema.ts`
```typescript
import { z } from 'zod';

// Module configuration schema
export const moduleConfigSchema = z.object({
  // Basic Info
  name: z.string(),
  displayName: z.string(),
  version: z.string(),
  description: z.string().optional(),
  
  // Metadata
  meta: z.object({
    icon: z.string(),
    color: z.string(),
    category: z.enum(['core', 'business', 'reporting', 'admin']),
    order: z.number().default(100),
  }),
  
  // API Configuration
  api: z.object({
    basePath: z.string(),
    version: z.string().default('v1'),
    rateLimit: z.object({
      enabled: z.boolean().default(true),
      maxRequests: z.number().default(100),
      windowMs: z.number().default(60000),
    }).optional(),
  }),
  
  // Frontend Configuration
  frontend: z.object({
    basePath: z.string(),
    navigation: z.object({
      label: z.string(),
      icon: z.string(),
      order: z.number(),
      showInSidebar: z.boolean().default(true),
    }),
    layout: z.enum(['full', 'sidebar', 'minimal']).default('sidebar'),
  }),
  
  // Dependencies
  dependencies: z.object({
    required: z.array(z.string()).default([]),
    optional: z.array(z.string()).default([]),
  }),
  
  // Permissions
  permissions: z.array(z.string()),
  
  // Database
  database: z.object({
    tables: z.array(z.string()),
    requiresMigration: z.boolean().default(true),
  }),
  
  // Storage
  storage: z.object({
    enabled: z.boolean().default(false),
    bucket: z.string().optional(),
    allowedTypes: z.array(z.string()).optional(),
    maxFileSize: z.number().optional(), // in bytes
  }).optional(),
  
  // Features
  features: z.record(z.boolean()).optional(),
  
  // Status
  enabled: z.boolean().default(true),
  beta: z.boolean().default(false),
});

export type ModuleConfig = z.infer<typeof moduleConfigSchema>;
```

#### Example Module Config: `packages/modules/inventory/module.config.ts`
```typescript
import { ModuleConfig } from '@shared/core/config/module.schema';

export const inventoryModuleConfig: ModuleConfig = {
  name: 'inventory',
  displayName: 'Inventory Management',
  version: '1.0.0',
  description: 'Manage products, stock levels, and warehouses',
  
  meta: {
    icon: '📦',
    color: '#10b981',
    category: 'business',
    order: 2,
  },
  
  api: {
    basePath: '/api/inventory',
    version: 'v1',
    rateLimit: {
      enabled: true,
      maxRequests: 200,
      windowMs: 60000,
    },
  },
  
  frontend: {
    basePath: '/inventory',
    navigation: {
      label: 'Inventory',
      icon: 'Package',
      order: 2,
      showInSidebar: true,
    },
    layout: 'sidebar',
  },
  
  dependencies: {
    required: ['auth'],
    optional: ['analytics'],
  },
  
  permissions: [
    'inventory:view',
    'inventory:create',
    'inventory:update',
    'inventory:delete',
    'inventory:export',
  ],
  
  database: {
    tables: ['products', 'stock_levels', 'warehouses', 'suppliers'],
    requiresMigration: true,
  },
  
  storage: {
    enabled: true,
    bucket: 'inventory-images',
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
  
  features: {
    barcode_scanning: true,
    low_stock_alerts: true,
    multi_warehouse: true,
    batch_operations: false,
  },
  
  enabled: true,
  beta: false,
};
```

---

## 2. Service Layer Pattern

### Base Service Class

#### `packages/shared/core/lib/base.service.ts`
```typescript
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';

export interface ServiceContext {
  db: DrizzleD1Database;
  userId?: string;
  userRole?: string;
  env: {
    R2?: R2Bucket;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    ENVIRONMENT: 'local' | 'production';
  };
}

export abstract class BaseService<T> {
  protected db: DrizzleD1Database;
  protected userId?: string;
  protected userRole?: string;
  protected env: ServiceContext['env'];
  
  constructor(protected ctx: ServiceContext) {
    this.db = ctx.db;
    this.userId = ctx.userId;
    this.userRole = ctx.userRole;
    this.env = ctx.env;
  }
  
  // Override these in child classes
  abstract getTable(): any;
  abstract getPermissionPrefix(): string;
  
  // Check permission
  protected checkPermission(action: string): void {
    if (!this.userId) {
      throw new Error('Unauthorized');
    }
    
    const permission = `${this.getPermissionPrefix()}:${action}`;
    // TODO: Implement actual permission check
    // This would check against user's roles and permissions
  }
  
  // Standard CRUD with permission checks
  async findAll(filters?: any) {
    this.checkPermission('view');
    return this.db.select().from(this.getTable());
  }
  
  async findById(id: string) {
    this.checkPermission('view');
    const results = await this.db
      .select()
      .from(this.getTable())
      .where(eq(this.getTable().id, id));
    return results[0] || null;
  }
  
  async create(data: Partial<T>) {
    this.checkPermission('create');
    
    const record = {
      id: crypto.randomUUID(),
      ...data,
      createdBy: this.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await this.db.insert(this.getTable()).values(record);
    return record;
  }
  
  async update(id: string, data: Partial<T>) {
    this.checkPermission('update');
    
    const updated = {
      ...data,
      updatedBy: this.userId,
      updatedAt: new Date(),
    };
    
    await this.db
      .update(this.getTable())
      .set(updated)
      .where(eq(this.getTable().id, id));
      
    return this.findById(id);
  }
  
  async delete(id: string) {
    this.checkPermission('delete');
    await this.db.delete(this.getTable()).where(eq(this.getTable().id, id));
  }
}
```

### Module-Specific Service

#### `packages/modules/inventory/backend/services/product.service.ts`
```typescript
import { BaseService } from '@shared/core/lib/base.service';
import { products } from '../../db/schema/products';
import { eq, like } from 'drizzle-orm';
import { StorageService } from '@shared/core/lib/storage.service';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stockLevel: number;
  imageUrl?: string;
  categoryId: string;
  supplierId?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductService extends BaseService<Product> {
  private storage: StorageService;
  
  constructor(ctx: ServiceContext) {
    super(ctx);
    this.storage = new StorageService(ctx);
  }
  
  getTable() {
    return products;
  }
  
  getPermissionPrefix() {
    return 'inventory';
  }
  
  // Custom method: Search products
  async search(query: string) {
    this.checkPermission('view');
    
    return this.db
      .select()
      .from(products)
      .where(like(products.name, `%${query}%`));
  }
  
  // Custom method: Low stock products
  async getLowStock(threshold = 10) {
    this.checkPermission('view');
    
    return this.db
      .select()
      .from(products)
      .where(eq(products.stockLevel, threshold)); // Use appropriate operator
  }
  
  // Create product with image upload
  async createWithImage(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, imageFile?: File) {
    this.checkPermission('create');
    
    let imageUrl: string | undefined;
    
    if (imageFile) {
      // Upload image based on environment
      imageUrl = await this.storage.uploadFile(
        imageFile,
        `products/${crypto.randomUUID()}-${imageFile.name}`
      );
    }
    
    return this.create({
      ...data,
      imageUrl,
    });
  }
  
  // Update stock level (special permission)
  async updateStock(id: string, newLevel: number) {
    // Could have separate permission for stock updates
    this.checkPermission('update');
    
    return this.update(id, { stockLevel: newLevel });
  }
  
  // Bulk operations
  async bulkUpdatePrices(updates: Array<{ id: string; price: number }>) {
    this.checkPermission('update');
    
    // Use transaction
    for (const { id, price } of updates) {
      await this.update(id, { price });
    }
  }
}
```

---

## 3. Environment-Driven Storage

### Storage Service (Local vs R2)

#### `packages/shared/core/lib/storage.service.ts`
```typescript
import { ServiceContext } from './base.service';
import * as fs from 'fs';
import * as path from 'path';

export class StorageService {
  private isLocal: boolean;
  private r2Bucket?: R2Bucket;
  private localUploadPath: string;
  
  constructor(private ctx: ServiceContext) {
    this.isLocal = ctx.env.ENVIRONMENT === 'local';
    this.r2Bucket = ctx.env.R2;
    this.localUploadPath = path.join(process.cwd(), 'uploads');
    
    // Ensure local upload directory exists
    if (this.isLocal) {
      try {
        if (!fs.existsSync(this.localUploadPath)) {
          fs.mkdirSync(this.localUploadPath, { recursive: true });
        }
      } catch (error) {
        console.error('Failed to create uploads directory:', error);
      }
    }
  }
  
  /**
   * Upload file - automatically uses local or R2 based on environment
   */
  async uploadFile(file: File | Buffer, key: string): Promise<string> {
    if (this.isLocal) {
      return this.uploadLocal(file, key);
    } else {
      return this.uploadR2(file, key);
    }
  }
  
  /**
   * Local storage - save to uploads/ folder
   */
  private async uploadLocal(file: File | Buffer, key: string): Promise<string> {
    const filePath = path.join(this.localUploadPath, key);
    const dirPath = path.dirname(filePath);
    
    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Write file
    if (file instanceof File) {
      const buffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(buffer));
    } else {
      fs.writeFileSync(filePath, file);
    }
    
    // Return local URL
    return `/uploads/${key}`;
  }
  
  /**
   * R2 storage - upload to Cloudflare R2
   */
  private async uploadR2(file: File | Buffer, key: string): Promise<string> {
    if (!this.r2Bucket) {
      throw new Error('R2 bucket not configured');
    }
    
    let buffer: ArrayBuffer;
    
    if (file instanceof File) {
      buffer = await file.arrayBuffer();
    } else {
      buffer = file.buffer;
    }
    
    await this.r2Bucket.put(key, buffer);
    
    // Return R2 public URL (configure your R2 public domain)
    const r2Domain = this.ctx.env.R2_PUBLIC_DOMAIN || 'your-r2-domain.com';
    return `https://${r2Domain}/${key}`;
  }
  
  /**
   * Delete file
   */
  async deleteFile(key: string): Promise<void> {
    if (this.isLocal) {
      const filePath = path.join(this.localUploadPath, key.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } else {
      if (!this.r2Bucket) {
        throw new Error('R2 bucket not configured');
      }
      await this.r2Bucket.delete(key);
    }
  }
  
  /**
   * Get file URL (handles both local and R2)
   */
  getFileUrl(key: string): string {
    if (this.isLocal) {
      return `/uploads/${key}`;
    } else {
      const r2Domain = this.ctx.env.R2_PUBLIC_DOMAIN || 'your-r2-domain.com';
      return `https://${r2Domain}/${key}`;
    }
  }
  
  /**
   * Check if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    if (this.isLocal) {
      const filePath = path.join(this.localUploadPath, key.replace('/uploads/', ''));
      return fs.existsSync(filePath);
    } else {
      if (!this.r2Bucket) return false;
      const object = await this.r2Bucket.head(key);
      return object !== null;
    }
  }
}
```

### Environment Configuration

#### `packages/backend/wrangler.toml`
```toml
name = "platform-backend"
main = "src/index.ts"
compatibility_date = "2024-01-01"

# D1 Database
[[d1_databases]]
binding = "DB"
database_name = "platform-db"
database_id = "your-database-id"

# R2 Storage (Production)
[[r2_buckets]]
binding = "R2"
bucket_name = "platform-storage"

[vars]
ENVIRONMENT = "production"
SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_ANON_KEY = "your-anon-key"
R2_PUBLIC_DOMAIN = "storage.yourplatform.com"

# Local development
[env.dev]
[env.dev.vars]
ENVIRONMENT = "local"
```

#### `.env.local` (for local development)
```bash
# Environment
ENVIRONMENT=local

# Database (local D1)
DATABASE_URL=http://localhost:8787

# Supabase Auth
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Storage (local)
STORAGE_TYPE=local
UPLOADS_PATH=./uploads

# Frontend
VITE_API_URL=http://localhost:8787
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 4. Role-Based Access Control (RBAC)

### Database Schema for RBAC

#### `packages/shared/auth/db/schema/rbac.ts`
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Roles
export const roles = sqliteTable('roles', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  displayName: text('display_name').notNull(),
  description: text('description'),
  level: integer('level').notNull(), // 1=super_admin, 2=admin, 3=manager, 4=user
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Permissions
export const permissions = sqliteTable('permissions', {
  id: text('id').primaryKey(),
  module: text('module').notNull(), // e.g., 'inventory'
  resource: text('resource').notNull(), // e.g., 'product'
  action: text('action').notNull(), // e.g., 'create', 'read', 'update', 'delete'
  description: text('description'),
});

// Role-Permission mapping
export const rolePermissions = sqliteTable('role_permissions', {
  roleId: text('role_id').notNull().references(() => roles.id),
  permissionId: text('permission_id').notNull().references(() => permissions.id),
});

// User-Role mapping
export const userRoles = sqliteTable('user_roles', {
  userId: text('user_id').notNull(),
  roleId: text('role_id').notNull().references(() => roles.id),
  assignedAt: integer('assigned_at', { mode: 'timestamp' }).notNull(),
  assignedBy: text('assigned_by'),
});
```

### Permission Checking Service

#### `packages/shared/auth/backend/services/permission.service.ts`
```typescript
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { eq, and } from 'drizzle-orm';
import { roles, permissions, rolePermissions, userRoles } from '../../db/schema/rbac';

export class PermissionService {
  constructor(private db: DrizzleD1Database) {}
  
  /**
   * Check if user has permission
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    // Parse permission string (e.g., 'inventory:product:create')
    const [module, resource, action] = permission.split(':');
    
    // Get user's roles
    const userRoleRecords = await this.db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId));
    
    if (userRoleRecords.length === 0) return false;
    
    // Get permissions for these roles
    for (const userRole of userRoleRecords) {
      const rolePerms = await this.db
        .select({ permission: permissions })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, userRole.roleId));
      
      // Check if any permission matches
      const hasMatch = rolePerms.some(rp => 
        rp.permission.module === module &&
        rp.permission.resource === resource &&
        rp.permission.action === action
      );
      
      if (hasMatch) return true;
    }
    
    return false;
  }
  
  /**
   * Check if user has role
   */
  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const userRoleRecords = await this.db
      .select({ role: roles })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));
    
    return userRoleRecords.some(ur => ur.role.name === roleName);
  }
  
  /**
   * Check if user has minimum role level
   */
  async hasMinimumRoleLevel(userId: string, minLevel: number): Promise<boolean> {
    const userRoleRecords = await this.db
      .select({ role: roles })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));
    
    return userRoleRecords.some(ur => ur.role.level <= minLevel);
  }
  
  /**
   * Get all user permissions
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const userRoleRecords = await this.db
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userId));
    
    const allPermissions: string[] = [];
    
    for (const userRole of userRoleRecords) {
      const rolePerms = await this.db
        .select({ permission: permissions })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, userRole.roleId));
      
      rolePerms.forEach(rp => {
        const permString = `${rp.permission.module}:${rp.permission.resource}:${rp.permission.action}`;
        if (!allPermissions.includes(permString)) {
          allPermissions.push(permString);
        }
      });
    }
    
    return allPermissions;
  }
}
```

### Role-Based Middleware

#### `packages/shared/auth/backend/middleware/rbac.ts`
```typescript
import { Context, Next } from 'hono';
import { PermissionService } from '../services/permission.service';
import { drizzle } from 'drizzle-orm/d1';

export interface RBACOptions {
  permission?: string;
  role?: string;
  minLevel?: number;
}

export function requirePermission(permission: string) {
  return async (c: Context, next: Next) => {
    const userId = c.get('userId');
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const db = drizzle(c.env.DB);
    const permService = new PermissionService(db);
    
    const hasPermission = await permService.hasPermission(userId, permission);
    
    if (!hasPermission) {
      return c.json({ error: 'Forbidden: Insufficient permissions' }, 403);
    }
    
    await next();
  };
}

export function requireRole(roleName: string) {
  return async (c: Context, next: Next) => {
    const userId = c.get('userId');
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const db = drizzle(c.env.DB);
    const permService = new PermissionService(db);
    
    const hasRole = await permService.hasRole(userId, roleName);
    
    if (!hasRole) {
      return c.json({ error: 'Forbidden: Role required' }, 403);
    }
    
    await next();
  };
}

export function requireMinLevel(minLevel: number) {
  return async (c: Context, next: Next) => {
    const userId = c.get('userId');
    
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const db = drizzle(c.env.DB);
    const permService = new PermissionService(db);
    
    const hasLevel = await permService.hasMinimumRoleLevel(userId, minLevel);
    
    if (!hasLevel) {
      return c.json({ error: 'Forbidden: Insufficient role level' }, 403);
    }
    
    await next();
  };
}
```

### Usage in Routes

#### `packages/modules/inventory/backend/routes/products.ts`
```typescript
import { Hono } from 'hono';
import { requirePermission, requireRole } from '@shared/auth/backend/middleware/rbac';
import { ProductService } from '../services/product.service';
import { drizzle } from 'drizzle-orm/d1';

const app = new Hono();

// Anyone with inventory:view permission can view
app.get('/', requirePermission('inventory:product:view'), async (c) => {
  const db = drizzle(c.env.DB);
  const service = new ProductService({
    db,
    userId: c.get('userId'),
    userRole: c.get('userRole'),
    env: c.env,
  });
  
  const products = await service.findAll();
  return c.json(products);
});

// Only users with create permission
app.post('/', requirePermission('inventory:product:create'), async (c) => {
  const db = drizzle(c.env.DB);
  const service = new ProductService({
    db,
    userId: c.get('userId'),
    userRole: c.get('userRole'),
    env: c.env,
  });
  
  const body = await c.req.json();
  const product = await service.create(body);
  return c.json(product, 201);
});

// Only managers or above (level <= 3)
app.delete('/:id', requireMinLevel(3), async (c) => {
  const db = drizzle(c.env.DB);
  const service = new ProductService({
    db,
    userId: c.get('userId'),
    userRole: c.get('userRole'),
    env: c.env,
  });
  
  const id = c.req.param('id');
  await service.delete(id);
  return c.json({ success: true });
});

export default app;
```

---

## 5. Module Management System

### Module Registry with Dynamic Loading

#### `packages/backend/src/modules/registry.ts`
```typescript
import { Hono } from 'hono';
import { ModuleConfig } from '@shared/core/config/module.schema';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';

export interface RegisteredModule {
  config: ModuleConfig;
  router: Hono;
  loaded: boolean;
  error?: string;
}

export class ModuleRegistry {
  private modules: Map<string, RegisteredModule> = new Map();
  
  /**
   * Register a module
   */
  register(config: ModuleConfig, router: Hono): void {
    if (this.modules.has(config.name)) {
      throw new Error(`Module ${config.name} already registered`);
    }
    
    // Validate dependencies
    for (const dep of config.dependencies.required) {
      if (!this.modules.has(dep)) {
        throw new Error(`Required dependency ${dep} not found for module ${config.name}`);
      }
    }
    
    this.modules.set(config.name, {
      config,
      router,
      loaded: true,
    });
    
    console.log(`✅ Module registered: ${config.displayName} (${config.name})`);
  }
  
  /**
   * Get module by name
   */
  get(name: string): RegisteredModule | undefined {
    return this.modules.get(name);
  }
  
  /**
   * Get all modules
   */
  getAll(): RegisteredModule[] {
    return Array.from(this.modules.values());
  }
  
  /**
   * Get enabled modules
   */
  getEnabled(): RegisteredModule[] {
    return this.getAll().filter(m => m.config.enabled && m.loaded);
  }
  
  /**
   * Get modules by category
   */
  getByCategory(category: string): RegisteredModule[] {
    return this.getAll().filter(m => m.config.meta.category === category);
  }
  
  /**
   * Check if module exists and is enabled
   */
  isEnabled(name: string): boolean {
    const module = this.get(name);
    return module?.config.enabled && module.loaded || false;
  }
  
  /**
   * Enable/disable module at runtime (if stored in DB)
   */
  async toggleModule(name: string, enabled: boolean, db: DrizzleD1Database): Promise<void> {
    const module = this.get(name);
    if (!module) {
      throw new Error(`Module ${name} not found`);
    }
    
    module.config.enabled = enabled;
    
    // Optionally persist to database
    // await db.update(moduleSettings).set({ enabled }).where(eq(moduleSettings.name, name));
    
    console.log(`Module ${name} ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Get module metadata for frontend
   */
  getModuleMetadata() {
    return this.getEnabled().map(m => ({
      name: m.config.name,
      displayName: m.config.displayName,
      version: m.config.version,
      description: m.config.description,
      meta: m.config.meta,
      api: {
        basePath: m.config.api.basePath,
      },
      frontend: m.config.frontend,
      permissions: m.config.permissions,
      beta: m.config.beta,
    }));
  }
}

// Global registry instance
export const registry = new ModuleRegistry();
```

### Module Loader

#### `packages/backend/src/modules/loader.ts`
```typescript
import { registry } from './registry';
import { ModuleConfig } from '@shared/core/config/module.schema';
import { Hono } from 'hono';

interface ModuleExport {
  config: ModuleConfig;
  router: Hono;
}

/**
 * Dynamically load all modules
 */
export async function loadModules() {
  console.log('🔄 Loading modules...');
  
  // Import all module configs and routers
  const modules: ModuleExport[] = [
    // Manually import each module
    // Note: Vite/esbuild don't support true dynamic imports for bundling
  ];
  
  // Sort by order
  modules.sort((a, b) => a.config.meta.order - b.config.meta.order);
  
  // Register each module
  for (const module of modules) {
    try {
      registry.register(module.config, module.router);
    } catch (error) {
      console.error(`❌ Failed to load module ${module.config.name}:`, error);
    }
  }
  
  console.log(`✅ Loaded ${registry.getEnabled().length} modules`);
}
```

### Script to Create New Module

#### `scripts/create-module.sh`
```bash
#!/bin/bash

set -e

MODULE_NAME=$1

if [ -z "$MODULE_NAME" ]; then
  echo "Usage: ./scripts/create-module.sh <module-name>"
  echo "Example: ./scripts/create-module.sh inventory"
  exit 1
fi

MODULE_PATH="packages/modules/$MODULE_NAME"

echo "🚀 Creating module: $MODULE_NAME"
echo "📁 Path: $MODULE_PATH"

# Create directory structure
mkdir -p "$MODULE_PATH"/{backend/{routes,services,middleware},frontend/{routes,components,hooks,api},db/{schema,migrations},shared/{types,constants},tests/{unit,integration}}

# Create backend index
cat > "$MODULE_PATH/backend/index.ts" << EOF
import { Hono } from 'hono';
import routes from './routes';
import { ${MODULE_NAME}ModuleConfig } from '../module.config';

const router = new Hono();

// Mount routes
router.route('/', routes);

// Health check
router.get('/health', (c) => c.json({ 
  module: '${MODULE_NAME}',
  status: 'healthy' 
}));

export { ${MODULE_NAME}ModuleConfig as config, router };
EOF

# Create backend routes
cat > "$MODULE_PATH/backend/routes/index.ts" << EOF
import { Hono } from 'hono';
import { requirePermission } from '@shared/auth/backend/middleware/rbac';

const app = new Hono();

// GET /${MODULE_NAME}
app.get('/', requirePermission('${MODULE_NAME}:view'), async (c) => {
  // TODO: Implement list logic
  return c.json({ message: 'List ${MODULE_NAME}' });
});

// GET /${MODULE_NAME}/:id
app.get('/:id', requirePermission('${MODULE_NAME}:view'), async (c) => {
  const id = c.req.param('id');
  // TODO: Implement get by ID logic
  return c.json({ message: \`Get ${MODULE_NAME} \${id}\` });
});

// POST /${MODULE_NAME}
app.post('/', requirePermission('${MODULE_NAME}:create'), async (c) => {
  const body = await c.req.json();
  // TODO: Implement create logic
  return c.json({ message: 'Create ${MODULE_NAME}', data: body }, 201);
});

// PUT /${MODULE_NAME}/:id
app.put('/:id', requirePermission('${MODULE_NAME}:update'), async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  // TODO: Implement update logic
  return c.json({ message: \`Update ${MODULE_NAME} \${id}\`, data: body });
});

// DELETE /${MODULE_NAME}/:id
app.delete('/:id', requirePermission('${MODULE_NAME}:delete'), async (c) => {
  const id = c.req.param('id');
  // TODO: Implement delete logic
  return c.json({ message: \`Delete ${MODULE_NAME} \${id}\` });
});

export default app;
EOF

# Create service
cat > "$MODULE_PATH/backend/services/${MODULE_NAME}.service.ts" << EOF
import { BaseService } from '@shared/core/lib/base.service';
import { ${MODULE_NAME} } from '../../db/schema/${MODULE_NAME}';

export class ${MODULE_NAME^}Service extends BaseService<any> {
  getTable() {
    return ${MODULE_NAME};
  }
  
  getPermissionPrefix() {
    return '${MODULE_NAME}';
  }
  
  // Add custom methods here
}
EOF

# Create database schema
cat > "$MODULE_PATH/db/schema/${MODULE_NAME}.ts" << EOF
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const ${MODULE_NAME} = sqliteTable('${MODULE_NAME}', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdBy: text('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export type ${MODULE_NAME^} = typeof ${MODULE_NAME}.\$inferSelect;
export type New${MODULE_NAME^} = typeof ${MODULE_NAME}.\$inferInsert;
EOF

# Create module config
cat > "$MODULE_PATH/module.config.ts" << EOF
import { ModuleConfig } from '@shared/core/config/module.schema';

export const ${MODULE_NAME}ModuleConfig: ModuleConfig = {
  name: '${MODULE_NAME}',
  displayName: '${MODULE_NAME^}',
  version: '1.0.0',
  description: 'Manage ${MODULE_NAME}',
  
  meta: {
    icon: '📦',
    color: '#3b82f6',
    category: 'business',
    order: 100,
  },
  
  api: {
    basePath: '/api/${MODULE_NAME}',
    version: 'v1',
    rateLimit: {
      enabled: true,
      maxRequests: 100,
      windowMs: 60000,
    },
  },
  
  frontend: {
    basePath: '/${MODULE_NAME}',
    navigation: {
      label: '${MODULE_NAME^}',
      icon: 'Package',
      order: 100,
      showInSidebar: true,
    },
    layout: 'sidebar',
  },
  
  dependencies: {
    required: ['auth'],
    optional: [],
  },
  
  permissions: [
    '${MODULE_NAME}:view',
    '${MODULE_NAME}:create',
    '${MODULE_NAME}:update',
    '${MODULE_NAME}:delete',
  ],
  
  database: {
    tables: ['${MODULE_NAME}'],
    requiresMigration: true,
  },
  
  storage: {
    enabled: false,
  },
  
  features: {},
  
  enabled: true,
  beta: false,
};
EOF

# Create frontend routes
cat > "$MODULE_PATH/frontend/routes/index.tsx" << EOF
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { ${MODULE_NAME}Api } from '../api/client';

export const Route = createFileRoute('/${MODULE_NAME}/')({
  component: ${MODULE_NAME^}Page,
});

function ${MODULE_NAME^}Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['${MODULE_NAME}'],
    queryFn: ${MODULE_NAME}Api.getAll,
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">${MODULE_NAME^}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
EOF

# Create API client
cat > "$MODULE_PATH/frontend/api/client.ts" << EOF
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';
const BASE_PATH = '/api/${MODULE_NAME}';

export const ${MODULE_NAME}Api = {
  getAll: async () => {
    const res = await fetch(\`\${API_URL}\${BASE_PATH}\`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },
  
  getById: async (id: string) => {
    const res = await fetch(\`\${API_URL}\${BASE_PATH}/\${id}\`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },
  
  create: async (data: any) => {
    const res = await fetch(\`\${API_URL}\${BASE_PATH}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
  },
  
  update: async (id: string, data: any) => {
    const res = await fetch(\`\${API_URL}\${BASE_PATH}/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
  },
  
  delete: async (id: string) => {
    const res = await fetch(\`\${API_URL}\${BASE_PATH}/\${id}\`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete');
    return res.json();
  },
};
EOF

# Create types
cat > "$MODULE_PATH/shared/types/index.ts" << EOF
export interface ${MODULE_NAME^} {
  id: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
EOF

# Create package.json
cat > "$MODULE_PATH/package.json" << EOF
{
  "name": "@modules/${MODULE_NAME}",
  "version": "1.0.0",
  "private": true,
  "main": "./backend/index.ts"
}
EOF

# Create README
cat > "$MODULE_PATH/README.md" << EOF
# ${MODULE_NAME^} Module

## Description
[Add description]

## Features
- Feature 1
- Feature 2

## API Endpoints
- GET /api/${MODULE_NAME} - List all
- GET /api/${MODULE_NAME}/:id - Get by ID
- POST /api/${MODULE_NAME} - Create new
- PUT /api/${MODULE_NAME}/:id - Update
- DELETE /api/${MODULE_NAME}/:id - Delete

## Permissions
- \`${MODULE_NAME}:view\` - View ${MODULE_NAME}
- \`${MODULE_NAME}:create\` - Create ${MODULE_NAME}
- \`${MODULE_NAME}:update\` - Update ${MODULE_NAME}
- \`${MODULE_NAME}:delete\` - Delete ${MODULE_NAME}

## Database Schema
See \`db/schema/${MODULE_NAME}.ts\`

## Development
\`\`\`bash
# Generate migrations
cd ../../backend
pnpm db:generate

# Run migrations
pnpm db:migrate
\`\`\`
EOF

echo ""
echo "✅ Module '${MODULE_NAME}' created successfully!"
echo ""
echo "Next steps:"
echo "1. Update the database schema in: db/schema/${MODULE_NAME}.ts"
echo "2. Generate migration: cd packages/backend && pnpm db:generate"
echo "3. Implement service logic in: backend/services/${MODULE_NAME}.service.ts"
echo "4. Build frontend components in: frontend/components/"
echo "5. Register module in: packages/backend/src/modules/loader.ts"
echo ""
echo "To register, add to loader.ts:"
echo "  import * as ${MODULE_NAME}Module from '@modules/${MODULE_NAME}/backend';"
echo "  modules.push(${MODULE_NAME}Module);"
echo ""
chmod +x "$0"
```

---

## 6. Security Best Practices

### Authentication Middleware

#### `packages/shared/auth/backend/middleware/auth.ts`
```typescript
import { Context, Next } from 'hono';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { users } from '../../db/schema/users';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authorization header' }, 401);
  }
  
  const token = authHeader.substring(7);
  
  try {
    // Verify token with Supabase
    const supabase = createClient(
      c.env.SUPABASE_URL,
      c.env.SUPABASE_ANON_KEY
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }
    
    // Get user details from database
    const db = drizzle(c.env.DB);
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    
    if (!dbUser[0]) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Set user context
    c.set('userId', user.id);
    c.set('userEmail', user.email);
    c.set('user', dbUser[0]);
    
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
}

// Optional auth - doesn't fail if no token
export async function optionalAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      const supabase = createClient(
        c.env.SUPABASE_URL,
        c.env.SUPABASE_ANON_KEY
      );
      
      const { data: { user } } = await supabase.auth.getUser(token);
      
      if (user) {
        c.set('userId', user.id);
        c.set('userEmail', user.email);
      }
    } catch (error) {
      // Silently fail - auth is optional
    }
  }
  
  await next();
}
```

### Input Validation with Zod

#### `packages/modules/inventory/backend/validators/product.validator.ts`
```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  sku: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  price: z.number().positive(),
  stockLevel: z.number().int().min(0),
  categoryId: z.string().uuid(),
  supplierId: z.string().uuid().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productFilterSchema = z.object({
  categoryId: z.string().uuid().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  search: z.string().optional(),
});
```

### Validation Middleware

#### `packages/shared/core/middleware/validate.ts`
```typescript
import { Context, Next } from 'hono';
import { z } from 'zod';

export function validateBody(schema: z.ZodSchema) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validated = schema.parse(body);
      c.set('validatedBody', validated);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ 
          error: 'Validation failed',
          details: error.errors 
        }, 400);
      }
      return c.json({ error: 'Invalid request body' }, 400);
    }
  };
}

export function validateQuery(schema: z.ZodSchema) {
  return async (c: Context, next: Next) => {
    try {
      const query = c.req.query();
      const validated = schema.parse(query);
      c.set('validatedQuery', validated);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ 
          error: 'Validation failed',
          details: error.errors 
        }, 400);
      }
      return c.json({ error: 'Invalid query parameters' }, 400);
    }
  };
}
```

### Rate Limiting

#### `packages/shared/core/middleware/rate-limit.ts`
```typescript
import { Context, Next } from 'hono';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Simple in-memory rate limiting (use external store for production)
const requests = new Map<string, number[]>();

export function rateLimit(config: RateLimitConfig) {
  return async (c: Context, next: Next) => {
    const identifier = c.get('userId') || c.req.header('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    
    // Get existing requests
    const userRequests = requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(
      time => now - time < config.windowMs
    );
    
    // Check limit
    if (recentRequests.length >= config.maxRequests) {
      return c.json({ 
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((recentRequests[0] + config.windowMs - now) / 1000)
      }, 429);
    }
    
    // Add current request
    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    
    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      for (const [key, times] of requests.entries()) {
        const valid = times.filter(t => now - t < config.windowMs);
        if (valid.length === 0) {
          requests.delete(key);
        } else {
          requests.set(key, valid);
        }
      }
    }
    
    await next();
  };
}
```

### CORS Configuration

#### `packages/backend/src/middleware/cors.ts`
```typescript
import { cors } from 'hono/cors';

export const corsConfig = cors({
  origin: (origin) => {
    // Allow specific origins
    const allowedOrigins = [
      'http://localhost:5173', // Local dev
      'https://yourapp.com',
      'https://www.yourapp.com',
    ];
    
    return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
});
```

---

## 7. Flat Architecture Principles

### Flat Structure Guidelines

```
✅ GOOD - Flat structure (max 3 levels)
packages/modules/inventory/
├── backend/
│   ├── routes.ts              (all routes in one file)
│   ├── service.ts             (all service logic)
│   └── validators.ts          (all validators)
├── frontend/
│   ├── index.tsx              (main page)
│   ├── components.tsx         (all components)
│   └── api.ts                 (API client)
├── db/
│   └── schema.ts              (all tables)
└── module.config.ts

❌ BAD - Over-nested (5+ levels)
packages/modules/inventory/
├── backend/
│   ├── routes/
│   │   ├── products/
│   │   │   ├── list.ts
│   │   │   ├── create.ts
│   │   │   ├── update.ts
│   │   │   └── delete.ts
│   │   └── categories/
│   │       └── ...
│   └── services/
│       ├── products/
│       │   ├── create.service.ts
│       │   └── ...
```

### Single-File Approach for Small Modules

#### `packages/modules/simple-module/backend/index.ts`
```typescript
import { Hono } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { ModuleConfig } from '@shared/core/config/module.schema';

// ========== CONFIG ==========
export const config: ModuleConfig = {
  name: 'simple',
  displayName: 'Simple Module',
  version: '1.0.0',
  meta: { icon: '📝', color: '#3b82f6', category: 'core', order: 1 },
  api: { basePath: '/api/simple', version: 'v1' },
  frontend: { 
    basePath: '/simple',
    navigation: { label: 'Simple', icon: 'FileText', order: 1, showInSidebar: true },
    layout: 'sidebar',
  },
  dependencies: { required: ['auth'], optional: [] },
  permissions: ['simple:view', 'simple:create'],
  database: { tables: ['items'], requiresMigration: true },
  enabled: true,
  beta: false,
};

// ========== SCHEMA ==========
export const items = sqliteTable('items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull(),
});

// ========== VALIDATORS ==========
const createItemSchema = z.object({
  name: z.string().min(1).max(255),
});

// ========== SERVICE ==========
class ItemService {
  constructor(private db: ReturnType<typeof drizzle>) {}
  
  async getAll() {
    return this.db.select().from(items);
  }
  
  async create(name: string) {
    const item = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
    };
    await this.db.insert(items).values(item);
    return item;
  }
}

// ========== ROUTES ==========
export const router = new Hono();

router.get('/', async (c) => {
  const db = drizzle(c.env.DB);
  const service = new ItemService(db);
  const items = await service.getAll();
  return c.json(items);
});

router.post('/', async (c) => {
  const body = await c.req.json();
  const { name } = createItemSchema.parse(body);
  
  const db = drizzle(c.env.DB);
  const service = new ItemService(db);
  const item = await service.create(name);
  
  return c.json(item, 201);
});
```

---
