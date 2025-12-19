import { ReactNode } from 'react'

interface AuthLayoutProps {
    children: ReactNode
    title: string
    subtitle?: ReactNode
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
            <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border border-border">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
                    {subtitle && <div className="text-muted-foreground text-sm">{subtitle}</div>}
                </div>
                {children}
            </div>
            <div className="mt-8 text-center text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Anything+. All rights reserved.
            </div>
        </div>
    )
}
