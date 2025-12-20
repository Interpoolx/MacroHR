# ✅ RECOMMENDED: OPTION A - Full Migration

**Clear, step-by-step guide with exact commands**

---

## 📁 REVISED STRUCTURE (Target State)

### BEFORE (Current - Problematic)
```
MacroHR/
├── package.json (root workspace config)
├── pnpm-workspace.yaml
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   └── storage.ts          ❌ imports @shared/config/site (React!)
│   ├── package.json
│   └── tsconfig.json
├── web/
│   ├── src/
│   │   ├── routes/             (50+ files importing @shared)
│   │   ├── components/         (importing @shared UI)
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── shared/                      ❌ MIXED CONTENT!
    ├── components/
    │   └── ui/                  ❌ React components (20+ files)
    ├── config/
    │   ├── site.ts              ❌ React-dependent
    │   ├── modules.ts           ❌ React-dependent
    │   ├── SiteConfigContext.tsx ❌ React Context
    │   ├── SiteConfigFromDB.tsx  ❌ React hook
    │   └── env.ts               ✅ OK
    ├── lib/
    │   ├── supabase.ts          ✅ OK
    │   ├── themes.ts            ✅ OK
    │   └── utils.ts             ✅ OK
    ├── types/
    │   └── index.ts             ✅ OK
    └── tsconfig.json            ✅ OK
```

### AFTER (Clean - Industry Standard)
```
MacroHR/
├── package.json
├── pnpm-workspace.yaml
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   └── storage.ts          ✅ imports only @shared/types
│   ├── package.json
│   └── tsconfig.json           ✅ updated paths
├── web/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/             ✅ MOVED HERE (20+ files)
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── dialog.tsx
│   │   │       └── ... (all UI components)
│   │   ├── config/             ✅ NEW FOLDER
│   │   │   ├── site.ts         ✅ MOVED HERE
│   │   │   ├── modules.ts      ✅ MOVED HERE
│   │   │   ├── SiteConfigContext.tsx ✅ MOVED HERE
│   │   │   ├── SiteConfigFromDB.tsx  ✅ MOVED HERE
│   │   │   └── index.ts        ✅ NEW (barrel export)
│   │   ├── routes/
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts          ✅ add @/config alias
│   └── tsconfig.json           ✅ add @/config path
└── shared/                      ✅ CLEAN (No React!)
    ├── config/
    │   ├── env.ts              ✅ KEEP
    │   └── index.ts            ✅ updated
    ├── lib/
    │   ├── supabase.ts         ✅ KEEP
    │   ├── themes.ts           ✅ KEEP
    │   ├── utils.ts            ✅ KEEP
    │   └── index.ts            ✅ NEW (barrel export)
    ├── types/
    │   └── index.ts            ✅ KEEP
    ├── package.json            ✅ NEW
    └── tsconfig.json           ✅ KEEP
```

---

## 🚀 MIGRATION STEPS (Exact Commands)

### **PHASE 1: Backup & Prepare** (2 minutes)

```bash
# 1. Commit current work
git add -A
git commit -m "checkpoint: before monorepo restructure"

# 2. Create feature branch
git checkout -b feature/monorepo-restructure

# 3. Verify current state
npm run typecheck
# Should pass (baseline)
```

---

### **PHASE 2: Create shared/package.json** (2 minutes)

```bash
# Navigate to shared folder
cd shared

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@macrohr/shared",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "exports": {
    "./types": "./types/index.ts",
    "./lib": "./lib/index.ts",
    "./config": "./config/index.ts"
  }
}
EOF

# Go back to root
cd ..
```

---

### **PHASE 3: Create New Folders in Web** (1 minute)

```bash
# Create web/src/config directory
mkdir -p web/src/config

# Create web/src/components/ui directory (if doesn't exist)
mkdir -p web/src/components/ui
```

---

### **PHASE 4: Move Files to Web** (5 minutes)

```bash
# Move config files from shared to web
cp shared/config/SiteConfigContext.tsx web/src/config/
cp shared/config/SiteConfigFromDB.tsx web/src/config/
cp shared/config/site.ts web/src/config/
cp shared/config/modules.ts web/src/config/

# Move UI components from shared to web
cp -r shared/components/ui/* web/src/components/ui/

# Verify files were copied
ls web/src/config/
# Should show: SiteConfigContext.tsx, SiteConfigFromDB.tsx, site.ts, modules.ts

ls web/src/components/ui/ | head -5
# Should show: button.tsx, card.tsx, dialog.tsx, etc.
```

---

### **PHASE 5: Fix Import Paths in Moved Files** (10 minutes)

#### 5.1 Fix `web/src/config/site.ts`

```bash
# Open web/src/config/site.ts
# Find lines 3-5 (imports)
```

**BEFORE:**
```typescript
import { getCurrentModule, type ModuleName, type ModuleConfig } from "./modules";
import { defaultTheme, type ThemeName } from "../lib/themes";
import { getEnv } from "./env";
```

**AFTER:**
```typescript
import { getCurrentModule, type ModuleName, type ModuleConfig } from "./modules";
import { defaultTheme, type ThemeName } from "@shared/lib/themes";
import { getEnv } from "@shared/config/env";
```

#### 5.2 Fix `web/src/config/SiteConfigContext.tsx`

Check if it imports from shared. If yes, update to:
```typescript
// If it imports supabase:
import { supabase } from "@shared/lib/supabase";
```

#### 5.3 Fix `web/src/config/SiteConfigFromDB.tsx`

```typescript
// Update any shared imports:
import { supabase } from "@shared/lib/supabase";
import type { User } from "@shared/types";
```

#### 5.4 Create barrel export `web/src/config/index.ts`

```bash
cat > web/src/config/index.ts << 'EOF'
export { siteConfig, currentModule, currentTheme } from './site';
export { SiteConfigProvider, useSiteConfig } from './SiteConfigContext';
export { useSiteConfig as useSiteConfigFromDB } from './SiteConfigFromDB';
export { modules } from './modules';
export type { ModuleName, ModuleConfig } from './modules';
EOF
```

---

### **PHASE 6: Update Web Config Files** (5 minutes)

#### 6.1 Update `web/tsconfig.json`

```bash
# Open web/tsconfig.json
```

**ADD this to the paths section:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/*"],
      "@config": ["./src/config"]
    }
  }
}
```

#### 6.2 Update `web/vite.config.ts`

```bash
# Open web/vite.config.ts
# Find the resolve.alias section (around line 30)
```

**ADD this alias:**
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@config': path.resolve(__dirname, './src/config'),
    }
  }
})
```

---

### **PHASE 7: Update Web Imports** (15 minutes)

#### 7.1 Update imports for config files

```bash
# Navigate to web directory
cd web

# Update SiteConfigContext imports
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  "s|from '@shared/config/SiteConfigContext'|from '@config/SiteConfigContext'|g" {} +

find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  "s|from \"@shared/config/SiteConfigContext\"|from \"@config/SiteConfigContext\"|g" {} +

# Update SiteConfigFromDB imports
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  "s|from '@shared/config/SiteConfigFromDB'|from '@config/SiteConfigFromDB'|g" {} +

find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  "s|from \"@shared/config/SiteConfigFromDB\"|from \"@config/SiteConfigFromDB\"|g" {} +

# Update site.ts imports
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  "s|from '@shared/config/site'|from '@config/site'|g" {} +

find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  "s|from \"@shared/config/site\"|from \"@config/site\"|g" {} +

# Update modules.ts imports
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  "s|from '@shared/config/modules'|from '@config/modules'|g" {} +

find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  "s|from \"@shared/config/modules\"|from \"@config/modules\"|g" {} +

# Go back to root
cd ..
```

#### 7.2 Update UI component imports

**IMPORTANT:** UI components can stay as `@shared/components/ui/*` for now since we're keeping them temporarily. We'll update later.

**OR** update them now to use relative paths:

```bash
cd web

# Update button imports
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  "s|from '@shared/components/ui/button'|from '@/components/ui/button'|g" {} +

find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
  "s|from \"@shared/components/ui/button\"|from \"@/components/ui/button\"|g" {} +

# Repeat for other components (card, dialog, etc.)
# Or use a loop:

for component in button card dialog avatar badge tabs input label select switch textarea separator table checkbox dropdown-menu progress skeleton alert-dialog; do
  find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
    "s|from '@shared/components/ui/$component'|from '@/components/ui/$component'|g" {} +
  find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i \
    "s|from \"@shared/components/ui/$component\"|from \"@/components/ui/$component\"|g" {} +
done

cd ..
```

---

### **PHASE 8: Update Backend** (3 minutes)

#### 8.1 Fix `backend/src/storage.ts`

```bash
# Open backend/src/storage.ts
```

**BEFORE:**
```typescript
import { Context } from 'hono';
import { User, Member, Document } from '@shared/types';
import { siteConfig } from '@shared/config/site';  // ❌ REMOVE THIS
```

**AFTER:**
```typescript
import { Context } from 'hono';
import { User, Member, Document } from '@shared/types';
// Remove siteConfig import

// If you need config, hardcode it or create minimal config:
const config = {
  database: {
    provider: 'd1' as const
  }
};
```

#### 8.2 Update `backend/tsconfig.json`

```bash
# Open backend/tsconfig.json
```

**UPDATE paths section:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@shared/types": ["../shared/types"],
      "@shared/lib": ["../shared/lib"],
      "@shared/config": ["../shared/config"]
    }
  }
}
```

---

### **PHASE 9: Clean Up Shared Folder** (3 minutes)

```bash
# Remove React-only files from shared (NOW that everything is moved)

# Remove UI components
rm -rf shared/components/ui
rm -rf shared/components  # if empty

# Remove React config files
rm shared/config/SiteConfigContext.tsx
rm shared/config/SiteConfigFromDB.tsx
rm shared/config/site.ts
rm shared/config/modules.ts

# Remove hooks folder (if exists and empty)
rm -rf shared/hooks

# Verify what's left in shared
ls -la shared/
# Should show: config/ (with env.ts only), lib/, types/, package.json, tsconfig.json
```

#### 9.1 Update `shared/config/index.ts`

```bash
cat > shared/config/index.ts << 'EOF'
export * from './env';
EOF
```

#### 9.2 Create `shared/lib/index.ts`

```bash
cat > shared/lib/index.ts << 'EOF'
export * from './supabase';
export * from './themes';
export * from './utils';
EOF
```

---

### **PHASE 10: Test Everything** (10 minutes)

```bash
# 1. Type checking
npm run typecheck
# Should pass with NO errors

# 2. Lint
npm run lint
# Fix any issues

# 3. Build
npm run build
# Should succeed

# 4. Run dev server
npm run dev
# Open http://localhost:3000
# Test navigation, check console for errors

# 5. Test backend
npm run dev:back
# Should start without errors
```

---

### **PHASE 11: Final Verification** (5 minutes)

```bash
# Check for any remaining @shared/config imports
grep -r "@shared/config/site" web/src
grep -r "@shared/config/modules" web/src
grep -r "@shared/config/SiteConfigContext" web/src
grep -r "@shared/config/SiteConfigFromDB" web/src
# Should return NOTHING

# Check backend doesn't import React
grep -r "@shared/config/site" backend/src
# Should return NOTHING

# Verify shared folder is clean
ls shared/
# Should show: config/ lib/ types/ package.json tsconfig.json

ls shared/config/
# Should show: env.ts index.ts (NO React files)
```

---

### **PHASE 12: Commit Changes** (2 minutes)

```bash
# Add all changes
git add -A

# Commit
git commit -m "refactor: separate React code from shared utilities

- Move UI components to web/src/components/ui/
- Move React config to web/src/config/
- Keep only pure utilities in shared/
- Update all import paths
- Remove React dependencies from backend
- Add shared/package.json for proper workspace setup

Follows monorepo best practices (Babel/Meta pattern)
Zero breaking changes - all functionality preserved"

# Push to remote
git push origin feature/monorepo-restructure
```

---

## 📊 Summary of Changes

| File/Folder | Action | Reason |
|------------|--------|--------|
| `shared/package.json` | ✅ CREATE | Proper workspace |
| `shared/config/index.ts` | ✅ UPDATE | Remove React exports |
| `shared/lib/index.ts` | ✅ CREATE | Barrel export |
| `shared/components/` | ❌ DELETE | Moved to web |
| `shared/config/site.ts` | ❌ DELETE | Moved to web |
| `shared/config/modules.ts` | ❌ DELETE | Moved to web |
| `shared/config/SiteConfigContext.tsx` | ❌ DELETE | Moved to web |
| `shared/config/SiteConfigFromDB.tsx` | ❌ DELETE | Moved to web |
| `web/src/config/` | ✅ CREATE | React config |
| `web/src/components/ui/` | ✅ CREATE | UI components |
| `web/tsconfig.json` | ✅ UPDATE | Add @config path |
| `web/vite.config.ts` | ✅ UPDATE | Add @config alias |
| `backend/src/storage.ts` | ✅ UPDATE | Remove React import |
| `backend/tsconfig.json` | ✅ UPDATE | Clean paths |

---

## ⏱️ Time Estimate

| Phase | Time |
|-------|------|
| 1. Backup | 2 min |
| 2. Create package.json | 2 min |
| 3. Create folders | 1 min |
| 4. Move files | 5 min |
| 5. Fix imports in moved files | 10 min |
| 6. Update web config | 5 min |
| 7. Update web imports | 15 min |
| 8. Update backend | 3 min |
| 9. Clean up shared | 3 min |
| 10. Test | 10 min |
| 11. Verify | 5 min |
| 12. Commit | 2 min |
| **TOTAL** | **~60 min** |

---

## ✅ Success Checklist

After completing all phases:

- [ ] `shared/package.json` exists
- [ ] `shared/` has no React files
- [ ] `web/src/config/` has all config files
- [ ] `web/src/components/ui/` has all UI components
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] `npm run dev` works
- [ ] `npm run dev:back` works
- [ ] No `@shared/config/site` imports in backend
- [ ] All web routes work in browser
- [ ] Console has no errors

---

## 🎯 What You'll Have After

```
✅ Clean separation: Backend has NO React dependencies
✅ Industry standard: Matches Babel/Meta/Google patterns
✅ Scalable: Easy to add mobile/desktop apps later
✅ Type-safe: All imports properly typed
✅ Zero breaking changes: All functionality preserved
✅ Faster builds: Backend doesn't bundle React
```

**Ready to start? Begin with Phase 1!** 🚀