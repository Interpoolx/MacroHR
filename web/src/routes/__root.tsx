import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import ErrorBoundary from '../components/ErrorBoundary'
import { Toaster } from 'sonner'

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <ErrorBoundary>
            <Outlet />
            <Toaster position="top-right" />
            {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
        </ErrorBoundary>
    )
}
