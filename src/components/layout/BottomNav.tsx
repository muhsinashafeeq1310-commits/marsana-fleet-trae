'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Menu,
  Bell
} from 'lucide-react'

export default function BottomNav({ 
  onMenuClick 
}: { 
  onMenuClick: () => void 
}) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', href: '/dashboard/hq', icon: LayoutDashboard },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Rentals', href: '/rentals', icon: Calendar },
    { name: 'Alerts', href: '/alerts', icon: Bell },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200 pb-safe lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
        
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-slate-400 hover:text-slate-600"
        >
          <Menu className="h-6 w-6" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>
    </div>
  )
}
