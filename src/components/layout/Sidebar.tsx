'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Store,
  Car,
  ArrowRightLeft,
  ClipboardCheck,
  Calendar,
  Building2,
  Bell,
  User,
  X,
  Wrench,
  Settings,
  LogOut,
  Users
} from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { signOut } from '@/lib/actions'
import ConfirmModal from '@/components/common/ConfirmModal'
import { supabase } from '@/lib/supabase'

const getNavigation = (role?: string) => {
  const baseItems = [
    { name: 'Dashboard (HQ)', href: '/dashboard/hq', icon: LayoutDashboard, roles: ['super_admin', 'hq'] },
    { name: 'Dashboard (Branch)', href: '/dashboard/branch', icon: Store, roles: ['super_admin', 'hq', 'branch_admin'] },
    { name: 'Vehicles', href: '/vehicles', icon: Car, roles: ['super_admin', 'hq', 'branch_admin'] },
    { name: 'Handshakes', href: '/handshakes', icon: ArrowRightLeft, roles: ['super_admin', 'hq', 'branch_admin', 'driver'] },
    { name: 'Inspections', href: '/inspections', icon: ClipboardCheck, roles: ['super_admin', 'hq', 'branch_admin', 'driver'] },
    { name: 'Maintenance', href: '/maintenance', icon: Wrench, roles: ['super_admin', 'hq', 'branch_admin', 'tech'] },
    { name: 'Rentals', href: '/rentals', icon: Calendar, roles: ['super_admin', 'hq', 'branch_admin'] },
    { name: 'Corporates', href: '/corporates', icon: Building2, roles: ['super_admin', 'hq', 'corporate_admin'] },
    { name: 'Manage Team', href: '/dashboard/hq/users', icon: Users, roles: ['super_admin', 'hq'] },
    { name: 'Alerts', href: '/alerts', icon: Bell, roles: ['super_admin', 'hq', 'branch_admin'] },
    { name: 'Driver Portal', href: '/driver', icon: User, roles: ['super_admin', 'hq', 'driver'] },
  ]

  return baseItems.filter(item => !role || item.roles.includes(role))
}

export default function Sidebar({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [user, setUser] = useState<{ email?: string; full_name?: string; role?: string } | null>(null)

  useEffect(() => {
    async function getUser() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        // Get role from public users table
        const { data: userData } = await supabase.from('users').select('role').eq('id', authUser.id).single()

        setUser({
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || 'System User',
          role: userData?.role
        })
      }
    }
    getUser()
  }, [])

  const navigation = getNavigation(user?.role)

  const handleLogout = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  // Close sidebar on route change (mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Init

    return () => window.removeEventListener('resize', handleResize)
  }, [setIsOpen])

  return (
    <>
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to log out of your account? You will need to sign in again to access the portal."
        confirmText="Log Out"
        variant="danger"
        isLoading={isPending}
      />

      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#1a1a1a] text-white transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          "lg:static lg:inset-auto lg:flex lg:flex-col",
          "shadow-2xl lg:shadow-none border-r border-white/5",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Marsana</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <nav className="space-y-1.5">
            {navigation.map((item: any) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur-md"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-white" : "text-gray-500 group-hover:text-white"
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/5 space-y-1">
          <button className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </button>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log Out
          </button>

          <div className="mt-4 flex items-center px-4 pt-4 border-t border-white/5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-600 to-gray-400 border border-white/10 shadow-inner flex items-center justify-center text-xs font-bold text-white">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.full_name || 'Loading...'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'Please wait'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

