'use client'

import { StatusChip } from '@/components/common/StatusChip'
import { Mail, Phone, MapPin, MoreVertical, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

interface User {
    id: string
    full_name: string
    email: string
    role: string
    phone?: string | null
    branch_name?: string | null
}

export default function UserList({ users }: { users: User[] }) {
    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No team members yet</h3>
                <p className="text-sm text-gray-500 mt-2">Start by creating your first staff member.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
                <div
                    key={user.id}
                    className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300 p-6 flex flex-col"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-[#1a1a1a] flex items-center justify-center text-white font-black text-lg shadow-lg">
                                {user.full_name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 line-clamp-1">{user.full_name}</h3>
                                <StatusChip status={user.role} />
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-900 transition-colors">
                            <MoreVertical className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                <Mail className="h-4 w-4" />
                            </div>
                            <span className="truncate">{user.email}</span>
                        </div>

                        {user.phone && (
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <span>{user.phone}</span>
                            </div>
                        )}

                        {user.branch_name && (
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-[#1a1a1a]">{user.branch_name} Branch</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Employee ID: {user.id.split('-')[0]}
                        </span>
                        <button className="text-xs font-bold text-[#1a1a1a] hover:underline">
                            Edit Profile
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
