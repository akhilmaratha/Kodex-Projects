import { ChevronDown, ChevronRight, LayoutDashboard } from 'lucide-react'
import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Avatar, AvatarFallback } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

function getInitialOpenMap(sidebarSections) {
  const map = {}
  sidebarSections.forEach((section, sectionIndex) => {
    section.categories.forEach((category) => {
      map[category.label] = sectionIndex < 2
    })
  })
  return map
}

function Sidebar({ sidebarSections }) {
  const location = useLocation()
  const [openCategories, setOpenCategories] = useState(() => getInitialOpenMap(sidebarSections))

  const activeCategory = useMemo(() => {
    for (const section of sidebarSections) {
      for (const category of section.categories) {
        const hasPath = category.subItems.some((subItem) => subItem.path === location.pathname)
        if (hasPath) {
          return category.label
        }
      }
    }
    return null
  }, [location.pathname, sidebarSections])

  const toggleCategory = (categoryLabel) => {
    setOpenCategories((previous) => ({
      ...previous,
      [categoryLabel]: !previous[categoryLabel]
    }))
  }

  return (
    <aside className="hidden w-72 flex-col bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))] lg:flex">
      <div className="px-6 py-5">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <LayoutDashboard className="h-5 w-5" />
          AdminKit
          <Badge variant="secondary" className="rounded bg-white/10 text-[10px] uppercase tracking-wide text-white">
            Pro
          </Badge>
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-white">Charles Hall</p>
            <p className="text-xs text-slate-300">Designer</p>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{section.title}</p>
            <div className="space-y-1">
              {section.categories.map((category) => {
                const isOpen = category.label === activeCategory || Boolean(openCategories[category.label])

                return (
                  <div key={category.label} className="rounded-md bg-white/[0.02]">
                    <button
                      onClick={() => toggleCategory(category.label)}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        {category.label}
                      </span>
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    {isOpen && (
                      <div className="space-y-1 pb-2 pl-3 pr-2">
                        {category.subItems.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive }) =>
                              `flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                                isActive
                                  ? 'bg-[hsl(var(--sidebar-primary))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                              }`
                            }
                          >
                            <span>
                              <span className="mr-2 text-slate-500">→</span>
                              {subItem.label}
                            </span>
                            {subItem.pro && (
                              <Badge variant="secondary" className="h-5 rounded bg-blue-500/90 px-1.5 text-[10px] uppercase tracking-wide text-white">
                                Pro
                              </Badge>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
