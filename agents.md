# AGENTS-GENERIC.md - Universal React Development Standards

⚠️ **IMPORTANT**: This document contains universal React development standards applicable to any project.

Config driven architecture is a design pattern that allows for the separation of concerns between the configuration and the application logic. It is a way to make the application more maintainable and easier to scale.



## ARCHITECTURE PATTERNS (MANDATORY)

### Configuration-Driven Programming
**ALL features MUST be configuration-driven**. Define settings upfront, never hardcode:

```typescript
// ✅ CORRECT: Configuration-driven
const FEATURE_CONFIG = {
  mode: import.meta.env.VITE_API_KEY ? 'production' : 'demo',
  apiProvider: 'huggingface' as const,
  features: {
    exportToCsv: true,
    realTimeValidation: false,
    batchProcessing: true
  },
  performance: {
    debounceMs: 300,
    retryAttempts: 3,
    cacheTime: 1000 * 60 * 5
  }
} as const;

// ❌ FORBIDDEN: Hardcoded values
const apiKey = "sk-1234567890"; // NEVER!
```

### File Organization (STRICT)
```
src/
├── components/         # ALL UI components
│   ├── common/        # Shared layout components
│   ├── layout/        # Layout system only
│   ├── playground/    # Demo/showcase components
│   ├── seo/         # SEO-specific components
│   └── ui/          # Radix UI components ONLY
├── routes/          # File-based routing ONLY
├── hooks/           # Custom hooks (prefixed with 'use')
├── lib/             # Utilities and pure functions
├── types/           # TypeScript definitions ONLY
└── constants/       # Configuration constants
```

### Component Architecture Rules
- **ALL components MUST be React.FC** with proper TypeScript typing
- **Use composition over inheritance** - NO HOCs, render props, or complex abstractions
- **Prefer flat hierarchies** - Maximum 2 levels deep inside features
- **Explicit props only** - NO prop spreading, NO default props destructuring
- **Single responsibility** - Each component has ONE clear purpose

### TypeScript Rules (STRICT)
- **Enable ALL strict flags**: `strictNullChecks`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- **NEVER use `any`** - Use `unknown` + Zod validation
- **NO `@ts-ignore`** without detailed justification comment
- **Branded types for invariants**: `type ValidEmail = string & { __brand: 'ValidEmail' }`
- **Discriminated unions for states**: `{ status: 'loading' } | { status: 'success'; data: T }`

---

## CODE QUALITY STANDARDS

### Component Structure Pattern (REQUIRED)
```typescript
// ✅ MANDATORY PATTERN for ALL components
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@shared/lib/utils';

interface ComponentNameProps {
  // Define props explicitly
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  className,
  children
}) => {
  // State at the top
  const [state, setState] = useState<TYPE>();

  // Effects after state
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers before render
  const handleClick = () => {
    // Handler logic
  };

  // Render at the bottom
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("default-classes", className)}
    >
      {/* JSX content */}
    </motion.div>
  );
};
```

### Error Handling Standards
```typescript
// ✅ REQUIRED: Custom error classes
export class ApiError extends Error {
  public status: number;
  public details?: unknown;
  
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'ApiError';
  }
}

// ✅ REQUIRED: Error boundaries for ALL features
const FeatureErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary
    fallback={<FeatureError />}
    onError={(error) => logger.error({ error }, 'Feature failed')}
  >
    {children}
  </ErrorBoundary>
);
```

### Utility Function Patterns
```typescript
// ✅ REQUIRED: Pure utility functions with JSDoc
/**
 * Merge Tailwind CSS classes with proper conflict resolution
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Debounce function for expensive operations
 * @param func - Function to debounce
 * @param wait - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  // Implementation
}
```

### Custom Hook Patterns
```typescript
// ✅ REQUIRED: Custom hooks with proper typing and error handling
export function useApiQuery<T>(
  queryKey: string[],
  url: string,
  options?: QueryOptions
) {
  const result = useQuery({
    queryKey,
    queryFn: () => apiFetch<T>(url),
    staleTime: QUERY_CONFIG.cache.medium.staleTime,
    retry: QUERY_CONFIG.retry.default.attempts,
    ...options,
  });

  // Error handling
  if (result.error) {
    logger.error({ error: result.error, queryKey }, 'Query failed');
  }

  return result;
}
```


### Data Fetching Patterns
```typescript
// ✅ REQUIRED: TanStack Query with configuration
const queryConfig = {
  cache: {
    instant: { staleTime: 0, gcTime: 1000 * 60 * 5 },
    short: { staleTime: 1000 * 60, gcTime: 1000 * 60 * 5 },
    medium: { staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 10 },
    long: { staleTime: 1000 * 60 * 60, gcTime: 1000 * 60 * 60 },
  }
} as const;

// Usage
const { data, error, isLoading } = useApiQuery(
  ['users', userId],
  `/api/users/${userId}`,
  { cacheStrategy: 'medium' }
);
```

---

## UNIVERSAL SECURITY PRINCIPLES

### Web Security Fundamentals

- **HTTPS ALWAYS**: All production applications MUST use HTTPS
- **Content Security Policy**: Implement strict CSP headers
- **Input Validation**: Validate ALL user inputs at boundaries
- **Output Encoding**: Escape all dynamic content to prevent XSS
- **Authentication**: Use proper auth mechanisms, never implement your own crypto
- **Session Management**: Secure cookie settings (HttpOnly, Secure, SameSite)

### React-Specific Security Patterns

- **Sanitize dangerouslySetInnerHTML**: ALWAYS sanitize HTML content
- **React Server Components Security**: Check for CVEs and latest patches
- **Props Validation**: Use PropTypes or TypeScript for all components
- **State Security**: Never store sensitive data in component state or localStorage
- **API Key Management**: Never expose server-side secrets to client
- **Dependency Security**: Regular audits with `npm audit` or similar

### Input Validation Frameworks

- **Zod Schema Validation**: Use Zod for runtime type checking
- **Form Validation**: Implement client-side AND server-side validation
- **File Upload Security**: Validate file types, sizes, and scan content
- **URL Validation**: Whitelist allowed URLs and protocols
- **SQL Injection Prevention**: Use parameterized queries or ORMs
- **CSRF Protection**: Implement anti-CSRF tokens for state-changing requests

### XSS/CSRF Prevention

```typescript
// ✅ CORRECT: Safe content rendering
const SafeContent = ({ html }: { html: string }) => (
  <div>{DOMPurify.sanitize(html)}</div>
);

// ❌ FORBIDDEN: Dangerous HTML rendering
const DangerousContent = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);
```

---

## REACT ARCHITECTURE PATTERNS

### Component Design Principles

- **Single Responsibility**: Each component does ONE thing well
- **Composition over Inheritance**: Use composition, avoid HOCs
- **Props Interface**: Explicit prop definitions with TypeScript
- **Default Props**: Use default parameters, not defaultProps
- **Pure Functions**: Prefer pure functional components
- **State Locality**: Keep state as close to usage as possible

### State Management Options

```typescript
// Option 1: React Context + useReducer (Small to medium apps)
const AppContext = createContext();
const useAppState = () => useContext(AppContext);

// Option 2: Redux Toolkit (Large enterprise apps)
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Option 3: Zustand (Simple state management)
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Hook Patterns and Best Practices

- **Custom Hooks**: Extract reusable logic into custom hooks
- **Hook Dependencies**: Always include ALL dependencies in useEffect
- **Cleanup Functions**: Always return cleanup from useEffect
- **Memoization**: Use useMemo and useCallback appropriately
- **Hook Rules**: Follow rules of hooks strictly
- **Performance**: Avoid expensive operations in render phase

### Performance Optimization Patterns

```typescript
// ✅ CORRECT: Memoized expensive component
const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processedData = useMemo(() => expensiveTransform(data), [data]);
  return <div>{processedData}</div>;
});

// ✅ CORRECT: Stable function references
const useStableCallback = (callback: Function) => {
  return useCallback(callback, []);
};
```

---

## CODE QUALITY STANDARDS

### TypeScript Configuration Standards

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### ESLint/Prettier Setup

- **ESLint Rules**: Enable react-hooks, @typescript-eslint, and import plugins
- **Prettier Config**: Consistent formatting with semi, single quotes, trailing comma
- **Pre-commit Hooks**: Use husky + lint-staged for automatic formatting
- **IDE Integration**: Configure VSCode/IDE with consistent settings

### Code Review Guidelines

- **Function Length**: Functions should be under 20 lines
- **File Length**: Files should be under 300 lines
- **Cyclomatic Complexity**: Keep complexity under 10
- **Duplication**: DRY principle - eliminate duplicated code
- **Naming**: Use descriptive, consistent naming conventions
- **Comments**: Comment WHY, not WHAT - code should be self-documenting

### Documentation Standards

- **JSDoc Comments**: Document all public APIs and utilities
- **README Files**: Every package/module should have README
- **Component Documentation**: Document component props and usage examples
- **API Documentation**: Auto-generate from TypeScript definitions
- **Change Log**: Maintain CHANGELOG for all releases

---

## TESTING STRATEGIES

### Unit Testing with Jest/Vitest

```typescript
// ✅ CORRECT: Test behavior, not implementation
describe('UserComponent', () => {
  it('shows user name when loaded', async () => {
    render(<UserComponent userId="123" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Component Testing with React Testing Library

- **User Interactions**: Test from user perspective with fireEvent/userEvent
- **Accessibility Queries**: Use getByRole, getByLabelText first
- **Async Operations**: Use waitFor, findBy for async elements
- **Mock Data**: Use fixtures for consistent test data
- **No Implementation Details**: Don't test internal state or methods

### Integration Testing Patterns

- **API Integration**: Test component interactions with mocked APIs
- **Route Integration**: Test navigation and routing behavior
- **State Integration**: Test state management interactions
- **Form Integration**: Test complete form workflows
- **Error Integration**: Test error handling across components

### E2E Testing Frameworks

- **Cypress**: Most popular, good for complex apps
- **Playwright**: Cross-browser, faster execution
- **Testing Library**: Test library-style E2E testing
- **Visual Regression**: Use tools like Percy or Chromatic
- **Performance Testing**: Include performance metrics in E2E

---

## PERFORMANCE OPTIMIZATION

### React Performance Patterns

- **Virtual Scrolling**: Use for long lists (react-window, react-virtualized)
- **Code Splitting**: Lazy load components with React.lazy
- **Memoization**: Use React.memo, useMemo, useCallback strategically
- **State Colocation**: Keep state near where it's used
- **Render Optimization**: Avoid unnecessary re-renders
- **Bundle Analysis**: Regular bundle size analysis

### Bundle Optimization Techniques

```typescript
// ✅ CORRECT: Lazy loading
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Usage with Suspense
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### Memory Management

- **Cleanup Effects**: Always cleanup subscriptions, timers, event listeners
- **Avoid Memory Leaks**: Remove event listeners in useEffect cleanup
- **Large Objects**: Clear large objects from state when not needed
- **Image Optimization**: Use appropriate image sizes and formats
- **DevTools**: Use React DevTools Profiler for performance analysis

### Rendering Optimization

- **CSS Containment**: Use contain property for layout optimization
- **Will-change**: Use sparingly for animation optimization
- **Throttling**: Throttle expensive scroll/resize handlers
- **Debouncing**: Debounce search input and API calls
- **RequestAnimationFrame**: Use for animations instead of setTimeout

---

## DEVELOPMENT WORKFLOWS

### Git Workflow Patterns

```bash
# ✅ RECOMMENDED: Feature branch workflow
git checkout -b feature/user-authentication
git commit -m "feat: add user authentication"
git push origin feature/user-authentication
# Create pull request with proper template
```

### CI/CD Pipeline Setup

- **Build Stage**: TypeScript compilation, bundle creation
- **Test Stage**: Unit tests, integration tests, E2E tests
- **Quality Stage**: Linting, security audit, bundle analysis
- **Deploy Stage**: Automated deployment to staging/production
- **Rollback**: Automatic rollback on health check failures

### Code Review Processes

- **PR Templates**: Use pull request templates
- **Required Reviewers**: Require minimum number of reviewers
- **Automated Checks**: Block merge if automated checks fail
- **Review Checklist**: Provide checklist for reviewers
- **Merge Strategy**: Use squashing or rebase merge

### Deployment Strategies

- **Feature Flags**: Use feature toggles for gradual rollout
- **Blue-Green Deployment**: Zero-downtime deployments
- **Canary Releases**: Release to small percentage of users first
- **A/B Testing**: Test changes on subset of users
- **Rollback Plans**: Always have rollback strategy ready

---

## QUALITY GATES AND VALIDATION

### Automated Testing Requirements

- **Unit Test Coverage**: Minimum 80% line and branch coverage
- **Component Tests**: All components must have tests
- **Integration Tests**: Critical user flows must be tested
- **TypeScript Compilation**: Zero TypeScript errors
- **ESLint Violations**: Zero high-priority violations

### Performance Budget Enforcement

```json
{
  "performanceBudget": {
    "javascript": "250kb",
    "css": "50kb",
    "images": "500kb",
    "fonts": "100kb"
  }
}
```

### Security Scanning

- **Dependency Scanning**: Weekly security audits
- **Code Scanning**: Static analysis for security issues
- **OWASP Top 10**: Check against OWASP security risks
- **Environment Security**: Secure all environment variables
- **API Security**: Validate all API endpoints

### Accessibility Compliance

- **WCAG 2.1 AA**: Minimum accessibility standard
- **Screen Reader Testing**: Test with NVDA, JAWS
- **Keyboard Navigation**: All functionality available via keyboard
- **Color Contrast**: Minimum 4.5:1 contrast ratio
- **Focus Management**: Proper focus indicators and management

### Bundle Quality Standards

- **Treeshaking**: Ensure unused code is eliminated
- **Compression**: Enable gzip/brotli compression
- **Caching**: Proper cache headers for all assets
- **CDN Distribution**: Use CDN for static assets
- **Image Optimization**: WebP, AVIF formats, responsive images

---

## TECHNOLOGY CHOICE GUIDELINES

### State Management Decision Tree

```
Small App (< 10 components) → useState + Context
Medium App (10-50 components) → Context + useReducer
Large App (50+ components) → Redux Toolkit or Zustand
Enterprise App → Redux Toolkit + RTK Query
```

### Testing Framework Selection

- **Unit Tests**: Jest or Vitest
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright (recommended) or Cypress
- **Visual Testing**: Chromatic or Percy
- **Performance Testing**: Lighthouse CI

### Build Tool Selection

- **Vite**: Recommended for new projects (faster, simpler)
- **Webpack**: For complex enterprise setups
- **Parcel**: For simple projects with zero config
- **Next.js**: For SSR/SSG requirements (check security)
- **Create React App**: For beginners (consider ejecting later)

### UI Framework Guidelines

- **CSS-in-JS**: Styled-components or Emotion
- **Utility-First**: Tailwind CSS (recommended)
- **Component Library**: Material-UI, Ant Design, or Chakra UI
- **Custom Design**: Build with design tokens and system
- **CSS Modules**: For component-scoped styles

---

## MONITORING AND OBSERVABILITY

### Error Tracking Setup

```typescript
// ✅ CORRECT: Error boundary with reporting
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Performance Monitoring

- **Core Web Vitals**: LCP, FID, CLS tracking
- **Bundle Size Monitoring**: Track bundle size changes
- **API Performance**: Monitor API response times
- **Render Performance**: Track component render times
- **User Experience**: Monitor rage clicks, dead clicks

### Analytics Integration

- **User Behavior**: Track user journeys and interactions
- **Performance Metrics**: Correlate performance with user behavior
- **Error Rates**: Track error rates by user segment
- **Feature Adoption**: Monitor feature usage
- **Business Metrics**: Track conversion and retention

---

## BEST PRACTICES CHECKLIST

### Before Committing Code

- [ ] TypeScript compilation passes with no errors
- [ ] All tests pass (unit, integration, E2E)
- [ ] ESLint shows zero violations
- [ ] Code follows project conventions
- [ ] Security audit passes (`npm audit`)
- [ ] Bundle size within limits
- [ ] Performance budgets met
- [ ] Accessibility tests pass
- [ ] Documentation updated if needed
- [ ] Feature flags properly configured

### Code Review Checklist

- [ ] Logic is correct and efficient
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Accessibility requirements met
- [ ] Testing is comprehensive
- [ ] Error handling is proper
- [ ] Code is maintainable and readable
- [ ] No hardcoded values or secrets
- [ ] Breaking changes documented
- [ ] Dependencies are necessary and secure

### Release Readiness Checklist

- [ ] All automated checks pass
- [ ] Manual testing completed
- [ ] Performance benchmarks met
- [ ] Security scan passed
- [ ] Documentation is up to date
- [ ] Rollback plan is ready
- [ ] Monitoring is configured
- [ ] Feature flags are set
- [ ] Database migrations tested
- [ ] Stakeholder approval obtained

---

**PRINCIPLES OVER RULES**: These guidelines are based on proven patterns, but principles are more important than strict rules. Always prioritize user experience, security, and maintainability.

**CONTINUOUS IMPROVEMENT**: Standards evolve with technology. Regular review and updates of these guidelines are essential for maintaining code quality.

**TEAM ALIGNMENT**: Ensure entire team understands and follows these standards. Regular training and code reviews help maintain consistency.
