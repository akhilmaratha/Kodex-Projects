import { Outlet } from 'react-router-dom'

import { navMenus, sidebarSections } from '../../config/navigation'
import Navbar from './navbar'
import Sidebar from './sidebar'

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]">
      <div className="flex min-h-screen">
        <Sidebar sidebarSections={sidebarSections} />

        <main className="flex-1">
          <Navbar navMenus={navMenus} />
          <div className="space-y-6 px-6 py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
