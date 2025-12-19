import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Sidebar from '../components/user/Sidebar'
import { Menu } from 'lucide-react'

interface UserSearch {
    role?: 'user' | 'manager'
}

export const Route = createFileRoute('/user')({
    validateSearch: (search: Record<string, unknown>): UserSearch => {
        return {
            role: (search.role as 'user' | 'manager') || 'user',
        }
    },
    component: UserLayout,
})

function UserLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const { role } = Route.useSearch()

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev)
    }

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev)
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#050505] text-white">
            {/* Sidebar */}
            <Sidebar
                isMobileOpen={isMobileMenuOpen}
                onMobileToggle={toggleMobileMenu}
                isCollapsed={isSidebarCollapsed}
                onCollapse={toggleSidebar}
                role={role as 'user' | 'manager'}
            />

            {/* Main Content */}
            <main
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}
            >
                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMobileMenu}
                    className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-card rounded-lg shadow-md hover:bg-accent transition-colors"
                    aria-label="Toggle menu"
                >
                    <Menu size={20} />
                </button>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="w-full p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
