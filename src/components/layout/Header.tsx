'use client'

import { LogOut, UserCircle } from 'lucide-react'

 
export default function Header() {
  // Dummy user data
  const user = {
    name: 'Super Admin',
    role: 'super_admin',
    email: 'admin@marsana.com'
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-x-4 bg-white/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-300">
      
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between items-center">
        {/* Page Title Placeholder or Breadcrumbs could go here */}
        <h1 className="text-lg font-semibold text-gray-900">Marsana Fleet</h1>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          
          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="flex items-center gap-x-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 ring-2 ring-white">
               <UserCircle className="h-6 w-6" />
            </div>
            <div className="hidden lg:block pr-2">
              <p className="text-sm font-semibold leading-none text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize mt-0.5">{user.role.replace('_', ' ')}</p>
            </div>
            <button 
              className="ml-2 p-1.5 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
