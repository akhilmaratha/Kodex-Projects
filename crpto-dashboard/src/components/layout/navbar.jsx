import { Bell, LayoutDashboard, Search, Settings } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

function Navbar({ navMenus }) {
  const navigate = useNavigate()
  const [hoveredNav, setHoveredNav] = useState('')

  return (
    <header className="sticky top-0 z-10 border-b border-[hsl(var(--border))] bg-white/85 px-6 py-4 backdrop-blur-xl lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="lg:hidden">
            <LayoutDashboard className="h-4 w-4" />
          </Button>

          <div className="relative w-72 max-w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <Input className="pl-9" placeholder="Search..." />
          </div>

          <div className="hidden items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] md:flex">
            {navMenus.map((menu) => (
              <div
                key={menu.label}
                onMouseEnter={() => setHoveredNav(menu.label)}
                onMouseLeave={() => setHoveredNav('')}
                className="relative"
              >
                <button className="rounded-md px-3 py-2 transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]">
                  {menu.label}
                </button>
                {hoveredNav === menu.label && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-44 rounded-lg border bg-white p-2 shadow-xl">
                    {menu.items.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="block w-full rounded-md px-2 py-2 text-left text-sm text-[hsl(var(--muted-foreground))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            Invite a Friend
          </Button>
          <Button size="sm">New Project</Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">CH</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

export default Navbar
