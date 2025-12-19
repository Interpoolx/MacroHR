import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import Sidebar from '../components/admin/AdminSidebar'
import { Menu } from 'lucide-react'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white">
      {/* Admin Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
        isCollapsed={isSidebarCollapsed}
        onCollapse={toggleSidebar}
      />

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}
      >
        {/* Mobile Menu Button - Glassmorphism */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 glass border border-white/10 rounded-2xl shadow-2xl hover:bg-white/5 transition-all"
          aria-label="Toggle menu"
        >
          <Menu size={20} className="text-primary" />
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
